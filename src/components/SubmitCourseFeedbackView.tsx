import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { Header } from './Header';
import { FeedbackRatings } from '../types';

interface SubmitCourseFeedbackViewProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

const RATING_DESCRIPTIONS: Record<number, { label: string; desc: string; color: string }> = {
  1: { label: 'Needs Substantial Improvement', desc: 'Critical issues in pacing, clarity, or materials.', color: 'text-red-700' },
  2: { label: 'Fair / Below Expectations', desc: 'Some topics understood, but needs refinement in delivery.', color: 'text-amber-700' },
  3: { label: 'Good / Met Expectations', desc: 'Satisfactory instruction, topics covered adequately.', color: 'text-[#8A7E6A]' },
  4: { label: 'Very Good / Above Average', desc: 'Engaging lectures, supportive feedback, well-organized.', color: 'text-[#5A5A40]' },
  5: { label: 'Exceptional & Inspiring', desc: 'Outstanding mentorship, crystal-clear concepts, inspiring curriculum.', color: 'text-[#3D5A20]' }
};

const SUGGESTED_TAGS = [
  'Clear Explanations',
  'Helpful Office Hours',
  'Challenging Labs',
  'Pacing Was Great',
  'Needs More Practice Problems',
  'Thought-Provoking Discussions',
  'Organized Lecture Slides',
  'Prompt Assignment Feedback'
];

