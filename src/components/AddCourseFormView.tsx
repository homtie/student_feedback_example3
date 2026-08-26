import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { Header } from './Header';

interface AddCourseFormViewProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Mathematics & Statistics',
  'Psychology & Cognitive Studies',
  'Humanities & Literature',
  'Biological Sciences',
  'Physics & Astronomy',
  'Business & Economics',
  'Design & Digital Media'
];

export const AddCourseFormView: React.FC<AddCourseFormViewProps> = ({
  onOpenSearch,
  onOpenNotifications
}) => {
  const { addNewCourse, setActiveTab, startReview } = useFeedback();

  // Form Fields
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [instructor, setInstructor] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [credits, setCredits] = useState<number>(3);
  const [term, setTerm] = useState('Fall 2026');
  const [deadline, setDeadline] = useState('Nov 15');

  // Status & Validation
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdCourseCode, setCreatedCourseCode] = useState<string | null>(null);
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!courseTitle.trim()) {
      setErrorMessage('Please provide a course title.');
      return;
    }
    if (!courseCode.trim()) {
      setErrorMessage('Please provide a course code (e.g. CS201).');
      return;
    }
    if (!instructor.trim()) {
      setErrorMessage('Please provide an instructor name.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide a course description.');
      return;
    }

    const cleanCode = courseCode.trim().toUpperCase();
    const cleanId = cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '') || `course-${Date.now()}`;

    // Add new course and persist
    addNewCourse({
      title: courseTitle.trim(),
      code: cleanCode,
      instructor: instructor.trim(),
      description: description.trim(),
      department,
      credits,
      term,
      deadline
    });

    setCreatedCourseCode(cleanCode);
    setCreatedCourseId(cleanId);

    // Reset Form Fields
    setCourseTitle('');
    setCourseCode('');
    setInstructor('');
    setDescription('');
  };

  return (
    <div id="add-course-view" className="max-w-[1280px] w-full mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
        <div>
          <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
            Curriculum Management
          </span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-[#2D2926] tracking-tight mt-1">
            Add New Course
          </h2>
          <p className="text-sm md:text-base text-[#6B665E] mt-1">
            Register a new academic course, syllabus description, and assigned faculty instructor.
          </p>
        </div>

        <Header onOpenSearch={onOpenSearch} onOpenNotifications={onOpenNotifications} />
      </header>

      {/* Success Notification Banner */}
      {createdCourseCode && (
        <div className="mb-8 p-6 bg-[#E2EBD8] text-[#2D2926] border border-[#A3B18A] rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3D5A20] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">check</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-base text-[#2D2926]">
                Course {createdCourseCode} added successfully!
              </h4>
              <p className="text-xs text-[#3D5A20]">
                Persisted to your course database in localStorage and ready for student feedback evaluations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (createdCourseId) startReview(createdCourseId);
              }}
              className="px-4 py-2 bg-[#3D5A20] hover:bg-[#2c4217] text-white rounded-full text-xs font-semibold btn-shadow transition-all cursor-pointer whitespace-nowrap"
            >
              Evaluate Now
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className="px-4 py-2 bg-white text-[#2D2926] hover:bg-[#FAF9F7] rounded-full text-xs font-semibold border border-[#A3B18A] transition-all cursor-pointer whitespace-nowrap"
            >
              View in Dashboard
            </button>
            <button
              onClick={() => setCreatedCourseCode(null)}
              className="p-1 text-[#3D5A20] hover:bg-black/5 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid: Form and Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form Component */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-10 ambient-shadow border border-[#E5E1D9]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Course Title & Code Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems & Cloud Infrastructure"
                  className="w-full p-3.5 bg-[#FAF9F7] border border-[#E5E1D9] rounded-2xl text-sm text-[#2D2926] focus:ring-2 focus:ring-[#5A5A40] focus:outline-none placeholder:text-[#8A7E6A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2">
                  Course Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CS401"
                  className="w-full p-3.5 bg-[#FAF9F7] border border-[#E5E1D9] rounded-2xl text-sm font-bold text-[#2D2926] uppercase focus:ring-2 focus:ring-[#5A5A40] focus:outline-none placeholder:text-[#8A7E6A]"
                />
              </div>
            </div>

            {/* Instructor Name & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2">
                  Instructor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="e.g. Dr. Elena Rostova"
                  className="w-full p-3.5 bg-[#FAF9F7] border border-[#E5E1D9] rounded-2xl text-sm text-[#2D2926] focus:ring-2 focus:ring-[#5A5A40] focus:outline-none placeholder:text-[#8A7E6A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2">
                  Academic Department
                </label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-3.5 bg-[#FAF9F7] border border-[#E5E1D9] rounded-2xl text-sm text-[#2D2926] focus:ring-2 focus:ring-[#5A5A40] focus:outline-none appearance-none pr-10"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#8A7E6A]">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
                  Course Description & Objectives <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-[#8A7E6A]">{description.length} characters</span>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive introduction covering core theoretical concepts, laboratory programming assignments, and semester research project requirements..."
                className="w-full p-3.5 bg-[#FAF9F7] border border-[#E5E1D9] rounded-2xl text-sm text-[#2D2926] focus:ring-2 focus:ring-[#5A5A40] focus:outline-none resize-none leading-relaxed placeholder:text-[#8A7E6A]"
              ></textarea>
            </div>

            {/* Term, Credits & Deadline Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-[#8A7E6A] uppercase tracking-wider mb-1.5">
                  Academic Term
                </label>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Fall 2026"
                  className="w-full p-2.5 bg-[#FAF9F7] border border-[#E5E1D9] rounded-xl text-xs text-[#2D2926] focus:ring-1 focus:ring-[#5A5A40] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8A7E6A] uppercase tracking-wider mb-1.5">
                  Credit Hours
                </label>
                <select
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#FAF9F7] border border-[#E5E1D9] rounded-xl text-xs text-[#2D2926] focus:ring-1 focus:ring-[#5A5A40] focus:outline-none"
                >
                  <option value={1}>1 Credit</option>
                  <option value={2}>2 Credits</option>
                  <option value={3}>3 Credits</option>
                  <option value={4}>4 Credits</option>
                  <option value={5}>5 Credits</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8A7E6A] uppercase tracking-wider mb-1.5">
                  Evaluation Deadline
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="Nov 15"
                  className="w-full p-2.5 bg-[#FAF9F7] border border-[#E5E1D9] rounded-xl text-xs text-[#2D2926] focus:ring-1 focus:ring-[#5A5A40] focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#E5E1D9] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#8A7E6A]">
                ✓ Course will be saved to localStorage and added to active enrollment.
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-[#5A5A40] hover:bg-[#464632] text-white text-xs md:text-sm font-semibold rounded-full btn-shadow transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Save & Create Course</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card on the side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 ambient-shadow border border-[#E5E1D9] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider">
                Live Dashboard Card Preview
              </span>
              <span className="px-2 py-0.5 bg-[#F2EDE4] text-[#5A5A40] text-[10px] font-bold rounded-full border border-[#E5E1D9]">
                Interactive Preview
              </span>
            </div>

            {/* Simulated Course Card */}
            <div className="bg-[#FAF9F7] rounded-2xl p-5 border border-[#E5E1D9] space-y-4">
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-0.5 bg-[#F2EDE4] text-[#5A5A40] rounded-full text-xs font-bold border border-[#E5E1D9]">
                  {courseCode.trim().toUpperCase() || 'COURSE-CODE'}
                </span>
                <span className="text-xs font-medium text-[#8A5A40]">
                  Due {deadline || 'Nov 15'}
                </span>
              </div>

              <div>
                <h4 className="font-headline text-lg font-bold text-[#2D2926] leading-tight">
                  {courseTitle.trim() || 'Course Title Preview'}
                </h4>
                <p className="text-xs text-[#6B665E] mt-1">
                  Instructor: <span className="font-semibold text-[#2D2926]">{instructor.trim() || 'Dr. Assigned Faculty'}</span>
                </p>
                <p className="text-[11px] text-[#8A7E6A]">
                  {department} • {credits} Credits • {term}
                </p>
              </div>

              <p className="text-xs text-[#6B665E] line-clamp-3 bg-white p-3 rounded-xl border border-[#E5E1D9] italic">
                "{description.trim() || 'Course description and syllabus overview will appear here for student review.'}"
              </p>

              <div className="pt-2 border-t border-[#E5E1D9] flex justify-between items-center">
                <span className="text-[11px] text-[#8A7E6A]">Status: Not Started</span>
                <span className="px-3 py-1 bg-[#5A5A40] text-white rounded-full text-xs font-semibold btn-shadow">
                  Start Review
                </span>
              </div>
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="bg-[#FAF9F7] rounded-3xl p-6 border border-[#E5E1D9] space-y-2.5">
            <h5 className="font-headline font-bold text-sm text-[#2D2926] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#5A5A40]">info</span>
              <span>Course Creation Guidelines</span>
            </h5>
            <p className="text-xs text-[#6B665E] leading-relaxed">
              When adding new courses, ensure the course code matches your institutional catalog standards (e.g. 2–4 letter prefix with 3 numerical digits).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
