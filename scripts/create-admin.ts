import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

import { posts as originalPosts } from '../app/blog/data';
import { projects as originalProjects } from '../app/portfolio/data';

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !email.includes('@')) throw new Error('Set ADMIN_EMAIL explicitly before running the database seed.');
  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  if ((!existingAdmin || password) && (!password || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72)) throw new Error('Set ADMIN_PASSWORD to a unique password of at least 12 characters and at most 72 UTF-8 bytes.');
  const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

  console.log('--- SEEDING DATABASE ---');
  
  // 1. Seed Admin
  console.log('Checking Admin User...');
  if (existingAdmin) {
    console.log(`Admin user ${email} already exists. Ensuring ADMIN role...`);
    await prisma.user.update({
      where: { email },
      data: {
        role: 'ADMIN',
        ...(process.env.ADMIN_PASSWORD ? { password: hashedPassword } : {}),
      }
    });
  } else {
    console.log(`Creating Admin user ${email}...`);
    await prisma.user.create({
      data: {
        email,
        name: 'Admin User',
        password: hashedPassword!,
        role: 'ADMIN',
        emailVerified: new Date()
      }
    });
  }


  // 2. Seed original blogs with FULL content
  console.log(`Seeding ${originalPosts.length} original blog posts...`);
  for (const post of originalPosts) {
    const p = post as any;
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: process.env.SEED_UPDATE_CONTENT === '1' ? {
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        readTime: Number(p.readTime) || 5,
        date: post.date,
        color: p.color,
        icon: p.icon,
        image: post.image,
        published: p.published !== undefined ? p.published : true,
        blocks: p.blocks || { focusedKeyword: '' },
      } : {},
      create: {
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        readTime: Number(p.readTime) || 5,
        date: post.date,
        color: p.color,
        icon: p.icon,
        image: post.image,
        published: p.published !== undefined ? p.published : true,
        blocks: p.blocks || { focusedKeyword: '' },
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
      update: process.env.SEED_UPDATE_CONTENT === '1' ? {
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
      } : {},
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
