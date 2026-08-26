"use client";

import React, { useState, useEffect } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { initialNoticesData } from "@/lib/data/notices";
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
  Clock,
  Sparkles,
} from "lucide-react";

export default function NoticeBoardPage() {
  const [notices, setNotices] = useState<NoticeItem[]>(initialNoticesData);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchNotices() {
      if (!isSupabaseConfigured) return;
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("notices")
          .select("*")
          .order("is_pinned", { ascending: false })
          .order("date", { ascending: false });

        if (data && !error && data.length > 0) {
          setNotices(data as NoticeItem[]);
        }
      } catch (err) {
        console.error("Failed to fetch notices from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    }
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

  const filteredNotices = notices.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Official Circulars"
        title="College Notice Board"
        subtitle="Stay updated with the latest academic circulars, examination date sheets, FBISE roll number slips, fee schedules, and institutional notifications."
        breadcrumbs={[{ label: "Notice Board" }]}
        backgroundImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Controls Bar: Search & Categories */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search notices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-medical-500"
                />
              </div>

              {/* Notice Counter */}
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Showing {filteredNotices.length} notifications
              </div>
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

          {/* Notices List */}
          <div className="space-y-4">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
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
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-slate-500">
                No notices found matching your search.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
