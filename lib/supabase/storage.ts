import { supabase, isSupabaseConfigured } from "./client";

/**
 * Reusable client-side helper to upload media to Supabase Storage buckets:
 * - 'faculty-photos'
 * - 'gallery-media'
 *
 * Returns the generated public URL upon successful upload.
 */
export async function uploadFileToStorage(
  file: File,
  bucket: "faculty-photos" | "gallery-media" | "timetables"
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    // Local fallback for offline/demo environments
    const mockUrl = URL.createObjectURL(file);
    return { url: mockUrl, error: null };
  }

  try {
    const fileExt = file.name.split(".").pop() || "jpg";
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20);
    const filePath = `${Date.now()}_${cleanFileName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    if (!data?.publicUrl) {
      return { url: null, error: "Failed to generate public URL for uploaded media." };
    }

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || "An unexpected storage upload error occurred." };
  }
}
