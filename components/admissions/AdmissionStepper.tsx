"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { admissionSteps, admissionDeadlines } from "@/lib/data/admissions";
import { admissionInquirySchema, AdmissionInquiryData } from "@/lib/validations/forms";
import { CheckCircle2, Sparkles, Send, FileText, Calendar, ArrowRight, Download } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";

export const AdmissionStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionInquiryData>({
    resolver: zodResolver(admissionInquirySchema),
    defaultValues: {
      hostelRequired: false,
      transportRequired: false,
    },
  });

  const onSubmit = async (data: AdmissionInquiryData) => {
    // Simulate API network submission
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    reset();
  };

  return (
    <div className="space-y-12">
      {/* Interactive Stepper Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <div>
            <span className="text-xs text-medical-600 dark:text-medical-400 font-bold uppercase tracking-wider">
              Admission Procedure
            </span>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              5-Step Pathway to Enrollment
            </h3>
          </div>
          <Button
            size="sm"
            variant="gold"
            onClick={() => {
              setIsSubmitted(false);
              setIsApplyModalOpen(true);
            }}
          >
            Start Application
          </Button>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
          {admissionSteps.map((stepItem, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                activeStep === idx
                  ? "bg-navy-900 text-white dark:bg-medical-950 dark:border dark:border-medical-600 shadow-md scale-[1.02]"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeStep === idx
                      ? "bg-gold-500 text-navy-950"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {stepItem.step}
                </span>
                {idx < activeStep && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <div className="text-xs font-bold line-clamp-1">{stepItem.title}</div>
            </button>
          ))}
        </div>

        {/* Active Step Content Box */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="gold" size="sm">
                Step {admissionSteps[activeStep].step} of 5
              </Badge>
              <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {admissionSteps[activeStep].title}
              </h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {admissionSteps[activeStep].description}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {activeStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveStep((prev) => prev - 1)}
              >
                Previous Step
              </Button>
            )}
            {activeStep < admissionSteps.length - 1 ? (
              <Button
                variant="medical"
                size="sm"
                onClick={() => setActiveStep((prev) => prev + 1)}
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  setIsSubmitted(false);
                  setIsApplyModalOpen(true);
                }}
              >
                Submit Form
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Deadlines Schedule */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gold-50 dark:bg-gold-950 text-gold-600 dark:text-gold-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-gold-600 dark:text-gold-400 font-bold uppercase tracking-wider">
                Important Schedule
              </span>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Key Dates & Deadlines (Fall 2026)
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {admissionDeadlines.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {item.event}
                </div>
                <div className="text-sm font-bold text-navy-950 dark:text-white">
                  {item.date}
                </div>
              </div>
              <Badge
                variant={item.status === "Active" ? "medical" : "slate"}
                size="sm"
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Application Form */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Bahria College Hanif — Online Admission Form"
        subtitle="Complete your initial registration for the Academic Session 2026–2027."
        maxWidth="2xl"
      >
        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              Application Submitted Successfully!
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Your application reference number is{" "}
              <strong className="text-medical-600 dark:text-medical-400">
                BCH-2026-{Math.floor(10000 + Math.random() * 90000)}
              </strong>
              . Our admissions officer will contact you within 24 hours with your aptitude test schedule.
            </p>
            <div className="pt-4">
              <Button
                variant="primary"
                onClick={() => setIsApplyModalOpen(false)}
              >
                Close Window
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Applicant Full Name *
                </label>
                <input
                  {...register("studentName")}
                  placeholder="e.g. Zainab Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
                {errors.studentName && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.studentName.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Father / Guardian Name *
                </label>
                <input
                  {...register("guardianName")}
                  placeholder="e.g. Tariq Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
                {errors.guardianName && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.guardianName.message}
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
                  placeholder="zainab@example.com"
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
                  Mobile / WhatsApp Number *
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Program of Interest *
                </label>
                <select
                  {...register("selectedProgram")}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                >
                  <option value="">Select Academic Program</option>
                  <option value="fsc-pre-medical">F.Sc Pre-Medical</option>
                  <option value="bs-medical-lab-tech">BS Medical Lab Technology (BS MLT)</option>
                  <option value="bs-biotechnology">BS Biotechnology</option>
                  <option value="bs-computer-science-health-informatics">BS CS (Health AI)</option>
                  <option value="fsc-pre-engineering">F.Sc Pre-Engineering</option>
                  <option value="cambridge-a-levels-medical-science">Cambridge A-Levels</option>
                </select>
                {errors.selectedProgram && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.selectedProgram.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Previous Qualification & Percentage *
                </label>
                <input
                  {...register("percentageOrGrade")}
                  placeholder="e.g. Matric FBISE (88%) or 6 A*s O-Levels"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
                {errors.percentageOrGrade && (
                  <span className="text-[11px] text-rose-500 mt-1 block">
                    {errors.percentageOrGrade.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                City of Residence *
              </label>
              <input
                {...register("city")}
                placeholder="e.g. Karachi / Islamabad / Hyderabad"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
              {errors.city && (
                <span className="text-[11px] text-rose-500 mt-1 block">
                  {errors.city.message}
                </span>
              )}
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("hostelRequired")}
                  className="w-4 h-4 text-medical-600 rounded"
                />
                <span>Hostel Required</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("transportRequired")}
                  className="w-4 h-4 text-medical-600 rounded"
                />
                <span>College Bus Transit Required</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsApplyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gold"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
