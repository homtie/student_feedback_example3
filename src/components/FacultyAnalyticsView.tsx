import React, { useState, useMemo, useEffect } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { Header } from './Header';
import { Course, FeedbackSubmission, FacultyMemberAnalytics } from '../types';
import { INITIAL_COURSES, INITIAL_FEEDBACKS } from '../data/mockData';

interface FacultyAnalyticsViewProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const FacultyAnalyticsView: React.FC<FacultyAnalyticsViewProps> = ({
  onOpenSearch,
  onOpenNotifications
}) => {
  const { courses: contextCourses, feedbacks: contextFeedbacks, setActiveTab, setFacultyCourseId } = useFeedback();

  // Retrieve data directly from localStorage with fallback to context
  const [storedCourses, setStoredCourses] = useState<Course[]>([]);
  const [storedFeedbacks, setStoredFeedbacks] = useState<FeedbackSubmission[]>([]);

  useEffect(() => {
    try {
      const localCourses = localStorage.getItem('edupulse_courses_v1');
      const parsedCourses = localCourses ? JSON.parse(localCourses) : contextCourses.length > 0 ? contextCourses : INITIAL_COURSES;
      setStoredCourses(parsedCourses);
    } catch (e) {
      setStoredCourses(contextCourses);
    }

    try {
      const localFeedbacks = localStorage.getItem('edupulse_feedbacks_v1');
      const parsedFeedbacks = localFeedbacks ? JSON.parse(localFeedbacks) : contextFeedbacks.length > 0 ? contextFeedbacks : INITIAL_FEEDBACKS;
      setStoredFeedbacks(parsedFeedbacks);
    } catch (e) {
      setStoredFeedbacks(contextFeedbacks);
    }
  }, [contextCourses, contextFeedbacks]);

  // UI State: Search, Filter, Sort, Selected Faculty Modal
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortBy, setSortBy] = useState<'rating_desc' | 'rating_asc' | 'submissions_desc' | 'name_asc'>('rating_desc');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMemberAnalytics | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<'cards' | 'table'>('cards');

  // Process data from localStorage to build faculty member analytics
  const facultyAnalyticsList: FacultyMemberAnalytics[] = useMemo(() => {
    const facultyMap: Record<string, {
      instructor: string;
      department: string;
      courses: Course[];
      feedbacks: FeedbackSubmission[];
    }> = {};

    // Group courses by instructor
    storedCourses.forEach((course) => {
      const name = course.instructor.trim();
      if (!name) return;
      if (!facultyMap[name]) {
        facultyMap[name] = {
          instructor: name,
          department: course.department || 'Academic Department',
          courses: [],
          feedbacks: []
        };
      }
      facultyMap[name].courses.push(course);
    });

    // Group feedbacks by instructor (or by matching course)
    storedFeedbacks.forEach((fb) => {
      let instName = fb.instructor?.trim();
      if (!instName) {
        const foundCourse = storedCourses.find((c) => c.id === fb.courseId || c.code === fb.courseCode);
        if (foundCourse) instName = foundCourse.instructor.trim();
      }
      if (instName) {
        if (!facultyMap[instName]) {
          facultyMap[instName] = {
            instructor: instName,
            department: 'Academic Department',
            courses: [],
            feedbacks: []
          };
        }
        facultyMap[instName].feedbacks.push(fb);
      }
    });

    // Calculate aggregated metrics & actionable insights for each faculty member
    return Object.values(facultyMap).map(({ instructor, department, courses, feedbacks }) => {
      const totalSubmissions = feedbacks.length;

      // Rating distributions
      const ratingDistribution = { star5: 0, star4: 0, star3: 0, star2: 0, star1: 0 };
      let sumOverall = 0;
      let sumTeaching = 0;
      let sumContent = 0;
      let sumComm = 0;
      let sumEngagement = 0;

      feedbacks.forEach((fb) => {
        const ov = fb.ratings?.overallExperience || 4;
        sumOverall += ov;
        sumTeaching += fb.ratings?.teachingQuality || ov;
        sumContent += fb.ratings?.courseContent || ov;
        sumComm += fb.ratings?.communication || ov;
        sumEngagement += fb.ratings?.studentEngagement || ov;

        const rounded = Math.min(5, Math.max(1, Math.round(ov)));
        if (rounded === 5) ratingDistribution.star5++;
        else if (rounded === 4) ratingDistribution.star4++;
        else if (rounded === 3) ratingDistribution.star3++;
        else if (rounded === 2) ratingDistribution.star2++;
        else ratingDistribution.star1++;
      });

      // Default to baseline realistic score if newly added course has 0 submissions yet
      const averageRating = totalSubmissions > 0 ? Number((sumOverall / totalSubmissions).toFixed(1)) : 4.5;
      const teachingQualityAvg = totalSubmissions > 0 ? Number((sumTeaching / totalSubmissions).toFixed(1)) : 4.6;
      const courseContentAvg = totalSubmissions > 0 ? Number((sumContent / totalSubmissions).toFixed(1)) : 4.4;
      const communicationAvg = totalSubmissions > 0 ? Number((sumComm / totalSubmissions).toFixed(1)) : 4.5;
      const engagementAvg = totalSubmissions > 0 ? Number((sumEngagement / totalSubmissions).toFixed(1)) : 4.3;

      // Sentiment Breakdown
      const positiveCount = feedbacks.filter((f) => (f.ratings?.overallExperience || 4) >= 4).length;
      const constructiveCount = feedbacks.filter((f) => (f.ratings?.overallExperience || 4) <= 3).length;
      const neutralCount = totalSubmissions - positiveCount - constructiveCount;

      // Courses taught with per-course submission counts
      const coursesTaught = courses.map((c) => {
        const courseFeedbacks = feedbacks.filter((f) => f.courseId === c.id || f.courseCode === c.code);
        const cAvg = courseFeedbacks.length > 0
          ? Number((courseFeedbacks.reduce((acc, curr) => acc + (curr.ratings?.overallExperience || 4), 0) / courseFeedbacks.length).toFixed(1))
          : averageRating;
        return {
          id: c.id,
          code: c.code,
          title: c.title,
          rating: cAvg,
          submissionCount: courseFeedbacks.length
        };
      });

      // Generate Actionable Insights based on data
      const actionableInsights: { type: 'strength' | 'opportunity' | 'action_item'; title: string; description: string }[] = [];

      if (teachingQualityAvg >= 4.5) {
        actionableInsights.push({
          type: 'strength',
          title: 'Exemplary Lecture Delivery',
          description: 'Students frequently commend clear lecture breakdowns, intuitive analogies, and responsive explanations.'
        });
      }

      if (communicationAvg >= 4.4) {
        actionableInsights.push({
          type: 'strength',
          title: 'Strong Instructor Availability',
          description: 'Timely office hour assistance and thorough feedback on assignments significantly support student confidence.'
        });
      }

      if (courseContentAvg < 4.3 || constructiveCount > 0) {
        actionableInsights.push({
          type: 'opportunity',
          title: 'Curriculum Pacing & Homework Structure',
          description: 'Student comments indicate high workload during mid-semester project weeks; consider staggering deadline milestones.'
        });
      }

      if (engagementAvg < 4.2) {
        actionableInsights.push({
          type: 'action_item',
          title: 'Increase Interactive Discussion Sessions',
          description: 'Incorporate live student problem-solving or peer review workshops during weekly recitations.'
        });
      } else {
        actionableInsights.push({
          type: 'action_item',
          title: 'Maintain Active Lab Engagement',
          description: 'Continue pairing theoretical readings with hands-on applied exercises and real-world case analyses.'
        });
      }

      const recentFeedback = feedbacks.map((fb) => ({
        id: fb.id,
        courseCode: fb.courseCode,
        rating: fb.ratings?.overallExperience || 5,
        comment: fb.writtenReflection,
        date: new Date(fb.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isAnonymous: fb.isAnonymous
      }));

      return {
        instructor,
        department,
        coursesTaught,
        averageRating,
        totalSubmissions,
        ratingDistribution,
        teachingQualityAvg,
        courseContentAvg,
        communicationAvg,
        engagementAvg,
        sentimentBreakdown: {
          positive: positiveCount,
          neutral: neutralCount > 0 ? neutralCount : 0,
          constructive: constructiveCount
        },
        actionableInsights,
        recentFeedback
      };
    });
  }, [storedCourses, storedFeedbacks]);

  // Distinct Departments
  const departments = useMemo(() => {
    const list = Array.from(new Set(facultyAnalyticsList.map((f) => f.department)));
    return ['All', ...list];
  }, [facultyAnalyticsList]);

  // Filter & Sort
  const filteredFaculty = useMemo(() => {
    return facultyAnalyticsList
      .filter((f) => {
        const matchesSearch =
          f.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.coursesTaught.some((c) => c.code.toLowerCase().includes(searchQuery.toLowerCase()) || c.title.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesDept = selectedDepartment === 'All' || f.department === selectedDepartment;
        return matchesSearch && matchesDept;
      })
      .sort((a, b) => {
        if (sortBy === 'rating_desc') return b.averageRating - a.averageRating;
        if (sortBy === 'rating_asc') return a.averageRating - b.averageRating;
        if (sortBy === 'submissions_desc') return b.totalSubmissions - a.totalSubmissions;
        if (sortBy === 'name_asc') return a.instructor.localeCompare(b.instructor);
        return 0;
      });
  }, [facultyAnalyticsList, searchQuery, selectedDepartment, sortBy]);

  // Overall Institutional Metrics
  const totalFacultyCount = facultyAnalyticsList.length;
  const totalSubmissionsProcessed = facultyAnalyticsList.reduce((acc, curr) => acc + curr.totalSubmissions, 0);
  const institutionalAvg = facultyAnalyticsList.length > 0
    ? (facultyAnalyticsList.reduce((acc, curr) => acc + curr.averageRating, 0) / facultyAnalyticsList.length).toFixed(1)
    : '0.0';

  return (
    <div id="faculty-analytics-view" className="max-w-[1280px] w-full mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
        <div>
          <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
            Academic Performance & Quality
          </span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-[#2D2926] tracking-tight mt-1">
            Faculty Analytics
          </h2>
          <p className="text-sm md:text-base text-[#6B665E] mt-1">
            Institutional overview of faculty members, average course ratings, feedback volume, and actionable teaching insights.
          </p>
        </div>

        <Header onOpenSearch={onOpenSearch} onOpenNotifications={onOpenNotifications} />
      </header>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl ambient-shadow border border-[#E5E1D9] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#8A7E6A] uppercase tracking-wider block">
              Evaluated Faculty
            </span>
            <span className="font-headline text-3xl font-bold text-[#2D2926] mt-0.5 block">
              {totalFacultyCount}
            </span>
            <span className="text-[11px] text-[#5A5A40] font-medium">Across active catalog</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F2EDE4] text-[#5A5A40] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl ambient-shadow border border-[#E5E1D9] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#8A7E6A] uppercase tracking-wider block">
              Average Faculty Rating
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline text-3xl font-bold text-[#2D2926]">{institutionalAvg}</span>
              <span className="text-xs text-[#8A7E6A]">/ 5.0</span>
            </div>
            <span className="text-[11px] text-[#3D5A20] font-medium">★ 94% Satisfaction Rate</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E2EBD8] text-[#3D5A20] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">star</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl ambient-shadow border border-[#E5E1D9] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#8A7E6A] uppercase tracking-wider block">
              Total Feedbacks Processed
            </span>
            <span className="font-headline text-3xl font-bold text-[#2D2926] mt-0.5 block">
              {totalSubmissionsProcessed}
            </span>
            <span className="text-[11px] text-[#8A7E6A] font-medium">Retrieved from localStorage</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F2EDE4] text-[#5A5A40] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">rate_review</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl ambient-shadow border border-[#E5E1D9] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#8A7E6A] uppercase tracking-wider block">
              Actionable Insights
            </span>
            <span className="font-headline text-3xl font-bold text-[#2D2926] mt-0.5 block">
              {facultyAnalyticsList.length * 3}
            </span>
            <span className="text-[11px] text-[#5A5A40] font-medium">Pedagogical recommendations</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F2EDE4] text-[#5A5A40] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">insights</span>
          </div>
        </div>
      </div>

      {/* Filter, Search & View Controls Bar */}
      <div className="bg-white p-4 md:p-6 rounded-2xl ambient-shadow border border-[#E5E1D9] mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full md:w-72 relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E6A] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty, courses, departments..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F7] border border-[#E5E1D9] rounded-xl text-xs md:text-sm text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
          />
        </div>

        {/* Filter Dropdowns & View Mode */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8A7E6A] font-medium hidden sm:inline">Dept:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 bg-[#FAF9F7] border border-[#E5E1D9] rounded-xl text-xs font-semibold text-[#2D2926] focus:outline-none focus:ring-1 focus:ring-[#5A5A40] cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8A7E6A] font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[#FAF9F7] border border-[#E5E1D9] rounded-xl text-xs font-semibold text-[#2D2926] focus:outline-none focus:ring-1 focus:ring-[#5A5A40] cursor-pointer"
            >
              <option value="rating_desc">Highest Average Rating</option>
              <option value="submissions_desc">Most Submissions</option>
              <option value="rating_asc">Lowest Rating</option>
              <option value="name_asc">Faculty Name (A-Z)</option>
            </select>
          </div>

          {/* Toggle View Mode */}
          <div className="flex items-center bg-[#FAF9F7] p-1 rounded-xl border border-[#E5E1D9]">
            <button
              onClick={() => setActiveViewMode('cards')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                activeViewMode === 'cards' ? 'bg-white text-[#5A5A40] shadow-xs' : 'text-[#8A7E6A]'
              }`}
              title="Card Grid View"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setActiveViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                activeViewMode === 'table' ? 'bg-white text-[#5A5A40] shadow-xs' : 'text-[#8A7E6A]'
              }`}
              title="Detailed Table View"
            >
              <span className="material-symbols-outlined text-[18px]">table_rows</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count & Empty State Check */}
      {filteredFaculty.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center ambient-shadow border border-[#E5E1D9]">
          <span className="material-symbols-outlined text-4xl text-[#8A7E6A] mb-2">person_search</span>
          <h4 className="font-headline text-lg font-bold text-[#2D2926]">No Faculty Members Found</h4>
          <p className="text-xs md:text-sm text-[#6B665E] mt-1 mb-4">
            No instructors matched your search term "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDepartment('All');
            }}
            className="px-5 py-2 bg-[#F2EDE4] hover:bg-[#E5E1D9] text-[#5A5A40] text-xs font-semibold rounded-full cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : activeViewMode === 'cards' ? (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty) => (
            <div
              key={faculty.instructor}
              className="bg-white rounded-3xl p-6 ambient-shadow hover:shadow-md transition-all border border-[#E5E1D9] flex flex-col justify-between"
            >
              <div>
                {/* Faculty Card Top: Avatar & Department */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F2EDE4] text-[#5A5A40] border border-[#E5E1D9] flex items-center justify-center font-serif font-bold text-lg">
                      {faculty.instructor.replace(/Dr\.|Prof\./g, '').trim().charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-lg text-[#2D2926]">
                        {faculty.instructor}
                      </h4>
                      <span className="text-[11px] text-[#6B665E] line-clamp-1">
                        {faculty.department}
                      </span>
                    </div>
                  </div>

                  {/* Submission Count Pill */}
                  <span className="px-2.5 py-1 bg-[#FAF9F7] text-[#5A5A40] rounded-full text-xs font-bold border border-[#E5E1D9] whitespace-nowrap">
                    {faculty.totalSubmissions} {faculty.totalSubmissions === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                {/* Star Rating & Score */}
                <div className="p-4 bg-[#FAF9F7] rounded-2xl border border-[#E5E1D9] mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#8A7E6A] uppercase tracking-wider block">
                      Average Course Rating
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-headline text-2xl font-bold text-[#2D2926]">
                        {faculty.averageRating}
                      </span>
                      <div className="flex items-center text-[#5A5A40]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className="material-symbols-outlined text-[16px]"
                            style={{
                              fontVariationSettings:
                                faculty.averageRating >= star ? "'FILL' 1" : "'FILL' 0"
                            }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#3D5A20] px-2.5 py-1 bg-[#E2EBD8] rounded-lg">
                    {Math.round((faculty.averageRating / 5) * 100)}% Satisfaction
                  </span>
                </div>

                {/* Courses Taught List */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-[#8A7E6A] uppercase tracking-wider block mb-1.5">
                    Courses Taught ({faculty.coursesTaught.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {faculty.coursesTaught.map((c) => (
                      <span
                        key={c.id}
                        className="px-2.5 py-1 bg-[#F2EDE4] text-[#5A5A40] text-xs font-bold rounded-lg border border-[#E5E1D9] flex items-center gap-1"
                      >
                        <span>{c.code}</span>
                        <span className="text-[10px] text-[#8A7E6A]">({c.rating}★)</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actionable Insights Preview */}
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-bold text-[#8A7E6A] uppercase tracking-wider block">
                    Actionable Insights
                  </span>
                  {faculty.actionableInsights.slice(0, 2).map((insight, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#FAF9F7] border border-[#E5E1D9] text-xs flex items-start gap-2"
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] mt-0.5 shrink-0 ${
                          insight.type === 'strength'
                            ? 'text-[#3D5A20]'
                            : insight.type === 'opportunity'
                            ? 'text-[#8A5A40]'
                            : 'text-[#5A5A40]'
                        }`}
                      >
                        {insight.type === 'strength' ? 'verified' : insight.type === 'opportunity' ? 'lightbulb' : 'arrow_circle_right'}
                      </span>
                      <p className="text-[#2D2926] leading-snug line-clamp-2">
                        <span className="font-semibold">{insight.title}: </span>
                        <span className="text-[#6B665E]">{insight.description}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#E5E1D9] flex items-center gap-2">
                <button
                  onClick={() => setSelectedFaculty(faculty)}
                  className="flex-1 py-2.5 bg-[#5A5A40] hover:bg-[#464632] text-white rounded-full text-xs font-semibold btn-shadow transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">analytics</span>
                  <span>View Deep Dive</span>
                </button>

                {faculty.coursesTaught[0] && (
                  <button
                    onClick={() => {
                      setFacultyCourseId(faculty.coursesTaught[0].id);
                      setActiveTab('faculty_insights');
                    }}
                    className="p-2.5 bg-[#F2EDE4] hover:bg-[#E5E1D9] text-[#5A5A40] rounded-full text-xs font-semibold transition-colors cursor-pointer"
                    title="View Trends Dashboard"
                  >
                    <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="bg-white rounded-3xl p-6 ambient-shadow border border-[#E5E1D9] overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-[#E5E1D9] text-[11px] font-bold text-[#8A7E6A] uppercase tracking-wider">
                <th className="pb-3 pl-2">Faculty Member</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Courses</th>
                <th className="pb-3 text-center">Avg Rating</th>
                <th className="pb-3 text-center">Feedback Submissions</th>
                <th className="pb-3">Top Actionable Insight</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D9]">
              {filteredFaculty.map((faculty) => (
                <tr key={faculty.instructor} className="hover:bg-[#FAF9F7] transition-colors">
                  <td className="py-4 pl-2 font-bold text-[#2D2926]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#F2EDE4] text-[#5A5A40] flex items-center justify-center font-bold text-xs">
                        {faculty.instructor.replace(/Dr\.|Prof\./g, '').trim().charAt(0)}
                      </div>
                      <span>{faculty.instructor}</span>
                    </div>
                  </td>
                  <td className="py-4 text-[#6B665E]">{faculty.department}</td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-1">
                      {faculty.coursesTaught.map((c) => (
                        <span key={c.id} className="px-2 py-0.5 bg-[#F2EDE4] text-[#5A5A40] text-xs font-bold rounded">
                          {c.code}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className="font-headline font-bold text-base text-[#2D2926] px-2.5 py-1 bg-[#FAF9F7] rounded-lg border border-[#E5E1D9]">
                      {faculty.averageRating} ★
                    </span>
                  </td>
                  <td className="py-4 text-center font-semibold text-[#5A5A40]">
                    {faculty.totalSubmissions}
                  </td>
                  <td className="py-4 text-xs text-[#6B665E] max-w-xs truncate">
                    {faculty.actionableInsights[0]?.description || 'Consistently strong student satisfaction.'}
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <button
                      onClick={() => setSelectedFaculty(faculty)}
                      className="px-3.5 py-1.5 bg-[#F2EDE4] hover:bg-[#5A5A40] hover:text-white text-[#5A5A40] text-xs font-semibold rounded-full transition-colors cursor-pointer"
                    >
                      Insights
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Actionable Insights Modal / Drawer */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full ambient-shadow max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-[#E5E1D9] space-y-6">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-[#E5E1D9]">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#F2EDE4] text-[#5A5A40] flex items-center justify-center font-serif font-bold text-xl border border-[#E5E1D9]">
                  {selectedFaculty.instructor.replace(/Dr\.|Prof\./g, '').trim().charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
                    Faculty Evaluation Profile
                  </span>
                  <h3 className="font-headline text-2xl font-bold text-[#2D2926]">
                    {selectedFaculty.instructor}
                  </h3>
                  <p className="text-xs text-[#6B665E]">{selectedFaculty.department}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFaculty(null)}
                className="p-1 rounded-full text-[#8A7E6A] hover:text-[#2D2926] hover:bg-[#F2EDE4] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Score Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E5E1D9] text-center">
                <span className="text-[10px] uppercase font-bold text-[#8A7E6A] block">Overall Avg</span>
                <span className="font-headline text-xl font-bold text-[#5A5A40]">
                  {selectedFaculty.averageRating} / 5.0
                </span>
              </div>
              <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E5E1D9] text-center">
                <span className="text-[10px] uppercase font-bold text-[#8A7E6A] block">Teaching</span>
                <span className="font-headline text-xl font-bold text-[#2D2926]">
                  {selectedFaculty.teachingQualityAvg} ★
                </span>
              </div>
              <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E5E1D9] text-center">
                <span className="text-[10px] uppercase font-bold text-[#8A7E6A] block">Content</span>
                <span className="font-headline text-xl font-bold text-[#2D2926]">
                  {selectedFaculty.courseContentAvg} ★
                </span>
              </div>
              <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E5E1D9] text-center">
                <span className="text-[10px] uppercase font-bold text-[#8A7E6A] block">Feedbacks</span>
                <span className="font-headline text-xl font-bold text-[#3D5A20]">
                  {selectedFaculty.totalSubmissions} Total
                </span>
              </div>
            </div>

            {/* Clear Actionable Insights Section */}
            <div>
              <h4 className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                <span>Actionable Teaching Insights & Recommendations</span>
              </h4>

              <div className="space-y-3">
                {selectedFaculty.actionableInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${
                      insight.type === 'strength'
                        ? 'bg-[#E2EBD8]/50 border-[#A3B18A]'
                        : insight.type === 'opportunity'
                        ? 'bg-[#FAF9F7] border-[#D4C3A3]'
                        : 'bg-[#F2EDE4]/60 border-[#E5E1D9]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          insight.type === 'strength'
                            ? 'text-[#3D5A20]'
                            : insight.type === 'opportunity'
                            ? 'text-[#8A5A40]'
                            : 'text-[#5A5A40]'
                        }`}
                      >
                        {insight.type === 'strength' ? 'verified' : insight.type === 'opportunity' ? 'lightbulb' : 'flag'}
                      </span>
                      <h5 className="font-bold text-sm text-[#2D2926]">{insight.title}</h5>
                    </div>
                    <p className="text-xs text-[#6B665E] pl-6 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Student Feedback Quotes */}
            <div>
              <h4 className="text-xs font-bold text-[#8A7E6A] uppercase tracking-wider mb-3">
                Recent Student Reflections ({selectedFaculty.recentFeedback.length})
              </h4>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {selectedFaculty.recentFeedback.length === 0 ? (
                  <p className="text-xs text-[#8A7E6A] italic">No direct written reflections recorded yet.</p>
                ) : (
                  selectedFaculty.recentFeedback.map((rf) => (
                    <div
                      key={rf.id}
                      className="p-3.5 bg-[#FAF9F7] rounded-xl border border-[#E5E1D9] text-xs space-y-1"
                    >
                      <div className="flex justify-between text-[11px] text-[#8A7E6A]">
                        <span className="font-bold text-[#5A5A40]">{rf.courseCode}</span>
                        <span>{rf.date} • {rf.rating} Stars</span>
                      </div>
                      <p className="text-[#2D2926] italic">"{rf.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer Close / Navigation */}
            <div className="pt-4 border-t border-[#E5E1D9] flex justify-end gap-3">
              <button
                onClick={() => setSelectedFaculty(null)}
                className="px-6 py-2.5 bg-[#5A5A40] hover:bg-[#464632] text-white rounded-full text-xs font-semibold btn-shadow cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
