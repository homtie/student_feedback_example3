import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { FACULTY_STATS } from '../data/mockData';
import { Header } from './Header';

interface FacultyInsightsViewProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const FacultyInsightsView: React.FC<FacultyInsightsViewProps> = ({
  onOpenSearch,
  onOpenNotifications
}) => {
  const { facultyCourseId, setFacultyCourseId, courses } = useFeedback();
  const [timeRange, setTimeRange] = useState<'4weeks' | 'semester'>('4weeks');
  const [hoveredPoint, setHoveredPoint] = useState<{ week: string; score: number } | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const stats = FACULTY_STATS[facultyCourseId] || FACULTY_STATS['cs101'];

  const handleExport = (format: 'csv' | 'json') => {
    let content = '';
    let filename = `faculty-feedback-${stats.courseId}-2026.`;

    if (format === 'json') {
      content = JSON.stringify(stats, null, 2);
      filename += 'json';
    } else {
      // CSV
      const rows = [
        ['Course Code', stats.courseCode],
        ['Instructor', stats.instructor],
        ['Overall Score', `${stats.overallSatisfaction}/10`],
        ['Total Responses', `${stats.totalStudents}`],
        [],
        ['Category', 'Score (out of 5)'],
        ...stats.categoryScores.map((c) => [c.name, c.score.toString()]),
        [],
        ['Week', 'Trend Score'],
        ...stats.weeklyTrends.map((w) => [w.week, w.score.toString()]),
        [],
        ['Feedback Quote', 'Sentiment', 'Date'],
        ...stats.recentReflections.map((r) => [`"${r.text}"`, r.sentiment, r.date])
      ];
      content = rows.map((r) => r.join(',')).join('\n');
      filename += 'csv';
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice(`Exported ${filename} successfully.`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div id="faculty-insights-dashboard" className="max-w-[1280px] w-full mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
        <div>
          <p className="text-xs font-bold text-[#5A5A40] mb-1.5 uppercase tracking-widest">
            Faculty Insights
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-[#2D2926] tracking-tight">
              {stats.courseCode}
            </h2>
            {/* Course Selector Dropdown */}
            <select
              id="faculty-course-selector"
              value={facultyCourseId}
              onChange={(e) => setFacultyCourseId(e.target.value)}
              className="bg-[#F2EDE4] border border-[#E5E1D9] text-[#2D2926] rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-[#5A5A40] shadow-xs cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} ({c.instructor})
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm md:text-base text-[#6B665E] mt-1">Semester Insights • {stats.instructor}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Button */}
          <div className="relative group">
            <button
              id="faculty-export-btn"
              onClick={() => handleExport('csv')}
              className="bg-white border border-[#E5E1D9] text-[#5A5A40] hover:bg-[#F2EDE4] px-4 py-2 rounded-full font-semibold text-xs md:text-sm flex items-center gap-2 ambient-shadow transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Report</span>
            </button>
          </div>

          <Header onOpenSearch={onOpenSearch} onOpenNotifications={onOpenNotifications} />
        </div>
      </header>

      {exportNotice && (
        <div className="mb-6 p-4 bg-[#E2EBD8] border border-[#A3B18A] text-[#3D5A20] rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Top Bento Grid: Overall Satisfaction + Trend Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Hero Stat Card */}
        <div
          id="faculty-satisfaction-card"
          className="bg-white rounded-2xl p-8 ambient-shadow ambient-shadow-hover lg:col-span-1 flex flex-col justify-between relative overflow-hidden border border-[#E5E1D9]"
        >
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-[#D4C3A3]/20 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <h3 className="font-headline text-2xl font-bold text-[#2D2926] mb-1">
              Overall Satisfaction
            </h3>
            <p className="text-xs text-[#6B665E]">
              Aggregated score from {stats.totalStudents} students
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-headline font-extrabold text-[#5A5A40] tracking-tight">
                {stats.overallSatisfaction}
              </span>
              <span className="text-2xl font-bold text-[#8A7E6A]">/ 10</span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="bg-[#E2EBD8] text-[#3D5A20] px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +{stats.deltaScore}
              </span>
              <span className="text-xs text-[#6B665E] font-medium">vs last term</span>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E1D9] flex justify-between text-xs text-[#6B665E]">
              <span>Response Rate:</span>
              <span className="font-bold text-[#2D2926]">{stats.responseRate}%</span>
            </div>
          </div>
        </div>

        {/* Feedback Trends Line Chart Card */}
        <div
          id="faculty-trends-card"
          className="bg-white rounded-2xl p-8 ambient-shadow ambient-shadow-hover lg:col-span-2 flex flex-col border border-[#E5E1D9]"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline text-2xl font-bold text-[#2D2926]">Feedback Trends</h3>
              <p className="text-xs text-[#8A7E6A]">Score progression over time</p>
            </div>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-[#F2EDE4] border border-[#E5E1D9] text-[#2D2926] rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-[#5A5A40] cursor-pointer"
            >
              <option value="4weeks">Last 4 Weeks</option>
              <option value="semester">This Semester</option>
            </select>
          </div>

          {/* Interactive Line Chart Canvas */}
          <div className="flex-1 relative mt-4 h-56 w-full chart-grid flex items-end justify-between px-6 pb-6 pt-4">
            {/* Y Axis Labels */}
            <div className="absolute left-2 top-2 h-44 flex flex-col justify-between text-[11px] font-semibold text-[#8A7E6A]">
              <span>10.0</span>
              <span>7.5</span>
              <span>5.0</span>
            </div>

            {/* SVG Line & Circles */}
            <div className="relative w-full h-full ml-6">
              <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 400 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5A5A40" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#5A5A40" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area under curve */}
                <path
                  d="M 10,70 Q 100,85 190,55 T 310,25 T 390,15 L 390,150 L 10,150 Z"
                  fill="url(#trendGradient)"
                />

                {/* Smooth Curve */}
                <path
                  d="M 10,70 Q 100,85 190,55 T 310,25 T 390,15"
                  fill="none"
                  stroke="#5A5A40"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle
                  cx="10"
                  cy="70"
                  r="6"
                  fill="white"
                  stroke="#5A5A40"
                  strokeWidth="3"
                  className="cursor-pointer hover:r-8 transition-all"
                  onMouseEnter={() => setHoveredPoint({ week: 'Week 1', score: 8.2 })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                <circle
                  cx="140"
                  cy="90"
                  r="6"
                  fill="white"
                  stroke="#5A5A40"
                  strokeWidth="3"
                  className="cursor-pointer hover:r-8 transition-all"
                  onMouseEnter={() => setHoveredPoint({ week: 'Week 2', score: 7.6 })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                <circle
                  cx="270"
                  cy="40"
                  r="6"
                  fill="white"
                  stroke="#5A5A40"
                  strokeWidth="3"
                  className="cursor-pointer hover:r-8 transition-all"
                  onMouseEnter={() => setHoveredPoint({ week: 'Week 3', score: 8.9 })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                <circle
                  cx="390"
                  cy="15"
                  r="6"
                  fill="white"
                  stroke="#5A5A40"
                  strokeWidth="3"
                  className="cursor-pointer hover:r-8 transition-all"
                  onMouseEnter={() => setHoveredPoint({ week: 'Week 4', score: 9.3 })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </svg>

              {/* Hover Tooltip Popup */}
              {hoveredPoint && (
                <div className="absolute top-2 right-4 bg-[#2D2926] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg animate-in fade-in">
                  <span className="font-semibold">{hoveredPoint.week}:</span> {hoveredPoint.score} / 10
                </div>
              )}
            </div>

            {/* X Axis Labels */}
            <div className="absolute -bottom-2 left-10 right-2 flex justify-between text-xs font-semibold text-[#8A7E6A]">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Breakdown & Detailed Ratings */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Category Gauges Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 ambient-shadow border border-[#E5E1D9]">
          <h3 className="font-headline text-xl font-bold text-[#2D2926] mb-1">
            Category Breakdown
          </h3>
          <p className="text-xs text-[#8A7E6A] mb-6">Average rating across all 5 evaluation dimensions</p>

          <div className="space-y-4">
            {stats.categoryScores.map((cat, idx) => {
              const percentage = (cat.score / 5) * 100;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-[#2D2926]">{cat.name}</span>
                    <span className="font-bold text-[#5A5A40]">{cat.score} / 5.0</span>
                  </div>
                  <div className="w-full h-2 bg-[#F2EDE4] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5A5A40] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-[#6B665E]">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Student Reflections */}
        <div className="bg-white rounded-2xl p-6 md:p-8 ambient-shadow border border-[#E5E1D9] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-headline text-xl font-bold text-[#2D2926]">
                Student Reflections
              </h3>
              <p className="text-xs text-[#8A7E6A]">Anonymized feedback snippets</p>
            </div>
            <span className="px-2.5 py-0.5 bg-[#F2EDE4] text-[#5A5A40] rounded-full text-xs font-semibold border border-[#E5E1D9]">
              {stats.recentReflections.length} Reviews
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1">
            {stats.recentReflections.map((ref) => (
              <div
                key={ref.id}
                className="p-4 rounded-xl bg-[#FAF9F7] border border-[#E5E1D9] hover:border-[#5A5A40]/50 transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ref.sentiment === 'positive'
                          ? 'bg-[#E2EBD8] text-[#3D5A20]'
                          : ref.sentiment === 'constructive'
                          ? 'bg-[#F5E6D3] text-[#7A5229]'
                          : 'bg-[#F2EDE4] text-[#5A5A40]'
                      }`}
                    >
                      {ref.sentiment}
                    </span>
                    <span className="text-[11px] text-[#8A7E6A]">{ref.date}</span>
                  </div>
                  <div className="flex text-[#8A7E6A] text-xs">
                    {'★'.repeat(ref.rating)}
                    {'☆'.repeat(5 - ref.rating)}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-[#2D2926] leading-relaxed italic">
                  "{ref.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
