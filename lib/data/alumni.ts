import { Alumnus } from "../types";

export const alumniData: Alumnus[] = [
  {
    id: "dr-maryam-nawaz",
    name: "Dr. Maryam Nawaz Khan",
    graduationYear: 2017,
    program: "F.Sc Pre-Medical",
    currentRole: "Surgical Resident in Pediatric Neurosurgery",
    institutionOrCompany: "Johns Hopkins Hospital, Baltimore, USA",
    location: "Baltimore, USA",
    quote: "Bahria College Hanif instilled in me the work ethic, scientific skepticism, and humanity required to succeed in global surgery.",
    story: "After achieving top marks at Bahria Hanif, Maryam graduated with honors from Aga Khan University, secured a stellar USMLE step score, and matched into Johns Hopkins Pediatric Neurosurgery Residency.",
    image: "https://images.unsplash.com/photo-1594824813590-410a520448ca?auto=format&fit=crop&w=600&q=80",
    verifiedBadge: "Johns Hopkins Resident",
  },
  {
    id: "dr-usman-tariq",
    name: "Dr. Usman Tariq, Ph.D.",
    graduationYear: 2015,
    program: "BS Biotechnology",
    currentRole: "Lead Scientist, Cancer Immunotherapy",
    institutionOrCompany: "BioNTech SE, Mainz, Germany",
    location: "Mainz, Germany",
    quote: "The molecular genetics lab at Bahria Hanif was where I first pipetted a PCR tube. That exact spark carried me to my doctorate in Munich.",
    story: "Usman completed his doctoral studies at the Ludwig Maximilian University of Munich and is currently directing an mRNA neo-antigen discovery team at BioNTech in Germany.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    verifiedBadge: "BioNTech Lead Scientist",
  },
  {
    id: "dr-bilal-ansari",
    name: "Dr. Bilal Ansari",
    graduationYear: 2019,
    program: "F.Sc Pre-Medical",
    currentRole: "Consultant Medical Officer & Clinical Researcher",
    institutionOrCompany: "Shaukat Khanum Memorial Cancer Hospital, Lahore",
    location: "Lahore, Pakistan",
    quote: "The discipline, mentorship, and high standards set by the faculty laid an indestructible foundation for my medical career.",
    story: "Bilal is an author of 12 clinical oncology publications and leads clinical trials on adjuvant chemotherapy protocols in Pakistan.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    verifiedBadge: "Shaukat Khanum Memorial",
  },
];

export const alumniGivingTiers = [
  {
    name: "Scholarship Patron",
    amount: "PKR 100,000 / year",
    description: "Funds 100% full-tuition for a deserving pre-medical scholar for one entire academic year.",
    benefits: [
      "Named student scholarship in your honor",
      "Direct annual progress reports from the scholar",
      "Invitation to the Annual President's Gala Dinner",
    ],
  },
  {
    name: "Medical Lab Innovation Partner",
    amount: "PKR 350,000 / year",
    description: "Sponsors specialized molecular biology reagents, microscope upgrades, and AI compute GPUs.",
    benefits: [
      "Dedication plaque in the Science Pavilion",
      "VIP access to all annual medical symposiums and keynote panels",
      "Direct engagement with student research cohorts",
    ],
  },
  {
    name: "Hanif Memorial Endowment Benefactor",
    amount: "PKR 1,000,000+ (One-time or recurring)",
    description: "Permanent endowment establishing new research wings, high-tech hospital simulation centers, and faculty fellowships.",
    benefits: [
      "Permanent institutional naming rights for lab/auditorium",
      "Lifetime membership on the Board of Alumni Advisors",
      "Honorary Key to the College and annual awards presentation",
    ],
  },
];
