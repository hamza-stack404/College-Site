export const COLLEGE_INFO = {
  name: "Bahria College Hanif",
  subTitle: "HSSC Intermediate Science & Computer College",
  affiliation: "Federal Board of Intermediate and Secondary Education (FBISE) Islamabad",
  boardCode: "FBISE-ISB",
  establishedYear: 2024,
  phonePrimary: "+92 (21) 3485-9100",
  phoneSecondary: "+92 (21) 3485-9101",
  email: "info@bahriahanif.edu.pk",
  admissionsEmail: "admissions@bahriahanif.edu.pk",
  address: "Hanif Science Pavilion, National Stadium Road, Karachi, Pakistan",
  officeHours: "Monday – Saturday: 08:00 AM – 02:00 PM PST | Friday: 08:00 AM – 12:30 PM PST",
  admissionStatus: "Closed",
  admissionNotice: "Admissions for the current academic year are closed. The next admission cycle opens after FBISE Matriculation results are announced.",
};

export const FEE_TIERS = {
  admissionFee: 15000, // One-time upon Class 11 admission
  prospectusAndRegistrationFee: 1000,
  monthlyTuition: {
    civilian: 5500,
    forces: 3500, // Navy / Army / Airforce dependents
  },
};

export interface SubjectMarksConfig {
  theory: number;
  practical: number;
}

export const SUBJECT_MARKS: Record<string, SubjectMarksConfig | null> = {
  English: { theory: 100, practical: 0 },
  Urdu: { theory: 100, practical: 0 },
  Mathematics: { theory: 100, practical: 0 },
  Physics: { theory: 80, practical: 20 },
  Chemistry: { theory: 80, practical: 20 },
  Biology: { theory: 80, practical: 20 },
  "Computer Science": { theory: 80, practical: 20 },
  Islamiat: { theory: 50, practical: 0 },
  "Pakistan Studies": { theory: 50, practical: 0 },
  "Tarjuma-tul-Quran (THQ)": null, // NOT PROVIDED YET. Do not invent. Subject is locked in the UI until this is filled.
};

export type ExamType = "Assessment" | "Send-up" | "Pre-Board";

export const EXAM_CONFIG: Record<
  ExamType,
  {
    marksConfig: Record<string, SubjectMarksConfig | null> | null;
  }
> = {
  Assessment: {
    marksConfig: null, // maximum marks NOT PROVIDED YET, set to null. Do not invent.
  },
  "Send-up": {
    marksConfig: SUBJECT_MARKS,
  },
  "Pre-Board": {
    marksConfig: SUBJECT_MARKS,
  },
};

export const EXAM_SUBJECTS: Record<
  "Pre-Medical" | "Pre-Engineering" | "Computer Science",
  Record<"11th" | "12th", string[]>
> = {
  "Pre-Engineering": {
    "11th": ["English", "Urdu", "Mathematics", "Chemistry", "Physics", "Tarjuma-tul-Quran (THQ)", "Islamiat"],
    "12th": ["English", "Urdu", "Mathematics", "Chemistry", "Physics", "Tarjuma-tul-Quran (THQ)", "Pakistan Studies"],
  },
  "Pre-Medical": {
    "11th": ["English", "Urdu", "Biology", "Chemistry", "Physics", "Tarjuma-tul-Quran (THQ)", "Islamiat"],
    "12th": ["English", "Urdu", "Biology", "Chemistry", "Physics", "Tarjuma-tul-Quran (THQ)", "Pakistan Studies"],
  },
  "Computer Science": {
    "11th": ["English", "Urdu", "Mathematics", "Computer Science", "Physics", "Tarjuma-tul-Quran (THQ)", "Islamiat"],
    "12th": ["English", "Urdu", "Mathematics", "Computer Science", "Physics", "Tarjuma-tul-Quran (THQ)", "Pakistan Studies"],
  },
};

// Shared grade function using the server code's standard FBISE / College scale (A+, A, B, C, F)
export function calculateGrade(obtained: number, total: number): string {
  if (total <= 0) return "—";
  const ratio = obtained / total;
  if (ratio >= 0.8) return "A+";
  if (ratio >= 0.7) return "A";
  if (ratio >= 0.6) return "B";
  if (ratio >= 0.5) return "C";
  return "F";
}

export function getSubjectMaxMarks(
  examType: ExamType,
  subject: string
): SubjectMarksConfig | null {
  const exam = EXAM_CONFIG[examType];
  if (!exam || !exam.marksConfig) return null;
  return exam.marksConfig[subject] ?? null;
}
