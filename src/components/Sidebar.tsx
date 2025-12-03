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
  Share2,
  UserRound,
  Clock3
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
    { id: View.MEETINGS, label: 'Find A Meeting', icon: MapPin },
    { id: View.MEETING_LOG, label: 'Meeting Log', icon: Clock3 },
    { id: View.STEPWORK, label: 'Step Work', icon: FileText },
    { id: View.JOURNAL, label: 'Journal', icon: BookHeart },
    { id: View.CONTACTS, label: 'Phone Book', icon: Phone },
    { id: View.READINGS, label: 'Daily Readings', icon: BookOpen },
    { id: View.AI_COACH, label: 'AI Companion', icon: BotMessageSquare },
    { id: View.BADGES, label: 'Badges & Streaks', icon: Award },
    { id: View.FIND_TREATMENT, label: 'Find Treatment', icon: FileText },
  ];

  const baseClass = isMobile
    ? "fixed bottom-0 left-0 w-full bg-white border-t border-penda-border flex overflow-x-auto p-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] gap-2"
    : "w-72 bg-penda-bg border-r border-penda-border/80 flex flex-col p-5 h-full shadow-lg shrink-0 overflow-y-auto";

  const heroLogoSrc = "https://pendalane.com/wp-content/uploads/2024/04/cropped-Penda-Lane-Behavioral-Health-Logo.png";
  const heroTagline = "Meetings. Sponsor. Support. In your pocket.";

  return (
    <nav className={baseClass}>
      {!isMobile && (
        <div className="mb-8 px-2 flex flex-col items-center text-center gap-2">
          <div className="w-24 h-24 rounded-[28px] bg-white border-2 border-penda-border shadow-lg flex items-center justify-center overflow-hidden">
            <img src={heroLogoSrc} alt="Penda Lane Behavioral Health" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-extrabold text-penda-purple text-xl leading-tight">My Recovery Buddy</h1>
          <p className="text-xs text-penda-text/80">By Penda Lane Behavioral Health</p>
          <p className="text-[11px] text-penda-light">{heroTagline}</p>
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
          onClick={() => setView(View.MY_ACCOUNT)}
          className={isMobile
             ? "flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-lg text-[10px] whitespace-nowrap text-penda-purple bg-white border border-penda-border"
             : "flex items-center gap-3 px-4 py-3 rounded-firm mb-2 transition-all font-medium text-sm text-penda-purple hover:bg-white bg-white border border-transparent w-full text-left"}
        >
          <UserRound size={isMobile ? 18 : 20} />
          <span>My Account</span>
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

        <button
            onClick={shareApp}
            className={isMobile
             ? "flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-lg text-[10px] whitespace-nowrap text-penda-purple bg-white border border-penda-border"
             : "flex items-center gap-3 px-4 py-3 rounded-firm mb-2 transition-all font-medium text-sm text-penda-purple hover:bg-white bg-white border border-transparent w-full text-left"}
        >
            <Share2 size={isMobile ? 18 : 20} />
            <span>Share App</span>
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
