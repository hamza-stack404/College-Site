import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { COLLEGE_INFO } from "@/lib/data/constants";
import {
  ShieldCheck,
  Target,
  Compass,
  CheckCircle2,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "About Us — History, Leadership & Affiliation — Bahria College Hanif",
  description:
    "Learn about Bahria College Hanif, our affiliation with FBISE Islamabad, our academic leadership, and our commitment to intermediate science education.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Institutional Overview"
        title="About Bahria College Hanif"
        subtitle={`Dedicated to cultivating disciplined character, empirical scientific curiosity, and academic excellence under the ${COLLEGE_INFO.affiliation}.`}
        breadcrumbs={[{ label: "About Us" }]}
        backgroundImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
      />

      {/* Vision & Mission */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="p-3 rounded-2xl bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400 w-fit">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                Our Institutional Vision
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                To be recognized as a premier intermediate science college in Pakistan—producing disciplined, high-achieving scholars equipped with strong moral values, scientific proficiency, and readiness for leading universities.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medical-500" />
                  <span>Uncompromising adherence to academic discipline and ethics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medical-500" />
                  <span>Rigorous FBISE HSSC curriculum coverage and laboratory mastery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medical-500" />
                  <span>Subsidized educational access for Armed Forces personnel dependents</span>
                </li>
              </ul>
            </div>

            {/* Mission */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="p-3 rounded-2xl bg-gold-50 dark:bg-gold-950 text-gold-600 dark:text-gold-400 w-fit">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                Our Core Mission
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                To deliver comprehensive 2-year intermediate science and computing education supported by dedicated practical laboratories, subject-specialist teachers, weekly evaluations, and holistic character mentorship.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500" />
                  <span>Hands-on experimental learning in Physics, Chemistry, Bio & CS Labs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500" />
                  <span>Regular internal assessments, monthly tests, and send-up exams</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500" />
                  <span>Physical training, sports, and congregational Islamic prayer environment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Messages */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Principal Message */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4 relative">
              <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                  alt="Commodore (R) Muhammad Hanif"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <Badge variant="medical" size="sm">
                Principal&apos;s Message
              </Badge>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                Commodore (R) Muhammad Hanif Niazi, SI(M)
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  At Bahria College Hanif, we believe that education during the intermediate years is the defining foundation of a young scholar&apos;s life. Our primary objective is to instill strong academic rigor combined with the highest standards of discipline, punctuality, and moral fortitude.
                </p>
                <p>
                  Whether our students aim for public sector medical colleges, top engineering institutions, or computer science universities, we ensure they receive dedicated personal mentorship and daily laboratory practice to excel in their FBISE Board examinations.
                </p>
              </div>
            </div>
          </div>

          {/* Vice Principal Message */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-10 border-t border-slate-200 dark:border-slate-800">
            <div className="lg:col-span-8 space-y-4 order-2 lg:order-1">
              <Badge variant="gold" size="sm">
                Vice Principal&apos;s Message
              </Badge>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                Prof. Dr. Tariq Mahmood Khan
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Our academic system emphasizes continuous conceptual clarity rather than rote memorization. Through periodic class tests, supervised laboratory practicals, and prompt evaluation feedback via our portal, we ensure every student remains on track.
                </p>
                <p>
                  We maintain close communication with parents through regular Parent-Teacher Meetings and digital attendance updates, working together for each student&apos;s academic success.
                </p>
              </div>
            </div>
            <div className="lg:col-span-4 relative order-1 lg:order-2">
              <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700">
                <Image
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80"
                  alt="Prof. Dr. Tariq Mahmood Khan"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliation Recognition Strip */}
      <section className="py-16 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="gold" size="sm">
            Statutory Recognition
          </Badge>
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Affiliated with FBISE Islamabad
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Bahria College Hanif is registered and affiliated with the Federal Board of Intermediate and Secondary Education (FBISE) Islamabad. All intermediate examinations, roll number slips, and HSSC certificates are awarded under the Federal Board authority.
          </p>
          <div className="pt-2">
            <Link href="/groups">
              <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Groups Offered
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
