"use client";

import React from "react";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  feeStructureData,
  requiredDocumentsList,
  admissionStepsPakistan,
  faqsData,
  admissionStatusNotice,
} from "@/lib/data/admissions";
import { COLLEGE_INFO, FEE_TIERS } from "@/lib/data/constants";
import { formatCurrency } from "@/lib/utils";
import {
  FileText,
  FileDown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertCircle,
  Layers,
  PhoneCall,
} from "lucide-react";

export default function AdmissionsPage() {
  const downloadableForms = [
    { title: "College Admission Application Form (Printable)", size: "1.2 MB", format: "PDF" },
    { title: "Student Medical Fitness Certificate Form", size: "650 KB", format: "PDF" },
    { title: "Student Discipline & Attendance Undertaking Affidavit", size: "850 KB", format: "PDF" },
    { title: "College Bus Transport Registration Form", size: "720 KB", format: "PDF" },
  ];

  const accordionItems = faqsData.map((f) => ({
    id: f.id,
    title: f.question,
    badge: f.category,
    content: <p>{f.answer}</p>,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge={`Admissions Status: ${admissionStatusNotice.status}`}
        title="Admissions & Eligibility"
        subtitle="Comprehensive guide to Class 11 merit-based admission criteria, required document verification, fee schedules, and FBISE enrollment guidelines."
        breadcrumbs={[{ label: "Admissions" }]}
        backgroundImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
      />

      {/* 1. Admission Status Banner */}
      <section className="py-8 bg-amber-500/10 border-b border-amber-500/20 text-slate-800 dark:text-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-navy-950 flex-shrink-0 font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Current Intake Notification
              </div>
              <p className="text-xs sm:text-sm font-medium">
                {admissionStatusNotice.message}
              </p>
            </div>
          </div>
          <Link href="/notice-board" className="hidden sm:inline-flex flex-shrink-0">
            <Button variant="outline" size="sm" className="text-xs">
              Check Notice Board
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Step-by-Step Admission Process */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Admission Roadmap"
            badgeVariant="medical"
            title="Step-by-Step Pathway to"
            titleHighlight="Enrollment at Hanif"
            subtitle="From obtaining the prospectus to merit list display and orientation, review our standard admission cycle."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {admissionStepsPakistan.map((step) => (
              <div
                key={step.step}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-navy-950 text-gold-400 dark:bg-gold-500 dark:text-navy-950 font-display font-black text-lg flex items-center justify-center">
                    0{step.step}
                  </div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Fee Structure Range & Policy */}
      <section className="py-20 bg-white dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800" id="fee-structure">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Fee Schedule"
            badgeVariant="gold"
            title="Standard Approved"
            titleHighlight="College Fee Structure"
            subtitle="Transparent fee schedules featuring subsidized monthly rates for Armed Forces dependents and standard rates for Civilians."
            align="center"
          />

          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-navy-950 text-white font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-4 px-5">Academic Group</th>
                    <th className="py-4 px-5">Admission (One-Time)</th>
                    <th className="py-4 px-5">Civilian Monthly</th>
                    <th className="py-4 px-5">Armed Forces Monthly</th>
                    <th className="py-4 px-5">Science/IT Lab Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {feeStructureData.map((fee, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                        {fee.groupName}
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-300">
                        {formatCurrency(fee.admissionFee)}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                        {formatCurrency(fee.monthlyTuitionCivilian)} / mo
                      </td>
                      <td className="py-4 px-5 font-bold text-medical-600 dark:text-medical-400">
                        {formatCurrency(fee.monthlyTuitionForces)} / mo
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-300">
                        {formatCurrency(fee.scienceLabMonthlyFee)} / mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
              * Note: Enrolled students and parents can view, track, and download official monthly fee challan slips directly via their Student Portal login.
            </div>
          </div>
        </div>
      </section>

      {/* 4. Required Documents Checklist */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionHeader
            badge="Documentation"
            badgeVariant="navy"
            title="Documents Required for"
            titleHighlight="Class 11 Enrollment"
            subtitle="Please prepare attested copies of all required documents prior to final submission."
            align="center"
          />

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md divide-y divide-slate-100 dark:divide-slate-800">
            {requiredDocumentsList.map((doc, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-medical-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    {doc.title}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 pl-7 sm:pl-0 flex-shrink-0">
                  {doc.copies}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Downloadable Forms */}
      <section className="py-20 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionHeader
            badge="Downloads"
            badgeVariant="gold"
            title="Download Official"
            titleHighlight="Admission Packs & Undertakings"
            subtitle="Printable admission forms and verification certificates."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {downloadableForms.map((doc, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="p-2.5 rounded-2xl bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400 w-fit">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    {doc.title}
                  </h4>
                  <div className="text-xs text-slate-400">
                    {doc.format} • {doc.size}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-center gap-1.5 text-xs"
                  onClick={() => alert(`Downloading verified document: ${doc.title}`)}
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download Form</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionHeader
            badge="Frequently Asked Questions"
            badgeVariant="medical"
            title="Common Inquiries About"
            titleHighlight="Admissions & Life at Hanif"
            subtitle="Clear answers on FBISE equivalence, documents, transport, and fees."
            align="center"
          />

          <Accordion items={accordionItems} allowMultiple={true} defaultExpandedIds={["faq-1"]} />
        </div>
      </section>
    </div>
  );
}
