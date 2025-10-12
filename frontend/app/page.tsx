"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import AddStockForm from "@/components/AddStockForm";
import { InteractiveGrid } from "@/components/InteractiveGrid";
import { TrendingUp, Search } from "lucide-react";

export default function Home() {
  const [trackedStocks, setTrackedStocks] = useState<string[]>([]);

  const handleAddStock = (ticker: string) => {
    if (!trackedStocks.includes(ticker.toUpperCase())) {
      setTrackedStocks([...trackedStocks, ticker.toUpperCase()]);
    }
  };

  const handleRemoveStock = (ticker: string) => {
    setTrackedStocks(trackedStocks.filter(t => t !== ticker));
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <InteractiveGrid />
      
      {/* Header */}
      <header className="top-0 z-50 sticky bg-black/80 backdrop-blur-xl border-white/10 border-b w-full">
        <div className="top-0 absolute inset-x-0 bg-gradient-to-r from-transparent via-purple to-transparent h-px" />
        
        <div className="mx-auto px-4 container">
          <div className="flex justify-between items-center h-16">
            <div className="group flex items-center gap-3">
              <div className="relative">
                <TrendingUp className="w-7 h-7 text-purple group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-purple/50 opacity-0 group-hover:opacity-100 blur-lg transition-opacity" />
              </div>
              <span className="font-black text-xl tracking-tight">APEX CAPITAL</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-purple/10 px-4 py-2 border border-purple/30 rounded-full">
                <Search className="w-4 h-4 text-purple" />
                <span className="font-mono font-bold text-purple text-sm">STOCKLENS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="z-10 relative mx-auto px-4 py-6 container">
        <div className="mb-8">
          <h1 className="font-black text-4xl tracking-tight mb-2">
            SMART <span className="text-gradient-purple">FINANCIAL</span> TRACKER
          </h1>
          <p className="text-gray-400">
            Real-time event analysis and news sentiment tracking
          </p>
        </div>

        <div className="mb-8">
          <AddStockForm onAddStock={handleAddStock} />
        </div>

        <Dashboard
          trackedStocks={trackedStocks}
          onRemoveStock={handleRemoveStock}
        />
      </main>
    </div>
  );
}
