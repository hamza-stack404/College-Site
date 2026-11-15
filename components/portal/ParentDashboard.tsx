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
  GraduationCap,
  Loader2,
} from "lucide-react";
import { getStudentExamResultsAction, getParentChildDataAction } from "@/lib/supabase/actions";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { ExamType, SUBJECT_MARKS, calculateGrade } from "@/lib/data/constants";

interface ParentDashboardProps {
  student: StudentProfile;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ student: initialStudent }) => {
  const [activeExamPhase, setActiveExamPhase] = useState<ExamType>("Send-up");
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [examResultsData, setExamResultsData] = useState<any[]>([]);
  const [isLoadingMarks, setIsLoadingMarks] = useState(true);

  // Real child record & class teacher from getParentChildDataAction
  const [childData, setChildData] = useState<{
    id: string;
    rollNumber: string;
    fullName: string;
    fatherName?: string;
    discipline?: string;
    classLevel?: string;
    section?: string;
  } | null>(null);
  const [classTeacherName, setClassTeacherName] = useState<string>("Loading…");

  // Load real child info and class teacher
  useEffect(() => {
    async function loadChildAndTeacher() {
      if (!isSupabaseConfigured) {
        setClassTeacherName("Not assigned yet");
        return;
      }

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) {
          setClassTeacherName("Not assigned yet");
          return;
        }

        const res = await getParentChildDataAction(token);
        if (res.success && res.child) {
          setChildData(res.child);
          setClassTeacherName(res.classTeacherName || "Not assigned yet");

          // Load marks for this verified child id
          loadMarks(res.child.id);
        } else {
          setClassTeacherName("Not assigned yet");
          if (initialStudent?.id) {
            loadMarks(initialStudent.id);
          }
        }
      } catch (err) {
        console.warn("Could not load parent child data:", err);
        setClassTeacherName("Not assigned yet");
      }
    }

    async function loadMarks(studentId: string) {
      setIsLoadingMarks(true);
      try {
        const marksRes = await getStudentExamResultsAction(studentId);
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

    loadChildAndTeacher();
  }, [initialStudent?.id]);

  const currentExam = examResultsData.find((r) => r.examType === activeExamPhase);

  // Student display particulars
  const studentName = childData?.fullName || initialStudent.name || "Student";
  const studentRoll = childData?.rollNumber || initialStudent.id || "—";
  const studentDiscipline = childData?.discipline || initialStudent.group || "—";
  const studentClassLevel = childData?.classLevel || initialStudent.classLevel || "—";
  const studentSection = childData?.section || initialStudent.section || "—";

  const isScienceSubject = (name: string) => {
    const cfg = SUBJECT_MARKS[name];
    return Boolean(cfg && cfg.practical > 0);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <Badge variant="gold" size="sm">Parent Academic Portal</Badge>
          <h4 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-2">
            Progress Overview for {studentName}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Child Roll Number: <strong className="text-navy-950 dark:text-white font-mono">{studentRoll}</strong> • {studentClassLevel !== "—" ? `Class ${studentClassLevel}` : "—"} {studentDiscipline} {studentSection !== "—" ? `(${studentSection})` : ""}
          </p>
        </div>

        {/* 3 Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Box 1: PTM */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Parent-Teacher Meeting (PTM)
            </div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No meeting scheduled yet
            </div>
            <div className="text-[11px] text-slate-400">Notices will be communicated via portal</div>
          </div>

          {/* Box 2: Class Teacher (Replaced Fee Quota Box) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Section Class Teacher
            </div>
            <div className="text-sm font-bold text-navy-950 dark:text-white flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-gold-500 shrink-0" />
              <span>{classTeacherName}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {studentSection !== "—" ? `${studentSection} In-Charge` : "Academic Mentor"}
            </div>
          </div>

          {/* Box 3: Academic Enrollment (Real DB values, no hardcoded Class 11) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Academic Enrollment
            </div>
            <div className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <UserCheck className="w-4 h-4" /> Active Student
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {studentClassLevel !== "—" ? `Class ${studentClassLevel}` : "—"} {studentDiscipline !== "—" ? `• ${studentDiscipline}` : ""} {studentSection !== "—" ? `(${studentSection})` : ""}
            </div>
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
              {(["Assessment", "Send-up", "Pre-Board"] as ExamType[]).map((phase) => (
                <button
                  key={phase}
                  onClick={() => setActiveExamPhase(phase)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeExamPhase === phase
                      ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {phase === "Assessment" ? "Monthly Assessment" : `${phase} Examination`}
                </button>
              ))}
            </div>
          </div>

          {isLoadingMarks ? (
            <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-medical-600" />
              <span>Loading examination records...</span>
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
                    Your ward secured an overall aggregate of <strong>{currentExam.percentage}%</strong> (Grade: {calculateGrade(currentExam.totalObtained, currentExam.totalMax)}).
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

              {/* Subject Breakdown Table displaying Theory, Practical, Total for Science */}
              {showBreakdown && currentExam.subjects && currentExam.subjects.length > 0 && (
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                        <th className="py-2.5 px-4 rounded-l-xl">Subject</th>
                        <th className="py-2.5 px-3 text-center">Theory</th>
                        <th className="py-2.5 px-3 text-center">Practical</th>
                        <th className="py-2.5 px-4 text-center">Total Marks</th>
                        <th className="py-2.5 px-4 text-center">Percentage</th>
                        <th className="py-2.5 px-4 text-center rounded-r-xl">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {currentExam.subjects.map((sub: any, idx: number) => {
                        const isScience = isScienceSubject(sub.name);
                        const total = Number(sub.totalMarks || 100);
                        const obtained = Number(sub.obtainedMarks || 0);
                        const pct = total > 0 ? ((obtained / total) * 100).toFixed(1) : "0";

                        const theoryDisplay =
                          sub.theory !== undefined && sub.theory !== null
                            ? String(sub.theory)
                            : !isScience && sub.obtainedMarks !== undefined && sub.obtainedMarks !== null
                            ? String(sub.obtainedMarks)
                            : "—";

                        const practicalDisplay =
                          isScience && sub.practical !== undefined && sub.practical !== null
                            ? String(sub.practical)
                            : isScience
                            ? "0"
                            : "—";

                        return (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                              {sub.name}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-700 dark:text-slate-300 font-medium">
                              {theoryDisplay}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-700 dark:text-slate-300 font-medium">
                              {practicalDisplay}
                            </td>
                            <td className="py-2.5 px-4 text-center font-bold text-medical-600 dark:text-medical-400">
                              {obtained} / {total}
                            </td>
                            <td className="py-2.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                              {pct}%
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <Badge
                                variant={sub.grade === "A+" || sub.grade === "A" ? "gold" : sub.grade === "F" ? "outline" : "medical"}
                                size="sm"
                              >
                                {sub.grade || calculateGrade(obtained, total)}
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
                No examination results recorded yet for {activeExamPhase === "Assessment" ? "Monthly Assessment" : `${activeExamPhase} Examination`}
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Official marks will be posted here once compiled and submitted by the section class teacher.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
