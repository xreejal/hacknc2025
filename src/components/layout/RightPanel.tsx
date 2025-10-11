import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Flame } from 'lucide-react'
import { mockTrending } from '@/lib/mockData'

export default function RightPanel() {
  return (
    <div className="top-20 sticky space-y-4">
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-black text-lg tracking-tight">
            <Flame className="w-5 h-5 text-purple" />
            TRENDING
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockTrending.map((item, index) => (
            <div key={item.symbol} className="flex justify-between items-center hover:bg-white/5 p-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-6 font-mono font-bold text-purple text-sm">
                  #{index + 1}
                </span>
                <span className="font-mono font-bold">{item.symbol}</span>
              </div>
              <Badge className="bg-purple/20 border-purple/30 font-mono text-purple text-xs">
                {item.mentions}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-black text-lg tracking-tight">
            <TrendingUp className="w-5 h-5 text-purple" />
            TOP MOVERS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">
            Market gainers and losers updated in real-time
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
