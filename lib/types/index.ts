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
  eligibility: {
    minMatricMarksPercentage: number;
    requiredMatricSubjects: string[];
    details: string;
  };
  seats: number;
  monthlyTuitionFee: number;
  admissionFee: number;
  scienceLabFee: number;
  description: string;
  image: string;
  subjectsPart1: SubjectItem[];
  subjectsPart2: SubjectItem[];
  careerOpportunities: {
    field: string;
    description: string;
    targetUniversities: string[];
  }[];
  weeklyTimetableSample: {
    period: string;
    time: string;
    subject: string;
    type: "Lecture" | "Practical Lab" | "Tutorial / Test";
  }[];
}

export interface NoticeItem {
  id: string;
  title: string;
  category: "Date Sheet" | "Roll No Slip" | "Merit List" | "Holidays" | "Fee Due Date" | "General Notice";
  date: string;
  description: string;
  fileDownloadUrl?: string;
  fileSize?: string;
  isPinned?: boolean;
  isUrgent?: boolean;
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

export interface Lecturer {
  id: string;
  name: string;
  subject: string;
  designation: "Head of Department & Senior Lecturer" | "Senior Lecturer" | "Lecturer" | "Lab Demonstrator";
  qualification: string;
  experienceYears: number;
  image: string;
  subjectsTaught: string[];
  department: string;
}

export interface MeritListEntry {
  listNumber: "1st Merit List" | "2nd Merit List" | "3rd Merit List";
  group: string;
  closingMatricMarks: number;
  closingPercentage: number;
  announcementDate: string;
  feeDeadline: string;
  pdfUrl?: string;
}

export interface FeeItem {
  groupName: string;
  admissionFee: number;
  monthlyTuitionFee: number;
  scienceLabMonthlyFee: number;
  prospectusAndRegistrationFee: number;
  annualExaminationFee: number;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
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

export interface NewsArticle {
  slug: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  author: { name: string; role: string; avatar: string };
  content: string[];
  tags: string[];
}

export interface CampusEvent {
  slug: string;
  title: string;
  description: string;
  fullDetails: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  coverImage: string;
  totalSeats: number;
  registeredSeats: number;
  speaker?: { name: string; title: string; organization: string };
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  department: string;
  degreeLevel: string;
  badge?: string;
  description: string;
  duration: string;
  seats: number;
  feePerSemester: number;
  image: string;
  eligibility: string[];
  learningOutcomes: string[];
  curriculum: { semester: string; courses: { code: string; name: string; creditHours: number; isLab?: boolean }[] }[];
  labFacilities: string[];
  careerOpportunities: string[];
  facultyLead: { name: string; designation: string; qualification: string; image: string };
}
