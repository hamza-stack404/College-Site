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
import { getAppSettingAction } from "@/lib/supabase/actions";

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
  const [currentUserFullName, setCurrentUserFullName] = useState<string>("College Scholar");
  const [userProfileData, setUserProfileData] = useState<any>(null);
  const [childProfileData, setChildProfileData] = useState<any>(null);
  const [isMarksEntryOpen, setIsMarksEntryOpen] = useState<boolean>(true);

  // Helper to fetch user's profile and, if parent, associated student
  const loadProfile = async (userId: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, roll_number, full_name, father_name, role, discipline, section, class_level, category, classes_taught, subject")
        .eq("id", userId)
        .single();

      if (profile) {
        setUserProfileData(profile);
        if (profile.full_name) setCurrentUserFullName(profile.full_name);
        if (profile.roll_number) setCurrentUserId(profile.roll_number);
        if (profile.role) setActiveRole(profile.role as PortalUserRole);

        // If parent, fetch the corresponding student record
        if (profile.role === "parent" && profile.roll_number) {
          const { data: studentRecord } = await supabase
            .from("profiles")
            .select("id, roll_number, full_name, father_name, role, discipline, section, class_level, category")
            .eq("roll_number", profile.roll_number)
            .eq("role", "student")
            .maybeSingle();

          if (studentRecord) {
            setChildProfileData(studentRecord);
          }
        }
      }
    } catch (err) {
      console.warn("Profile fetch note:", err);
    }
  };

  // Restore authenticated session and settings on mount
  useEffect(() => {
    async function initPortal() {
      try {
        const marksRes = await getAppSettingAction("marks_entry_open", true);
        if (typeof marksRes?.value === "boolean") {
          setIsMarksEntryOpen(marksRes.value);
        }

        if (!isSupabaseConfigured) return;
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          await loadProfile(sessionData.session.user.id);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Session verification error:", err);
      }
    }
    initPortal();
  }, []);

  const handleLoginSuccess = async (userId: string, role: PortalUserRole, fullName?: string) => {
    setCurrentUserId(userId);
    setActiveRole(role);
    if (fullName) {
      setCurrentUserFullName(fullName);
    }
    if (isSupabaseConfigured) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          await loadProfile(userData.user.id);
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
    setUserProfileData(null);
    setChildProfileData(null);
    setIsLoggedIn(false);
  };

  // Construct student profile for StudentDashboard
  const studentProp: StudentProfile = {
    id: userProfileData?.roll_number || currentUserId,
    name: userProfileData?.full_name || currentUserFullName,
    fatherName: userProfileData?.father_name || "",
    group: (userProfileData?.discipline || "Pre-Medical") as any,
    classLevel: (userProfileData?.class_level || "11th") as any,
    section: userProfileData?.section || "Section A",
    category: (userProfileData?.category || "Civilian") as any,
    feeStatus: "Paid",
    dueAmount: 0,
    attendancePercentage: 100,
    ptmTiming: "No meeting scheduled yet",
    timetable: [],
    internalExamResults: [],
  };

  // Construct child profile for ParentDashboard
  const parentStudentProp: StudentProfile = {
    id: childProfileData?.roll_number || userProfileData?.roll_number || currentUserId,
    name: childProfileData?.full_name || "Enrolled Student",
    fatherName: childProfileData?.father_name || userProfileData?.full_name || "",
    group: (childProfileData?.discipline || "Pre-Medical") as any,
    classLevel: (childProfileData?.class_level || "11th") as any,
    section: childProfileData?.section || "Section A",
    category: (childProfileData?.category || userProfileData?.category || "Civilian") as any,
    feeStatus: "Paid",
    dueAmount: 0,
    attendancePercentage: 100,
    ptmTiming: "No meeting scheduled yet",
    timetable: [],
    internalExamResults: [],
  };

  // Construct teacher profile for TeacherDashboard
  const teacherProp: TeacherProfile = {
    id: userProfileData?.roll_number || currentUserId,
    name: userProfileData?.full_name || currentUserFullName,
    subject: userProfileData?.subject || "",
    classesTaught: userProfileData?.classes_taught || [],
    timetable: [],
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
                        ? `Parent / Guardian: ${currentUserFullName}`
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
              {activeRole === "student" && <StudentDashboard student={studentProp} />}
              {activeRole === "parent" && <ParentDashboard student={parentStudentProp} />}
              {activeRole === "teacher" && (
                <TeacherDashboard
                  teacher={teacherProp}
                  isMarksEntryOpen={isMarksEntryOpen}
                />
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
