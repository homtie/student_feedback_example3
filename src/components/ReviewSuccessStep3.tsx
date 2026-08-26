import React, { useEffect } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import confetti from 'canvas-confetti';

export const ReviewSuccessStep3: React.FC = () => {
  const { returnToDashboard, completedCount, totalCount, completionPercentage } =
    useFeedback();

  useEffect(() => {
    // Fire celebratory natural tones confetti on mount
    const end = Date.now() + 1.2 * 1000;
    const interval: NodeJS.Timeout = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() * 0.4 + 0.1 },
        colors: ['#5A5A40', '#D4C3A3', '#8A7E6A', '#A3B18A', '#C2B69D']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="review-step-3"
      className="min-h-screen bg-[#F7F5F2] text-[#2D2926] flex items-center justify-center p-4 md:p-8 relative overflow-hidden animate-in fade-in duration-300"
    >
      {/* Ambient background natural tones blobs */}
      <div className="absolute w-[500px] h-[500px] bg-[#D4C3A3]/25 rounded-full filter blur-3xl top-10 left-10 pointer-events-none blob-morph"></div>
      <div className="absolute w-[400px] h-[400px] bg-[#A3B18A]/20 rounded-full filter blur-3xl bottom-10 right-10 pointer-events-none blob-morph"></div>

      {/* Success Container Card */}
      <div
        id="success-card"
        className="glass-panel w-full max-w-2xl rounded-3xl p-8 md:p-12 ambient-shadow relative z-10 text-center overflow-hidden border border-[#E5E1D9]"
      >
        {/* Celebration Graphic */}
        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#D4C3A3]/30 rounded-full animate-ping opacity-25"></div>
          <div className="absolute inset-2 bg-gradient-to-tr from-[#D4C3A3]/30 to-[#A3B18A]/30 rounded-full"></div>
          <div className="w-20 h-20 bg-[#5A5A40] text-white rounded-full shadow-[0_8px_24px_rgba(90,90,64,0.25)] flex items-center justify-center z-10 relative">
            <span
              className="material-symbols-outlined text-4xl text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              task_alt
            </span>
          </div>
        </div>

        {/* Typography */}
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-[#2D2926] mb-2 tracking-tight">
          Feedback Submitted Successfully
        </h2>
        <p className="text-base md:text-lg text-[#6B665E] mb-8 max-w-md mx-auto leading-relaxed">
          Your thoughtful perspective strengthens our academic community. Thank you for your review, Alex!
        </p>

        {/* Journey Update Card */}
        <div className="bg-[#FAF9F7] rounded-2xl p-6 ambient-shadow mb-8 text-left border border-[#E5E1D9] max-w-md mx-auto hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm text-[#2D2926] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5A5A40] text-[18px]">explore</span>
              Journey Progress
            </span>
            <span className="text-xs font-bold text-[#5A5A40] bg-[#F2EDE4] px-3 py-1 rounded-full border border-[#E5E1D9]">
              {completionPercentage}% Complete
            </span>
          </div>

          {/* Custom Progress Bar */}
          <div className="h-2.5 w-full bg-[#E5E1D9] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-[#5A5A40] rounded-full transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          <p className="text-xs text-[#8A7E6A]">
            You've completed {completedCount} of {totalCount} required course reviews this term.
          </p>
        </div>

        {/* CTA Return */}
        <button
          id="success-return-dashboard-btn"
          onClick={returnToDashboard}
          className="bg-[#5A5A40] hover:bg-[#464632] text-white font-semibold text-sm md:text-base py-3.5 px-9 rounded-full btn-shadow active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto w-full sm:w-auto min-w-[220px] cursor-pointer"
        >
          <span>Return to Dashboard</span>
          <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
