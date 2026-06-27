import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Querying all posts in the database...');
  const dbPosts = await prisma.post.findMany({
    select: { slug: true, title: true },
  });
  console.log(`Found ${dbPosts.length} posts in the database:`);
  for (const post of dbPosts) {
    console.log(`- ${post.title} (slug: ${post.slug})`);
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
