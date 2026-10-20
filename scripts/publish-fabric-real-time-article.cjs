// Explicit publication tool: importing this file alone never sends a campaign.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require('@next/env').loadEnvConfig(process.cwd());
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);

const { prisma } = require('../lib/prisma.ts');
const { ensureCampaignSchema, enqueueCampaign, campaignHistory, processCampaignQueue } = require('../lib/campaigns.ts');
const slug = 'microsoft-fabric-real-time-intelligence-guide';

async function main() {
  if (!process.argv.includes('--publish')) throw new Error('Use --publish only after publication approval and deployment of the featured image.');
  const draft = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/editorial', slug, 'draft.json'), 'utf8'));
  const response = await fetch(`https://dattasable.com${draft.image}`, { method: 'HEAD', signal: AbortSignal.timeout(20000) });
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error('The featured image is not deployed yet; publication was not changed.');
  await ensureCampaignSchema();
  const campaignId = await prisma.$transaction(async tx => {
    const current = await tx.post.findUnique({ where: { slug } });
    const post = current?.published ? current : current
      ? await tx.post.update({ where: { slug }, data: { ...draft, published: true } })
      : await tx.post.create({ data: { ...draft, published: true } });
    const id = await enqueueCampaign({ title: post.title, slug: post.slug, shortStory: post.excerpt, category: post.category, readTime: post.readTime, imageUrl: post.image, takeaways: [] }, `publish:${slug}`, tx);
    const marker = '<!-- related-fabric-real-time-guide -->';
    const link = `${marker}<aside style="margin:28px 0;padding:20px 24px;border:1px solid var(--border);border-left:3px solid #0e8c78;border-radius:12px;background:var(--surface2)"><p><strong>Build the real-time operational layer:</strong> Follow the <a href="/blog/${slug}">Microsoft Fabric Real-Time Intelligence practical guide</a> for Eventstream, Eventhouse, KQL queries, alert design and a production checklist.</p></aside>`;
    for (const relatedSlug of ['microsoft-fabric-architecture-explained-2026', 'microsoft-fabric-onelake-architecture-guide', 'microsoft-fabric-capacity-sizing-guide-2026']) {
      const related = await tx.post.findUnique({ where: { slug: relatedSlug } });
      if (related?.published && !related.content.includes(marker)) await tx.post.update({ where: { slug: relatedSlug }, data: { content: related.content + link } });
    }
    return id;
  }, { timeout: 60000 });
  console.log(JSON.stringify({ published: true, slug, campaignId, inboundLinks: 3 }));
  if (process.argv.includes('--dispatch')) {
    for (let pass = 0; pass < 8; pass++) {
      const state = (await campaignHistory()).find(c => c.id === campaignId);
      if (!state?.pending) break;
      const outcome = await processCampaignQueue();
      console.log(JSON.stringify(outcome));
      if (outcome.blocked || outcome.busy || !outcome.processed) break;
    }
  }
  console.log(JSON.stringify((await campaignHistory()).find(c => c.id === campaignId)));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
