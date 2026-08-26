import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenNotifications }) => {
  const { notifications, setActiveTab } = useFeedback();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [showProfileCard, setShowProfileCard] = useState(false);

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <header
        id="mobile-header"
        className="lg:hidden flex justify-between items-center px-4 h-16 bg-[#F7F5F2]/90 backdrop-blur-xl shadow-xs fixed top-0 left-0 w-full z-40 border-b border-[#E5E1D9]"
      >
        <div
          id="mobile-brand"
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#5A5A40] flex items-center justify-center text-white font-serif font-bold text-base shadow-xs">
            E
          </div>
          <span className="font-headline text-lg font-bold italic text-[#5A5A40]">EduPulse</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="mobile-search-btn"
            onClick={onOpenSearch}
            className="text-[#6B665E] hover:text-[#5A5A40] p-2 rounded-full hover:bg-[#F2EDE4] active:scale-95 transition-all"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          <button
            id="mobile-notifications-btn"
            onClick={onOpenNotifications}
            className="text-[#6B665E] hover:text-[#5A5A40] p-2 rounded-full hover:bg-[#F2EDE4] active:scale-95 transition-all relative"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8A7E6A] rounded-full ring-2 ring-white"></span>
            )}
          </button>
          <button
            id="mobile-profile-btn"
            onClick={() => setShowProfileCard(!showProfileCard)}
            className="p-0.5 rounded-full ring-2 ring-[#E5E1D9] active:scale-95 transition-transform"
          >
            <div className="w-7 h-7 rounded-full bg-[#5A5A40] flex items-center justify-center text-white font-serif font-semibold text-xs">
              AM
            </div>
          </button>
        </div>
      </header>

      {/* Desktop Top Header Actions */}
      <div id="desktop-header-actions" className="hidden lg:flex items-center gap-3 bg-white rounded-full px-4 py-1.5 ambient-shadow border border-[#E5E1D9]">
        <button
          id="desktop-search-btn"
          onClick={onOpenSearch}
          className="p-2 text-[#6B665E] hover:text-[#5A5A40] hover:bg-[#F2EDE4] rounded-full transition-colors cursor-pointer"
          title="Search courses and evaluations"
        >
          <span className="material-symbols-outlined text-[19px]">search</span>
        </button>
        <button
          id="desktop-notifications-btn"
          onClick={onOpenNotifications}
          className="p-2 text-[#6B665E] hover:text-[#5A5A40] hover:bg-[#F2EDE4] rounded-full transition-colors cursor-pointer relative"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[19px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8A7E6A] rounded-full ring-2 ring-white"></span>
          )}
        </button>
        <div className="h-5 w-px bg-[#E5E1D9] mx-1"></div>
        <div
          id="desktop-profile-toggle"
          onClick={() => setShowProfileCard(!showProfileCard)}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-full bg-[#5A5A40] flex items-center justify-center text-white font-serif font-semibold text-xs shadow-xs group-hover:ring-2 group-hover:ring-[#5A5A40]/50 transition-all">
            AM
          </div>
          <div className="text-left pr-1">
            <p className="text-xs font-semibold text-[#2D2926] leading-none">Alex Morgan</p>
            <p className="text-[10px] text-[#8A7E6A] leading-tight">Student</p>
          </div>
        </div>
      </div>

      {/* Profile Card Popup */}
      {showProfileCard && (
        <div
          id="profile-dropdown-card"
          className="absolute top-20 right-4 lg:right-10 z-50 w-72 bg-white rounded-2xl p-5 ambient-shadow border border-[#E5E1D9] animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5E1D9]">
            <div className="w-11 h-11 rounded-full bg-[#5A5A40] text-white flex items-center justify-center font-serif font-bold text-sm shadow-inner">
              AM
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#2D2926]">Alex Morgan</h4>
              <p className="text-xs text-[#6B665E]">alex.morgan@university.edu</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#F2EDE4] text-[#5A5A40] text-[10px] font-semibold rounded-full">
                Class of 2027 • CS Major
              </span>
            </div>
          </div>

          <div className="py-3 space-y-2 text-xs text-[#6B665E]">
            <div className="flex justify-between">
              <span>Term:</span>
              <span className="font-semibold text-[#2D2926]">Fall 2026</span>
            </div>
            <div className="flex justify-between">
              <span>Evaluation Status:</span>
              <span className="font-semibold text-[#5A5A40]">Active Journey</span>
            </div>
          </div>

          <button
            id="profile-close-btn"
            onClick={() => setShowProfileCard(false)}
            className="w-full mt-2 py-2 bg-[#F2EDE4] hover:bg-[#E5E1D9] text-[#2D2926] rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};
