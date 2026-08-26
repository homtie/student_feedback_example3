import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { COURSE_MATERIALS } from '../data/mockData';
import { Header } from './Header';

interface CourseMaterialsViewProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const CourseMaterialsView: React.FC<CourseMaterialsViewProps> = ({
  onOpenSearch,
  onOpenNotifications
}) => {
  const { courses, startReview } = useFeedback();
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const handleDownload = (title: string) => {
    setDownloadMsg(`Downloading "${title}"...`);
    setTimeout(() => {
      setDownloadMsg(`Downloaded "${title}" to your device.`);
      setTimeout(() => setDownloadMsg(null), 3000);
    }, 800);
  };

  return (
    <div id="course-materials-view" className="max-w-[1280px] w-full mx-auto pb-16 animate-in fade-in duration-300">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
        <div>
          <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
            Academic Resources
          </span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-[#2D2926] tracking-tight mt-1">
            Course Materials
          </h2>
          <p className="text-sm md:text-base text-[#6B665E] mt-1">
            Access syllabi, lecture decks, and assignment resources for your enrolled courses.
          </p>
        </div>

        <Header onOpenSearch={onOpenSearch} onOpenNotifications={onOpenNotifications} />
      </header>

      {downloadMsg && (
        <div className="mb-6 p-4 bg-[#E2EBD8] text-[#3D5A20] border border-[#A3B18A] rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[20px]">cloud_download</span>
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {COURSE_MATERIALS.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 ambient-shadow hover:shadow-md transition-all border border-[#E5E1D9] flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="px-2.5 py-0.5 bg-[#F2EDE4] text-[#5A5A40] rounded-full text-xs font-bold border border-[#E5E1D9]">
                  {item.courseCode}
                </span>
                <span className="text-xs text-[#8A7E6A]">{item.date}</span>
              </div>
              <h4 className="font-headline text-base font-bold text-[#2D2926] mb-1">{item.title}</h4>
              <p className="text-xs text-[#6B665E] mb-4">
                Instructor: {item.instructor} • {item.type} ({item.size})
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E5E1D9]">
              <span className="text-xs text-[#8A7E6A]">Verified Syllabus Material</span>
              <button
                onClick={() => handleDownload(item.title)}
                className="px-4 py-1.5 bg-[#F2EDE4] hover:bg-[#5A5A40] hover:text-white text-[#5A5A40] text-xs font-semibold rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Evaluation Link Banner */}
      <div className="bg-[#5A5A40] text-white rounded-3xl p-8 ambient-shadow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="z-10">
          <h3 className="font-headline text-2xl font-bold mb-1.5">Have feedback on these materials?</h3>
          <p className="text-sm text-[#E5E1D9] max-w-lg">
            Tell your professors if lecture slides, lab guides, and reading materials were structured effectively.
          </p>
        </div>
        <button
          onClick={() => {
            const pending = courses.find((c) => c.status !== 'completed') || courses[0];
            if (pending) startReview(pending.id);
          }}
          className="z-10 px-6 py-2.5 bg-white text-[#5A5A40] hover:bg-[#FAF9F7] rounded-full font-bold text-sm btn-shadow cursor-pointer transition-all active:scale-95 whitespace-nowrap"
        >
          Evaluate Course Materials
        </button>
      </div>
    </div>
  );
};
