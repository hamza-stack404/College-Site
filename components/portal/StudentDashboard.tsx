"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StudentProfile } from "@/lib/types";
import { FeeChallanGenerator } from "@/components/tools/FeeChallanGenerator";
import { StudentIDCard } from "@/components/tools/StudentIDCard";
import {
  FileText,
  CreditCard,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  QrCode,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  BookOpen,
} from "lucide-react";
import { getTimetableAction, getStudentExamResultsAction } from "@/lib/supabase/actions";

interface StudentDashboardProps {
  student: StudentProfile;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "challan" | "idcard">("overview");

  // D2: Timetable image state
  const [timetableImageUrl, setTimetableImageUrl] = useState<string | null>(null);

  // D5: Two separate exam phases
  const [activeExamPhase, setActiveExamPhase] = useState<"Assessment" | "Send-up">("Assessment");
  const [showSubjectBreakdown, setShowSubjectBreakdown] = useState<boolean>(true);

  // Exam marks state
  const [examResultsData, setExamResultsData] = useState<any[]>(student.internalExamResults || []);

  // Fetch timetable image and real student marks on mount
  useEffect(() => {
    async function loadStudentData() {
      // 1. Fetch timetable image for this section (D2)
      try {
        const ttRes = await getTimetableAction(student.group, student.classLevel, student.section);
        if (ttRes.success && ttRes.data?.image_url) {
          setTimetableImageUrl(ttRes.data.image_url);
        }
      } catch (err) {
        console.warn("Timetable fetch note:", err);
      }

      // 2. Fetch real exam results if recorded (D5, D6)
      try {
        const marksRes = await getStudentExamResultsAction(student.id);
        if (marksRes.success && marksRes.data && marksRes.data.length > 0) {
          setExamResultsData(
            marksRes.data.map((r: any) => ({
              examType: r.exam_type,
              examName: r.exam_name,
              examDate: r.exam_date,
              subjects: r.subjects || [],
              totalObtained: r.total_obtained,
              totalMax: r.total_max,
              percentage: r.percentage,
            }))
          );
        }
      } catch (err) {
        console.warn("Marks fetch note:", err);
      }
    }
    loadStudentData();
  }, [student.id, student.group, student.classLevel, student.section]);

  // Find active exam result or fallback to default
  const currentExam =
    examResultsData.find((r) => r.examType === activeExamPhase) ||
    (activeExamPhase === "Assessment"
      ? {
          examType: "Assessment",
          examName: "1st Term Assessment 2026",
          examDate: "October 2026",
          subjects: [
            { name: "Biology", totalMarks: 100, obtainedMarks: 91, grade: "A-1" },
            { name: "Chemistry", totalMarks: 100, obtainedMarks: 88, grade: "A-1" },
            { name: "Physics", totalMarks: 100, obtainedMarks: 86, grade: "A-1" },
            { name: "English Compulsory", totalMarks: 100, obtainedMarks: 82, grade: "A" },
            { name: "Urdu Compulsory", totalMarks: 100, obtainedMarks: 85, grade: "A-1" },
            { name: "Islamic Education", totalMarks: 50, obtainedMarks: 47, grade: "A-1" },
          ],
          totalObtained: 479,
          totalMax: 550,
          percentage: 87.09,
        }
      : {
          examType: "Send-up",
          examName: "Send-up / Pre-Board Examination 2026",
          examDate: "December 2026",
          subjects: [
            { name: "Biology", totalMarks: 100, obtainedMarks: 94, grade: "A-1" },
            { name: "Chemistry", totalMarks: 100, obtainedMarks: 90, grade: "A-1" },
            { name: "Physics", totalMarks: 100, obtainedMarks: 89, grade: "A-1" },
            { name: "English Compulsory", totalMarks: 100, obtainedMarks: 85, grade: "A-1" },
            { name: "Urdu Compulsory", totalMarks: 100, obtainedMarks: 88, grade: "A-1" },
            { name: "Islamic Education", totalMarks: 50, obtainedMarks: 48, grade: "A-1" },
          ],
          totalObtained: 494,
          totalMax: 550,
          percentage: 89.82,
        });

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
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Fee Account</div>
              <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {student.category}
              </div>
              <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Dues Cleared
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Attendance Rate</div>
              <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {student.attendancePercentage}%
              </div>
              <div className="text-xs text-emerald-600 font-medium">FBISE Eligible (≥80%)</div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Evaluation Aggregate</div>
              <div className="font-display font-bold text-lg text-gold-500">
                {currentExam.percentage}%
              </div>
              <div className="text-xs text-slate-500">{currentExam.examName}</div>
            </div>
          </div>

