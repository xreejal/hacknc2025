// Single source of truth for all mock data
// Replace this with real API calls when backend is ready
import mockDatabase from '@/data/mockDatabase.json'
import type { Ticker, Event, Article, Thread, WatchlistItem, CommunitySentiment, User } from '@/types'

// Helper to enrich data with relations
function getTickerById(id: string): Ticker | undefined {
  return mockDatabase.tickers.find(t => t.id === id) as Ticker | undefined
}

function getUserById(id: string): User | undefined {
  return mockDatabase.users.find(u => u.id === id) as User | undefined
}

function getSentimentForEvent(eventId: string) {
  return mockDatabase.sentimentAnalysis.find(s => s.eventId === eventId)
}

// Exported data with enrichment
export const mockTickers: Ticker[] = mockDatabase.tickers.map(ticker => {
  const nextEvent = mockDatabase.events.find(e => e.tickerId === ticker.id)
  return {
    ...ticker,
    nextEvent: nextEvent ? {
      ...nextEvent,
      sentiment: getSentimentForEvent(nextEvent.id)
    } : undefined
  } as Ticker
})

export const mockEvents: Event[] = mockDatabase.events.map(event => ({
  ...event,
  ticker: getTickerById(event.tickerId),
  sentiment: getSentimentForEvent(event.id)
})) as Event[]

export const mockArticles: Article[] = mockDatabase.articles.map(article => ({
  ...article,
  sentiment: article.sentimentScore !== undefined ? {
    id: `as-${article.id}`,
    articleId: article.id,
    sentimentScore: article.sentimentScore,
    modelVersion: 'v1.0',
    computedAt: article.fetchedAt
  } : undefined
})) as Article[]

export const mockThreads: Thread[] = mockDatabase.threads.map(thread => ({
  ...thread,
  author: getUserById(thread.authorId)
})) as Thread[]

export const mockPosts = mockDatabase.posts.map(post => ({
  ...post,
  author: getUserById(post.authorId),
  replies: []
}))

export const mockCommunitySentiment: CommunitySentiment = mockDatabase.communitySentiment[0] as CommunitySentiment

export const mockWatchlist: WatchlistItem[] = mockDatabase.watchlist.map(item => ({
  ...item,
  ticker: mockTickers.find(t => t.id === item.tickerId)!
})) as WatchlistItem[]

export const mockMarketOverview = mockDatabase.marketOverview

export const mockTrending = mockDatabase.trending

// For easy searching
export function searchTickers(query: string): Ticker[] {
  const q = query.toLowerCase()
  return mockTickers.filter(t => 
    t.symbol.toLowerCase().includes(q) || 
    t.companyName.toLowerCase().includes(q)
  )
}

export function getTickerBySymbol(symbol: string): Ticker | undefined {
  return mockTickers.find(t => t.symbol.toUpperCase() === symbol.toUpperCase())
}

export function getEventById(eventId: string): Event | undefined {
  return mockEvents.find(e => e.id === eventId)
}

export function getThreadById(threadId: string) {
  const thread = mockThreads.find(t => t.id === threadId)
  if (!thread) return undefined
  
  return {
    ...thread,
    posts: mockPosts.filter(p => p.threadId === threadId)
  }
}

export function getCommunitySentiment(scopeType: string, scopeId: string): CommunitySentiment {
  const sentiment = mockDatabase.communitySentiment.find(
    s => s.scopeType === scopeType && s.scopeId === scopeId
  )
  return sentiment || { bullish: 0, neutral: 0, bearish: 0, totalVotes: 0 }
}
