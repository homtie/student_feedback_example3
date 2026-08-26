import React from 'react';
import { useFeedback } from '../context/FeedbackContext';

const PROMPT_SUGGESTIONS = [
  'What worked well?',
  'What could be improved?',
  'Instructor communication & office hours',
  'Assignment difficulty and workload'
];

export const ReviewExperienceStep2: React.FC = () => {
  const {
    currentReflection,
    setReflection,
    prevReviewStep,
    submitFeedback,
    isAnonymous,
    setIsAnonymous,
    activeReviewCourse
  } = useFeedback();

  const handlePromptClick = (prompt: string) => {
    if (!currentReflection) {
      setReflection(`${prompt}: `);
    } else {
      setReflection(`${currentReflection}\n\n${prompt}: `);
    }
  };

  return (
    <div id="review-step-2" className="min-h-screen bg-[#F7F5F2] text-[#2D2926] flex flex-col justify-center items-center px-4 py-12 md:py-16 relative overflow-x-hidden animate-in fade-in duration-300">
      {/* Ambient Decorative Natural Shapes */}
      <div className="absolute top-[-100px] right-[-150px] w-[450px] h-[450px] bg-[#D4C3A3]/20 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-50px] left-[-100px] w-[350px] h-[350px] bg-[#A3B18A]/15 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Header & Progress */}
      <div className="w-full max-w-3xl mb-8 text-center relative z-10">
        <h1 className="font-headline text-3xl md:text-5xl font-bold text-[#2D2926] mb-2 tracking-tight">
          Your Written Reflection
        </h1>
        <p className="text-base md:text-lg text-[#6B665E] mb-6">
          Take a moment to share constructive insights on your experience in {activeReviewCourse?.code || 'this course'}.
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#E5E1D9] rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full bg-[#5A5A40] rounded-full transition-all duration-500"
            style={{ width: '66.6%' }}
          ></div>
        </div>
        <p className="text-xs font-semibold text-[#8A7E6A] text-right">Step 2 of 3</p>
      </div>

      {/* Reflection Area Card */}
      <div
        id="reflection-card"
        className="w-full max-w-3xl bg-white rounded-2xl p-6 md:p-10 ambient-shadow relative overflow-hidden border border-[#E5E1D9] z-10"
      >
        {/* Decorative Background Icon */}
        <span
          className="material-symbols-outlined text-[#E5E1D9]/40 absolute top-4 right-4 pointer-events-none select-none hidden sm:block"
          style={{ fontSize: '130px' }}
        >
          edit_note
        </span>

        <div className="relative z-10">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="reflection-textarea"
                className="font-headline font-bold text-base text-[#5A5A40] flex items-center gap-2"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  edit_note
                </span>
                Detailed Feedback
              </label>

              {/* Anonymous Toggle */}
              <label className="flex items-center gap-2 text-xs text-[#6B665E] cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="anonymous-checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-[#5A5A40] focus:ring-[#5A5A40] accent-[#5A5A40]"
                />
                <span>Submit Anonymously</span>
              </label>
            </div>

            {/* Prompts to Consider */}
            <div className="bg-[#F2EDE4] p-4 rounded-xl border border-[#E5E1D9] flex flex-col sm:flex-row gap-3 sm:items-center">
              <span className="text-[11px] font-bold text-[#8A7E6A] uppercase tracking-wider whitespace-nowrap">
                Prompts to consider:
              </span>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptClick(prompt)}
                    className="bg-white hover:bg-[#E5E1D9] text-[#5A5A40] px-3 py-1 rounded-full text-xs font-medium transition-all active:scale-95 cursor-pointer border border-[#E5E1D9]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Reflection Textarea */}
            <div className="relative">
              <textarea
                id="reflection-textarea"
                value={currentReflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Share specific observations, what worked well, and suggestions for future terms..."
                rows={8}
                className="w-full bg-[#FAF9F7] border border-[#E5E1D9] rounded-xl p-5 text-sm md:text-base text-[#2D2926] placeholder:text-[#8A7E6A]/70 focus:ring-2 focus:ring-[#5A5A40] focus:bg-white focus:outline-none transition-all resize-none shadow-xs"
              ></textarea>
              <div className="flex justify-between items-center mt-2 text-xs text-[#8A7E6A]">
                <span>Constructive feedback helps faculty adapt their teaching.</span>
                <span>{currentReflection.length} characters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-3xl mt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 relative z-10">
        <button
          id="step2-back-btn"
          type="button"
          onClick={prevReviewStep}
          className="w-full sm:w-auto px-7 py-2.5 rounded-full border-2 border-[#5A5A40] text-[#5A5A40] hover:bg-[#5A5A40]/10 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </button>

        <button
          id="step2-submit-btn"
          type="button"
          onClick={submitFeedback}
          className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#5A5A40] hover:bg-[#464632] text-white font-semibold text-sm btn-shadow active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Submit Feedback</span>
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </div>
  );
};
