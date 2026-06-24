import { PrismaClient } from '@prisma/client';
import { posts as staticPosts } from '../app/blog/data';

const prisma = new PrismaClient();

async function main() {
  console.log(`Starting blog sync...`);
  console.log(`Found ${staticPosts.length} static blog posts in app/blog/data.ts.`);

  let createdCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const post of staticPosts) {
    try {
      const postData = {
        title: post.title,
        category: post.category || 'General',
        excerpt: post.excerpt || '',
        content: post.content,
        readTime: Number(post.readTime) || 5,
        date: post.date || '',
        color: post.color || null,
        icon: post.icon || null,
        image: post.image || null,
        published: true,
      };

      const existing = await prisma.post.findUnique({
        where: { slug: post.slug },
      });

      if (existing) {
        await prisma.post.update({
          where: { slug: post.slug },
          data: postData,
        });
        skippedCount++;
        console.log(`Successfully updated existing post: ${post.title} (${post.slug})`);
      } else {
        await prisma.post.create({
          data: {
            slug: post.slug,
            ...postData,
            blocks: {
              focusedKeyword: '',
            },
          },
        });
        createdCount++;
        console.log(`Successfully created new post: ${post.title} (${post.slug})`);
      }
    } catch (err) {
      errorCount++;
      console.error(`Failed to sync post "${post.title}":`, err);
    }
  }

  console.log(`\n=== Sync Summary ===`);
  console.log(`Total static posts: ${staticPosts.length}`);
  console.log(`Successfully synced to DB: ${createdCount}`);
  console.log(`Skipped (already in DB): ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
