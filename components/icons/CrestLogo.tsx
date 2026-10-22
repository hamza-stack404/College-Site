import React from "react";
import Image from "next/image";

interface CrestLogoProps {
  className?: string;
  showText?: boolean;
  theme?: "light" | "dark";
}

export const CrestLogo: React.FC<CrestLogoProps> = ({
  className = "h-12 w-auto",
  showText = true,
  theme = "light",
}) => {
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Official College Crest Logo Image */}
      <div className="relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center">
        <Image
          src="/img/logo.png"
          alt="Bahria College Hanif Campus Official Crest"
          width={48}
          height={48}
          className="w-full h-full object-contain drop-shadow-md"
          priority
        />
      </div>

      {/* College Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-black tracking-tight text-lg sm:text-xl uppercase leading-none ${
                theme === "dark" ? "text-white" : "text-navy-950 dark:text-white"
              }`}
            >
              BAHRIA COLLEGE
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-sans font-bold text-xs sm:text-sm tracking-widest text-medical-600 dark:text-medical-400 uppercase">
              HANIF CAMPUS
            </span>
            <span className="h-2 w-px bg-slate-300 dark:bg-slate-700" />
            <span className="font-sans text-[10px] sm:text-[11px] font-semibold text-gold-600 dark:text-gold-400 uppercase tracking-wider">
              F.Sc & ICS (HSSC)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
