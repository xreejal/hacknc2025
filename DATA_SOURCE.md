# Data Source - Single JSON File

## 📍 Location

**All mock data is in ONE file:**
```
src/data/mockDatabase.json
```

## 📊 What's Inside

The JSON file contains all the data for the entire app:

```json
{
  "users": [...],              // User accounts
  "tickers": [...],            // Stock tickers (AAPL, TSLA, etc.)
  "events": [...],             // Earnings, dividends, splits
  "sentimentAnalysis": [...],  // AI sentiment for events
  "articles": [...],           // News articles
  "threads": [...],            // Forum discussions
  "posts": [...],              // Forum posts/replies
  "communitySentiment": [...], // Community voting data
  "watchlist": [...],          // User watchlists
  "marketOverview": {...},     // Market indices (S&P, NASDAQ, DOW)
  "trending": [...]            // Trending stocks
}
```

## ✏️ How to Edit Mock Data

1. **Open** `src/data/mockDatabase.json`
2. **Edit** the JSON (add/remove/modify)
3. **Save** the file
4. **Reload** the browser

Example - Add a new stock:

```json
{
  "tickers": [
    {
      "id": "5",
      "symbol": "NVDA",
      "companyName": "NVIDIA Corporation",
      "exchange": "NASDAQ",
      "sector": "Technology",
      "lastPrice": 450.25,
      "priceChange24h": 12.50,
      "priceChangePercent24h": 2.85
    }
  ]
}
```

## 🔄 How Data Flows

```
mockDatabase.json 
    ↓
src/lib/mockData.ts (enriches data with relations)
    ↓
Pages (DashboardPage, TickerPage, etc.)
    ↓
Components render UI
```

## 🎯 When Adding Your Backend

**Replace these lines in pages:**

### Before (using mock):
```typescript
import { getTickerBySymbol } from '@/lib/mockData'
const ticker = getTickerBySymbol(symbol)
```

### After (using real API):
```typescript
const response = await fetch(`/api/tickers/${symbol}`)
const ticker = await response.json()
```

## 📝 Data Structure Reference

### Users
```typescript
{
  id: string
  email: string
  displayName: string
  bio: string
  joinedAt: string (ISO date)
  role: "user" | "moderator" | "admin"
  reputation: number
  followedTickers: string[] (ticker IDs)
}
```

### Tickers
```typescript
{
  id: string
  symbol: string (e.g., "AAPL")
  companyName: string
  exchange: string (e.g., "NASDAQ")
  sector: string
  lastPrice: number
  priceChange24h: number
  priceChangePercent24h: number
}
```

### Events
```typescript
{
  id: string
  tickerId: string
  eventType: "EARNING" | "DIVIDEND" | "SPLIT" | "OTHER"
  eventDate: string (YYYY-MM-DD)
  description: string
}
```

### Articles
```typescript
{
  id: string
  tickerId: string
  url: string
  title: string
  snippet: string
  publisher: string
  publishedAt: string (ISO date)
  fetchedAt: string (ISO date)
  sentimentScore: number (-1 to +1)
  isEventRelated: boolean
}
```

### Threads
```typescript
{
  id: string
  scopeType: "TICKER" | "EVENT"
  scopeId: string (ticker or event ID)
  title: string
  authorId: string
  createdAt: string (ISO date)
  postCount: number
  lastPostAt: string (ISO date)
}
```

### Posts
```typescript
{
  id: string
  threadId: string
  authorId: string
  content: string
  createdAt: string (ISO date)
  upvotes: number
  flags: number
}
```

## 🚀 Quick Tips

1. **Keep IDs unique** - Use simple strings like "1", "2", "t1", "e1"
2. **Use ISO dates** - Format: "2025-10-11T10:00:00Z"
3. **Reference IDs correctly** - tickerId, authorId, etc. must match existing IDs
4. **Test after editing** - Reload the app to see changes

## 🛠️ Helper Functions Available

In `src/lib/mockData.ts`:

- `searchTickers(query)` - Search stocks by symbol/name
- `getTickerBySymbol(symbol)` - Get ticker by symbol
- `getEventById(eventId)` - Get event by ID
- `getThreadById(threadId)` - Get thread with posts
- `getCommunitySentiment(type, id)` - Get sentiment data

## 📦 When You're Ready for Real Data

1. Build your backend with PostgreSQL
2. Implement REST APIs (see `src/lib/api.ts`)
3. Replace mock data calls in pages
4. Keep `mockDatabase.json` for testing/development

---

**Everything runs from one JSON file!** Easy to modify, easy to understand.

