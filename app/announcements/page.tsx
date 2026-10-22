"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { AnnouncementItem } from "@/lib/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Calendar, Megaphone, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const { data, error: sbError } = await supabase
        .from("announcements")
        .select("*")
        .order("date", { ascending: false });

      if (sbError) {
        throw sbError;
      }

      setAnnouncements((data as AnnouncementItem[]) || []);
    } catch (err: any) {
      console.error("Failed to fetch announcements:", err);
      setError(err?.message || "Failed to load announcements. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Campus Updates"
        title="College Announcements"
        subtitle="Important event updates, academic milestones, and campus activities for Bahria College Hanif."
        breadcrumbs={[{ label: "Announcements" }]}
        backgroundImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeader
            badge="Latest News"
            badgeVariant="medical"
            title="Institutional Highlights &"
            titleHighlight="Recent Happenings"
            subtitle="Updates on college ceremonies, laboratory developments, and student achievements."
            align="center"
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-3xl p-8 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-red-900 dark:text-red-300">
                Unable to load announcements
              </h3>
              <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnnouncements}
                className="gap-2 mx-auto cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </Button>
            </div>
          ) : announcements.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Nothing published yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                There are no announcements published at the moment. Please check back later for campus updates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.heading}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Megaphone className="w-12 h-12 stroke-[1.5]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-xs font-semibold text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-400" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">
                        {item.heading}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
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

