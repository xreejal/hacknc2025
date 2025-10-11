import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { getThreadById } from '@/lib/mockData'
import { formatDateTime } from '@/lib/utils'
import { ArrowLeft, User, ThumbsUp, Flag, Reply } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function ThreadPage() {
  const { threadId } = useParams<{ threadId: string }>()
  const [replyContent, setReplyContent] = useState('')
  
  // Get thread data - Replace with API call: await fetch(`/api/threads/${threadId}`)
  const threadData = getThreadById(threadId || '') || getThreadById('t1')!
  const thread = threadData

  const posts = threadData.posts || []

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submit reply:', replyContent)
    setReplyContent('')
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to={thread.scopeType === 'TICKER' ? `/ticker/${thread.scopeId}` : `/event/${thread.scopeId}`}>
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </Link>

      {/* Thread Header */}
      <Card>
        <CardHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge>{thread.scopeType}</Badge>
              <span className="text-muted-foreground text-sm">
                {thread.postCount} replies
              </span>
            </div>
            <CardTitle className="text-2xl">{thread.title}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <User className="w-4 h-4" />
              <span className="font-medium">{thread.author?.displayName || 'Anonymous'}</span>
              <span>•</span>
              <span>{formatDateTime(thread.createdAt)}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Post Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{post.author?.displayName || 'Anonymous'}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{formatDateTime(post.createdAt)}</span>
                    {post.author && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Badge variant="secondary" className="text-xs">
                          {post.author.reputation} rep
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-sm leading-relaxed">{post.content}</p>

                {/* Post Actions */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    {post.upvotes}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Reply className="w-4 h-4" />
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 ml-auto text-muted-foreground">
                    <Flag className="w-4 h-4" />
                    Flag
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Your Reply</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitReply} className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
              required
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Post Reply</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

