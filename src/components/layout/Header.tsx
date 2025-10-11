import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Bell, User, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/ticker/${searchQuery.toUpperCase()}`)
    }
  }

  return (
    <header className="top-0 z-50 sticky bg-black/80 backdrop-blur-xl border-white/10 border-b w-full">
      <div className="top-0 absolute inset-x-0 bg-gradient-to-r from-transparent via-purple to-transparent h-px" />
      
      <div className="mx-auto px-4 container">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="group flex items-center gap-3">
            <div className="relative">
              <TrendingUp className="w-7 h-7 text-purple group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-purple/50 opacity-0 group-hover:opacity-100 blur-lg transition-opacity" />
            </div>
            <span className="font-black text-xl tracking-tight">APEX CAPITAL</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 mx-8 max-w-md">
            <div className="relative">
              <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-500 -translate-y-1/2 transform" />
              <Input
                type="text"
                placeholder="Search symbols..."
                className="bg-white/5 pl-10 border-white/10 focus:border-purple/50 font-mono text-white placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative text-white hover:text-purple">
              <Bell className="w-5 h-5" />
              <span className="top-1 right-1 absolute bg-purple rounded-full w-2 h-2 animate-pulse" />
            </Button>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="text-white hover:text-purple">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
