/**
 * Headless CMS (Sanity.io / Strapi) Content Schemas for Bahria College Hanif
 * These schemas can be imported directly into a Sanity Studio or translated into Strapi Content-Types.
 */

export const programSchema = {
  name: "program",
  title: "Academic Program",
  type: "document",
  fields: [
    { name: "title", title: "Program Full Title", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "shortTitle", title: "Short Title", type: "string" },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Pre-Medical & Health", value: "pre-medical" },
          { title: "Allied Diagnostics (BS MLT)", value: "medical-sciences" },
          { title: "Biotechnology & Life Sciences", value: "biological-sciences" },
          { title: "Computing & Health AI", value: "computer-health-informatics" },
          { title: "Physical Sciences", value: "pre-engineering" },
          { title: "Cambridge International A-Levels", value: "cambridge-international" },
        ],
      },
    },
    { name: "department", title: "Department Name", type: "string" },
    { name: "duration", title: "Duration", type: "string" },
    { name: "feePerSemester", title: "Fee Per Semester (PKR)", type: "number" },
    { name: "description", title: "Description", type: "text" },
    { name: "coverImage", title: "Cover Image", type: "image" },
    { name: "brochurePdf", title: "Brochure PDF", type: "file" },
  ],
};

export const facultySchema = {
  name: "faculty",
  title: "Faculty Member",
  type: "document",
  fields: [
    { name: "name", title: "Faculty Name", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "designation", title: "Designation & Role", type: "string" },
    { name: "department", title: "Department", type: "string" },
    { name: "qualification", title: "Degree Qualifications", type: "string" },
    { name: "bio", title: "Academic Biography", type: "text" },
    { name: "email", title: "Institutional Email", type: "string" },
    { name: "phone", title: "Office Phone / Ext", type: "string" },
    { name: "profilePhoto", title: "Profile Photo", type: "image" },
  ],
};

export const newsArticleSchema = {
  name: "newsArticle",
  title: "News & Research Article",
  type: "document",
  fields: [
    { name: "title", title: "Headline", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "category", title: "Category", type: "string" },
    { name: "publishedAt", title: "Publication Date", type: "date" },
    { name: "summary", title: "Executive Summary", type: "text" },
    { name: "coverImage", title: "Cover Image", type: "image" },
    { name: "content", title: "Article Body", type: "array", of: [{ type: "block" }] },
  ],
};

export const campusEventSchema = {
  name: "campusEvent",
  title: "Campus Event / Symposium",
  type: "document",
  fields: [
    { name: "title", title: "Event Title", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "date", title: "Event Date", type: "date" },
    { name: "time", title: "Event Time", type: "string" },
    { name: "venue", title: "Venue / Auditorium", type: "string" },
    { name: "totalSeats", title: "Total Seat Capacity", type: "number" },
    { name: "rsvpOpen", title: "RSVP Open Status", type: "boolean" },
    { name: "coverImage", title: "Banner Image", type: "image" },
  ],
};
