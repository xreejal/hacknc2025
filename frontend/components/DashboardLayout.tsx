"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import AddStockForm from "./AddStockForm";
import NewsFeedForStocks from "./NewsFeedForStocks";
import AgentChat from "./AgentChat";
import VoiceNewsButton from "./VoiceNewsButton";
import { Plus, MessageSquare, Volume2 } from "lucide-react";
import Onboarding from "./Onboarding";
import StockPillsContainer from "./StockPillsContainer";
import { stockList } from "@/lib/stockList";
import type { NewsArticle } from "@/lib/api";

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
  const [showChat, setShowChat] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string>("");
  const [showLandingChoices, setShowLandingChoices] = useState(false);
  const autoRevertTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shouldAutoRevertRef = useRef<"none" | "chat" | "voice-news">("none");

  // Show onboarding for new users
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    const hasSeenLandingChoices = localStorage.getItem("hasSeenLandingChoices");
    if (!hasSeenLandingChoices) {
      setShowLandingChoices(true);
    }
  }, []);

  // Auto-revert from landing-driven navigation
  useEffect(() => {
    if (shouldAutoRevertRef.current === "chat" && activeSection === "chat") {
      if (autoRevertTimerRef.current) clearTimeout(autoRevertTimerRef.current);
      autoRevertTimerRef.current = setTimeout(() => {
        setActiveSection("add-stocks");
        shouldAutoRevertRef.current = "none";
      }, 10000); // revert after 10s
    }

    return () => {
      if (autoRevertTimerRef.current) clearTimeout(autoRevertTimerRef.current);
    };
  }, [activeSection]);

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

  const handleLandingSelect = (section: "add-stocks" | "voice-news" | "chat") => {
    // Persist that user has interacted with landing choices
    localStorage.setItem("hasSeenLandingChoices", "true");
    setShowLandingChoices(false);

    if (section === "chat") {
      shouldAutoRevertRef.current = "chat";
    } else if (section === "voice-news") {
      shouldAutoRevertRef.current = "voice-news";
    } else {
      shouldAutoRevertRef.current = "none";
    }

    setActiveSection(section);
  };

  const handleViewStockDetails = (ticker: string) => {
    // Navigate to stock details or show modal
    console.log(`Viewing details for ${ticker}`);
  };

  const handleSentimentClick = async (article: NewsArticle) => {
    // Auto-collapse sidebar to make space
    setIsSidebarCollapsed(true);

    // Show chat and generate sentiment explanation
    setShowChat(true);

    // Simplified sentiment explanation prompt
    const prompt = `Explain why this article about ${article.ticker} is ${article.sentiment}:\n\n"${article.title}"\n\n${article.summary}`;

    setChatInitialMessage(prompt);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setChatInitialMessage("");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            trackedStocks={trackedStocks}
            onRemoveStock={onRemoveStock}
            onAddStockClick={handleAddStockClick}
            onGoToAddStocks={() => handleLandingSelect("add-stocks")}
            onGoToVoiceNews={() => handleLandingSelect("voice-news")}
            onGoToChat={() => handleLandingSelect("chat")}
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
            <NewsFeedForStocks
              trackedStocks={trackedStocks}
              onSentimentClick={handleSentimentClick}
            />
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
              <VoiceNewsButton onDone={() => {
                if (shouldAutoRevertRef.current === "voice-news") {
                  setActiveSection("add-stocks");
                  shouldAutoRevertRef.current = "none";
                }
              }} />
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

      <div className="flex bg-black h-screen text-white">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <Header
            onToggleSidebar={handleToggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto scrollbar-hide">
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

        {/* AI Chat Panel */}
        {showChat && (
          <div className="right-0 bottom-0 z-30 fixed bg-black/95 backdrop-blur-xl border-white/10 border-t md:border-l w-full md:w-96 h-96 md:h-[500px]">
            <div className="flex justify-between items-center p-3 border-white/10 border-b">
              <h3 className="font-bold text-white text-base">AI Sentiment Analysis</h3>
              <button
                onClick={handleCloseChat}
                className="hover:bg-white/10 p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="h-[calc(100%-48px)]">
              <AgentChat
                initialMessage={chatInitialMessage}
                autoSend={true}
                placeholder="Ask about this article..."
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
