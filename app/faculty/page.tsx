"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { facultyData } from "@/lib/data/faculty";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Award,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

export default function FacultyDirectoryPage() {
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const departments = [
    { id: "all", label: "All Departments" },
    { id: "Biological & Medical Sciences", label: "Medical & Pre-Med" },
    { id: "Allied Health & Diagnostics (BS MLT)", label: "Allied Health (MLT)" },
    { id: "Biotechnology & Life Sciences", label: "Biotechnology" },
    { id: "Computing & Digital Healthcare", label: "Computing & Health AI" },
    { id: "International Qualifications (Cambridge A-Levels)", label: "Cambridge International" },
  ];

  const filteredFaculty = facultyData.filter((f) => {
    const matchesDept = selectedDept === "all" || f.department.includes(selectedDept) || selectedDept.includes(f.department);
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.subjectsTaught.some((subject) => subject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Doctoral Mentorship"
        title="Distinguished Faculty Directory"
        subtitle="Learn from celebrated clinicians, Oxford and Imperial postdoctoral scholars, and dedicated pedagogical mentors."
        breadcrumbs={[{ label: "Faculty Directory" }]}
        backgroundImage="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Scholarly Leadership"
            badgeVariant="medical"
            title="Search & Connect with"
            titleHighlight="Department Chairs & Mentors"
            subtitle="Explore faculty research interests, peer-reviewed journal papers, and direct contact details."
            align="center"
          />

          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10">
            {/* Department Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedDept === dept.id
                      ? "bg-navy-900 text-white dark:bg-medical-600 shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, research, or degree..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-medical-500 focus:outline-none shadow-sm"
              />
            </div>
          </div>

          {/* Faculty Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFaculty.map((member) => (
              <div
                key={member.id}
                id={member.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Image & Department Banner */}
                  <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="gold" size="sm">
                        {member.experienceYears}+ Years Exp.
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-[11px] font-bold text-medical-300 uppercase tracking-wider">
                        {member.department}
                      </div>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-white mt-0.5">
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {member.designation}
                      </div>
                      <div className="text-xs text-medical-600 dark:text-medical-400 font-semibold mt-0.5">
                        {member.qualification}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {member.name} teaches {member.subject} with {member.experienceYears} years of experience.
                      </p>
                    </div>

                    {/* Research Focus Tags */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Subjects Taught:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {member.subjectsTaught.slice(0, 2).map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Quick Details */}
                    <div className="space-y-1.5 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-medical-500 flex-shrink-0" />
                        <span className="truncate">Contact college office</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                        <span className="truncate">{member.department}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <Link href={`/faculty/${member.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-center gap-2"
                    >
                      <span>View Faculty Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
