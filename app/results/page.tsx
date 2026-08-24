import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { positionHoldersData, fbiseResultPortalLink } from "@/lib/data/results";
import { COLLEGE_INFO } from "@/lib/data/constants";
import {
  Award,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";

export const metadata = {
  title: "FBISE Board Results & Position Holders — Bahria College Hanif",
  description:
    "Official FBISE Islamabad HSSC examination results and board position holders of Bahria College Hanif.",
};

export default function ResultsPage() {
  const hasResults = positionHoldersData.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="FBISE Examinations"
        title="Board Results & Position Holders"
        subtitle="Official examination gazette and distinction holders under the Federal Board of Intermediate and Secondary Education (FBISE) Islamabad."
        breadcrumbs={[{ label: "Results" }]}
        backgroundImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
      />

      {/* Main Results Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Academic Achievements"
            badgeVariant="gold"
            title="FBISE HSSC Annual"
            titleHighlight="Examination Gazette"
            subtitle="Distinction holders and merit positions across Pre-Medical, Pre-Engineering, and Computer Science."
            align="center"
          />

          {hasResults ? (
            /* Results Grid (renders dynamically when data is populated) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {positionHoldersData.map((holder) => (
                <div
                  key={holder.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all text-center space-y-4"
                >
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gold-400 shadow-md">
                    <Image
                      src={holder.photo}
                      alt={holder.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 font-bold text-[11px] uppercase tracking-wider border border-gold-500/30">
                      {holder.boardRank}
                    </span>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-1">
                      {holder.name}
                    </h4>
                    <div className="text-xs text-medical-600 dark:text-medical-400 font-semibold">
                      {holder.group} • {holder.passingYear}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs">
                    <div className="font-display font-black text-xl text-navy-950 dark:text-white">
                      {holder.marksObtained} / {holder.totalMarks}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {holder.percentage}% Aggregate ({holder.boardName})
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Enrolled at: <strong>{holder.currentInstitution}</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Clean Static Empty State per Section 2 */
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center shadow-lg space-y-6">
              <div className="w-16 h-16 rounded-full bg-gold-50 dark:bg-gold-950 text-gold-600 dark:text-gold-400 mx-auto flex items-center justify-center border border-gold-200 dark:border-gold-800">
                <Clock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <Badge variant="gold" size="md">
                  Status: Result Pending
                </Badge>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                  Results Not Yet Announced
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
                  FBISE HSSC Part-I results for this batch have not been announced yet. Official board position holders and annual marks gazettes will be published here once released by the Federal Board.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-medical-600 dark:text-medical-400 flex-shrink-0" />
                <span>
                  College internal assessment marks and send-up results are accessible directly in the student portal.
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link href="/portal">
                  <Button variant="primary" size="md">
                    Check Internal Test Marks (Portal)
                  </Button>
                </Link>
                <a
                  href={fbiseResultPortalLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" size="md" rightIcon={<ExternalLink className="w-4 h-4" />}>
                    Official FBISE Portal
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FBISE Board Information Strip */}
      <section className="py-12 bg-navy-950 text-white border-t border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-bold text-gold-400 uppercase tracking-wider">
              Affiliated Examination Authority
            </div>
            <h4 className="font-display font-bold text-xl text-white">
              Federal Board of Intermediate & Secondary Education, Islamabad
            </h4>
            <p className="text-xs text-slate-400">
              Direct verification of HSSC gazettes, roll number slips, and mark sheets.
            </p>
          </div>

          <a
            href={fbiseResultPortalLink.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="gold" size="md" rightIcon={<ExternalLink className="w-4 h-4" />}>
              Visit FBISE Website
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
