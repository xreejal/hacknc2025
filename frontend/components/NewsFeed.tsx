"use client";

import type { NewsArticle } from "@/lib/api";
import { format } from "date-fns";
import { ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

interface NewsFeedProps {
  articles: NewsArticle[];
}

export default function NewsFeed({ articles }: NewsFeedProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-chartGreen/10 text-chartGreen border-chartGreen/20";
      case "negative":
        return "bg-chartRed/10 text-chartRed border-chartRed/20";
      default:
        return "bg-gray-800 text-gray-400 border-gray-600";
    }
  };

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border-white/10 rounded-lg p-6">
      <h2 className="font-black text-2xl text-white mb-4 tracking-tight">
        NEWS <span className="text-gradient-purple">FEED</span>
      </h2>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <div
            key={index}
            className="border-l-4 border-purple pl-4 py-3 hover:bg-white/5 transition-colors rounded"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-white hover:text-purple transition-colors group flex items-start gap-2"
                >
                  {article.title}
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple transition-colors" />
                </a>
                <p className="text-sm text-gray-400 mt-1">{article.summary}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-bold text-purple font-mono">
                    {article.ticker}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded border ${getSentimentColor(
                      article.sentiment
                    )}`}
                  >
                    {article.sentiment}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {format(new Date(article.published_at), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
