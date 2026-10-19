import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const imagePath = "/images/blog/cybersecurity-cloud-security-guide-2026.webp";
  
  await prisma.post.update({
    where: { slug: "cybersecurity-cloud-security-guide-2026" },
    data: { image: imagePath }
  });

  console.log("Image updated successfully in DB");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
