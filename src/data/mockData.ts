import { Course, FacultyStats, FeedbackSubmission } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'cs101',
    code: 'CS101',
    title: 'Intro to AI',
    instructor: 'Dr. Aris',
    deadline: 'Oct 15',
    status: 'not_started',
    progress: 0,
    term: 'Fall 2026',
    colorTheme: 'primary',
    icon: 'memory',
    department: 'Computer Science',
    credits: 4,
    enrolledStudents: 245,
    description: 'Foundations of intelligent agents, search algorithms, neural networks, machine learning paradigms, and ethical AI deployment.',
    syllabusTopics: ['Heuristic Search & Graph Traversal', 'Reinforcement Learning', 'Deep Neural Networks', 'Ethics & AI Alignment']
  },
  {
    id: 'psy202',
    code: 'PSY202',
    title: 'Cognitive Science',
    instructor: 'Dr. Liana',
    deadline: 'Oct 12',
    status: 'in_progress',
    progress: 50,
    term: 'Fall 2026',
    colorTheme: 'tertiary',
    icon: 'psychology',
    department: 'Psychology & Cognitive Studies',
    credits: 3,
    enrolledStudents: 180,
    description: 'Interdisciplinary study of the mind, perception, language processing, memory architectures, and mental representation.',
    syllabusTopics: ['Visual Perception & Attention', 'Working Memory Models', 'Language Acquisition', 'Decision Making Biases']
  },
  {
    id: 'mat105',
    code: 'MAT105',
    title: 'Calculus',
    instructor: 'Dr. Simon',
    deadline: 'Oct 20',
    status: 'not_started',
    progress: 0,
    term: 'Fall 2026',
    colorTheme: 'secondary',
    icon: 'calculate',
    department: 'Mathematics',
    credits: 4,
    enrolledStudents: 310,
    description: 'Differential and integral calculus, continuous functions, Taylor series approximations, and multivariable applications.',
    syllabusTopics: ['Limits & Continuity', 'Integration by Parts', 'Multivariable Optimization', 'Vector Fields & Stokes Theorem']
  },
  {
    id: 'eng201',
    code: 'ENG201',
    title: 'Academic Writing & Research',
    instructor: 'Prof. Davis',
    deadline: 'Sep 28',
    status: 'completed',
    progress: 100,
    term: 'Fall 2026',
    colorTheme: 'secondary',
    icon: 'edit_note',
    department: 'Humanities & Literature',
    credits: 3,
    enrolledStudents: 140,
    description: 'Critical rhetorical analysis, scholarly literature review synthesis, academic argumentation, and peer review methodologies.',
    syllabusTopics: ['Literature Review Synthesis', 'Argumentation Frameworks', 'Peer Review Workshops', 'Citation Integrity']
  },
  {
    id: 'bio101',
    code: 'BIO101',
    title: 'Cellular Biology',
    instructor: 'Dr. Chen',
    deadline: 'Oct 02',
    status: 'completed',
    progress: 100,
    term: 'Fall 2026',
    colorTheme: 'primary',
    icon: 'biotech',
    department: 'Biological Sciences',
    credits: 4,
    enrolledStudents: 220,
    description: 'Molecular mechanisms of life, cellular respiration, DNA replication, gene regulation, and laboratory bio-microscopy.',
    syllabusTopics: ['Macromolecules & Enzymes', 'Cell Cycle & Mitosis', 'CRISPR & Gene Editing', 'Cellular Energy Production']
  }
];

