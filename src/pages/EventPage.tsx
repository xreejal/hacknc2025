import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SentimentBadge from '@/components/SentimentBadge'
import ArticleCard from '@/components/ArticleCard'
import ThreadItem from '@/components/ThreadItem'
import CommunitySentimentBar from '@/components/CommunitySentimentBar'
import { getEventById, mockArticles, mockThreads, getCommunitySentiment } from '@/lib/mockData'
import { formatDate } from '@/lib/utils'
import { Calendar, Newspaper, MessageSquare, Brain } from 'lucide-react'

export default function EventPage() {
  const { eventId } = useParams<{ eventId: string }>()
  
  // Get event data - Replace with API call: await fetch(`/api/events/${eventId}`)
  const event = getEventById(eventId || '') || getEventById('e1')!
  const articles = mockArticles.filter((a) => a.isEventRelated && a.tickerId === event.tickerId)
  const threads = mockThreads.filter((t) => t.scopeType === 'EVENT' && t.scopeId === event.id)
  const communitySentiment = getCommunitySentiment('EVENT', event.id)

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge>{event.eventType}</Badge>
                {event.ticker && (
                  <span className="text-muted-foreground text-sm">
                    {event.ticker.symbol} • {event.ticker.companyName}
                  </span>
                )}
              </div>
              <CardTitle className="text-2xl">{event.description}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.eventDate)}</span>
              </div>
            </div>
            {event.sentiment && (
              <SentimentBadge
                sentiment={event.sentiment.aggregateLabel}
                confidence={event.sentiment.confidence}
                size="lg"
              />
            )}
          </div>
        </CardHeader>
      </Card>

      {/* AI Sentiment Analysis */}
      {event.sentiment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-muted-foreground text-sm">Overall Sentiment</p>
              <div className="flex items-center gap-3">
                <SentimentBadge
                  sentiment={event.sentiment.aggregateLabel}
                  confidence={event.sentiment.confidence}
                  size="lg"
                />
                <span className="text-muted-foreground text-sm">
                  Based on {articles.length} recent articles
                </span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-muted-foreground text-sm">Summary</p>
              <p className="text-sm leading-relaxed">{event.sentiment.summaryText}</p>
            </div>
            <p className="text-muted-foreground text-xs">
              Last updated: {formatDate(event.sentiment.computedAt)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Community Sentiment */}
      <Card>
        <CardContent className="pt-6">
          <CommunitySentimentBar sentiment={communitySentiment} />
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" className="flex-1 border-green-600 text-green-600">
              Vote Bullish
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Vote Neutral
            </Button>
            <Button size="sm" variant="outline" className="flex-1 border-red-600 text-red-600">
              Vote Bearish
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for News and Discussions */}
      <Tabs defaultValue="news">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="news" className="gap-2">
            <Newspaper className="w-4 h-4" />
            Event News ({articles.length})
          </TabsTrigger>
          <TabsTrigger value="discussions" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Discussions ({threads.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-3 mt-4">
          <div className="space-y-4">
            <div>
              <h3 className="mb-3 font-semibold">About the Event</h3>
              <div className="space-y-3">
                {articles.slice(0, 2).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            {articles.length > 2 && (
              <div>
                <h3 className="mb-3 font-semibold">Additional Coverage</h3>
                <div className="space-y-3">
                  {articles.slice(2).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-3 mt-4">
          <Button className="w-full">Start Event Discussion</Button>
          {threads.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-muted-foreground text-center">
                No discussions about this event yet. Start the conversation!
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

