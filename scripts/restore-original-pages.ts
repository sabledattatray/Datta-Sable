import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// List of system pages that have complex custom-coded layouts
const complexPages = [
  'about',
  'services',
  'careers',
  'contact',
  'portfolio',
  'faq',
  'infrastructure',
  'start-here'
];

async function main() {
  console.log('Restoring original pages by setting database overrides to draft...');

  for (const slug of complexPages) {
    await prisma.page.updateMany({
      where: { slug },
      data: { published: false }
    });
    console.log(`✓ Restored original static layout for: /${slug}`);
  }

  console.log('System restore complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
