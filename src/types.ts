export type CourseStatus = 'not_started' | 'in_progress' | 'completed';

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  deadline: string;
  status: CourseStatus;
  progress: number;
  term: string;
  colorTheme: 'primary' | 'secondary' | 'tertiary';
  icon: string;
  department: string;
  credits: number;
  enrolledStudents: number;
  description: string;
  syllabusTopics: string[];
}

export interface FeedbackRatings {
  teachingQuality: number; // 1 to 5
  courseContent: number;
  communication: number;
  studentEngagement: number;
  overallExperience: number;
}

export interface FeedbackSubmission {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  ratings: FeedbackRatings;
  writtenReflection: string;
  tags?: string[];
  submittedAt: string;
  studentName: string;
  isAnonymous: boolean;
}

export interface FacultyStats {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  overallSatisfaction: number; // out of 10
  deltaScore: number;
  totalStudents: number;
  responseRate: number; // percentage
  weeklyTrends: {
    week: string;
    score: number;
  }[];
  categoryScores: {
    name: string;
    score: number; // out of 5
    description: string;
  }[];
  recentReflections: {
    id: string;
    sentiment: 'positive' | 'constructive' | 'neutral';
    text: string;
    date: string;
    rating: number;
  }[];
}

export type NavigationTab = 
  | 'overview' 
  | 'submit_feedback'
  | 'add_course'
  | 'faculty_insights' 
  | 'feedbacks' 
  | 'materials' 
  | 'help_center';

export interface FacultyMemberAnalytics {
  instructor: string;
  department: string;
  coursesTaught: {
    id: string;
    code: string;
    title: string;
    rating: number;
    submissionCount: number;
  }[];
  averageRating: number; // out of 5
  totalSubmissions: number;
  ratingDistribution: {
    star5: number;
    star4: number;
    star3: number;
    star2: number;
    star1: number;
  };
  teachingQualityAvg: number;
  courseContentAvg: number;
  communicationAvg: number;
  engagementAvg: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    constructive: number;
  };
  actionableInsights: {
    type: 'strength' | 'opportunity' | 'action_item';
    title: string;
    description: string;
  }[];
  recentFeedback: {
    id: string;
    courseCode: string;
    rating: number;
    comment: string;
    date: string;
    isAnonymous: boolean;
  }[];
}
