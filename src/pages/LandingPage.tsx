import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, MessageSquare, Brain, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-background to-muted min-h-screen">
      {/* Hero Section */}
      <div className="mx-auto px-4 py-16 container">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-12 h-12 text-primary" />
            <h1 className="font-bold text-5xl">FinanceHub</h1>
          </div>

          <h2 className="max-w-3xl font-semibold text-3xl">
            Community-Driven Stock Analytics & Discussion
          </h2>

          <p className="max-w-2xl text-muted-foreground text-xl">
            Track stocks, analyze AI-powered sentiment, join discussions, and stay ahead with
            real-time market insights from a vibrant community.
          </p>

          <div className="flex gap-4 pt-4">
            <Link to="/auth">
              <Button size="lg" className="px-8 text-lg">
                Get Started
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="px-8 text-lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-4 mt-20">
          <Card>
            <CardContent className="space-y-3 pt-6 text-center">
              <div className="flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Real-Time Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Monitor S&P 500 stocks with live prices and important events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 pt-6 text-center">
              <div className="flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">AI Sentiment Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Get AI-powered insights on market sentiment from news and events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 pt-6 text-center">
              <div className="flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Discussion Forums</h3>
              <p className="text-muted-foreground text-sm">
                Join threaded conversations on stocks and specific events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 pt-6 text-center">
              <div className="flex justify-center items-center bg-primary/10 mx-auto rounded-full w-12 h-12">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Community Sentiment</h3>
              <p className="text-muted-foreground text-sm">
                See what the community thinks with real-time sentiment voting
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="space-y-6 mt-20 text-center">
          <h3 className="font-semibold text-2xl">Ready to start?</h3>
          <p className="text-muted-foreground">
            Join thousands of investors making smarter decisions together
          </p>
          <Link to="/auth">
            <Button size="lg" className="px-12 text-lg">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

