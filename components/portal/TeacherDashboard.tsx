"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TeacherProfile } from "@/lib/types";
import {
  Lock,
  Unlock,
  Save,
  CheckCircle2,
  BookOpen,
  Loader2,
  AlertCircle,
  Eye,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  getClassTeacherRosterAction,
  saveClassMarksAction,
  getTeacherSectionMarksAction,
  ClassMarksStudentEntry,
} from "@/lib/supabase/actions";
import {
  ExamType,
  EXAM_SUBJECTS,
  SUBJECT_MARKS,
  calculateGrade,
  SubjectMarksConfig,
} from "@/lib/data/constants";

interface TeacherDashboardProps {
  teacher: TeacherProfile;
  isMarksEntryOpen: boolean;
}

interface StudentMarksRow {
  id: string;
  rollNumber: string;
  fullName: string;
  // subject -> { theory: string, practical: string }
  subjects: Record<string, { theory: string; practical: string }>;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  isMarksEntryOpen,
}) => {
  const isClassTeacher = Boolean(teacher.isClassTeacher);
  const classTeacherGroup = (teacher.classTeacherGroup as "Pre-Medical" | "Pre-Engineering" | "Computer Science") || "Pre-Medical";
  const classTeacherLevel = (teacher.classTeacherLevel as "11th" | "12th") || "11th";
  const classTeacherSection = teacher.classTeacherSection || "Section A";

  // Exam type selector (Assessment, Send-up, Pre-Board)
  const [examType, setExamType] = useState<ExamType>("Send-up");

  // State for Class Teacher Write Mode
  const [roster, setRoster] = useState<StudentMarksRow[]>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);
  const [isSavingMarks, setIsSavingMarks] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [saveErrorMsg, setSaveErrorMsg] = useState("");

  // State for Non-Class Teacher Read-Only Mode
  const classesTaught = teacher.classesTaught || [];
  const [selectedTaughtIdx, setSelectedTaughtIdx] = useState(0);
  const activeTaughtClass = classesTaught[selectedTaughtIdx] || classesTaught[0];
  const [readOnlyStudents, setReadOnlyStudents] = useState<any[]>([]);
  const [isLoadingReadOnly, setIsLoadingReadOnly] = useState(false);

  // Helper to retrieve auth session token
  const getAccessToken = async (): Promise<string | null> => {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  // Determine the 7 subjects for this class level and group
  const subjectsForClass = useMemo(() => {
    if (!isClassTeacher) return [];
    const groupSubjects = EXAM_SUBJECTS[classTeacherGroup];
    if (!groupSubjects) return [];
    return groupSubjects[classTeacherLevel] || [];
  }, [isClassTeacher, classTeacherGroup, classTeacherLevel]);

  // Load Class Teacher Roster when examType or class changes
  useEffect(() => {
    if (!isClassTeacher) return;

    async function loadRoster() {
      setIsLoadingRoster(true);
      setSaveSuccessMsg("");
      setSaveErrorMsg("");
      try {
        const token = await getAccessToken();
        if (!token) return;

        const res = await getClassTeacherRosterAction(token, examType);
        if (res.success && res.students) {
          const rows: StudentMarksRow[] = res.students.map((st: any) => {
            const subjectMap: Record<string, { theory: string; practical: string }> = {};

            subjectsForClass.forEach((subName) => {
              const existingSub = Array.isArray(st.examResult?.subjects)
                ? st.examResult.subjects.find((s: any) => s.name?.toLowerCase() === subName.toLowerCase())
                : null;

              const theoryVal =
                existingSub?.theory !== undefined && existingSub?.theory !== null
                  ? String(existingSub.theory)
                  : existingSub?.obtainedMarks !== undefined && existingSub?.obtainedMarks !== null && !isScienceSubject(subName)
                  ? String(existingSub.obtainedMarks)
                  : "";

              const practicalVal =
                existingSub?.practical !== undefined && existingSub?.practical !== null
                  ? String(existingSub.practical)
                  : "";

              subjectMap[subName] = {
                theory: theoryVal,
                practical: practicalVal,
              };
            });

            return {
              id: st.id,
              rollNumber: st.rollNumber,
              fullName: st.fullName,
              subjects: subjectMap,
            };
          });

          setRoster(rows);
        } else {
          setSaveErrorMsg(res.message || "Failed to load class roster.");
        }
      } catch (err: any) {
        setSaveErrorMsg(err.message || "Could not fetch roster.");
      } finally {
        setIsLoadingRoster(false);
      }
    }

    loadRoster();
  }, [isClassTeacher, examType, classTeacherGroup, classTeacherLevel, classTeacherSection, subjectsForClass]);

  // Load Read-Only Section marks for Non-Class Teacher
  useEffect(() => {
    if (isClassTeacher || !activeTaughtClass) return;

    async function loadReadOnlyMarks() {
      setIsLoadingReadOnly(true);
      try {
        const token = await getAccessToken();
        if (!token) return;

        const res = await getTeacherSectionMarksAction(
          activeTaughtClass.group,
          activeTaughtClass.classLevel,
          activeTaughtClass.section,
          examType,
          token
        );

        if (res.success && res.students) {
          setReadOnlyStudents(res.students);
        } else {
          setReadOnlyStudents([]);
        }
      } catch (err) {
        console.warn("Failed to load read-only section marks:", err);
        setReadOnlyStudents([]);
      } finally {
        setIsLoadingReadOnly(false);
      }
    }

    loadReadOnlyMarks();
  }, [isClassTeacher, activeTaughtClass, examType]);

  // Helper check for Science subjects requiring split theory + practical inputs
  function isScienceSubject(subjectName: string): boolean {
    const config = SUBJECT_MARKS[subjectName];
    return Boolean(config && config.practical > 0);
  }

  // Handle input change in Class Teacher marks grid
  const handleMarkChange = (
    studentIdx: number,
    subjectName: string,
    field: "theory" | "practical",
    value: string
  ) => {
    setSaveSuccessMsg("");
    setSaveErrorMsg("");

    setRoster((prev) => {
      const updated = [...prev];
      const student = { ...updated[studentIdx] };
      const currentSub = student.subjects[subjectName] || { theory: "", practical: "" };

      student.subjects = {
        ...student.subjects,
        [subjectName]: {
          ...currentSub,
          [field]: value,
        },
      };

      updated[studentIdx] = student;
      return updated;
    });
  };

  // Compute total and status for a student row
  const getStudentRowStatus = (row: StudentMarksRow) => {
    if (examType === "Assessment") {
      return { totalObtained: "—", totalMax: "—", percentage: "—", grade: "—", status: "Unconfigured" };
    }

    let totalObt = 0;
    let totalMax = 0;
    let hasAnyEntry = false;
    let hasIncomplete = false;

    for (const subName of subjectsForClass) {
      const config = SUBJECT_MARKS[subName];
      if (!config) continue; // Skip THQ / unconfigured

      const marks = row.subjects[subName] || { theory: "", practical: "" };
      const isScience = config.practical > 0;

      const theoryStr = marks.theory.trim();
      const practicalStr = marks.practical.trim();

      if (isScience) {
        const hasT = theoryStr !== "";
        const hasP = practicalStr !== "";

        if (hasT && hasP) {
          hasAnyEntry = true;
          totalObt += Number(theoryStr) + Number(practicalStr);
          totalMax += config.theory + config.practical;
        } else if (hasT || hasP) {
          hasAnyEntry = true;
          hasIncomplete = true;
        }
      } else {
        if (theoryStr !== "") {
          hasAnyEntry = true;
          totalObt += Number(theoryStr);
          totalMax += config.theory;
        }
      }
    }

    if (!hasAnyEntry) {
      return { totalObtained: "—", totalMax: "—", percentage: "—", grade: "—", status: "Empty" };
    }

    if (hasIncomplete) {
      return { totalObtained: "—", totalMax: "—", percentage: "—", grade: "Incomplete", status: "Incomplete" };
    }

    const pct = totalMax > 0 ? (totalObt / totalMax) * 100 : 0;
    const grade = calculateGrade(totalObt, totalMax);

    return {
      totalObtained: totalObt,
      totalMax,
      percentage: `${pct.toFixed(1)}%`,
      grade,
      status: "Complete",
    };
  };

  // Save Class Marks Action handler
  const handleSaveMarks = async () => {
    if (!isMarksEntryOpen) {
      setSaveErrorMsg("Marks entry is currently locked by administration.");
      return;
    }

    if (examType === "Assessment") {
      setSaveErrorMsg("Assessment maximum marks are not configured yet. Marks cannot be saved.");
      return;
    }

    setIsSavingMarks(true);
    setSaveSuccessMsg("");
    setSaveErrorMsg("");

    try {
      const token = await getAccessToken();
      if (!token) {
        setSaveErrorMsg("Session expired. Please sign in again.");
        return;
      }

      // Build payload entries
      const entries: ClassMarksStudentEntry[] = roster.map((student) => {
        const studentSubjects: Record<string, { theory?: number | null; practical?: number | null }> = {};

        subjectsForClass.forEach((subName) => {
          const config = SUBJECT_MARKS[subName];
          if (!config) return; // Do not send unconfigured

          const marks = student.subjects[subName] || { theory: "", practical: "" };
          const theoryStr = marks.theory.trim();
          const practicalStr = marks.practical.trim();

          const hasTheory = theoryStr !== "";
          const hasPractical = practicalStr !== "";

          if (hasTheory || hasPractical) {
            studentSubjects[subName] = {
              theory: hasTheory ? Number(theoryStr) : null,
              practical: hasPractical ? Number(practicalStr) : null,
            };
          }
        });

        return {
          studentId: student.id,
          subjects: studentSubjects,
        };
      });

      const res = await saveClassMarksAction(
        {
          examType,
          entries,
        },
        token
      );

      if (res.success) {
        setSaveSuccessMsg(res.message || "Class marks saved successfully!");
        setTimeout(() => setSaveSuccessMsg(""), 5000);
      } else {
        setSaveErrorMsg(res.message || "Failed to save class marks.");
      }
    } catch (err: any) {
      setSaveErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSavingMarks(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Role & Assignment Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isClassTeacher ? (
              <Badge variant="gold" size="sm" className="gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Class Teacher</span>
              </Badge>
            ) : (
              <Badge variant="outline" size="sm" className="gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Subject Faculty (Read-Only)</span>
              </Badge>
            )}
            <span className="text-xs text-slate-500 font-semibold">
              Faculty: {teacher.name}
            </span>
          </div>

          <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
            {isClassTeacher
              ? `Class Teacher: ${classTeacherGroup} • ${classTeacherLevel} • ${classTeacherSection}`
              : `Faculty Portal: ${teacher.subject || "All Subjects"}`}
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {isClassTeacher
              ? `You are designated as the official Class Teacher for ${classTeacherLevel} ${classTeacherGroup} (${classTeacherSection}). You are responsible for compiling all 7 curriculum examination marks for this section.`
              : "You are not designated as a section class teacher. Class teachers record and submit all 7 subject exam results. You have read-only access to view exam marks for your assigned teaching sections."}
          </p>
        </div>

        {/* Marks Entry Gate Indicator */}
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-3 shrink-0 ${
            isMarksEntryOpen
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
              : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
          }`}
        >
          {isMarksEntryOpen ? (
            <Unlock className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <div>
            <div className="font-bold">
              {isMarksEntryOpen ? "Marks Window: OPEN" : "Marks Window: LOCKED"}
            </div>
            <div className="text-[11px] opacity-80">
              {isMarksEntryOpen ? "Submissions accepted" : "Read-only compilation"}
            </div>
          </div>
        </div>
      </div>

      {/* Exam Type Selector Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-medical-600 dark:text-medical-400" />
          <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
            Select Examination Cycle:
          </span>
        </div>

        <div className="flex gap-2">
          {(["Assessment", "Send-up", "Pre-Board"] as ExamType[]).map((type) => (
            <button
              key={type}
              onClick={() => setExamType(type)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                examType === type
                  ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {type === "Assessment" ? "Monthly Assessment" : `${type} Examination`}
            </button>
          ))}
        </div>
      </div>

      {/* Assessment Locked Notice Banner */}
      {examType === "Assessment" && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong>Maximum marks not configured yet:</strong> Evaluation criteria and maximum marks for Monthly Assessment have not been established by college administration. Marks entry is disabled for this cycle.
          </div>
        </div>
      )}

      {/* =========================================================================
         VIEW A: CLASS TEACHER WRITE & SUBMIT VIEW
         ========================================================================= */}
      {isClassTeacher ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="medical" size="sm">
                  {classTeacherLevel} {classTeacherGroup}
                </Badge>
                <Badge variant="outline" size="sm">
                  {classTeacherSection}
                </Badge>
              </div>
              <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
                Official Marks Compilation Sheet — {examType}
              </h4>
              <p className="text-xs text-slate-500">
                Enter theory and practical marks for each subject. Untouched cells remain unrecorded (not 0).
              </p>
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
                disabled={
                  !isMarksEntryOpen ||
                  isSavingMarks ||
                  roster.length === 0 ||
                  examType === "Assessment"
                }
                onClick={handleSaveMarks}
                className="gap-1.5"
              >
                {isSavingMarks ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSavingMarks ? "Saving..." : "Save Class Marks"}</span>
              </Button>
            </div>
          </div>

          {isLoadingRoster ? (
            <div className="text-center py-16 text-slate-500 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-medical-600" />
              <span>Loading student roster for {classTeacherSection}...</span>
            </div>
          ) : roster.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              No students enrolled in {classTeacherGroup} ({classTeacherSection}). Students will appear once their accounts are provisioned by administration.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    <th className="py-3 px-3 rounded-l-xl sticky left-0 bg-slate-100 dark:bg-slate-800 z-10 min-w-[90px]">
                      Roll No
                    </th>
                    <th className="py-3 px-3 min-w-[130px]">Student Name</th>
                    {subjectsForClass.map((subName) => {
                      const config = SUBJECT_MARKS[subName];
                      const isScience = isScienceSubject(subName);

                      return (
                        <th key={subName} className="py-3 px-2 text-center min-w-[110px]">
                          <div>{subName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {!config
                              ? "Locked (Config Pending)"
                              : isScience
                              ? `T:${config.theory} / P:${config.practical}`
                              : `Max: ${config.theory}`}
                          </div>
                        </th>
                      );
                    })}
                    <th className="py-3 px-3 text-center min-w-[70px]">Total</th>
                    <th className="py-3 px-3 text-center min-w-[65px]">Pct</th>
                    <th className="py-3 px-3 text-center rounded-r-xl min-w-[65px]">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {roster.map((student, sIdx) => {
                    const rowStatus = getStudentRowStatus(student);

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-3 font-mono font-bold text-navy-950 dark:text-white sticky left-0 bg-white dark:bg-slate-900 z-10">
                          {student.rollNumber}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {student.fullName}
                        </td>

                        {/* 7 Curriculum Subjects */}
                        {subjectsForClass.map((subName) => {
                          const config = SUBJECT_MARKS[subName];
                          const isScience = isScienceSubject(subName);
                          const isLocked = !config || examType === "Assessment" || !isMarksEntryOpen;

                          const val = student.subjects[subName] || { theory: "", practical: "" };

                          if (!config) {
                            return (
                              <td key={subName} className="py-3 px-2 text-center">
                                <span className="inline-block px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 font-medium">
                                  Not configured
                                </span>
                              </td>
                            );
                          }

                          if (isScience) {
                            return (
                              <td key={subName} className="py-2 px-1 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    max={config.theory}
                                    placeholder="T"
                                    disabled={isLocked}
                                    value={val.theory}
                                    onChange={(e) =>
                                      handleMarkChange(sIdx, subName, "theory", e.target.value)
                                    }
                                    className="w-12 px-1.5 py-1 text-center rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-medical-500 disabled:opacity-50"
                                    title={`Theory (0–${config.theory})`}
                                  />
                                  <span className="text-slate-300 text-xs">+</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max={config.practical}
                                    placeholder="P"
                                    disabled={isLocked}
                                    value={val.practical}
                                    onChange={(e) =>
                                      handleMarkChange(sIdx, subName, "practical", e.target.value)
                                    }
                                    className="w-12 px-1.5 py-1 text-center rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-medical-500 disabled:opacity-50"
                                    title={`Practical (0–${config.practical})`}
                                  />
                                </div>
                              </td>
                            );
                          }

                          return (
                            <td key={subName} className="py-2 px-1 text-center">
                              <input
                                type="number"
                                min="0"
                                max={config.theory}
                                disabled={isLocked}
                                value={val.theory}
                                onChange={(e) =>
                                  handleMarkChange(sIdx, subName, "theory", e.target.value)
                                }
                                className="w-16 px-1.5 py-1 text-center rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-medical-500 disabled:opacity-50"
                                title={`Marks (0–${config.theory})`}
                              />
                            </td>
                          );
                        })}

                        {/* Calculated Row Summary */}
                        <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                          {rowStatus.totalObtained !== "—"
                            ? `${rowStatus.totalObtained} / ${rowStatus.totalMax}`
                            : "—"}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                          {rowStatus.percentage}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {rowStatus.grade === "Incomplete" ? (
                            <span className="text-[10px] text-amber-600 font-bold">Incomplete</span>
                          ) : rowStatus.grade !== "—" ? (
                            <Badge
                              variant={rowStatus.grade === "F" ? "outline" : "gold"}
                              size="sm"
                            >
                              {rowStatus.grade}
                            </Badge>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
           VIEW B: NON-CLASS TEACHER READ-ONLY SECTION VIEW
           ========================================================================= */
        <div className="space-y-6">
          {/* Section Selector for Allocated Classes */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Allocated Teaching Sections
              </h4>
              <span className="text-xs text-slate-400">Read-only examination view</span>
            </div>

            {classesTaught.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                No teaching sections allocated to your account yet. Contact college administration.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {classesTaught.map((cls, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTaughtIdx(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedTaughtIdx === idx
                        ? "bg-medical-50 dark:bg-medical-950/40 border-medical-500 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-medical-400"
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {cls.classLevel} {cls.group}
                    </div>
                    <div className="text-xs text-medical-600 dark:text-medical-400 font-semibold mt-0.5">
                      {cls.section}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section Marks Display */}
          {activeTaughtClass && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    {activeTaughtClass.classLevel} {activeTaughtClass.group} ({activeTaughtClass.section}) — {examType}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Compiled examination results submitted by the section class teacher.
                  </p>
                </div>
                <Badge variant="outline" size="sm">Read-Only View</Badge>
              </div>

              {isLoadingReadOnly ? (
                <div className="text-center py-12 text-slate-500 text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-medical-600" />
                  <span>Loading section results...</span>
                </div>
              ) : readOnlyStudents.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  No examination marks recorded for this section yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                        <th className="py-3 px-4 rounded-l-xl">Roll No</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4 text-center">Total Obtained</th>
                        <th className="py-3 px-4 text-center">Percentage</th>
                        <th className="py-3 px-4 text-center rounded-r-xl">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {readOnlyStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono font-bold text-navy-950 dark:text-white">
                            {st.rollNumber}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                            {st.fullName}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                            {st.examResult?.totalObtained !== undefined && st.examResult?.totalMax
                              ? `${st.examResult.totalObtained} / ${st.examResult.totalMax}`
                              : "—"}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-medical-600">
                            {st.examResult?.percentage ? `${st.examResult.percentage}%` : "—"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {st.examResult?.percentage ? (
                              <Badge
                                variant={
                                  calculateGrade(st.examResult.totalObtained, st.examResult.totalMax) === "F"
                                    ? "outline"
                                    : "gold"
                                }
                                size="sm"
                              >
                                {calculateGrade(st.examResult.totalObtained, st.examResult.totalMax)}
                              </Badge>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
