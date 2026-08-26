import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { courses, startReview, setActiveTab, setFacultyCourseId } = useFeedback();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredCourses = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.instructor.toLowerCase().includes(query.toLowerCase()) ||
      c.department.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
      <div className="bg-white rounded-3xl p-6 max-w-xl w-full ambient-shadow animate-in zoom-in-95 duration-200 border border-[#E5E1D9]">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E5E1D9]">
          <span className="material-symbols-outlined text-2xl text-[#5A5A40]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, instructors, topics (e.g. AI, Calculus, Aris)..."
            className="flex-1 text-sm md:text-base text-[#2D2926] placeholder:text-[#8A7E6A] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#8A7E6A] hover:text-[#2D2926] hover:bg-[#F2EDE4] rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
          {filteredCourses.length === 0 ? (
            <p className="text-center text-xs text-[#8A7E6A] py-8">
              No matching courses or evaluations found for "{query}".
            </p>
          ) : (
            filteredCourses.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl hover:bg-[#FAF9F7] transition-colors flex items-center justify-between gap-4 border border-transparent hover:border-[#E5E1D9]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#F2EDE4] text-[#5A5A40] rounded-md text-[11px] font-bold border border-[#E5E1D9]">
                      {c.code}
                    </span>
                    <h5 className="text-sm font-semibold text-[#2D2926]">{c.title}</h5>
                  </div>
                  <p className="text-xs text-[#6B665E] mt-0.5">
                    {c.instructor} • {c.department}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFacultyCourseId(c.id);
                      setActiveTab('faculty_insights');
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-[#F2EDE4] hover:bg-[#E5E1D9] text-[#5A5A40] rounded-full text-xs font-semibold cursor-pointer"
                  >
                    Analytics
                  </button>
                  {c.status !== 'completed' && (
                    <button
                      onClick={() => {
                        startReview(c.id);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-[#5A5A40] hover:bg-[#464632] text-white rounded-full text-xs font-semibold btn-shadow cursor-pointer"
                    >
                      Evaluate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
