import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, BarChart3, Users, Shield, Zap, ArrowRight, Activity } from 'lucide-react'
import { InteractiveGrid } from '@/components/InteractiveGrid'
import { LiveTicker } from '@/components/LiveTicker'
import { PriceChart } from '@/components/PriceChart'

export default function LandingPage() {
  return (
    <div className="relative bg-black min-h-screen overflow-hidden text-white">
      <InteractiveGrid />

      <header className="z-50 relative bg-black/50 backdrop-blur-xl border-white/10 border-b">
        <div className="mx-auto px-4 py-4 container">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <TrendingUp className="w-8 h-8 text-purple" />
                <div className="absolute inset-0 bg-purple/50 blur-xl" />
              </div>
              <span className="font-black text-2xl tracking-tight">APEX CAPITAL</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="ghost" className="text-white hover:text-purple">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-purple hover:bg-purple-dark font-bold text-white glow-purple">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <LiveTicker />

      <div className="z-10 relative mx-auto px-4 py-20 container">
        <div className="flex flex-col items-center space-y-8 text-center animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-purple/10 px-4 py-2 border border-purple/30 rounded-full">
            <Activity className="w-4 h-4 text-purple" />
            <span className="font-semibold text-purple text-sm">Real-Time Market Analysis</span>
          </div>

          <h1 className="max-w-5xl font-black text-7xl md:text-9xl leading-none tracking-tighter">
            <span className="block text-white">PRECISION</span>
            <span className="block text-gradient-purple">TRADING</span>
          </h1>

          <p className="max-w-2xl text-gray-400 text-xl leading-relaxed">
            Advanced algorithmic trading platform powered by AI. Execute trades with{' '}
            <span className="font-semibold text-purple">millisecond precision</span> and{' '}
            <span className="font-semibold text-purple-light">institutional-grade analytics</span>
          </p>

          <div className="flex items-center gap-4 pt-6">
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-purple hover:bg-purple-dark px-8 h-14 font-bold text-white text-lg glow-purple"
              >
                Start Trading Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="hover:bg-white/10 px-8 border-white/20 h-14 font-bold text-white text-lg"
              >
                <BarChart3 className="mr-2 w-5 h-5" />
                View Dashboard
              </Button>
            </Link>
          </div>

          <div className="gap-12 grid grid-cols-3 pt-12 w-full max-w-4xl">
            <div className="space-y-2">
              <div className="font-mono font-black text-gradient-purple text-5xl">$2.5B</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Daily Volume</div>
            </div>
            <div className="space-y-2">
              <div className="font-mono font-black text-gradient-purple text-5xl">10K+</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Active Traders</div>
            </div>
            <div className="space-y-2">
              <div className="font-mono font-black text-gradient-purple text-5xl">99.9%</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">Uptime</div>
            </div>
          </div>

          <div className="mt-16 w-full max-w-4xl">
            <PriceChart />
          </div>
        </div>

        <div className="gap-6 grid md:grid-cols-4 mt-32">
          {[
            {
              icon: TrendingUp,
              title: 'Real-Time Data',
              desc: 'Sub-millisecond market data feeds',
            },
            {
              icon: Zap,
              title: 'Instant Execution',
              desc: 'Lightning-fast order processing',
            },
            {
              icon: Shield,
              title: 'Bank-Grade Security',
              desc: '256-bit military encryption',
            },
            {
              icon: Users,
              title: 'Expert Network',
              desc: 'Connect with top traders',
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="group bg-black/40 backdrop-blur-sm border-white/10 hover:border-purple/50 transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardContent className="space-y-4 pt-6 text-center">
                <div className="inline-flex bg-purple/10 group-hover:bg-purple/20 p-4 rounded-xl transition-colors">
                  <feature.icon className="w-8 h-8 text-purple" />
                </div>
                <h3 className="font-bold text-white text-lg">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="items-center gap-12 grid md:grid-cols-2 mt-32">
          <div className="space-y-6 animate-slideIn">
            <div className="inline-block bg-purple/10 px-4 py-1 border border-purple/30 rounded-full font-semibold text-purple text-sm">
              ADVANCED ANALYTICS
            </div>
            <h2 className="font-black text-5xl leading-tight">
              Trade at the
              <br />
              <span className="text-gradient-purple">Speed of Light</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Our proprietary infrastructure delivers sub-millisecond execution times,
              giving you the competitive edge in volatile markets.
            </p>
            <div className="space-y-3">
              {['Co-located servers', 'Direct market access', 'Zero-latency architecture'].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-purple/20 border border-purple/30 rounded-full w-6 h-6">
                      <div className="bg-purple rounded-full w-2 h-2" />
                    </div>
                    <span className="text-white">{item}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-purple/20 blur-3xl" />
            <PriceChart />
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-purple/20 via-black to-black mt-32 p-16 border border-purple/30 rounded-2xl overflow-hidden text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_50%)]" />
          <div className="relative space-y-6">
            <h2 className="font-black text-5xl">Ready to Dominate the Market?</h2>
            <p className="mx-auto max-w-2xl text-gray-400 text-xl">
              Join elite traders leveraging cutting-edge technology
            </p>
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-purple hover:bg-purple-dark mt-6 px-12 h-16 font-bold text-white text-xl glow-purple"
              >
                Open Account Now
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <p className="text-gray-500 text-sm">
              No credit card required • Instant approval • Start trading in 60 seconds
            </p>
          </div>
        </div>
      </div>

      <footer className="z-10 relative bg-black/50 backdrop-blur-xl mt-24 py-12 border-white/10 border-t">
        <div className="mx-auto px-4 text-center container">
          <div className="flex justify-center items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-purple" />
            <span className="font-black text-xl">APEX CAPITAL</span>
          </div>
          <p className="text-gray-500 text-sm">
            2025 Apex Capital. Professional trading platform.
          </p>
        </div>
      </footer>
    </div>
  )
}
