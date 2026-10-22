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

export const EXAM_CONFIG = {
  Assessment: { perPaperMarks: 50 },
  // TODO(user): confirm per-paper marks for Send-up and Pre-Board
  "Send-up": { perPaperMarks: null as number | null },
  "Pre-Board": { perPaperMarks: null as number | null },
};

// TODO(user): fill in the 7 subjects for each group (Class 11). Do NOT invent subjects.
export const EXAM_SUBJECTS: Record<"Pre-Medical" | "Pre-Engineering" | "Computer Science", string[]> = {
  "Pre-Medical": [],
  "Pre-Engineering": [],
  "Computer Science": [],
};
