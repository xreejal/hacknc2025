import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Stock {
  symbol: string
  price: number
  change: number
}

export function LiveTicker() {
  const [stocks, setStocks] = useState<Stock[]>([
    { symbol: 'AAPL', price: 178.25, change: 2.34 },
    { symbol: 'TSLA', price: 242.50, change: -1.82 },
    { symbol: 'MSFT', price: 338.11, change: 1.56 },
    { symbol: 'GOOGL', price: 139.75, change: 0.93 },
    { symbol: 'AMZN', price: 145.32, change: 2.12 },
    { symbol: 'NVDA', price: 495.22, change: 3.45 },
    { symbol: 'META', price: 332.44, change: -0.67 },
    { symbol: 'NFLX', price: 412.89, change: 1.89 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          change: stock.change + (Math.random() - 0.5) * 0.1,
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const duplicated = [...stocks, ...stocks, ...stocks]

  return (
    <div className="relative bg-black/40 backdrop-blur-sm py-4 border-white/10 border-y w-full overflow-hidden">
      <div className="flex whitespace-nowrap animate-scroll">
        {duplicated.map((stock, index) => (
          <div
            key={`${stock.symbol}-${index}`}
            className="inline-flex items-center gap-3 mx-8 font-mono"
          >
            <span className="font-bold text-white text-sm tracking-wider">{stock.symbol}</span>
            <span className="text-gray-400 text-sm">${stock.price.toFixed(2)}</span>
            <span
              className={`flex items-center gap-1 text-sm font-semibold ${
                stock.change >= 0 ? 'text-purple' : 'text-purple-light'
              }`}
            >
              {stock.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {stock.change >= 0 ? '+' : ''}
              {stock.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  )
}

