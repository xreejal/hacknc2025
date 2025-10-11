import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockWatchlist } from '@/lib/mockData'
import { Link } from 'react-router-dom'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { Star, TrendingUp, TrendingDown } from 'lucide-react'

export default function Sidebar() {
  return (
    <div className="top-20 sticky space-y-4">
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-black text-lg tracking-tight">
            <Star className="fill-purple w-5 h-5 text-purple" />
            WATCHLIST
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockWatchlist.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Add tickers to track them here
            </p>
          ) : (
            mockWatchlist.map((item) => {
              const isPositive = item.ticker.priceChangePercent24h >= 0
              return (
                <Link
                  key={item.ticker.id}
                  to={`/ticker/${item.ticker.symbol}`}
                  className="block hover:bg-white/5 p-3 border hover:border-purple/30 border-transparent rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-mono font-bold text-sm">{item.ticker.symbol}</p>
                      <p className="font-mono text-gray-400 text-xs">
                        {formatCurrency(item.ticker.lastPrice)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3 text-chartGreen" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-chartRed" />
                      )}
                      <span
                        className={`text-xs font-bold font-mono ${
                          isPositive ? 'text-chartGreen' : 'text-chartRed'
                        }`}
                      >
                        {formatPercent(item.ticker.priceChangePercent24h / 100)}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
