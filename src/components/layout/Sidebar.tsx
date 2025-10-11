import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockWatchlist } from '@/lib/mockData'
import { Link } from 'react-router-dom'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { Star } from 'lucide-react'

export default function Sidebar() {
  return (
    <div className="top-20 sticky space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="fill-yellow-400 w-5 h-5 text-yellow-400" />
            My Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockWatchlist.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Add tickers to your watchlist to track them here
            </p>
          ) : (
            mockWatchlist.map((item) => {
              const isPositive = item.ticker.priceChangePercent24h >= 0
              return (
                <Link
                  key={item.ticker.id}
                  to={`/ticker/${item.ticker.symbol}`}
                  className="block hover:bg-muted p-2 rounded-md transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">{item.ticker.symbol}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatCurrency(item.ticker.lastPrice)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatPercent(item.ticker.priceChangePercent24h / 100)}
                    </span>
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

