import { prisma } from '@/lib/prisma';

// Read-only operational metrics. Missing sources stay unavailable rather than becoming demo numbers.
export async function getAdminOverview() {
  const now = new Date();
  const start = new Date(now);
  start.setUTCMinutes(0, 0, 0);
  start.setUTCHours(start.getUTCHours() - 23);
  const dayAgo = new Date(now.getTime() - 86400000);
  const fiveMinutesAgo = new Date(now.getTime() - 300000);
  const results = await Promise.allSettled([
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.project.count({ where: { published: true } }),
    prisma.user.count(),
    prisma.subscriber.count(),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.pageView.count({ where: { createdAt: { gte: dayAgo } } }),
    prisma.pageView.count({ where: { createdAt: { gte: fiveMinutesAgo } } }),
    prisma.post.groupBy({ by: ['category'], where: { published: true }, _count: true, orderBy: { _count: { category: 'desc' } }, take: 6 }),
    prisma.post.findMany({ orderBy: { updatedAt: 'desc' }, take: 4, select: { id: true, title: true, published: true, category: true, updatedAt: true } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, action: true, status: true, createdAt: true } }),
    prisma.$queryRaw<{ hour: Date; count: bigint }[]>`SELECT date_trunc('hour', "createdAt") AS hour, count(*) AS count FROM "PageView" WHERE "createdAt" >= ${start} GROUP BY 1 ORDER BY 1`,
  ] as const);
  const read = <T>(result: PromiseSettledResult<T>): T | null => result.status === 'fulfilled' ? result.value : null;
  const hours = read(results[11]);
  const buckets = new Map(hours?.map(row => [new Date(row.hour).getTime(), Number(row.count)]) || []);
  return {
    updatedAt: now.toISOString(),
    availableSources: results.filter(result => result.status === 'fulfilled').length,
    sourceCount: results.length,
    counts: {
      published: read(results[0]), drafts: read(results[1]), projects: read(results[2]), users: read(results[3]),
      subscribers: read(results[4]), unread: read(results[5]), views24h: read(results[6]), views5m: read(results[7]),
    },
    categories: read(results[8])?.map(row => ({ name: row.category, count: row._count })) ?? null,
    posts: read(results[9])?.map(post => ({ ...post, updatedAt: post.updatedAt.toISOString() })) ?? null,
    events: read(results[10])?.map(event => ({ ...event, createdAt: event.createdAt.toISOString() })) ?? null,
    traffic: hours ? Array.from({ length: 24 }, (_, index) => {
      const at = new Date(start.getTime() + index * 3600000);
      return { at: at.toISOString(), count: buckets.get(at.getTime()) || 0 };
    }) : null,
  };
}

export type AdminOverviewData = Awaited<ReturnType<typeof getAdminOverview>>;
