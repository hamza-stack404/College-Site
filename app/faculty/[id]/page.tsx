import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { facultyData } from "@/lib/data/faculty";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Award,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Send,
} from "lucide-react";

interface FacultyDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return facultyData.map((faculty) => ({
    id: faculty.id,
  }));
}

export function generateMetadata({ params }: FacultyDetailPageProps) {
  const member = facultyData.find((f) => f.id === params.id);
  if (!member) return { title: "Faculty Not Found" };

  return {
    title: `${member.name} — ${member.designation}`,
    description: member.bio,
  };
}

export default function FacultyDetailPage({ params }: FacultyDetailPageProps) {
  const member = facultyData.find((f) => f.id === params.id);

  if (!member) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge={member.department}
        title={member.name}
        subtitle={`${member.designation} • ${member.qualification}`}
        breadcrumbs={[
          { label: "Faculty Directory", href: "/faculty" },
          { label: member.name },
        ]}
        backgroundImage={member.image}
      />

      <div className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content Area (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Biography */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="medical" size="sm">
                    Academic Biography
                  </Badge>
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                  About {member.name}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {member.bio}
                </p>

                {/* Research Interests */}
                <div className="pt-4 space-y-3">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Primary Research Domains
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.researchInterests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-medical-50 dark:bg-medical-950/80 border border-medical-200 dark:border-medical-800 text-xs font-semibold text-medical-800 dark:text-medical-300"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Peer-Reviewed Publications */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gold-500" />
                    <span>Peer-Reviewed Publications ({member.publications.length})</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  {member.publications.map((pub, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 space-y-2"
                    >
                      <div className="text-xs font-bold text-gold-600 dark:text-gold-400">
                        {pub.journal} • {pub.year}
                      </div>
                      <h4 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug">
                        &ldquo;{pub.title}&rdquo;
                      </h4>
                      {pub.doi && (
                        <div className="text-xs text-slate-400 font-mono pt-1 flex items-center gap-1">
                          <span>DOI: {pub.doi}</span>
                          <ExternalLink className="w-3 h-3 text-medical-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses Taught */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-medical-600 dark:text-medical-400" />
                  <span>Current Teaching Curriculum</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {member.coursesTaught.map((course, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-medical-500 flex-shrink-0" />
                      <span>{course}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Profile & Contact Card (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 sticky top-28">
                <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="400px"
                  />
                </div>

                <div>
                  <div className="text-xs font-bold text-medical-600 dark:text-medical-400 uppercase tracking-wider">
                    {member.department}
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{member.designation}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-medical-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Email Address</div>
                      <a href={`mailto:${member.email}`} className="text-medical-600 hover:underline">
                        {member.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-medical-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Office Extension</div>
                      <span>{member.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Office Location</div>
                      <span>{member.office}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/contact" className="block w-full">
                    <Button variant="primary" size="md" className="w-full justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Request Research Consultation
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
