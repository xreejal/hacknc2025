import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Article } from '@/types'
import { formatDateTime } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import SentimentBadge from './SentimentBadge'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-3">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1"
            >
              <h3 className="font-semibold group-hover:text-primary text-sm leading-tight transition-colors">
                {article.title}
              </h3>
            </a>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <ExternalLink size={16} />
            </a>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2">{article.snippet}</p>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span className="font-medium">{article.publisher}</span>
              <span>•</span>
              <span>{formatDateTime(article.publishedAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              {article.isEventRelated && (
                <Badge variant="secondary" className="text-xs">
                  Event-related
                </Badge>
              )}
              {article.sentiment && (
                <SentimentBadge
                  sentiment={
                    article.sentiment.sentimentScore > 0.2
                      ? 'BULLISH'
                      : article.sentiment.sentimentScore < -0.2
                      ? 'BEARISH'
                      : 'NEUTRAL'
                  }
                  size="sm"
                  showIcon={false}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

