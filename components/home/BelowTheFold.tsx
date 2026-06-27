'use client';

import ProblemHook from '@/components/home/ProblemHook';
import Solution from '@/components/home/Solution';
import ArchitectureViz from '@/components/home/ArchitectureViz';
import StatsGrid from '@/components/home/StatsGrid';
import HowItWorks from '@/components/home/HowItWorks';
import ProjectsGrid from '@/components/home/ProjectsGrid';
import Testimonials from '@/components/home/Testimonials';
import UseCases from '@/components/home/UseCases';
import ProductValue from '@/components/home/ProductValue';
import FAQ from '@/components/home/FAQ';
import LatestInsights from '@/components/home/LatestInsights';
import FinalCTA from '@/components/home/FinalCTA';

export default function BelowTheFold({ posts }: { posts: any[] }) {
  return (
    <>
      <ProblemHook />
      <LatestInsights posts={posts} />
      <Solution />
      <ArchitectureViz />
      <StatsGrid />
      <HowItWorks />
      <ProjectsGrid />
      <Testimonials />
      <UseCases />
      <ProductValue />
      <FinalCTA />
      <FAQ />
    </>
  );
}

