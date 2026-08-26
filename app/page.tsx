"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Calculator,
  Cpu,
  BookOpen,
  Award,
  BellRing,
  FileText,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
  Download,
  Users,
  ChevronRight,
  PhoneCall,
  Megaphone,
  Microscope,
  Compass,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MeritCalculator } from "@/components/tools/MeritCalculator";
import { intermediateGroupsData } from "@/lib/data/groups";
import { initialNoticesData } from "@/lib/data/notices";
import { initialAnnouncementsData } from "@/lib/data/announcements";
import { facilitiesData } from "@/lib/data/facilities";
import { COLLEGE_INFO } from "@/lib/data/constants";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function HomePage() {
  const [liveNotice, setLiveNotice] = useState(initialNoticesData[0]);

  useEffect(() => {
    async function fetchTopNotice() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase
          .from("notices")
          .select("*")
          .order("is_pinned", { ascending: false })
          .order("date", { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          setLiveNotice(data as any);
        }
      } catch (err) {
        // Fallback to initialNotice
      }
    }
    fetchTopNotice();
  }, []);

  const groupIcons = {
    "pre-medical": Stethoscope,
    "pre-engineering": Calculator,
    "computer-science": Cpu,
  };

  const quickStats = [
    { label: "FBISE Islamabad Affiliation", value: "Federal Board", detail: "Registered & approved HSSC examination center" },
    { label: "Class 11 Intake Capacity", value: "350 Total Seats", detail: "50 Pre-Med, 100 Pre-Eng, 200 ICS Computer Science" },
    { label: "Specialized Science Labs", value: "4 Certified Labs", detail: "Physics, Chemistry, Biology & High-Performance IT" },
    { label: "Pioneer Scholar Cohort", value: "Class 11", detail: "Setting the benchmark standard for collegiate excellence" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-24 overflow-hidden bg-navy-950 text-white">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-medical-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Background Image with Mesh Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2000&q=80"
            alt="Bahria College Hanif Campus"
            fill
            priority
            className="object-cover opacity-20 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/40" />
          <div className="absolute inset-0 bg-noise opacity-40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Board Affiliation Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-gold-500/40 text-gold-300 text-xs sm:text-sm font-semibold shadow-xl"
          >
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>Affiliated with Federal Board of Intermediate & Secondary Education (FBISE) Islamabad</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-7xl text-white tracking-tight leading-[1.1]">
              A Legacy of Discipline & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                Academic Brilliance in Science & IT
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
              Bahria College Hanif offers rigorous Higher Secondary School Certificate (HSSC) education in <strong>Pre-Medical</strong>, <strong>Pre-Engineering</strong>, and <strong>Computer Science (ICS)</strong> with state-of-the-art diagnostic laboratories and MDCAT/ECAT guidance.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link href="/groups">
              <Button size="lg" variant="gold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Academic Groups
              </Button>
            </Link>
            <Link href="/notice-board">
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                <BellRing className="w-4 h-4 mr-2 text-gold-400" />
                Notice Board & Circulars
              </Button>
            </Link>
            <Link href="/portal">
              <Button size="lg" variant="ghost" className="text-slate-300 hover:text-white">
                <Award className="w-4 h-4 mr-2 text-medical-400" />
                Student Portal
              </Button>
            </Link>
          </motion.div>

          {/* Quick Stats Bento */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 max-w-5xl mx-auto text-left"
          >
            {quickStats.map((stat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-gold-500/50 hover:bg-white/10 transition-all shadow-lg"
              >
                <div className="font-display font-black text-xl sm:text-2xl text-gold-400">
                  {stat.value}
                </div>
                <div className="font-bold text-xs sm:text-sm text-white mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {stat.detail}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. Realtime Notice Board Alert Strip */}
      <section className="bg-gold-500 text-navy-950 py-3.5 px-4 sm:px-8 font-medium text-xs sm:text-sm shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold min-w-0">
            <span className="p-1.5 rounded-lg bg-navy-950 text-gold-400 flex items-center justify-center flex-shrink-0">
              <BellRing className="w-3.5 h-3.5" />
            </span>
            <span className="uppercase tracking-wider text-xs flex-shrink-0">Official Circular:</span>
            <span className="font-semibold truncate max-w-xl">
              {liveNotice.title}
            </span>
          </div>

          <Link
            href="/notice-board"
            className="font-bold underline underline-offset-4 flex items-center gap-1 hover:text-navy-900 flex-shrink-0"
          >
            <span>Visit Full Notice Board</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. Principal's Welcome Message */}
      <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Principal Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-96 sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                  alt="Principal Bahria College Hanif"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 450px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <div className="text-xs font-bold text-gold-400 uppercase tracking-wider">
                    Principal & Patron
                  </div>
                  <div className="font-display font-black text-xl text-white">
                    Commodore (R) Muhammad Hanif Niazi, SI(M)
                  </div>
                  <div className="text-xs text-slate-300">
                    M.Sc Defense & Strategic Studies (NDU), P.Sc
                  </div>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="medical" size="md">
                Principal&apos;s Welcome
              </Badge>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
                &ldquo;Where Disciplined Character Meets Academic Brilliance.&rdquo;
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                <p>
                  Assalam-o-Alaikum and Welcome to Bahria College Hanif. The intermediate years (HSSC Part-I & Part-II) represent the crucial transition in a student&apos;s educational journey, laying the groundwork for higher studies in medicine, engineering, and technology.
                </p>
                <p>
                  Our curriculum follows the Federal Board of Intermediate and Secondary Education (FBISE) framework. We emphasize strong conceptual foundations, continuous weekly assessments, supervised laboratory practicals, and moral character.
                </p>
                <p>
                  We are proud of our pioneer Class 11 scholars and invite every student to strive for excellence with dedication and integrity.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Commodore (R) Muhammad Hanif Niazi, SI(M)
                  </div>
                  <div className="text-xs text-medical-600 dark:text-medical-400 font-semibold">
                    Principal • Bahria College Hanif
                  </div>
                </div>

                <Link href="/about">
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Read College Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Three Academic Groups Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="HSSC Intermediate Disciplines"
            badgeVariant="medical"
            title="Three Official Academic"
            titleHighlight="Groups Offered"
            subtitle="The college exclusively offers Pre-Medical, Pre-Engineering, and Computer Science (ICS) streams under the FBISE scheme."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {intermediateGroupsData.map((group) => {
              const Icon = groupIcons[group.slug as keyof typeof groupIcons] || BookOpen;
              return (
                <div
                  key={group.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={group.image}
                      alt={group.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <span className="px-3 py-1 rounded-full bg-gold-500 text-navy-950 text-xs font-bold shadow-md">
                        {group.shortTitle}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                        {group.class11Seats} Class 11 Seats
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">
                        {group.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                        {group.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Eligibility:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Min. {group.eligibility.minMatricMarksPercentage}% Matric
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Monthly Tuition:</span>
                        <span className="font-bold text-medical-600 dark:text-medical-400">
                          Rs. 3,500 – 5,500 / month*
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href={`/groups/${group.slug}`} className="block w-full">
                        <Button variant="primary" size="sm" className="w-full justify-center" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          View Subjects & Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Embedded Merit & Aggregate Calculator Section */}
      <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionHeader
            badge="Admissions 2026 Evaluation"
            badgeVariant="gold"
            title="Calculate Your"
            titleHighlight="FBISE Admission Merit"
            subtitle="Input your Matric marks to verify eligibility for Pre-Medical, Pre-Engineering, or ICS Computer Science."
            align="center"
          />

          <MeritCalculator />
        </div>
      </section>

      {/* 6. Campus Facilities Overview */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeader
            badge="Campus Environment"
            badgeVariant="navy"
            title="Purpose-Built Laboratories &"
            titleHighlight="Student Amenities"
            subtitle="Equipped with certified science laboratories, college mosque, central library, sports ground, canteen, and bus transport."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilitiesData.slice(0, 6).map((fac) => (
              <div
                key={fac.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={fac.image}
                    alt={fac.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    {fac.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      {fac.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {fac.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <Link
                      href="/facilities"
                      className="text-xs font-semibold text-medical-600 dark:text-medical-400 hover:underline flex items-center gap-1"
                    >
                      <span>Explore Facility</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Recent Announcements Section */}
      <section className="py-20 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeader
            badge="Campus Life"
            badgeVariant="medical"
            title="Recent Happenings &"
            titleHighlight="College Announcements"
            subtitle="Stay informed with key events, ceremonies, and campus updates."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialAnnouncementsData.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={item.image_url}
                    alt={item.heading}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-gold-600 dark:text-gold-400 font-bold uppercase">{item.date}</div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-1">
                      {item.heading}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link href="/announcements">
              <Button variant="outline" size="md">
                View All Announcements
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
