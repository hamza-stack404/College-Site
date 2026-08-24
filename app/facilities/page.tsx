import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { facilitiesData } from "@/lib/data/facilities";
import {
  CheckCircle2,
  Microscope,
  BookOpen,
  MapPin,
  Bus,
  Coffee,
  ShieldCheck,
  Award,
} from "lucide-react";

export const metadata = {
  title: "Campus Facilities & Science Labs — Bahria College Hanif",
  description:
    "Explore our dedicated Physics, Chemistry, Biology, and Computer Science laboratories, college mosque, library, sports ground, and transport fleet.",
};

export default function FacilitiesPage() {
  const categories = [
    { label: "All Facilities", count: facilitiesData.length },
    { label: "Science & IT Labs", count: 4 },
    { label: "Mosque & Academic", count: 2 },
    { label: "Sports & Transport", count: 3 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Campus Infrastructure"
        title="College Facilities & Laboratories"
        subtitle="Purpose-built educational facilities designed to provide rigorous empirical scientific training, quiet study environments, and holistic student support."
        breadcrumbs={[{ label: "Facilities" }]}
        backgroundImage="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80"
      />

      {/* Facilities Showcase */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <SectionHeader
            badge="Infrastructure"
            badgeVariant="medical"
            title="Modern Educational"
            titleHighlight="Labs & Amenities"
            subtitle="Explore our fully equipped practical experimental bays, IT terminals, prayer hall, and dedicated transport routes."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilitiesData.map((fac) => (
              <div
                key={fac.id}
                id={fac.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group scroll-mt-32"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={fac.image}
                    alt={fac.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="px-3 py-1 rounded-full bg-gold-500 text-navy-950 text-xs font-bold shadow-md">
                      {fac.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">
                      {fac.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {fac.description}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-medical-600 dark:text-medical-400">
                      Key Highlights:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {fac.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-medical-500 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {fac.inCharge && (
                    <div className="pt-2 text-[11px] text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800">
                      In-Charge: <strong className="text-slate-700 dark:text-slate-200">{fac.inCharge}</strong>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
