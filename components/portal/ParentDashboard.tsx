"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StudentProfile } from "@/lib/types";
import { FeeChallanGenerator } from "@/components/tools/FeeChallanGenerator";
import {
  Users,
  Calendar,
  CheckCircle2,
  FileText,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";
import { COLLEGE_INFO } from "@/lib/data/constants";

interface ParentDashboardProps {
  student: StudentProfile;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ student }) => {
  const [showChallan, setShowChallan] = useState(false);
  const [activeExamPhase, setActiveExamPhase] = useState<"Assessment" | "Send-up">("Assessment");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const examData =
    activeExamPhase === "Assessment"
      ? {
          title: "1st Term Assessment 2026",
          date: "October 2026",
          totalObtained: 479,
          totalMax: 550,
          percentage: 87.09,
          grade: "A-1",
          subjects: [
            { name: "Biology", totalMarks: 100, obtainedMarks: 91, grade: "A-1" },
            { name: "Chemistry", totalMarks: 100, obtainedMarks: 88, grade: "A-1" },
            { name: "Physics", totalMarks: 100, obtainedMarks: 86, grade: "A-1" },
            { name: "English Compulsory", totalMarks: 100, obtainedMarks: 82, grade: "A" },
            { name: "Urdu Compulsory", totalMarks: 100, obtainedMarks: 85, grade: "A-1" },
            { name: "Islamic Education", totalMarks: 50, obtainedMarks: 47, grade: "A-1" },
          ],
        }
      : {
          title: "Send-up / Pre-Board Examination 2026",
          date: "December 2026",
          totalObtained: 494,
          totalMax: 550,
          percentage: 89.82,
          grade: "A-1",
          subjects: [
            { name: "Biology", totalMarks: 100, obtainedMarks: 94, grade: "A-1" },
            { name: "Chemistry", totalMarks: 100, obtainedMarks: 90, grade: "A-1" },
            { name: "Physics", totalMarks: 100, obtainedMarks: 89, grade: "A-1" },
            { name: "English Compulsory", totalMarks: 100, obtainedMarks: 85, grade: "A-1" },
            { name: "Urdu Compulsory", totalMarks: 100, obtainedMarks: 88, grade: "A-1" },
            { name: "Islamic Education", totalMarks: 50, obtainedMarks: 48, grade: "A-1" },
          ],
        };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="gold" size="sm">Parent Academic Portal</Badge>
            <h4 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-2">
              Progress Overview for {student.name}
            </h4>
            <p className="text-xs text-slate-500">
              College ID: <strong className="text-navy-950 dark:text-white">{student.id}</strong> • Class: {student.classLevel} {student.group} ({student.section})
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChallan(!showChallan)}
            className="gap-1.5 text-xs"
          >
            <FileText className="w-4 h-4 text-gold-500" />
            <span>{showChallan ? "Hide Fee Slip" : "Generate Fee Challan"}</span>
          </Button>
        </div>

        {/* 3 Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Upcoming Parent-Teacher Meeting</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{student.ptmTiming}</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Attendance Percentage</div>
            <div className="text-sm font-bold text-emerald-600">{student.attendancePercentage}% Verified Present</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Fee Account Status</div>
            <div className="text-sm font-bold text-emerald-600">All Monthly Dues Cleared</div>
          </div>
        </div>

        {/* D5 & D6: Academic Assessment Synopsis with Phase Selection & Drill-Down */}
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
                1st Term Assessment
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

          {/* D6: Total Marks Summary First */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-medium">
                {examData.title} ({examData.date})
              </div>
              <div className="font-display font-bold text-2xl text-navy-950 dark:text-white">
                {examData.totalObtained} / {examData.totalMax} Total Marks
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Your ward secured an overall aggregate of <strong>{examData.percentage}%</strong> (Grade {examData.grade}).
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="gap-1.5 text-xs self-end sm:self-center"
            >
              <span>{showBreakdown ? "Hide Subjects" : "View Subject Marks"}</span>
              {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </Button>
          </div>

          {/* D6: Drill-Down Subjects Table */}
          {showBreakdown && (
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    <th className="py-2.5 px-4">Subject</th>
                    <th className="py-2.5 px-4">Total Marks</th>
                    <th className="py-2.5 px-4">Obtained</th>
                    <th className="py-2.5 px-4">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {examData.subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">{sub.name}</td>
                      <td className="py-2.5 px-4 text-slate-500">{sub.totalMarks}</td>
                      <td className="py-2.5 px-4 font-bold text-medical-600 dark:text-medical-400">{sub.obtainedMarks}</td>
                      <td className="py-2.5 px-4">
                        <Badge variant="gold" size="sm">{sub.grade}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* College Communication Contact */}
        <div className="p-4 rounded-2xl bg-medical-50/60 dark:bg-medical-950/30 border border-medical-200 dark:border-medical-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-medical-800 dark:text-medical-300">
            <PhoneCall className="w-4 h-4 text-medical-600 dark:text-medical-400 flex-shrink-0" />
            <span>Direct Student Affairs Desk Helpline: <strong>{COLLEGE_INFO.phonePrimary}</strong></span>
          </div>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Timings: Mon–Fri 08:30 AM – 02:00 PM</span>
        </div>
      </div>

      {showChallan && (
        <FeeChallanGenerator
          initialStudentName={student.name}
          initialRollNo={student.id}
          initialGroup={student.group}
          initialCategory={student.category}
        />
      )}
    </div>
  );
};
