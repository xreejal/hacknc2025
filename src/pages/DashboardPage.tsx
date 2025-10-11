import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TickerCard from '@/components/TickerCard'
import { mockTickers, mockWatchlist, mockMarketOverview } from '@/lib/mockData'
import { TrendingUp, Clock, TrendingDown, Activity } from 'lucide-react'
import { InteractiveGrid } from '@/components/InteractiveGrid'
import { LiveTicker } from '@/components/LiveTicker'
import { PriceChart } from '@/components/PriceChart'

export default function DashboardPage() {
  const upcomingEvents = mockTickers
    .filter((t) => t.nextEvent)
    .sort((a, b) => {
      if (!a.nextEvent || !b.nextEvent) return 0
      return new Date(a.nextEvent.eventDate).getTime() - new Date(b.nextEvent.eventDate).getTime()
    })

  return (
    <div className="relative space-y-6">
      <InteractiveGrid />
      <LiveTicker />
      
      <div className="z-10 relative">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="font-black text-4xl tracking-tight">
              TRADING <span className="text-gradient-purple">DASHBOARD</span>
            </h1>
            <div className="flex items-center gap-2 bg-purple/10 px-4 py-2 border border-purple/30 rounded-full">
              <Activity className="w-4 h-4 text-purple animate-pulse" />
              <span className="font-mono font-bold text-purple text-sm">MARKET OPEN</span>
            </div>
          </div>
          <p className="text-gray-400">
            Real-time portfolio tracking and market analysis
          </p>
        </div>

        <Card className="bg-black/40 backdrop-blur-sm mb-6 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-black tracking-tight">
              <TrendingUp className="w-6 h-6 text-purple" />
              MARKET INDICES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
              <div className="group bg-gradient-to-br from-chartGreen/10 to-transparent p-6 border border-chartGreen/20 hover:border-chartGreen/50 rounded-xl transition-all cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-gray-400 text-sm">S&P 500</span>
                  <TrendingUp className="w-4 h-4 text-chartGreen" />
                </div>
                <div className="mb-1 font-mono font-black text-white text-3xl">
                  {mockMarketOverview.sp500.value.toLocaleString()}
                </div>
                <div className="font-mono font-bold text-chartGreen">
                  +{mockMarketOverview.sp500.change}%
                </div>
              </div>

              <div className="group bg-gradient-to-br from-chartGreen/10 to-transparent p-6 border border-chartGreen/20 hover:border-chartGreen/50 rounded-xl transition-all cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-gray-400 text-sm">NASDAQ</span>
                  <TrendingUp className="w-4 h-4 text-chartGreen" />
                </div>
                <div className="mb-1 font-mono font-black text-white text-3xl">
                  {mockMarketOverview.nasdaq.value.toLocaleString()}
                </div>
                <div className="font-mono font-bold text-chartGreen">
                  +{mockMarketOverview.nasdaq.change}%
                </div>
              </div>

              <div className="group bg-gradient-to-br from-chartRed/10 to-transparent p-6 border border-chartRed/20 hover:border-chartRed/50 rounded-xl transition-all cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-gray-400 text-sm">DOW</span>
                  <TrendingDown className="w-4 h-4 text-chartRed" />
                </div>
                <div className="mb-1 font-mono font-black text-white text-3xl">
                  {mockMarketOverview.dow.value.toLocaleString()}
                </div>
                <div className="font-mono font-bold text-chartRed">
                  {mockMarketOverview.dow.change}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="font-black tracking-tight">PORTFOLIO PERFORMANCE</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceChart />
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="flex items-center gap-2 mb-4 font-black text-2xl tracking-tight">
            <Clock className="w-7 h-7 text-purple" />
            UPCOMING <span className="text-gradient-purple">EVENTS</span>
          </h2>
          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <Card className="bg-black/40 border-white/10">
                <CardContent className="py-12 text-gray-500 text-center">
                  No upcoming events in your watchlist
                </CardContent>
              </Card>
            ) : (
              upcomingEvents.map((ticker) => (
                <Card
                  key={ticker.id}
                  className="bg-black/40 backdrop-blur-sm border-white/10 hover:border-purple/50 transition-all"
                >
                  <CardContent className="py-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex justify-center items-center bg-purple/10 border border-purple/30 rounded-lg w-12 h-12">
                          <TrendingUp className="w-6 h-6 text-purple" />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-white text-lg">{ticker.symbol}</p>
                          <p className="text-gray-400 text-sm">{ticker.nextEvent?.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-purple">{ticker.nextEvent?.eventType}</p>
                        <p className="font-mono text-gray-500 text-xs">{ticker.nextEvent?.eventDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-black text-2xl tracking-tight">
            POPULAR <span className="text-gradient-purple">STOCKS</span>
          </h2>
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
    </div>
  )
}
