"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TeacherProfile } from "@/lib/types";
import { Lock, Unlock, Save, CheckCircle2, User, BookOpen, Layers } from "lucide-react";

interface TeacherDashboardProps {
  teacher: TeacherProfile;
  isMarksEntryOpen: boolean;
}

interface StudentGradeRow {
  rollNo: string;
  name: string;
  obtainedMarks: number;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  isMarksEntryOpen,
}) => {
  const [selectedSection, setSelectedSection] = useState("Pre-Medical Section A");
  const [studentGrades, setStudentGrades] = useState<StudentGradeRow[]>([
    { rollNo: "BCH-2026-0101", name: "Muhammad Hamza Khan", obtainedMarks: 91 },
    { rollNo: "BCH-2026-0102", name: "Zaid Ahmed", obtainedMarks: 84 },
    { rollNo: "BCH-2026-0103", name: "Ayesha Malik", obtainedMarks: 95 },
    { rollNo: "BCH-2026-0104", name: "Bilal Tariq", obtainedMarks: 78 },
    { rollNo: "BCH-2026-0105", name: "Fatima Noor", obtainedMarks: 89 },
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const calculateGrade = (marks: number) => {
    if (marks >= 80) return "A-1";
    if (marks >= 70) return "A";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C";
    return "F";
  };

  const handleMarksChange = (index: number, newMarks: number) => {
    const updated = [...studentGrades];
    updated[index].obtainedMarks = Math.min(100, Math.max(0, newMarks));
    setStudentGrades(updated);
    setIsSaved(false);
  };

  const handleSaveGrades = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Marks Gate Status Bar */}
      <div
        className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isMarksEntryOpen
            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
            : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {isMarksEntryOpen ? (
            <Unlock className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          ) : (
            <Lock className="w-6 h-6 text-amber-600 flex-shrink-0" />
          )}
          <div>
            <div className="font-bold text-sm">
              {isMarksEntryOpen ? "Internal Marks Entry Portal: ACTIVE & UNLOCKED" : "Internal Marks Entry Portal: LOCKED"}
            </div>
            <div className="text-xs">
              {isMarksEntryOpen
                ? "You have edit access to submit and revise internal assessment marks for your assigned classes."
                : "Marks entry is locked by college administration ahead of final gazette verification."}
            </div>
          </div>
        </div>
      </div>

      {/* Allocated Classes List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
          Allocated Subject Classes ({teacher.subject})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {teacher.classesTaught.map((cls, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedSection(`${cls.group} ${cls.section}`)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedSection === `${cls.group} ${cls.section}`
                  ? "bg-medical-50 dark:bg-medical-950/50 border-medical-500 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-medical-400"
              }`}
            >
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {cls.classLevel} {cls.group}
              </div>
              <div className="text-xs text-medical-600 dark:text-medical-400 font-semibold">{cls.section}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rapid Marks Grading Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <Badge variant="medical" size="sm">Assessment Grading Sheet</Badge>
            <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
              {teacher.subject} — {selectedSection} (Max Marks: 100)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            {isSaved && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Changes Synced
              </span>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={!isMarksEntryOpen}
              onClick={handleSaveGrades}
              className="gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Marks</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                <th className="py-3 px-4 rounded-l-xl">Roll ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Total Marks</th>
                <th className="py-3 px-4">Obtained Marks (0–100)</th>
                <th className="py-3 px-4 rounded-r-xl">Calculated Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentGrades.map((row, idx) => (
                <tr key={row.rollNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-navy-950 dark:text-white">{row.rollNo}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{row.name}</td>
                  <td className="py-3 px-4 text-slate-500">100</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      disabled={!isMarksEntryOpen}
                      value={row.obtainedMarks}
                      onChange={(e) => handleMarksChange(idx, Number(e.target.value))}
                      className="w-24 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-medical-600 dark:text-medical-400 focus:ring-2 focus:ring-medical-500 focus:outline-none disabled:opacity-60"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="gold" size="sm">{calculateGrade(row.obtainedMarks)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
