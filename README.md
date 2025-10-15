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

### Local Development

#### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy env.example to .env and add your API keys (optional for demo)
# The app works with mock data if no API keys are provided
cp env.example .env

# Run the backend
python main.py
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Copy env.example to .env.local and update backend URL
cp env.example .env.local

# Run development server
npm run dev
```

### Production Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

**Quick Deploy:**
1. **Backend**: Deploy to [Render](https://render.com) or [Railway](https://railway.app)
2. **Frontend**: Deploy to [Vercel](https://vercel.com)
3. **Configure**: Set environment variables in both platforms

## API Endpoints
- `POST /add_ticker` - Add a stock to track
- `GET /fetch_news` - Get filtered news for tracked stocks
- `POST /analyze_event` - Analyze event impact
- `GET /events/past` - Get past events with analysis
- `GET /events/upcoming` - Get upcoming events

## Environment Variables

Copy the example files and configure your environment variables:

**Backend**
```bash
cd backend
cp env.example .env
# Edit .env with your API keys
```

**Frontend**
```bash
cd frontend
cp env.example .env.local
# Edit .env.local with your backend URL
```

### Required Variables

**Backend (.env)**
- `DATABASE_URL` - Database connection (default: SQLite)
- `NEWS_API_KEY` - NewsAPI.org key (optional)
- `FINNHUB_API_KEY` - Finnhub.io key (optional)
- `ALPHA_VANTAGE_KEY` - Alpha Vantage key (optional)
- `GEMINI_API_KEY` - Google Gemini key (optional)
- `ELEVENLABS_API_KEY` - ElevenLabs key (optional)

**Frontend (.env.local)**
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)
- `GEMINI_API_KEY` - Google Gemini key (optional)
- `GOOGLE_API_KEY` - Google API key (optional)
- `ELEVENLABS_API_KEY` - ElevenLabs key (optional)

> **Note**: The app works with mock data if no API keys are provided, perfect for demos!
