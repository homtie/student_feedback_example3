import React, { useState } from 'react';
import { FeedbackProvider, useFeedback } from './context/FeedbackContext';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { FacultyAnalyticsView } from './components/FacultyAnalyticsView';
import { FacultyInsightsView } from './components/FacultyInsightsView';
import { SubmitCourseFeedbackView } from './components/SubmitCourseFeedbackView';
import { AddCourseFormView } from './components/AddCourseFormView';
import { MyFeedbacksView } from './components/MyFeedbacksView';
import { CourseMaterialsView } from './components/CourseMaterialsView';
import { HelpCenterView } from './components/HelpCenterView';
import { ReviewExperienceStep1 } from './components/ReviewExperienceStep1';
import { ReviewExperienceStep2 } from './components/ReviewExperienceStep2';
import { ReviewSuccessStep3 } from './components/ReviewSuccessStep3';
import { MobileNav } from './components/MobileNav';
import { SearchModal } from './components/SearchModal';
import { NotificationsModal } from './components/NotificationsModal';

const AppContent: React.FC = () => {
  const { activeReviewCourse, reviewStep, activeTab } = useFeedback();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // If in review experience flow
  if (activeReviewCourse) {
    if (reviewStep === 1) {
      return <ReviewExperienceStep1 />;
    }
    if (reviewStep === 2) {
      return <ReviewExperienceStep2 />;
    }
    if (reviewStep === 3) {
      return <ReviewSuccessStep3 />;
    }
  }

  // Normal Dashboard & Views flow
  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#2D2926] flex flex-col lg:flex-row relative selection:bg-[#5A5A40] selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 pt-20 lg:pt-8 px-4 md:px-8 pb-28 lg:pb-12 max-w-[1280px] w-full mx-auto">
        {activeTab === 'overview' && (
          <DashboardOverview
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotifOpen(true)}
          />
        )}
        {activeTab === 'submit_feedback' && (
          <SubmitCourseFeedbackView
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotifOpen(true)}
          />
        )}
        {activeTab === 'add_course' && (
          <AddCourseFormView
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotifOpen(true)}
          />
        )}
        {activeTab === 'faculty_insights' && (
          <FacultyAnalyticsView
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotifOpen(true)}
          />
        )}
        {activeTab === 'feedbacks' && (
          <MyFeedbacksView
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotifOpen(true)}
          />
        )}
        {activeTab === 'materials' && (
          <CourseMaterialsView
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotifOpen(true)}
          />
        )}
        {activeTab === 'help_center' && (
          <HelpCenterView
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotifOpen(true)}
          />
        )}
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Global Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationsModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <FeedbackProvider>
      <AppContent />
    </FeedbackProvider>
  );
}
