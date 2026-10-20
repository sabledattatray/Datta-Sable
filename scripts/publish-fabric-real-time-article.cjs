// Explicit publication tool: importing this file alone never sends a campaign.
const fs = require('node:fs');
const path = require('node:path');
require('@next/env').loadEnvConfig(process.cwd());
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const slug = 'microsoft-fabric-real-time-intelligence-guide';

async function main() {
  if (!process.argv.includes('--publish')) throw new Error('Use --publish only after publication approval and deployment of the featured image.');
  const draft = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/editorial', slug, 'draft.json'), 'utf8'));
  const response = await fetch(`https://dattasable.com${draft.image}`, { method: 'HEAD', signal: AbortSignal.timeout(20000) });
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error('The featured image is not deployed yet; publication was not changed.');
  if (process.argv.includes('--dispatch')) throw new Error('Publication never sends email. Use the manual campaign dashboard separately.');
  const seeded = await prisma.$transaction(async tx => {
    const post = await tx.post.upsert({ where: { slug }, create: { ...draft, published: true }, update: { ...draft, published: true } });
    const marker = '<!-- related-fabric-real-time-guide -->';
    const link = `${marker}<aside style="margin:28px 0;padding:20px 24px;border:1px solid var(--border);border-left:3px solid #0e8c78;border-radius:12px;background:var(--surface2)"><p><strong>Build the real-time operational layer:</strong> Follow the <a href="/blog/${slug}">Microsoft Fabric Real-Time Intelligence practical guide</a> for Eventstream, Eventhouse, KQL queries, alert design and a production checklist.</p></aside>`;
    for (const relatedSlug of ['microsoft-fabric-architecture-explained-2026', 'microsoft-fabric-onelake-architecture-guide', 'microsoft-fabric-capacity-sizing-guide-2026']) {
      const related = await tx.post.findUnique({ where: { slug: relatedSlug } });
      if (related?.published && !related.content.includes(marker)) await tx.post.update({ where: { slug: relatedSlug }, data: { content: related.content + link } });
    }
    return { postId: post.id };
  }, { timeout: 60000 });
  console.log(JSON.stringify({ ...seeded, published: true, slug, inboundLinks: 3, emailCampaignQueued: false, prismaSeed: true }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
