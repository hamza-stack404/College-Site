-- ====================================================================
-- BAHRIA COLLEGE HANIF - OFFICIAL SUPABASE DATABASE SCHEMA
-- Full PostgreSQL DDL, Triggers, Functions & Row-Level Security (RLS)
-- ====================================================================

-- 1. Create Custom Enum Types
CREATE TYPE user_role AS ENUM ('student', 'parent', 'teacher', 'admin');
CREATE TYPE notice_category AS ENUM ('Date Sheet', 'Roll No Slip', 'Holiday', 'Fee Due Date', 'General Notice');
CREATE TYPE academic_discipline AS ENUM ('Pre-Medical', 'Pre-Engineering', 'Computer Science');
CREATE TYPE student_fee_category AS ENUM ('Civilian', 'Armed Forces');
CREATE TYPE payment_status AS ENUM ('Paid', 'Unpaid', 'Overdue');
CREATE TYPE admission_status AS ENUM ('Pending', 'Under Review', 'Verified', 'Shortlisted', 'Rejected');

-- 2. User Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    roll_number TEXT UNIQUE,
    full_name TEXT NOT NULL,
    father_name TEXT,
    role user_role NOT NULL DEFAULT 'student',
    discipline academic_discipline,
    class_level TEXT DEFAULT '11th',
    section TEXT DEFAULT 'Section A',
    category student_fee_category DEFAULT 'Civilian',
    contact_phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. College Notices & Circulars Table
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category notice_category NOT NULL DEFAULT 'General Notice',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    file_url TEXT,
    file_size TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Campus Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    heading TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Student Fee Vouchers & Challans Table
CREATE TABLE IF NOT EXISTS public.fee_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challan_no TEXT UNIQUE NOT NULL,
    month_year TEXT NOT NULL,
    tuition_fee NUMERIC(10, 2) NOT NULL DEFAULT 5500.00,
    science_lab_fee NUMERIC(10, 2) NOT NULL DEFAULT 800.00,
    total_amount NUMERIC(10, 2) GENERATED ALWAYS AS (tuition_fee + science_lab_fee) STORED,
    status payment_status NOT NULL DEFAULT 'Unpaid',
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Internal Assessment Marks & Academic Results Table
CREATE TABLE IF NOT EXISTS public.internal_exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exam_name TEXT NOT NULL, -- e.g., '1st Term Assessment 2026'
    subject TEXT NOT NULL,
    total_marks INT NOT NULL DEFAULT 100,
    obtained_marks INT NOT NULL CHECK (obtained_marks >= 0 AND obtained_marks <= total_marks),
    grade TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Online Admissions Inquiries & Applications Table
CREATE TABLE IF NOT EXISTS public.admission_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    father_service_category TEXT NOT NULL CHECK (father_service_category IN ('Civilian', 'Navy', 'Army', 'Air Force')),
    b_form_number TEXT NOT NULL,
    selected_discipline academic_discipline NOT NULL,
    matric_total_marks INT NOT NULL DEFAULT 1100,
    matric_obtained_marks INT NOT NULL,
    matric_percentage NUMERIC(5, 2) GENERATED ALWAYS AS ((matric_obtained_marks::numeric / matric_total_marks::numeric) * 100) STORED,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    domicile_district TEXT DEFAULT 'Karachi',
    status admission_status DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable Row-Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies Configuration
-- Public Notice Reading
CREATE POLICY "Public Read Notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Admin All Notices" ON public.notices FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Public Announcements Reading
CREATE POLICY "Public Read Announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Admin All Announcements" ON public.announcements FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Profile Access
CREATE POLICY "Users Read Own Profile" ON public.profiles FOR SELECT
    USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Fee Vouchers
CREATE POLICY "Students and Parents View Own Vouchers" ON public.fee_vouchers FOR SELECT
    USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Exam Results
CREATE POLICY "Students View Own Results" ON public.internal_exam_results FOR SELECT
    USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('teacher', 'admin')));

CREATE POLICY "Teachers Insert Results" ON public.internal_exam_results FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('teacher', 'admin')));

-- Admissions
CREATE POLICY "Anyone Can Submit Application" ON public.admission_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Can View Applications" ON public.admission_applications FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
