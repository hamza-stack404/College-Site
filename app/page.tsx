"use client";

import React from "react";
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
  Flame,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { intermediateGroupsData } from "@/lib/data/groups";
import { noticesData } from "@/lib/data/notices";
import { positionHoldersData } from "@/lib/data/results";
import { facilitiesData } from "@/lib/data/facilities";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const groupIcons = {
    "pre-medical": Stethoscope,
    "pre-engineering": Calculator,
    "computer-science": Cpu,
  };

  const quickStats = [
    { label: "Overall BISE Pass Rate", value: "98.4%", detail: "Consistent A-1 & A Grades in Board Exams" },
    { label: "Top Board Positions", value: "45+", detail: "Medals & Top 3 Positions in Karachi & FBISE" },
    { label: "Established Legacy", value: "38+ Years", detail: "Serving intermediate science education since 1986" },
    { label: "Alumni in MBBS & Engg.", value: "12,000+", detail: "Graduates in King Edward, Dow, NUST, FAST & GIKI" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-navy-950 text-white">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2000&q=80"
            alt="Bahria College Hanif Campus"
            fill
            priority
            className="object-cover opacity-20 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-navy-950/60 to-navy-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Board Affiliation Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-gold-500/40 text-gold-300 text-xs sm:text-sm font-semibold shadow-xl"
          >
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>Affiliated with Federal Board of Intermediate & Secondary Education (FBISE)</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              Shaping Tomorrow&apos;s <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                Doctors, Engineers & Innovators
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Bahria College Hanif offers disciplined, high-achievement intermediate education in **Pre-Medical**, **Pre-Engineering**, and **Computer Science (ICS)** under renowned subject faculty.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link href="/admissions">
              <Button size="lg" variant="gold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Admissions 2026 (Apply Online)
              </Button>
            </Link>
            <Link href="/notice-board">
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                <BellRing className="w-4 h-4 mr-2 text-gold-400" />
                View 1st Merit List
              </Button>
            </Link>
            <Link href="/results">
              <Button size="lg" variant="ghost" className="text-slate-300 hover:text-white">
                <Award className="w-4 h-4 mr-2 text-medical-400" />
                Check BISE Results
              </Button>
            </Link>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 max-w-5xl mx-auto text-left"
          >
            {quickStats.map((stat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-gold-500/40 transition-colors"
              >
                <div className="font-display font-black text-2xl sm:text-3xl text-gold-400">
                  {stat.value}
                </div>
                <div className="font-semibold text-xs sm:text-sm text-white mt-1">
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

      {/* 2. Notice Board Alert Strip */}
      <section className="bg-gold-500 text-navy-950 py-3.5 px-4 sm:px-8 font-medium text-xs sm:text-sm shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold">
            <span className="p-1 rounded-md bg-navy-950 text-gold-400 flex items-center justify-center">
              <BellRing className="w-3.5 h-3.5 animate-bounce" />
            </span>
            <span className="uppercase tracking-wider text-xs">Latest College Notice:</span>
            <span className="font-normal truncate max-w-xl">
              1st Merit List for Admissions Session 2026–2027 displayed. Fee submission deadline: August 28, 2026.
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
            {/* Principal Photo Card (4 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-96 sm:h-[460px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800">
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

            {/* Welcome Letter (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="medical" size="md">
                Principal&apos;s Welcome
              </Badge>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
                &ldquo;Where Disciplined Character Meets Academic Brilliance.&rdquo;
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Assalam-o-Alaikum and Welcome to Bahria College Hanif. For over thirty-eight years, our institution has stood as an esteemed cradle of intermediate education, steering ambitious young minds toward stellar careers in medicine, engineering, and digital sciences.
                </p>
                <p>
                  We understand the pivotal significance of the two intermediate years (HSSC Part-I & Part-II). They determine university admissions and career trajectories. That is why our pedagogy unites rigorous textbook mastery with continuous weekly testing, daily science practicals in specialized laboratories, and intensive MDCAT & ECAT coaching.
                </p>
                <p>
                  Above all, we cultivate moral integrity, Islamic values, resilience, and civic responsibility. We welcome you to join our tradition of distinction.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Commodore (R) Muhammad Hanif Niazi, SI(M)
                  </div>
                  <div className="text-xs text-medical-600 dark:text-medical-400 font-semibold">
                    Principal • Bahria College Hanif Campus
                  </div>
                </div>

                <Link href="/about">
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Read College History
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
            subtitle="The college exclusively offers Pre-Medical, Pre-Engineering, and Computer Science (ICS) streams with complete Part-I & Part-II curriculum."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {intermediateGroupsData.map((group) => {
              const Icon = groupIcons[group.slug] || BookOpen;
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
                        {group.seats} Seats
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

                    {/* Eligibility & Fee */}
                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Eligibility:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Min. {group.eligibility.minMatricMarksPercentage}% Matric
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Monthly Tuition:</span>
                        <span className="font-black text-navy-950 dark:text-white font-display">
                          {formatCurrency(group.monthlyTuitionFee)} / month
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href={`/groups/${group.slug}`} className="block w-full">
                        <Button variant="primary" size="sm" className="w-full justify-center" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          Subjects & Career Details
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

      {/* 5. Board Position Holders Spotlight */}
      <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Academic Glory"
            badgeVariant="gold"
            title="Our Distinction Holders in"
            titleHighlight="BISE Board Examinations"
            subtitle="Celebrating our high achievers who secured top positions across Pre-Medical, Pre-Engineering, and ICS in annual examinations."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {positionHoldersData.map((holder) => (
              <div
                key={holder.id}
                className="bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl transition-all duration-300 text-center space-y-4"
              >
                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gold-400 shadow-md">
                  <Image
                    src={holder.photo}
                    alt={holder.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 font-bold text-[11px] uppercase tracking-wider border border-gold-500/30">
                    {holder.boardRank}
                  </span>
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-1">
                    {holder.name}
                  </h4>
                  <div className="text-xs text-medical-600 dark:text-medical-400 font-semibold">
                    {holder.group} • {holder.passingYear}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs">
                  <div className="font-display font-black text-xl text-navy-950 dark:text-white">
                    {holder.marksObtained} / {holder.totalMarks}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {holder.percentage}% Aggregate
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Now at: <strong>{holder.currentInstitution}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-10">
            <Link href="/results">
              <Button variant="outline" size="md" rightIcon={<Award className="w-4 h-4 ml-1 text-gold-500" />}>
                View All Position Holders & Board Results Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Campus Facilities Overview */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Campus Environment"
            badgeVariant="navy"
            title="State-of-the-Art Infrastructure &"
            titleHighlight="Student Facilities"
            subtitle="Equipped with certified science laboratories, college mosque, central library, sports ground, canteen, and bus transport."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilitiesData.slice(0, 6).map((fac) => (
              <div
                key={fac.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
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

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href="/facilities"
                      className="text-xs font-semibold text-medical-600 dark:text-medical-400 hover:underline flex items-center gap-1"
                    >
                      <span>Explore Facility Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call-to-Action Strip */}
      <section className="py-16 bg-navy-950 text-white relative overflow-hidden border-t border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <Badge variant="gold" size="sm">
            Admissions Open Session 2026–2027
          </Badge>
          <h3 className="font-display font-black text-2xl sm:text-4xl text-white">
            Secure Your Seat at Bahria College Hanif
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Prospectuses and admission application forms are available at the college admissions office and online. Merit lists are announced on notified schedule.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/admissions">
              <Button size="lg" variant="gold">
                Download Admission Form (PDF)
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                <PhoneCall className="w-4 h-4 mr-2 text-medical-400" />
                Contact Admissions Desk (PST 08:00 AM – 02:30 PM)
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
