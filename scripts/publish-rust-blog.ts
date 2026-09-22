import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = "C:\\Users\\sable\\.gemini\\antigravity-ide\\brain\\95d698dd-353d-4472-a5e8-8c2b12fbae6c\\rust-for-data-engineers.md";
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Basic frontmatter parsing
  const title = "Rust for Data Engineers in 2026: Why Python Data Tools Are Moving to Rust";
  const slug = "rust-for-data-engineers";
  const excerpt = "Should data engineers learn Rust in 2026? Explore Polars, DataFusion, Arrow, Ruff and uv, and understand why Python data tools increasingly rely on Rust.";
  
  // Extract content without frontmatter
  const contentParts = fileContent.split('---');
  const content = contentParts.length >= 3 ? contentParts.slice(2).join('---').trim() : fileContent;

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }); // e.g., "September 22, 2026"

  console.log(`Publishing post: ${title}`);
  
  const post = await prisma.post.upsert({
    where: { slug: slug },
    update: {
      title,
      content,
      excerpt,
      category: "Data Engineering",
      readTime: 12,
      date,
      published: true
    },
    create: {
      title,
      slug,
      content,
      excerpt,
      category: "Data Engineering",
      readTime: 12,
      date,
      published: true
    }
  });

  console.log(`Successfully published post with ID: ${post.id}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
