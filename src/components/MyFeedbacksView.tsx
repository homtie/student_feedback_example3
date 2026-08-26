import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { FeedbackSubmission } from '../types';
import { Header } from './Header';

interface MyFeedbacksViewProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const MyFeedbacksView: React.FC<MyFeedbacksViewProps> = ({
  onOpenSearch,
  onOpenNotifications
}) => {
  const { feedbacks, courses, startReview } = useFeedback();
  const [selectedSubmission, setSelectedSubmission] = useState<FeedbackSubmission | null>(null);

  const pendingCourses = courses.filter((c) => c.status !== 'completed');

  return (
    <div id="my-feedbacks-view" className="max-w-[1280px] w-full mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
        <div>
          <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
            Evaluation Archive
          </span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-[#2D2926] tracking-tight mt-1">
            My Feedbacks
          </h2>
          <p className="text-sm md:text-base text-[#6B665E] mt-1">
            Review your submitted course evaluations and pending module surveys.
          </p>
        </div>

        <Header onOpenSearch={onOpenSearch} onOpenNotifications={onOpenNotifications} />
      </header>

      {/* Grid of Feedbacks and Pending Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Submitted Feedbacks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold text-[#2D2926]">
              Submitted Evaluations ({feedbacks.length})
            </h3>
            <span className="text-xs text-[#8A7E6A]">Confidential & Anonymized</span>
          </div>

          {feedbacks.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center ambient-shadow border border-[#E5E1D9]">
              <span className="material-symbols-outlined text-4xl text-[#8A7E6A] mb-2">
                rate_review
              </span>
              <h4 className="font-semibold text-[#2D2926]">No Evaluations Submitted Yet</h4>
              <p className="text-sm text-[#6B665E] mt-1 mb-4">
                Start by rating your enrolled courses to complete your term journey.
              </p>
              {pendingCourses.length > 0 && (
                <button
                  onClick={() => startReview(pendingCourses[0].id)}
                  className="px-6 py-2.5 bg-[#5A5A40] text-white rounded-full text-xs font-semibold btn-shadow cursor-pointer"
                >
                  Start {pendingCourses[0].code} Evaluation
                </button>
              )}
            </div>
          ) : (
            feedbacks.map((fb) => (
              <div
                key={fb.id}
                id={`feedback-card-${fb.id}`}
                className="bg-white rounded-2xl p-6 ambient-shadow hover:shadow-md transition-all border border-[#E5E1D9] flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-0.5 bg-[#F2EDE4] text-[#5A5A40] rounded-full text-xs font-bold border border-[#E5E1D9]">
                      {fb.courseCode}
                    </span>
                    <span className="text-xs text-[#8A7E6A]">
                      Submitted on {new Date(fb.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {fb.isAnonymous && (
                      <span className="px-2 py-0.5 bg-[#FAF9F7] text-[#6B665E] text-[10px] font-semibold rounded-full border border-[#E5E1D9]">
                        Anonymous
                      </span>
                    )}
                  </div>

                  <h4 className="font-headline text-lg font-bold text-[#2D2926] mb-0.5">
                    {fb.courseTitle}
                  </h4>
                  <p className="text-xs text-[#6B665E] mb-3">Instructor: {fb.instructor}</p>

                  <p className="text-xs md:text-sm text-[#2D2926] bg-[#FAF9F7] p-3.5 rounded-xl border border-[#E5E1D9] italic leading-relaxed">
                    "{fb.writtenReflection}"
                  </p>
                </div>

                <div className="flex md:flex-col justify-between items-end border-t md:border-t-0 md:border-l border-[#E5E1D9] pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                  <div className="text-right">
                    <span className="text-[10px] text-[#8A7E6A] block uppercase tracking-wider font-bold">
                      Overall Score
                    </span>
                    <div className="flex items-center justify-end gap-1 text-[#5A5A40] font-serif font-bold text-xl">
                      <span>{fb.ratings.overallExperience}</span>
                      <span className="text-xs text-[#8A7E6A]">/ 5.0</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSubmission(fb)}
                    className="px-4 py-1.5 bg-[#F2EDE4] hover:bg-[#E5E1D9] text-[#5A5A40] text-xs font-semibold rounded-full transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Pending Course Deadlines */}
        <div className="space-y-6">
          <h3 className="font-headline text-xl font-bold text-[#2D2926]">Pending Evaluations</h3>

          <div className="bg-white rounded-2xl p-6 ambient-shadow border border-[#E5E1D9] space-y-4">
            {pendingCourses.length === 0 ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-3xl text-[#3D5A20] mb-1">
                  task_alt
                </span>
                <p className="text-sm font-semibold text-[#2D2926]">All Evaluations Completed</p>
                <p className="text-xs text-[#8A7E6A] mt-0.5">
                  Great work! You've provided feedback for all enrolled courses this term.
                </p>
              </div>
            ) : (
              pendingCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-[#FAF9F7] border border-[#E5E1D9] flex items-center justify-between gap-3 hover:border-[#5A5A40]/40 transition-all"
                >
                  <div>
                    <span className="text-xs font-bold text-[#5A5A40] block">{c.code}</span>
                    <h5 className="text-sm font-semibold text-[#2D2926]">{c.title}</h5>
                    <span className="text-[11px] text-[#8A5A40] font-medium">Due: {c.deadline}</span>
                  </div>

                  <button
                    onClick={() => startReview(c.id)}
                    className="px-3.5 py-1.5 bg-[#5A5A40] hover:bg-[#464632] text-white text-xs font-semibold rounded-full btn-shadow transition-all cursor-pointer whitespace-nowrap"
                  >
                    {c.status === 'in_progress' ? 'Continue' : 'Review'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full ambient-shadow animate-in zoom-in-95 duration-200 border border-[#E5E1D9]">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-[#E5E1D9]">
              <div>
                <span className="px-2.5 py-0.5 bg-[#F2EDE4] text-[#5A5A40] rounded-full text-xs font-bold border border-[#E5E1D9]">
                  {selectedSubmission.courseCode}
                </span>
                <h3 className="font-headline text-xl font-bold text-[#2D2926] mt-1">
                  {selectedSubmission.courseTitle}
                </h3>
                <p className="text-xs text-[#6B665E]">Instructor: {selectedSubmission.instructor}</p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 rounded-full text-[#8A7E6A] hover:text-[#2D2926] hover:bg-[#F2EDE4] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold text-[#8A7E6A] uppercase tracking-wider">
                Category Ratings
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FAF9F7] border border-[#E5E1D9]">
                  <span className="text-[#6B665E] block">Teaching Quality</span>
                  <span className="font-bold text-[#5A5A40] text-sm">
                    {selectedSubmission.ratings.teachingQuality} / 5
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F7] border border-[#E5E1D9]">
                  <span className="text-[#6B665E] block">Course Content</span>
                  <span className="font-bold text-[#5A5A40] text-sm">
                    {selectedSubmission.ratings.courseContent} / 5
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F7] border border-[#E5E1D9]">
                  <span className="text-[#6B665E] block">Communication</span>
                  <span className="font-bold text-[#5A5A40] text-sm">
                    {selectedSubmission.ratings.communication} / 5
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F7] border border-[#E5E1D9]">
                  <span className="text-[#6B665E] block">Engagement</span>
                  <span className="font-bold text-[#5A5A40] text-sm">
                    {selectedSubmission.ratings.studentEngagement} / 5
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#8A7E6A] uppercase tracking-wider mb-1.5">
                  Written Feedback
                </h4>
                <p className="text-xs md:text-sm text-[#2D2926] bg-[#FAF9F7] p-4 rounded-xl border border-[#E5E1D9] italic leading-relaxed">
                  "{selectedSubmission.writtenReflection}"
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedSubmission(null)}
              className="w-full py-2.5 bg-[#5A5A40] hover:bg-[#464632] text-white rounded-full text-sm font-semibold btn-shadow transition-all cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
