"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TeacherProfile } from "@/lib/types";
import {
  Lock,
  Unlock,
  Save,
  CheckCircle2,
  User,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { submitStudentMarksAction } from "@/lib/supabase/actions";

interface TeacherDashboardProps {
  teacher: TeacherProfile;
  isMarksEntryOpen: boolean;
}

interface StudentGradeRow {
  studentId: string;
  rollNo: string;
  name: string;
  obtainedMarks: number;
  totalMarks: number;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  isMarksEntryOpen,
}) => {
  const classesList =
    teacher.classesTaught && teacher.classesTaught.length > 0
      ? teacher.classesTaught
      : [
          { group: "Pre-Medical", classLevel: "11th", section: "Section A" },
          { group: "Pre-Engineering", classLevel: "11th", section: "Section A" },
        ];

  const [selectedClassIdx, setSelectedClassIdx] = useState<number>(0);
  const activeClass = classesList[selectedClassIdx] || classesList[0];

  // D5: Two separate exam flows (Assessment vs Send-up / Pre-Board)
  const [examType, setExamType] = useState<"Assessment" | "Send-up">("Assessment");

  const [studentGrades, setStudentGrades] = useState<StudentGradeRow[]>([
    { studentId: "std-1", rollNo: "BCH-2026-0101", name: "Muhammad Hamza Khan", obtainedMarks: 91, totalMarks: 100 },
    { studentId: "std-2", rollNo: "BCH-2026-0102", name: "Zaid Ahmed", obtainedMarks: 84, totalMarks: 100 },
    { studentId: "std-3", rollNo: "BCH-2026-0103", name: "Ayesha Malik", obtainedMarks: 95, totalMarks: 100 },
    { studentId: "std-4", rollNo: "BCH-2026-0104", name: "Bilal Tariq", obtainedMarks: 78, totalMarks: 100 },
    { studentId: "std-5", rollNo: "BCH-2026-0105", name: "Fatima Noor", obtainedMarks: 89, totalMarks: 100 },
  ]);

  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Helper to get session token
  const getAccessToken = async (): Promise<string | null> => {
    if (!isSupabaseConfigured) return "mock-token";
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  // D3: Fetch real students from profiles matching selected class and section
  useEffect(() => {
    async function fetchClassStudents() {
      if (!isSupabaseConfigured || !activeClass) return;
      setIsLoadingStudents(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, roll_number, full_name, discipline, section, class_level")
          .eq("role", "student")
          .eq("discipline", activeClass.group)
          .eq("section", activeClass.section);

        if (!error && data && data.length > 0) {
          // Fetch any existing saved marks for these students
          const studentIds = data.map((s) => s.id);
          const { data: marksData } = await supabase
            .from("internal_exam_results")
            .select("student_id, subjects")
            .in("student_id", studentIds)
            .eq("exam_type", examType);

          const marksMap = new Map<string, number>();
          if (marksData) {
            marksData.forEach((row: any) => {
              if (Array.isArray(row.subjects)) {
                const sub = row.subjects.find((s: any) => s.name.toLowerCase().includes(teacher.subject.toLowerCase()));
                if (sub) marksMap.set(row.student_id, Number(sub.obtainedMarks));
              }
            });
          }

          setStudentGrades(
            data.map((s) => ({
              studentId: s.id,
              rollNo: s.roll_number,
              name: s.full_name,
              obtainedMarks: marksMap.has(s.id) ? marksMap.get(s.id)! : 85,
              totalMarks: 100,
            }))
          );
        } else if (!error && data && data.length === 0) {
          setStudentGrades([]);
        }
      } catch (err) {
        console.warn("Could not fetch section students:", err);
      } finally {
        setIsLoadingStudents(false);
      }
    }
    fetchClassStudents();
  }, [selectedClassIdx, examType, teacher.subject]);

  const calculateGrade = (marks: number, total: number = 100) => {
    const pct = total > 0 ? (marks / total) * 100 : 0;
    if (pct >= 80) return "A-1";
    if (pct >= 70) return "A";
    if (pct >= 60) return "B";
    if (pct >= 50) return "C";
    return "F";
  };

  const handleMarksChange = (index: number, newMarks: number) => {
    const updated = [...studentGrades];
    updated[index].obtainedMarks = Math.min(100, Math.max(0, newMarks));
    setStudentGrades(updated);
    setSaveSuccessMsg("");
  };

  // Save marks to Supabase (D5 & D6)
  const handleSaveGrades = async () => {
    setIsSaving(true);
    setSaveSuccessMsg("");
    try {
      const token = await getAccessToken();
      if (!token) return;

      const examTitle = examType === "Assessment" ? "1st Term Assessment 2026" : "Send-up Examination 2026";
      const examDate = examType === "Assessment" ? "October 2026" : "December 2026";

      for (const row of studentGrades) {
        await submitStudentMarksAction(
          {
            studentId: row.studentId,
            examType,
            examName: examTitle,
            examDate,
            subjects: [
              {
                name: teacher.subject,
                totalMarks: row.totalMarks,
                obtainedMarks: row.obtainedMarks,
                grade: calculateGrade(row.obtainedMarks, row.totalMarks),
              },
            ],
          },
          token
        );
      }

      setSaveSuccessMsg(`Grades saved & submitted for ${examTitle}!`);
      setTimeout(() => setSaveSuccessMsg(""), 4500);
    } catch (err: any) {
      console.error("Error saving marks:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Section aggregate metrics
  const totalStudents = studentGrades.length;
  const avgMarks =
    totalStudents > 0
      ? (studentGrades.reduce((sum, s) => sum + s.obtainedMarks, 0) / totalStudents).toFixed(1)
      : "0";
  const passCount = studentGrades.filter((s) => s.obtainedMarks >= 50).length;

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
              {isMarksEntryOpen
                ? "Academic Assessment Window: ACTIVE & UNLOCKED"
                : "Academic Assessment Window: LOCKED"}
            </div>
            <div className="text-xs">
              {isMarksEntryOpen
                ? "You have full write access to submit, update, and publish evaluation marks for your allocated sections."
                : "Marks entry window is temporarily locked by college administration for gazette compilation."}
            </div>
          </div>
        </div>
      </div>

      {/* D5: Exam Phase Selector (Assessment vs Send-up) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-medical-600 dark:text-medical-400" />
          <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
            Select Evaluation Stage:
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setExamType("Assessment")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              examType === "Assessment"
                ? "bg-medical-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            1st Term Assessment
          </button>
          <button
            onClick={() => setExamType("Send-up")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              examType === "Send-up"
                ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Send-up / Pre-Board Examination
          </button>
        </div>
      </div>

      {/* Allocated Classes List (D4) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            Allocated Sections ({teacher.subject})
          </h4>
          <span className="text-xs text-slate-400">Click section to load student roster</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {classesList.map((cls, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedClassIdx(idx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedClassIdx === idx
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

      {/* Section Summary Stats (D6) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Enrolled In Section</div>
          <div className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            {totalStudents} Students
          </div>
          <div className="text-xs text-medical-600 font-semibold">{activeClass.group} • {activeClass.section}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Average Score</div>
          <div className="font-display font-bold text-2xl text-gold-500">
            {avgMarks} / 100
          </div>
          <div className="text-xs text-slate-500">{examType} Stage</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Pass Rate</div>
          <div className="font-display font-bold text-2xl text-emerald-600">
            {totalStudents > 0 ? `${((passCount / totalStudents) * 100).toFixed(0)}%` : "N/A"}
          </div>
          <div className="text-xs text-slate-500">{passCount} passing (≥50%)</div>
        </div>
      </div>

      {/* Rapid Marks Grading Grid with D6 Drill-Down */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="medical" size="sm">{examType}</Badge>
              <span className="text-xs text-slate-500 font-semibold">
                {activeClass.classLevel} {activeClass.group} ({activeClass.section})
              </span>
            </div>
            <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
              {teacher.subject} — Marks Entry Sheet
            </h4>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccessMsg && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {saveSuccessMsg}
              </span>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={!isMarksEntryOpen || isSaving || studentGrades.length === 0}
              onClick={handleSaveGrades}
              className="gap-1.5"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? "Saving to Supabase..." : "Save & Publish Marks"}</span>
            </Button>
          </div>
        </div>

        {isLoadingStudents ? (
          <div className="text-center py-12 text-slate-500 text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-medical-600" />
            <span>Loading students from Supabase database...</span>
          </div>
        ) : studentGrades.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No students currently enrolled in {activeClass.group} ({activeClass.section}). Create student accounts in Admin panel.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                  <th className="py-3 px-4 rounded-l-xl">Roll Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Total Marks</th>
                  <th className="py-3 px-4">Obtained Marks (0–100)</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {studentGrades.map((row, idx) => {
                  const isExpanded = expandedStudentId === row.studentId;
                  const grade = calculateGrade(row.obtainedMarks, row.totalMarks);

                  return (
                    <React.Fragment key={row.studentId || idx}>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-navy-950 dark:text-white">
                          {row.rollNo}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {row.name}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{row.totalMarks}</td>
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
                          <Badge variant={grade === "F" ? "outline" : "gold"} size="sm">
                            {grade}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setExpandedStudentId(isExpanded ? null : row.studentId)}
                            className="text-slate-500 hover:text-medical-600 transition-colors text-xs font-semibold flex items-center gap-1 ml-auto"
                          >
                            <span>{isExpanded ? "Hide" : "Breakdown"}</span>
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>

                      {/* D6: Expandable Drill-Down Breakdown */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 dark:bg-slate-800/30">
                          <td colSpan={6} className="p-4">
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                              <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                                <span>Academic Evaluation Summary for {row.name}:</span>
                                <Badge variant="outline" size="sm">{examType} Stage</Badge>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                                  <div className="text-[10px] text-slate-400 uppercase">Subject</div>
                                  <div className="font-bold text-slate-900 dark:text-white">{teacher.subject}</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                                  <div className="text-[10px] text-slate-400 uppercase">Obtained / Max</div>
                                  <div className="font-bold text-medical-600">{row.obtainedMarks} / {row.totalMarks}</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                                  <div className="text-[10px] text-slate-400 uppercase">Percentage</div>
                                  <div className="font-bold text-gold-500">
                                    {((row.obtainedMarks / row.totalMarks) * 100).toFixed(1)}%
                                  </div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                                  <div className="text-[10px] text-slate-400 uppercase">Evaluation Status</div>
                                  <div className="font-bold text-emerald-600">
                                    {row.obtainedMarks >= 50 ? "Qualified" : "Needs Academic Support"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
