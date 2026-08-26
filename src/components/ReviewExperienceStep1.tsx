import React from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { FeedbackRatings } from '../types';

interface RatingCategoryConfig {
  key: keyof FeedbackRatings;
  title: string;
  description: string;
}

const RATING_CATEGORIES: RatingCategoryConfig[] = [
  {
    key: 'teachingQuality',
    title: 'Teaching Quality',
    description: 'Clarity of instruction, approachability, and expertise.'
  },
  {
    key: 'courseContent',
    title: 'Course Content',
    description: 'Relevance, structure, and difficulty of the material.'
  },
  {
    key: 'communication',
    title: 'Communication',
    description: 'Timeliness of announcements and feedback on assignments.'
  },
  {
    key: 'studentEngagement',
    title: 'Student Engagement',
    description: 'Opportunities for participation and peer interaction.'
  },
  {
    key: 'overallExperience',
    title: 'Overall Experience',
    description: 'Your general feeling and satisfaction with the course.'
  }
];

const SENTIMENT_ICONS = [
  { value: 1, icon: 'sentiment_very_dissatisfied', label: 'Very Dissatisfied' },
  { value: 2, icon: 'sentiment_dissatisfied', label: 'Dissatisfied' },
  { value: 3, icon: 'sentiment_neutral', label: 'Neutral' },
  { value: 4, icon: 'sentiment_satisfied', label: 'Satisfied' },
  { value: 5, icon: 'sentiment_very_satisfied', label: 'Very Satisfied' }
];

export const ReviewExperienceStep1: React.FC = () => {
  const { activeReviewCourse, currentRatings, setRating, nextReviewStep, returnToDashboard } =
    useFeedback();

  if (!activeReviewCourse) return null;

  // Check if at least one or all ratings are provided, or provide defaults on next
  const areAllRated = (Object.values(currentRatings) as number[]).every((v) => v > 0);

  const handleNext = () => {
    // If some ratings are unset, default unselected ones to 4 (Satisfied) for smooth demonstration
    RATING_CATEGORIES.forEach((cat) => {
      if (!currentRatings[cat.key]) {
        setRating(cat.key, 4);
      }
    });
    nextReviewStep();
  };

  return (
    <div id="review-step-1" className="min-h-screen bg-[#F7F5F2] text-[#2D2926] flex flex-col pb-36 animate-in fade-in duration-300">
      {/* Fixed/Sticky Top Progress Bar */}
      <div className="w-full pt-4 pb-4 sticky top-0 z-30 bg-[#F7F5F2]/90 backdrop-blur-md border-b border-[#E5E1D9]">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-2 text-xs font-semibold">
            <span className="text-[#5A5A40] uppercase tracking-wider">General Rating</span>
            <span className="text-[#8A7E6A]">Step 1 of 3</span>
          </div>
          <div className="h-2.5 w-full bg-[#E5E1D9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5A5A40] rounded-full transition-all duration-500"
              style={{ width: '33.33%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-12 w-full">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-[#2D2926] mb-2 tracking-tight">
            Course Experience: {activeReviewCourse.code}
          </h1>
          <p className="text-base md:text-lg text-[#6B665E] leading-relaxed">
            Please rate your overall experience in various aspects of the course. Your thoughtful feedback helps
            improve our learning community.
          </p>
        </div>

        {/* Rating Cards Grid */}
        <div className="grid grid-cols-1 gap-5">
          {RATING_CATEGORIES.map((category) => {
            const selectedVal = currentRatings[category.key];

            return (
              <div
                key={category.key}
                id={`rating-card-${category.key}`}
                className="bg-white rounded-2xl p-6 md:p-8 ambient-shadow ambient-shadow-hover flex flex-col md:flex-row items-center justify-between gap-6 border border-[#E5E1D9]"
              >
                <div className="text-center md:text-left md:w-5/12">
                  <h3 className="font-headline text-xl font-bold text-[#2D2926] mb-1">
                    {category.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#6B665E] leading-relaxed">{category.description}</p>
                </div>

                <div className="flex justify-center items-center gap-2 md:gap-3 flex-1 flex-wrap">
                  {SENTIMENT_ICONS.map((item) => {
                    const isSelected = selectedVal === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        id={`rating-${category.key}-${item.value}`}
                        onClick={() => setRating(category.key, item.value)}
                        title={`${category.title}: ${item.label}`}
                        className={`rating-bubble w-12 h-12 md:w-13 md:h-13 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'selected bg-[#5A5A40] text-white border-[#5A5A40] shadow-md scale-110'
                            : 'bg-[#F2EDE4] text-[#6B665E] border-transparent hover:bg-[#E5E1D9] hover:text-[#5A5A40]'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[24px] md:text-[28px]"
                          style={isSelected ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >
                          {item.icon}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F7F5F2]/95 backdrop-blur-xl p-4 md:px-12 flex justify-between items-center z-40 border-t border-[#E5E1D9] shadow-lg">
        <button
          id="step1-cancel-btn"
          type="button"
          onClick={returnToDashboard}
          className="px-5 py-2.5 rounded-full border border-[#E5E1D9] text-[#6B665E] hover:bg-[#F2EDE4] text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
          <span>Cancel</span>
        </button>

        <div className="flex items-center gap-4">
          {!areAllRated && (
            <span className="hidden sm:inline text-xs text-[#8A7E6A]">
              Select ratings to continue
            </span>
          )}
          <button
            id="step1-next-btn"
            type="button"
            onClick={handleNext}
            className="bg-[#5A5A40] hover:bg-[#464632] text-white font-semibold text-sm md:text-base px-7 md:px-9 py-2.5 md:py-3 rounded-full flex items-center gap-2 btn-shadow active:scale-95 transition-all cursor-pointer"
          >
            <span>Next Step</span>
            <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
