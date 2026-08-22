"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatItemProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  description?: string;
}

export const StatsCounterItem: React.FC<StatItemProps> = ({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  label,
  description,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = value / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-medical-500/40 transition-all duration-300"
    >
      <div className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight flex items-baseline">
        <span>{prefix}</span>
        <span>
          {decimals > 0
            ? count.toFixed(decimals)
            : Math.floor(count).toLocaleString()}
        </span>
        <span className="text-gold-400 ml-0.5">{suffix}</span>
      </div>
      <div className="mt-2 text-sm sm:text-base font-bold text-medical-300 uppercase tracking-wider">
        {label}
      </div>
      {description && (
        <div className="mt-1 text-xs text-slate-400 max-w-[200px]">
          {description}
        </div>
      )}
    </div>
  );
};

export const KeyStatsSection: React.FC = () => {
  const stats = [
    {
      value: 94.2,
      suffix: "%",
      decimals: 1,
      label: "MDCAT Merit Success",
      description: "Admitted to premier medical & dental institutions",
    },
    {
      value: 12,
      suffix: "+",
      label: "High-Tech Science Labs",
      description: "PCR, Histopathology, AI Diagnostics, Bio-robotics",
    },
    {
      value: 38,
      suffix: "+",
      label: "Doctoral Faculty",
      description: "Mentors from Oxford, Imperial, Cambridge, AKU",
    },
    {
      value: 100,
      prefix: "PKR ",
      suffix: "M+",
      label: "Merit Scholarships",
      description: "Awarded to high-achieving scholars since inception",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, idx) => (
        <StatsCounterItem key={idx} {...stat} />
      ))}
    </div>
  );
};
