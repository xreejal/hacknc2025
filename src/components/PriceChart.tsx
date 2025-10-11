import { useEffect, useState } from 'react'

export function PriceChart() {
  const [points, setPoints] = useState<number[]>([])

  useEffect(() => {
    const initialPoints = Array.from({ length: 60 }, () => Math.random() * 50 + 50)
    setPoints(initialPoints)

    const interval = setInterval(() => {
      setPoints((prev) => [...prev.slice(1), Math.random() * 50 + 50])
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  const width = 500
  const height = 200
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1

  const pathData = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width
      const y = height - ((point - min) / range) * height
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  const isPositive = points[points.length - 1] > points[0]

  return (
    <div className="relative bg-black/40 p-6 border border-white/10 rounded-lg w-full h-48 overflow-hidden">
      <div className="top-4 left-4 z-10 absolute">
        <div className="font-mono font-bold text-white text-2xl">
          ${points[points.length - 1]?.toFixed(2) || '0.00'}
        </div>
        <div className={`text-sm font-semibold ${isPositive ? 'text-chartGreen' : 'text-chartRed'}`}>
          {isPositive ? '+' : ''}
          {((points[points.length - 1] - points[0]) / points[0] * 100).toFixed(2)}%
        </div>
      </div>

      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#chartGradient)"
        />

        <path
          d={pathData}
          fill="none"
          stroke={isPositive ? "#10B981" : "#EF4444"}
          strokeWidth="2"
          className="drop-shadow-lg"
        />

        {points.length > 0 && (
          <circle
            cx={width}
            cy={height - ((points[points.length - 1] - min) / range) * height}
            r="4"
            fill={isPositive ? "#10B981" : "#EF4444"}
            className="animate-pulse"
          />
        )}
      </svg>

      <div className="right-4 bottom-4 absolute">
        <div className={`flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border ${isPositive ? 'border-chartGreen/30' : 'border-chartRed/30'}`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${isPositive ? 'bg-chartGreen' : 'bg-chartRed'}`} />
          <span className={`text-xs font-mono ${isPositive ? 'text-chartGreen' : 'text-chartRed'}`}>LIVE</span>
        </div>
      </div>
    </div>
  )
}

