import React from "react";
import { PageHero } from "@/components/shared/PageHero";
import { PortalLoginForm } from "@/components/portal/PortalLoginForm";

export const metadata = {
  title: "Student, Faculty & Parent Portal",
  description:
    "Secure unified portal for Bahria College Hanif students, faculty members, and parents to review grades, attendance, timetables, and fee dues.",
};

export default function PortalPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Unified Campus ERP"
        title="Student & Faculty Portal"
        subtitle="Access real-time lecture timetables, diagnostic examination gradebooks, attendance logs, and fee challans in one secure environment."
        breadcrumbs={[{ label: "Campus Portal" }]}
        backgroundImage="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PortalLoginForm />
        </div>
      </section>
    </div>
  );
}
