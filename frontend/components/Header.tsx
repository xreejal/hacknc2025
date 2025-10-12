"use client";

import { Search, Bell, User } from "lucide-react";
import VoiceNewsButton from "./VoiceNewsButton";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export default function Header({ onToggleSidebar, isSidebarCollapsed }: HeaderProps) {
  return (
    <header className="top-0 z-40 sticky bg-black/80 backdrop-blur-xl border-white/10 border-b">
      <div className="absolute inset-x-0 bg-gradient-to-r from-transparent via-purple to-transparent h-px" />
      
      <div className="px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
          </div>

          {/* Center Section - Quick Actions */}
          <div className="flex items-center gap-3">
            <VoiceNewsButton />
            
            <button className="relative hover:bg-white/10 p-2 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <div className="-top-1 -right-1 absolute bg-red-500 rounded-full w-3 h-3 animate-pulse" />
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-gray-400 text-base">
              <div className="bg-green-500 rounded-full w-2 h-2 animate-pulse" />
              <span>Live Data</span>
            </div>
            
            <button className="hover:bg-white/10 p-2 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
