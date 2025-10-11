"use client";

import type { NewsArticle } from "@/lib/api";
import { format } from "date-fns";

interface NewsFeedProps {
  articles: NewsArticle[];
}

export default function NewsFeed({ articles }: NewsFeedProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-300";
      case "negative":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">News Feed</h2>
      <div className="space-y-4">
        {articles.map((article, index) => (
          <div
            key={index}
            className="border-l-4 border-blue-500 pl-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {article.title}
                </a>
                <p className="text-sm text-gray-600 mt-1">{article.summary}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-bold text-blue-600">
                    {article.ticker}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded border ${getSentimentColor(
                      article.sentiment
                    )}`}
                  >
                    {article.sentiment}
                  </span>
                  <span className="text-xs text-gray-500">
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
