import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ticker } from '@/types'
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Star, StarOff, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from './ui/button'

interface TickerCardProps {
  ticker: Ticker
  isInWatchlist?: boolean
  onWatchlistToggle?: () => void
}

export default function TickerCard({ ticker, isInWatchlist, onWatchlistToggle }: TickerCardProps) {
  const isPositive = ticker.priceChangePercent24h >= 0

  return (
    <Card className="group bg-black/40 backdrop-blur-sm border-white/10 hover:border-purple/50 transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Link to={`/ticker/${ticker.symbol}`}>
              <CardTitle className="font-mono font-black hover:text-purple text-xl transition-colors cursor-pointer">
                {ticker.symbol}
              </CardTitle>
            </Link>
            <p className="mt-1 text-gray-400 text-sm">{ticker.companyName}</p>
          </div>
          {onWatchlistToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onWatchlistToggle}
              className="hover:bg-purple/10 w-8 h-8 text-purple"
            >
              {isInWatchlist ? (
                <Star className="fill-purple w-4 h-4 text-purple" />
              ) : (
                <StarOff className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono font-black text-white text-3xl">
              {formatCurrency(ticker.lastPrice)}
            </span>
            <span
              className={`flex items-center gap-1 text-sm font-bold font-mono ${
                isPositive ? 'text-chartGreen' : 'text-chartRed'
              }`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatPercent(ticker.priceChangePercent24h / 100)}
            </span>
          </div>

          {ticker.nextEvent && (
            <div className="pt-3 border-white/10 border-t">
              <p className="mb-2 text-gray-500 text-xs uppercase tracking-wider">Next Event</p>
              <div className="flex justify-between items-center">
                <Badge className="bg-purple/20 border-purple/30 font-mono text-purple text-xs">
                  {ticker.nextEvent.eventType}
                </Badge>
                <span className="font-mono text-gray-400 text-xs">
                  {formatDate(ticker.nextEvent.eventDate)}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center font-mono text-gray-500 text-xs uppercase tracking-wider">
            <span>{ticker.sector}</span>
            <span>{ticker.exchange}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
