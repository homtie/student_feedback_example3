import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, FeedbackRatings, FeedbackSubmission, NavigationTab } from '../types';
import { INITIAL_COURSES, INITIAL_FEEDBACKS, FACULTY_STATS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface FeedbackContextType {
  courses: Course[];
  feedbacks: FeedbackSubmission[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeReviewCourse: Course | null;
  reviewStep: number;
  currentRatings: FeedbackRatings;
  currentReflection: string;
  isAnonymous: boolean;
  setIsAnonymous: (val: boolean) => void;
  facultyCourseId: string;
  setFacultyCourseId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startReview: (courseId: string) => void;
  continueReview: (courseId: string) => void;
  setRating: (category: keyof FeedbackRatings, value: number) => void;
  setReflection: (val: string) => void;
  nextReviewStep: () => void;
  prevReviewStep: () => void;
  submitFeedback: () => void;
  addNewCourse: (courseData: {
    title: string;
    code: string;
    instructor: string;
    description: string;
    department?: string;
    credits?: number;
    term?: string;
    deadline?: string;
  }) => void;
  submitCourseFeedbackDirect: (data: {
    courseId: string;
    overallRating: number;
    ratings?: Partial<FeedbackRatings>;
    writtenReflection: string;
    isAnonymous?: boolean;
    studentName?: string;
    tags?: string[];
  }) => void;
  returnToDashboard: () => void;
  resetAllData: () => void;
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
  notifications: { id: string; title: string; time: string; read: boolean; type: 'urgent' | 'info' | 'success' }[];
  markAllNotificationsRead: () => void;
}

const STORAGE_KEYS = {
  COURSES: 'edupulse_courses_v1',
  FEEDBACKS: 'edupulse_feedbacks_v1',
  ACTIVE_TAB: 'edupulse_active_tab_v1'
};

const DEFAULT_RATINGS: FeedbackRatings = {
  teachingQuality: 0,
  courseContent: 0,
  communication: 0,
  studentEngagement: 0,
  overallExperience: 0
};

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved courses', e);
      }
    }
    return INITIAL_COURSES;
  });

  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved feedbacks', e);
      }
    }
    return INITIAL_FEEDBACKS;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    return (saved as NavigationTab) || 'overview';
  });

  const [activeReviewCourse, setActiveReviewCourse] = useState<Course | null>(null);
  const [reviewStep, setReviewStep] = useState<number>(1);
  const [currentRatings, setCurrentRatings] = useState<FeedbackRatings>(DEFAULT_RATINGS);
  const [currentReflection, setCurrentReflection] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [facultyCourseId, setFacultyCourseId] = useState<string>('cs101');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'PSY202 Evaluation is due in 3 days (Oct 12)',
      time: '2 hours ago',
      read: false,
      type: 'urgent' as const
    },
    {
      id: 'notif-2',
      title: 'Feedback window for CS101 is now open',
      time: '1 day ago',
      read: false,
      type: 'info' as const
    },
    {
      id: 'notif-3',
      title: 'Thank you for submitting BIO101 feedback!',
      time: '4 days ago',
      read: true,
      type: 'success' as const
    }
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  const completedCount = courses.filter((c) => c.status === 'completed').length;
  const totalCount = courses.length;
  // Dynamic percentage calculation
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const startReview = (courseId: string) => {
    const target = courses.find((c) => c.id === courseId);
    if (!target) return;

    setActiveReviewCourse(target);
    setReviewStep(1);
    setCurrentRatings(DEFAULT_RATINGS);
    setCurrentReflection('');
    // Mark as in-progress if not started
    if (target.status === 'not_started') {
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, status: 'in_progress', progress: 50 } : c))
      );
    }
  };

  const continueReview = (courseId: string) => {
    const target = courses.find((c) => c.id === courseId);
    if (!target) return;

    setActiveReviewCourse(target);
    // Preload some ratings if in-progress for realistic continuity
    setCurrentRatings({
      teachingQuality: 4,
      courseContent: 4,
      communication: 5,
      studentEngagement: 4,
      overallExperience: 5
    });
    setCurrentReflection('The class discussions are thought provoking and the visual diagrams are very helpful.');
    setReviewStep(1);
  };

  const setRating = (category: keyof FeedbackRatings, value: number) => {
    setCurrentRatings((prev) => ({
      ...prev,
      [category]: value
    }));
  };

  const setReflection = (val: string) => {
    setCurrentReflection(val);
  };

  const nextReviewStep = () => {
    if (reviewStep === 1) {
      setReviewStep(2);
    }
  };

  const prevReviewStep = () => {
    if (reviewStep === 2) {
      setReviewStep(1);
    } else if (reviewStep === 1) {
      setActiveReviewCourse(null);
    }
  };

  const submitFeedback = () => {
    if (!activeReviewCourse) return;

    const newFeedback: FeedbackSubmission = {
      id: `fb-${activeReviewCourse.id}-${Date.now()}`,
      courseId: activeReviewCourse.id,
      courseCode: activeReviewCourse.code,
      courseTitle: activeReviewCourse.title,
      instructor: activeReviewCourse.instructor,
      ratings: {
        teachingQuality: currentRatings.teachingQuality || 5,
        courseContent: currentRatings.courseContent || 5,
        communication: currentRatings.communication || 5,
        studentEngagement: currentRatings.studentEngagement || 5,
        overallExperience: currentRatings.overallExperience || 5
      },
      writtenReflection:
        currentReflection.trim() ||
        'The course was engaging, structured logically, and provided excellent academic growth and practical learning.',
      tags: ['Verified Review', 'Course Evaluation'],
      submittedAt: new Date().toISOString(),
      studentName: 'Alex Morgan',
      isAnonymous
    };

    // Update feedback list
    setFeedbacks((prev) => [newFeedback, ...prev]);

    // Update courses list
    setCourses((prev) =>
      prev.map((c) =>
        c.id === activeReviewCourse.id ? { ...c, status: 'completed', progress: 100 } : c
      )
    );

    // Update faculty analytics stats if present
    const courseKey = activeReviewCourse.id;
    if (FACULTY_STATS[courseKey]) {
      const stats = FACULTY_STATS[courseKey];
      stats.totalStudents += 1;
      stats.recentReflections.unshift({
        id: `ref-${Date.now()}`,
        sentiment: 'positive',
        text: currentReflection.trim() || 'Outstanding course delivery and interactive curriculum.',
        date: 'Just now',
        rating: currentRatings.overallExperience || 5
      });
    }

    // Add celebration notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Successfully submitted feedback for ${activeReviewCourse.code}!`,
        time: 'Just now',
        read: false,
        type: 'success'
      },
      ...prev
    ]);

    // Move to step 3 (Success Screen)
    setReviewStep(3);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5A5A40', '#8A7E6A', '#3D5A20', '#D4C3A3', '#E5E1D9']
      });
    } catch (e) {
      console.warn('Confetti effect trigger', e);
    }
  };

  const addNewCourse = (courseData: {
    title: string;
    code: string;
    instructor: string;
    description: string;
    department?: string;
    credits?: number;
    term?: string;
    deadline?: string;
  }) => {
    const cleanCode = courseData.code.trim().toUpperCase();
    const cleanId = cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '') || `course-${Date.now()}`;
    
    // Choose theme and icon
    const themes: ('primary' | 'secondary' | 'tertiary')[] = ['primary', 'secondary', 'tertiary'];
    const assignedTheme = themes[courses.length % themes.length];
    
    const icons = ['school', 'menu_book', 'science', 'psychology', 'calculate', 'memory', 'terminal', 'biotech'];
    const assignedIcon = icons[courses.length % icons.length];

    const newCourse: Course = {
      id: cleanId,
      code: cleanCode,
      title: courseData.title.trim(),
      instructor: courseData.instructor.trim(),
      deadline: courseData.deadline || 'Nov 15',
      status: 'not_started',
      progress: 0,
      term: courseData.term || 'Fall 2026',
      colorTheme: assignedTheme,
      icon: assignedIcon,
      department: courseData.department || 'Academic Department',
      credits: courseData.credits || 3,
      enrolledStudents: Math.floor(Math.random() * 120) + 40,
      description: courseData.description.trim(),
      syllabusTopics: ['Core Foundations & Concepts', 'Applied Methodologies', 'Capstone Problem Sets & Evaluation']
    };

    // Update state & persist
    setCourses((prev) => [newCourse, ...prev]);

    // Send notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Added course ${newCourse.code} (${newCourse.title}) to curriculum!`,
        time: 'Just now',
        read: false,
        type: 'success'
      },
      ...prev
    ]);
  };

  const submitCourseFeedbackDirect = (data: {
    courseId: string;
    overallRating: number;
    ratings?: Partial<FeedbackRatings>;
    writtenReflection: string;
    isAnonymous?: boolean;
    studentName?: string;
    tags?: string[];
  }) => {
    const targetCourse = courses.find((c) => c.id === data.courseId);
    if (!targetCourse) return;

    const overall = data.overallRating || 5;
    const feedbackRatings: FeedbackRatings = {
      teachingQuality: data.ratings?.teachingQuality || overall,
      courseContent: data.ratings?.courseContent || overall,
      communication: data.ratings?.communication || overall,
      studentEngagement: data.ratings?.studentEngagement || overall,
      overallExperience: overall
    };

    const newFeedback: FeedbackSubmission = {
      id: `fb-${targetCourse.id}-${Date.now()}`,
      courseId: targetCourse.id,
      courseCode: targetCourse.code,
      courseTitle: targetCourse.title,
      instructor: targetCourse.instructor,
      ratings: feedbackRatings,
      writtenReflection: data.writtenReflection.trim() || 'Constructive feedback submitted for course evaluation.',
      tags: data.tags || ['Student Review', 'Verified Feedback'],
      submittedAt: new Date().toISOString(),
      studentName: data.studentName || 'Alex Morgan',
      isAnonymous: data.isAnonymous ?? true
    };

    // Update feedback list in state & localStorage
    setFeedbacks((prev) => [newFeedback, ...prev]);

    // Mark course as completed
    setCourses((prev) =>
      prev.map((c) =>
        c.id === targetCourse.id ? { ...c, status: 'completed', progress: 100 } : c
      )
    );

    // Notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Feedback submitted for ${targetCourse.code} (${targetCourse.instructor})`,
        time: 'Just now',
        read: false,
        type: 'success'
      },
      ...prev
    ]);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#5A5A40', '#8A7E6A', '#3D5A20', '#D4C3A3']
      });
    } catch (e) {
      console.warn('Confetti trigger', e);
    }
  };

  const returnToDashboard = () => {
    setActiveReviewCourse(null);
    setReviewStep(1);
    setActiveTab('overview');
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACKS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB);
    setCourses(INITIAL_COURSES);
    setFeedbacks(INITIAL_FEEDBACKS);
    setActiveTab('overview');
    setActiveReviewCourse(null);
    setReviewStep(1);
    setCurrentRatings(DEFAULT_RATINGS);
    setCurrentReflection('');
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <FeedbackContext.Provider
      value={{
        courses,
        feedbacks,
        activeTab,
        setActiveTab,
        activeReviewCourse,
        reviewStep,
        currentRatings,
        currentReflection,
        isAnonymous,
        setIsAnonymous,
        facultyCourseId,
        setFacultyCourseId,
        searchQuery,
        setSearchQuery,
        startReview,
        continueReview,
        setRating,
        setReflection,
        nextReviewStep,
        prevReviewStep,
        submitFeedback,
        addNewCourse,
        submitCourseFeedbackDirect,
        returnToDashboard,
        resetAllData,
        completedCount,
        totalCount,
        completionPercentage,
        notifications,
        markAllNotificationsRead
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
