import React from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, 
  BookHeart, 
  BotMessageSquare, 
  MapPin, 
  Phone, 
  AlertCircle,
  FileText,
  Award,
  BookOpen,
  LogOut,
  Share2
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isMobile: boolean;
  isLoggedIn: boolean;
  shareApp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isMobile, isLoggedIn, shareApp }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.MEETINGS, label: 'Meeting Finder', icon: MapPin },
    { id: View.AI_COACH, label: 'AI Companion', icon: BotMessageSquare },
    { id: View.JOURNAL, label: 'Journal', icon: BookHeart },
    { id: View.STEPWORK, label: 'My Stepwork', icon: FileText },
    { id: View.BADGES, label: 'Badges & Streaks', icon: Award },
    { id: View.READINGS, label: 'Daily Readings', icon: BookOpen },
    { id: View.CONTACTS, label: 'Phone Book', icon: Phone },
  ];

  const baseClass = isMobile
    ? "fixed bottom-0 left-0 w-full bg-white border-t border-penda-border flex overflow-x-auto p-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] gap-2"
    : "w-72 bg-penda-bg border-r border-penda-border/80 flex flex-col p-5 h-full shadow-lg shrink-0 overflow-y-auto";

  return (
    <nav className={baseClass}>
      {!isMobile && (
        <div className="mb-8 px-2 flex flex-col items-center text-center gap-1">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-penda-purple shadow-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-penda-light/50 via-penda-tan to-white" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-penda-purple to-penda-light text-white flex items-center justify-center text-2xl font-extrabold tracking-tight shadow-inner">
              PL
            </div>
          </div>
          <div className="text-[11px] uppercase tracking-[0.35em] text-penda-purple mt-1">Penda Lane</div>
          <h1 className="font-extrabold text-penda-purple text-xl leading-tight">My Recovery Buddy</h1>
          <p className="text-xs text-penda-text/80">By Penda Lane Behavioral Health</p>
          <p className="text-[11px] text-penda-light">Compassionate support for every step.</p>
        </div>
      )}
      
      {/* App Navigation */}
      {menuItems.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        
        let buttonClass = isMobile
          ? "flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-lg text-[10px] whitespace-nowrap"
          : "flex items-center gap-3 px-4 py-3 rounded-firm mb-2 transition-all font-medium text-sm w-full text-left";

        if (isActive) {
            buttonClass += " bg-penda-purple text-white border border-penda-purple shadow-md";
        } else {
            buttonClass += " text-penda-purple bg-white border border-penda-border hover:bg-penda-bg hover:border-penda-purple";
        }

        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={buttonClass}
          >
            <Icon size={isMobile ? 18 : 20} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* App utilities */}
      <div className={isMobile ? "flex gap-2" : "mt-4 pt-4 border-t border-penda-border/50"}>
        <button
            onClick={shareApp}
            className={isMobile
             ? "flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-lg text-[10px] whitespace-nowrap text-penda-purple bg-white border border-penda-border"
             : "flex items-center gap-3 px-4 py-3 rounded-firm mb-2 transition-all font-medium text-sm text-penda-purple hover:bg-white bg-white border border-transparent w-full text-left"}
        >
            <Share2 size={isMobile ? 18 : 20} />
            <span>Share App</span>
        </button>

        {/* Help Button (Internal) */}
        <button
          onClick={() => setView(View.HELP)}
          className={isMobile
             ? "flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-lg text-[10px] whitespace-nowrap text-red-600 bg-red-50 border border-red-100" 
             : "flex items-center gap-3 px-4 py-3 rounded-firm mb-2 transition-all font-medium text-sm text-red-600 hover:bg-red-50 bg-white border border-transparent w-full text-left"}
        >
           <AlertCircle size={isMobile ? 18 : 20} />
           <span>Help & Crisis</span>
        </button>

        {isLoggedIn && !isMobile && (
          <button
            onClick={() => setView(View.DASHBOARD)}
            className="flex items-center gap-3 px-4 py-3 rounded-firm mb-2 transition-all font-medium text-sm text-penda-light hover:text-penda-purple hover:bg-white w-full text-left"
          >
            <LogOut size={20} />
            <span>End Session</span>
          </button>
        )}
      </div>
    </nav>
  );
};
