import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TickerCard from '@/components/TickerCard'
import { mockTickers, mockWatchlist, mockMarketOverview } from '@/lib/mockData'
import { TrendingUp, Clock } from 'lucide-react'

export default function DashboardPage() {
  const upcomingEvents = mockTickers
    .filter((t) => t.nextEvent)
    .sort((a, b) => {
      if (!a.nextEvent || !b.nextEvent) return 0
      return new Date(a.nextEvent.eventDate).getTime() - new Date(b.nextEvent.eventDate).getTime()
    })

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="font-bold text-3xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Track your favorite stocks and stay updated with market events
        </p>
      </div>

      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Market Overview
          </CardTitle>
        </CardHeader>
          <CardContent>
            <div className="gap-4 grid grid-cols-3 text-center">
              <div>
                <p className="text-muted-foreground text-sm">S&P 500</p>
                <p className="font-bold text-2xl">{mockMarketOverview.sp500.value.toLocaleString()}</p>
                <p className={`text-sm ${mockMarketOverview.sp500.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mockMarketOverview.sp500.change >= 0 ? '+' : ''}{mockMarketOverview.sp500.change}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">NASDAQ</p>
                <p className="font-bold text-2xl">{mockMarketOverview.nasdaq.value.toLocaleString()}</p>
                <p className={`text-sm ${mockMarketOverview.nasdaq.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mockMarketOverview.nasdaq.change >= 0 ? '+' : ''}{mockMarketOverview.nasdaq.change}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">DOW</p>
                <p className="font-bold text-2xl">{mockMarketOverview.dow.value.toLocaleString()}</p>
                <p className={`text-sm ${mockMarketOverview.dow.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mockMarketOverview.dow.change >= 0 ? '+' : ''}{mockMarketOverview.dow.change}%
                </p>
              </div>
            </div>
          </CardContent>
      </Card>

      {/* Upcoming Events */}
      <div>
        <h2 className="flex items-center gap-2 mb-4 font-semibold text-xl">
          <Clock className="w-5 h-5" />
          Upcoming Events
        </h2>
        <div className="space-y-3">
          {upcomingEvents.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-muted-foreground text-center">
                No upcoming events for your watchlist
              </CardContent>
            </Card>
          ) : (
            upcomingEvents.map((ticker) => (
              <Card key={ticker.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{ticker.symbol}</p>
                      <p className="text-muted-foreground text-sm">
                        {ticker.nextEvent?.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{ticker.nextEvent?.eventType}</p>
                      <p className="text-muted-foreground text-xs">
                        {ticker.nextEvent?.eventDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Popular Stocks */}
      <div>
        <h2 className="mb-4 font-semibold text-xl">Popular Stocks</h2>
        <div className="gap-4 grid md:grid-cols-2">
          {mockTickers.map((ticker) => (
            <TickerCard
              key={ticker.id}
              ticker={ticker}
              isInWatchlist={mockWatchlist.some((w) => w.tickerId === ticker.id)}
              onWatchlistToggle={() => console.log('Toggle watchlist')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

