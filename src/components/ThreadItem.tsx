import { Card, CardContent } from '@/components/ui/card'
import { Thread } from '@/types'
import { formatDateTime } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { MessageSquare, User } from 'lucide-react'

interface ThreadItemProps {
  thread: Thread
}

export default function ThreadItem({ thread }: ThreadItemProps) {
  return (
    <Link to={`/thread/${thread.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold hover:text-primary transition-colors">
              {thread.title}
            </h3>

            <div className="flex justify-between items-center text-muted-foreground text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{thread.author?.displayName || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{thread.postCount} replies</span>
                </div>
              </div>

              <div className="text-xs">
                <span>Last post {formatDateTime(thread.lastPostAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

