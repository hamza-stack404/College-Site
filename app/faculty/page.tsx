"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { facultyData } from "@/lib/data/faculty";
import { StaffMember } from "@/lib/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  User,
  GraduationCap,
  BookOpen,
  Award,
  Search,
  Filter,
} from "lucide-react";

export default function FacultyPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>(facultyData);
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchFacultyMembers() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase
          .from("faculty")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && !error && data.length > 0) {
          setStaffList(
            data.map((f: any) => ({
              id: f.id,
              name: f.name,
              role: f.role,
              subject: f.subject,
              labType: f.lab_type,
              qualification: f.qualification,
              classesTaught: f.classes_taught || [],
              image: f.image_url,
            }))
          );
        }
      } catch (err) {
        console.warn("Could not fetch faculty from Supabase:", err);
      }
    }
    fetchFacultyMembers();
  }, []);

  const roles = ["All", "Principal & VP", "Subject Teacher", "Lab Teacher", "PTI"];

  const filteredStaff = staffList.filter((member) => {
    let matchesRole = true;
    if (selectedRole === "Principal & VP") {
      matchesRole = member.role === "Principal" || member.role === "Vice Principal";
    } else if (selectedRole !== "All") {
      matchesRole = member.role === selectedRole;
    }

    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.subject && member.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      member.qualification.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Academic Faculty"
        title="Our Teaching Faculty & Staff"
        subtitle="Meet our dedicated subject teachers, lab demonstrators, and college leadership committed to student mentorship and FBISE examination excellence."
        breadcrumbs={[{ label: "Faculty & Staff" }]}
        backgroundImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Controls: Search and Role Filter */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by teacher name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === role
                      ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Faculty Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 w-full">
                    <Image
                      src={staff.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                      alt={staff.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="px-2.5 py-0.5 rounded-full bg-gold-500 text-navy-950 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {staff.role}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                        {staff.name}
                      </h3>
                      {staff.subject && (
                        <p className="text-xs text-medical-600 dark:text-medical-400 font-semibold mt-0.5">
                          {staff.subject}
                        </p>
                      )}
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <div className="font-medium text-slate-700 dark:text-slate-200">
                        {staff.qualification}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Classes Taught */}
                {staff.classesTaught && staff.classesTaught.length > 0 && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                      Teaching Allocation:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {staff.classesTaught.map((cls, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {cls.classLevel} {cls.group} {cls.section ? `(${cls.section})` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
