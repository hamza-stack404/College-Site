/**
 * Headless CMS / Supabase Content Schemas for Bahria College Hanif
 * Reference schemas for tables and headless content definitions.
 */

export const groupSchema = {
  name: "intermediateGroup",
  title: "Intermediate Group",
  type: "document",
  fields: [
    { name: "title", title: "Group Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "qualification", title: "Qualification (HSSC)", type: "string" },
    { name: "class11Seats", title: "Class 11 Seats", type: "number" },
    { name: "monthlyTuitionCivilian", title: "Monthly Tuition Civilian", type: "number" },
    { name: "monthlyTuitionForces", title: "Monthly Tuition Armed Forces", type: "number" },
    { name: "description", title: "Description", type: "text" },
    { name: "image", title: "Image", type: "image" },
  ],
};

export const staffSchema = {
  name: "staffMember",
  title: "Faculty & Staff Member",
  type: "document",
  fields: [
    { name: "name", title: "Full Name", type: "string" },
    { name: "role", title: "Role", type: "string", options: { list: ["Principal", "Vice Principal", "Subject Teacher", "Lab Teacher", "PTI"] } },
    { name: "subject", title: "Subject Taught", type: "string" },
    { name: "qualification", title: "Degree Qualification", type: "string" },
    { name: "classesTaught", title: "Classes / Sections Taught", type: "array" },
    { name: "image", title: "Profile Photo", type: "image" },
  ],
};

export const announcementSchema = {
  name: "announcement",
  title: "Campus Announcement",
  type: "document",
  fields: [
    { name: "heading", title: "Heading", type: "string" },
    { name: "image_url", title: "Image URL", type: "string" },
    { name: "description", title: "Description", type: "text" },
    { name: "date", title: "Date", type: "string" },
    { name: "created_by", title: "Created By", type: "string" },
  ],
};

export const noticeSchema = {
  name: "notice",
  title: "College Notice Circular",
  type: "document",
  fields: [
    { name: "title", title: "Notice Title", type: "string" },
    { name: "category", title: "Category", type: "string", options: { list: ["Date Sheet", "Roll No Slip", "Holiday", "Fee Due Date", "General Notice"] } },
    { name: "date", title: "Notice Date", type: "date" },
    { name: "description", title: "Description", type: "text" },
    { name: "file_url", title: "Attachment URL", type: "string" },
    { name: "file_size", title: "File Size", type: "string" },
    { name: "is_pinned", title: "Is Pinned", type: "boolean" },
    { name: "is_urgent", title: "Is Urgent", type: "boolean" },
  ],
};
