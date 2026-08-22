import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  Newspaper,
} from "lucide-react";
import { newsArticlesData, campusEventsData } from "@/lib/data/news-events";
import { SectionHeader } from "../shared/SectionHeader";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatDate } from "@/lib/utils";

export const NewsTickerSection: React.FC = () => {
  const latestNews = newsArticlesData.slice(0, 3);
  const upcomingEvents = campusEventsData.slice(0, 2);

  return (
    <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Happenings & Research"
          badgeVariant="medical"
          title="Latest Institutional Bulletins &"
          titleHighlight="Scientific Events"
          subtitle="Stay abreast of biomedical breakthrough publications, national academic achievements, and upcoming surgical symposiums."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* News Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-medical-600 dark:text-medical-400" />
                <span>Featured News & Research</span>
              </h3>
              <Link
                href="/news-events"
                className="text-xs font-semibold text-medical-600 dark:text-medical-400 hover:underline flex items-center gap-1"
              >
                <span>View All News</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {latestNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/news-events/${article.slug}`}
                  className="group block p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-medical-500/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="relative w-full sm:w-40 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 160px"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="medical" size="sm">
                          {article.category}
                        </Badge>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(article.publishedAt)}
                        </span>
                        <span className="text-[11px] text-slate-400">• {article.readTime}</span>
                      </div>

                      <h4 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Events Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold-500" />
                <span>Upcoming Events & RSVP</span>
              </h3>
              <Link
                href="/news-events#events"
                className="text-xs font-semibold text-gold-600 dark:text-gold-400 hover:underline flex items-center gap-1"
              >
                <span>Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-2.5 rounded-xl bg-gold-50 dark:bg-gold-950 text-gold-600 dark:text-gold-400 flex flex-col items-center justify-center min-w-[54px] text-center border border-gold-200 dark:border-gold-800">
                        <span className="text-[10px] font-black uppercase">
                          {new Date(event.date).toLocaleString("en-US", { month: "short" })}
                        </span>
                        <span className="text-lg font-black leading-none">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>

                      <div className="flex-1">
                        <Badge variant="gold" size="sm" className="mb-1">
                          {event.category}
                        </Badge>
                        <h4 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug">
                          {event.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-medical-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {event.totalSeats - event.registeredSeats} seats remaining
                    </span>
                    <Link href={`/news-events/${event.slug}`}>
                      <Button size="sm" variant="medical">
                        Reserve Seat / Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
