import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Stethoscope,
  Dna,
  Cpu,
  Trophy,
  Activity,
  Home,
  ShieldAlert,
  Bus,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Campus Life — Clubs, Hostels, Sports & Amenities",
  description:
    "Explore dynamic student life at Bahria College Hanif: MedSoc, biotech symposiums, sports complex, hostels, and metropolitan transit fleet.",
};

export default function CampusLifePage() {
  const societies = [
    {
      name: "Bahria Medical & Healthcare Society (MedSoc)",
      category: "Clinical & Community",
      icon: Stethoscope,
      description:
        "Organizes free medical screening camps, blood donation drives, basic life support (BLS) certified workshops, and hospital observational visits.",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Biotechnology & Genomics Guild",
      category: "Scientific Research",
      icon: Dna,
      description:
        "Fosters synthetic biology projects, iGEM competitions, bioinformatics hackathons, and guest seminars with international geneticists.",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Robotics & Health AI Innovation Society",
      category: "Technology",
      icon: Cpu,
      description:
        "Focuses on biomedical telemetry hardware prototyping, prosthetic arm design, computer vision for radiology, and IoT sensors.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Parliamentary Debating & Model UN Union",
      category: "Leadership & Oratory",
      icon: Users,
      description:
        "Hones eloquence, critical reasoning, and global policy diplomacy. Regular champions in national collegiate bilingual debate tournaments.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const amenities = [
    {
      title: "Olympic Sports Complex",
      description:
        "400m synthetic running track, indoor badminton & squash courts, floodlit cricket ground, and fitness gym supervised by certified physical trainers.",
      icon: Trophy,
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Secured Student Residencies (Hostels)",
      description:
        "Dedicated separate male and female dormitories featuring air-cooled rooms, 24/7 biometric security, high-speed fiber Wi-Fi, and balanced dining messes.",
      icon: Home,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "In-House Medical Center & Clinic",
      description:
        "Round-the-clock Resident Medical Officers, triage nursing bay, vital monitoring equipment, and on-standby ambulance service.",
      icon: Activity,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Metropolitan Air-Conditioned Transit Fleet",
      description:
        "Over 26 dedicated air-conditioned bus routes covering all major districts with live GPS tracking for student safety and punctuality.",
      icon: Bus,
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Vibrant Student Community"
        title="Campus Life & Facilities"
        subtitle="Education at Bahria College Hanif extends far beyond the lecture hall. Experience an invigorating collegiate culture rich in clubs, sports, and world-class amenities."
        breadcrumbs={[{ label: "Campus Life" }]}
        backgroundImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
      />

      {/* 1. Student Clubs & Societies Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Clubs & Co-Curriculars"
            badgeVariant="medical"
            title="Discover Passions Beyond"
            titleHighlight="The Textbook"
            subtitle="Engage in medical volunteering, genomic design contests, robotics prototyping, and competitive parliamentary debates."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {societies.map((soc, idx) => {
              const Icon = soc.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row group"
                >
                  <div className="relative h-48 sm:h-auto sm:w-2/5 flex-shrink-0">
                    <Image
                      src={soc.image}
                      alt={soc.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-bold text-medical-600 dark:text-medical-400 uppercase tracking-wider">
                          {soc.category}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-2 leading-snug">
                        {soc.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {soc.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Weekly Meetings • Student Led
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Campus Infrastructure & Amenities */}
      <section className="py-20 bg-white dark:bg-slate-950" id="hostels">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Campus Living"
            badgeVariant="gold"
            title="World-Class Living &"
            titleHighlight="Athletic Infrastructure"
            subtitle="Designed to provide a secure, wholesome, and energizing lifestyle that fosters wellness and scholastic concentration."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {amenities.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 rounded-2xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                      <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                        <Icon className="w-5 h-5 text-gold-400" />
                      </div>
                      <h4 className="font-display font-bold text-lg text-white">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CTA to Gallery */}
      <section className="py-16 bg-navy-950 text-white border-t border-navy-900 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
            See the Campus in Action
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Browse our categorized media gallery featuring high-resolution photography of science laboratories, convocation ceremonies, and sports galas.
          </p>
          <div>
            <Link href="/gallery">
              <Button size="lg" variant="gold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Full Photo & Video Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
