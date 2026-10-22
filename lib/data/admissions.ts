import { FeeStructureItem, FAQItem } from "../types";
import { FEE_TIERS, COLLEGE_INFO } from "./constants";

export const feeStructureData: FeeStructureItem[] = [
  {
    groupName: "F.Sc Pre-Medical",
    admissionFee: FEE_TIERS.admissionFee,
    monthlyTuitionCivilian: FEE_TIERS.monthlyTuition.civilian,
    monthlyTuitionForces: FEE_TIERS.monthlyTuition.forces,
    prospectusAndRegistrationFee: FEE_TIERS.prospectusAndRegistrationFee,
  },
  {
    groupName: "F.Sc Pre-Engineering",
    admissionFee: FEE_TIERS.admissionFee,
    monthlyTuitionCivilian: FEE_TIERS.monthlyTuition.civilian,
    monthlyTuitionForces: FEE_TIERS.monthlyTuition.forces,
    prospectusAndRegistrationFee: FEE_TIERS.prospectusAndRegistrationFee,
  },
  {
    groupName: "ICS (Computer Science)",
    admissionFee: FEE_TIERS.admissionFee,
    monthlyTuitionCivilian: FEE_TIERS.monthlyTuition.civilian,
    monthlyTuitionForces: FEE_TIERS.monthlyTuition.forces,
    prospectusAndRegistrationFee: FEE_TIERS.prospectusAndRegistrationFee,
  },
];

export const admissionStatusNotice = {
  status: COLLEGE_INFO.admissionStatus,
  message: COLLEGE_INFO.admissionNotice,
};

export const requiredDocumentsList = [
  { title: "Original Matric / SSC Detailed Marks Certificate (DMC / Result Card)", copies: "Original + 3 Attested Photocopies" },
  { title: "Matriculation Board Sanad / Provisional Certificate", copies: "2 Attested Photocopies" },
  { title: "Student Computerized B-Form / CNIC (NADRA)", copies: "3 Attested Photocopies" },
  { title: "Father / Guardian Computerized National Identity Card (CNIC)", copies: "2 Attested Photocopies" },
  { title: "Recent Passport Size Photographs with Blue Background", copies: "6 Photographs (Name on back)" },
  { title: "Character Certificate from the Head of the School last attended", copies: "Original + 2 Photocopies" },
  { title: "Original Board Migration Certificate (NOC) — Required only if Matric was passed from a Board other than FBISE", copies: "Original NOC" },
  { title: "Affidavit / Undertaking of College Discipline & Attendance on Rs. 100 Stamp Paper", copies: "Original Signed Stamp Paper" },
];

export const admissionStepsPakistan = [
  {
    step: 1,
    title: "Obtain College Prospectus & Admission Form",
    description: "Collect the official prospectus and admission form from the College Admissions Window or download the printable form online after FBISE Matriculation results are declared.",
  },
  {
    step: 2,
    title: "Form Submission with Attested Documents",
    description: "Submit the filled admission form along with attested copies of Matric DMC, B-Form, Character Certificate, and photographs before the notified submission cutoff date.",
  },
  {
    step: 3,
    title: "Merit List Display",
    description: "Merit lists are prepared based on Matric marks percentage and college interview. Selected candidates must deposit fee vouchers before the due date.",
  },
  {
    step: 4,
    title: "Fee Deposit & Document Verification",
    description: "Deposit the college admission fee voucher at the designated bank branch and submit the college copy along with original documents for final verification.",
  },
  {
    step: 5,
    title: "Orientation & Commencement of Classes",
    description: "Attend the mandatory freshmen orientation ceremony. Class timetables, college ID cards, and academic calendars are distributed on the first day.",
  },
];

export const faqsData: FAQItem[] = [
  {
    id: "faq-1",
    category: "Eligibility",
    question: "What is the minimum percentage required for admission into F.Sc Pre-Medical?",
    answer: "For F.Sc Pre-Medical, candidates must have passed Matriculation (Science group with Biology) or O-Levels equivalence with at least 70% aggregate marks.",
  },
  {
    id: "faq-2",
    category: "Fee & Quota",
    question: "Is there a fee concession or quota for Armed Forces dependents?",
    answer: "Yes, dependents of serving and retired Pakistan Navy, Army, and Airforce personnel are entitled to subsidized monthly tuition fee rates as per Bahria College regulations.",
  },
  {
    id: "faq-3",
    category: "Affiliation",
    question: "Which board is Bahria College Hanif affiliated with?",
    answer: "The college is strictly affiliated with the Federal Board of Intermediate and Secondary Education (FBISE) Islamabad. All syllabus, examinations, and certifications follow Federal Board standards.",
  },
  {
    id: "faq-4",
    category: "Facilities",
    question: "Are college bus transport services available?",
    answer: "Yes, the college operates dedicated transport routes covering major residential sectors of Karachi. Transport passes can be acquired upon admission from the Student Affairs office.",
  },
];
