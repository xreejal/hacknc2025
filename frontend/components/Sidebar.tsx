"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  Plus, 
  BarChart3, 
  Newspaper, 
  MessageSquare, 
  Volume2,
  Settings,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ 
  activeSection, 
  onSectionChange, 
  isCollapsed, 
  onToggleCollapse 
}: SidebarProps) {
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "Overview & Analytics"
    },
    {
      id: "add-stocks",
      label: "Add Stocks",
      icon: Plus,
      description: "Track New Stocks"
    },
    {
      id: "news",
      label: "News Feed",
      icon: Newspaper,
      description: "Market News"
    },
    {
      id: "chat",
      label: "AI Chat",
      icon: MessageSquare,
      description: "WealthVisor AI"
    },
    {
      id: "voice-news",
      label: "Voice News",
      icon: Volume2,
      description: "Audio Commentary"
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-black/90 backdrop-blur-xl border-r border-white/10 z-50
        transition-all duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-72'}
        lg:relative lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <TrendingUp className="w-7 h-7 text-green" />
                <div className="absolute inset-0 bg-green/50 blur-lg" />
              </div>
              <span className="font-black text-2xl tracking-tight text-green">STOCKLENS</span>
            </div>
          )}
          
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-green/20 border border-green/30 text-green' 
                    : 'hover:bg-white/10 text-gray-300 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center' : 'justify-start'}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-green' : ''}`} />
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-base">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.description}</div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-semibold text-base">Settings</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
