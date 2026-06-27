import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const slugs = [
  'chatgpt-for-developers-i-replaced-12-developer-tools-for-30-days',
  'why-microsoft-fabric-skills-will-dominate-the-data-industry-in-2026',
  'microsoft-fabric-architectural-guide',
  'microsoft-fabric-medallion-architecture-guide',
  'architecting-compound-ai-systems-microsoft-fabric'
];

async function main() {
  const scratchDir = path.join(__dirname, '../scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir);
  }

  for (const slug of slugs) {
    console.log(`Fetching ${slug}...`);
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (post) {
      const filePath = path.join(scratchDir, `${slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf8');
      console.log(`Saved to ${filePath}`);
    } else {
      console.log(`Post not found for slug: ${slug}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
