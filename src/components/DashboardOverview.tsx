import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { Header } from './Header';

interface DashboardOverviewProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenSearch,
  onOpenNotifications
}) => {
  const {
    courses,
    startReview,
    continueReview,
    setActiveTab,
    completionPercentage,
    completedCount,
    totalCount
  } = useFeedback();

  const [showAllCourses, setShowAllCourses] = useState(false);

  // Filter courses for pending or all
  const displayedCourses = showAllCourses
    ? courses
    : courses.slice(0, 3);

  // SVG circular calculation: circumference = 2 * PI * 40 = ~251.2
  const strokeDasharray = 251.2;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * completionPercentage) / 100;

  return (
    <div id="dashboard-overview" className="max-w-[1280px] w-full mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
        <div>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-[#2D2926] mb-1.5 tracking-tight">
            Hello, Alex!
          </h2>
          <p className="text-base md:text-lg text-[#6B665E] font-normal">Ready to share your academic thoughts?</p>
        </div>

        <Header onOpenSearch={onOpenSearch} onOpenNotifications={onOpenNotifications} />
      </header>

      {/* Hero Section: Feedback Journey */}
      <section className="mb-10">
        <div
          id="hero-journey-card"
          className="bg-white rounded-3xl p-6 md:p-10 ambient-shadow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-pattern-1 border border-[#E5E1D9]"
        >
          <div className="z-10 flex-1">
            <span className="inline-block px-3 py-1 bg-[#F2EDE4] text-[#5A5A40] rounded-full text-xs font-semibold mb-3.5 tracking-wide">
              Current Term • Fall 2026
            </span>
            <h3 className="font-headline text-2xl md:text-3xl font-bold text-[#2D2926] mb-2.5">
              Your Feedback Journey
            </h3>
            <p className="text-sm md:text-base text-[#6B665E] mb-6 max-w-md leading-relaxed">
              You're making steady progress this semester. Completing course reviews helps refine the
              curriculum for your academic community.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="hero-submit-feedback-btn"
                onClick={() => setActiveTab('submit_feedback')}
                className="px-6 py-2.5 bg-[#5A5A40] hover:bg-[#464632] text-white rounded-full text-sm font-semibold btn-shadow active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">rate_review</span>
                <span>Submit Feedback</span>
              </button>
              <button
                id="hero-add-course-btn"
                onClick={() => setActiveTab('add_course')}
                className="px-5 py-2.5 bg-[#F2EDE4] hover:bg-[#E5E1D9] text-[#5A5A40] rounded-full text-sm font-semibold active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add Course</span>
              </button>
              <button
                id="hero-faculty-insights-btn"
                onClick={() => setActiveTab('faculty_insights')}
                className="px-5 py-2.5 bg-[#F2EDE4] hover:bg-[#E5E1D9] text-[#5A5A40] rounded-full text-sm font-semibold active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">insights</span>
                <span>Faculty Analytics</span>
              </button>
            </div>
          </div>

          {/* Circular Tracker */}
          <div className="relative w-44 h-44 flex-shrink-0 z-10 flex items-center justify-center">
            <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 100 100">
              <circle
                className="opacity-40"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="#F2EDE4"
                strokeWidth="10"
              />
              <circle
                className="progress-ring__circle"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="#5A5A40"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="10"
              />
            </svg>
            <div className="text-center z-10 select-none">
              <span className="block font-headline text-3xl font-bold text-[#5A5A40] leading-none">
                {completionPercentage}%
              </span>
              <span className="block text-[10px] font-bold text-[#8A7E6A] uppercase tracking-wider mt-1">
                Complete
              </span>
              <span className="block text-[10px] text-[#6B665E] mt-0.5">
                {completedCount} of {totalCount} Done
              </span>
            </div>
          </div>

          {/* Abstract Decorative Natural Ambient Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4C3A3]/20 rounded-full filter blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-[#A3B18A]/15 rounded-full filter blur-3xl pointer-events-none transform translate-y-1/2"></div>
        </div>
      </section>

      {/* Pending Reviews Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline text-2xl font-bold text-[#2D2926]">
            {showAllCourses ? 'All Enrolled Courses' : 'Pending Reviews'}
          </h3>
          <button
            id="toggle-see-all-courses-btn"
            onClick={() => setShowAllCourses(!showAllCourses)}
            className="text-[#5A5A40] hover:text-[#464632] text-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            {showAllCourses ? 'Show Fewer' : 'See All'}
            <span className="material-symbols-outlined text-[18px]">
              {showAllCourses ? 'expand_less' : 'arrow_forward'}
            </span>
          </button>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map((course) => {
            const isCompleted = course.status === 'completed';
            const isInProgress = course.status === 'in_progress';

            let iconBg = 'bg-[#F2EDE4] text-[#5A5A40]';
            let patternClass = 'bg-pattern-2';

            if (course.colorTheme === 'tertiary') {
              iconBg = 'bg-[#E8E2D5] text-[#6B665E]';
              patternClass = 'bg-pattern-3';
            } else if (course.colorTheme === 'secondary') {
              iconBg = 'bg-[#E2EBD8] text-[#4A5A38]';
              patternClass = 'bg-pattern-1';
            }

            return (
              <div
                key={course.id}
                id={`course-card-${course.id}`}
                className={`bg-white rounded-2xl p-6 ambient-shadow ambient-shadow-hover flex flex-col h-full ${patternClass} relative overflow-hidden group border border-[#E5E1D9]`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} shadow-xs`}>
                    <span className="material-symbols-outlined text-[24px]">{course.icon}</span>
                  </div>

                  {/* Status Badge */}
                  {isCompleted ? (
                    <span className="px-2.5 py-1 bg-[#E2EBD8] text-[#3D5A20] rounded-full text-xs font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>
                      Completed
                    </span>
                  ) : isInProgress ? (
                    <span className="px-2.5 py-1 bg-[#F2EDE4] text-[#5A5A40] rounded-full text-xs font-semibold">
                      In Progress
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-[#FAF9F7] text-[#8A7E6A] rounded-full text-xs font-semibold border border-[#E5E1D9]">
                      Not Started
                    </span>
                  )}
                </div>

                <h4 className="font-headline text-lg font-bold text-[#2D2926] mb-1 group-hover:text-[#5A5A40] transition-colors leading-snug">
                  {course.code}: {course.title}
                </h4>
                <p className="text-xs text-[#6B665E] mb-3 flex-grow font-medium">{course.instructor}</p>

                <div className="flex items-center gap-2 text-xs text-[#6B665E] mb-4">
                  <span className="material-symbols-outlined text-[15px] text-[#8A7E6A]">calendar_today</span>
                  <span className={isInProgress ? 'text-[#8A5A40] font-semibold' : ''}>
                    Deadline: {course.deadline}
                  </span>
                </div>

                {/* Progress bar if In Progress */}
                {isInProgress && (
                  <div className="mb-4">
                    <div className="w-full h-2 bg-[#F2EDE4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5A5A40] rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-[11px] text-[#6B665E] font-medium">
                      <span>{course.progress}% Completed</span>
                    </div>
                  </div>
                )}

                {/* Card Action Buttons */}
                <div className="mt-auto pt-2">
                  {isCompleted ? (
                    <button
                      id={`course-view-fb-${course.id}`}
                      onClick={() => setActiveTab('feedbacks')}
                      className="w-full py-2.5 bg-[#F2EDE4] hover:bg-[#E5E1D9] text-[#5A5A40] rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>View Submission</span>
                    </button>
                  ) : isInProgress ? (
                    <button
                      id={`course-continue-btn-${course.id}`}
                      onClick={() => continueReview(course.id)}
                      className="w-full py-2.5 border-2 border-[#5A5A40] text-[#5A5A40] bg-transparent hover:bg-[#5A5A40]/10 active:scale-95 rounded-full text-xs font-semibold transition-all cursor-pointer"
                    >
                      Continue Review
                    </button>
                  ) : (
                    <button
                      id={`course-start-btn-${course.id}`}
                      onClick={() => startReview(course.id)}
                      className="w-full py-2.5 bg-[#5A5A40] hover:bg-[#464632] text-white rounded-full text-xs font-semibold btn-shadow active:scale-95 transition-all cursor-pointer"
                    >
                      Start Review
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
