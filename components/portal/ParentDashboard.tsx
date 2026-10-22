"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StudentProfile } from "@/lib/types";
import {
  Users,
  Calendar,
  CheckCircle2,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Award,
  UserCheck,
} from "lucide-react";
import { getStudentExamResultsAction } from "@/lib/supabase/actions";
import { FEE_TIERS } from "@/lib/data/constants";

interface ParentDashboardProps {
  student: StudentProfile;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ student }) => {
  const [activeExamPhase, setActiveExamPhase] = useState<"Assessment" | "Send-up">("Assessment");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [examResultsData, setExamResultsData] = useState<any[]>([]);
  const [isLoadingMarks, setIsLoadingMarks] = useState(true);

  useEffect(() => {
    async function loadMarks() {
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
        console.warn("Parent marks fetch note:", err);
      } finally {
        setIsLoadingMarks(false);
      }
    }
    loadMarks();
  }, [student.id]);

  const currentExam = examResultsData.find((r) => r.examType === activeExamPhase);

  const monthlyTuition =
    student.category === "Armed Forces"
      ? FEE_TIERS.monthlyTuition.forces
      : FEE_TIERS.monthlyTuition.civilian;

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <Badge variant="gold" size="sm">Parent Academic Portal</Badge>
          <h4 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-2">
            Progress Overview for {student.name}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Child Roll Number: <strong className="text-navy-950 dark:text-white font-mono">{student.id}</strong> • Class: {student.classLevel || "11th"} {student.group} ({student.section})
          </p>
        </div>

        {/* 3 Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Parent-Teacher Meeting (PTM)</div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No meeting scheduled yet
            </div>
            <div className="text-[11px] text-slate-400">Notices will be communicated via portal</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Fee Category & Tuition</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              PKR {monthlyTuition.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ month</span>
            </div>
            <div className="text-[11px] text-slate-500">Rate: {student.category}</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Academic Enrollment</div>
            <div className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <UserCheck className="w-4 h-4" /> Active Student
            </div>
            <div className="text-[11px] text-slate-400">Class 11 (HSSC Part-I)</div>
          </div>
        </div>

        {/* Internal Examination Performance */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h5 className="font-bold text-sm text-slate-900 dark:text-white">
              Internal Examination Performance:
            </h5>

            {/* Stage Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveExamPhase("Assessment")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeExamPhase === "Assessment"
                    ? "bg-medical-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Monthly Assessment
              </button>
              <button
                onClick={() => setActiveExamPhase("Send-up")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
            <div className="py-8 text-center text-xs text-slate-500">
              Loading examination records...
            </div>
          ) : currentExam ? (
            <>
              {/* Total Marks Summary */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-medium">
                    {currentExam.examName || activeExamPhase} {currentExam.examDate ? `(${currentExam.examDate})` : ""}
                  </div>
                  <div className="font-display font-bold text-2xl text-navy-950 dark:text-white">
                    {currentExam.totalObtained} / {currentExam.totalMax} Total Marks
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Your ward secured an overall aggregate of <strong>{currentExam.percentage}%</strong>.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="gap-1.5 text-xs"
                >
                  <span>{showBreakdown ? "Hide Details" : "View Subject Marks"}</span>
                  {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </Button>
              </div>

              {showBreakdown && currentExam.subjects && currentExam.subjects.length > 0 && (
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                        <th className="py-2.5 px-4 rounded-l-xl">Subject</th>
                        <th className="py-2.5 px-4">Total Marks</th>
                        <th className="py-2.5 px-4">Obtained Marks</th>
                        <th className="py-2.5 px-4">Percentage</th>
                        <th className="py-2.5 px-4 rounded-r-xl">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {currentExam.subjects.map((sub: any, idx: number) => {
                        const total = Number(sub.totalMarks || 100);
                        const obtained = Number(sub.obtainedMarks || 0);
                        const pct = total > 0 ? ((obtained / total) * 100).toFixed(1) : "0";
                        return (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">{sub.name}</td>
                            <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">{total}</td>
                            <td className="py-2.5 px-4 font-bold text-medical-600 dark:text-medical-400">{obtained}</td>
                            <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{pct}%</td>
                            <td className="py-2.5 px-4">
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
            <div className="text-center py-10 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <Award className="w-7 h-7 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No examination results recorded yet for {activeExamPhase === "Assessment" ? "Monthly Assessment" : "Send-up Examination"}
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Official marks will be posted here once published by the college evaluation committee.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
