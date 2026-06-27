'use client';

import StartHere from '@/components/home/StartHere';
import LatestInsights from '@/components/home/LatestInsights';
import RecentlyUpdated from '@/components/home/RecentlyUpdated';
import BrowseCategories from '@/components/home/BrowseCategories';
import FeaturedSeries from '@/components/home/FeaturedSeries';
import AboutAuthor from '@/components/home/AboutAuthor';
import StatsGrid from '@/components/home/StatsGrid';
import ProjectsGrid from '@/components/home/ProjectsGrid';
import Testimonials from '@/components/home/Testimonials';
import FinalCTA from '@/components/home/FinalCTA';
import FAQ from '@/components/home/FAQ';

export default function BelowTheFold({ posts }: { posts: any[] }) {
  return (
    <>
      <StartHere />
      <LatestInsights posts={posts} />
      <RecentlyUpdated />
      <BrowseCategories />
      <FeaturedSeries />
      <AboutAuthor />
      <StatsGrid />
      <ProjectsGrid />
      <Testimonials />
      <FinalCTA />
      <FAQ />
    </>
  );
}

