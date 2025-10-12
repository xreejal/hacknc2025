"use client";

import { Search, Bell, User } from "lucide-react";
import VoiceNewsButton from "./VoiceNewsButton";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export default function Header({ onToggleSidebar, isSidebarCollapsed }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
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
            
            <div className="hidden lg:flex items-center gap-2 bg-green/10 px-4 py-2 border border-green/30 rounded-full">
              <Search className="w-5 h-5 text-green" />
              <span className="font-mono font-bold text-green text-base">FINANCIAL TRACKER</span>
            </div>
          </div>

          {/* Center Section - Quick Actions */}
          <div className="flex items-center gap-3">
            <VoiceNewsButton />
            
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-base text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live Data</span>
            </div>
            
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
