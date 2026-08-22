"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { newsArticlesData, campusEventsData } from "@/lib/data/news-events";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Newspaper,
  ArrowRight,
  Search,
  Users,
  Sparkles,
} from "lucide-react";

export default function NewsEventsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "Research" | "Campus Life" | "Admissions" | "Achievements">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNews = newsArticlesData.filter((article) => {
    const matchesTab = activeTab === "all" || article.category === activeTab;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="News & Events Hub"
        title="Institutional Bulletins & Campus Events"
        subtitle="Stay informed on biomedical research grants, student academic triumphs, guest surgeon lectures, and scientific symposiums."
        breadcrumbs={[{ label: "News & Events" }]}
        backgroundImage="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80"
      />

      {/* 1. Upcoming Events Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50" id="events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Academic Calendar"
            badgeVariant="gold"
            title="Upcoming Symposiums &"
            titleHighlight="Campus Events"
            subtitle="Reserve your seat for guest surgeon lectures, hands-on biotechnology masterclasses, and sports galas."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {campusEventsData.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-navy-950/90 text-white backdrop-blur-md border border-navy-800 text-center min-w-[60px]">
                    <div className="text-[10px] uppercase font-bold text-gold-400">
                      {new Date(event.date).toLocaleString("en-US", { month: "short" })}
                    </div>
                    <div className="text-xl font-black leading-tight">
                      {new Date(event.date).getDate()}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4">
                    <Badge variant="gold" size="sm">
                      {event.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-1 pt-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-medical-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{event.venue}</span>
                      </div>
                      {event.speaker && (
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-gold-500" />
                          <span>
                            Keynote: {event.speaker.name} ({event.speaker.organization})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {event.totalSeats - event.registeredSeats} of {event.totalSeats} seats open
                    </span>
                    <Link href={`/news-events/${event.slug}`}>
                      <Button size="sm" variant="medical">
                        RSVP / Event Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Institutional News & Research Bulletins */}
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="News Articles"
            badgeVariant="medical"
            title="Medical & Science"
            titleHighlight="Research Articles"
            subtitle="Browse official announcements, research grant awards, and student achievements."
            align="center"
          />

          {/* Controls Bar: Categories & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {(["all", "Research", "Campus Life", "Admissions", "Achievements"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-navy-900 text-white dark:bg-medical-600 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {tab === "all" ? "All Categories" : tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article) => (
              <div
                key={article.id}
                className="bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="medical" size="sm">
                      {article.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{formatDate(article.publishedAt)}</span>
                      <span>• {article.readTime}</span>
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white mt-1 group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={article.author.avatar}
                          alt={article.author.name}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">
                        {article.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/news-events/${article.slug}`}
                      className="text-xs font-bold text-medical-600 dark:text-medical-400 flex items-center gap-1 hover:underline"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
