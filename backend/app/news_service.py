import requests
from typing import List, Dict
from datetime import datetime, timedelta
from textblob import TextBlob
import re

class NewsService:
    def __init__(self, news_api_key: str = None, finnhub_api_key: str = None):
        self.news_api_key = news_api_key
        self.finnhub_api_key = finnhub_api_key
        self.news_api_url = "https://newsapi.org/v2/everything"
        self.finnhub_url = "https://finnhub.io/api/v1/company-news"

    async def fetch_news_for_tickers(self, tickers: List[str]) -> List[Dict]:
        """Fetch and analyze news for given tickers"""
        all_articles = []

        for ticker in tickers:
            articles = await self._fetch_ticker_news(ticker)
            all_articles.extend(articles)

        # Sort by published date (newest first)
        all_articles.sort(key=lambda x: x["published_at"], reverse=True)

        return all_articles[:20]  # Return top 20 articles

    async def _fetch_ticker_news(self, ticker: str) -> List[Dict]:
        """Fetch news for a specific ticker"""
        articles = []

        # Try NewsAPI first
        if self.news_api_key and self.news_api_key != "your_newsapi_key_here":
            articles.extend(await self._fetch_from_newsapi(ticker))

        # Fallback to Finnhub
        if self.finnhub_api_key and self.finnhub_api_key != "your_finnhub_key_here":
            articles.extend(await self._fetch_from_finnhub(ticker))

        # If no API keys, return mock data for demo
        if not articles:
            articles = self._generate_mock_news(ticker)

        return articles

    async def _fetch_from_newsapi(self, ticker: str) -> List[Dict]:
        """Fetch news from NewsAPI"""
        try:
            # Get company name from yfinance
            import yfinance as yf
            stock = yf.Ticker(ticker)
            company_name = stock.info.get("longName", ticker)

            params = {
                "q": f"{ticker} OR {company_name}",
                "apiKey": self.news_api_key,
                "language": "en",
                "sortBy": "publishedAt",
                "pageSize": 10,
                "from": (datetime.now() - timedelta(days=7)).isoformat()
            }

            response = requests.get(self.news_api_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            articles = []
            for article in data.get("articles", []):
                analyzed = self._analyze_article(ticker, article)
                if analyzed:
                    articles.append(analyzed)

            return articles
        except Exception as e:
            print(f"NewsAPI error for {ticker}: {e}")
            return []

    async def _fetch_from_finnhub(self, ticker: str) -> List[Dict]:
        """Fetch news from Finnhub"""
        try:
            from_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
            to_date = datetime.now().strftime("%Y-%m-%d")

            params = {
                "symbol": ticker,
                "from": from_date,
                "to": to_date,
                "token": self.finnhub_api_key
            }

            response = requests.get(self.finnhub_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            articles = []
            for item in data[:10]:
                analyzed = self._analyze_finnhub_article(ticker, item)
                if analyzed:
                    articles.append(analyzed)

            return articles
        except Exception as e:
            print(f"Finnhub error for {ticker}: {e}")
            return []

    def _analyze_article(self, ticker: str, article: Dict) -> Dict:
        """Analyze sentiment and summarize article"""
        try:
            title = article.get("title", "")
            description = article.get("description", "") or ""
            content = article.get("content", "") or ""

            # Combine text for analysis
            full_text = f"{title}. {description}"

            # Sentiment analysis using TextBlob
            sentiment = self._get_sentiment(full_text)

            # Generate summary (first 2 sentences)
            summary = self._generate_summary(description or title)

            return {
                "ticker": ticker,
                "title": title,
                "sentiment": sentiment,
                "summary": summary,
                "url": article.get("url", ""),
                "published_at": article.get("publishedAt", datetime.now().isoformat())
            }
        except Exception as e:
            print(f"Error analyzing article: {e}")
            return None

    def _analyze_finnhub_article(self, ticker: str, article: Dict) -> Dict:
        """Analyze Finnhub article"""
        try:
            headline = article.get("headline", "")
            summary_text = article.get("summary", "")

            full_text = f"{headline}. {summary_text}"
            sentiment = self._get_sentiment(full_text)

            return {
                "ticker": ticker,
                "title": headline,
                "sentiment": sentiment,
                "summary": summary_text[:200] + "..." if len(summary_text) > 200 else summary_text,
                "url": article.get("url", ""),
                "published_at": datetime.fromtimestamp(article.get("datetime", 0)).isoformat()
            }
        except Exception as e:
            print(f"Error analyzing Finnhub article: {e}")
            return None

    def _get_sentiment(self, text: str) -> str:
        """Determine sentiment using TextBlob"""
        try:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity

            if polarity > 0.1:
                return "positive"
            elif polarity < -0.1:
                return "negative"
            else:
                return "neutral"
        except:
            return "neutral"

    def _generate_summary(self, text: str) -> str:
        """Generate a brief summary (first 2-3 sentences)"""
        if not text:
            return "No summary available"

        # Split into sentences
        sentences = re.split(r'[.!?]+', text)
        summary_sentences = [s.strip() for s in sentences[:2] if s.strip()]

        summary = ". ".join(summary_sentences)
        if summary and not summary.endswith('.'):
            summary += "."

        return summary[:250] + "..." if len(summary) > 250 else summary

    def _generate_mock_news(self, ticker: str) -> List[Dict]:
        """Generate mock news data for demo purposes"""
        return [
            {
                "ticker": ticker,
                "title": f"{ticker} Shows Strong Performance in Q4 Earnings",
                "sentiment": "positive",
                "summary": f"{ticker} reported better-than-expected earnings, driving investor confidence.",
                "url": "https://example.com",
                "published_at": (datetime.now() - timedelta(days=1)).isoformat()
            },
            {
                "ticker": ticker,
                "title": f"Market Volatility Affects {ticker} Trading",
                "sentiment": "neutral",
                "summary": f"{ticker} experienced increased volatility amid broader market concerns.",
                "url": "https://example.com",
                "published_at": (datetime.now() - timedelta(days=2)).isoformat()
            }
        ]
