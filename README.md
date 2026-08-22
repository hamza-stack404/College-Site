# Bahria College Hanif — Medical & Science Institution Web Platform

An institutional web platform built for **Bahria College Hanif (Medical & Science Institution)** using Next.js 14+ (App Router), Tailwind CSS, Framer Motion, and TypeScript.

---

## 🏛️ Project Architecture & Design System

### 🎨 Brand Identity Tokens
- **Navy Primary**: `#091C38` (Deep Naval Slate), `#050E1D` (Dark Canvas)
- **Medical Accent**: `#0D9488` (Teal), `#22B9AF` (Cyan Diagnostic Glow)
- **Royal Gold**: `#D4A22B` (Prestige Accent), `#E3BD52`
- **Typography Pairing**: Editorial Serif Display (`Cinzel` / `Playfair Display`) + Clean Sans-Serif (`Inter` / `System-UI`)
- **Theme Modes**: Full system dark and light mode persistence via `next-themes`

---

## 🚀 Key Features & Pages

| Page Route | Purpose & Key Features |
| :--- | :--- |
| `/` (Home) | Video/Image Hero, Animated Stats Counter, Program Showcase, 360 Facility Tour Teaser, News Ticker, Testimonials, Quick CTA |
| `/about` | Four-decade history timeline (1986–Present), Vision & Mission, Leadership biographies, PMDC/HEC accreditations |
| `/academics` | Complete department overview, downloadable curriculum syllabi (PDF), and Academic Calendar 2026–2027 |
| `/academics/[slug]` | Dynamic program detail template (Course modules, credit hours, lab facilities, faculty chairs, fee summary) |
| `/admissions` | Interactive 5-step Application Stepper, Dynamic Fee & Scholarship Calculator, Official Fee Table, Downloadable Admission Packs, FAQ Accordion |
| `/campus-life` | MedSoc & Student Societies, Olympic Sports Complex, Air-Cooled Hostels, In-House Medical Clinic, 26 Bus Transit Fleet |
| `/news-events` | Filterable research articles, upcoming symposiums with interactive RSVP pass registration |
| `/news-events/[slug]` | Dynamic article / event detail page with ticket seat counter and sharing tools |
| `/faculty` | Filterable and searchable faculty directory with credentials from Oxford, Cambridge, Imperial, and AKU |
| `/faculty/[id]` | Comprehensive individual profile with peer-reviewed publications, DOI links, and office consultation request form |
| `/portal` | Unified Student, Faculty & Parent portal with demo dashboard (timetable, gradebook, attendance, fee voucher) |
| `/gallery` | Categorized masonry photo/video gallery with fullscreen Lightbox and keyboard navigation |
| `/alumni` | Alumni Hall of Fame (Johns Hopkins, BioNTech), directory registration, and endowment giving tiers |
| `/contact` | Department direct extension directory, satellite map directions, and Zod-validated contact form |
| `/not-found` | Medical-themed 404 error page with quick recovery navigation |

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 14.2 (App Router, Server & Client Components)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS + Custom Design Tokens + Glassmorphism
- **Animations**: Framer Motion 11
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form + Zod 3.23
- **SEO**: JSON-LD Structured Data (`EducationalOrganization`, `MedicalOrganization`), Dynamic `sitemap.xml`, and `robots.txt`
- **Accessibility**: WCAG 2.1 AA compliant semantic HTML, keyboard accessible, ARIA tags, and skip-to-content links.

---

## 💻 Local Development & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Run Production Server**:
   ```bash
   npm start
   ```

---

## 🌐 Headless CMS Integration (Sanity / Strapi)

The data models located in `lib/data/` can be swapped with real-time headless CMS endpoints. Full schema specifications are defined in `lib/cms/schemas.ts`.
