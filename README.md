# MoneyMoves

A smart, personalized financial event tracker and news analyzer for hackathon projects.

## Overview
StockLens helps users track how past and upcoming events (earnings, Fed meetings, product launches) affect stock prices while filtering out market noise.

## Features
- Personalized news feed with sentiment analysis
- Past event impact analysis (CAR, volatility)
- Upcoming event calendar
- Visual dashboard with sparkline charts

## Tech Stack
- **Frontend**: Next.js + React + Tailwind CSS
- **Backend**: Python (FastAPI)
- **Database**: PostgreSQL
- **APIs**: NewsAPI, Yahoo Finance, AlphaVantage

## Project Structure
```
├── frontend/          # Next.js application
├── backend/           # FastAPI backend
│   ├── app/          # API routes
│   ├── models/       # Database models
│   └── utils/        # Helper functions
└── database/         # SQL schemas
```

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints
- `POST /add_ticker` - Add a stock to track
- `GET /fetch_news` - Get filtered news for tracked stocks
- `POST /analyze_event` - Analyze event impact
- `GET /events/past` - Get past events with analysis
- `GET /events/upcoming` - Get upcoming events

## Environment Variables
Create `.env` files in both frontend and backend:

**Backend (.env)**
```
DATABASE_URL=postgresql://user:pass@localhost/MoneyMoves
NEWS_API_KEY=your_key
ALPHA_VANTAGE_KEY=your_key
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
