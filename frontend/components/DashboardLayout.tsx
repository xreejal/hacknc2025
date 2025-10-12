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
import ArticlePreviewPanel from "./ArticlePreviewPanel";
import { stockList } from "@/lib/stockList";
import type { NewsArticle } from "@/lib/api";
import { explainSentiment } from "@/lib/api";

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
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string>("");

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

  const handleSentimentClick = async (article: NewsArticle) => {
    // Auto-collapse sidebar to make space
    setIsSidebarCollapsed(true);

    // Set the selected article
    setSelectedArticle(article);

    // Show chat and generate sentiment explanation
    setShowChat(true);

    // Generate sentiment explanation prompt
    const prompt = `Analyze this financial news article and explain why it has been classified as '${article.sentiment}' sentiment.

Article Details:
- Title: ${article.title}
- Summary: ${article.summary}
- Ticker: ${article.ticker}
- Sentiment: ${article.sentiment}

Please provide a detailed explanation covering:
1. Key phrases or words that influenced the sentiment classification
2. The overall tone and context of the article
3. Why this sentiment rating makes sense for ${article.ticker}
4. What this means for potential investors`;

    setChatInitialMessage(prompt);
  };

  const handleCloseArticlePanel = () => {
    setSelectedArticle(null);
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

        {/* Article Preview Panel */}
        <ArticlePreviewPanel
          article={selectedArticle}
          isOpen={selectedArticle !== null}
          onClose={handleCloseArticlePanel}
        />

        {/* AI Chat Panel */}
        {showChat && (
          <div className="fixed bottom-0 right-0 w-full md:w-96 h-96 md:h-[500px] bg-black/95 backdrop-blur-xl border-t md:border-l border-white/10 z-20 md:mr-96">
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white">AI Sentiment Analysis</h3>
              <button
                onClick={handleCloseChat}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
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
