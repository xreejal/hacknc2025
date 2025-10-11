import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ticker } from '@/types'
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Star, StarOff } from 'lucide-react'
import { Button } from './ui/button'

interface TickerCardProps {
  ticker: Ticker
  isInWatchlist?: boolean
  onWatchlistToggle?: () => void
}

export default function TickerCard({ ticker, isInWatchlist, onWatchlistToggle }: TickerCardProps) {
  const isPositive = ticker.priceChangePercent24h >= 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Link to={`/ticker/${ticker.symbol}`}>
              <CardTitle className="font-bold hover:text-primary text-lg cursor-pointer">
                {ticker.symbol}
              </CardTitle>
            </Link>
            <p className="mt-1 text-muted-foreground text-sm">{ticker.companyName}</p>
          </div>
          {onWatchlistToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onWatchlistToggle}
              className="w-8 h-8"
            >
              {isInWatchlist ? (
                <Star className="fill-yellow-400 w-4 h-4 text-yellow-400" />
              ) : (
                <StarOff className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-2xl">{formatCurrency(ticker.lastPrice)}</span>
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(ticker.priceChangePercent24h / 100)}
            </span>
          </div>

          {ticker.nextEvent && (
            <div className="pt-2 border-t">
              <p className="text-muted-foreground text-xs">Next Event</p>
              <div className="flex justify-between items-center mt-1">
                <Badge variant="outline" className="text-xs">
                  {ticker.nextEvent.eventType}
                </Badge>
                <span className="font-medium text-xs">{formatDate(ticker.nextEvent.eventDate)}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-muted-foreground text-xs">
            <span>{ticker.sector}</span>
            <span>{ticker.exchange}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

