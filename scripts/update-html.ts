import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const filePath = "d:\\Datta Sable\\dattasable\\rust.html";
  let fileContent = fs.readFileSync(filePath, 'utf-8');

  // Strip frontmatter which marked converted to an <hr> and <h2> block
  const hrIndex = fileContent.indexOf('<hr>');
  const nextHrIndex = fileContent.indexOf('<hr>', hrIndex + 1);
  
  if (hrIndex !== -1 && nextHrIndex !== -1 && nextHrIndex < 1000) {
    fileContent = fileContent.substring(nextHrIndex + 4).trim();
  } else {
      // Manual cleanup just in case
      fileContent = fileContent.replace(/<hr>\s*<h2>title:[\s\S]*?slug: .*?<\/h2>/, '').trim();
  }

  // Optional: Enhance the alert box for better UI
  fileContent = fileContent.replace('<blockquote>\n<p>[!TIP]', '<blockquote style="border-left: 4px solid var(--accent); padding-left: 1rem; background: var(--surface2); padding: 1rem; border-radius: 0.25rem;"><p><strong style="color: var(--accent);">💡 TIP</strong><br/>');

  await prisma.post.update({
    where: { slug: "rust-for-data-engineers" },
    data: { content: fileContent }
  });

  console.log("Post content updated to HTML successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
