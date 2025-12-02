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
  UserCog,
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
  const wpBaseUrl = 'https://pendalane.com';

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

  // Items that link to actual WP pages
  const externalItems = [
    {
      label: 'My Membership',
      icon: UserCog,
      href: `${wpBaseUrl}/membership-account/`,
      visible: isLoggedIn
    },
    {
      label: 'Join / Levels',
      icon: UserCog,
      href: `${wpBaseUrl}/membership-levels/`,
      visible: !isLoggedIn
    },
  ];

  const baseClass = isMobile 
    ? "fixed bottom-0 left-0 w-full bg-white border-t border-penda-border flex overflow-x-auto p-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] gap-2"
    : "w-64 bg-penda-bg border-r border-penda-border flex flex-col p-4 h-full shadow-lg shrink-0 overflow-y-auto";

  return (
    <nav className={baseClass}>
      {!isMobile && (
        <div className="mb-8 px-2 flex flex-col items-center text-center">
            <img
              src="https://pendalane.com/wp-content/uploads/2024/04/cropped-Penda-Lane-Behavioral-Health-Logo.png"
              alt="Penda Lane"
              className="w-20 h-20 rounded-full object-cover mix-blend-multiply mb-3 border border-penda-border"
            />
            <h1 className="font-bold text-penda-purple text-lg leading-tight">My Recovery Buddy</h1>
            <p className="text-xs text-penda-light mt-1">Powered by Penda Lane</p>
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

      {/* External WP Links & Share */}
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

        {externalItems.filter(i => i.visible).map((item, idx) => {
          const Icon = item.icon;
          const buttonClass = isMobile
            ? "flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-lg text-[10px] whitespace-nowrap text-penda-light bg-white border border-penda-border"
            : "flex items-center gap-3 px-4 py-3 rounded-firm mb-2 transition-all font-medium text-sm text-penda-light hover:text-penda-purple hover:bg-white w-full text-left";

          return (
            <a key={idx} href={item.href} className={buttonClass}>
              <Icon size={isMobile ? 18 : 20} />
              <span>{item.label}</span>
            </a>
          );
        })}
        
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
          <a href="/wp-login.php?action=logout&redirect_to=/" className="flex items-center gap-3 px-4 py-3 rounded-firm mb-2 transition-all font-medium text-sm text-penda-light hover:text-penda-purple hover:bg-white w-full text-left">
            <LogOut size={20} />
            <span>Log Out</span>
          </a>
        )}
      </div>
    </nav>
  );
};
