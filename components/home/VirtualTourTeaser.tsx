"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Eye,
  Microscope,
  Stethoscope,
  Dna,
  BookOpen,
  Activity,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SectionHeader } from "../shared/SectionHeader";
import { Button } from "../ui/Button";

interface HotspotFacility {
  id: string;
  name: string;
  category: string;
  icon: any;
  description: string;
  specs: string[];
  image: string;
}

export const VirtualTourTeaser: React.FC = () => {
  const facilities: HotspotFacility[] = [
    {
      id: "fac-1",
      name: "Molecular Diagnostics & Real-Time PCR Suite",
      category: "Allied Health & Diagnostics",
      icon: Microscope,
      description:
        "Equipped with automated CFX96 PCR thermal cyclers, laminar biosafety cleanrooms, and automated gel documentation stations for precision genetic diagnosis.",
      specs: ["ISO 15189 Compliant", "Class II Type A2 Biosafety", "24 Digital Workstations"],
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "fac-2",
      name: "3D Anatomical & Surgical Demonstration Bay",
      category: "Pre-Medical & Anatomy",
      icon: Stethoscope,
      description:
        "High-definition stereoscopic microscopes, plastinated human anatomical models, and surgical suturing simulators providing clinical orientation.",
      specs: ["High-Def Stereo Optics", "3D Human Vascular Models", "Clinical Simulation Stations"],
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "fac-3",
      name: "Biotechnology Fermentation & CRISPR Lab",
      category: "Life Sciences & Genomics",
      icon: Dna,
      description:
        "Continuous perfusion bioreactors, electroporation equipment, and bio-informatics cluster nodes for gene editing and microbial bioprocess modeling.",
      specs: ["Recombinant DNA Licensed", "Industrial Bioreactors", "Bioinformatics Node"],
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "fac-4",
      name: "Central Medical & Scientific Digital Library",
      category: "Academic Resources",
      icon: BookOpen,
      description:
        "Over 45,000 physical volumes, subscriptions to PubMed, ScienceDirect, and BMJ journals, with 60 high-speed research terminals and collaborative study pods.",
      specs: ["45,000+ Print Volumes", "ScienceDirect & PubMed Access", "Quiet Study Pods"],
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "fac-5",
      name: "Olympic Sports Complex & Athletics Ground",
      category: "Athletics & Student Wellness",
      icon: Activity,
      description:
        "Synthetic athletic track, indoor badminton & squash courts, floodlit cricket arena, and fully equipped gym under certified fitness trainers.",
      specs: ["400m Synthetic Running Track", "Indoor Sports Arena", "Modern Cardio & Weights Gym"],
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const [activeFacility, setActiveFacility] = useState<HotspotFacility>(facilities[0]);

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Interactive Campus Tour"
          badgeVariant="gold"
          title="Explore Our State-of-the-Art"
          titleHighlight="Medical & Science Facilities"
          subtitle="Take a virtual walkthrough of our clinical laboratories, advanced biotechnology suites, and high-performance computing centers."
          align="center"
        />

        {/* Interactive Tour Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Facility Selector Tabs (4 cols) */}
          <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              {facilities.map((fac) => {
                const Icon = fac.icon;
                const isSelected = activeFacility.id === fac.id;
                return (
                  <button
                    key={fac.id}
                    onClick={() => setActiveFacility(fac)}
                    className={`w-full p-4 rounded-2xl text-left flex items-start gap-3.5 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-navy-900 text-white dark:bg-slate-800 shadow-lg border-l-4 border-medical-500 scale-[1.02]"
                        : "bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 ${
                        isSelected
                          ? "bg-medical-500 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-medical-600 dark:text-medical-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div
                        className={`text-[10px] uppercase font-bold tracking-wider ${
                          isSelected ? "text-medical-300" : "text-slate-400"
                        }`}
                      >
                        {fac.category}
                      </div>
                      <div
                        className={`text-sm font-semibold mt-0.5 ${
                          isSelected ? "text-white" : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {fac.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <Link href="/gallery">
                <Button
                  size="md"
                  variant="outline"
                  className="w-full justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View All 40+ Campus Photos & Videos
                </Button>
              </Link>
            </div>
          </div>

          {/* Active Facility Display Card (8 cols) */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 min-h-[450px] shadow-2xl flex flex-col justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFacility.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-0"
              >
                <Image
                  src={activeFacility.image}
                  alt={activeFacility.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Facility Details Overlay */}
            <div className="relative z-10 p-6 sm:p-8 text-white space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-500/30 border border-medical-500/40 text-medical-200 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activeFacility.category}</span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                {activeFacility.name}
              </h3>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                {activeFacility.description}
              </p>

              {/* Specs Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {activeFacility.specs.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-slate-200"
                  >
                    ✓ {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
