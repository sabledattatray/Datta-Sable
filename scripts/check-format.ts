import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.post.findFirst({where: {slug: 'measuring-bi-roi-financial-framework'}, select: {content: true}}).then(p => {
  console.log(p?.content?.substring(0, 500));
  prisma.$disconnect();
});
