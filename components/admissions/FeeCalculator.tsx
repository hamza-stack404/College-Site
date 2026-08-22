"use client";

import React, { useState } from "react";
import { feeStructureData } from "@/lib/data/admissions";
import { formatCurrency } from "@/lib/utils";
import { Calculator, Sparkles, Check, Download, Info } from "lucide-react";
import { Button } from "../ui/Button";

export const FeeCalculator: React.FC = () => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    feeStructureData[0].programId
  );
  const [scholarshipPercent, setScholarshipPercent] = useState<number>(0);
  const [includeHostel, setIncludeHostel] = useState<boolean>(false);
  const [includeTransport, setIncludeTransport] = useState<boolean>(false);

  const currentProgramFee =
    feeStructureData.find((p) => p.programId === selectedProgramId) ||
    feeStructureData[0];

  const hostelPerSemester = 45000;
  const transportPerSemester = 22000;

  const baseTuition = currentProgramFee.tuitionPerSemester;
  const scholarshipDiscount = (baseTuition * scholarshipPercent) / 100;
  const netTuition = baseTuition - scholarshipDiscount;

  const semesterTotal =
    netTuition +
    currentProgramFee.examinationFeePerSemester +
    (includeHostel ? hostelPerSemester : 0) +
    (includeTransport ? transportPerSemester : 0);

  const firstSemesterTotalWithAdmission =
    semesterTotal +
    currentProgramFee.admissionFee +
    currentProgramFee.labSecurityOneTime;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl" id="fee-calculator">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
        <div className="p-3 rounded-2xl bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
            Interactive Fee & Scholarship Estimator
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Calculate accurate semester dues, Hanif merit waivers, and optional boarding/transit costs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Options (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Select Academic Track */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              1. Select Desired Academic Program
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-medical-500 focus:outline-none"
            >
              {feeStructureData.map((f) => (
                <option key={f.programId} value={f.programId}>
                  {f.programName} ({f.category})
                </option>
              ))}
            </select>
          </div>

          {/* Scholarship Waiver Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                <span>2. Hanif Merit Scholarship / Waiver</span>
              </label>
              <span className="text-sm font-bold text-gold-600 dark:text-gold-400">
                {scholarshipPercent}% Waiver
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="25"
              value={scholarshipPercent}
              onChange={(e) => setScholarshipPercent(Number(e.target.value))}
              className="w-full accent-medical-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>0% (Standard)</span>
              <span>25% (80% Marks)</span>
              <span>50% (85% Marks)</span>
              <span>75% (90% Marks)</span>
              <span>100% (Board Top 10)</span>
            </div>
          </div>

          {/* Optional Boarding & Transport */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              3. Optional Campus Amenities
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={includeHostel}
                  onChange={(e) => setIncludeHostel(e.target.checked)}
                  className="w-4 h-4 text-medical-600 rounded focus:ring-medical-500"
                />
                <div className="flex-1 text-xs sm:text-sm">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Hostel Accommodation & Dining Mess
                  </div>
                  <div className="text-[11px] text-slate-500">
                    +Rs. 45,000 / semester (Secured Air-Cooled Dorms)
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={includeTransport}
                  onChange={(e) => setIncludeTransport(e.target.checked)}
                  className="w-4 h-4 text-medical-600 rounded focus:ring-medical-500"
                />
                <div className="flex-1 text-xs sm:text-sm">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Metropolitan Air-Conditioned Transit
                  </div>
                  <div className="text-[11px] text-slate-500">
                    +Rs. 22,000 / semester (26 City Routes)
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Output Card (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-navy-900 to-navy-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between space-y-6 shadow-xl border border-navy-800">
          <div>
            <div className="text-xs text-medical-400 font-bold uppercase tracking-wider">
              Estimated Fee Breakdown
            </div>
            <h4 className="font-display font-bold text-lg text-white mt-1">
              {currentProgramFee.programName}
            </h4>

            <div className="mt-6 space-y-2.5 text-xs text-slate-300 border-b border-navy-800 pb-4">
              <div className="flex justify-between">
                <span>Standard Tuition per Semester</span>
                <span className="font-semibold text-white">
                  {formatCurrency(baseTuition)}
                </span>
              </div>
              {scholarshipPercent > 0 && (
                <div className="flex justify-between text-gold-400 font-medium">
                  <span>Merit Waiver ({scholarshipPercent}%)</span>
                  <span>- {formatCurrency(scholarshipDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Semester Examination & Library Dues</span>
                <span className="font-semibold text-white">
                  {formatCurrency(currentProgramFee.examinationFeePerSemester)}
                </span>
              </div>
              {includeHostel && (
                <div className="flex justify-between">
                  <span>Hostel & Mess Boarding</span>
                  <span className="font-semibold text-white">
                    {formatCurrency(hostelPerSemester)}
                  </span>
                </div>
              )}
              {includeTransport && (
                <div className="flex justify-between">
                  <span>Air-Conditioned Transit</span>
                  <span className="font-semibold text-white">
                    {formatCurrency(transportPerSemester)}
                  </span>
                </div>
              )}
            </div>

            {/* Total Recurring Semester Due */}
            <div className="mt-4 pt-2 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-300 uppercase tracking-wider block font-medium">
                  Recurring Semester Due
                </span>
                <span className="text-[11px] text-slate-400">
                  (Payable per semester / Installments allowed)
                </span>
              </div>
              <div className="font-display font-black text-2xl sm:text-3xl text-medical-400">
                {formatCurrency(semesterTotal)}
              </div>
            </div>

            {/* 1st Semester Initial Enrollment Total */}
            <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center justify-between text-slate-300">
              <div>
                <span className="font-semibold text-white block">
                  1st Semester Initial Total:
                </span>
                <span className="text-[10px] text-slate-400">
                  Includes One-Time Admission ({formatCurrency(currentProgramFee.admissionFee)}) & Refundable Lab Security ({formatCurrency(currentProgramFee.labSecurityOneTime)})
                </span>
              </div>
              <span className="font-bold text-gold-300 text-sm ml-2">
                {formatCurrency(firstSemesterTotalWithAdmission)}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href="/admissions"
              className="flex-1"
            >
              <Button variant="gold" size="md" className="w-full justify-center">
                Apply for Merit Admission
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
