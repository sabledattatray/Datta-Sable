import { prisma } from '../lib/prisma';

async function readPost(slug: string) {
  const p = await prisma.post.findUnique({ where: { slug } });
  if (!p) {
    console.log('Not found');
    return;
  }
  console.log(`=== ${slug} ===`);
  console.log(`Title: ${p.title}`);
  console.log('Content (first 1000 chars):');
  console.log(p.content.slice(0, 1000));
  console.log('\n--- Content (middle 1000 chars) ---');
  console.log(p.content.slice(1000, 2000));
  console.log('\n--- Content (last 1000 chars) ---');
  console.log(p.content.slice(-1000));
  await prisma.$disconnect();
}

readPost('video-fabric-end-to-end');

