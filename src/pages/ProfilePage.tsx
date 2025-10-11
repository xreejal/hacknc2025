import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Award, Bell } from 'lucide-react'
import { useState } from 'react'

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('JohnTrader')
  const [bio, setBio] = useState('Long-term investor focused on tech stocks')
  const [emailNotifications, setEmailNotifications] = useState(true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Save profile')
  }

  const user = {
    id: 'u1',
    email: 'john@example.com',
    displayName: 'JohnTrader',
    bio: 'Long-term investor focused on tech stocks',
    joinedAt: '2024-01-15T00:00:00Z',
    role: 'user',
    reputation: 523,
    followedTickers: ['AAPL', 'MSFT', 'GOOGL'],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl">Profile Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="flex justify-center items-center bg-primary/10 rounded-full w-20 h-20">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-xl">{user.displayName}</p>
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined Jan 2024
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {user.reputation} rep
                </span>
              </div>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="font-medium text-sm">Display Name</label>
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>

            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-muted-foreground text-sm">
                Receive daily digest of your watchlist highlights
              </p>
            </div>
            <Button
              variant={emailNotifications ? 'default' : 'outline'}
              size="sm"
              onClick={() => setEmailNotifications(!emailNotifications)}
            >
              {emailNotifications ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Following</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.followedTickers.map((ticker) => (
              <Badge key={ticker} variant="secondary" className="px-3 py-1 text-sm">
                {ticker}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
