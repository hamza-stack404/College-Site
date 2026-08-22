"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Mail, Sparkles, Languages, BellRing, Award } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  const [isUrdu, setIsUrdu] = useState(false);

  return (
    <div className="bg-navy-950 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-navy-800/80 select-none relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Admissions Ticker / BISE Affiliation */}
        <div className="flex items-center gap-2 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px] uppercase tracking-wider border border-gold-500/30 animate-pulse">
            <Sparkles className="w-3 h-3" /> Admissions 2026 Open
          </span>
          <span className="hidden sm:inline text-slate-300">
            Affiliated with BISE & FBISE • F.Sc Pre-Medical, Pre-Engineering & ICS
          </span>
          <Link
            href="/notice-board"
            className="text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5 ml-1"
          >
            1st Merit List Displayed
          </Link>
        </div>

        {/* Right: Quick Contacts & Urdu Toggle */}
        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
          <a
            href="tel:+922134859100"
            className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-medical-400" />
            <span>+92 (21) 3485-9100 (PST 08:00 AM – 02:30 PM)</span>
          </a>
          <span className="hidden lg:inline h-3 w-px bg-slate-700" />
          <Link
            href="/results"
            className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 font-semibold transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            <span>BISE Results</span>
          </Link>
          <span className="h-3 w-px bg-slate-700" />
          <button
            onClick={() => setIsUrdu(!isUrdu)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-colors cursor-pointer"
            title="Toggle Language"
          >
            <Languages className="w-3 h-3 text-medical-400" />
            <span>{isUrdu ? "English" : "اردو"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
