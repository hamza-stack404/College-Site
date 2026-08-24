import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { alumniPageContent } from "@/lib/data/alumni";
import {
  Sparkles,
  Award,
  BookOpen,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";

export const metadata = {
  title: "Pioneer Batch & Future Alumni — Bahria College Hanif",
  description:
    "A Legacy in the Making: Bahria College Hanif's pioneer Class 11 cohort sets the benchmark as our future doctors, engineers, and scientists.",
};

export default function AlumniPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge={alumniPageContent.badge}
        title={alumniPageContent.title}
        subtitle={alumniPageContent.subtitle}
        breadcrumbs={[{ label: "Alumni" }]}
        backgroundImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          {/* Main Statement Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-14 shadow-lg space-y-6">
            <div className="w-16 h-16 rounded-full bg-gold-50 dark:bg-gold-950 text-gold-600 dark:text-gold-400 mx-auto flex items-center justify-center border border-gold-200 dark:border-gold-800">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <div className="font-display font-black text-2xl sm:text-3xl text-gold-500 italic">
                {alumniPageContent.quote}
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white">
                Be Part of Our First Chapter
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {alumniPageContent.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
              {alumniPageContent.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-2"
                >
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Inspirational CTA */}
          <div className="p-8 rounded-3xl bg-navy-950 text-white space-y-4 shadow-xl border border-navy-800">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
              Your Legacy Starts Here
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Focused preparation, character building, and academic excellence for every student walking through our doors.
            </p>
            <div className="pt-2">
              <Link href="/groups">
                <Button variant="gold" size="md">
                  Explore Academic Groups
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
