"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import AddStockForm from "./AddStockForm";
import NewsFeed from "./NewsFeed";
import NewsFeedForStocks from "./NewsFeedForStocks";
import AgentChat from "./AgentChat";
import VoiceNewsButton from "./VoiceNewsButton";
import Onboarding from "./Onboarding";
import StockPillsContainer from "./StockPillsContainer";
import { stockList } from "@/lib/stockList";

interface DashboardLayoutProps {
  trackedStocks: string[];
  onAddStock: (ticker: string) => void;
  onRemoveStock: (ticker: string) => void;
}

export default function DashboardLayout({ 
  trackedStocks, 
  onAddStock, 
  onRemoveStock 
}: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show onboarding for new users
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };

  const handleAddStockClick = () => {
    setActiveSection("add-stocks");
  };

  const handleViewStockDetails = (ticker: string) => {
    // Navigate to stock details or show modal
    console.log(`Viewing details for ${ticker}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            trackedStocks={trackedStocks}
            onRemoveStock={onRemoveStock}
            onAddStockClick={handleAddStockClick}
          />
        );
      case "add-stocks":
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="mb-3 font-black text-5xl tracking-tight">
                ADD <span className="text-gradient-green">STOCKS</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Search and add stocks to your tracking portfolio
              </p>
            </div>
            <AddStockForm onAddStock={onAddStock} stockList={stockList} />
          </div>
        );
      case "news":
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="mb-3 font-black text-5xl tracking-tight">
                NEWS <span className="text-gradient-green">FEED</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Latest market news and analysis for your tracked stocks
              </p>
            </div>
            <NewsFeedForStocks trackedStocks={trackedStocks} />
          </div>
        );
      case "chat":
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="mb-3 font-black text-5xl tracking-tight">
                AI <span className="text-gradient-green">CHAT</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Chat with WealthVisor AI for market insights
              </p>
            </div>
            <AgentChat />
          </div>
        );
      case "voice-news":
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="mb-3 font-black text-5xl tracking-tight">
                VOICE <span className="text-gradient-green">NEWS</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Listen to AI-generated market commentary
              </p>
            </div>
            <div className="flex justify-center">
              <VoiceNewsButton />
            </div>
          </div>
        );
      default:
        return (
          <Dashboard
            trackedStocks={trackedStocks}
            onRemoveStock={onRemoveStock}
            onAddStockClick={handleAddStockClick}
          />
        );
    }
  };

  return (
    <>
      {/* Onboarding Modal */}
      {showOnboarding && (
        <Onboarding onComplete={handleCompleteOnboarding} />
      )}

      <div className="flex h-screen bg-black text-white">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header
            onToggleSidebar={handleToggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6">
              {/* Stock Pills - Always visible at top */}
              <div className="mb-6">
                <StockPillsContainer
                  trackedStocks={trackedStocks}
                  onRemoveStock={onRemoveStock}
                  onAddStock={handleAddStockClick}
                  onViewStockDetails={handleViewStockDetails}
                />
              </div>
              
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
