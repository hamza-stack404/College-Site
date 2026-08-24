import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { intermediateGroupsData } from "@/lib/data/groups";
import { COLLEGE_INFO } from "@/lib/data/constants";
import {
  Stethoscope,
  Calculator,
  Cpu,
  BookOpen,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Academic Groups Offered (HSSC) — Bahria College Hanif",
  description:
    "Explore the three official intermediate streams offered at Bahria College Hanif: Pre-Medical, Pre-Engineering, and Computer Science (ICS) affiliated with FBISE.",
};

export default function GroupsPage() {
  const groupIcons = {
    "pre-medical": Stethoscope,
    "pre-engineering": Calculator,
    "computer-science": Cpu,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="FBISE Affiliated Programs"
        title="Academic Groups Offered"
        subtitle="Bahria College Hanif offers three structured intermediate streams under the Federal Board curriculum, designed to build strong foundations for future medical, engineering, and technology careers."
        breadcrumbs={[{ label: "Groups Offered" }]}
        backgroundImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
      />

      {/* Overview Strip */}
      <section className="py-8 bg-navy-950 text-white border-b border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-gold-400">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold text-slate-200">
              Curriculum Scheme: {COLLEGE_INFO.affiliation}
            </span>
          </div>
          <div className="text-slate-300">
            Admissions open once a year for <strong>Class 11</strong> following Matriculation results.
          </div>
        </div>
      </section>

      {/* Groups Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Three Core Streams"
            badgeVariant="medical"
            title="Choose Your Academic"
            titleHighlight="Pathway to Success"
            subtitle="Review subject outlines, Class 11 seat allocation, and university admission prospects for each group."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {intermediateGroupsData.map((group) => {
              const Icon = groupIcons[group.slug] || BookOpen;
              return (
                <div
                  key={group.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
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
                        <span className="text-slate-400 font-medium">Duration:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {group.duration}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Min. Eligibility:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {group.eligibility.minMatricMarksPercentage}% Matric
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Tuition Range:</span>
                        <span className="font-bold text-medical-600 dark:text-medical-400">
                          Rs. 3,500 – 5,500 / month*
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href={`/groups/${group.slug}`} className="block w-full">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full justify-center"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          View Subjects & Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            * Monthly tuition varies based on Armed Forces dependent vs. Civilian category. Full personalized fee challans are accessible via the student portal.
          </div>
        </div>
      </section>
    </div>
  );
}
