import { Badge } from '@/components/ui/badge'
import { SentimentLabel } from '@/types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface SentimentBadgeProps {
  sentiment: SentimentLabel
  confidence?: number
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function SentimentBadge({ 
  sentiment, 
  confidence, 
  showIcon = true,
  size = 'md' 
}: SentimentBadgeProps) {
  const variant = sentiment === 'BULLISH' 
    ? 'bullish' 
    : sentiment === 'BEARISH' 
    ? 'bearish' 
    : 'neutral'

  const Icon = sentiment === 'BULLISH' 
    ? TrendingUp 
    : sentiment === 'BEARISH' 
    ? TrendingDown 
    : Minus

  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs'

  return (
    <Badge variant={variant} className={`${textSize} font-semibold gap-1`}>
      {showIcon && <Icon size={iconSize} />}
      {sentiment}
      {confidence !== undefined && ` • ${Math.round(confidence)}%`}
    </Badge>
  )
}

