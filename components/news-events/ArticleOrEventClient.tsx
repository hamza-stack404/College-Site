"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { NewsArticle, CampusEvent } from "@/lib/types";
import { eventRsvpSchema, EventRsvpData } from "@/lib/validations/forms";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Ticket,
  CheckCircle2,
  Send,
  ArrowLeft,
  BookOpen,
} from "lucide-react";

interface ArticleOrEventClientProps {
  article?: NewsArticle;
  event?: CampusEvent;
}

export const ArticleOrEventClient: React.FC<ArticleOrEventClientProps> = ({
  article,
  event,
}) => {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isRsvpSuccess, setIsRsvpSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventRsvpData>({
    resolver: zodResolver(eventRsvpSchema),
    defaultValues: { seatsCount: 1 },
  });

  const onRsvpSubmit = async (data: EventRsvpData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRsvpSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    reset();
  };

  if (event) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHero
          badge={event.category}
          title={event.title}
          subtitle={`${event.date} • ${event.venue}`}
          breadcrumbs={[
            { label: "News & Events", href: "/news-events" },
            { label: "Event Detail" },
          ]}
          backgroundImage={event.coverImage}
        />

        <div className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Event Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6">
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
              </div>

              {/* Schedule Info Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gold-500 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Event Date</div>
                    <div className="font-bold text-slate-900 dark:text-white">{event.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-medical-500 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Timings</div>
                    <div className="font-bold text-slate-900 dark:text-white">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Venue</div>
                    <div className="font-bold text-slate-900 dark:text-white">{event.venue}</div>
                  </div>
                </div>
              </div>

              {/* Event Body Description */}
              <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  About the Event & Agenda
                </h3>
                <p>{event.description}</p>
                <p>{event.fullDetails}</p>
              </div>

              {/* Keynote Speaker Bio if exists */}
              {event.speaker && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gold-50 dark:bg-gold-950 text-gold-600 dark:text-gold-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gold-600 dark:text-gold-400 uppercase tracking-wider">
                      Plenary Keynote Speaker
                    </div>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      {event.speaker.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {event.speaker.title} • {event.speaker.organization}
                    </p>
                  </div>
                </div>
              )}

              {/* RSVP Action */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500">
                    Available Capacity: <strong>{event.totalSeats - event.registeredSeats} seats remaining</strong>
                  </div>
                </div>

                <Button
                  size="lg"
                  variant="gold"
                  onClick={() => {
                    setIsRsvpSuccess(false);
                    setIsRsvpOpen(true);
                  }}
                  leftIcon={<Ticket className="w-4 h-4" />}
                >
                  Reserve Your Free Pass (RSVP)
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Modal */}
        <Modal
          isOpen={isRsvpOpen}
          onClose={() => setIsRsvpOpen(false)}
          title={`RSVP Pass: ${event.title}`}
          subtitle="Confirm your attendance and receive a digital QR entry ticket."
          maxWidth="lg"
        >
          {isRsvpSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Seat Reserved Successfully!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Your e-ticket pass has been emailed to your registered address. Please arrive 15 minutes prior to session commencement.
              </p>
              <Button variant="primary" size="sm" onClick={() => setIsRsvpOpen(false)}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onRsvpSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  {...register("name")}
                  placeholder="e.g. Dr. Bilal Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
                {errors.name && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="bilal@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
                {errors.email && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  {...register("phone")}
                  placeholder="+92 300 1234567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
                {errors.phone && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.phone.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Institution / Organization / Batch *
                </label>
                <input
                  {...register("organizationOrBatch")}
                  placeholder="e.g. Dow Medical / Bahria Hanif Batch 2025"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
                {errors.organizationOrBatch && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.organizationOrBatch.message}
                  </span>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsRsvpOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="medical" isLoading={isSubmitting}>
                  Confirm Free Seat
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    );
  }

  // Otherwise News Article View
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge={article?.category}
        title={article!.title}
        subtitle={`${formatDate(article!.publishedAt)} • ${article!.readTime}`}
        breadcrumbs={[
          { label: "News & Events", href: "/news-events" },
          { label: "Article" },
        ]}
        backgroundImage={article!.coverImage}
      />

      <article className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-8">
            <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden">
              <Image
                src={article!.coverImage}
                alt={article!.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
            </div>

            {/* Author Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border">
                  <Image
                    src={article!.author.avatar}
                    alt={article!.author.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {article!.author.name}
                  </div>
                  <div className="text-xs text-slate-500">{article!.author.role}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (typeof window !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Article link copied to clipboard!");
                  }
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-4 text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-relaxed font-serif">
              {article!.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Tags */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase mr-2">Tags:</span>
              {article!.tags.map((tag, idx) => (
                <Badge key={idx} variant="slate" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
