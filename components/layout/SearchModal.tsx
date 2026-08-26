"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  BookOpen,
  User,
  Calendar,
  Newspaper,
  ArrowRight,
  FileText,
  Award,
  Microscope,
  Calculator,
  QrCode,
  Shield,
  Sparkles,
} from "lucide-react";
import { intermediateGroupsData } from "@/lib/data/groups";
import { initialNoticesData } from "@/lib/data/notices";
import { positionHoldersData } from "@/lib/data/results";
import { facultyData } from "@/lib/data/faculty";
import { facilitiesData } from "@/lib/data/facilities";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedGroups = intermediateGroupsData
      .filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.shortTitle.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      )
      .map((g) => ({
        type: "Academic Group",
        title: g.title,
        subtitle: `${g.qualification} • ${g.duration}`,
        href: `/groups/${g.slug}`,
        icon: BookOpen,
      }));

    const matchedNotices = initialNoticesData
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
      )
      .map((n) => ({
        type: "Notice Circular",
        title: n.title,
        subtitle: `${n.category} • ${n.date}`,
        href: `/notice-board`,
        icon: FileText,
      }));

    const matchedPositions = positionHoldersData
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.group.toLowerCase().includes(q) ||
          p.boardRank.toLowerCase().includes(q)
      )
      .map((p) => ({
        type: "Position Holder",
        title: `${p.name} (${p.boardRank})`,
        subtitle: `${p.group} • ${p.marksObtained}/${p.totalMarks} (${p.percentage}%)`,
        href: `/results`,
        icon: Award,
      }));

    const matchedFaculty = facultyData
      .filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.subject && f.subject.toLowerCase().includes(q)) ||
          f.qualification.toLowerCase().includes(q)
      )
      .map((f) => ({
        type: "Faculty Member",
        title: f.name,
        subtitle: `${f.role} ${f.subject ? `— ${f.subject}` : ""}`,
        href: `/faculty`,
        icon: User,
      }));

    const matchedFacilities = facilitiesData
      .filter(
        (fac) =>
          fac.name.toLowerCase().includes(q) ||
          fac.description.toLowerCase().includes(q)
      )
      .map((fac) => ({
        type: "Campus Facility",
        title: fac.name,
        subtitle: fac.category,
        href: `/facilities`,
        icon: Microscope,
      }));

    return [
      ...matchedGroups,
      ...matchedNotices,
      ...matchedPositions,
      ...matchedFaculty,
      ...matchedFacilities,
    ];
  }, [query]);

  const handleSelect = (href: string) => {
    onClose();
    setQuery("");
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Search Input Bar */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-medical-600 dark:text-medical-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search groups, merit lists, date sheets, faculty, labs, fee challan..."
              autoFocus
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear input"
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-4">
            {query && searchResults && searchResults.length > 0 ? (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                  Found {searchResults.length} matches
                </div>
                {searchResults.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item.href)}
                      className="w-full p-3 rounded-2xl flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-medical-600 dark:text-medical-400 flex-shrink-0 group-hover:bg-medical-50 dark:group-hover:bg-medical-950/80">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-medical-600 dark:group-hover:text-medical-400 truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            <span className="font-bold text-slate-400 dark:text-slate-500 mr-1.5 uppercase text-[10px]">
                              [{item.type}]
                            </span>
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 ml-3" />
                    </button>
                  );
                })}
              </div>
            ) : query && searchResults && searchResults.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                No results found for &ldquo;{query}&rdquo;. Try searching for &ldquo;Pre-Medical&rdquo;, &ldquo;Merit Calculator&rdquo;, &ldquo;Date Sheet&rdquo;, &ldquo;Portal&rdquo;, or &ldquo;Biology&rdquo;.
              </div>
            ) : (
              /* Quick Links when query is empty */
              <div className="space-y-4 py-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
                  Quick Navigation & Utilities
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSelect("/portal")}
                    className="p-3 rounded-2xl flex items-center gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-gold-50 dark:bg-gold-950 text-gold-600 dark:text-gold-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        Student / Parent Portal
                      </div>
                      <div className="text-[11px] text-slate-500">Challans, results & timetable</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelect("/admissions")}
                    className="p-3 rounded-2xl flex items-center gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        Admissions & Merit Calculator
                      </div>
                      <div className="text-[11px] text-slate-500">Check FBISE eligibility & apply</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelect("/notice-board")}
                    className="p-3 rounded-2xl flex items-center gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        Official Notice Board
                      </div>
                      <div className="text-[11px] text-slate-500">Date sheets & circulars</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelect("/results")}
                    className="p-3 rounded-2xl flex items-center gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        FBISE Board Gazette
                      </div>
                      <div className="text-[11px] text-slate-500">Position holders & results</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
