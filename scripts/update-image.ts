import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const imagePath = "/images/blog/Rust for Data Engineers in 2026.webp";
  
  await prisma.post.update({
    where: { slug: "rust-for-data-engineers" },
    data: { image: imagePath }
  });

  console.log("Image updated successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
