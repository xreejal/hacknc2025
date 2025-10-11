"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import AddStockForm from "@/components/AddStockForm";

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">
            StockLens
          </h1>
          <p className="text-gray-600 mt-1">
            Smart financial event tracker and news analyzer
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AddStockForm onAddStock={handleAddStock} />
        <Dashboard
          trackedStocks={trackedStocks}
          onRemoveStock={handleRemoveStock}
        />
      </main>
    </div>
  );
}
