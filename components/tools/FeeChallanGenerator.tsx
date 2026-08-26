"use client";

import React, { useState, useRef } from "react";
import { Printer, Download, CheckCircle2, ShieldCheck, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

interface FeeChallanGeneratorProps {
  initialStudentName?: string;
  initialRollNo?: string;
  initialGroup?: string;
  initialCategory?: "Civilian" | "Armed Forces";
  initialMonth?: string;
}

export const FeeChallanGenerator: React.FC<FeeChallanGeneratorProps> = ({
  initialStudentName = "Muhammad Hamza Khan",
  initialRollNo = "BCH-2026-0101",
  initialGroup = "Pre-Medical",
  initialCategory = "Civilian",
  initialMonth = "September 2026",
}) => {
  const [studentName, setStudentName] = useState(initialStudentName);
  const [rollNo, setRollNo] = useState(initialRollNo);
  const [group, setGroup] = useState(initialGroup);
  const [category, setCategory] = useState<"Civilian" | "Armed Forces">(initialCategory);
  const [billingMonth, setBillingMonth] = useState(initialMonth);

  const printRef = useRef<HTMLDivElement>(null);

  // Dynamic fee calculation based on Category
  const tuitionFee = category === "Civilian" ? 5500 : 3500;
  const labFee = group === "Pre-Medical" || group === "Pre-Engineering" || group === "Computer Science" ? 800 : 0;
  const libraryFee = 200;
  const totalAmount = tuitionFee + labFee + libraryFee;
  const dueDate = "10th of Billing Month";
  const challanNo = `BCH-${rollNo.replace(/[^0-9]/g, "") || "0101"}-202609`;

  const handlePrint = () => {
    window.print();
  };

  const challanCopies = ["Bank Copy (For HBL/NBP)", "College Accounts Copy", "Student / Parent Copy"];

  return (
    <div className="space-y-6">
      {/* Configuration Bar */}
      <div className="no-print bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              Student Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="mt-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="Civilian">Civilian Rate (Standard)</option>
              <option value="Armed Forces">Armed Forces Dependent (Subsidized)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              Academic Group
            </label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="mt-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="Pre-Medical">F.Sc Pre-Medical</option>
              <option value="Pre-Engineering">F.Sc Pre-Engineering</option>
              <option value="Computer Science">ICS Computer Science</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="gold" size="sm" onClick={handlePrint} className="gap-1.5 text-xs shadow-md">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official 3-Part Challan</span>
          </Button>
        </div>
      </div>

      {/* 3-Part Bank Challan Slip Container */}
      <div
        ref={printRef}
        className="print-area bg-white text-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-300 shadow-xl overflow-x-auto"
      >
        <div className="min-w-[760px] grid grid-cols-3 gap-4 divide-x divide-slate-300">
          {challanCopies.map((copyLabel, idx) => (
            <div key={idx} className={`space-y-3 ${idx > 0 ? "pl-4" : ""}`}>
              {/* Slip Header */}
              <div className="text-center pb-2 border-b border-slate-300 space-y-0.5">
                <div className="font-display font-black text-xs uppercase tracking-wider text-navy-950">
                  Bahria College Hanif
                </div>
                <div className="text-[10px] font-bold text-slate-600 uppercase">
                  Habib Bank Limited / NBP A/C: 0042-79015822-03
                </div>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 text-navy-950 font-bold text-[9px] uppercase border border-slate-300">
                  {copyLabel}
                </span>
              </div>

              {/* Meta details */}
              <div className="text-[10px] space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Challan No:</span>
                  <span className="font-mono font-bold">{challanNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Student Name:</span>
                  <span className="font-bold truncate max-w-[130px]">{studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">College Roll ID:</span>
                  <span className="font-mono font-bold text-navy-900">{rollNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Discipline / Class:</span>
                  <span className="font-bold">11th {group}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Billing Period:</span>
                  <span className="font-bold text-medical-600">{billingMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Due Date:</span>
                  <span className="font-bold text-rose-600">{dueDate}</span>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <table className="w-full text-[10px] text-left border border-slate-200">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="py-1 px-2 border-b border-slate-200">Fee Head</th>
                    <th className="py-1 px-2 border-b border-slate-200 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-1 px-2">Tuition Fee ({category})</td>
                    <td className="py-1 px-2 text-right font-medium">{formatCurrency(tuitionFee)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2">Science / IT Laboratory Fee</td>
                    <td className="py-1 px-2 text-right font-medium">{formatCurrency(labFee)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2">Library & Campus Fund</td>
                    <td className="py-1 px-2 text-right font-medium">{formatCurrency(libraryFee)}</td>
                  </tr>
                  <tr className="bg-slate-100/70 font-bold text-navy-950">
                    <td className="py-1 px-2 border-t border-slate-300">Total Payable:</td>
                    <td className="py-1 px-2 border-t border-slate-300 text-right text-emerald-700">
                      {formatCurrency(totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Instructions & Signatures */}
              <div className="pt-2 text-[8px] text-slate-500 space-y-3">
                <p className="leading-tight">
                  * Note: Fee is payable at any online branch of HBL or National Bank of Pakistan before the 10th. Late fee of Rs. 200 applicable thereafter.
                </p>
                <div className="flex justify-between pt-4 text-[9px] border-t border-dashed border-slate-300 font-semibold">
                  <span>Student Sign</span>
                  <span>Bank Officer Stamp</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
