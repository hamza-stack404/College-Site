"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MeritCalculator } from "@/components/tools/MeritCalculator";
import { FeeChallanGenerator } from "@/components/tools/FeeChallanGenerator";
import {
  feeStructureData,
  requiredDocumentsList,
  admissionStepsPakistan,
  faqsData,
  admissionStatusNotice,
} from "@/lib/data/admissions";
import { COLLEGE_INFO } from "@/lib/data/constants";
import { formatCurrency } from "@/lib/utils";
import { submitAdmissionApplicationAction } from "@/lib/supabase/actions";
import {
  FileText,
  FileDown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertCircle,
  Layers,
  Send,
  Sparkles,
} from "lucide-react";

export default function AdmissionsPage() {
  const [showFeeGenerator, setShowFeeGenerator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  // Online Application form state
  const [formData, setFormData] = useState({
    applicant_name: "",
    father_name: "",
    father_service_category: "Civilian" as const,
    b_form_number: "",
    selected_discipline: "Pre-Medical" as const,
    matric_total_marks: 1100,
    matric_obtained_marks: 950,
    contact_phone: "",
    contact_email: "",
  });

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await submitAdmissionApplicationAction({
        ...formData,
        matric_total_marks: Number(formData.matric_total_marks),
        matric_obtained_marks: Number(formData.matric_obtained_marks),
      });

      setSubmitResult({
        success: res.success,
        message: res.message,
      });

      if (res.success) {
        setFormData({
          applicant_name: "",
          father_name: "",
          father_service_category: "Civilian",
          b_form_number: "",
          selected_discipline: "Pre-Medical",
          matric_total_marks: 1100,
          matric_obtained_marks: 950,
          contact_phone: "",
          contact_email: "",
        });
      }
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: err.message || "Failed to submit application.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* 2. Interactive Merit Calculator */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionHeader
            badge="Eligibility Check"
            badgeVariant="gold"
            title="Calculate Your"
            titleHighlight="FBISE Admission Aggregate"
            subtitle="Verify if your Matric scores satisfy minimum department cutoffs for Class 11."
            align="center"
          />

          <MeritCalculator />
        </div>
      </section>

      {/* 3. Online Admission Form (Connected to Supabase) */}
      <section className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800" id="apply-online">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionHeader
            badge="Direct Enrollment"
            badgeVariant="medical"
            title="Online Admission Application"
            titleHighlight="Intake Session 2026–2027"
            subtitle="Submit your initial registration details for document verification and merit list ranking."
            align="center"
          />

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            {submitResult && (
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm ${
                  submitResult.success
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200"
                }`}
              >
                {submitResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <div>{submitResult.message}</div>
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Ali"
                    value={formData.applicant_name}
                    onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Father&apos;s / Guardian&apos;s Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mahmood"
                    value={formData.father_name}
                    onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Applicant B-Form / CNIC *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="42201-1234567-1"
                    value={formData.b_form_number}
                    onChange={(e) => setFormData({ ...formData, b_form_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category Quota *
                  </label>
                  <select
                    value={formData.father_service_category}
                    onChange={(e) => setFormData({ ...formData, father_service_category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  >
                    <option value="Civilian">Civilian (Open Merit)</option>
                    <option value="Navy">Pakistan Navy Dependent</option>
                    <option value="Army">Pakistan Army Dependent</option>
                    <option value="Air Force">Pakistan Air Force Dependent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Applied Discipline *
                  </label>
                  <select
                    value={formData.selected_discipline}
                    onChange={(e) => setFormData({ ...formData, selected_discipline: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  >
                    <option value="Pre-Medical">F.Sc Pre-Medical</option>
                    <option value="Pre-Engineering">F.Sc Pre-Engineering</option>
                    <option value="Computer Science">ICS Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Matric Total Marks *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.matric_total_marks}
                    onChange={(e) => setFormData({ ...formData, matric_total_marks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Obtained Marks *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.matric_obtained_marks}
                    onChange={(e) => setFormData({ ...formData, matric_obtained_marks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="gold" size="md" className="w-full justify-center gap-2" disabled={isSubmitting}>
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting to Supabase..." : "Submit Online Application"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 4. Step-by-Step Admission Process */}
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

      {/* 5. Fee Structure Range & Policy */}
      <section className="py-20 bg-white dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800" id="fee-structure">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>* Note: Official monthly fee challan slips can be generated and printed below.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeeGenerator(!showFeeGenerator)}
                className="text-xs"
              >
                {showFeeGenerator ? "Hide Challan Generator" : "Open 3-Part Challan Preview"}
              </Button>
            </div>
          </div>

          {showFeeGenerator && (
            <div className="max-w-4xl mx-auto pt-6">
              <FeeChallanGenerator />
            </div>
          )}
        </div>
      </section>

      {/* 6. Required Documents Checklist */}
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

      {/* 7. Downloadable Forms */}
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

      {/* 8. FAQ Accordion */}
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
