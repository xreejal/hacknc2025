from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

from app.news_service import NewsService
from app.event_analyzer import EventAnalyzer
from app.database import Database

load_dotenv()

app = FastAPI(title="StockLens API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon - in production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
news_service = NewsService(
    news_api_key=os.getenv("NEWS_API_KEY"),
    finnhub_api_key=os.getenv("FINNHUB_API_KEY")
)
event_analyzer = EventAnalyzer(alpha_vantage_key=os.getenv("ALPHA_VANTAGE_KEY"))
db = Database(os.getenv("DATABASE_URL"))

# Pydantic models
class AddTickerRequest(BaseModel):
    ticker: str

class FetchNewsRequest(BaseModel):
    tickers: List[str]

class AnalyzeEventRequest(BaseModel):
    ticker: str
    date: str

class NewsArticle(BaseModel):
    ticker: str
    title: str
    sentiment: str
    summary: str
    url: str
    published_at: str

class EventAnalysis(BaseModel):
    ticker: str
    event: str
    date: str
    car_0_1: float
    volatility_change: float
    sentiment: str
    conclusion: str

class UpcomingEvent(BaseModel):
    ticker: str
    type: str
    date: str
    expected_impact: str

@app.get("/")
async def root():
    return {"message": "StockLens API is running"}

@app.post("/add_ticker")
async def add_ticker(request: AddTickerRequest):
    """Add a stock ticker to track"""
    try:
        ticker = request.ticker.upper()
        # Validate ticker exists
        import yfinance as yf
        stock = yf.Ticker(ticker)
        info = stock.info

        if not info or 'symbol' not in info:
            raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found")

        # Store in database (simplified for hackathon)
        return {
            "ticker": ticker,
            "company_name": info.get("longName", ticker),
            "message": "Ticker added successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/fetch_news")
async def fetch_news(request: FetchNewsRequest) -> List[NewsArticle]:
    """Fetch filtered and analyzed news for tracked stocks"""
    try:
        articles = await news_service.fetch_news_for_tickers(request.tickers)
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze_event")
async def analyze_event(request: AnalyzeEventRequest) -> EventAnalysis:
    """Analyze the impact of a specific event"""
    try:
        event_date = datetime.fromisoformat(request.date)
        analysis = event_analyzer.analyze_event(request.ticker, event_date)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/events/past")
async def get_past_events(ticker: str) -> List[EventAnalysis]:
    """Get past events with their analysis"""
    try:
        events = event_analyzer.get_past_earnings_events(ticker)
        return events
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/events/upcoming")
async def get_upcoming_events(ticker: str) -> List[UpcomingEvent]:
    """Get upcoming events for a ticker"""
    try:
        events = event_analyzer.get_upcoming_events(ticker)
        return events
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
