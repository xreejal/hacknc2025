import axios from 'axios'
import type { Ticker, Event, Article, Thread, Post, User, WatchlistItem, CommunitySentiment } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Authentication
export const authAPI = {
  register: async (email: string, password: string, displayName: string) => {
    const { data } = await api.post('/auth/register', { email, password, displayName })
    return data
  },
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
    }
    return data
  },
  logout: async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('auth_token')
  },
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/auth/me')
    return data
  },
}

// Tickers
export const tickersAPI = {
  search: async (query: string): Promise<Ticker[]> => {
    const { data } = await api.get('/tickers', { params: { q: query } })
    return data
  },
  getBySymbol: async (symbol: string): Promise<Ticker> => {
    const { data } = await api.get(`/tickers/${symbol}`)
    return data
  },
  getEvents: async (symbol: string): Promise<Event[]> => {
    const { data } = await api.get(`/tickers/${symbol}/events`)
    return data
  },
  getNews: async (symbol: string): Promise<Article[]> => {
    const { data } = await api.get(`/tickers/${symbol}/news`)
    return data
  },
  getThreads: async (symbol: string): Promise<Thread[]> => {
    const { data } = await api.get(`/tickers/${symbol}/threads`)
    return data
  },
}

// Events
export const eventsAPI = {
  getById: async (eventId: string): Promise<Event> => {
    const { data } = await api.get(`/events/${eventId}`)
    return data
  },
  getNews: async (eventId: string): Promise<Article[]> => {
    const { data } = await api.get(`/events/${eventId}/news`)
    return data
  },
  getThreads: async (eventId: string): Promise<Thread[]> => {
    const { data } = await api.get(`/events/${eventId}/threads`)
    return data
  },
}

// Watchlist
export const watchlistAPI = {
  get: async (): Promise<WatchlistItem[]> => {
    const { data } = await api.get('/watchlist')
    return data
  },
  add: async (tickerId: string): Promise<WatchlistItem> => {
    const { data } = await api.post('/watchlist', { tickerId })
    return data
  },
  remove: async (tickerId: string): Promise<void> => {
    await api.delete(`/watchlist/${tickerId}`)
  },
}

// Threads & Posts
export const forumsAPI = {
  getThreads: async (scopeType: 'TICKER' | 'EVENT', scopeId: string): Promise<Thread[]> => {
    const { data } = await api.get('/threads', { params: { scopeType, scopeId } })
    return data
  },
  getThread: async (threadId: string): Promise<Thread & { posts: Post[] }> => {
    const { data } = await api.get(`/threads/${threadId}`)
    return data
  },
  createThread: async (scopeType: 'TICKER' | 'EVENT', scopeId: string, title: string, content: string) => {
    const { data } = await api.post('/threads', { scopeType, scopeId, title, content })
    return data
  },
  createPost: async (threadId: string, content: string, parentPostId?: string) => {
    const { data } = await api.post('/posts', { threadId, content, parentPostId })
    return data
  },
  upvotePost: async (postId: string) => {
    const { data } = await api.post(`/posts/${postId}/upvote`)
    return data
  },
  flagPost: async (postId: string, reason: string) => {
    const { data } = await api.post(`/posts/${postId}/flag`, { reason })
    return data
  },
}

// Sentiment
export const sentimentAPI = {
  vote: async (scopeType: 'TICKER' | 'EVENT', scopeId: string, vote: 'BULLISH' | 'NEUTRAL' | 'BEARISH') => {
    const { data } = await api.post('/sentiment-votes', { scopeType, scopeId, vote })
    return data
  },
  getAggregate: async (scopeType: 'TICKER' | 'EVENT', scopeId: string): Promise<CommunitySentiment> => {
    const { data } = await api.get(`/sentiment-votes/${scopeType}/${scopeId}`)
    return data
  },
}

// Dashboard
export const dashboardAPI = {
  getMarketOverview: async () => {
    const { data } = await api.get('/dashboard/market-overview')
    return data
  },
  getTrendingTickers: async (): Promise<Array<{ symbol: string; mentions: number }>> => {
    const { data } = await api.get('/dashboard/trending')
    return data
  },
  getPopularTickers: async (): Promise<Ticker[]> => {
    const { data } = await api.get('/dashboard/popular')
    return data
  },
}

export default api

