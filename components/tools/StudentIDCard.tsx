"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShieldCheck, RotateCw, Printer, Sparkles, QrCode, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CrestLogo } from "@/components/icons/CrestLogo";

interface StudentIDCardProps {
  name?: string;
  fatherName?: string;
  rollNo?: string;
  discipline?: string;
  section?: string;
  session?: string;
  photoUrl?: string;
}

export const StudentIDCard: React.FC<StudentIDCardProps> = ({
  name = "Muhammad Hamza Khan",
  fatherName = "Tariq Mahmood Khan",
  rollNo = "BCH-2026-0101",
  discipline = "Pre-Medical",
  section = "Section A",
  session = "2026 – 2028",
  photoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* 3D Card Container */}
      <div className="perspective-1000 w-full max-w-sm h-64 sm:h-72 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <div
          className={`relative w-full h-full duration-700 transform-style-3d transition-transform rounded-3xl shadow-2xl ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white p-5 border-2 border-gold-400/40 flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Top Seal & Brand */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CrestLogo showText={false} className="h-9 w-auto" />
                <div>
                  <div className="font-display font-black text-xs tracking-wider text-white uppercase">
                    Bahria College Hanif
                  </div>
                  <div className="text-[9px] font-bold text-gold-400 uppercase tracking-widest">
                    Official Student Identity Card
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-gold-500 text-navy-950 text-[10px] font-black uppercase">
                HSSC
              </span>
            </div>

            {/* Middle Section: Photo & Details */}
            <div className="flex items-center gap-4 my-auto">
              <div className="relative w-20 h-24 rounded-2xl overflow-hidden border-2 border-gold-400 shadow-md flex-shrink-0">
                <Image src={photoUrl} alt={name} fill className="object-cover" />
              </div>

              <div className="space-y-1 text-left flex-1 min-w-0">
                <div className="font-display font-bold text-sm text-white truncate">{name}</div>
                <div className="text-[11px] text-slate-300">
                  S/O: <span className="font-semibold text-white">{fatherName}</span>
                </div>
                <div className="text-[11px] text-gold-300 font-mono">
                  Roll ID: <strong className="text-white">{rollNo}</strong>
                </div>
                <div className="text-[10px] text-slate-400">
                  Discipline: <strong className="text-medical-400">{discipline} ({section})</strong>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Session & Hologram */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
              <div className="text-slate-400">
                Session: <strong className="text-white">{session}</strong>
              </div>
              <div className="flex items-center gap-1 text-gold-400 font-bold text-[9px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Active Student</span>
              </div>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-slate-900 text-white p-5 border-2 border-medical-500/40 flex flex-col justify-between shadow-2xl">
            <div className="text-center border-b border-white/10 pb-2">
              <div className="font-display font-bold text-xs uppercase text-gold-400">
                Campus Security & Emergency Verification
              </div>
            </div>

            {/* Emergency & Rules */}
            <div className="text-[10px] text-slate-300 space-y-1.5 leading-tight text-left">
              <p>• This card is non-transferable and remains property of Bahria College Hanif.</p>
              <p>• Mandatory to wear during college hours, laboratories, and FBISE exams.</p>
              <p>• If lost, immediately report to Student Affairs Desk Window 2.</p>
              <p className="pt-1 text-gold-300">
                Emergency Helpline: <strong>+92-21-3485-9100</strong>
              </p>
            </div>

            {/* Barcode & Verification Badge */}
            <div className="bg-white/10 p-2 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5 text-left">
                <div className="font-mono text-[9px] text-slate-400">FBISE REG NO.</div>
                <div className="font-mono font-bold text-xs text-white">PK-BCH-26-9041</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-950" />
              </div>
            </div>

            <div className="text-center text-[9px] text-slate-400">
              Principal Signature & Directorate Seal Affixed
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setIsFlipped(!isFlipped)} className="gap-1.5 text-xs">
          <RotateCw className="w-3.5 h-3.5" />
          <span>Flip 3D Card (Click Card)</span>
        </Button>
        <Button variant="gold" size="sm" onClick={() => window.print()} className="gap-1.5 text-xs">
          <Printer className="w-3.5 h-3.5" />
          <span>Print Digital Pass</span>
        </Button>
      </div>
    </div>
  );
};
