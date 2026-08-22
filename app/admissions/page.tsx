"use client";

import React from "react";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AdmissionStepper } from "@/components/admissions/AdmissionStepper";
import { FeeCalculator } from "@/components/admissions/FeeCalculator";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { feeStructureData, faqsData } from "@/lib/data/admissions";
import { formatCurrency } from "@/lib/utils";
import {
  FileText,
  FileDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  Clock,
} from "lucide-react";

export default function AdmissionsPage() {
  const downloadableForms = [
    { title: "Standard Admission Application Form (Printable)", size: "1.8 MB", format: "PDF" },
    { title: "Student Medical Fitness & Immunization Certificate", size: "850 KB", format: "PDF" },
    { title: "Hostel Accommodation & Dining Mess Registration", size: "1.1 MB", format: "PDF" },
    { title: "Hanif Merit & Need-Based Scholarship Financial Form", size: "1.4 MB", format: "PDF" },
    { title: "Code of Conduct & Institutional Honor Code Undertaking", size: "920 KB", format: "PDF" },
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
        badge="Fall 2026 Admissions Active"
        title="Admissions, Fees & Scholarships"
        subtitle="Embark on an illustrious medical and scientific education. Review our step-by-step admission roadmap, transparent fee schedules, and full merit scholarship criteria."
        breadcrumbs={[{ label: "Admissions" }]}
        backgroundImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
      />

      {/* 1. Admission Stepper & Application Process */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Admission Roadmap"
            badgeVariant="medical"
            title="Step-by-Step Pathway to"
            titleHighlight="Your White Coat"
            subtitle="From digital application submission to aptitude assessment and induction, follow our clear enrollment journey."
            align="center"
          />

          <AdmissionStepper />
        </div>
      </section>

      {/* 2. Interactive Fee Calculator */}
      <section className="py-20 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Cost Estimator"
            badgeVariant="gold"
            title="Plan Your Investment in"
            titleHighlight="Medical Excellence"
            subtitle="Use our calculator to estimate semester tuition, Board fees, hostel accommodation, and applicable Hanif merit waivers."
            align="center"
          />

          <FeeCalculator />
        </div>
      </section>

      {/* 3. Official Fee Structure Matrix Table */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Transparent Pricing"
            badgeVariant="navy"
            title="Official Approved"
            titleHighlight="Fee Schedule 2026–2027"
            subtitle="All dues are billed in Pakistani Rupees (PKR) and payable semester-wise or via 3-month installment plans."
            align="center"
          />

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-navy-950 text-white font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-4 px-5">Academic Group</th>
                    <th className="py-4 px-5">One-Time Admission</th>
                    <th className="py-4 px-5">Tuition / Month</th>
                    <th className="py-4 px-5">Science Lab / Month</th>
                    <th className="py-4 px-5">Registration</th>
                    <th className="py-4 px-5">Annual Examination</th>
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
                      <td className="py-4 px-5">
                        {formatCurrency(fee.admissionFee)}
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-300">
                        {formatCurrency(fee.monthlyTuitionFee)}
                      </td>
                      <td className="py-4 px-5 font-bold text-medical-600 dark:text-medical-400">
                        {formatCurrency(fee.scienceLabMonthlyFee)}
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-300">
                        {formatCurrency(fee.prospectusAndRegistrationFee)}
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-300">
                        {formatCurrency(fee.annualExaminationFee)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Hanif Merit Scholarship Policy */}
      <section className="py-20 bg-white dark:bg-slate-950" id="scholarships">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-navy-900 via-navy-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-navy-800 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-6">
              <Badge variant="gold" size="md">
                Merit First Initiative
              </Badge>
              <h3 className="font-display font-black text-2xl sm:text-4xl text-white">
                Hanif Foundation Merit Scholarships (Up to 100% Waiver)
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                We firmly believe that financial limitations must never impede gifted scientific minds. Every year, over PKR 100 Million is disbursed in academic merit waivers to deserving high-achievers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-xl font-bold font-display text-gold-400">100% Waiver</div>
                  <div className="text-xs text-slate-300">Top 10 Board Positions / 8+ A*s in O-Levels</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-xl font-bold font-display text-medical-400">50% Waiver</div>
                  <div className="text-xs text-slate-300">85%+ Marks in Matric / 5+ A*s in O-Levels</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-xl font-bold font-display text-teal-400">Need-Based Aid</div>
                  <div className="text-xs text-slate-300">Custom financial subsidies upon family review</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Downloadable Forms & Prospectus */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Documentation Center"
            badgeVariant="gold"
            title="Download Official"
            titleHighlight="Admission Packs & Forms"
            subtitle="Download printable verification forms, affidavit undertakings, and medical fitness certificates."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloadableForms.map((doc, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400 flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {doc.title}
                    </h4>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {doc.format} • {doc.size}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={() => alert(`Downloading verified admission form: ${doc.title}`)}
                >
                  <FileDown className="w-4 h-4 text-medical-600 dark:text-medical-400" />
                  Download Document
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Frequently Asked Questions"
            badgeVariant="medical"
            title="Clarifications on"
            titleHighlight="Admissions & Life at Hanif"
            subtitle="Have questions about IBCC equivalence, entrance exam dates, installment plans, or hostels? Find direct answers below."
            align="center"
          />

          <Accordion items={accordionItems} allowMultiple={true} defaultExpandedIds={["faq-1"]} />
        </div>
      </section>
    </div>
  );
}
