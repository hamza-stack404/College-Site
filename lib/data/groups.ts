import { IntermediateGroup } from "../types";
import { FEE_TIERS } from "./constants";

export const intermediateGroupsData: IntermediateGroup[] = [
  {
    id: "pre-medical",
    slug: "pre-medical",
    title: "F.Sc Pre-Medical (HSSC)",
    shortTitle: "Pre-Medical",
    qualification: "F.Sc (Pre-Medical)",
    duration: "2 Years (Part-I & Part-II / HSSC)",
    class11Seats: 50,
    monthlyTuitionFee: {
      civilian: FEE_TIERS.monthlyTuition.civilian,
      forces: FEE_TIERS.monthlyTuition.forces,
    },
    admissionFee: FEE_TIERS.admissionFee,
    scienceLabFee: FEE_TIERS.scienceLabMonthlyFee,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    description:
      "The Pre-Medical group is designed for aspiring doctors, dentists, and allied healthcare specialists. The curriculum rigorously covers Biology, Chemistry, Physics, and compulsory subjects under the FBISE Federal Board curriculum with hands-on laboratory practicals.",
    eligibility: {
      minMatricMarksPercentage: 70,
      requiredMatricSubjects: ["Biology", "Chemistry", "Physics", "Mathematics"],
      details: "Matriculation (Science with Biology) or O-Levels with minimum 70% equivalent marks including Biology, Chemistry, and Physics.",
    },
    subjectsPart1: [
      { name: "Biology (Part-I)", code: "BIO-1", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Cell Biology, biological molecules, enzymes, bioenergetics, and taxonomy." },
      { name: "Chemistry (Part-I)", code: "CHM-1", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Physical and inorganic chemistry, atomic structure, and chemical equilibrium." },
      { name: "Physics (Part-I)", code: "PHY-1", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Mechanics, waves, circular motion, optics, and thermodynamics." },
      { name: "English (Compulsory Part-I)", code: "ENG-1", theoryMarks: 100, totalMarks: 100, description: "Grammar, comprehension, prose, and structured writing." },
      { name: "Urdu (Compulsory Part-I)", code: "URD-1", theoryMarks: 100, totalMarks: 100, description: "Prose, poetry, ghazals, and literary comprehension." },
      { name: "Islamic Education / Civics", code: "ISL-1", theoryMarks: 50, totalMarks: 50, description: "Quranic verses, Hadith, and Islamic ethical values." },
      { name: "Tarjuma-tul-Quran (Part-I)", code: "TTQ-1", theoryMarks: 50, totalMarks: 50, description: "Translation of prescribed Surahs." },
    ],
    subjectsPart2: [
      { name: "Biology (Part-II)", code: "BIO-2", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Human physiology, homeostasis, coordination, genetics, and biotechnology." },
      { name: "Chemistry (Part-II)", code: "CHM-2", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Organic synthesis, functional groups, hydrocarbons, and applied chemistry." },
      { name: "Physics (Part-II)", code: "PHY-2", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Electromagnetism, alternating currents, modern physics, and nuclear physics." },
      { name: "English (Compulsory Part-II)", code: "ENG-2", theoryMarks: 100, totalMarks: 100, description: "Essays, prose analysis, and language proficiency." },
      { name: "Urdu (Compulsory Part-II)", code: "URD-2", theoryMarks: 100, totalMarks: 100, description: "Advanced prose, poetry, and essay composition." },
      { name: "Pakistan Studies (Compulsory)", code: "PKS-2", theoryMarks: 50, totalMarks: 50, description: "History, constitutional development, geography, and ideology." },
      { name: "Tarjuma-tul-Quran (Part-II)", code: "TTQ-2", theoryMarks: 50, totalMarks: 50, description: "Translation and thematic study of assigned chapters." },
    ],
    careerOpportunities: [
      {
        field: "MBBS (Medicine & Surgery)",
        description: "Qualify for entrance to public and private medical universities across Pakistan.",
        targetUniversities: ["Army Medical College (AMC)", "King Edward Medical University", "Dow University of Health Sciences", "Aga Khan University"],
      },
      {
        field: "BDS (Dental Surgery)",
        description: "Dentistry, orthodontics, and oral and maxillofacial surgery.",
        targetUniversities: ["Army Medical College (Dental Wing)", "de'Montmorency College of Dentistry", "DIKIOHS"],
      },
      {
        field: "Pharm-D & Doctor of Physical Therapy (DPT)",
        description: "5-year clinical doctoral programs in pharmacology, drug formulation, and rehabilitation.",
        targetUniversities: ["Punjab University", "Karachi University", "Riphah International University"],
      },
      {
        field: "BS Allied Health & Biotechnology",
        description: "Medical lab sciences, biotechnology, microbiology, and forensic sciences.",
        targetUniversities: ["Quaid-i-Azam University (QAU)", "NUST", "University of Health Sciences (UHS)"],
      },
    ],
  },
  {
    id: "pre-engineering",
    slug: "pre-engineering",
    title: "F.Sc Pre-Engineering (HSSC)",
    shortTitle: "Pre-Engineering",
    qualification: "F.Sc (Pre-Engineering)",
    duration: "2 Years (Part-I & Part-II / HSSC)",
    class11Seats: 100,
    monthlyTuitionFee: {
      civilian: FEE_TIERS.monthlyTuition.civilian,
      forces: FEE_TIERS.monthlyTuition.forces,
    },
    admissionFee: FEE_TIERS.admissionFee,
    scienceLabFee: FEE_TIERS.scienceLabMonthlyFee,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    description:
      "The Pre-Engineering group provides a solid foundation in Advanced Mathematics, Physics, and Chemistry, preparing students for admission into top engineering and architecture institutions under the FBISE curriculum.",
    eligibility: {
      minMatricMarksPercentage: 65,
      requiredMatricSubjects: ["Mathematics", "Physics", "Chemistry"],
      details: "Matriculation (Science with Mathematics) or O-Levels with minimum 65% equivalent marks including Mathematics, Physics, and Chemistry.",
    },
    subjectsPart1: [
      { name: "Mathematics (Part-I)", code: "MTH-1", theoryMarks: 100, totalMarks: 100, description: "Algebra, matrices, quadratic equations, trigonometry, and sequences." },
      { name: "Physics (Part-I)", code: "PHY-1", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Mechanics, vectors, work and energy, oscillations, and heat." },
      { name: "Chemistry (Part-I)", code: "CHM-1", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Atomic structure, chemical bonding, gases, solids, and thermochemistry." },
      { name: "English (Compulsory Part-I)", code: "ENG-1", theoryMarks: 100, totalMarks: 100, description: "Prose, grammar, comprehension, and structured writing." },
      { name: "Urdu (Compulsory Part-I)", code: "URD-1", theoryMarks: 100, totalMarks: 100, description: "Prose, poetry, and essay composition." },
      { name: "Islamic Education / Civics", code: "ISL-1", theoryMarks: 50, totalMarks: 50, description: "Islamic beliefs, worship, and social responsibilities." },
      { name: "Tarjuma-tul-Quran (Part-I)", code: "TTQ-1", theoryMarks: 50, totalMarks: 50, description: "Translation of designated Surahs." },
    ],
    subjectsPart2: [
      { name: "Mathematics (Part-II)", code: "MTH-2", theoryMarks: 100, totalMarks: 100, description: "Calculus, differentiation, integration, analytical geometry, and vectors." },
      { name: "Physics (Part-II)", code: "PHY-2", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Electromagnetism, electronics, atomic spectra, and nuclear physics." },
      { name: "Chemistry (Part-II)", code: "CHM-2", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Inorganic periodicity, organic synthesis, and industrial chemistry." },
      { name: "English (Compulsory Part-II)", code: "ENG-2", theoryMarks: 100, totalMarks: 100, description: "Essay writing, novel study, and translation." },
      { name: "Urdu (Compulsory Part-II)", code: "URD-2", theoryMarks: 100, totalMarks: 100, description: "Literary essays and official correspondence." },
      { name: "Pakistan Studies (Compulsory)", code: "PKS-2", theoryMarks: 50, totalMarks: 50, description: "National development, history, and resources." },
      { name: "Tarjuma-tul-Quran (Part-II)", code: "TTQ-2", theoryMarks: 50, totalMarks: 50, description: "Thematic study and translation." },
    ],
    careerOpportunities: [
      {
        field: "Electrical, Mechanical, Civil & Chemical Engineering",
        description: "Core engineering disciplines for infrastructure, manufacturing, and energy.",
        targetUniversities: ["NUST Islamabad", "GIKI Topi", "UET Lahore", "NED University Karachi"],
      },
      {
        field: "Aerospace, Avionics & Mechatronics",
        description: "High-tech fields focusing on aircraft systems, robotics, and automation.",
        targetUniversities: ["Institute of Space Technology (IST)", "Air University", "NUST E&ME"],
      },
      {
        field: "Software Engineering & Computer Systems",
        description: "Integration of hardware and software design, microprocessors, and systems.",
        targetUniversities: ["FAST-NUCES", "NUST SEECS", "COMSATS"],
      },
    ],
  },
  {
    id: "computer-science",
    slug: "computer-science",
    title: "Intermediate in Computer Science — ICS (HSSC)",
    shortTitle: "Computer Science (ICS)",
    qualification: "ICS (Computer Science)",
    duration: "2 Years (Part-I & Part-II / HSSC)",
    class11Seats: 200,
    monthlyTuitionFee: {
      civilian: FEE_TIERS.monthlyTuition.civilian,
      forces: FEE_TIERS.monthlyTuition.forces,
    },
    admissionFee: FEE_TIERS.admissionFee,
    scienceLabFee: FEE_TIERS.scienceLabMonthlyFee,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    description:
      "The ICS program equips students with computer programming fundamentals, database architecture, IT concepts, and mathematics in modern computer laboratories under the FBISE curriculum.",
    eligibility: {
      minMatricMarksPercentage: 60,
      requiredMatricSubjects: ["Mathematics", "Science / Computer Science"],
      details: "Matriculation (Science or Computer Science with Mathematics) with minimum 60% marks.",
    },
    subjectsPart1: [
      { name: "Computer Science (Part-I)", code: "CSC-1", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Basics of IT, computer networks, architecture, and applications." },
      { name: "Mathematics (Part-I)", code: "MTH-1", theoryMarks: 100, totalMarks: 100, description: "Algebra, matrices, trigonometry, and quadratic equations." },
      { name: "Physics (Part-I) / Statistics", code: "PHY-1 / STAT-1", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Mechanics and thermodynamics OR statistical methods." },
      { name: "English (Compulsory Part-I)", code: "ENG-1", theoryMarks: 100, totalMarks: 100, description: "Grammar, prose, and comprehension." },
      { name: "Urdu (Compulsory Part-I)", code: "URD-1", theoryMarks: 100, totalMarks: 100, description: "Prose, poetry, and essay writing." },
      { name: "Islamic Education / Civics", code: "ISL-1", theoryMarks: 50, totalMarks: 50, description: "Islamic values and moral principles." },
      { name: "Tarjuma-tul-Quran (Part-I)", code: "TTQ-1", theoryMarks: 50, totalMarks: 50, description: "Translation of prescribed Surahs." },
    ],
    subjectsPart2: [
      { name: "Computer Science (Part-II)", code: "CSC-2", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "C / C++ programming, arrays, pointers, functions, and MS Access database." },
      { name: "Mathematics (Part-II)", code: "MTH-2", theoryMarks: 100, totalMarks: 100, description: "Calculus, limits, differentiation, and analytical geometry." },
      { name: "Physics (Part-II) / Statistics", code: "PHY-2 / STAT-2", theoryMarks: 80, practicalMarks: 20, totalMarks: 100, description: "Electromagnetism and electronics OR statistical inference." },
      { name: "English (Compulsory Part-II)", code: "ENG-2", theoryMarks: 100, totalMarks: 100, description: "Essay writing, novel study, and translation." },
      { name: "Urdu (Compulsory Part-II)", code: "URD-2", theoryMarks: 100, totalMarks: 100, description: "Prose, poetry, and official correspondence." },
      { name: "Pakistan Studies (Compulsory)", code: "PKS-2", theoryMarks: 50, totalMarks: 50, description: "History, culture, and governance." },
      { name: "Tarjuma-tul-Quran (Part-II)", code: "TTQ-2", theoryMarks: 50, totalMarks: 50, description: "Thematic study and translation." },
    ],
    careerOpportunities: [
      {
        field: "BS Computer Science (BS CS) & Software Engineering (BS SE)",
        description: "Software development, mobile apps, web engineering, and cloud platforms.",
        targetUniversities: ["FAST-NUCES", "NUST SEECS", "COMSATS", "Bahria University", "ITU"],
      },
      {
        field: "Artificial Intelligence & Data Science",
        description: "Machine learning, algorithm design, predictive analytics, and computer vision.",
        targetUniversities: ["FAST-NUCES", "NUST", "Air University", "GIKI"],
      },
      {
        field: "Cyber Security & Information Assurance",
        description: "Network protection, ethical hacking, digital forensics, and cryptography.",
        targetUniversities: ["Air University", "NUST", "FAST-NUCES"],
      },
    ],
  },
];
