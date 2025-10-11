import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SentimentBadge from '@/components/SentimentBadge'
import ArticleCard from '@/components/ArticleCard'
import ThreadItem from '@/components/ThreadItem'
import CommunitySentimentBar from '@/components/CommunitySentimentBar'
import { getTickerBySymbol, mockArticles, mockThreads, getCommunitySentiment, mockEvents } from '@/lib/mockData'
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils'
import { Calendar, Newspaper, MessageSquare, Star } from 'lucide-react'

export default function TickerPage() {
  const { symbol } = useParams<{ symbol: string }>()
  
  // Get ticker data - Replace with API call: await fetch(`/api/tickers/${symbol}`)
  const ticker = getTickerBySymbol(symbol || '') || getTickerBySymbol('AAPL')!
  const articles = mockArticles.filter((a) => a.tickerId === ticker.id)
  const threads = mockThreads.filter((t) => t.scopeType === 'TICKER' && t.scopeId === ticker.id)
  const events = mockEvents.filter((e) => e.tickerId === ticker.id)
  const communitySentiment = getCommunitySentiment('TICKER', ticker.id)

  const isPositive = ticker.priceChangePercent24h >= 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-4xl">{ticker.symbol}</h1>
            <Badge variant="outline">{ticker.exchange}</Badge>
          </div>
          <p className="mt-1 text-muted-foreground text-lg">{ticker.companyName}</p>
          <p className="text-muted-foreground text-sm">{ticker.sector}</p>
        </div>
        <Button className="gap-2">
          <Star className="w-4 h-4" />
          Add to Watchlist
        </Button>
      </div>

      {/* Price Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-baseline gap-4">
            <span className="font-bold text-4xl">{formatCurrency(ticker.lastPrice)}</span>
            <span className={`text-xl font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(ticker.priceChangePercent24h / 100)}
            </span>
            <span className={`text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              ({isPositive ? '+' : ''}{formatCurrency(ticker.priceChange24h)})
            </span>
          </div>
          <p className="mt-2 text-muted-foreground text-sm">Last updated: Just now</p>
        </CardContent>
      </Card>

      {/* Community Sentiment */}
      <Card>
        <CardContent className="pt-6">
          <CommunitySentimentBar sentiment={communitySentiment} />
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" className="flex-1 border-green-600 text-green-600">
              Bullish
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Neutral
            </Button>
            <Button size="sm" variant="outline" className="flex-1 border-red-600 text-red-600">
              Bearish
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Events, News, Discussions */}
      <Tabs defaultValue="events">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="w-4 h-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="news" className="gap-2">
            <Newspaper className="w-4 h-4" />
            News
          </TabsTrigger>
          <TabsTrigger value="discussions" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Discussions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-3 mt-4">
          {events.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-muted-foreground text-center">
                No upcoming events
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge>{event.eventType}</Badge>
                        <CardTitle className="text-lg">{event.description}</CardTitle>
                      </div>
                      <p className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4" />
                        {formatDate(event.eventDate)}
                      </p>
                    </div>
                    {event.sentiment && (
                      <SentimentBadge
                        sentiment={event.sentiment.aggregateLabel}
                        confidence={event.sentiment.confidence}
                      />
                    )}
                  </div>
                </CardHeader>
                {event.sentiment && (
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{event.sentiment.summaryText}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="news" className="space-y-3 mt-4">
          {articles.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-muted-foreground text-center">
                No recent news
              </CardContent>
            </Card>
          ) : (
            articles.map((article) => <ArticleCard key={article.id} article={article} />)
          )}
        </TabsContent>

        <TabsContent value="discussions" className="space-y-3 mt-4">
          <Button className="w-full">Start New Discussion</Button>
          {threads.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-muted-foreground text-center">
                No discussions yet. Be the first to start one!
              </CardContent>
            </Card>
          ) : (
            threads.map((thread) => <ThreadItem key={thread.id} thread={thread} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

