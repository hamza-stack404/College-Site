"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/Button";
import { PortalUserRole, StudentProfile, TeacherProfile } from "@/lib/types";
import { AuthCard } from "@/components/portal/AuthCard";
import { StudentDashboard } from "@/components/portal/StudentDashboard";
import { ParentDashboard } from "@/components/portal/ParentDashboard";
import { TeacherDashboard } from "@/components/portal/TeacherDashboard";
import { AdminDashboard } from "@/components/portal/AdminDashboard";
import { LogOut, Loader2, AlertCircle, Clock } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { getAppSettingAction } from "@/lib/supabase/actions";

const IDLE_TIMEOUT_MINUTES = 30;

function getInitials(name: string): string {
  if (!name) return "BC";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function PortalPage() {
  const [activeRole, setActiveRole] = useState<PortalUserRole>("student");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isRestoringSession, setIsRestoringSession] = useState<boolean>(true);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string>("BCH-2026-0101");
  const [currentUserFullName, setCurrentUserFullName] = useState<string>("College Scholar");
  const [userProfileData, setUserProfileData] = useState<any>(null);
  const [childProfileData, setChildProfileData] = useState<any>(null);
  const [isMarksEntryOpen, setIsMarksEntryOpen] = useState<boolean>(true);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to fetch user's profile and, if parent, associated student
  const loadProfile = async (userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return true;
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, roll_number, full_name, father_name, role, discipline, section, class_level, classes_taught, subject, is_class_teacher, class_teacher_group, class_teacher_level, class_teacher_section")
        .eq("id", userId)
        .maybeSingle();

      if (error || !profile) {
        return false;
      }

      setUserProfileData(profile);
      if (profile.full_name) setCurrentUserFullName(profile.full_name);
      if (profile.roll_number) setCurrentUserId(profile.roll_number);
      if (profile.role) setActiveRole(profile.role as PortalUserRole);

      // If parent, fetch corresponding student record
      if (profile.role === "parent" && profile.roll_number) {
        const { data: studentRecord } = await supabase
          .from("profiles")
          .select("id, roll_number, full_name, father_name, role, discipline, section, class_level")
          .eq("roll_number", profile.roll_number.trim())
          .eq("role", "student")
          .maybeSingle();

        if (studentRecord) {
          setChildProfileData(studentRecord);
        }
      }

      return true;
    } catch (err) {
      console.warn("Profile fetch note:", err);
      return false;
    }
  };

  // Restore authenticated session and settings on mount
  useEffect(() => {
    async function initPortal() {
      setIsRestoringSession(true);
      try {
        const marksRes = await getAppSettingAction("marks_entry_open", true);
        if (typeof marksRes?.value === "boolean") {
          setIsMarksEntryOpen(marksRes.value);
        }

        if (!isSupabaseConfigured) {
          setIsRestoringSession(false);
          return;
        }

        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) {
          setIsRestoringSession(false);
          return;
        }

        if (sessionData.session?.user) {
          const profileOk = await loadProfile(sessionData.session.user.id);
          if (profileOk) {
            setIsLoggedIn(true);
          } else {
            // Profile failed to load despite active session
            await supabase.auth.signOut();
            setIsLoggedIn(false);
            setUserProfileData(null);
            setSessionError("Your session exists but profile details could not be retrieved. Please sign in again.");
          }
        }
      } catch (err) {
        console.error("Session verification error:", err);
      } finally {
        setIsRestoringSession(false);
      }
    }
    initPortal();
  }, []);

  // Idle timeout implementation (30 minutes of inactivity)
  const handleIdleSignOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Idle sign out error:", err);
      }
    }
    setUserProfileData(null);
    setChildProfileData(null);
    setIsLoggedIn(false);
    setSessionMessage("You were signed out due to inactivity.");
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      handleIdleSignOut();
    }, IDLE_TIMEOUT_MINUTES * 60 * 1000);
  }, [handleIdleSignOut]);

  useEffect(() => {
    if (!isLoggedIn) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return;
    }

    const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    const handleActivity = () => resetIdleTimer();

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleActivity, { passive: true });
    });

    // Start timer initially
    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleActivity);
      });
    };
  }, [isLoggedIn, resetIdleTimer]);

  const handleLoginSuccess = async (userId: string, role: PortalUserRole, fullName?: string) => {
    setSessionMessage(null);
    setSessionError(null);
    setCurrentUserId(userId);
    setActiveRole(role);
    if (fullName) {
      setCurrentUserFullName(fullName);
    }
    if (isSupabaseConfigured) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const ok = await loadProfile(userData.user.id);
          if (!ok) {
            await supabase.auth.signOut();
            setSessionError("Failed to retrieve profile record.");
            return;
          }
        }
      } catch (err) {
        console.warn("Profile fetch note:", err);
      }
    }
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
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
    setSessionMessage(null);
    setSessionError(null);
  };

  // Construct student profile for StudentDashboard
  const studentProp: StudentProfile = {
    id: userProfileData?.roll_number || currentUserId,
    name: userProfileData?.full_name || currentUserFullName,
    fatherName: userProfileData?.father_name || "",
    group: (userProfileData?.discipline || "Pre-Medical") as any,
    classLevel: (userProfileData?.class_level || "11th") as any,
    section: userProfileData?.section || "Section A",
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
    isClassTeacher: Boolean(userProfileData?.is_class_teacher),
    classTeacherGroup: userProfileData?.class_teacher_group,
    classTeacherLevel: userProfileData?.class_teacher_level,
    classTeacherSection: userProfileData?.class_teacher_section,
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
          {/* Notification Messages (Idle timeout or profile load errors) */}
          {sessionError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{sessionError}</span>
            </div>
          )}

          {sessionMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{sessionMessage}</span>
            </div>
          )}

          {/* Restoring Session View (prevents login form flashing) */}
          {isRestoringSession ? (
            <div className="py-24 text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-medical-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Restoring your session…
              </div>
            </div>
          ) : !isLoggedIn ? (
            <AuthCard
              activeRole={activeRole}
              onRoleChange={(role) => {
                setActiveRole(role);
                setSessionMessage(null);
                setSessionError(null);
              }}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <div className="space-y-8">
              {/* Authenticated User Header */}
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
