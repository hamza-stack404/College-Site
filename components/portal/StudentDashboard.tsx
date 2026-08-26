"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StudentProfile } from "@/lib/types";
import { FeeChallanGenerator } from "@/components/tools/FeeChallanGenerator";
import { StudentIDCard } from "@/components/tools/StudentIDCard";
import { FileText, CreditCard, Calendar, Clock, Award, CheckCircle2, QrCode } from "lucide-react";

interface StudentDashboardProps {
  student: StudentProfile;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "challan" | "idcard">("overview");

  return (
    <div className="space-y-8">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Academic Overview
          </button>
          <button
            onClick={() => setActiveTab("challan")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "challan"
                ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <FileText className="w-4 h-4 text-gold-500" />
            <span>Bank Fee Challan</span>
          </button>
          <button
            onClick={() => setActiveTab("idcard")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "idcard"
                ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <QrCode className="w-4 h-4 text-medical-500" />
            <span>Digital Student ID Pass</span>
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Key Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Class & Section</div>
              <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {student.classLevel} {student.group}
              </div>
              <div className="text-xs text-medical-600 dark:text-medical-400 font-semibold">{student.section}</div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Fee Status</div>
              <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {student.category}
              </div>
              <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Dues Cleared
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Attendance Rate</div>
              <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {student.attendancePercentage}%
              </div>
              <div className="text-xs text-emerald-600 font-medium">Above FBISE 80% Requirement</div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Assessment Aggregate</div>
              <div className="font-display font-bold text-lg text-gold-500">
                {student.internalExamResults[0].percentage}%
              </div>
              <div className="text-xs text-slate-500">{student.internalExamResults[0].examName}</div>
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
                Academic Session 2026–2027
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
                  {student.internalExamResults[0].subjects.map((sub, idx) => (
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
              Daily Class Timetable ({student.section})
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {student.timetable[0].periods.map((p, idx) => (
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

      {activeTab === "challan" && (
        <FeeChallanGenerator
          initialStudentName={student.name}
          initialRollNo={student.id}
          initialGroup={student.group}
          initialCategory={student.category}
        />
      )}

      {activeTab === "idcard" && (
        <StudentIDCard
          name={student.name}
          fatherName={student.fatherName}
          rollNo={student.id}
          discipline={student.group}
          section={student.section}
        />
      )}
    </div>
  );
};
