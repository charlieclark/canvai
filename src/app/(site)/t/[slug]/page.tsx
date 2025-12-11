import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { TemplateView } from "./_components/template-view";
import type { Metadata } from "next";

interface TemplatePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TemplatePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const template = await api.template.getBySlug({ slug });
    return {
      title: `${template.name} | CanvAi Template`,
      description: `Start creating with the "${template.name}" template on CanvAi`,
    };
  } catch {
    return {
      title: "Template Not Found | CanvAi",
    };
  }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { slug } = await params;

  try {
    const template = await api.template.getBySlug({ slug });

    return (
      <TemplateView
        name={template.name}
        slug={template.templateSlug!}
        snapshot={template.snapshot}
      />
    );
  } catch {
    notFound();
  }
}
