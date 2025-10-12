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

class PriceData(BaseModel):
    ticker: str
    current_price: float
    change_1d: float
    change_1w: float
    change_1m: float
    change_1d_percent: float
    change_1w_percent: float
    change_1m_percent: float

class ChartDataPoint(BaseModel):
    date: str
    price: float
    volume: int

class ChartData(BaseModel):
    ticker: str
    period: str
    data: List[ChartDataPoint]

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

@app.get("/price/{ticker}")
async def get_price_data(ticker: str) -> PriceData:
    """Get price data for 1 day, 1 week, and 1 month"""
    try:
        import yfinance as yf
        from datetime import datetime, timedelta
        import logging
        
        logging.info(f"Fetching price data for {ticker}")
        ticker_upper = ticker.upper()
        stock = yf.Ticker(ticker_upper)
        
        # Get current price - use a longer period to ensure we have data
        hist = stock.history(period="5d")
        if hist.empty:
            logging.error(f"No price data found for {ticker_upper}")
            raise HTTPException(status_code=404, detail=f"No price data found for {ticker_upper}")
        
        current_price = float(hist['Close'].iloc[-1])
        logging.info(f"Current price for {ticker_upper}: ${current_price}")
        
        # Get historical data for different periods
        now = datetime.now()
        
        # 1 day ago - get data from 2 days ago to ensure we have at least 1 day of data
        hist_1d = stock.history(start=now - timedelta(days=3), end=now)
        price_1d = float(hist_1d['Close'].iloc[0]) if len(hist_1d) > 1 else current_price
        
        # 1 week ago
        hist_1w = stock.history(start=now - timedelta(days=10), end=now)
        price_1w = float(hist_1w['Close'].iloc[0]) if len(hist_1w) > 5 else current_price
        
        # 1 month ago
        hist_1m = stock.history(start=now - timedelta(days=35), end=now)
        price_1m = float(hist_1m['Close'].iloc[0]) if len(hist_1m) > 20 else current_price
        
        # Calculate changes
        change_1d = current_price - price_1d
        change_1w = current_price - price_1w
        change_1m = current_price - price_1m
        
        change_1d_percent = (change_1d / price_1d) * 100 if price_1d > 0 else 0
        change_1w_percent = (change_1w / price_1w) * 100 if price_1w > 0 else 0
        change_1m_percent = (change_1m / price_1m) * 100 if price_1m > 0 else 0
        
        result = PriceData(
            ticker=ticker_upper,
            current_price=round(current_price, 2),
            change_1d=round(change_1d, 2),
            change_1w=round(change_1w, 2),
            change_1m=round(change_1m, 2),
            change_1d_percent=round(change_1d_percent, 2),
            change_1w_percent=round(change_1w_percent, 2),
            change_1m_percent=round(change_1m_percent, 2)
        )
        
        logging.info(f"Successfully fetched price data for {ticker_upper}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching price data for {ticker}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching price data: {str(e)}")

@app.get("/chart/{ticker}/{period}")
async def get_chart_data(ticker: str, period: str) -> ChartData:
    """Get historical chart data for 1 day, 1 week, or 1 month"""
    try:
        import yfinance as yf
        from datetime import datetime, timedelta
        import logging
        import pandas as pd
        
        logging.info(f"Fetching chart data for {ticker} - {period}")
        ticker_upper = ticker.upper()
        stock = yf.Ticker(ticker_upper)
        
        # Determine the date range based on period
        now = datetime.now()
        if period == "1d":
            start_date = now - timedelta(days=2)
            end_date = now
            interval = "1m"  # 1-minute intervals for intraday
        elif period == "1w":
            start_date = now - timedelta(days=7)
            end_date = now
            interval = "15m"  # 15-minute intervals for weekly
        elif period == "1m":
            start_date = now - timedelta(days=30)
            end_date = now
            interval = "1h"  # 1-hour intervals for monthly
        else:
            raise HTTPException(status_code=400, detail="Invalid period. Use '1d', '1w', or '1m'")
        
        # Fetch historical data
        hist = stock.history(start=start_date, end=end_date, interval=interval)
        
        if hist.empty:
            logging.error(f"No chart data found for {ticker_upper} - {period}")
            raise HTTPException(status_code=404, detail=f"No chart data found for {ticker_upper}")
        
        # Convert to chart data points
        chart_points = []
        for date, row in hist.iterrows():
            chart_points.append(ChartDataPoint(
                date=date.strftime("%Y-%m-%d %H:%M:%S"),
                price=round(float(row['Close']), 2),
                volume=int(row['Volume']) if not pd.isna(row['Volume']) else 0
            ))
        
        result = ChartData(
            ticker=ticker_upper,
            period=period,
            data=chart_points
        )
        
        logging.info(f"Successfully fetched {len(chart_points)} data points for {ticker_upper} - {period}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching chart data for {ticker} - {period}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching chart data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
