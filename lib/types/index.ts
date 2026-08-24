export type GroupSlug = 'pre-medical' | 'pre-engineering' | 'computer-science';

export interface SubjectItem {
  name: string;
  code: string;
  theoryMarks: number;
  practicalMarks?: number;
  totalMarks: number;
  description: string;
}

export interface IntermediateGroup {
  id: string;
  slug: GroupSlug;
  title: string;
  shortTitle: string;
  qualification: "F.Sc (Pre-Medical)" | "F.Sc (Pre-Engineering)" | "ICS (Computer Science)";
  duration: "2 Years (Part-I & Part-II / HSSC)";
  class11Seats: number; // Applies to Class 11 only. Same count open to boys & girls
  monthlyTuitionFee: {
    civilian: number;
    forces: number; // Armed forces dependents (Navy, Army, Air Force)
  };
  admissionFee: number;
  scienceLabFee: number;
  description: string;
  image: string;
  eligibility: {
    minMatricMarksPercentage: number;
    requiredMatricSubjects: string[];
    details: string;
  };
  subjectsPart1: SubjectItem[];
  subjectsPart2: SubjectItem[];
  careerOpportunities: {
    field: string;
    description: string;
    targetUniversities: string[];
  }[];
}

export interface NoticeItem {
  id: string;
  title: string;
  category: "Date Sheet" | "Roll No Slip" | "Holiday" | "Fee Due Date" | "General Notice";
  date: string;
  description: string;
  file_url?: string;
  file_size?: string;
  is_pinned?: boolean;
  is_urgent?: boolean;
  created_by?: string;
}

export interface AnnouncementItem {
  id: string;
  heading: string;
  image_url: string;
  description: string;
  date: string;
  created_by?: string;
}

export interface PositionHolder {
  id: string;
  name: string;
  fatherName: string;
  rollNumber: string;
  group: "Pre-Medical" | "Pre-Engineering" | "Computer Science";
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  boardRank: string;
  boardName: string;
  passingYear: number;
  photo: string;
  currentInstitution: string;
}

export interface FacilityItem {
  id: string;
  name: string;
  category: "Science Labs" | "Academic" | "Sports" | "Student Services";
  description: string;
  image: string;
  keyFeatures: string[];
  inCharge?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: "Principal" | "Vice Principal" | "Subject Teacher" | "Lab Teacher" | "PTI";
  subject?: string; // for Subject Teacher / Lab Teacher
  labType?: "Physics" | "Chemistry" | "Biology" | "Library"; // only for Lab Teacher
  qualification: string;
  classesTaught: {
    group: "Pre-Medical" | "Pre-Engineering" | "Computer Science";
    classLevel: "11th" | "12th";
    section?: string;
  }[]; // supports one teacher teaching multiple classes/sections
  image?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  type: "image" | "video";
  mediaUrl: string;
  thumbnailUrl: string;
  caption: string;
  date: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface FeeStructureItem {
  groupName: string;
  admissionFee: number;
  monthlyTuitionCivilian: number;
  monthlyTuitionForces: number;
  scienceLabMonthlyFee: number;
  prospectusAndRegistrationFee: number;
}

export type PortalUserRole = "admin" | "student" | "teacher" | "parent";

export interface StudentProfile {
  id: string; // College ID e.g. "BCH-2026-0101"
  name: string;
  fatherName: string;
  group: "Pre-Medical" | "Pre-Engineering" | "Computer Science";
  classLevel: "11th" | "12th";
  section: "Section A" | "Section B" | "Section C";
  category: "Civilian" | "Armed Forces";
  feeStatus: "Paid" | "Unpaid";
  dueAmount: number;
  timetable: {
    day: string;
    periods: { time: string; subject: string; teacher: string; room: string }[];
  }[];
  internalExamResults: {
    examName: "1st Term Assessment" | "Mid-Term Send-Up" | "Pre-Board Mock";
    examDate: string;
    subjects: { name: string; totalMarks: number; obtainedMarks: number; grade: string }[];
    totalObtained: number;
    totalMax: number;
    percentage: number;
  }[];
  attendancePercentage: number;
  ptmTiming?: string;
}

export interface TeacherProfile {
  id: string; // Teacher ID e.g. "TCH-004"
  name: string;
  subject: string;
  classesTaught: {
    group: "Pre-Medical" | "Pre-Engineering" | "Computer Science";
    classLevel: "11th" | "12th";
    section: string;
  }[];
  timetable: {
    day: string;
    periods: { time: string; class: string; subject: string; room: string }[];
  }[];
}
