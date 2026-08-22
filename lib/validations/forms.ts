import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid contact phone number"),
  department: z.string().min(1, "Please select a department"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const admissionInquirySchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  guardianName: z.string().min(2, "Father/Guardian name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  selectedProgram: z.string().min(1, "Please select a program"),
  previousEducation: z.string().min(1, "Please specify your qualification (e.g. Matric / O-Levels / F.Sc)"),
  percentageOrGrade: z.string().min(1, "Please provide percentage or GPA/Grade"),
  city: z.string().min(2, "City of residence is required"),
  hostelRequired: z.boolean().default(false),
  transportRequired: z.boolean().default(false),
});

export type AdmissionInquiryData = z.infer<typeof admissionInquirySchema>;

export const eventRsvpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required for ticket confirmation"),
  phone: z.string().min(10, "Phone number is required"),
  organizationOrBatch: z.string().min(2, "Current institution, department, or student ID"),
  seatsCount: z.number().min(1).max(3).default(1),
});

export type EventRsvpData = z.infer<typeof eventRsvpSchema>;

export const alumniRegisterSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  graduationYear: z.number().min(1986).max(2026),
  programCompleted: z.string().min(1, "Please select program completed"),
  currentPosition: z.string().min(2, "Current job title or specialization"),
  currentOrganization: z.string().min(2, "Hospital, University or Company name"),
  cityCountry: z.string().min(2, "Current location (City, Country)"),
  willingToMentor: z.boolean().default(false),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
});

export type AlumniRegisterData = z.infer<typeof alumniRegisterSchema>;

export const portalLoginSchema = z.object({
  role: z.enum(["student", "faculty", "parent"]),
  identifier: z.string().min(3, "Roll Number, Employee ID, or Parent CNIC is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type PortalLoginData = z.infer<typeof portalLoginSchema>;
