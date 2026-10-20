import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EXCEL_PROJECTS } from '@/data/excelProjects';
import ExcelProjectShowcase from '@/components/ExcelProjectShowcase';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return EXCEL_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = EXCEL_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Excel Dashboard Not Found | Datta Sable',
    };
  }

  return {
    title: `${project.title} | Advanced Excel BI Project`,
    alternates: { canonical: `https://dattasable.com/dashboards/${project.slug}` },
    description: `${project.subtitle} Download the master .xlsx spreadsheet workbook with ${project.totalRecordsCount.toLocaleString()} sample records and interactive slicer controls.`,
    keywords: [
      'Excel Dashboard',
      'Business Intelligence',
      project.category,
      project.clientOrOrg,
      'Advanced Excel Model',
      'Downloadable Excel File',
      'Datta Sable',
      'Financial Analytics',
    ],
    openGraph: {
      title: `${project.title} | Datta Sable`,
      description: project.subtitle,
      url: `https://dattasable.com/dashboards/${project.slug}`,
      siteName: 'Datta Sable — BI Expert & Enterprise Architect',
      type: 'article',
    },
  };
}

export default async function DynamicExcelProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = EXCEL_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ExcelProjectShowcase project={project} />;
}
