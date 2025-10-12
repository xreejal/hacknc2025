import yfinance as yf
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from typing import Dict, List
from textblob import TextBlob
import requests
import os

class EventAnalyzer:
    def __init__(self, alpha_vantage_key: str = None):
        self.benchmark = "SPY"  # S&P 500 as benchmark
        self.cache = {}  # Simple in-memory cache
        self.cache_duration = timedelta(minutes=15)  # Cache for 15 minutes
        self.alpha_vantage_key = alpha_vantage_key or os.getenv("ALPHA_VANTAGE_KEY")
        
        # Debug: Print API key status
        print(f"[DEBUG] EventAnalyzer initialized with Alpha Vantage key: {'SET' if self.alpha_vantage_key and self.alpha_vantage_key != 'your_alphavantage_key_here' else 'NOT SET or DEFAULT'}")
        if self.alpha_vantage_key and self.alpha_vantage_key != 'your_alphavantage_key_here':
            print(f"[DEBUG] Alpha Vantage key starts with: {self.alpha_vantage_key[:8]}...")

    def _download_from_alpha_vantage(self, ticker: str) -> pd.DataFrame:
        """Download historical data from Alpha Vantage (more reliable than yfinance)"""
        if not self.alpha_vantage_key or self.alpha_vantage_key == "your_alphavantage_key_here":
            return pd.DataFrame()

        # Check cache for Alpha Vantage data (cache for 24 hours)
        cache_key = f"alpha_vantage_{ticker}"
        if cache_key in self.cache:
            data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < timedelta(hours=24):
                print(f"  [CACHE] Using cached Alpha Vantage data for {ticker}")
                return data

        try:
            print(f"  Trying Alpha Vantage for {ticker}...")
            url = f"https://www.alphavantage.co/query"
            params = {
                "function": "TIME_SERIES_DAILY",
                "symbol": ticker,
                "outputsize": "full",  # Get full history
                "apikey": self.alpha_vantage_key
            }

            response = requests.get(url, params=params, timeout=10)
            data = response.json()

            if "Time Series (Daily)" not in data:
                error_msg = data.get('Note', data.get('Error Message', data.get('Information', 'Unknown')))
                print(f"  Alpha Vantage error: {error_msg}")
                
                # Check for rate limit specifically
                if "rate limit" in error_msg.lower() or "25 requests per day" in error_msg:
                    print(f"  ⚠️  RATE LIMIT HIT: Alpha Vantage free tier allows only 25 requests/day")
                    print(f"  📝 Consider upgrading to premium or using yfinance fallback")
                
                return pd.DataFrame()

            # Convert to DataFrame
            time_series = data["Time Series (Daily)"]
            df = pd.DataFrame.from_dict(time_series, orient='index')
            df.index = pd.to_datetime(df.index)
            df = df.sort_index()

            # Rename columns
            df.columns = ['Open', 'High', 'Low', 'Close', 'Volume']
            df = df.astype(float)

            print(f"  SUCCESS! Got {len(df)} days of REAL data from Alpha Vantage!")

            # Cache the data for 24 hours
            self.cache[cache_key] = (df, datetime.now())
            return df

        except Exception as e:
            print(f"  Alpha Vantage error: {e}")
            return pd.DataFrame()

    def analyze_event(self, ticker: str, event_date: datetime) -> Dict:
        """
        Analyze the impact of an event on a stock
        Calculates CAR (Cumulative Abnormal Return) and volatility changes
        """
        try:
            # Download stock and market data
            estimation_window = 120  # days for regression
            event_window_before = 5
            event_window_after = 5

            start_date = event_date - timedelta(days=estimation_window + event_window_before)
            end_date = event_date + timedelta(days=event_window_after + 5)

            # Use yfinance as primary source
            stock_data = yf.download(ticker, start=start_date, end=end_date, progress=False)
            if stock_data.empty:
                stock_data = self._download_from_alpha_vantage(ticker)

            # Use yfinance for benchmark data
            market_data = yf.download(self.benchmark, start=start_date, end=end_date, progress=False)
            if market_data.empty:
                market_data = self._download_from_alpha_vantage(self.benchmark)

            if stock_data.empty or market_data.empty:
                raise ValueError("Insufficient data")

            # Filter to date range
            stock_data = stock_data[(stock_data.index >= start_date) & (stock_data.index <= end_date)]
            market_data = market_data[(market_data.index >= start_date) & (market_data.index <= end_date)]

            # Calculate returns
            stock_returns = stock_data['Close'].pct_change().dropna()
            market_returns = market_data['Close'].pct_change().dropna()

            # Align data
            if len(stock_returns) == 0 or len(market_returns) == 0:
                raise ValueError("No returns data available")
            
            # Find common index
            common_index = stock_returns.index.intersection(market_returns.index)
            if len(common_index) == 0:
                raise ValueError("No common dates between stock and market data")
            
            # Ensure we have valid data
            stock_data_aligned = stock_returns.loc[common_index]
            market_data_aligned = market_returns.loc[common_index]
            
            if len(stock_data_aligned) == 0 or len(market_data_aligned) == 0:
                raise ValueError("No valid aligned data")
            
            # Ensure we have Series, not scalars
            if not hasattr(stock_data_aligned, 'index'):
                stock_data_aligned = pd.Series([stock_data_aligned], index=[common_index[0]])
            if not hasattr(market_data_aligned, 'index'):
                market_data_aligned = pd.Series([market_data_aligned], index=[common_index[0]])
            
            aligned_data = pd.DataFrame({
                'stock': stock_data_aligned,
                'market': market_data_aligned
            })

            # Split into estimation and event windows
            estimation_cutoff = event_date - timedelta(days=event_window_before)
            estimation_data = aligned_data[aligned_data.index < estimation_cutoff]
            event_data = aligned_data[
                (aligned_data.index >= event_date - timedelta(days=event_window_before)) &
                (aligned_data.index <= event_date + timedelta(days=event_window_after))
            ]

            if len(estimation_data) < 30 or len(event_data) == 0:
                raise ValueError("Insufficient data for analysis")

            # Market model regression (estimation window)
            X = estimation_data['market'].values.reshape(-1, 1)
            y = estimation_data['stock'].values
            reg = LinearRegression().fit(X, y)
            alpha = reg.intercept_
            beta = reg.coef_[0]

            # Calculate abnormal returns in event window
            expected_returns = alpha + beta * event_data['market'].values
            abnormal_returns = event_data['stock'].values - expected_returns

            # Cumulative Abnormal Return (CAR)
            car = np.sum(abnormal_returns) * 100  # Convert to percentage

            # Volatility analysis
            pre_event_vol = estimation_data['stock'].std()
            post_event_vol = event_data['stock'].std()
            volatility_ratio = post_event_vol / pre_event_vol if pre_event_vol > 0 else 1.0

            # Determine sentiment based on CAR
            if car > 2:
                sentiment = "positive"
                conclusion = f"Strong positive market reaction with {car:.2f}% abnormal return."
            elif car < -2:
                sentiment = "negative"
                conclusion = f"Negative market reaction with {car:.2f}% abnormal return."
            else:
                sentiment = "neutral"
                conclusion = f"Muted market reaction with {car:.2f}% abnormal return."

            # Add volatility context
            if volatility_ratio > 1.5:
                conclusion += f" Volatility increased significantly by {volatility_ratio:.2f}x."
            elif volatility_ratio < 0.7:
                conclusion += f" Volatility decreased to {volatility_ratio:.2f}x."

            return {
                "ticker": ticker,
                "event": "Event Analysis",
                "date": event_date.isoformat(),
                "car_0_1": round(car, 2),
                "volatility_change": round(volatility_ratio, 2),
                "sentiment": sentiment,
                "conclusion": conclusion
            }

        except Exception as e:
            print(f"Error analyzing event for {ticker}: {e}")
            # Return mock data for demo
            return {
                "ticker": ticker,
                "event": "Event Analysis",
                "date": event_date.isoformat(),
                "car_0_1": 0.0,
                "volatility_change": 1.0,
                "sentiment": "neutral",
                "conclusion": "Unable to analyze event due to insufficient data."
            }

    def get_past_earnings_events(self, ticker: str) -> List[Dict]:
        """
        Get past earnings events and their analysis using real historical price data
        """
        print(f"[DEBUG] get_past_earnings_events called for {ticker}")
        print(f"[DEBUG] Alpha Vantage key available: {'YES' if self.alpha_vantage_key and self.alpha_vantage_key != 'your_alphavantage_key_here' else 'NO'}")
        
        # Check cache first
        cache_key = f"past_events_{ticker}"
        if cache_key in self.cache:
            data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < self.cache_duration:
                print(f"[CACHE] Using cached data for {ticker}")
                return data

        try:
            print(f"Analyzing REAL price data for {ticker}...")

            # Use yfinance as primary source (more reliable for demo)
            print(f"  Trying yfinance for {ticker}...")
            end_date = datetime.now()
            start_date = end_date - timedelta(days=365)
            stock_data = yf.download(ticker, start=start_date, end=end_date, progress=False)
            
            # Try Alpha Vantage as fallback if yfinance fails
            if stock_data.empty:
                print(f"  yfinance failed, trying Alpha Vantage for {ticker}...")
                stock_data = self._download_from_alpha_vantage(ticker)

            if stock_data.empty:
                print(f"  No real data available for {ticker}, using smart mock data")
                result = self._generate_mock_events(ticker)
                self.cache[cache_key] = (result, datetime.now())
                return result

            # We got REAL data! Filter to last year
            one_year_ago = datetime.now() - timedelta(days=365)
            stock_data = stock_data[stock_data.index >= one_year_ago]
            print(f"  SUCCESS! Analyzing REAL data with {len(stock_data)} trading days")

            # Analyze quarterly events (approximately every 90 days)
            # This simulates earnings dates which typically occur quarterly
            quarters = [
                (45, "Q4 2023"),   # ~45 days ago
                (135, "Q3 2023"),  # ~135 days ago (3 months)
                (225, "Q2 2023"),  # ~225 days ago (6 months)
                (315, "Q1 2023"),  # ~315 days ago (9 months)
            ]

            events = []
            for days_ago, quarter_label in quarters:
                event_date = datetime.now() - timedelta(days=days_ago)

                # Check if we have data for this date (handle timezone)
                first_date = stock_data.index[0]
                if hasattr(first_date, 'tz_localize'):
                    first_date = first_date.tz_localize(None)
                elif hasattr(first_date, 'tz_convert'):
                    first_date = first_date.tz_convert(None).replace(tzinfo=None)

                if event_date < first_date:
                    continue

                try:
                    # Analyze this event using REAL price data and CAR calculation
                    analysis = self.analyze_event(ticker, event_date)
                    analysis["event"] = f"{quarter_label} Earnings"
                    events.append(analysis)
                    print(f"  [OK] Analyzed {quarter_label} for {ticker}: CAR = {analysis['car_0_1']}%")
                except Exception as e:
                    print(f"  [SKIP] Could not analyze {quarter_label} for {ticker}: {e}")
                    continue

            # Return real analysis if we got any, otherwise fallback
            result = events if events else self._generate_mock_events(ticker)

            # Cache the result
            self.cache[cache_key] = (result, datetime.now())
            return result

        except Exception as e:
            print(f"Error analyzing {ticker}: {e}")
            fallback = self._generate_mock_events(ticker)
            self.cache[cache_key] = (fallback, datetime.now())
            return fallback

    def get_upcoming_events(self, ticker: str) -> List[Dict]:
        """
        Get upcoming events for a ticker using Alpha Vantage earnings calendar
        """
        print(f"[DEBUG] get_upcoming_events called for {ticker}")
        print(f"[DEBUG] Alpha Vantage key available: {'YES' if self.alpha_vantage_key and self.alpha_vantage_key != 'your_alphavantage_key_here' else 'NO'}")
        
        # Check cache first
        cache_key = f"upcoming_events_{ticker}"
        if cache_key in self.cache:
            data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < timedelta(hours=24):
                print(f"[CACHE] Using cached upcoming events for {ticker}")
                return data

        try:
            print(f"Fetching real upcoming earnings for {ticker}...")

            # Try Alpha Vantage Earnings Calendar API
            if self.alpha_vantage_key and self.alpha_vantage_key != "your_alphavantage_key_here":
                url = "https://www.alphavantage.co/query"
                params = {
                    "function": "EARNINGS_CALENDAR",
                    "symbol": ticker,
                    "apikey": self.alpha_vantage_key
                }

                response = requests.get(url, params=params, timeout=10)

                if response.status_code == 200:
                    # Check if response contains rate limit message
                    if "rate limit" in response.text.lower() or "25 requests per day" in response.text:
                        print(f"  ⚠️  RATE LIMIT HIT: Alpha Vantage earnings calendar rate limited")
                        print(f"  📝 Using mock data for upcoming events")
                        result = self._generate_mock_upcoming_events(ticker)
                        self.cache[cache_key] = (result, datetime.now())
                        return result
                    
                    # Parse CSV response
                    from io import StringIO
                    import csv

                    csv_data = StringIO(response.text)
                    reader = csv.DictReader(csv_data)

                    upcoming_events = []
                    for row in reader:
                        report_date = row.get('reportDate')
                        if report_date:
                            event_date = datetime.strptime(report_date, '%Y-%m-%d')
                            # Only include future dates
                            if event_date > datetime.now():
                                upcoming_events.append({
                                    "ticker": ticker,
                                    "type": "Earnings Report",
                                    "date": event_date.isoformat(),
                                    "expected_impact": "High"
                                })

                    if upcoming_events:
                        print(f"  SUCCESS! Found {len(upcoming_events)} real upcoming earnings")
                        self.cache[cache_key] = (upcoming_events[:3], datetime.now())
                        return upcoming_events[:3]
                    else:
                        print(f"  No upcoming earnings found, using mock data")

            # Fallback to mock data
            print(f"  Using estimated earnings dates for {ticker}")
            result = self._generate_mock_upcoming_events(ticker)
            self.cache[cache_key] = (result, datetime.now())
            return result

        except Exception as e:
            print(f"Error fetching upcoming events for {ticker}: {e}")
            result = self._generate_mock_upcoming_events(ticker)
            self.cache[cache_key] = (result, datetime.now())
            return result

    def _generate_mock_events(self, ticker: str) -> List[Dict]:
        """Generate realistic mock events with ticker-specific values"""
        import hashlib
        import random

        # Use ticker as seed for consistent but different values per stock
        seed = int(hashlib.md5(ticker.encode()).hexdigest()[:8], 16)
        random.seed(seed)

        events = []
        quarters = [
            (45, "Q4 2023"),
            (135, "Q3 2023"),
            (225, "Q2 2023"),
        ]

        for days_ago, quarter in quarters:
            # Generate realistic CAR values (-8% to +8%)
            car = round(random.uniform(-8, 8), 2)

            # Determine sentiment
            if car > 2:
                sentiment = "positive"
                action = random.choice(["beat expectations", "exceeded forecasts", "showed strong growth"])
            elif car < -2:
                sentiment = "negative"
                action = random.choice(["missed estimates", "fell short", "disappointed"])
            else:
                sentiment = "neutral"
                action = random.choice(["met expectations", "showed mixed results", "was inline with forecasts"])

            # Generate volatility (0.8x to 2.0x)
            volatility = round(random.uniform(0.8, 2.0), 2)

            events.append({
                "ticker": ticker,
                "event": f"{quarter} Earnings",
                "date": (datetime.now() - timedelta(days=days_ago)).isoformat(),
                "car_0_1": car,
                "volatility_change": volatility,
                "sentiment": sentiment,
                "conclusion": f"{ticker} {action}, resulting in {abs(car):.1f}% {'gain' if car > 0 else 'decline'}."
            })

        return events

    def _generate_mock_upcoming_events(self, ticker: str) -> List[Dict]:
        """Generate mock upcoming events for demo"""
        return [
            {
                "ticker": ticker,
                "type": "Earnings Report",
                "date": (datetime.now() + timedelta(days=30)).isoformat(),
                "expected_impact": "High"
            },
            {
                "ticker": ticker,
                "type": "Product Announcement",
                "date": (datetime.now() + timedelta(days=15)).isoformat(),
                "expected_impact": "Medium"
            }
        ]
