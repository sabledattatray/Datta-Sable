import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

import { posts as originalPosts } from '../app/blog/data';
import { projects as originalProjects } from '../app/portfolio/data';

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@dattasable.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('--- SEEDING DATABASE ---');
  
  // 1. Seed Admin
  console.log('Updating Admin User...');
  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: 'ADMIN', emailVerified: new Date() },
    create: { email, name: 'Admin User', password: hashedPassword, role: 'ADMIN', emailVerified: new Date() },
  });

  // 2. Seed original blogs with FULL content
  console.log(`Seeding ${originalPosts.length} original blog posts...`);
  for (const post of originalPosts) {
    const p = post as any;
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        readTime: p.readTime,
        date: post.date,
        color: p.color,
        icon: p.icon,
        image: post.image,
        published: true,
      },
      create: {
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        readTime: p.readTime,
        date: post.date,
        color: p.color,
        icon: p.icon,
        image: post.image,
        published: true,
      },
    });
  }

  // 3. Seed original projects
  console.log(`Seeding ${originalProjects.length} original projects...`);
  for (const proj of originalProjects) {
    // Map data structure properties to Prisma schema fields
    const projectDbId = String(proj.id);
    await prisma.project.upsert({
      where: { id: projectDbId },
      update: {
        title: proj.title,
        category: proj.category,
        description: proj.desc,
        impact: proj.impact,
        tools: proj.tools,
        color: proj.color,
        imageUrl: proj.image,
        client: proj.client,
        problem: proj.problem,
        solution: proj.solution,
        github: proj.github,
        live: proj.live,
        published: true,
      },
      create: {
        id: projectDbId,
        title: proj.title,
        category: proj.category,
        description: proj.desc,
        impact: proj.impact,
        tools: proj.tools,
        color: proj.color,
        imageUrl: proj.image,
        client: proj.client,
        problem: proj.problem,
        solution: proj.solution,
        github: proj.github,
        live: proj.live,
        published: true,
      },
    });
  }

  console.log('✅ Seeding complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
});
