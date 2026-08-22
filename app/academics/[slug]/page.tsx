import React from "react";
import { notFound } from "next/navigation";
import { programsData } from "@/lib/data/programs";
import { ProgramDetailClient } from "@/components/academics/ProgramDetailClient";

interface ProgramPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return programsData.map((program) => ({
    slug: program.slug,
  }));
}

export function generateMetadata({ params }: ProgramPageProps) {
  const program = programsData.find((p) => p.slug === params.slug);
  if (!program) return { title: "Program Not Found" };

  return {
    title: `${program.title} | Bahria College Hanif`,
    description: program.description,
  };
}

export default function ProgramDetailPage({ params }: ProgramPageProps) {
  const program = programsData.find((p) => p.slug === params.slug);

  if (!program) {
    notFound();
  }

  return <ProgramDetailClient program={program} />;
}
