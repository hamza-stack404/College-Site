"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Program } from "@/lib/types";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import {
  Clock,
  Users,
  GraduationCap,
  CheckCircle2,
  Briefcase,
  Microscope,
  FileDown,
  ArrowRight,
  Sparkles,
  Award,
} from "lucide-react";

interface ProgramDetailClientProps {
  program: Program;
}

export const ProgramDetailClient: React.FC<ProgramDetailClientProps> = ({ program }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Banner */}
      <PageHero
        badge={program.badge || program.degreeLevel}
        title={program.title}
        subtitle={program.department}
        breadcrumbs={[
          { label: "Academics", href: "/academics" },
          { label: program.shortTitle },
        ]}
        backgroundImage={program.image}
      />

      {/* Main Content Layout */}
      <div className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Program Overview */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="medical" size="sm">
                    Course Summary
                  </Badge>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                  Program Overview
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {program.description}
                </p>

                {/* Key Outcomes */}
                <div className="pt-4 space-y-3">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Core Competencies & Learning Outcomes
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {program.learningOutcomes.map((outcome, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-medical-500 flex-shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Curriculum Breakdown */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-medical-600 dark:text-medical-400 uppercase tracking-wider">
                      Academic Roadmap
                    </span>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                      Curriculum & Course Structure
                    </h2>
                  </div>
                </div>

                <div className="space-y-6">
                  {program.curriculum.map((sem, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
                    >
                      <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 font-display font-bold text-base text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{sem.semester}</span>
                        <span className="text-xs font-normal text-slate-500">
                          {sem.courses.length} Modules
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 p-2">
                        {sem.courses.map((course, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-3 flex items-center justify-between text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-medical-600 dark:text-medical-400 min-w-[70px]">
                                {course.code}
                              </span>
                              <span className="text-slate-800 dark:text-slate-200 font-medium">
                                {course.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {course.isLab && (
                                <Badge variant="medical" size="sm">
                                  Lab
                                </Badge>
                              )}
                              <span className="text-xs text-slate-400">
                                {course.creditHours} Credits
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dedicated Lab Facilities & Clinical Exposure */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-gold-500" />
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    Dedicated Research & Lab Facilities
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {program.labFacilities.map((fac, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <span className="w-2 h-2 rounded-full bg-medical-500" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Opportunities */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-medical-600 dark:text-medical-400" />
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    Future Career Pathways & Graduate Destinations
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {program.careerOpportunities.map((career, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                    >
                      <Award className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      <span>{career}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Key Specs Card */}
              <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-navy-800 sticky top-28">
                <div>
                  <Badge variant="gold" size="sm">
                    Admissions Active
                  </Badge>
                  <div className="text-xs uppercase text-slate-300 mt-2 font-semibold">
                    Semester Tuition
                  </div>
                  <div className="font-display font-black text-3xl sm:text-4xl text-gold-400">
                    {formatCurrency(program.feePerSemester)}
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 border-t border-navy-800 pt-4">
                  <div className="flex justify-between">
                    <span>Degree Level:</span>
                    <span className="font-bold text-white">{program.degreeLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Program Duration:</span>
                    <span className="font-bold text-white">{program.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Capacity:</span>
                    <span className="font-bold text-white">{program.seats} Seats</span>
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="border-t border-navy-800 pt-4 space-y-2">
                  <div className="text-xs font-bold text-medical-300 uppercase tracking-wider">
                    Eligibility Requirements
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {program.eligibility.map((el, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-medical-400 font-bold">•</span>
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <Link href="/admissions" className="block w-full">
                    <Button variant="gold" size="lg" className="w-full justify-center">
                      Apply Online Now
                    </Button>
                  </Link>
                  <Link href="/admissions#fee-calculator" className="block w-full">
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full justify-center text-white border-white/20 hover:bg-white/10"
                    >
                      Estimate Scholarships
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-slate-300 hover:text-white"
                    onClick={() => alert(`Downloading verified prospectus for ${program.title}...`)}
                    leftIcon={<FileDown className="w-4 h-4" />}
                  >
                    Download Program Prospectus
                  </Button>
                </div>
              </div>

              {/* Faculty Lead Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Academic Faculty Chair
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    <Image
                      src={program.facultyLead.image}
                      alt={program.facultyLead.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      {program.facultyLead.name}
                    </h4>
                    <p className="text-xs text-medical-600 dark:text-medical-400 font-semibold">
                      {program.facultyLead.designation}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {program.facultyLead.qualification}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href="/faculty"
                    className="text-xs font-semibold text-medical-600 dark:text-medical-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All Department Faculty</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
