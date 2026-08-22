import React from "react";
import { notFound } from "next/navigation";
import { newsArticlesData, campusEventsData } from "@/lib/data/news-events";
import { ArticleOrEventClient } from "@/components/news-events/ArticleOrEventClient";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const newsParams = newsArticlesData.map((article) => ({
    slug: article.slug,
  }));
  const eventParams = campusEventsData.map((event) => ({
    slug: event.slug,
  }));
  return [...newsParams, ...eventParams];
}

export function generateMetadata({ params }: PageProps) {
  const article = newsArticlesData.find((a) => a.slug === params.slug);
  const event = campusEventsData.find((e) => e.slug === params.slug);

  if (article) {
    return {
      title: `${article.title} | Bahria College Hanif`,
      description: article.summary,
    };
  }

  if (event) {
    return {
      title: `${event.title} | Bahria College Hanif`,
      description: event.description,
    };
  }

  return { title: "Article or Event Not Found" };
}

export default function ArticleOrEventDetailPage({ params }: PageProps) {
  const article = newsArticlesData.find((a) => a.slug === params.slug);
  const event = campusEventsData.find((e) => e.slug === params.slug);

  if (!article && !event) {
    notFound();
  }

  return <ArticleOrEventClient article={article} event={event} />;
}
