import { CommunitySentiment } from '@/types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface CommunitySentimentBarProps {
  sentiment: CommunitySentiment
}

export default function CommunitySentimentBar({ sentiment }: CommunitySentimentBarProps) {
  const total = sentiment.totalVotes || 1

  const bullishPercent = (sentiment.bullish / total) * 100
  const neutralPercent = (sentiment.neutral / total) * 100
  const bearishPercent = (sentiment.bearish / total) * 100

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">Community Sentiment</span>
        <span className="text-muted-foreground">{sentiment.totalVotes} votes</span>
      </div>

      <div className="flex bg-muted rounded-full w-full h-3 overflow-hidden">
        {bullishPercent > 0 && (
          <div
            className="bg-green-500"
            style={{ width: `${bullishPercent}%` }}
            title={`Bullish: ${bullishPercent.toFixed(1)}%`}
          />
        )}
        {neutralPercent > 0 && (
          <div
            className="bg-gray-400"
            style={{ width: `${neutralPercent}%` }}
            title={`Neutral: ${neutralPercent.toFixed(1)}%`}
          />
        )}
        {bearishPercent > 0 && (
          <div
            className="bg-red-500"
            style={{ width: `${bearishPercent}%` }}
            title={`Bearish: ${bearishPercent.toFixed(1)}%`}
          />
        )}
      </div>

      <div className="gap-4 grid grid-cols-3 text-center">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp size={14} />
            <span className="font-medium text-xs">Bullish</span>
          </div>
          <span className="font-semibold text-sm">{bullishPercent.toFixed(1)}%</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-gray-600">
            <Minus size={14} />
            <span className="font-medium text-xs">Neutral</span>
          </div>
          <span className="font-semibold text-sm">{neutralPercent.toFixed(1)}%</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-red-600">
            <TrendingDown size={14} />
            <span className="font-medium text-xs">Bearish</span>
          </div>
          <span className="font-semibold text-sm">{bearishPercent.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}

