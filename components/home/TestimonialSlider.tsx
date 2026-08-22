"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonialsData } from "@/lib/data/admissions";
import { SectionHeader } from "../shared/SectionHeader";
import { Badge } from "../ui/Badge";

export const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonialsData.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonialsData.length - 1 ? 0 : prev + 1
    );
  };

  const current = testimonialsData[currentIndex];

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Voices of Bahria Hanif"
          badgeVariant="gold"
          title="Inspiring Stories from Our"
          titleHighlight="Scholars & Community"
          subtitle="Discover how our rigorous training, supportive faculty mentors, and medical culture shape lives and careers."
          align="center"
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Large Testimonial Card */}
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100/60 dark:from-slate-900 dark:to-navy-950 border border-slate-200/80 dark:border-slate-800 shadow-xl">
            <Quote className="absolute top-6 right-8 w-16 h-16 text-medical-500/10 dark:text-medical-400/10 pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-gold-400">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="text-base sm:text-xl md:text-2xl font-serif text-slate-800 dark:text-slate-100 leading-relaxed italic">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-medical-500/40 flex-shrink-0">
                    <Image
                      src={current.avatar}
                      alt={current.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                      {current.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-medical-600 dark:text-medical-400 font-semibold">
                      {current.programOrRelation}
                    </p>
                    {current.year && (
                      <span className="text-[11px] text-slate-400">
                        {current.year}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots indicator */}
            <div className="flex items-center gap-2">
              {testimonialsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? "w-8 bg-medical-600 dark:bg-medical-400"
                      : "w-2 bg-slate-300 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
