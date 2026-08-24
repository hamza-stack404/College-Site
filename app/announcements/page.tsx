"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { initialAnnouncementsData } from "@/lib/data/announcements";
import { AnnouncementItem } from "@/lib/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Calendar, Megaphone } from "lucide-react";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(initialAnnouncementsData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchAnnouncements() {
      if (!isSupabaseConfigured) return;
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .order("date", { ascending: false });

        if (data && !error && data.length > 0) {
          setAnnouncements(data as AnnouncementItem[]);
        }
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.heading}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
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
        </div>
      </section>
    </div>
  );
}
