"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Cpu,
  Calculator,
  FileText,
  Calendar,
  Microscope,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { intermediateGroupsData } from "@/lib/data/groups";

interface MegaMenuProps {
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ onClose }) => {
  const groupIcons = {
    "pre-medical": Stethoscope,
    "pre-engineering": Calculator,
    "computer-science": Cpu,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl z-40 py-8 px-4 sm:px-8"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Groups Columns (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          <div>
            <span className="text-[11px] font-bold text-medical-600 dark:text-medical-400 uppercase tracking-wider">
              Academic Disciplines (HSSC Intermediate)
            </span>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Three Official Science & Computer Streams
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {intermediateGroupsData.map((grp) => {
              const Icon = groupIcons[grp.slug] || Microscope;
              return (
                <Link
                  key={grp.id}
                  href={`/groups/${grp.slug}`}
                  onClick={onClose}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-medical-500/40 hover:shadow-lg transition-all group block"
                >
                  <div className="p-2.5 rounded-xl bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400 w-fit mb-3 group-hover:bg-medical-500 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">
                    {grp.shortTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {grp.qualification}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[11px] font-bold text-medical-600 dark:text-medical-400 flex items-center gap-1">
                    <span>Subjects & Timetable</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Links */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link
              href="/admissions#merit"
              onClick={onClose}
              className="flex items-center gap-1.5 hover:text-medical-600 dark:hover:text-medical-400"
            >
              <FileText className="w-4 h-4 text-gold-500" />
              Matric Marks & Merit Criteria
            </Link>
            <Link
              href="/facilities"
              onClick={onClose}
              className="flex items-center gap-1.5 hover:text-medical-600 dark:hover:text-medical-400"
            >
              <Microscope className="w-4 h-4 text-medical-500" />
              Physics, Chemistry, Bio & CS Labs
            </Link>
            <Link
              href="/results"
              onClick={onClose}
              className="flex items-center gap-1.5 hover:text-medical-600 dark:hover:text-medical-400"
            >
              <Calendar className="w-4 h-4 text-rose-500" />
              BISE Board Position Holders
            </Link>
          </div>
        </div>

        {/* Featured Admissions Banner (4 cols) */}
        <div className="md:col-span-4 bg-gradient-to-br from-navy-900 to-navy-950 rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-xl border border-navy-800">
          <div className="relative z-10 space-y-2">
            <span className="px-2.5 py-1 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
              Admission Open 2026
            </span>
            <h4 className="font-display font-black text-lg text-white mt-2">
              Join Pakistan&apos;s Benchmark Intermediate College
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              98.4% overall pass rate with distinction holders in BISE Board annual examinations.
            </p>
          </div>

          <div className="relative mt-6 z-10 flex items-center justify-between">
            <Link
              href="/admissions"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gold-500 text-navy-950 text-xs font-bold hover:bg-gold-400 transition-colors shadow-md"
            >
              Admissions Guide
            </Link>
            <Link
              href="/notice-board"
              onClick={onClose}
              className="text-xs font-bold text-medical-300 hover:text-medical-200"
            >
              Check Merit Lists →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
