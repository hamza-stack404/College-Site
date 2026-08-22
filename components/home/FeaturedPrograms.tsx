"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  GraduationCap,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { programsData } from "@/lib/data/programs";
import { SectionHeader } from "../shared/SectionHeader";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatCurrency } from "@/lib/utils";

export const FeaturedProgramsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Programs" },
    { id: "pre-medical", label: "Pre-Medical & Health" },
    { id: "medical-sciences", label: "Allied Diagnostics (BS MLT)" },
    { id: "biological-sciences", label: "Biotechnology" },
    { id: "computer-health-informatics", label: "Health AI & Computing" },
    { id: "cambridge-international", label: "Cambridge A-Levels" },
  ];

  const filteredPrograms =
    selectedCategory === "all"
      ? programsData
      : programsData.filter((p) => p.category === selectedCategory);

  return (
    <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Academic Excellence"
          badgeVariant="medical"
          title="World-Class Programs Designed for"
          titleHighlight="Future Healers & Innovators"
          subtitle="From foundation F.Sc pre-medical tracks to professional BS degrees in Diagnostic Technology and Biotechnology, explore our rigorous curricula."
          align="center"
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-navy-900 text-white dark:bg-medical-600 shadow-md scale-105"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program) => (
            <motion.div
              layout
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Card Image Cover */}
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge on Image */}
                {program.badge && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="gold" size="sm">
                      {program.badge}
                    </Badge>
                  </div>
                )}

                {/* Degree Level */}
                <div className="absolute bottom-4 left-4 text-xs font-semibold text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  {program.degreeLevel}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs text-medical-600 dark:text-medical-400 font-bold uppercase tracking-wider">
                    {program.department}
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white mt-1 group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                {/* Quick Meta */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-medical-500" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gold-500" />
                    <span>{program.seats} Seats Annual</span>
                  </div>
                </div>

                {/* Tuition & CTA */}
                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">
                      Semester Tuition
                    </div>
                    <div className="text-base font-black text-navy-950 dark:text-white font-display">
                      {formatCurrency(program.feePerSemester)}
                    </div>
                  </div>

                  <Link href={`/academics/${program.slug}`}>
                    <Button
                      size="sm"
                      variant="primary"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      View Program
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Explorer Action */}
        <div className="mt-14 text-center">
          <Link href="/academics">
            <Button size="lg" variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Full Academic Curriculum & Syllabi
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
