"use client";

import { useEffect, useState } from "react";
import StockCard from "./StockCard";
import NewsFeed from "./NewsFeed";
import { fetchNews, getPastEvents, getUpcomingEvents } from "@/lib/api";
import type { NewsArticle, EventAnalysis, UpcomingEvent } from "@/lib/api";

interface DashboardProps {
  trackedStocks: string[];
  onRemoveStock: (ticker: string) => void;
}

export default function Dashboard({ trackedStocks, onRemoveStock }: DashboardProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [pastEvents, setPastEvents] = useState<Record<string, EventAnalysis[]>>({});
  const [upcomingEvents, setUpcomingEvents] = useState<Record<string, UpcomingEvent[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trackedStocks.length > 0) {
      loadData();
    }
  }, [trackedStocks]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch news for all tracked stocks
      const newsData = await fetchNews(trackedStocks);
      setNews(newsData);

      // Fetch events for each stock
      const pastEventsPromises = trackedStocks.map(ticker =>
        getPastEvents(ticker).catch(() => [])
      );
      const upcomingEventsPromises = trackedStocks.map(ticker =>
        getUpcomingEvents(ticker).catch(() => [])
      );

      const pastEventsResults = await Promise.all(pastEventsPromises);
      const upcomingEventsResults = await Promise.all(upcomingEventsPromises);

      const pastEventsMap: Record<string, EventAnalysis[]> = {};
      const upcomingEventsMap: Record<string, UpcomingEvent[]> = {};

      trackedStocks.forEach((ticker, index) => {
        pastEventsMap[ticker] = pastEventsResults[index];
        upcomingEventsMap[ticker] = upcomingEventsResults[index];
      });

      setPastEvents(pastEventsMap);
      setUpcomingEvents(upcomingEventsMap);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (trackedStocks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Add stocks to start tracking events and news
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading data...</p>
        </div>
      )}

      {/* Tracked Stocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackedStocks.map((ticker) => (
          <StockCard
            key={ticker}
            ticker={ticker}
            pastEvents={pastEvents[ticker] || []}
            upcomingEvents={upcomingEvents[ticker] || []}
            onRemove={() => onRemoveStock(ticker)}
          />
        ))}
      </div>

      {/* News Feed */}
      <NewsFeed articles={news} />
    </div>
  );
}
