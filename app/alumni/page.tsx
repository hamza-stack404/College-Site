"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { alumniData, alumniGivingTiers } from "@/lib/data/alumni";
import { alumniRegisterSchema, AlumniRegisterData } from "@/lib/validations/forms";
import {
  GraduationCap,
  Globe,
  Award,
  HeartHandshake,
  CheckCircle2,
  Send,
  Building,
  UserCheck,
  Quote,
} from "lucide-react";

export default function AlumniPage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AlumniRegisterData>({
    resolver: zodResolver(alumniRegisterSchema),
    defaultValues: {
      willingToMentor: true,
      graduationYear: 2020,
    },
  });

  const onSubmit = async (data: AlumniRegisterData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRegistered(true);
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 },
    });
    reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Global Alumni Network"
        title="Alumni Hall of Fame & Giving Back"
        subtitle="Over 12,000 physicians, scientists, and industry pioneers worldwide represent the indomitable legacy of Bahria College Hanif."
        breadcrumbs={[{ label: "Alumni Network" }]}
        backgroundImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
      />

      {/* 1. Alumni Hall of Fame */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Notable Scholars"
            badgeVariant="gold"
            title="Distinguished Alumni"
            titleHighlight="Transforming Global Health"
            subtitle="From surgical operating theatres in Baltimore to cancer mRNA laboratories in Germany, explore their inspiring journeys."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {alumniData.map((alumnus) => (
              <div
                key={alumnus.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                      <Image
                        src={alumnus.image}
                        alt={alumnus.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        {alumnus.name}
                      </h4>
                      <p className="text-xs text-medical-600 dark:text-medical-400 font-semibold">
                        Class of {alumnus.graduationYear} • {alumnus.program}
                      </p>
                      {alumnus.verifiedBadge && (
                        <span className="inline-block text-[10px] text-slate-400 mt-0.5">
                          {alumnus.verifiedBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  <blockquote className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic font-serif leading-relaxed border-l-2 border-medical-500 pl-3">
                    &ldquo;{alumnus.quote}&rdquo;
                  </blockquote>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {alumnus.story}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-medical-500" />
                  <span>{alumnus.location}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Join Network Bar */}
          <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-navy-900 to-navy-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-navy-800 shadow-xl">
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Are you a Bahria College Hanif Alumnus?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Register in the official global directory to mentor current scholars, attend reunions, and access research networks.
              </p>
            </div>
            <Button
              variant="gold"
              size="lg"
              onClick={() => {
                setIsRegistered(false);
                setIsRegisterModalOpen(true);
              }}
              leftIcon={<UserCheck className="w-4 h-4" />}
            >
              Join Alumni Directory
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Endowment & Give-Back Section */}
      <section className="py-20 bg-white dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800" id="give-back">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Philanthropy & Legacy"
            badgeVariant="medical"
            title="Sponsor a Future Doctor &"
            titleHighlight="Support Science Endowments"
            subtitle="Your tax-exempt donations directly sponsor student merit scholarships, PCR lab equipment, and cutting-edge cancer AI compute clusters."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {alumniGivingTiers.map((tier, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="space-y-4">
                  <Badge variant={idx === 1 ? "gold" : "medical"} size="sm">
                    Tier {idx + 1}
                  </Badge>
                  <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    {tier.name}
                  </h4>
                  <div className="font-display font-black text-2xl text-navy-950 dark:text-white">
                    {tier.amount}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="pt-2 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {tier.benefits.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-medical-500 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => alert(`Pledge intent for: ${tier.name}. Our Endowment Director will reach out to you directly.`)}
                >
                  Pledge Endowment Gift
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Registration Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Alumni Network Registration"
        subtitle="Connect with over 12,000 Bahria Hanif alumni across medical institutes worldwide."
        maxWidth="2xl"
      >
        {isRegistered ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              Welcome to the Alumni Network!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Your profile has been added to our verified institutional alumni register. You will receive invitations to upcoming medical symposiums and mentoring webinars.
            </p>
            <Button variant="primary" size="sm" onClick={() => setIsRegisterModalOpen(false)}>
              Close Window
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  {...register("fullName")}
                  placeholder="Dr. Maryam Nawaz"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
                {errors.fullName && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Graduation Year *
                </label>
                <input
                  type="number"
                  {...register("graduationYear", { valueAsNumber: true })}
                  placeholder="2018"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
                {errors.graduationYear && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.graduationYear.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Program Completed *
                </label>
                <select
                  {...register("programCompleted")}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                >
                  <option value="">Select Completed Program</option>
                  <option value="F.Sc Pre-Medical">F.Sc Pre-Medical</option>
                  <option value="BS Medical Lab Technology">BS Medical Lab Technology</option>
                  <option value="BS Biotechnology">BS Biotechnology</option>
                  <option value="F.Sc Pre-Engineering">F.Sc Pre-Engineering</option>
                  <option value="Cambridge A-Levels">Cambridge A-Levels</option>
                </select>
                {errors.programCompleted && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.programCompleted.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current Role / Specialization *
                </label>
                <input
                  {...register("currentPosition")}
                  placeholder="e.g. Resident Surgeon"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
                {errors.currentPosition && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.currentPosition.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current Hospital / Organization *
                </label>
                <input
                  {...register("currentOrganization")}
                  placeholder="e.g. Aga Khan University Hospital"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
                {errors.currentOrganization && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.currentOrganization.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current City & Country *
                </label>
                <input
                  {...register("cityCountry")}
                  placeholder="e.g. London, United Kingdom"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
                {errors.cityCountry && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.cityCountry.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="maryam@example.com"
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
                  Contact Phone Number *
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
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("willingToMentor")}
                  className="w-4 h-4 text-medical-600 rounded"
                />
                <span>I am willing to mentor current Bahria Hanif pre-medical/science students.</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => setIsRegisterModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" isLoading={isSubmitting}>
                Complete Alumni Registration
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
