"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { InteractiveGrid } from "@/components/InteractiveGrid";
import WealthVisorChat from "@/components/WealthVisorChat";
import VoiceNewsButton from "@/components/VoiceNewsButton";


export default function Home() {
  const [trackedStocks, setTrackedStocks] = useState<string[]>([]);

  const handleAddStock = (ticker: string) => {
    if (!trackedStocks.includes(ticker.toUpperCase())) {
      setTrackedStocks([...trackedStocks, ticker.toUpperCase()]);
    }
  };

  const handleRemoveStock = (ticker: string) => {
    console.log('Page: handleRemoveStock called with ticker:', ticker);
    console.log('Page: Current trackedStocks before removal:', trackedStocks);
    const newStocks = trackedStocks.filter(t => t !== ticker);
    console.log('Page: New trackedStocks after removal:', newStocks);
    setTrackedStocks(newStocks);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <InteractiveGrid />
      
      <DashboardLayout
        trackedStocks={trackedStocks}
        onAddStock={handleAddStock}
        onRemoveStock={handleRemoveStock}
      />

      {/* WealthVisor AI Chatbot */}
      <WealthVisorChat />
    </div>
  );
}
