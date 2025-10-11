import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Flame } from 'lucide-react'
import { mockTrending } from '@/lib/mockData'

export default function RightPanel() {
  const trendingTickers = mockTrending

  return (
    <div className="top-20 sticky space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="w-5 h-5 text-orange-500" />
            Trending Today
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTickers.map((item, index) => (
            <div key={item.symbol} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="w-4 font-bold text-muted-foreground text-sm">
                  {index + 1}
                </span>
                <span className="font-semibold">{item.symbol}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {item.mentions} mentions
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            Market Movers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Top gainers and losers will appear here
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

