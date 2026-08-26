"use client";

import React, { useState } from "react";
import { Calculator, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const MeritCalculator: React.FC = () => {
  const [matricTotal, setMatricTotal] = useState<number>(1100);
  const [matricObtained, setMatricObtained] = useState<number>(940);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("pre-medical");

  const percentage = matricTotal > 0 ? (matricObtained / matricTotal) * 100 : 0;
  const roundedPercentage = Number(percentage.toFixed(2));

  // Eligibility standards
  const requirements: Record<string, { minMarks: number; title: string; seats: number; recommendation: string }> = {
    "pre-medical": {
      minMarks: 70,
      title: "F.Sc Pre-Medical",
      seats: 50,
      recommendation: "Strong biology & chemistry foundation with MDCAT preparation cohort.",
    },
    "pre-engineering": {
      minMarks: 65,
      title: "F.Sc Pre-Engineering",
      seats: 100,
      recommendation: "Calculus & physics focus aimed at top engineering universities (NUST, GIKI, NED).",
    },
    "computer-science": {
      minMarks: 60,
      title: "ICS Computer Science",
      seats: 200,
      recommendation: "High-tech curriculum with Python, databases, algorithms, and logic mathematics.",
    },
  };

  const currentReq = requirements[selectedDiscipline];
  const isEligible = roundedPercentage >= currentReq.minMarks;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <Badge variant="gold" size="sm" className="gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Interactive Tool</span>
          </Badge>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
            FBISE Class 11 Merit & Eligibility Calculator
          </h3>
        </div>
        <div className="text-xs text-slate-400">
          Session 2026–2027 Admissions
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Academic Discipline
            </label>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
            >
              <option value="pre-medical">F.Sc Pre-Medical (Min. 70%)</option>
              <option value="pre-engineering">F.Sc Pre-Engineering (Min. 65%)</option>
              <option value="computer-science">ICS Computer Science (Min. 60%)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Total Matric Marks
              </label>
              <input
                type="number"
                min="500"
                max="1200"
                value={matricTotal}
                onChange={(e) => setMatricTotal(Number(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Obtained Marks
              </label>
              <input
                type="number"
                min="0"
                max={matricTotal}
                value={matricObtained}
                onChange={(e) => setMatricObtained(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Calculation Result Card */}
        <div
          className={`p-6 rounded-3xl border transition-all ${
            isEligible
              ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
              : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Calculated Aggregate
            </span>
            {isEligible ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Eligible for Merit List
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-navy-950 font-bold text-xs flex items-center gap-1 shadow-sm">
                <AlertCircle className="w-3.5 h-3.5" /> Below Min. Cutoff ({currentReq.minMarks}%)
              </span>
            )}
          </div>

          <div className="font-display font-black text-4xl sm:text-5xl text-navy-950 dark:text-white mt-3">
            {roundedPercentage}%
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 mt-2">
            Target: <strong>{currentReq.title}</strong> ({currentReq.seats} Class 11 Seats Available).
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
            {currentReq.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
};