export const INITIAL_FEEDBACKS: FeedbackSubmission[] = [
  {
    id: 'fb-cs101-01',
    courseId: 'cs101',
    courseCode: 'CS101',
    courseTitle: 'Intro to AI',
    instructor: 'Dr. Aris',
    ratings: {
      teachingQuality: 5,
      courseContent: 5,
      communication: 4,
      studentEngagement: 5,
      overallExperience: 5
    },
    writtenReflection: 'Dr. Aris makes difficult search tree algorithms and neural network foundations intuitive with interactive visual demonstrations.',
    tags: ['Inspiring Lectures', 'Clear Coding Demos'],
    submittedAt: '2026-09-24T11:20:00Z',
    studentName: 'Alex Morgan',
    isAnonymous: false
  },
  {
    id: 'fb-cs101-02',
    courseId: 'cs101',
    courseCode: 'CS101',
    instructor: 'Dr. Aris',
    courseTitle: 'Intro to AI',
    ratings: {
      teachingQuality: 4,
      courseContent: 4,
      communication: 5,
      studentEngagement: 4,
      overallExperience: 4
    },
    writtenReflection: 'Pacing on machine learning labs was fast, but Discord office hours and TA support made a huge positive difference.',
    tags: ['Responsive Support', 'Challenging Labs'],
    submittedAt: '2026-09-29T16:45:00Z',
    studentName: 'Student',
    isAnonymous: true
  },
  {
    id: 'fb-psy202-01',
    courseId: 'psy202',
    courseCode: 'PSY202',
    courseTitle: 'Cognitive Science',
    instructor: 'Dr. Liana',
    ratings: {
      teachingQuality: 4,
      courseContent: 4,
      communication: 5,
      studentEngagement: 4,
      overallExperience: 4
    },
    writtenReflection: 'Fascinating discussions on perception and mental models. Would love chapter review summaries before midterm exams.',
    tags: ['Engaging Discussions', 'Thought Provoking'],
    submittedAt: '2026-09-27T10:10:00Z',
    studentName: 'Student',
    isAnonymous: true
  },
  {
    id: 'fb-mat105-01',
    courseId: 'mat105',
    courseCode: 'MAT105',
    courseTitle: 'Calculus',
    instructor: 'Dr. Simon',
    ratings: {
      teachingQuality: 4,
      courseContent: 4,
      communication: 4,
      studentEngagement: 3,
      overallExperience: 4
    },
    writtenReflection: 'Very clear step-by-step calculus proofs on the board. Practice problem packets were extremely useful for homework preparation.',
    tags: ['Structured Problem Solving', 'Helpful Practice'],
    submittedAt: '2026-10-01T15:30:00Z',
    studentName: 'Student',
    isAnonymous: true
  },
  {
    id: 'fb-eng201-01',
    courseId: 'eng201',
    courseCode: 'ENG201',
    courseTitle: 'Academic Writing & Research',
    instructor: 'Prof. Davis',
    ratings: {
      teachingQuality: 5,
      courseContent: 4,
      communication: 5,
      studentEngagement: 4,
      overallExperience: 5
    },
    writtenReflection: 'Prof. Davis gives deeply detailed, constructive essay markups. The weekly discussion seminars helped clarify thesis structure.',
    tags: ['Clear Feedback', 'Helpful Discussions'],
    submittedAt: '2026-09-28T14:32:00Z',
    studentName: 'Alex Morgan',
    isAnonymous: true
  },
  {
    id: 'fb-bio101-01',
    courseId: 'bio101',
    courseCode: 'BIO101',
    courseTitle: 'Cellular Biology',
    instructor: 'Dr. Chen',
    ratings: {
      teachingQuality: 4,
      courseContent: 5,
      communication: 4,
      studentEngagement: 5,
      overallExperience: 4
    },
    writtenReflection: 'Lab experiments were fascinating and well-prepared. Would appreciate slightly earlier release of microscope lab quiz rubrics.',
    tags: ['Great Labs', 'Engaging Content'],
    submittedAt: '2026-10-02T09:15:00Z',
    studentName: 'Alex Morgan',
    isAnonymous: true
  }
];

