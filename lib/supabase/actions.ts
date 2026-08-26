"use server";

import { revalidatePath } from "next/cache";
import { supabase, isSupabaseConfigured } from "./client";

export interface NoticeInput {
  title: string;
  category: "Date Sheet" | "Roll No Slip" | "Holiday" | "Fee Due Date" | "General Notice";
  description: string;
  file_url?: string;
  file_size?: string;
  is_pinned?: boolean;
  is_urgent?: boolean;
}

export interface AdmissionApplicationInput {
  applicant_name: string;
  father_name: string;
  father_service_category: "Civilian" | "Navy" | "Army" | "Air Force";
  b_form_number: string;
  selected_discipline: "Pre-Medical" | "Pre-Engineering" | "Computer Science";
  matric_total_marks: number;
  matric_obtained_marks: number;
  contact_phone: string;
  contact_email?: string;
}

/**
 * Server Action: Submit an Online Admission Application
 */
export async function submitAdmissionApplicationAction(input: AdmissionApplicationInput) {
  if (!isSupabaseConfigured) {
    // Graceful fallback for local development without active DB
    return {
      success: true,
      message: "Application submitted in local mode. We have received your inquiry!",
      data: { ...input, id: "LOCAL-" + Date.now(), status: "Pending" },
    };
  }

  try {
    const { data, error } = await supabase
      .from("admission_applications")
      .insert([input])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admissions");
    return {
      success: true,
      message: "Application submitted successfully! Tracking ID generated.",
      data,
    };
  } catch (err: any) {
    console.error("Admission submission error:", err);
    return {
      success: false,
      message: err.message || "Failed to submit application. Please try again.",
    };
  }
}

/**
 * Server Action: Publish a new Notice (Admin)
 */
export async function createNoticeAction(notice: NoticeInput) {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Notice saved in local state mode.",
      data: { ...notice, id: "local-" + Date.now(), date: new Date().toISOString().split("T")[0] },
    };
  }

  try {
    const { data, error } = await supabase
      .from("notices")
      .insert([
        {
          ...notice,
          date: new Date().toISOString().split("T")[0],
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/notice-board");
    revalidatePath("/");
    return { success: true, message: "Notice published live successfully.", data };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to create notice." };
  }
}
