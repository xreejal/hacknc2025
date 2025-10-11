"use client";

import { useState } from "react";
import type { EventAnalysis, UpcomingEvent } from "@/lib/api";
import { format } from "date-fns";

interface StockCardProps {
  ticker: string;
  pastEvents: EventAnalysis[];
  upcomingEvents: UpcomingEvent[];
  onRemove: () => void;
}

export default function StockCard({
  ticker,
  pastEvents,
  upcomingEvents,
  onRemove,
}: StockCardProps) {
  const [showPast, setShowPast] = useState(true);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "text-green-600 bg-green-50";
      case "negative":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getCarColor = (car: number) => {
    if (car > 1) return "text-green-600";
    if (car < -1) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{ticker}</h3>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowPast(true)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            showPast
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Past Events
        </button>
        <button
          onClick={() => setShowPast(false)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            !showPast
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Upcoming
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {showPast ? (
          pastEvents.length > 0 ? (
            pastEvents.slice(0, 5).map((event, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-500 pl-3 py-2 bg-gray-50 rounded"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{event.event}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(event.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <span
                    className={`text-lg font-bold ${getCarColor(event.car_0_1)}`}
                  >
                    {event.car_0_1 > 0 ? "+" : ""}
                    {event.car_0_1.toFixed(2)}%
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${getSentimentColor(
                      event.sentiment
                    )}`}
                  >
                    {event.sentiment}
                  </span>
                  <span className="text-xs text-gray-600">
                    Vol: {event.volatility_change.toFixed(2)}x
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">{event.conclusion}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No past events available</p>
          )
        ) : upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="border-l-4 border-purple-500 pl-3 py-2 bg-gray-50 rounded"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{event.type}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(event.date), "MMM dd, yyyy")}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  {event.expected_impact}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No upcoming events</p>
        )}
      </div>
    </div>
  );
}
