"use client";

import React, { useState, useEffect } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { NoticeItem } from "@/lib/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  BellRing,
  Calendar,
  FileDown,
  Pin,
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function NoticeBoardPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchNotices = async () => {
    if (!isSupabaseConfigured) {
      setErrorMessage("Database service is currently not configured.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("date", { ascending: false });

      if (error) {
        setErrorMessage(error.message || "Failed to fetch notices.");
      } else {
        setNotices(data || []);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to fetch notices from database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();

    if (isSupabaseConfigured) {
      const channel = supabase
        .channel("realtime-notices")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "notices" },
          () => {
            fetchNotices();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const categories = [
    "All",
    "Date Sheet",
    "Roll No Slip",
    "Holiday",
    "Fee Due Date",
    "General Notice",
  ];

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory =
      selectedCategory === "All" || notice.category === selectedCategory;
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Official Circulars"
        title="College Notice Board"
        subtitle="Stay updated with all formal administrative orders, exam date sheets, roll number slips, fee deadlines, and college notifications."
        breadcrumbs={[{ label: "Notice Board" }]}
        backgroundImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionHeader
            badge="Institutional Circulars"
            badgeVariant="medical"
            title="Public Notifications &"
            titleHighlight="Gazette Updates"
            subtitle="Browse by category or search notice subject lines."
            align="center"
          />

          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search circulars by keyword, date sheet, roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notices Content */}
          {isLoading ? (
            <ListSkeleton count={4} />
          ) : errorMessage ? (
            <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-4">
              <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
              <div className="text-sm text-rose-800 dark:text-rose-200 font-medium">
                {errorMessage}
              </div>
              <Button variant="outline" size="sm" onClick={fetchNotices} className="gap-2 mx-auto text-xs">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </Button>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-slate-500 space-y-2">
              <BellRing className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <div className="font-semibold text-slate-700 dark:text-slate-300">Nothing published yet</div>
              <div className="text-xs text-slate-400">Official circulars and notifications will appear here once released.</div>
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-slate-500">
              No notices found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                    notice.is_pinned
                      ? "border-gold-400/80 shadow-md ring-1 ring-gold-400/30"
                      : "border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {notice.is_pinned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold-500/10 text-gold-600 dark:text-gold-400 text-[10px] font-bold uppercase tracking-wider border border-gold-500/30">
                            <Pin className="w-3 h-3" /> Pinned
                          </span>
                        )}
                        <Badge variant="medical" size="sm">
                          {notice.category}
                        </Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {notice.date}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                        {notice.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {notice.description}
                      </p>
                    </div>

                    {notice.file_url && (
                      <div className="pt-2 sm:pt-0 sm:pl-4 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() => alert(`Downloading attachment for: ${notice.title}`)}
                        >
                          <FileDown className="w-4 h-4 text-medical-600 dark:text-medical-400" />
                          <span>Download PDF</span>
                          {notice.file_size && (
                            <span className="text-slate-400 text-[10px]">
                              ({notice.file_size})
                            </span>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
