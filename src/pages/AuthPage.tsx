import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TrendingUp, ArrowRight, Shield, Zap } from 'lucide-react'
import { InteractiveGrid } from '@/components/InteractiveGrid'

export default function AuthPage() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="relative flex justify-center items-center bg-black p-4 min-h-screen overflow-hidden">
      <InteractiveGrid />

      <div className="absolute inset-0">
        <div className="top-1/4 left-1/4 absolute bg-purple/20 blur-[128px] rounded-full w-96 h-96 animate-pulse" />
        <div className="right-1/4 bottom-1/4 absolute bg-purple/10 blur-[128px] rounded-full w-96 h-96 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="z-10 relative bg-black/80 backdrop-blur-xl border-white/10 w-full max-w-md overflow-hidden">
        <div className="top-0 absolute inset-x-0 bg-gradient-to-r from-purple via-purple-light to-purple h-1" />
        
        <CardHeader className="space-y-4 pt-8 text-center">
          <div className="flex justify-center items-center gap-3">
            <div className="relative">
              <TrendingUp className="w-10 h-10 text-purple" />
              <div className="absolute inset-0 bg-purple/50 blur-xl" />
            </div>
            <span className="font-black text-3xl tracking-tight">APEX CAPITAL</span>
          </div>

          <CardTitle className="font-bold text-2xl">
            {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </CardTitle>
          <p className="text-gray-400">
            {isLogin
              ? 'Access your trading dashboard'
              : 'Start your journey to financial freedom'}
          </p>

          {!isLogin && (
            <div className="flex justify-center gap-3 pt-2">
              <div className="flex items-center gap-1 bg-purple/10 px-3 py-1 border border-purple/30 rounded-full">
                <Shield className="w-3 h-3 text-purple" />
                <span className="font-semibold text-purple text-xs">Secure</span>
              </div>
              <div className="flex items-center gap-1 bg-purple/10 px-3 py-1 border border-purple/30 rounded-full">
                <Zap className="w-3 h-3 text-purple" />
                <span className="font-semibold text-purple text-xs">Instant</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="font-semibold text-gray-300 text-sm uppercase tracking-wider">
                  Display Name
                </label>
                <Input
                  type="text"
                  placeholder="JohnTrader"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-purple/50 text-white"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="font-semibold text-gray-300 text-sm uppercase tracking-wider">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-purple/50 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-gray-300 text-sm uppercase tracking-wider">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-purple/50 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              className="bg-purple hover:bg-purple-dark w-full h-12 font-bold text-white glow-purple"
            >
              {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="border-white/10 border-t w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-3 text-gray-500 tracking-wider">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="hover:bg-white/5 border-white/20 w-full text-white"
            >
              <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="text-sm text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-gray-400 hover:text-purple transition-colors"
              >
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <span className="font-bold text-purple">Sign up</span>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <span className="font-bold text-purple">Sign in</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-6 border-white/10 border-t text-center">
            <p className="mb-3 text-gray-400 text-sm">Trusted by professional traders</p>
            <div className="flex justify-center gap-6 text-gray-500 text-xs">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" /> Bank-level security
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" /> Instant access
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
