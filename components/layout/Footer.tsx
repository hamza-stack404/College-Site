import React from "react";
import Link from "next/link";
import { CrestLogo } from "../icons/CrestLogo";
import { COLLEGE_INFO } from "@/lib/data/constants";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-900 overflow-hidden relative">
      {/* Top Banner / Board Affiliation Strip */}
      <div className="border-b border-navy-900/80 bg-navy-900/40 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold-400 flex-shrink-0" />
            <span className="font-semibold text-slate-200">
              Affiliation & Registration:
            </span>
            <span className="text-slate-300">
              {COLLEGE_INFO.affiliation}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <Award className="w-4 h-4 text-medical-400" />
              Intermediate Science & IT Streams (HSSC Part I & II)
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Contact (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <CrestLogo showText={true} className="text-white" />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Bahria College Hanif provides disciplined, high-achievement intermediate education in Pre-Medical, Pre-Engineering, and Computer Science (ICS) under the Federal Board of Intermediate and Secondary Education (FBISE) Islamabad.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-medical-400 flex-shrink-0 mt-0.5" />
                <span>{COLLEGE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-medical-400 flex-shrink-0" />
                <span>{COLLEGE_INFO.phonePrimary} / {COLLEGE_INFO.phoneSecondary}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-medical-400 flex-shrink-0" />
                <span>{COLLEGE_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Office Hours: {COLLEGE_INFO.officeHours}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Academic Groups */}
          <div>
            <h4 className="font-display font-bold text-white text-xs sm:text-sm uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">
              Groups Offered
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/groups/pre-medical" className="hover:text-medical-400 transition-colors">
                  F.Sc Pre-Medical (50 Seats)
                </Link>
              </li>
              <li>
                <Link href="/groups/pre-engineering" className="hover:text-medical-400 transition-colors">
                  F.Sc Pre-Engineering (100 Seats)
                </Link>
              </li>
              <li>
                <Link href="/groups/computer-science" className="hover:text-medical-400 transition-colors">
                  ICS Computer Science (200 Seats)
                </Link>
              </li>
              <li>
                <Link href="/facilities#fac-physics-lab" className="hover:text-medical-400 transition-colors">
                  Physics & Chemistry Labs
                </Link>
              </li>
              <li>
                <Link href="/facilities#fac-computer-lab" className="hover:text-medical-400 transition-colors">
                  Computer Science & IT Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Admissions & Notices */}
          <div>
            <h4 className="font-display font-bold text-white text-xs sm:text-sm uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">
              Admissions & Notices
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admissions" className="hover:text-medical-400 transition-colors">
                  Admission Procedure & Criteria
                </Link>
              </li>
              <li>
                <Link href="/notice-board" className="text-gold-400 font-semibold hover:underline transition-colors">
                  College Notice Board & Circulars
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-medical-400 transition-colors">
                  Campus Announcements
                </Link>
              </li>
              <li>
                <Link href="/admissions#fee-structure" className="hover:text-medical-400 transition-colors">
                  Approved Fee Structure (Civilian / Forces)
                </Link>
              </li>
              <li>
                <Link href="/results" className="text-medical-300 font-semibold hover:text-medical-200 transition-colors">
                  FBISE Board Results Gazette
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Facilities & Portal */}
          <div>
            <h4 className="font-display font-bold text-white text-xs sm:text-sm uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">
              Student & Campus
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/portal" className="text-gold-400 font-semibold hover:text-gold-300 transition-colors">
                  Student & Parent Portal Login
                </Link>
              </li>
              <li>
                <Link href="/facilities#fac-mosque" className="hover:text-medical-400 transition-colors">
                  College Mosque (Masjid)
                </Link>
              </li>
              <li>
                <Link href="/facilities#fac-library" className="hover:text-medical-400 transition-colors">
                  Central Library & Reading Hall
                </Link>
              </li>
              <li>
                <Link href="/facilities#fac-transport" className="hover:text-medical-400 transition-colors">
                  College Bus Transport Fleet
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="hover:text-medical-400 transition-colors">
                  Pioneer Batch & Future Alumni
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-medical-400 transition-colors">
                  Campus Helpdesk & Extensions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-navy-900 bg-navy-950 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Bahria College Hanif (Affiliated with FBISE Islamabad). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Code of Conduct
            </Link>
            <Link href="/admissions" className="hover:text-slate-400 transition-colors">
              Eligibility Criteria
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Contact Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
