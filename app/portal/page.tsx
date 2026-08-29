"use client";

import React, { useState, useEffect } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/Button";
import { PortalUserRole, StudentProfile, TeacherProfile } from "@/lib/types";
import { AuthCard } from "@/components/portal/AuthCard";
import { StudentDashboard } from "@/components/portal/StudentDashboard";
import { ParentDashboard } from "@/components/portal/ParentDashboard";
import { TeacherDashboard } from "@/components/portal/TeacherDashboard";
import { AdminDashboard } from "@/components/portal/AdminDashboard";
import { LogOut } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

// NOTE: Full dashboard data-fetching (live timetable, fee records, examination marks from Supabase)
// is a dedicated follow-up task. Current dashboards below receive structured mock props for UI layout
// while the top Authenticated User Header reflects real authenticated Supabase user profile data.
const mockStudent: StudentProfile = {
  id: "BCH-2026-0101",
  name: "Muhammad Hamza Khan",
  fatherName: "Tariq Mahmood Khan",
  group: "Pre-Medical",
  classLevel: "11th",
  section: "Section A",
  category: "Civilian",
  feeStatus: "Paid",
  dueAmount: 0,
  attendancePercentage: 94.5,
  ptmTiming: "Saturday, Sep 05, 2026 at 10:30 AM (Room 12)",
  timetable: [
    {
      day: "Monday – Thursday",
      periods: [
        { time: "08:15 – 09:00 AM", subject: "Biology", teacher: "Prof. Dr. Tariq Khan", room: "Room 101" },
        { time: "09:00 – 09:45 AM", subject: "Chemistry", teacher: "Mrs. Naila Jabeen", room: "Room 101" },
        { time: "09:45 – 10:30 AM", subject: "Physics", teacher: "Prof. Muhammad Asif", room: "Room 101" },
        { time: "10:30 – 11:00 AM", subject: "Break & Zuhr Prayer", teacher: "College Mosque", room: "Masjid" },
        { time: "11:00 – 12:30 PM", subject: "Biology / Chemistry Practical", teacher: "Lab In-Charge", room: "Bio Lab" },
        { time: "12:30 – 01:15 PM", subject: "English Compulsory", teacher: "Prof. Salman Ahmed", room: "Room 101" },
        { time: "01:15 – 02:00 PM", subject: "Urdu / Islamiat", teacher: "Dr. Muhammad Irfan", room: "Room 101" },
      ],
    },
  ],
  internalExamResults: [
    {
      examName: "1st Term Assessment",
      examDate: "October 2026",
      subjects: [
        { name: "Biology", totalMarks: 100, obtainedMarks: 91, grade: "A-1" },
        { name: "Chemistry", totalMarks: 100, obtainedMarks: 88, grade: "A-1" },
        { name: "Physics", totalMarks: 100, obtainedMarks: 86, grade: "A-1" },
        { name: "English", totalMarks: 100, obtainedMarks: 82, grade: "A" },
        { name: "Urdu", totalMarks: 100, obtainedMarks: 85, grade: "A-1" },
        { name: "Islamic Education", totalMarks: 50, obtainedMarks: 47, grade: "A-1" },
      ],
      totalObtained: 479,
      totalMax: 550,
      percentage: 87.09,
    },
  ],
};

const mockTeacher: TeacherProfile = {
  id: "TCH-003",
  name: "Mrs. Naila Jabeen",
  subject: "Chemistry",
  classesTaught: [
    { group: "Pre-Medical", classLevel: "11th", section: "Section A" },
    { group: "Pre-Engineering", classLevel: "11th", section: "Section A" },
    { group: "Pre-Engineering", classLevel: "11th", section: "Section B" },
  ],
  timetable: [
    {
      day: "Daily",
      periods: [
        { time: "08:15 – 09:00 AM", class: "11th Pre-Medical (Sec A)", subject: "Chemistry Theory", room: "Room 101" },
        { time: "09:00 – 09:45 AM", class: "11th Pre-Engineering (Sec A)", subject: "Chemistry Theory", room: "Room 102" },
        { time: "11:00 – 12:30 PM", class: "11th Pre-Engineering (Sec B)", subject: "Chemistry Practical", room: "Chem Lab" },
      ],
    },
  ],
};

function getInitials(name: string): string {
  if (!name) return "BC";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function PortalPage() {
  const [activeRole, setActiveRole] = useState<PortalUserRole>("student");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>("BCH-2026-0101");
  const [currentUserFullName, setCurrentUserFullName] = useState<string>("Muhammad Hamza Khan");
  const [isMarksEntryOpen, setIsMarksEntryOpen] = useState<boolean>(true);

  // Restore authenticated session if active on mount
  useEffect(() => {
    async function checkActiveSession() {
      if (!isSupabaseConfigured) return;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          const userId = sessionData.session.user.id;
          const { data: profile } = await supabase
            .from("profiles")
            .select("roll_number, full_name, role")
            .eq("id", userId)
            .single();

          if (profile) {
            setCurrentUserId(profile.roll_number || "BCH-2026-0101");
            setCurrentUserFullName(profile.full_name || "College Scholar");
            if (profile.role) {
              setActiveRole(profile.role as PortalUserRole);
            }
            setIsLoggedIn(true);
          }
        }
      } catch (err) {
        console.error("Session verification error:", err);
      }
    }
    checkActiveSession();
  }, []);

  const handleLoginSuccess = async (userId: string, role: PortalUserRole, fullName?: string) => {
    setCurrentUserId(userId);
    setActiveRole(role);
    if (fullName) {
      setCurrentUserFullName(fullName);
    } else if (isSupabaseConfigured) {
      // Fetch profile if fullName was omitted
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, roll_number")
            .eq("id", userData.user.id)
            .single();
          if (profile?.full_name) {
            setCurrentUserFullName(profile.full_name);
          }
          if (profile?.roll_number) {
            setCurrentUserId(profile.roll_number);
          }
        }
      } catch (err) {
        console.warn("Profile fetch note:", err);
      }
    }
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Sign out error:", err);
      }
    }
    setIsLoggedIn(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Bahria College Hanif"
        title="College Academic Portal"
        subtitle="Unified portal for students, teachers, parents, and administrative management."
        breadcrumbs={[{ label: "Portal" }]}
        backgroundImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
      />

      <div className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isLoggedIn ? (
            <AuthCard
              activeRole={activeRole}
              onRoleChange={(role) => setActiveRole(role)}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <div className="space-y-8">
              {/* Authenticated User Header (reflects real Supabase profile data) */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-navy-950 text-gold-400 dark:bg-gold-500 dark:text-navy-950 flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0 font-mono">
                    {getInitials(currentUserFullName)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                      {activeRole === "parent"
                        ? `Parent / Guardian of ${currentUserFullName}`
                        : currentUserFullName}
                    </h3>
                    <div className="text-xs text-slate-500">
                      Role: <strong className="uppercase text-medical-600 dark:text-medical-400">{activeRole}</strong> • ID: <span className="font-mono">{currentUserId}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 text-xs">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </Button>
              </div>

              {/* Render Respective Dashboard */}
              {activeRole === "student" && <StudentDashboard student={mockStudent} />}
              {activeRole === "parent" && <ParentDashboard student={mockStudent} />}
              {activeRole === "teacher" && (
                <TeacherDashboard teacher={mockTeacher} isMarksEntryOpen={isMarksEntryOpen} />
              )}
              {activeRole === "admin" && (
                <AdminDashboard
                  isMarksEntryOpen={isMarksEntryOpen}
                  onToggleMarksEntry={() => setIsMarksEntryOpen(!isMarksEntryOpen)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
