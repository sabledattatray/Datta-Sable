'use client';

import LatestInsights from '@/components/home/LatestInsights';
import BrowseCategories from '@/components/home/BrowseCategories';
import AboutAuthor from '@/components/home/AboutAuthor';
import StatsGrid from '@/components/home/StatsGrid';
import ProjectsGrid from '@/components/home/ProjectsGrid';
import Testimonials from '@/components/home/Testimonials';
import FinalCTA from '@/components/home/FinalCTA';
import FAQ from '@/components/home/FAQ';

export default function BelowTheFold({ posts }: { posts: any[] }) {
  return (
    <>
      <LatestInsights posts={posts} />
      <BrowseCategories />
      <AboutAuthor />
      <StatsGrid />
      <ProjectsGrid />
      <Testimonials />
      <FinalCTA />
      <FAQ />
    </>
  );
}

