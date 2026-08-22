import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Compass, Stethoscope, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl w-full text-center space-y-6 p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-medical-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex p-4 rounded-2xl bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400">
          <Stethoscope className="w-12 h-12 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="font-display font-black text-6xl sm:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-navy-900 via-medical-600 to-gold-500 dark:from-white dark:via-medical-400 dark:to-gold-400">
            404
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Specimen Page Not Located
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            The medical record or collegiate page you requested appears to have been relocated or does not exist in our institutional database.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary" size="lg" leftIcon={<Home className="w-4 h-4" />}>
              Return to Homepage
            </Button>
          </Link>
          <Link href="/academics">
            <Button variant="outline" size="lg" leftIcon={<Compass className="w-4 h-4" />}>
              Explore Academic Programs
            </Button>
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-center gap-2">
          <span>Need immediate assistance? Contact Student Admissions:</span>
          <a
            href="tel:+922134859100"
            className="text-medical-600 dark:text-medical-400 font-semibold hover:underline"
          >
            +92 21 3485 9100
          </a>
        </div>
      </div>
    </div>
  );
}
