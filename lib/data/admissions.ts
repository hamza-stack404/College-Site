import { MeritListEntry, FeeItem, FAQItem } from "../types";

export const feeStructureData: FeeItem[] = [
  {
    groupName: "F.Sc Pre-Medical",
    admissionFee: 15000,
    monthlyTuitionFee: 5000,
    scienceLabMonthlyFee: 1500,
    prospectusAndRegistrationFee: 1000,
    annualExaminationFee: 4000,
  },
  {
    groupName: "F.Sc Pre-Engineering",
    admissionFee: 15000,
    monthlyTuitionFee: 4500,
    scienceLabMonthlyFee: 1500,
    prospectusAndRegistrationFee: 1000,
    annualExaminationFee: 4000,
  },
  {
    groupName: "ICS (Computer Science)",
    admissionFee: 15000,
    monthlyTuitionFee: 4800,
    scienceLabMonthlyFee: 1500,
    prospectusAndRegistrationFee: 1000,
    annualExaminationFee: 4000,
  },
];

export const meritListsSchedule: MeritListEntry[] = [
  {
    listNumber: "1st Merit List",
    group: "Pre-Medical / Pre-Engineering / ICS",
    closingMatricMarks: 850,
    closingPercentage: 77.27,
    announcementDate: "August 20, 2026",
    feeDeadline: "August 28, 2026",
    pdfUrl: "#",
  },
  {
    listNumber: "2nd Merit List",
    group: "Pre-Medical / Pre-Engineering / ICS",
    closingMatricMarks: 780,
    closingPercentage: 70.91,
    announcementDate: "September 02, 2026",
    feeDeadline: "September 09, 2026",
    pdfUrl: "#",
  },
  {
    listNumber: "3rd Merit List",
    group: "Pre-Medical / Pre-Engineering / ICS",
    closingMatricMarks: 715,
    closingPercentage: 65.0,
    announcementDate: "September 12, 2026",
    feeDeadline: "September 18, 2026",
    pdfUrl: "#",
  },
];

export const requiredDocumentsList = [
  { title: "Original Matric / SSC Detailed Marks Certificate (DMC / Result Card)", copies: "Original + 3 Attested Photocopies" },
  { title: "Matriculation Board Sanad / Provisional Certificate", copies: "2 Attested Photocopies" },
  { title: "Student Computerized B-Form / CNIC (NADRA)", copies: "3 Attested Photocopies" },
  { title: "Father / Guardian Computerized National Identity Card (CNIC)", copies: "2 Attested Photocopies" },
  { title: "Recent Passport Size Photographs with Blue Background", copies: "6 Photographs (Name on back)" },
  { title: "Character Certificate from the Head of the School last attended", copies: "Original + 2 Photocopies" },
  { title: "Original Board Migration Certificate (NOC) — Required only if Matric was passed from a Board other than local BISE", copies: "Original NOC" },
  { title: "Affidavit / Undertaking of College Discipline & Attendance on Rs. 100 Stamp Paper", copies: "Original Signed Stamp Paper" },
];

export const admissionStepsPakistan = [
  {
    step: 1,
    title: "Obtain College Prospectus & Admission Form",
    description: "Collect the official prospectus and admission form from the College Admissions Window or download the printable form online after Matriculation results are declared.",
  },
  {
    step: 2,
    title: "Form Submission with Attested Documents",
    description: "Submit the filled admission form along with attested copies of Matric DMC, B-Form, Character Certificate, and photographs before the notified submission cutoff date.",
  },
  {
    step: 3,
    title: "Merit List Display (1st, 2nd & 3rd Lists)",
    description: "Merit is determined strictly on the basis of marks obtained in the Matriculation (SSC) examination. Check your name on the college notice board or online result portal.",
  },
  {
    step: 4,
    title: "Fee Deposit & Document Verification",
    description: "Shortlisted students collect the official Bank Fee Challan from the Accounts Office and deposit admission dues at designated bank branches within the prescribed date.",
  },
  {
    step: 5,
    title: "College Roll Number & Orientation Day",
    description: "Submit the verified paid fee challan copy to Student Affairs, collect College ID card, uniform voucher, class section timetable, and attend Freshmen Orientation.",
  },
];

export const faqsData: FAQItem[] = [
  {
    id: "faq-1",
    category: "Admissions",
    question: "What is the minimum Matric marks percentage required for F.Sc Pre-Medical and Pre-Engineering?",
    answer: "For F.Sc Pre-Medical, a minimum of 70% marks (770/1100) in Matric (Science with Biology) is required. For F.Sc Pre-Engineering, a minimum of 65% marks (715/1100) is required. For ICS, a minimum of 60% marks (660/1100) is required.",
  },
  {
    id: "faq-2",
    category: "Admissions",
    question: "If I passed Matriculation from another BISE Board or FBISE, can I apply?",
    answer: "Yes. Students from all BISE Boards of Pakistan (Sindh, Punjab, KP, Balochistan, and FBISE Islamabad) are welcome to apply. If admitted, you must provide an official Migration Certificate (NOC) from your parent board.",
  },
  {
    id: "faq-3",
    category: "Fee & Financial Aid",
    question: "How is the college fee structured and paid?",
    answer: "Admission fee is paid only once at the time of initial enrollment (Rs. 15,000). Tuition fee is payable on a monthly basis (Rs. 4,500 – Rs. 5,000 / month) through Askari Bank / Allied Bank fee challan vouchers.",
  },
  {
    id: "faq-4",
    category: "Scholarships",
    question: "Are merit scholarships available for Board Position Holders and high scorers?",
    answer: "Yes! Bahria College Hanif offers 100% full tuition fee concession for students securing 90%+ marks (990+/1100) in Matric, and 50% tuition waiver for students securing 85%+ marks.",
  },
  {
    id: "faq-5",
    category: "Hostels & Transport",
    question: "Is transport pick-and-drop facility available for students?",
    answer: "Yes. Our college runs a dedicated, secure fleet of buses and vans covering 22+ major routes across the city with fixed morning and afternoon timings.",
  },
];
