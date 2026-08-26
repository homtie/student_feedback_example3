import React from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { NavigationTab } from '../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeReviewCourse, startReview, courses, resetAllData } = useFeedback();

  const handleStartNewReview = () => {
    // Pick the first uncompleted course, or first course
    const pendingCourse = courses.find((c) => c.status !== 'completed') || courses[0];
    if (pendingCourse) {
      startReview(pendingCourse.id);
    }
  };

  const navItems: { id: NavigationTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'submit_feedback', label: 'Submit Feedback', icon: 'rate_review' },
    { id: 'faculty_insights', label: 'Faculty Analytics', icon: 'insights' },
    { id: 'add_course', label: 'Add New Course', icon: 'add_circle' },
    { id: 'feedbacks', label: 'My Feedbacks', icon: 'chat_bubble' },
    { id: 'materials', label: 'Course Materials', icon: 'menu_book' },
    { id: 'help_center', label: 'Help Center', icon: 'help_outline' }
  ];

  return (
    <nav
      id="desktop-sidebar"
      className={`bg-white h-screen w-72 fixed left-0 top-0 hidden lg:flex flex-col border-r border-[#E5E1D9] shadow-[0_4px_20px_rgba(45,41,38,0.02)] z-40 transition-all duration-300 ${
        activeReviewCourse ? 'opacity-40 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="p-6 space-y-4 flex flex-col h-full">
        {/* University Brand Header */}
        <div
          id="brand-header"
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#5A5A40] flex items-center justify-center text-white font-serif text-lg font-bold shadow-xs group-hover:scale-105 transition-transform">
            E
          </div>
          <div>
            <h1 className="font-headline font-bold italic text-lg text-[#5A5A40] leading-tight tracking-tight">
              EduPulse
            </h1>
            <p className="text-[11px] text-[#8A7E6A] font-medium uppercase tracking-wider">Academic Portal</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          id="sidebar-start-review-btn"
          onClick={handleStartNewReview}
          className="w-full mt-2 py-2.5 px-4 bg-[#5A5A40] hover:bg-[#464632] text-white rounded-full font-medium text-sm btn-shadow active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Start New Review</span>
        </button>

        {/* Navigation Tabs */}
        <div className="flex-1 space-y-1.5 mt-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id && !activeReviewCourse;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#F2EDE4] text-[#5A5A40] font-semibold translate-x-1 shadow-xs'
                    : 'text-[#6B665E] hover:bg-[#FAF9F7] hover:text-[#2D2926] hover:translate-x-1'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Current Session Banner (From Natural Tones Spec) */}
        <div className="p-3.5 bg-[#F2EDE4] rounded-xl border border-dashed border-[#8A7E6A]/50">
          <p className="text-[10px] font-bold text-[#8A7E6A] uppercase tracking-wider">Current Session</p>
          <p className="text-xs font-semibold text-[#5A5A40] mt-0.5">Fall 2026 Evaluation</p>
        </div>

        {/* Footer & Demo Reset */}
        <div className="mt-auto pt-3 border-t border-[#E5E1D9] space-y-1">
          <button
            id="sidebar-reset-demo-btn"
            onClick={resetAllData}
            title="Reset demonstration mock data"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[#8A7E6A] hover:text-[#ba1a1a] hover:bg-[#F2EDE4] rounded-lg text-xs font-medium transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset Demo Data</span>
          </button>

          <button
            id="sidebar-signout-btn"
            onClick={() => {
              setActiveTab('overview');
              alert('College Demo Session: Signed in as Alex Morgan (Student ID: 2026-CS-4091).');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[#8A7E6A] hover:text-[#2D2926] hover:bg-[#F2EDE4] rounded-lg text-xs font-medium transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
