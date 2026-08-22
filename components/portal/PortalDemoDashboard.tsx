"use client";

import React, { useState } from "react";
import {
  LogOut,
  Calendar,
  BookOpen,
  Award,
  DollarSign,
  Clock,
  CheckCircle,
  Download,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { formatCurrency } from "@/lib/utils";

interface PortalDemoDashboardProps {
  user: {
    role: "student" | "faculty" | "parent";
    name: string;
    identifier: string;
    department: string;
  };
  onLogout: () => void;
}

export const PortalDemoDashboard: React.FC<PortalDemoDashboardProps> = ({
  user,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "timetable" | "grades" | "fees">("overview");

  const timetable = [
    { time: "08:30 AM - 09:45 AM", subject: "Cell Biology & Histology (BIO-201)", room: "Lab 3B (Hanif Medical Wing)", instructor: "Prof. Dr. Tariq Khan" },
    { time: "10:00 AM - 11:15 AM", subject: "Organic Reaction Mechanisms (CHM-201)", room: "Lecture Theatre 2", instructor: "Dr. Sarah Vance" },
    { time: "11:30 AM - 01:00 PM", subject: "Histology Practical / Microscopic Slide Prep", room: "Diagnostic Suite 1", instructor: "Dr. Ayesha Siddiqua" },
    { time: "02:00 PM - 03:15 PM", subject: "MDCAT Rapid Analytical Problem Solving", room: "Auditorium Hall", instructor: "Academic Directorate" },
  ];

  const grades = [
    { code: "BIO-201", course: "Human Physiology & Anatomy", credits: 4, midterm: "92/100", grade: "A+", gpa: "4.00" },
    { code: "CHM-201", course: "Organic & Biochemistry", credits: 4, midterm: "88/100", grade: "A", gpa: "3.85" },
    { code: "PHY-201", course: "Electromagnetism & Medical Physics", credits: 4, midterm: "94/100", grade: "A+", gpa: "4.00" },
    { code: "ENG-201", course: "Advanced Scientific Composition", credits: 3, midterm: "85/100", grade: "A", gpa: "3.70" },
  ];

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
      {/* Top Portal Nav Bar */}
      <div className="bg-navy-950 text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="gold" size="sm">
              {user.role.toUpperCase()} PORTAL
            </Badge>
            <span className="text-xs text-slate-400">ID: {user.identifier}</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-white mt-1">
            Welcome back, {user.name}
          </h2>
          <p className="text-xs text-medical-300 font-semibold">{user.department}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="text-white border-white/20 hover:bg-white/10"
          leftIcon={<LogOut className="w-4 h-4" />}
        >
          Sign Out
        </Button>
      </div>

      {/* Tabs Switcher */}
      <div className="px-6 sm:px-8 pt-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400 border border-medical-200 dark:border-medical-800"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          Academic Overview
        </button>
        <button
          onClick={() => setActiveTab("timetable")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "timetable"
              ? "bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400 border border-medical-200 dark:border-medical-800"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          Class & Lab Timetable
        </button>
        <button
          onClick={() => setActiveTab("grades")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "grades"
              ? "bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400 border border-medical-200 dark:border-medical-800"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          Gradebook & Term Results
        </button>
        <button
          onClick={() => setActiveTab("fees")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "fees"
              ? "bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400 border border-medical-200 dark:border-medical-800"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          Fee Dues & Vouchers
        </button>
      </div>

      {/* Main Tab Views */}
      <div className="p-6 sm:p-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
                  Semester Attendance
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-display mt-1">
                  96.4%
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Above mandatory 85% requirement</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
                  Cumulative GPA
                </div>
                <div className="text-2xl font-black text-medical-600 dark:text-medical-400 font-display mt-1">
                  3.92 / 4.00
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Dean&apos;s Honor List Standing</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
                  Fee Clearance
                </div>
                <div className="text-2xl font-black text-navy-900 dark:text-white font-display mt-1">
                  Settled
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">✓ No outstanding dues</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">
                  Digital Library
                </div>
                <div className="text-2xl font-black text-gold-600 dark:text-gold-400 font-display mt-1">
                  2 Books
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Guyton Physiology (Due: 15 Sep)</div>
              </div>
            </div>

            {/* Upcoming Academic Alerts */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-medical-500/10 to-teal-500/5 border border-medical-500/20 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-medical-600 dark:text-medical-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  MDCAT Diagnostic Simulation Test #4 Announced
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  The upcoming computer-based simulation exam is scheduled for Saturday at 09:00 AM in the Hanif Digital Testing Center. Please bring your student smart ID card.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "timetable" && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Daily Class & Clinical Laboratory Schedule (Today)
            </h3>
            <div className="space-y-3">
              {timetable.map((slot, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {slot.subject}
                      </div>
                      <div className="text-xs text-slate-500">{slot.room} • {slot.instructor}</div>
                    </div>
                  </div>
                  <Badge variant="navy" size="sm">
                    {slot.time}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "grades" && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Semester Midterm & Diagnostic Gradebook
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Course Title</th>
                    <th className="py-3 px-4">Credits</th>
                    <th className="py-3 px-4">Midterm Score</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Grade Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {grades.map((g, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-bold text-medical-600 dark:text-medical-400">{g.code}</td>
                      <td className="py-3 px-4 text-slate-900 dark:text-white font-semibold">{g.course}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{g.credits}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{g.midterm}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{g.grade}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{g.gpa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "fees" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Current Status: Fully Paid
                </span>
                <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-0.5">
                  Fall 2026 Semester Challan Voucher #BCH-V-9921
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Amount Paid: Rs. 68,000 (Paid via Askari Bank Online Portal on 10-Aug-2026)
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => alert("Downloading digital fee voucher receipt PDF...")}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download Receipt PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
