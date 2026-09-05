import React from "react";

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
      {/* SVG Institutional Seal */}
      <div className="relative flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="46" stroke="#0B1B3D" strokeWidth="4" className="stroke-navy-900 dark:stroke-navy-300" />
          <circle cx="50" cy="50" r="41" stroke="#D4A22B" strokeWidth="2" strokeDasharray="3 3" />

          {/* Shield Base */}
          <path
            d="M25 30C25 30 50 20 50 20C50 20 75 30 75 30V56C75 72 50 82 50 82C50 82 25 72 25 56V30Z"
            fill="#091C38"
            className="fill-navy-900 dark:fill-navy-950"
            stroke="#D4A22B"
            strokeWidth="2.5"
          />

          {/* Golden Laurel Wreath */}
          <path
            d="M30 45C30 55 38 65 50 72"
            stroke="#D4A22B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M70 45C70 55 62 65 50 72"
            stroke="#D4A22B"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Open Book & Torch of Knowledge */}
          <path
            d="M35 50C42 46 48 48 50 52C52 48 58 46 65 50V64C58 60 52 62 50 66C48 62 42 60 35 64V50Z"
            fill="#FFFFFF"
            stroke="#D4A22B"
            strokeWidth="1.5"
          />
          {/* Torch / Flame */}
          <circle cx="50" cy="36" r="3" fill="#D4A22B" />
          <path d="M48 30L50 26L52 30L50 34L48 30Z" fill="#22B9AF" />

          {/* Star & Ribbon */}
          <path d="M38 77H62" stroke="#D4A22B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
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
