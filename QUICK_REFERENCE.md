# Quick Reference Card

## 🎯 The One File That Matters

```
src/data/mockDatabase.json
```
**This is where ALL your data lives.** Edit this to change anything in the app.

## 🚀 Commands

```bash
npm run dev      # Start app → http://localhost:3000
npm run build    # Build for production
npm run preview  # Test production build
```

## 📝 Edit Data

1. Open `src/data/mockDatabase.json`
2. Change values
3. Save
4. Refresh browser

## 🔍 Find Backend Integration Points

Search for this comment in files:
```typescript
// Replace with API call:
```

## 📊 Data Structure

```json
{
  "tickers": [],         // Stocks (AAPL, TSLA, etc.)
  "events": [],          // Earnings, dividends
  "articles": [],        // News
  "threads": [],         // Forums
  "posts": [],           // Discussions
  "users": [],           // Accounts
  "watchlist": [],       // User watchlists
  "communitySentiment": [], // Voting data
  "marketOverview": {},  // Indices
  "trending": []         // Hot stocks
}
```

## 🎨 Key Files

| File | Purpose |
|------|---------|
| `src/data/mockDatabase.json` | ⭐ All data |
| `src/lib/mockData.ts` | Data loader |
| `src/lib/api.ts` | API client (for backend) |
| `src/pages/` | Main pages |
| `src/components/` | UI components |

## 🔗 API Endpoints Needed (When You Build Backend)

```
GET  /api/tickers/:symbol        Get stock data
GET  /api/events/:id             Get event details
GET  /api/threads/:id            Get discussion
POST /api/auth/login             User login
POST /api/watchlist              Add to watchlist
GET  /api/watchlist              Get watchlist
```

See `src/lib/api.ts` for complete list.

## 📱 Pages Available

- `/` - Landing page
- `/auth` - Login/signup
- `/dashboard` - Main dashboard
- `/ticker/AAPL` - Stock page
- `/event/e1` - Event page
- `/thread/t1` - Discussion
- `/profile` - User settings

## 💡 Quick Tips

1. **Change stock price?** Edit `tickers` in mockDatabase.json
2. **Add news article?** Add to `articles` array
3. **New discussion?** Add to `threads` and `posts`
4. **Want real data?** Build backend, replace mock calls

## ✅ Everything Works!

- ✅ UI is complete
- ✅ All pages functional
- ✅ Responsive design
- ✅ Ready for backend

## 📚 Docs

- `SUMMARY.txt` - Full overview
- `DATA_SOURCE.md` - Data editing guide  
- `README.md` - Project documentation

---

**You're all set!** 🎉