export const SubmitCourseFeedbackView: React.FC<SubmitCourseFeedbackViewProps> = ({
  onOpenSearch,
  onOpenNotifications
}) => {
  const { courses, feedbacks, submitCourseFeedbackDirect, setActiveTab, setFacultyCourseId } = useFeedback();

  // Form State
  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    // Default to the first non-completed course, or first course
    const pending = courses.find((c) => c.status !== 'completed');
    return pending ? pending.id : courses[0]?.id || '';
  });
  
  const [starRating, setStarRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comments, setComments] = useState<string>('');
  
  // Optional granular category ratings
  const [detailedRatings, setDetailedRatings] = useState<FeedbackRatings>({
    teachingQuality: 5,
    courseContent: 5,
    communication: 5,
    studentEngagement: 5,
    overallExperience: 5
  });

  const [showDetailedDimensions, setShowDetailedDimensions] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [studentName, setStudentName] = useState<string>('Alex Morgan');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Clear Explanations']);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [lastSubmittedCourseCode, setLastSubmittedCourseCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAppendCommentTag = (tag: string) => {
    handleTagToggle(tag);
    if (!comments.includes(tag)) {
      setComments((prev) => (prev ? `${prev} • ${tag}` : tag));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedCourseId) {
      setErrorMessage('Please select a course to evaluate.');
      return;
    }

    if (starRating < 1 || starRating > 5) {
      setErrorMessage('Please provide a star rating between 1 and 5.');
      return;
    }

    if (!comments.trim()) {
      setErrorMessage('Please write a brief comment or reflection on your experience.');
      return;
    }

    // Submit and persist to localStorage
    submitCourseFeedbackDirect({
      courseId: selectedCourseId,
      overallRating: starRating,
      ratings: showDetailedDimensions
        ? detailedRatings
        : {
            teachingQuality: starRating,
            courseContent: starRating,
            communication: starRating,
            studentEngagement: starRating,
            overallExperience: starRating
          },
      writtenReflection: comments,
      isAnonymous,
      studentName: isAnonymous ? 'Anonymous Student' : studentName,
      tags: selectedTags
    });

    setLastSubmittedCourseCode(selectedCourse?.code || 'Course');
    setFormSubmitted(true);
  };

  const handleResetForm = () => {
    setFormSubmitted(false);
    setComments('');
    setStarRating(5);
    setSelectedTags(['Clear Explanations']);
    const pending = courses.find((c) => c.status !== 'completed');
    if (pending) setSelectedCourseId(pending.id);
  };

  return (
    <div id="submit-course-feedback-view" className="max-w-[1280px] w-full mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
        <div>
          <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
            Student Voice & Evaluation
          </span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-[#2D2926] tracking-tight mt-1">
            Submit Course Feedback
          </h2>
          <p className="text-sm md:text-base text-[#6B665E] mt-1">
            Evaluate your enrolled courses, provide star ratings, and leave constructive reflections.
          </p>
        </div>

        <Header onOpenSearch={onOpenSearch} onOpenNotifications={onOpenNotifications} />
      </header>

      {/* Success Banner if just submitted */}
      {formSubmitted ? (
        <div className="bg-white rounded-3xl p-8 md:p-12 ambient-shadow border border-[#A3B18A] text-center max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-[#E2EBD8] text-[#3D5A20] rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">task_alt</span>
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-[#F2EDE4] text-[#5A5A40] rounded-full text-xs font-bold uppercase tracking-wider">
              Feedback Recorded & Persisted
            </span>
            <h3 className="font-headline text-2xl md:text-3xl font-bold text-[#2D2926]">
              Thank you for evaluating {lastSubmittedCourseCode}!
            </h3>
            <p className="text-sm text-[#6B665E] max-w-md mx-auto">
              Your confidential feedback has been saved to the course evaluation system and linked to the instructor's academic insights.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#E5E1D9]">
            <button
              onClick={() => setActiveTab('feedbacks')}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#5A5A40] hover:bg-[#464632] text-white rounded-full text-xs font-semibold btn-shadow transition-all cursor-pointer"
            >
              View in My Feedbacks ({feedbacks.length})
            </button>
            <button
              onClick={() => setActiveTab('faculty_insights')}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#F2EDE4] hover:bg-[#E5E1D9] text-[#5A5A40] rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              View Faculty Analytics
            </button>
            <button
              onClick={handleResetForm}
              className="w-full sm:w-auto px-5 py-2.5 text-[#6B665E] hover:text-[#2D2926] rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              Submit Another Review
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feedback Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-10 ambient-shadow border border-[#E5E1D9]">
            <form onSubmit={handleSubmit} className="space-y-8">
              {errorMessage && (
                <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Course Selection */}
              <div>
                <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2">
                  1. Select Enrolled Course <span className="text-red-500">*</span>
                </label>
                
                <div className="relative">
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full p-4 bg-[#FAF9F7] border border-[#E5E1D9] rounded-2xl text-sm font-semibold text-[#2D2926] focus:ring-2 focus:ring-[#5A5A40] focus:outline-none cursor-pointer appearance-none pr-10"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.title} ({c.instructor}) {c.status === 'completed' ? '✓ (Evaluated)' : '• Due ' + c.deadline}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#8A7E6A]">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>

                {/* Quick Course Cards Bar */}
                <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {courses.map((c) => {
                    const isSelected = c.id === selectedCourseId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCourseId(c.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#5A5A40] text-white btn-shadow'
                            : 'bg-[#F2EDE4] text-[#6B665E] hover:bg-[#E5E1D9]'
                        }`}
                      >
                        <span>{c.code}</span>
                        {c.status === 'completed' && <span className="text-[10px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Star Rating (1-5 stars) */}
              <div className="pt-4 border-t border-[#E5E1D9]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
                    2. Overall Course Star Rating <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-xs font-bold ${RATING_DESCRIPTIONS[hoverRating || starRating]?.color}`}>
                    {starRating} / 5.0 — {RATING_DESCRIPTIONS[hoverRating || starRating]?.label}
                  </span>
                </div>

                {/* Star Buttons */}
                <div className="flex items-center gap-2 md:gap-3 bg-[#FAF9F7] p-5 rounded-2xl border border-[#E5E1D9]">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || starRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setStarRating(star);
                          setDetailedRatings((prev) => ({
                            ...prev,
                            overallExperience: star
                          }));
                        }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="group p-1.5 md:p-2 rounded-xl hover:bg-white/80 transition-all cursor-pointer active:scale-90"
                        aria-label={`Rate ${star} star`}
                      >
                        <span
                          className={`material-symbols-outlined text-3xl md:text-4xl transition-all ${
                            isFilled
                              ? 'text-[#5A5A40] scale-110 drop-shadow-xs'
                              : 'text-[#D4C3A3] hover:text-[#5A5A40]/60'
                          }`}
                          style={{ fontVariationSettings: isFilled ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400" }}
                        >
                          star
                        </span>
                      </button>
                    );
                  })}

                  <div className="ml-auto hidden sm:block text-right">
                    <span className="text-[11px] text-[#8A7E6A] block">Current Rating</span>
                    <span className="font-serif font-bold text-xl text-[#5A5A40]">{starRating}.0 Stars</span>
                  </div>
                </div>

                <p className="text-xs text-[#8A7E6A] mt-2 italic">
                  {RATING_DESCRIPTIONS[hoverRating || starRating]?.desc}
                </p>

                {/* Toggle Detailed Dimensions */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowDetailedDimensions(!showDetailedDimensions)}
                    className="text-xs font-bold text-[#5A5A40] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showDetailedDimensions ? 'Hide' : 'Add'} Detailed Dimension Ratings (Teaching, Content, Communication, Engagement)</span>
                    <span className="material-symbols-outlined text-[16px]">
                      {showDetailedDimensions ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {showDetailedDimensions && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#FAF9F7] border border-[#E5E1D9] animate-in fade-in">
                      {(
                        [
                          { key: 'teachingQuality', label: 'Teaching Quality' },
                          { key: 'courseContent', label: 'Course Content & Structure' },
                          { key: 'communication', label: 'Instructor Communication' },
                          { key: 'studentEngagement', label: 'Classroom Engagement' }
                        ] as const
                      ).map(({ key, label }) => (
                        <div key={key} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-[#2D2926]">{label}</span>
                            <span className="font-bold text-[#5A5A40]">{detailedRatings[key]} / 5</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setDetailedRatings({ ...detailedRatings, [key]: val })}
                                className={`flex-1 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                  detailedRatings[key] === val
                                    ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                                    : 'bg-white text-[#6B665E] border-[#E5E1D9] hover:bg-[#F2EDE4]'
                                }`}
                              >
                                {val}★
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Written Comments Textarea */}
              <div className="pt-4 border-t border-[#E5E1D9]">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
                    3. Written Comments & Suggestions <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-[#8A7E6A]">{comments.length} characters</span>
                </div>

                <textarea
                  rows={5}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Share what worked well, which lectures stood out, or specific suggestions for improving course pace, homework, and office hours..."
                  className="w-full p-4 bg-[#FAF9F7] border border-[#E5E1D9] rounded-2xl text-sm text-[#2D2926] focus:ring-2 focus:ring-[#5A5A40] focus:outline-none resize-none leading-relaxed"
                ></textarea>

                {/* Quick Topic Chips */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-[#8A7E6A] uppercase tracking-wider block mb-1.5">
                    Suggested topics to include (click to add):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleAppendCommentTag(tag)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#E2EBD8] text-[#3D5A20] border-[#A3B18A]'
                              : 'bg-[#FAF9F7] text-[#6B665E] border-[#E5E1D9] hover:border-[#5A5A40]'
                          }`}
                        >
                          + {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. Anonymity & Student Identity */}
              <div className="pt-4 border-t border-[#E5E1D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF9F7] p-5 rounded-2xl border">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                      isAnonymous
                        ? 'bg-[#5A5A40] border-[#5A5A40] text-white'
                        : 'bg-white border-[#8A7E6A] text-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </button>
                  <div>
                    <span className="text-xs font-bold text-[#2D2926] block">Submit Anonymously</span>
                    <span className="text-[11px] text-[#6B665E]">
                      Your name and student ID will never be shared with faculty.
                    </span>
                  </div>
                </div>

                {!isAnonymous && (
                  <div className="w-full sm:w-56">
                    <label className="block text-[10px] uppercase font-bold text-[#8A7E6A] mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full p-2 bg-white border border-[#E5E1D9] rounded-xl text-xs text-[#2D2926] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    />
                  </div>
                )}
              </div>

              {/* Form Submission Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <span className="text-xs text-[#8A7E6A]">
                  🔒 Stored safely in local state and encrypted evaluation record.
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#5A5A40] hover:bg-[#464632] text-white text-sm font-semibold rounded-full btn-shadow transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Submit Course Feedback</span>
                </button>
              </div>
            </form>
          </div>

          {/* Selected Course Context Card */}
          <div className="lg:col-span-4 space-y-6">
            {selectedCourse ? (
              <div className="bg-white rounded-3xl p-6 ambient-shadow border border-[#E5E1D9] space-y-4">
                <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider block">
                  Course Being Evaluated
                </span>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F2EDE4] text-[#5A5A40] flex items-center justify-center shrink-0 border border-[#E5E1D9]">
                    <span className="material-symbols-outlined text-2xl">{selectedCourse.icon}</span>
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 bg-[#F2EDE4] text-[#5A5A40] rounded-full text-xs font-bold border border-[#E5E1D9]">
                      {selectedCourse.code}
                    </span>
                    <h4 className="font-headline font-bold text-base text-[#2D2926] mt-1">
                      {selectedCourse.title}
                    </h4>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E1D9] text-xs space-y-2 text-[#6B665E]">
                  <div className="flex justify-between">
                    <span>Instructor:</span>
                    <span className="font-semibold text-[#2D2926]">{selectedCourse.instructor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <span className="font-semibold text-[#2D2926]">{selectedCourse.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Term & Credits:</span>
                    <span className="font-semibold text-[#2D2926]">{selectedCourse.term} • {selectedCourse.credits} Credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evaluation Due:</span>
                    <span className="font-semibold text-[#8A5A40]">{selectedCourse.deadline}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF9F7] rounded-xl border border-[#E5E1D9] text-xs text-[#6B665E] leading-relaxed">
                  {selectedCourse.description}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFacultyCourseId(selectedCourse.id);
                    setActiveTab('faculty_insights');
                  }}
                  className="w-full py-2 bg-[#F2EDE4] hover:bg-[#E5E1D9] text-[#5A5A40] text-xs font-semibold rounded-full transition-colors cursor-pointer text-center block"
                >
                  View {selectedCourse.instructor}'s Analytics
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 ambient-shadow border border-[#E5E1D9] text-center text-xs text-[#8A7E6A]">
                Select a course to view details.
              </div>
            )}

            {/* Evaluation Guidelines Tip Card */}
            <div className="bg-[#FAF9F7] rounded-3xl p-6 border border-[#E5E1D9] space-y-3">
              <h5 className="font-headline font-bold text-sm text-[#2D2926] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#5A5A40]">lightbulb</span>
                <span>Constructive Feedback Tips</span>
              </h5>
              <ul className="text-xs text-[#6B665E] space-y-2 list-disc pl-4 leading-relaxed">
                <li>Be specific about specific assignments, readings, or lecture moments.</li>
                <li>Suggest actionable adjustments for pacing or office hour formats.</li>
                <li>Highlight teaching methods that positively impacted your learning.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
