"use client";

import React from "react";
import { Phone, Sparkles } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-navy-950 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-navy-800/80 select-none relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Affiliation & Program Information */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          {/* ADMISSIONS_REOPEN: uncomment when admissions reopen
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px] uppercase tracking-wider border border-gold-500/30 animate-pulse">
            <Sparkles className="w-3 h-3" /> Admissions 2026 Open
          </span>
          */}
          <span className="text-slate-300 font-medium">
            Affiliated with BISE & FBISE • F.Sc Pre-Medical, Pre-Engineering & ICS
          </span>
        </div>

        {/* Right: College Telephone Helpline */}
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
          <a
            href="tel:+922134859100"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-medical-400" />
            <span>+92 (21) 3485-9100 (PST 08:00 AM – 02:30 PM)</span>
          </a>
        </div>
      </div>
    </div>
  );
};