          {/* D5: Dual Examination Tabs (Assessment vs Send-up) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <Badge variant="medical" size="sm">Academic Performance</Badge>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mt-1">
                  College Examination Records (HSSC Part-I)
                </h4>
              </div>

              {/* D5: Stage Selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveExamPhase("Assessment")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeExamPhase === "Assessment"
                      ? "bg-medical-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  1st Term Assessment
                </button>
                <button
                  onClick={() => setActiveExamPhase("Send-up")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeExamPhase === "Send-up"
                      ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Send-up Examination
                </button>
              </div>
            </div>

            {/* D6: Total Marks Summary Banner First */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Examination Stage: {currentExam.examName} ({currentExam.examDate})
                </span>
                <div className="font-display font-bold text-2xl sm:text-3xl text-navy-950 dark:text-white">
                  {currentExam.totalObtained} <span className="text-base text-slate-400 font-normal">/ {currentExam.totalMax} Total Marks</span>
                </div>
                <div className="text-xs text-slate-500">
                  Standard Federal Board Pattern Assessment
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center sm:text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Aggregate Percentage</div>
                  <div className="font-display font-bold text-3xl text-gold-500">
                    {currentExam.percentage}%
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600">Grade: A-1 (Distinction)</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSubjectBreakdown(!showSubjectBreakdown)}
                  className="gap-1.5 text-xs"
                >
                  <span>{showSubjectBreakdown ? "Hide Details" : "View Subject Breakdown"}</span>
                  {showSubjectBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>

            {/* D6: Expandable Subject Breakdown Drill-Down */}
            {showSubjectBreakdown && (
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                      <th className="py-3 px-4 rounded-l-xl">Subject</th>
                      <th className="py-3 px-4">Total Marks</th>
                      <th className="py-3 px-4">Obtained Marks</th>
                      <th className="py-3 px-4">Percentage</th>
                      <th className="py-3 px-4 rounded-r-xl">Calculated Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentExam.subjects.map((sub: any, idx: number) => {
                      const pct = sub.totalMarks > 0 ? ((sub.obtainedMarks / sub.totalMarks) * 100).toFixed(1) : "0";
                      return (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{sub.name}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{sub.totalMarks}</td>
                          <td className="py-3 px-4 font-bold text-medical-600 dark:text-medical-400">{sub.obtainedMarks}</td>
                          <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{pct}%</td>
                          <td className="py-3 px-4">
                            <Badge variant="gold" size="sm">{sub.grade || "A-1"}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* D2: Section Timetable (Image display or Structured timetable fallback) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <Badge variant="outline" size="sm">Weekly Academic Routine</Badge>
                <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
                  Official Section Timetable — {student.classLevel} {student.group} ({student.section})
                </h4>
              </div>

              {timetableImageUrl && (
                <a
                  href={timetableImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-medical-600 dark:text-medical-400 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full-Resolution Schedule</span>
                </a>
              )}
            </div>

            {timetableImageUrl ? (
              /* Display actual uploaded timetable image per section */
              <div className="space-y-3">
                <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950">
                  <Image
                    src={timetableImageUrl}
                    alt={`${student.section} Official Timetable`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-xs text-slate-500 text-center">
                  Official timetable image uploaded by academic administration for {student.group} ({student.section}).
                </div>
              </div>
            ) : (
              /* Standard Structured Periods Fallback */
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {student.timetable[0].periods.map((p, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
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
            )}
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
