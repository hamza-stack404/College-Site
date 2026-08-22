import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  Award,
  BookOpen,
  Heart,
  Target,
  Compass,
  ArrowRight,
  CheckCircle2,
  Quote,
} from "lucide-react";

export const metadata = {
  title: "About Us — History, Vision & Leadership",
  description:
    "Learn about the history, executive leadership, vision, and prestigious accreditations of Bahria College Hanif (Medical & Science Institution).",
};

export default function AboutPage() {
  const timeline = [
    {
      year: "1986",
      title: "Founding of the Institution",
      description:
        "Established by naval educational visionaries to provide disciplined, high-caliber science instruction to promising scholars in Karachi.",
    },
    {
      year: "1998",
      title: "Pre-Medical Centre of Excellence Established",
      description:
        "Inauguration of dedicated Histology, Organic Chemistry, and Optics laboratories under senior medical faculty, establishing the college as a benchmark for MDCAT aspirants.",
    },
    {
      year: "2012",
      title: "Launch of Allied Health & Diagnostic Wing",
      description:
        "Introduction of professional BS Medical Laboratory Technology (MLT) program affiliated with premier tertiary care teaching hospitals.",
    },
    {
      year: "2020",
      title: "Biotechnology & AI Health Pavilion",
      description:
        "State-of-the-art expansion including Real-Time PCR thermal cyclers, CRISPR research workstations, and NVIDIA GPU healthcare informatics clusters.",
    },
    {
      year: "2026",
      title: "A Legacy of 94%+ MDCAT Placement",
      description:
        "Over 12,000 alumni serving in premier hospitals worldwide, including Johns Hopkins, Mayo Clinic, Aga Khan University, and King Edward Medical University.",
    },
  ];

  const leadership = [
    {
      name: "Commodore (R) Muhammad Hanif Niazi, SI(M)",
      role: "President & Founder Patron",
      qualification: "M.Sc Defense & Strategic Studies (NDU), P.Sc",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      bio: "A decorated naval commander with four decades of leadership dedicated to institutional ethics, educational modernism, and disciplined scholastic excellence.",
    },
    {
      name: "Prof. Dr. Tariq Mahmood Khan",
      role: "Dean of Medical Sciences & Academic Chair",
      qualification: "Ph.D. Cellular Biology (Imperial College London), M.Phil",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
      bio: "Oversees curriculum rigor, medical university entrance coaching, and institutional laboratory compliance with international health standards.",
    },
    {
      name: "Dr. Sarah Elizabeth Vance",
      role: "Director of International Programs & Cambridge A-Levels",
      qualification: "Ph.D. Chemistry (Oxford University), PGCE (UK)",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      bio: "Directs CAIE curriculum integration, international Olympiad coaching, and overseas university admissions strategy for North America and Europe.",
    },
    {
      name: "Dr. Ayesha Siddiqua",
      role: "Vice Principal (Allied Health & Clinical Research)",
      qualification: "Ph.D. Clinical Pathology (KU), FCPS (Histopath), M.B.B.S",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
      bio: "Coordinates hospital residency rotations, diagnostic lab accreditations, and student clinical internships across affiliated medical centres.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Hero */}
      <PageHero
        badge="About Bahria College Hanif"
        title="Cultivating Medical Intellect, Ethics, and Scientific Discovery"
        subtitle="For four decades, Bahria College Hanif has stood as a beacon of academic rigor, clinical preparation, and transformative education."
        breadcrumbs={[{ label: "About Us" }]}
        backgroundImage="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=80"
      />

      {/* Vision & Mission Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 relative overflow-hidden">
              <div className="p-3 rounded-2xl bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400 w-fit">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                Our Institutional Vision
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                To be recognized nationally and globally as the benchmark medical and science collegiate institution—producing compassionate clinicians, inquisitive scientists, and ethical leaders who advance human health.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medical-500" />
                  <span>Uncompromising scientific and empirical rigor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medical-500" />
                  <span>Patient-centered compassion and professional bioethics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medical-500" />
                  <span>Empowerment through 100% merit-based scholarship accessibility</span>
                </li>
              </ul>
            </div>

            {/* Mission Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 relative overflow-hidden">
              <div className="p-3 rounded-2xl bg-gold-50 dark:bg-gold-950 text-gold-600 dark:text-gold-400 w-fit">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                Our Core Mission
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                To provide immersive, hands-on scientific education underpinned by cutting-edge laboratory infrastructure, renowned faculty mentorship, and a holistic environment that inspires curiosity and resilience.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500" />
                  <span>Hospital-affiliated clinical diagnostic and observation training</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500" />
                  <span>Specialized MDCAT, SAT, and CAIE Olympiad preparation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500" />
                  <span>Holistic character, leadership, and athletic development</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Principal's Message Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image (4 cols) */}
            <div className="lg:col-span-4 relative">
              <div className="relative h-96 sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
                <Image
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80"
                  alt="Prof. Dr. Tariq Mahmood Khan"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>
              <div className="absolute -bottom-6 right-6 p-4 rounded-2xl bg-navy-950 text-white border border-navy-800 shadow-xl">
                <div className="text-xs font-bold text-gold-400">Dean of Medical Sciences</div>
                <div className="text-sm font-black font-display">Prof. Dr. Tariq Khan</div>
              </div>
            </div>

            {/* Message Body (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <Badge variant="medical" size="md">
                Principal & Dean&apos;s Address
              </Badge>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
                &ldquo;We Do Not Merely Teach Science — We Train Those Who Will Safeguard Human Life.&rdquo;
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Welcome to Bahria College Hanif. When an aspiring young scholar walks through our doors, they are not just registering for academic courses; they are joining a four-decade heritage of uncompromising medical curiosity and moral character.
                </p>
                <p>
                  Our curriculum combines rigorous textbook mastery with direct diagnostic laboratory application. Our students dissect biological specimens, isolate genomic DNA, model machine-learning health systems, and observe clinical procedures in partner teaching hospitals.
                </p>
                <p>
                  Whether your dream is to wear the white coat of a surgeon, pioneer novel cancer vaccines, or architect digital health solutions, Bahria College Hanif gives you the indestructible foundation to lead.
                </p>
              </div>
              <div className="pt-2">
                <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Prof. Dr. Tariq Mahmood Khan
                </div>
                <div className="text-xs text-medical-600 dark:text-medical-400 font-semibold">
                  Dean of Medical Sciences • Imperial College London Alumnus
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline Section */}
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Institutional Heritage"
            badgeVariant="gold"
            title="Four Decades of"
            titleHighlight="Scientific Milestones"
            subtitle="Explore our evolution from a disciplined collegiate academy to a premier hub of medical research and technological innovation."
            align="center"
          />

          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-32 space-y-12 max-w-3xl">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-12">
                {/* Year Marker Badge on the left */}
                <div className="absolute -left-4 sm:-left-24 top-0 px-2.5 py-1 rounded-full bg-navy-900 text-gold-400 dark:bg-navy-950 text-xs font-black tracking-wider border border-gold-500/40">
                  {item.year}
                </div>

                {/* Dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-medical-500 border-4 border-white dark:border-slate-950" />

                <div className="space-y-1">
                  <h4 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Executive Leadership"
            badgeVariant="navy"
            title="Guided by Renowned"
            titleHighlight="Academics & Clinicians"
            subtitle="Our leadership team comprises distinguished physicians, Ph.D. scholars, and pedagogical innovators with international experience."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((leader, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-[11px] font-bold text-gold-400 uppercase">
                      {leader.role}
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      {leader.name}
                    </h4>
                    <p className="text-xs text-medical-600 dark:text-medical-400 font-semibold mt-0.5">
                      {leader.qualification}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                      {leader.bio}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href="/faculty"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-medical-600 dark:hover:text-medical-400 flex items-center gap-1"
                    >
                      <span>View Faculty Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations Strip */}
      <section className="py-16 bg-navy-950 text-white border-t border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="gold" size="sm">
            Institutional Recognition
          </Badge>
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Nationally Accredited & Internationally Recognized
          </h3>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Our degree frameworks and intermediate science certificates are fully recognized by Pakistan&apos;s leading statutory councils and global examination boards.
          </p>

          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
              <ShieldCheck className="w-8 h-8 text-medical-400 mb-2" />
              <div className="text-xs font-bold text-white">PMDC & HEC</div>
              <div className="text-[10px] text-slate-400">Curriculum Equivalence</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
              <Award className="w-8 h-8 text-gold-400 mb-2" />
              <div className="text-xs font-bold text-white">Cambridge CAIE</div>
              <div className="text-[10px] text-slate-400">Registered Examination Center</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
              <BookOpen className="w-8 h-8 text-medical-400 mb-2" />
              <div className="text-xs font-bold text-white">Federal Board (FBISE)</div>
              <div className="text-[10px] text-slate-400">A+ Category Affiliation</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
              <ShieldCheck className="w-8 h-8 text-gold-400 mb-2" />
              <div className="text-xs font-bold text-white">ISO 9001:2015</div>
              <div className="text-[10px] text-slate-400">Certified Quality Standard</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
