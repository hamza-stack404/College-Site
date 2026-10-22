"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StudentProfile } from "@/lib/types";
import {
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  BookOpen,
  DollarSign,
  UserCheck,
  AlertCircle,
  FileText,
} from "lucide-react";
import { getTimetableAction, getStudentExamResultsAction } from "@/lib/supabase/actions";
import { FEE_TIERS } from "@/lib/data/constants";

interface StudentDashboardProps {
  student: StudentProfile;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student }) => {
  // Timetable image state
  const [timetableImageUrl, setTimetableImageUrl] = useState<string | null>(null);
  const [isLoadingTimetable, setIsLoadingTimetable] = useState(true);

  // Two separate exam phases (Assessment vs Send-up)
  const [activeExamPhase, setActiveExamPhase] = useState<"Assessment" | "Send-up">("Assessment");
  const [showSubjectBreakdown, setShowSubjectBreakdown] = useState<boolean>(true);

  // Exam marks state from Supabase
  const [examResultsData, setExamResultsData] = useState<any[]>([]);
  const [isLoadingMarks, setIsLoadingMarks] = useState(true);

  // Fetch timetable image and real student marks on mount
  useEffect(() => {
    async function loadStudentData() {
      // 1. Fetch timetable image for this section
      setIsLoadingTimetable(true);
      try {
        const ttRes = await getTimetableAction(student.group, student.classLevel, student.section);
        if (ttRes.success && ttRes.data?.image_url) {
          setTimetableImageUrl(ttRes.data.image_url);
        } else {
          setTimetableImageUrl(null);
        }
      } catch (err) {
        console.warn("Timetable fetch note:", err);
      } finally {
        setIsLoadingTimetable(false);
      }

      // 2. Fetch real exam results if recorded in Supabase
      setIsLoadingMarks(true);
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
        } else {
          setExamResultsData([]);
        }
      } catch (err) {
        console.warn("Marks fetch note:", err);
      } finally {
        setIsLoadingMarks(false);
      }
    }

    loadStudentData();
  }, [student.id, student.group, student.classLevel, student.section]);

  // Find active exam result for the selected phase
  const currentExam = examResultsData.find((r) => r.examType === activeExamPhase);

  // Monthly tuition fee from FEE_TIERS
  const monthlyTuition =
    student.category === "Armed Forces"
      ? FEE_TIERS.monthlyTuition.forces
      : FEE_TIERS.monthlyTuition.civilian;

  return (
    <div className="space-y-8">
      {/* Key Profile Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Class & Section</div>
          <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
            {student.classLevel || "11th"} {student.group}
          </div>
          <div className="text-xs text-medical-600 dark:text-medical-400 font-semibold">{student.section}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Fee Category & Tuition</div>
          <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
            PKR {monthlyTuition.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ month</span>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Category: <strong className="text-navy-950 dark:text-white">{student.category}</strong>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Academic Standing</div>
          <div className="font-display font-bold text-lg text-emerald-600 flex items-center gap-1.5">
            <UserCheck className="w-5 h-5" /> Active Scholar
          </div>
          <div className="text-xs text-slate-500">Enrolled for Session 2026–2028</div>
        </div>
      </div>

      {/* College Examination Records (Assessment vs Send-up) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <Badge variant="medical" size="sm">Academic Performance</Badge>
            <h4 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mt-1">
              Internal Examination Records (HSSC Part-I)
            </h4>
          </div>

          {/* Stage Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveExamPhase("Assessment")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeExamPhase === "Assessment"
                  ? "bg-medical-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Monthly Assessment
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

        {isLoadingMarks ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Loading examination records...
          </div>
        ) : currentExam ? (
          <>
            {/* Total Marks Summary Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Examination Stage: {currentExam.examName || activeExamPhase} {currentExam.examDate ? `(${currentExam.examDate})` : ""}
                </span>
                <div className="font-display font-bold text-2xl sm:text-3xl text-navy-950 dark:text-white">
                  {currentExam.totalObtained} <span className="text-base text-slate-400 font-normal">/ {currentExam.totalMax} Total Marks</span>
                </div>
                <div className="text-xs text-slate-500">
                  Standard Federal Board Assessment Scheme
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center sm:text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Aggregate Percentage</div>
                  <div className="font-display font-bold text-3xl text-gold-500">
                    {currentExam.percentage}%
                  </div>
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

            {/* Expandable Subject Breakdown */}
            {showSubjectBreakdown && currentExam.subjects && currentExam.subjects.length > 0 && (
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                      <th className="py-3 px-4 rounded-l-xl">Subject</th>
                      <th className="py-3 px-4">Total Marks</th>
                      <th className="py-3 px-4">Obtained Marks</th>
                      <th className="py-3 px-4">Percentage</th>
                      <th className="py-3 px-4 rounded-r-xl">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentExam.subjects.map((sub: any, idx: number) => {
                      const total = Number(sub.totalMarks || 100);
                      const obtained = Number(sub.obtainedMarks || 0);
                      const pct = total > 0 ? ((obtained / total) * 100).toFixed(1) : "0";
                      return (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{sub.name}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{total}</td>
                          <td className="py-3 px-4 font-bold text-medical-600 dark:text-medical-400">{obtained}</td>
                          <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{pct}%</td>
                          <td className="py-3 px-4">
                            <Badge variant={sub.grade === "A+" || sub.grade === "A" ? "gold" : "outline"} size="sm">
                              {sub.grade || "—"}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <Award className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No examination results recorded yet for {activeExamPhase === "Assessment" ? "Monthly Assessment" : "Send-up Examination"}
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Marks will appear here once officially uploaded and verified by your respective subject teachers.
            </p>
          </div>
        )}
      </div>

      {/* Official Section Timetable */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <Badge variant="outline" size="sm">Weekly Routine</Badge>
            <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
              Official Section Timetable — {student.classLevel || "11th"} {student.group} ({student.section})
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

        {isLoadingTimetable ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Checking for section timetable schedule...
          </div>
        ) : timetableImageUrl ? (
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
              Official schedule approved by academic administration for {student.group} ({student.section}).
            </div>
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No Timetable Uploaded Yet
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The official timetable schedule for {student.classLevel || "11th"} {student.group} ({student.section}) has not been published by administration yet. Please check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
