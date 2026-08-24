"use client";

import React, { useState } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PortalUserRole, StudentProfile, TeacherProfile } from "@/lib/types";
import { COLLEGE_INFO, FEE_TIERS } from "@/lib/data/constants";
import { initialNoticesData } from "@/lib/data/notices";
import { initialAnnouncementsData } from "@/lib/data/announcements";
import { facultyData } from "@/lib/data/faculty";
import {
  User,
  Lock,
  KeyRound,
  Shield,
  GraduationCap,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  FileText,
  DollarSign,
  AlertCircle,
  Unlock,
  Plus,
  Trash2,
  Eye,
  Megaphone,
  Layers,
  Sparkles,
  Phone,
} from "lucide-react";

// Mock Student Profile
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

// Mock Teacher Profile
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

export default function PortalPage() {
  const [activeRole, setActiveRole] = useState<PortalUserRole>("student");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "create_password" | "forgot_password">("login");

  // Auth form states
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Admin states
  const [isMarksEntryOpen, setIsMarksEntryOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<"notices" | "announcements" | "accounts">("notices");

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginId("");
    setPassword("");
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
          {/* Role Switcher Bar */}
          <div className="flex justify-center mb-8">
            <div className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-1">
              {(
                [
                  { role: "student", label: "Student Login", icon: GraduationCap },
                  { role: "parent", label: "Parent Login", icon: Users },
                  { role: "teacher", label: "Teacher Login", icon: User },
                  { role: "admin", label: "Admin Portal", icon: Shield },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.role}
                    onClick={() => {
                      setActiveRole(tab.role);
                      setIsLoggedIn(false);
                      setAuthMode("login");
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      activeRole === tab.role
                        ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-md"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {!isLoggedIn ? (
            /* Login / Create Password Card */
            <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="text-center space-y-1">
                <Badge variant="medical" size="sm">
                  {activeRole === "admin"
                    ? "Administrative Access"
                    : activeRole === "teacher"
                    ? "Faculty Login"
                    : activeRole === "parent"
                    ? "Parent Verification"
                    : "Student Identity"}
                </Badge>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mt-2">
                  {authMode === "create_password"
                    ? "Create College Password"
                    : authMode === "forgot_password"
                    ? "Reset Password"
                    : `Sign In as ${activeRole.toUpperCase()}`}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeRole === "student"
                    ? "Enter your College ID (e.g. BCH-2026-0101)"
                    : activeRole === "parent"
                    ? "Enter your ward's College ID + Parent Password"
                    : activeRole === "teacher"
                    ? "Enter your Teacher ID (e.g. TCH-003)"
                    : "Enter administrative credentials"}
                </p>
              </div>

              {authMode === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {activeRole === "student" || activeRole === "parent"
                        ? "College ID (From ID Card)"
                        : activeRole === "teacher"
                        ? "Teacher ID"
                        : "Admin Username / Email"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        activeRole === "student" || activeRole === "parent"
                          ? "BCH-2026-0101"
                          : activeRole === "teacher"
                          ? "TCH-003"
                          : "admin@bahriahanif.edu.pk"
                      }
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        {activeRole === "parent" ? "Parent Password" : "Password"}
                      </label>
                      <button
                        type="button"
                        onClick={() => setAuthMode("forgot_password")}
                        className="text-[11px] font-semibold text-medical-600 dark:text-medical-400 hover:underline cursor-pointer"
                      >
                        Forgot?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="md" className="w-full justify-center">
                    Sign In to Portal
                  </Button>

                  {(activeRole === "student" || activeRole === "parent") && (
                    <div className="pt-2 text-center text-xs text-slate-500">
                      First time logging in?{" "}
                      <button
                        type="button"
                        onClick={() => setAuthMode("create_password")}
                        className="font-bold text-medical-600 dark:text-medical-400 hover:underline cursor-pointer"
                      >
                        Create Password
                      </button>
                    </div>
                  )}
                </form>
              )}

              {authMode === "create_password" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Password set successfully! You can now log in.");
                    setAuthMode("login");
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      College ID
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="BCH-2026-0101"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                    />
                  </div>
                  <Button type="submit" variant="primary" size="md" className="w-full justify-center">
                    Save Password & Continue
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className="text-xs text-slate-500 hover:underline cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}

              {authMode === "forgot_password" && (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    To reset your credentials, please visit the Student Affairs Office (Window 2) with your physical College ID card, or contact the helpline at <strong>{COLLEGE_INFO.phonePrimary}</strong>.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setAuthMode("login")}>
                    Back to Sign In
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Logged-In Portal Dashboards */
            <div className="space-y-8">
              {/* Top User Bar */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-navy-950 text-gold-400 dark:bg-gold-500 dark:text-navy-950 flex items-center justify-center font-bold text-lg">
                    {activeRole === "student" || activeRole === "parent"
                      ? "MH"
                      : activeRole === "teacher"
                      ? "NJ"
                      : "AD"}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                      {activeRole === "student"
                        ? mockStudent.name
                        : activeRole === "parent"
                        ? `Parent of ${mockStudent.name}`
                        : activeRole === "teacher"
                        ? mockTeacher.name
                        : "Administrator"}
                    </h3>
                    <div className="text-xs text-slate-500">
                      Role: <strong className="uppercase text-medical-600 dark:text-medical-400">{activeRole}</strong> • ID: {mockStudent.id}
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>

              {/* 1. STUDENT DASHBOARD */}
              {activeRole === "student" && (
                <div className="space-y-8">
                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="text-xs text-slate-400 font-bold uppercase">Class & Section</div>
                      <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
                        {mockStudent.classLevel} {mockStudent.group}
                      </div>
                      <div className="text-xs text-medical-600 dark:text-medical-400">{mockStudent.section}</div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="text-xs text-slate-400 font-bold uppercase">Fee Category</div>
                      <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
                        {mockStudent.category}
                      </div>
                      <div className="text-xs text-emerald-600 font-bold">Status: {mockStudent.feeStatus}</div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="text-xs text-slate-400 font-bold uppercase">Attendance Rate</div>
                      <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
                        {mockStudent.attendancePercentage}%
                      </div>
                      <div className="text-xs text-emerald-600">Satisfactory (FBISE Standard)</div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="text-xs text-slate-400 font-bold uppercase">Latest Exam Aggregate</div>
                      <div className="font-display font-bold text-lg text-gold-500">
                        {mockStudent.internalExamResults[0].percentage}%
                      </div>
                      <div className="text-xs text-slate-500">{mockStudent.internalExamResults[0].examName}</div>
                    </div>
                  </div>

                  {/* Internal Exam Results Section */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="medical" size="sm">Internal Evaluation</Badge>
                        <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
                          College Internal Exam Results (HSSC Part-I)
                        </h4>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        Session 2026–2027
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                            <th className="py-3 px-4 rounded-l-xl">Subject</th>
                            <th className="py-3 px-4">Total Marks</th>
                            <th className="py-3 px-4">Obtained Marks</th>
                            <th className="py-3 px-4 rounded-r-xl">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {mockStudent.internalExamResults[0].subjects.map((sub, idx) => (
                            <tr key={idx}>
                              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{sub.name}</td>
                              <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{sub.totalMarks}</td>
                              <td className="py-3 px-4 font-bold text-medical-600 dark:text-medical-400">{sub.obtainedMarks}</td>
                              <td className="py-3 px-4">
                                <Badge variant="gold" size="sm">{sub.grade}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Timetable Section */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
                    <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                      Section Daily Class Schedule ({mockStudent.section})
                    </h4>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {mockStudent.timetable[0].periods.map((p, idx) => (
                        <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-medical-600 dark:text-medical-400 min-w-[130px]">{p.time}</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{p.subject}</span>
                          </div>
                          <div className="text-slate-500 text-xs flex items-center gap-4">
                            <span>{p.teacher}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">{p.room}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PARENT DASHBOARD */}
              {activeRole === "parent" && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                    <Badge variant="gold" size="sm">Parent Overview</Badge>
                    <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                      Academic Progress for {mockStudent.name} ({mockStudent.id})
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                        <div className="text-xs text-slate-400 uppercase font-bold">Upcoming PTM</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{mockStudent.ptmTiming}</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                        <div className="text-xs text-slate-400 uppercase font-bold">Attendance Record</div>
                        <div className="text-sm font-bold text-emerald-600">{mockStudent.attendancePercentage}% Present</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                        <div className="text-xs text-slate-400 uppercase font-bold">Fee Status</div>
                        <div className="text-sm font-bold text-emerald-600">All Dues Cleared</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">Latest Assessment Summary:</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {mockStudent.name} secured <strong>{mockStudent.internalExamResults[0].totalObtained}/{mockStudent.internalExamResults[0].totalMax}</strong> ({mockStudent.internalExamResults[0].percentage}%) in the 1st Term Assessment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. TEACHER DASHBOARD */}
              {activeRole === "teacher" && (
                <div className="space-y-8">
                  {/* Marks Entry Gate Notice */}
                  <div className={`p-6 rounded-3xl border flex items-center justify-between gap-4 ${
                    isMarksEntryOpen
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-900 dark:text-emerald-200"
                      : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-900 dark:text-amber-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      {isMarksEntryOpen ? <Unlock className="w-6 h-6 text-emerald-600" /> : <Lock className="w-6 h-6 text-amber-600" />}
                      <div>
                        <div className="font-bold text-sm">
                          {isMarksEntryOpen ? "Internal Marks Entry Portal: OPEN" : "Internal Marks Entry Portal: LOCKED"}
                        </div>
                        <div className="text-xs">
                          {isMarksEntryOpen
                            ? "Admin has opened the marks submission window. You can enter or revise student scores."
                            : "Marks entry is currently locked by the administrator ahead of the next exam cycle."}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Allocated Classes */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
                    <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                      Allocated Classes & Teaching Schedule
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {mockTeacher.classesTaught.map((cls, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
                          <div className="font-bold text-sm text-slate-900 dark:text-white">
                            {cls.classLevel} {cls.group}
                          </div>
                          <div className="text-xs text-medical-600 dark:text-medical-400 font-semibold">{cls.section}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. ADMIN DASHBOARD */}
              {activeRole === "admin" && (
                <div className="space-y-8">
                  {/* Admin Controls Strip */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-medical-600 dark:text-medical-400 uppercase tracking-wider">Exam Control</div>
                      <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">Teacher Marks Entry Window</h4>
                      <p className="text-xs text-slate-500">Toggle whether teachers can input internal assessment scores.</p>
                    </div>

                    <Button
                      variant={isMarksEntryOpen ? "gold" : "primary"}
                      size="sm"
                      onClick={() => setIsMarksEntryOpen(!isMarksEntryOpen)}
                    >
                      {isMarksEntryOpen ? "Lock Marks Entry" : "Open Marks Entry Window"}
                    </Button>
                  </div>

                  {/* Admin Tabs */}
                  <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    {(["notices", "announcements", "accounts"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveAdminTab(tab)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all cursor-pointer ${
                          activeAdminTab === tab
                            ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        Manage {tab}
                      </button>
                    ))}
                  </div>

                  {/* Notices CMS Manager */}
                  {activeAdminTab === "notices" && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                          Live College Notices (Supabase-backed)
                        </h4>
                        <Button variant="primary" size="sm" onClick={() => alert("Notice created in database.")}>
                          <Plus className="w-4 h-4 mr-1" /> Add New Notice
                        </Button>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {initialNoticesData.map((n) => (
                          <div key={n.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{n.title}</div>
                              <div className="text-xs text-slate-400">{n.category} • {n.date}</div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Announcements CMS Manager */}
                  {activeAdminTab === "announcements" && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                          Campus Announcements
                        </h4>
                        <Button variant="primary" size="sm" onClick={() => alert("Announcement created.")}>
                          <Plus className="w-4 h-4 mr-1" /> Add Announcement
                        </Button>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {initialAnnouncementsData.map((a) => (
                          <div key={a.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{a.heading}</div>
                              <div className="text-xs text-slate-400">{a.date}</div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accounts Creator */}
                  {activeAdminTab === "accounts" && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
                      <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                        Create Student, Teacher or Parent Account
                      </h4>
                      <form onSubmit={(e) => { e.preventDefault(); alert("Account created and assigned."); }} className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Account Role</label>
                          <select className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                            <option>Student Account</option>
                            <option>Teacher Account</option>
                            <option>Parent Account</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assign Login ID (Matches College ID Card)</label>
                          <input placeholder="e.g. BCH-2026-0102" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm" />
                        </div>
                        <Button type="submit" variant="primary" size="md">Create Account</Button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
