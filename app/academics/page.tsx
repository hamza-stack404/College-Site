"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { programsData } from "@/lib/data/programs";
import { formatCurrency } from "@/lib/utils";
import {
  BookOpen,
  FileDown,
  Calendar,
  Clock,
  Users,
  Microscope,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function AcademicsPage() {
  const curriculumDownloads = [
    { name: "F.Sc Pre-Medical Complete FBISE/College Syllabus", size: "3.4 MB", type: "PDF", code: "HSSC-MED-2026" },
    { name: "BS Medical Laboratory Technology (BS MLT) Curriculum Scheme", size: "4.8 MB", type: "PDF", code: "BS-MLT-HEC" },
    { name: "BS Biotechnology & Genetic Engineering Course Modules", size: "2.9 MB", type: "PDF", code: "BS-BTC-2026" },
    { name: "BS Computer Science (Health Informatics) Degree Map", size: "3.1 MB", type: "PDF", code: "BS-CS-HEALTH" },
    { name: "Cambridge CAIE A-Levels Science Subject Specifications", size: "5.2 MB", type: "PDF", code: "CAIE-9700" },
    { name: "National MDCAT High-Yield Analytical Syllabus & Drill Guide", size: "6.0 MB", type: "PDF", code: "MDCAT-GUIDE" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Academic Divisions"
        title="Departments & Degree Programs"
        subtitle="Empirical scientific inquiry meets patient-centric clinical training. Discover our comprehensive range of intermediate and undergraduate disciplines."
        breadcrumbs={[{ label: "Academics" }]}
        backgroundImage="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80"
      />

      {/* Program Showcase Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Curricular Pathways"
            badgeVariant="medical"
            title="Explore Accredited"
            titleHighlight="Programs & Disciplines"
            subtitle="Click on any program to review comprehensive course modules, credit hours, lab facilities, and faculty leadership."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programsData.map((program) => (
              <div
                key={program.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {program.badge && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="gold" size="sm">
                        {program.badge}
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 text-xs font-semibold text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    {program.degreeLevel}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs text-medical-600 dark:text-medical-400 font-bold uppercase tracking-wider">
                      {program.department}
                    </div>
                    <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1 group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                      {program.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-medical-500" />
                        Duration:
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {program.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gold-500" />
                        Annual Capacity:
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {program.seats} Seats
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-bold">
                        Tuition / Semester
                      </div>
                      <div className="text-base font-black text-navy-950 dark:text-white font-display">
                        {formatCurrency(program.feePerSemester)}
                      </div>
                    </div>
                    <Link href={`/academics/${program.slug}`}>
                      <Button
                        size="sm"
                        variant="primary"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Program Detail
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Curriculum Syllabi Section */}
      <section className="py-20 bg-white dark:bg-slate-950" id="curriculum">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Official Syllabi"
            badgeVariant="gold"
            title="Download Course Schemes &"
            titleHighlight="Curriculum Guidelines"
            subtitle="Obtain verified course matrices, laboratory experiment manuals, and Board/CAIE exam criteria."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculumDownloads.map((doc, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-medical-50 dark:bg-medical-950 text-medical-700 dark:text-medical-300 text-[10px] font-bold uppercase tracking-wider border border-medical-200 dark:border-medical-800">
                      {doc.code}
                    </span>
                    <span className="text-xs text-slate-400">{doc.size}</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {doc.name}
                  </h4>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={() => alert(`Downloading verified prospectus syllabus: ${doc.name}`)}
                >
                  <FileDown className="w-4 h-4 text-medical-600 dark:text-medical-400" />
                  Download Curriculum PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Calendar Strip */}
      <section className="py-16 bg-navy-950 text-white border-t border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-bold text-gold-400 uppercase tracking-wider">
              Academic Planning
            </div>
            <h3 className="font-display font-bold text-2xl text-white">
              Official Academic Calendar 2026–2027
            </h3>
            <p className="text-xs text-slate-300">
              Includes term start dates, midterms, MDCAT simulation windows, and clinical residency rotations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="gold"
              size="md"
              leftIcon={<Calendar className="w-4 h-4" />}
              onClick={() => alert("Downloading 2026-2027 Academic Calendar PDF...")}
            >
              Download Calendar (PDF)
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
