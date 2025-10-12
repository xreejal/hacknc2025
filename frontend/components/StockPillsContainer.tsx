"use client";

import { useState, useEffect } from "react";
import StockPill from "./StockPill";
import { Plus, TrendingUp } from "lucide-react";

interface StockPillsContainerProps {
  trackedStocks: string[];
  onRemoveStock: (ticker: string) => void;
  onAddStock: () => void;
  onViewStockDetails?: (ticker: string) => void;
}

export default function StockPillsContainer({ 
  trackedStocks, 
  onRemoveStock, 
  onAddStock,
  onViewStockDetails 
}: StockPillsContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (trackedStocks.length === 0) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-gray-400 text-base">No stocks tracked</div>
        <button
          onClick={onAddStock}
          className="flex items-center gap-2 bg-purple/20 hover:bg-purple/30 border border-purple/30 px-4 py-2 rounded-full transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-base font-medium">Add Stock</span>
        </button>
      </div>
    );
  }

  const visibleStocks = isExpanded ? trackedStocks : trackedStocks.slice(0, 3);
  const hiddenCount = trackedStocks.length - 3;

  return (
    <div className="space-y-3">
      {/* Stock Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {visibleStocks.map((ticker) => (
          <StockPill
            key={ticker}
            ticker={ticker}
            onRemove={() => onRemoveStock(ticker)}
            onViewDetails={() => onViewStockDetails?.(ticker)}
          />
        ))}
        
        {/* Expand/Collapse Button */}
        {trackedStocks.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors text-base"
        >
          <TrendingUp className="w-5 h-5" />
          <span>
            {isExpanded ? 'Show Less' : `+${hiddenCount} More`}
          </span>
        </button>
        )}

        {/* Add Stock Button */}
        <button
          onClick={onAddStock}
          className="flex items-center gap-2 bg-purple/20 hover:bg-purple/30 border border-purple/30 px-4 py-2 rounded-full transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-base font-medium">Add</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>{trackedStocks.length} stocks tracked</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live data</span>
        </div>
      </div>
    </div>
  );
}
