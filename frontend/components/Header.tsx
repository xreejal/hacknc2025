"use client";

import { Search } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export default function Header({ onToggleSidebar, isSidebarCollapsed }: HeaderProps) {
  return (
    <header 
      className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10"
      style={{
        boxShadow: '0 0 25px rgba(16, 185, 129, 0.06), inset 0 0 15px rgba(16, 185, 129, 0.02)'
      }}
    >
      <div className="absolute inset-x-0 bg-gradient-to-r from-transparent via-purple to-transparent h-px" />
      
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            >
              <Search className="w-5 h-5" />
            </button>
            
          </div>

          {/* Center Section - Live Data */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-base text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live Data</span>
            </div>
          </div>

          {/* Right Section - Empty */}
          <div className="flex items-center gap-3">
          </div>
        </div>
      </div>
    </header>
  );
}
