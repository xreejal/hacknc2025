"use client";

import { useEffect, useState } from "react";
import StockCard from "./StockCard";
import NewsFeed from "./NewsFeed";
import { InteractiveGrid } from "./InteractiveGrid";
import { fetchNews, getPastEvents, getUpcomingEvents } from "@/lib/api";
import type { NewsArticle, EventAnalysis, UpcomingEvent } from "@/lib/api";
import { Activity, TrendingUp } from "lucide-react";

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
      <div className="relative space-y-6">
        <InteractiveGrid />
        <div className="z-10 relative text-center py-12">
          <div className="bg-black/40 backdrop-blur-sm border-white/10 rounded-lg p-8">
            <TrendingUp className="w-16 h-16 text-purple mx-auto mb-4" />
            <h2 className="font-black text-2xl text-white mb-2 tracking-tight">
              START <span className="text-gradient-purple">TRACKING</span>
            </h2>
            <p className="text-gray-400">
              Add stocks to start tracking events and news
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      <InteractiveGrid />
      
      <div className="z-10 relative">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="font-black text-4xl tracking-tight">
              TRADING <span className="text-gradient-purple">DASHBOARD</span>
            </h1>
            <div className="flex items-center gap-2 bg-purple/10 px-4 py-2 border border-purple/30 rounded-full">
              <Activity className="w-4 h-4 text-purple animate-pulse" />
              <span className="font-mono font-bold text-purple text-sm">
                {loading ? "LOADING" : "LIVE"}
              </span>
            </div>
          </div>
          <p className="text-gray-400">
            Real-time portfolio tracking and market analysis
          </p>
        </div>

        {loading && (
          <div className="bg-black/40 backdrop-blur-sm border-white/10 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-purple border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading data...</p>
            </div>
          </div>
        )}

        {/* Tracked Stocks */}
        <div className="mb-6">
          <h2 className="mb-4 font-black text-2xl tracking-tight">
            TRACKED <span className="text-gradient-purple">STOCKS</span>
          </h2>
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
        </div>

        {/* News Feed */}
        <NewsFeed articles={news} />
      </div>
    </div>
  );
}
