"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Lightbox } from "@/components/ui/Lightbox";
import { galleryData } from "@/lib/data/gallery";
import { GalleryItem } from "@/lib/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Eye, Camera, Play, Sparkles } from "lucide-react";

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(galleryData);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchGalleryItems() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("date", { ascending: false });

        if (data && !error && data.length > 0) {
          setGalleryItems(
            data.map((g: any) => ({
              id: g.id,
              title: g.title,
              category: g.category,
              caption: g.caption || "",
              date: g.date || "",
              type: (g.media_type || g.type || "image") as "image" | "video",
              mediaUrl: g.media_url,
              thumbnailUrl: g.thumbnail_url || g.media_url,
            }))
          );
        }
      } catch (err) {
        console.warn("Could not fetch gallery items from Supabase:", err);
      }
    }
    fetchGalleryItems();
  }, []);

  const categories = [
    { id: "all", label: "All Media" },
    { id: "Medical Labs", label: "Medical Labs & PCR" },
    { id: "Anatomy & Surgery", label: "Anatomy & Dissection" },
    { id: "Campus Life", label: "Campus & Library" },
    { id: "Sports & Fitness", label: "Sports Complex" },
    { id: "Convocations", label: "Convocations" },
    { id: "Science Expo", label: "Science Expo & AI" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        badge="Visual Archives"
        title="Campus Photo & Video Gallery"
        subtitle="Experience life, clinical science laboratories, and convocation milestones at Bahria College Hanif."
        breadcrumbs={[{ label: "Gallery" }]}
        backgroundImage="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Institutional Memories"
            badgeVariant="gold"
            title="Moments of Rigor,"
            titleHighlight="Discovery & Triumph"
            subtitle="Click on any photograph to view high-resolution imagery and detailed laboratory specifications."
            align="center"
          />

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-navy-900 text-white dark:bg-medical-600 shadow-md scale-105"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Media Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800 bg-slate-900"
              >
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Badge on Top Left */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="medical" size="sm">
                    {item.category}
                  </Badge>
                </div>

                {/* Hover Eye Icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <Eye className="w-4 h-4" />
                </div>

                {/* Bottom Title & Caption */}
                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                  <h4 className="font-display font-bold text-base sm:text-lg leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1 opacity-90">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filteredItems}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}
    </div>
  );
}
