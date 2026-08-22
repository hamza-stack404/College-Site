"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Play,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { KeyStatsSection } from "../shared/StatsCounter";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-navy-950 text-white flex flex-col justify-center">
      {/* Background Media with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=2000&q=85"
          alt="Bahria College Hanif Medical Science Laboratories"
          fill
          priority
          className="object-cover object-center opacity-25 mix-blend-luminosity scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/80" />
      </div>

      {/* Subtle Animated Glowing Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-medical-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Action Buttons (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Pioneering Excellence in Medical & Biological Sciences</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.1]"
            >
              Where Compassion Meets{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-400 via-teal-300 to-gold-400">
                Scientific Innovation.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0"
            >
              Bahria College Hanif empowers future physicians, diagnostic technologists, and biotech researchers with Oxford-trained faculty, clinical hospital affiliations, and exceptional MDCAT success.
            </motion.p>

            {/* Call to Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link href="/admissions">
                <Button size="xl" variant="gold" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Explore Admissions Fall 2026
                </Button>
              </Link>
              <Link href="/academics">
                <Button size="xl" variant="outline" className="text-white border-white/20 hover:bg-white/10">
                  View Academic Programs
                </Button>
              </Link>
            </motion.div>

            {/* Key Trust Signals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-medical-400" />
                <span>94.2% MDCAT Merit Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-medical-400" />
                <span>PMDC & HEC Recognized</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-medical-400" />
                <span>12+ Molecular Diagnostic Labs</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Highlight Card / Visual Focus (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Glassmorphic Showcase Card */}
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl space-y-6">
              {/* Badge & Stat */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-medical-500/20 border border-medical-500/30 text-medical-400">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white">
                      Pre-Medical Excellence
                    </h3>
                    <p className="text-xs text-slate-300">National MDCAT Cohort 2026</p>
                  </div>
                </div>
                <Badge variant="gold" size="sm">
                  Top Tier
                </Badge>
              </div>

              {/* Image Preview with Play Tour Button */}
              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
                  alt="Laboratory Facility"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="font-semibold">Advanced Molecular & PCR Suite</span>
                  <Link
                    href="/gallery"
                    className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </Link>
                </div>
              </div>

              {/* Fast Fact Highlight */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl font-bold font-display text-gold-400">100%</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Merit Scholarships Available</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl font-bold font-display text-medical-400">1:12</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Faculty-to-Student Ratio</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Live Animated Key Statistics Bar */}
        <div className="mt-16 sm:mt-24 pt-10 border-t border-white/10">
          <KeyStatsSection />
        </div>
      </div>
    </section>
  );
};
