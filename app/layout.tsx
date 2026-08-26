import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cinzel } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/shared/CookieBanner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bahria College Hanif | Premier Medical & Science Institution",
    template: "%s | Bahria College Hanif",
  },
  description:
    "Bahria College Hanif is a leading medical and science institution offering F.Sc Pre-Medical, Computer Science and Pre-Engineering  with world-class laboratories and PMDC/HEC recognition.",
  keywords: [
    "Bahria College Hanif",
    "Navy College",
    "Pre-Medical",
    "Pre-Engineering",

    "Karachi  College",
  ],
  authors: [{ name: "Bahria College Hanif Academic Directorate" }],
  creator: "Bahria College Hanif",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bahriahanif.edu.pk",
    siteName: "Bahria College Hanif ",
    title: "Bahria College Hanif — Excellence in Medical & Scientific Education",
    description:
      "Empowering future surgeons, clinical researchers, and scientific leaders with state-of-the-art diagnostic laboratories and MDCAT excellence.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Bahria College Hanif Medical Science Laboratories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bahria College Hanif | Medical & Science Institution",
    description:
      "Premier collegiate medical and scientific education with accredited laboratories and 94%+ MDCAT merit track record.",
    images: ["https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "MedicalOrganization"],
  name: "Bahria College Hanif",
  alternateName: "Bahria Hanif College",
  url: "https://bahriahanif.edu.pk",
  logo: "https://bahriahanif.edu.pk/logo.png",
  description:
    "A premier medical and science institution offering F.Sc Pre-Medical, BS Medical Laboratory Technology, BS Biotechnology, and Cambridge A-Levels.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hanif Science & Medical Pavilion, National Stadium Road",
    addressLocality: "Karachi",
    addressRegion: "Sindh",
    postalCode: "75260",
    addressCountry: "PK",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+92-21-3485-9100",
    contactType: "Admissions & Student Affairs",
    areaServed: "PK",
    availableLanguage: ["English", "Urdu"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${cinzel.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-medical-500 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Skip to Main Content Link for WCAG 2.1 AA */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy-900 focus:text-white focus:rounded-lg focus:shadow-xl focus:ring-2 focus:ring-medical-400"
          >
            Skip to main content
          </a>

          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
