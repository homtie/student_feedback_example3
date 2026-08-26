import React from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { NavigationTab } from '../types';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, activeReviewCourse } = useFeedback();

  if (activeReviewCourse) return null;

  const items: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Home', icon: 'home' },
    { id: 'submit_feedback', label: 'Evaluate', icon: 'rate_review' },
    { id: 'faculty_insights', label: 'Faculty', icon: 'insights' },
    { id: 'add_course', label: 'Add Course', icon: 'add_circle' },
    { id: 'feedbacks', label: 'Reviews', icon: 'chat_bubble' }
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 w-full lg:hidden bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(45,41,38,0.06)] z-40 flex justify-around items-center px-2 py-2 pb-safe border-t border-[#E5E1D9]"
    >
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-2 min-w-[56px] rounded-xl active:scale-90 duration-150 transition-all cursor-pointer ${
              isActive
                ? 'bg-[#F2EDE4] text-[#5A5A40] font-bold shadow-xs'
                : 'text-[#6B665E] hover:bg-[#F2EDE4]/50'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
