import { FacilityItem } from "../types";

export const facilitiesData: FacilityItem[] = [
  {
    id: "fac-physics-lab",
    name: "Physics Laboratory",
    category: "Science Labs",
    description:
      "Fully equipped with modern optical benches, vernier callipers, screw gauges, cathode ray oscilloscopes, potentiometer kits, and spectrometer units to perform all BISE Board practical experiments.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    keyFeatures: [
      "40 Individual Workstation Bays with Individual Power Outlets",
      "Precision Vernier, Micrometer & Spherometer Measurement Kits",
      "Modern Laser & Glass Prism Optical Dispersion Benches",
      "Digital Multimeters, Rheostats & Resistance Boxes",
    ],
    inCharge: "Prof. Muhammad Asif (M.Sc Physics)",
  },
  {
    id: "fac-chemistry-lab",
    name: "Chemistry Laboratory",
    category: "Science Labs",
    description:
      "Spacious, well-ventilated laboratory featuring acid-resistant countertops, fume extraction hoods, analytical electronic balances, and certified reagent chemical racks for qualitative salt analysis and volumetric titrations.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    keyFeatures: [
      "Certified Fume Hoods & Safety Eye-Wash Stations",
      "High-Precision Analytical Digital Balances (0.001g)",
      "Standard Glassware & Titration Burette Assemblies",
      "Organized Organic & Inorganic Reagent Chemical Stores",
    ],
    inCharge: "Mrs. Naila Jabeen (M.Phil Chemistry)",
  },
  {
    id: "fac-biology-lab",
    name: "Biology & Dissection Laboratory",
    category: "Science Labs",
    description:
      "Equipped with compound binocular microscopes, high-magnification oil immersion lenses, permanent histological slides, 3D anatomical human models, and botanical preserved specimens.",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    keyFeatures: [
      "Compound Optical & Digital Binocular Microscopes",
      "Complete Histology Slide Library (Plant & Animal Tissues)",
      "Full-Size Anatomical Human Skeleton & Torso Models",
      "Dissection Trays, Microtome Cutters & Specimen Jars",
    ],
    inCharge: "Dr. Farzana Parveen (M.Phil Botany)",
  },
  {
    id: "fac-computer-lab",
    name: "Computer Science & IT Laboratory",
    category: "Science Labs",
    description:
      "Air-conditioned computer center featuring 60 Core-i7 workstations connected via high-speed gigabit LAN, uninterrupted UPS power backup, and licensed development environments for C Language, C++, Python, and Database management.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    keyFeatures: [
      "60 Branded Workstations with LED Monitors",
      "Turbo C++, Dev-C++, Visual Studio & MS Access Installed",
      "Centralized High-Speed Optical Fiber Internet (100 Mbps)",
      "Dedicated Multimedia Projector for Coding Demonstrations",
    ],
    inCharge: "Engr. Imran Qureshi (M.S. Computer Science)",
  },
  {
    id: "fac-library",
    name: "College Central Library & Reading Hall",
    category: "Academic",
    description:
      "A serene and spacious library holding over 18,000 reference textbooks, past BISE 10-year solved papers, national science periodicals, literary collections, and a dedicated quiet study reading section for 150 students.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    keyFeatures: [
      "18,000+ Subject Textbooks & Board Reference Guides",
      "Past 10 Years BISE Board Solved Papers & Model Papers",
      "Daily National Newspapers (Dawn, Jang, The News) & Magazines",
      "Separate Quiet Study Pods for Girls and Boys",
    ],
    inCharge: "Mr. Abdul Hameed (M.LIS Library Sciences)",
  },
  {
    id: "fac-mosque",
    name: "College Mosque & Prayer Area (Masjid)",
    category: "Student Services",
    description:
      "A beautifully built, fully carpeted college mosque with clean ablution (Wudu) facilities, accommodating over 300 worshippers. Daily Zuhr congregational prayers and Friday Jummah prayers are offered regularly under the college Imam.",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
    keyFeatures: [
      "Capacious Prayer Hall for 300+ Students and Faculty",
      "Dedicated Clean Wudu (Ablution) Area with Running Water",
      "Air-Conditioned & Carpeted Sanctuary for Reflection and Namaz",
      "Regular Congregational Zuhr Prayers with Designated Break",
    ],
    inCharge: "Qari Hafiz Muhammad Zubair (Khatib / Islamic Studies)",
  },
  {
    id: "fac-sports",
    name: "Sports Ground & Athletics Field",
    category: "Sports",
    description:
      "A vast outdoor grassy sports ground with marked cricket pitch, football goalposts, volleyball court, badminton arena, and running track. The venue hosts annual sports galas and inter-collegiate tournaments.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    keyFeatures: [
      "Turf Cricket Pitch with Boundary Fencing",
      "Football & Futsal Ground with Standard Goal Nets",
      "Indoor Badminton Courts & Table Tennis Tables",
      "Annual Inter-House Sports Gala & Athletics Championship",
    ],
    inCharge: "Col. (R) Javed Akhtar (Director Physical Education)",
  },
  {
    id: "fac-transport",
    name: "College Transport Fleet (Buses & Vans)",
    category: "Student Services",
    description:
      "A reliable, punctually operated fleet of college buses and vans providing safe, affordable point-to-point pick-and-drop service for students across all major sectors, neighborhoods, and arterial roads of the city.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    keyFeatures: [
      "Covering 22+ Major Routes Across the City & Suburbs",
      "Experienced, Verified Drivers & Dedicated Transport Coordinators",
      "Fixed Timings Synchronized with College Assembly and Dismissal",
      "Affordable Monthly Transport Subscription Subsidized by College",
    ],
    inCharge: "Mr. Tariq Mehmood (Transport In-Charge)",
  },
  {
    id: "fac-canteen",
    name: "College Cafeteria & Canteen",
    category: "Student Services",
    description:
      "A hygienic and clean canteen offering fresh, nutritious snacks, traditional meals, hot tea, juices, and mineral water at strictly regulated, subsidized prices under the supervision of the College Health & Hygiene Committee.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    keyFeatures: [
      "Strict Quality & Food Safety Inspection Protocols",
      "Fresh Snacks, Samosas, Sandwiches, Biryani & Juices",
      "Separate Seating Enclosures for Male and Female Students",
      "Subsidized Student-Friendly Price Structure",
    ],
    inCharge: "Health & Hygiene Oversight Committee",
  },
];
