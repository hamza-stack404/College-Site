import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { intermediateGroupsData } from "@/lib/data/groups";
import { COLLEGE_INFO } from "@/lib/data/constants";
import {
  BookOpen,
  Users,
  GraduationCap,
  CheckCircle2,
  Briefcase,
  Microscope,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
} from "lucide-react";

interface GroupPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return intermediateGroupsData.map((group) => ({
    slug: group.slug,
  }));
}

export function generateMetadata({ params }: GroupPageProps) {
  const group = intermediateGroupsData.find((g) => g.slug === params.slug);
  if (!group) return { title: "Group Not Found" };

  return {
    title: `${group.title} | Bahria College Hanif`,
    description: group.description,
  };
}

export default function GroupDetailPage({ params }: GroupPageProps) {
  const group = intermediateGroupsData.find((g) => g.slug === params.slug);

  if (!group) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge={group.qualification}
        title={group.title}
        subtitle={`Affiliated with ${COLLEGE_INFO.affiliation}`}
        breadcrumbs={[
          { label: "Groups Offered", href: "/groups" },
          { label: group.shortTitle },
        ]}
        backgroundImage={group.image}
      />

      <div className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Group Overview */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="medical" size="sm">
                    Course Scheme
                  </Badge>
                  <Badge variant="slate" size="sm">
                    FBISE Islamabad
                  </Badge>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                  Program Overview
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {group.description}
                </p>
              </div>

              {/* Part-I Subjects Breakdown */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-medical-600 dark:text-medical-400 uppercase tracking-wider">
                      HSSC Part-I Curriculum
                    </span>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                      Class 11 (1st Year) Subjects
                    </h3>
                  </div>
                  <Badge variant="navy" size="sm">
                    550 Total Marks
                  </Badge>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {group.subjectsPart1.map((sub, idx) => (
                    <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-medical-50 dark:bg-medical-950 text-medical-700 dark:text-medical-300 border border-medical-200 dark:border-medical-800 font-mono">
                            {sub.code}
                          </span>
                          <span>{sub.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {sub.description}
                        </p>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 sm:text-right font-medium flex-shrink-0">
                        {sub.practicalMarks ? (
                          <span>
                            {sub.theoryMarks} Th + {sub.practicalMarks} Pr = <strong>{sub.totalMarks} Marks</strong>
                          </span>
                        ) : (
                          <span>
                            <strong>{sub.totalMarks} Marks</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part-II Subjects Breakdown */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-gold-600 dark:text-gold-400 uppercase tracking-wider">
                      HSSC Part-II Curriculum
                    </span>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                      Class 12 (2nd Year) Subjects
                    </h3>
                  </div>
                  <Badge variant="gold" size="sm">
                    550 Total Marks
                  </Badge>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {group.subjectsPart2.map((sub, idx) => (
                    <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-gold-50 dark:bg-gold-950 text-gold-700 dark:text-gold-300 border border-gold-200 dark:border-gold-800 font-mono">
                            {sub.code}
                          </span>
                          <span>{sub.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {sub.description}
                        </p>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 sm:text-right font-medium flex-shrink-0">
                        {sub.practicalMarks ? (
                          <span>
                            {sub.theoryMarks} Th + {sub.practicalMarks} Pr = <strong>{sub.totalMarks} Marks</strong>
                          </span>
                        ) : (
                          <span>
                            <strong>{sub.totalMarks} Marks</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Pathways */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-medical-600 dark:text-medical-400" />
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    Higher Education & Career Prospects
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {group.careerOpportunities.map((career, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2"
                    >
                      <div className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-gold-500 flex-shrink-0" />
                        <span>{career.field}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {career.description}
                      </p>
                      <div className="text-[11px] text-medical-600 dark:text-medical-400 pt-1 font-medium">
                        Target: {career.targetUniversities.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-navy-800 sticky top-28">
                <div>
                  <Badge variant="gold" size="sm">
                    Class 11 Intake
                  </Badge>
                  <div className="font-display font-black text-3xl sm:text-4xl text-gold-400 mt-2">
                    {group.class11Seats} Seats
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Total allocation for Class 11 (open to both male and female candidates based on merit).
                  </p>
                </div>

                <div className="space-y-3 text-xs text-slate-300 border-t border-navy-800 pt-4">
                  <div className="flex justify-between">
                    <span>Degree Level:</span>
                    <span className="font-bold text-white">HSSC (Part I & II)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Affiliated Board:</span>
                    <span className="font-bold text-white">FBISE Islamabad</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Program Duration:</span>
                    <span className="font-bold text-white">2 Academic Years</span>
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="border-t border-navy-800 pt-4 space-y-2">
                  <div className="text-xs font-bold text-medical-300 uppercase tracking-wider">
                    Admission Eligibility
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {group.eligibility.details}
                  </p>
                </div>

                {/* General Fee Range Notice */}
                <div className="border-t border-navy-800 pt-4 space-y-1.5">
                  <div className="text-xs font-bold text-gold-400 uppercase tracking-wider">
                    Tuition Fee Range
                  </div>
                  <div className="text-sm font-black text-white">
                    Rs. 3,500 – 5,500 / month
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Subsidized for Armed Forces dependents (Rs. 3,500) and standard for Civilians (Rs. 5,500). Individual fee challans are accessed in the portal.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <Link href="/admissions" className="block w-full">
                    <Button variant="gold" size="lg" className="w-full justify-center">
                      Admissions Information
                    </Button>
                  </Link>
                  <Link href="/facilities" className="block w-full">
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full justify-center text-white border-white/20 hover:bg-white/10"
                    >
                      View Science & IT Labs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
