export type SentimentLabel = 'BULLISH' | 'NEUTRAL' | 'BEARISH'

export type EventType = 'EARNING' | 'DIVIDEND' | 'SPLIT' | 'OTHER'

export interface User {
  id: string
  email: string
  displayName: string
  bio: string
  joinedAt: string
  role: 'user' | 'moderator' | 'admin'
  reputation: number
  followedTickers: string[]
}

export interface Ticker {
  id: string
  symbol: string
  companyName: string
  exchange: string
  sector: string
  lastPrice: number
  priceChange24h: number
  priceChangePercent24h: number
  logoUrl?: string
  nextEvent?: Event
}

export interface Event {
  id: string
  tickerId: string
  ticker?: Ticker
  eventType: EventType
  eventDate: string
  description: string
  sentiment?: SentimentAnalysis
}

export interface Article {
  id: string
  tickerId: string
  url: string
  title: string
  snippet: string
  publisher: string
  publishedAt: string
  fetchedAt: string
  sentiment?: ArticleSentiment
  isEventRelated?: boolean
}

export interface SentimentAnalysis {
  id: string
  eventId: string
  computedAt: string
  aggregateLabel: SentimentLabel
  confidence: number
  summaryText: string
}

export interface ArticleSentiment {
  id: string
  articleId: string
  sentimentScore: number // -1 to +1
  modelVersion: string
  computedAt: string
}

export interface Thread {
  id: string
  scopeType: 'TICKER' | 'EVENT'
  scopeId: string
  title: string
  authorId: string
  author?: User
  createdAt: string
  postCount: number
  lastPostAt: string
}

export interface Post {
  id: string
  threadId: string
  parentPostId?: string
  authorId: string
  author?: User
  content: string
  createdAt: string
  editedAt?: string
  upvotes: number
  flags: number
  replies?: Post[]
}

export interface SentimentVote {
  id: string
  userId: string
  scopeType: 'TICKER' | 'EVENT'
  scopeId: string
  vote: SentimentLabel
  createdAt: string
}

export interface CommunitySentiment {
  bullish: number
  neutral: number
  bearish: number
  totalVotes: number
}

export interface WatchlistItem {
  userId: string
  tickerId: string
  ticker: Ticker
  addedAt: string
}

