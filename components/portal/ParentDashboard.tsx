"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StudentProfile } from "@/lib/types";
import { FeeChallanGenerator } from "@/components/tools/FeeChallanGenerator";
import { Users, Calendar, CheckCircle2, FileText, PhoneCall } from "lucide-react";
import { COLLEGE_INFO } from "@/lib/data/constants";

interface ParentDashboardProps {
  student: StudentProfile;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ student }) => {
  const [showChallan, setShowChallan] = useState(false);

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

        {/* Academic Assessment Synopsis */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h5 className="font-bold text-sm text-slate-900 dark:text-white">
            Latest Assessment Breakdown (HSSC Part-I):
          </h5>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Your ward secured <strong>{student.internalExamResults[0].totalObtained} out of {student.internalExamResults[0].totalMax} marks</strong> ({student.internalExamResults[0].percentage}% Aggregate) across major science subjects in the {student.internalExamResults[0].examName}.
          </p>
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
