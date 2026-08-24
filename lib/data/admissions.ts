import { FeeStructureItem, FAQItem } from "../types";
import { FEE_TIERS, COLLEGE_INFO } from "./constants";

export const feeStructureData: FeeStructureItem[] = [
  {
    groupName: "F.Sc Pre-Medical",
    admissionFee: FEE_TIERS.admissionFee,
    monthlyTuitionCivilian: FEE_TIERS.monthlyTuition.civilian,
    monthlyTuitionForces: FEE_TIERS.monthlyTuition.forces,
    scienceLabMonthlyFee: FEE_TIERS.scienceLabMonthlyFee,
    prospectusAndRegistrationFee: FEE_TIERS.prospectusAndRegistrationFee,
  },
  {
    groupName: "F.Sc Pre-Engineering",
    admissionFee: FEE_TIERS.admissionFee,
    monthlyTuitionCivilian: FEE_TIERS.monthlyTuition.civilian,
    monthlyTuitionForces: FEE_TIERS.monthlyTuition.forces,
    scienceLabMonthlyFee: FEE_TIERS.scienceLabMonthlyFee,
    prospectusAndRegistrationFee: FEE_TIERS.prospectusAndRegistrationFee,
  },
  {
    groupName: "ICS (Computer Science)",
    admissionFee: FEE_TIERS.admissionFee,
    monthlyTuitionCivilian: FEE_TIERS.monthlyTuition.civilian,
    monthlyTuitionForces: FEE_TIERS.monthlyTuition.forces,
    scienceLabMonthlyFee: FEE_TIERS.scienceLabMonthlyFee,
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
    description: "Merit is determined strictly on the basis of marks obtained in the Matriculation (SSC) examination. Selected candidate lists are published on the college notice board.",
  },
  {
    step: 4,
    title: "Fee Deposit & Document Verification",
    description: "Shortlisted candidates collect the Bank Fee Challan from the Accounts Office and deposit admission dues at designated bank branches within the prescribed date.",
  },
  {
    step: 5,
    title: "College ID & Freshmen Orientation",
    description: "Submit the verified fee challan copy to Student Affairs, collect College ID card, uniform voucher, class section timetable, and attend Freshmen Orientation.",
  },
];

export const faqsData: FAQItem[] = [
  {
    id: "faq-1",
    category: "Admissions",
    question: "What is the minimum Matric marks percentage required for F.Sc Pre-Medical and Pre-Engineering?",
    answer: "For F.Sc Pre-Medical, a minimum of 70% marks in Matric (Science with Biology) is required. For F.Sc Pre-Engineering, a minimum of 65% marks is required. For ICS, a minimum of 60% marks is required.",
  },
  {
    id: "faq-2",
    category: "Admissions",
    question: "If I passed Matriculation from another provincial BISE Board, can I apply?",
    answer: "Yes. Students from all secondary education boards of Pakistan are welcome to apply. Upon admission, an official Migration Certificate (NOC) from your parent board is required.",
  },
  {
    id: "faq-3",
    category: "Fee Structure",
    question: "How is the college fee structured and paid?",
    answer: "Admission fee is paid only once upon enrollment (Rs. 15,000). Tuition fee is payable monthly (Rs. 5,500/month for Civilians, Rs. 3,500/month for Armed Forces dependents) through bank challans.",
  },
  {
    id: "faq-4",
    category: "Transport",
    question: "Is transport pick-and-drop facility available for students?",
    answer: "Yes. Bahria College Hanif operates a dedicated, secure fleet of buses and vans covering major routes across the city with fixed morning and afternoon timings.",
  },
];
