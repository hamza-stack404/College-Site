"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { contactFormSchema, ContactFormData } from "@/lib/validations/forms";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Navigation,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    reset();
  };

  const departments = [
    {
      dept: "Admissions & Student Affairs",
      extension: "Ext. 101 / 102",
      phone: "+92 21 3485 9100",
      email: "admissions@bahriahanif.edu.pk",
      inCharge: "Mr. Farooq Azam (Registrar)",
    },
    {
      dept: "Dean of Medical Sciences Office",
      extension: "Ext. 201",
      phone: "+92 21 3485 9101",
      email: "dean.medical@bahriahanif.edu.pk",
      inCharge: "Prof. Dr. Tariq Mahmood Khan",
    },
    {
      dept: "Accounts & Financial Aid Directorate",
      extension: "Ext. 110",
      phone: "+92 21 3485 9104",
      email: "accounts@bahriahanif.edu.pk",
      inCharge: "Mrs. Nighat Sultana (Finance Lead)",
    },
    {
      dept: "Hostel & Transit Fleet Desk",
      extension: "Ext. 140",
      phone: "+92 21 3485 9108",
      email: "hostels@bahriahanif.edu.pk",
      inCharge: "Capt. (R) Asad Mehmood",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Direct Communications"
        title="Contact Us & Campus Location"
        subtitle="Connect with our Admissions Office, Academic Dean, or Student Affairs team. We are always at your service."
        breadcrumbs={[{ label: "Contact Us" }]}
        backgroundImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6">
              <div>
                <Badge variant="medical" size="sm">
                  Inquiry Portal
                </Badge>
                <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mt-2">
                  Send an Official Inquiry
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Our admissions counselors and department leads respond within 1 business day.
                </p>
              </div>

              {isSuccess ? (
                <div className="p-8 text-center space-y-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    Message Dispatched Successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Bahria College Hanif. A department representative will respond to your provided email address shortly.
                  </p>
                  <Button variant="primary" size="sm" onClick={() => setIsSuccess(false)}>
                    Send Another Inquiry
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
                        placeholder="e.g. Dr. Salman Qureshi"
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
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        placeholder="salman@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                      />
                      {errors.email && (
                        <span className="text-[11px] text-rose-500 mt-1 block">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Number *
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

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Recipient Department *
                      </label>
                      <select
                        {...register("department")}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                      >
                        <option value="">Select Department</option>
                        <option value="Admissions & Eligibility">Admissions & Eligibility</option>
                        <option value="Pre-Medical Academic Directorate">Pre-Medical Academic Directorate</option>
                        <option value="BS Medical Lab Tech (MLT) Chair">BS Medical Lab Tech (MLT) Chair</option>
                        <option value="Accounts & Scholarship Directorate">Accounts & Scholarship Directorate</option>
                        <option value="Hostel & Transport Desk">Hostel & Transport Desk</option>
                      </select>
                      {errors.department && (
                        <span className="text-[11px] text-rose-500 mt-1 block">
                          {errors.department.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Inquiry Subject *
                    </label>
                    <input
                      {...register("subject")}
                      placeholder="e.g. Inquiry regarding MDCAT weekend drill registration"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                    />
                    {errors.subject && (
                      <span className="text-[11px] text-rose-500 mt-1 block">
                        {errors.subject.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Detailed Message *
                    </label>
                    <textarea
                      rows={4}
                      {...register("message")}
                      placeholder="Please write your questions or feedback..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
                    />
                    {errors.message && (
                      <span className="text-[11px] text-rose-500 mt-1 block">
                        {errors.message.message}
                      </span>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      isLoading={isSubmitting}
                      className="w-full justify-center gap-2"
                    >
                      <span>Transmit Official Message</span>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Campus Info & Extensions (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Campus Address Card */}
              <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl border border-navy-800">
                <Badge variant="gold" size="sm">
                  Campus Headquarters
                </Badge>
                <h4 className="font-display font-bold text-xl text-white">
                  Bahria College Hanif
                </h4>

                <div className="space-y-3 text-xs text-slate-300 pt-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-medical-400 flex-shrink-0 mt-0.5" />
                    <span>
                      Hanif Science & Medical Pavilion, National Stadium Road, Karachi, 75260, Pakistan
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-medical-400 flex-shrink-0" />
                    <span>+92 (21) 3485-9100 / 3485-9101</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-medical-400 flex-shrink-0" />
                    <span>info@bahriahanif.edu.pk</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-medical-400 flex-shrink-0" />
                    <span>Monday – Saturday: 08:00 AM – 04:30 PM PST</span>
                  </div>
                </div>
              </div>

              {/* Department Extension Directory */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-medical-600 dark:text-medical-400" />
                  <span>Direct Department Extensions</span>
                </h4>

                <div className="space-y-3">
                  {departments.map((dept, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>{dept.dept}</span>
                        <span className="text-medical-600 dark:text-medical-400">{dept.extension}</span>
                      </div>
                      <div className="text-slate-500 flex justify-between">
                        <span>{dept.inCharge}</span>
                        <a href={`mailto:${dept.email}`} className="text-medical-600 hover:underline">
                          {dept.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Visual Section */}
      <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800" id="map">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Geographic Location"
            badgeVariant="gold"
            title="Navigating to Hanif Campus"
            subtitle="Centrally situated on National Stadium Road with direct access from all metropolitan avenues and expressways."
            align="center"
          />

          <div className="relative h-96 w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-900 flex items-center justify-center text-center p-8">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#22b9af_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 max-w-md space-y-3 text-white">
              <div className="w-12 h-12 rounded-full bg-medical-500/20 border border-medical-500/40 text-medical-300 mx-auto flex items-center justify-center">
                <Navigation className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-display font-bold text-xl text-white">
                Interactive Satellite Campus Map
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                National Stadium Road, Adjacent to Tertiary Teaching Hospital, Karachi. Accessible via Green Line & College Bus Routes.
              </p>
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=National+Stadium+Karachi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="gold" size="sm">
                    Open in Google Maps
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
