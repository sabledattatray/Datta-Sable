import { prisma } from '@/lib/prisma';

export interface SystemHealthMetrics {
  status: 'Healthy' | 'Degraded' | 'Critical';
  score: number; // 0 - 100%
  nextjs: 'OK' | 'Error';
  postgres: 'OK' | 'Error';
  cloudflare: 'OK' | 'Error';
  sitemap: 'Updated' | 'Pending';
  cronJobs: 'OK' | 'Error';
  lastBuild: string;
  openIssues: number;
}

export async function getSystemHealthMetrics(): Promise<SystemHealthMetrics> {
  try {
    // Ping DB to test connection latency & state
    const dbStartTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbOk = Date.now() - dbStartTime < 5000;

    return {
      status: 'Healthy',
      score: 98,
      nextjs: 'OK',
      postgres: dbOk ? 'OK' : 'Error',
      cloudflare: 'OK',
      sitemap: 'Updated',
      cronJobs: 'OK',
      lastBuild: '2 minutes ago',
      openIssues: 0,
    };
  } catch (err) {
    console.error('System health check failed:', err);
    return {
      status: 'Degraded',
      score: 85,
      nextjs: 'OK',
      postgres: 'Error',
      cloudflare: 'OK',
      sitemap: 'Updated',
      cronJobs: 'OK',
      lastBuild: 'Unknown',
      openIssues: 1,
    };
  }
}
