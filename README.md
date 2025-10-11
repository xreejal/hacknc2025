# Finance Web App - Community-Driven Stock Analytics

A modern, responsive finance web app for tracking stocks, analyzing sentiment, and engaging in community discussions.

## 🎯 Current Status

✅ **Frontend Complete** - Fully functional UI with mock data  
⏳ **Backend Ready** - API integration points ready for your backend

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/               # Header, Sidebar, RightPanel
│   ├── SentimentBadge.tsx
│   ├── TickerCard.tsx
│   ├── ArticleCard.tsx
│   ├── ThreadItem.tsx
│   └── CommunitySentimentBar.tsx
├── pages/
│   ├── LandingPage.tsx       # Marketing page
│   ├── AuthPage.tsx          # Sign up / Login
│   ├── DashboardPage.tsx     # Main dashboard
│   ├── TickerPage.tsx        # Individual stock pages
│   ├── EventPage.tsx         # Event details (earnings, dividends)
│   ├── ThreadPage.tsx        # Discussion threads
│   └── ProfilePage.tsx       # User settings
├── data/
│   └── mockDatabase.json     # 🎯 SINGLE JSON FILE - All mock data here
├── lib/
│   ├── api.ts               # API client ready for backend
│   ├── mockData.ts          # Mock data loader
│   └── utils.ts             # Helper functions
└── types/
    └── index.ts             # TypeScript types
```

## 📊 Mock Data

**All mock data is in ONE file:** `src/data/mockDatabase.json`

This file contains:
- Users
- Tickers (stocks)
- Events (earnings, dividends)
- Articles (news)
- Threads & Posts (forums)
- Community sentiment
- Watchlist
- Market overview
- Trending tickers

### To modify data:
1. Edit `src/data/mockDatabase.json`
2. Save and reload the app

## 🔌 Backend Integration

The app is **ready for your backend**. Look for these comments in the code:

```typescript
// Replace with API call: await fetch(`/api/tickers/${symbol}`)
```

### API Endpoints Expected:

```
Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

Tickers
GET    /api/tickers?q=AAPL
GET    /api/tickers/:symbol
GET    /api/tickers/:symbol/events
GET    /api/tickers/:symbol/news

Events
GET    /api/events/:id
GET    /api/events/:id/news
GET    /api/events/:id/threads

Watchlist
GET    /api/watchlist
POST   /api/watchlist
DELETE /api/watchlist/:tickerId

Forums
GET    /api/threads?scopeType=TICKER&scopeId=1
GET    /api/threads/:id
POST   /api/threads
POST   /api/posts
POST   /api/posts/:id/upvote

Sentiment
POST   /api/sentiment-votes
GET    /api/sentiment-votes/:scopeType/:scopeId
```

See `src/lib/api.ts` for complete API client implementation.

## 🎨 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query (React Query)
- Lucide Icons

**Backend (Your implementation):**
- Node.js + Express (recommended)
- PostgreSQL (database)
- Redis (caching)
- External APIs:
  - Polygon.io (stock data)
  - NewsAPI (news)
  - OpenAI (AI sentiment)

## 🏗️ Database Schema (for your backend)

```sql
-- Core tables you'll need:
CREATE TABLE users (...)
CREATE TABLE tickers (...)
CREATE TABLE events (...)
CREATE TABLE articles (...)
CREATE TABLE sentiment_analysis (...)
CREATE TABLE threads (...)
CREATE TABLE posts (...)
CREATE TABLE sentiment_votes (...)
CREATE TABLE watchlist (...)
```

Full schema available in the original README or generated from `mockDatabase.json` structure.

## 📱 Features

### Implemented:
✅ Landing page with feature showcase  
✅ User authentication UI  
✅ Dashboard with market overview  
✅ Ticker pages with price, events, news, forums  
✅ Event pages with AI sentiment  
✅ Community sentiment voting UI  
✅ Discussion forums (threaded)  
✅ User profiles & settings  
✅ Responsive design (mobile/tablet/desktop)  
✅ Beautiful UI with Tailwind CSS  

### Ready for Backend:
⏳ Real stock prices  
⏳ Live news feeds  
⏳ AI sentiment analysis  
⏳ User authentication  
⏳ Database persistence  
⏳ Real-time updates (WebSocket)  

## 🛠️ Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔧 Configuration

Edit `vite.config.ts` to configure proxy for your backend:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000', // Your backend URL
      changeOrigin: true,
    },
  },
},
```

## 📝 Adding Your Backend

1. **Create your backend** (Node.js/Express/PostgreSQL)
2. **Implement API endpoints** (see API section above)
3. **Update API base URL** in `src/lib/api.ts`
4. **Replace mock data calls** with real API calls in pages
5. **Test integration**

Example replacement:

```typescript
// Before (mock):
const ticker = getTickerBySymbol(symbol)

// After (real API):
const response = await fetch(`/api/tickers/${symbol}`)
const ticker = await response.json()
```

## 🎯 Features Breakdown

### Core Components:
- **TickerCard** - Stock card with price, change %, next event
- **SentimentBadge** - Bullish/Bearish/Neutral indicator
- **ArticleCard** - News article with sentiment
- **ThreadItem** - Forum thread preview
- **CommunitySentimentBar** - Visual sentiment breakdown

### Pages:
- **Landing** - Marketing/feature showcase
- **Auth** - Login/signup forms
- **Dashboard** - Watchlist + market overview + upcoming events
- **Ticker** - Stock details with tabs (Events/News/Discussions)
- **Event** - Event details with AI sentiment + news + forum
- **Thread** - Full discussion with replies
- **Profile** - User settings & preferences

## 📄 License

MIT

## 🚀 Deployment

**Frontend:**
- Vercel (recommended)
- Netlify
- GitHub Pages

**Backend:**
- Railway
- Heroku
- AWS/GCP/Azure

## 💡 Notes

- All data is currently mock/fake from `mockDatabase.json`
- UI is fully functional and production-ready
- Backend integration requires implementing REST APIs
- External APIs needed: Polygon.io, NewsAPI, OpenAI (for production)

---

**Ready to add your backend!** All integration points are marked in the code.