export const FACULTY_STATS: Record<string, FacultyStats> = {
  cs101: {
    courseId: 'cs101',
    courseCode: 'CS101: Intro to AI',
    courseTitle: 'Intro to AI',
    instructor: 'Dr. Aris',
    overallSatisfaction: 8.8,
    deltaScore: 0.4,
    totalStudents: 245,
    responseRate: 78,
    weeklyTrends: [
      { week: 'Week 1', score: 8.2 },
      { week: 'Week 2', score: 7.6 },
      { week: 'Week 3', score: 8.9 },
      { week: 'Week 4', score: 9.3 }
    ],
    categoryScores: [
      { name: 'Teaching Quality', score: 4.7, description: 'Clarity of AI lecture explanations & coding demos' },
      { name: 'Course Content', score: 4.5, description: 'Pacing of Python AI assignments & algorithm labs' },
      { name: 'Communication', score: 4.3, description: 'Office hours accessibility & Discord/Piazza response times' },
      { name: 'Student Engagement', score: 4.6, description: 'Interactive Kaggle competition & peer reviews' },
      { name: 'Overall Experience', score: 4.8, description: 'General academic satisfaction and recommendation rating' }
    ],
    recentReflections: [
      {
        id: 'ref-1',
        sentiment: 'positive',
        text: 'The visual search tree simulations made A* search crystal clear! Dr. Aris is approachable and answers questions thoroughly in lab sessions.',
        date: '2 days ago',
        rating: 5
      },
      {
        id: 'ref-2',
        sentiment: 'constructive',
        text: 'Homework 2 on neural net backprop was quite heavy. An extra TA walk-through session on matrix dimensions would be extremely helpful.',
        date: '4 days ago',
        rating: 4
      },
      {
        id: 'ref-3',
        sentiment: 'positive',
        text: 'Great real-world case studies on ethics in autonomous agents. One of the best intro courses this semester.',
        date: '1 week ago',
        rating: 5
      }
    ]
  },
  psy202: {
    courseId: 'psy202',
    courseCode: 'PSY202: Cognitive Science',
    courseTitle: 'Cognitive Science',
    instructor: 'Dr. Liana',
    overallSatisfaction: 8.4,
    deltaScore: 0.2,
    totalStudents: 180,
    responseRate: 65,
    weeklyTrends: [
      { week: 'Week 1', score: 7.9 },
      { week: 'Week 2', score: 8.1 },
      { week: 'Week 3', score: 8.4 },
      { week: 'Week 4', score: 8.8 }
    ],
    categoryScores: [
      { name: 'Teaching Quality', score: 4.4, description: 'Insightful lectures connecting neurology to psychology' },
      { name: 'Course Content', score: 4.2, description: 'Readings load and journal critiques' },
      { name: 'Communication', score: 4.5, description: 'Clear essay guidelines and feedback timelines' },
      { name: 'Student Engagement', score: 4.3, description: 'Debate on conscious machines and perception' },
      { name: 'Overall Experience', score: 4.3, description: 'Overall course rating and intellectual stimulation' }
    ],
    recentReflections: [
      {
        id: 'ref-psy-1',
        sentiment: 'positive',
        text: 'Dr. Liana brings amazing experimental examples into every class. The visual illusion demos were super memorable.',
        date: '3 days ago',
        rating: 5
      },
      {
        id: 'ref-psy-2',
        sentiment: 'constructive',
        text: 'The reading list for Week 3 was very dense. Would love a summary study guide before the midterm.',
        date: '5 days ago',
        rating: 3
      }
    ]
  },
  mat105: {
    courseId: 'mat105',
    courseCode: 'MAT105: Calculus',
    courseTitle: 'Calculus',
    instructor: 'Dr. Simon',
    overallSatisfaction: 8.1,
    deltaScore: 0.1,
    totalStudents: 310,
    responseRate: 72,
    weeklyTrends: [
      { week: 'Week 1', score: 7.5 },
      { week: 'Week 2', score: 7.8 },
      { week: 'Week 3', score: 8.3 },
      { week: 'Week 4', score: 8.5 }
    ],
    categoryScores: [
      { name: 'Teaching Quality', score: 4.3, description: 'Step-by-step whiteboard derivations and problem solving' },
      { name: 'Course Content', score: 4.1, description: 'Rigorous theorem proofs and calculus problem sets' },
      { name: 'Communication', score: 4.2, description: 'Timely posting of homework solutions' },
      { name: 'Student Engagement', score: 3.9, description: 'Recitation problem solving sessions' },
      { name: 'Overall Experience', score: 4.1, description: 'Satisfaction with calculus preparation' }
    ],
    recentReflections: [
      {
        id: 'ref-mat-1',
        sentiment: 'positive',
        text: 'Dr. Simon explains tricky integration techniques with great clarity. Office hours helped me pass the quiz.',
        date: 'Yesterday',
        rating: 4
      }
    ]
  }
};

export const COURSE_MATERIALS = [
  {
    id: 'mat-1',
    courseCode: 'CS101',
    title: 'Lecture 06: Heuristic Search & A* Algorithm',
    type: 'PDF Slides',
    size: '4.2 MB',
    date: 'Oct 08, 2026',
    instructor: 'Dr. Aris'
  },
  {
    id: 'mat-2',
    courseCode: 'CS101',
    title: 'Assignment 2 Starter Code & Kaggle Notebook',
    type: 'Jupyter Notebook',
    size: '1.8 MB',
    date: 'Oct 05, 2026',
    instructor: 'Dr. Aris'
  },
  {
    id: 'mat-3',
    courseCode: 'PSY202',
    title: 'Cognitive Architecture & Working Memory Slides',
    type: 'PDF Slides',
    size: '6.5 MB',
    date: 'Oct 04, 2026',
    instructor: 'Dr. Liana'
  },
  {
    id: 'mat-4',
    courseCode: 'MAT105',
    title: 'Integration Techniques & Series Formula Reference',
    type: 'Cheatsheet PDF',
    size: '890 KB',
    date: 'Sep 29, 2026',
    instructor: 'Dr. Simon'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'Is my feedback completely anonymous?',
    answer: 'Yes. All course feedback submissions are aggregated and stripped of identifiable student records before instructors can review them.'
  },
  {
    question: 'Can I edit my feedback after submission?',
    answer: 'Before the deadline, you can review and update your feedback from the "My Feedbacks" tab at any time.'
  },
  {
    question: 'How do faculty use this feedback?',
    answer: 'Faculty and department deans review feedback insights to refine teaching methods, adjust workload pacing, update course materials, and improve curriculum design.'
  },
  {
    question: 'What happens if I miss the evaluation deadline?',
    answer: 'Feedback submissions close at 11:59 PM on the stated deadline date to allow timely semester metric aggregation.'
  }
];
