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
import { saveMarksAction } from "@/lib/supabase/actions";

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
      : [];

  const [selectedClassIdx, setSelectedClassIdx] = useState<number>(0);
  const activeClass = classesList[selectedClassIdx] || classesList[0];

  // Two separate exam flows (Assessment vs Send-up)
  const [examType, setExamType] = useState<"Assessment" | "Send-up">("Assessment");

  const [studentGrades, setStudentGrades] = useState<StudentGradeRow[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [saveErrorMsg, setSaveErrorMsg] = useState("");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Helper to get session token
  const getAccessToken = async (): Promise<string | null> => {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  // Fetch real students from profiles matching selected class and section
  useEffect(() => {
    async function fetchClassStudents() {
      if (!isSupabaseConfigured || !activeClass) {
        setStudentGrades([]);
        return;
      }
      setIsLoadingStudents(true);
      try {
        let query = supabase
          .from("profiles")
          .select("id, roll_number, full_name, discipline, section, class_level")
          .eq("role", "student")
          .eq("discipline", activeClass.group)
          .eq("section", activeClass.section);

        if (activeClass.classLevel) {
          query = query.eq("class_level", activeClass.classLevel);
        }

        const { data, error } = await query.order("roll_number", { ascending: true });

        if (!error && data && data.length > 0) {
          // Fetch any existing saved marks for these students
          const studentIds = data.map((s) => s.id);
          const { data: marksData } = await supabase
            .from("internal_exam_results")
            .select("student_id, subjects")
            .in("student_id", studentIds)
            .eq("exam_type", examType);

          const marksMap = new Map<string, { obtained: number; total: number }>();
          if (marksData) {
            marksData.forEach((row: any) => {
              if (Array.isArray(row.subjects) && teacher.subject) {
                const sub = row.subjects.find(
                  (s: any) => s.name?.toLowerCase() === teacher.subject.toLowerCase()
                );
                if (sub) {
                  marksMap.set(row.student_id, {
                    obtained: Number(sub.obtainedMarks || 0),
                    total: Number(sub.totalMarks || 100),
                  });
                }
              }
            });
          }

          setStudentGrades(
            data.map((s) => {
              const existing = marksMap.get(s.id);
              return {
                studentId: s.id,
                rollNo: s.roll_number,
                name: s.full_name,
                obtainedMarks: existing ? existing.obtained : 0,
                totalMarks: existing ? existing.total : 100,
              };
            })
          );
        } else {
          setStudentGrades([]);
        }
      } catch (err) {
        console.warn("Could not fetch section students:", err);
        setStudentGrades([]);
      } finally {
        setIsLoadingStudents(false);
      }
    }

    fetchClassStudents();
  }, [selectedClassIdx, examType, teacher.subject, activeClass?.group, activeClass?.section, activeClass?.classLevel]);

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
    const total = updated[index].totalMarks || 100;
    updated[index].obtainedMarks = Math.min(total, Math.max(0, newMarks));
    setStudentGrades(updated);
    setSaveSuccessMsg("");
    setSaveErrorMsg("");
  };

  // Save marks to Supabase using multi-teacher safe saveMarksAction
  const handleSaveGrades = async () => {
    if (!isMarksEntryOpen) {
      setSaveErrorMsg("Marks entry is currently locked by college administration.");
      return;
    }

    if (!teacher.subject) {
      setSaveErrorMsg("No teaching subject assigned to your account. Please contact an administrator.");
      return;
    }

    setIsSaving(true);
    setSaveSuccessMsg("");
    setSaveErrorMsg("");
    try {
      const token = await getAccessToken();
      if (!token) {
        setSaveErrorMsg("Authentication session expired. Please sign in again.");
        return;
      }

      const res = await saveMarksAction(
        {
          examType,
          subject: teacher.subject,
          entries: studentGrades.map((row) => ({
            studentId: row.studentId,
            obtainedMarks: row.obtainedMarks,
            totalMarks: row.totalMarks,
          })),
        },
        token
      );

      if (res.success) {
        setSaveSuccessMsg(`Marks for ${teacher.subject} saved successfully!`);
        setTimeout(() => setSaveSuccessMsg(""), 5000);
      } else {
        setSaveErrorMsg(res.message || "Failed to save marks.");
      }
    } catch (err: any) {
      setSaveErrorMsg(err.message || "An unexpected error occurred while saving marks.");
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
            <div className="text-xs mt-0.5">
              {isMarksEntryOpen
                ? `You have write access for your designated subject (${teacher.subject || "No subject set"}).`
                : "Marks entry window is temporarily locked by college administration for compilation."}
            </div>
          </div>
        </div>
      </div>

      {!teacher.subject && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            <strong>No Teaching Subject Assigned:</strong> Your faculty profile does not have a designated subject. Contact administration to assign your subject so you can record marks.
          </span>
        </div>
      )}

      {/* Exam Phase Selector (Assessment vs Send-up) */}
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
            Monthly Assessment
          </button>
          <button
            onClick={() => setExamType("Send-up")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              examType === "Send-up"
                ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Send-up Examination
          </button>
        </div>
      </div>

      {/* Allocated Classes List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            Allocated Sections {teacher.subject ? `(${teacher.subject})` : ""}
          </h4>
          <span className="text-xs text-slate-400">Click section to load student roster</span>
        </div>

        {classesList.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            No sections currently assigned to your account. Contact an administrator to allocate your teaching sections.
          </div>
        ) : (
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
        )}
      </div>

      {activeClass && (
        <>
          {/* Section Summary Stats */}
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

          {/* Marks Grading Grid */}
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
                  {teacher.subject || "Subject"} — Marks Entry Sheet
                </h4>
              </div>

              <div className="flex items-center gap-3">
                {saveSuccessMsg && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {saveSuccessMsg}
                  </span>
                )}
                {saveErrorMsg && (
                  <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {saveErrorMsg}
                  </span>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!isMarksEntryOpen || isSaving || studentGrades.length === 0 || !teacher.subject}
                  onClick={handleSaveGrades}
                  className="gap-1.5"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isSaving ? "Saving..." : "Save Marks"}</span>
                </Button>
              </div>
            </div>

            {isLoadingStudents ? (
              <div className="text-center py-12 text-slate-500 text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-medical-600" />
                <span>Loading student roster...</span>
              </div>
            ) : studentGrades.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                No students enrolled in {activeClass.group} ({activeClass.section}). Students will appear here once accounts are created.
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
                                max={row.totalMarks || 100}
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
                                <span>{isExpanded ? "Hide" : "Details"}</span>
                                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              </button>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className="bg-slate-50/70 dark:bg-slate-800/30">
                              <td colSpan={6} className="p-4">
                                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <span>Summary for {row.name}:</span>
                                    <Badge variant="outline" size="sm">{examType}</Badge>
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                                      <div className="text-[10px] text-slate-400 uppercase">Subject</div>
                                      <div className="font-bold text-slate-900 dark:text-white">{teacher.subject}</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                                      <div className="text-[10px] text-slate-400 uppercase">Marks</div>
                                      <div className="font-bold text-medical-600">{row.obtainedMarks} / {row.totalMarks}</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                                      <div className="text-[10px] text-slate-400 uppercase">Percentage</div>
                                      <div className="font-bold text-gold-500">
                                        {row.totalMarks > 0 ? ((row.obtainedMarks / row.totalMarks) * 100).toFixed(1) : 0}%
                                      </div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                                      <div className="text-[10px] text-slate-400 uppercase">Status</div>
                                      <div className="font-bold text-emerald-600">
                                        {row.obtainedMarks >= 50 ? "Passing" : "Below Passing Standard"}
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
        </>
      )}
    </div>
  );
};
