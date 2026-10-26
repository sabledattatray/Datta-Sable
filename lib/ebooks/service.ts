import { prisma } from '@/lib/prisma';
import { CommerceError } from '@/lib/commerce/shared';
import { transaction } from '@/lib/commerce/payments';
import { categorySeeds, firstBook, firstProfile, ebookPaymentMode } from './validation';

export async function seedEbooks() {
  return transaction(async tx => {
    const categories = [];
    for (const [index, [slug, name]] of categorySeeds.entries()) categories.push(await tx.ebookCategory.upsert({ where: { slug }, create: { slug, name, sortOrder: index, description: `Practical independent learning resources for ${name}.` }, update: {} }));
    const product = await tx.commerceProduct.upsert({ where: { slug: firstBook.slug }, create: firstBook, update: {} });
    await tx.ebookProfile.upsert({ where: { productId: product.id }, create: { productId: product.id, ...firstProfile }, update: {} });
    for (const slug of ['power-bi-dax', 'data-analytics-bi']) {
      const category = categories.find(c => c.slug === slug)!;
      await tx.ebookCategoryLink.upsert({ where: { productId_categoryId: { productId: product.id, categoryId: category.id } }, create: { productId: product.id, categoryId: category.id, isPrimary: slug === 'power-bi-dax' }, update: {} });
    }
    return product;
  });
}

// Applied to all checkout entry points, including the pre-existing generic API.
export async function assertEbookSale(productId: string) {
  const ebook = await prisma.ebookProfile.findUnique({ where: { productId }, include: { product: { include: { resources: { where: { active: true }, include: { asset: true } } } } } });
  if (!ebook) return;
  if (process.env.EBOOK_STORE_ENABLED !== 'true') throw new CommerceError('The eBook store is not enabled.', 503);
  if (ebookPaymentMode() === 'live') {
    if (process.env.EBOOK_LIVE_CHECKOUT_APPROVED !== 'true') throw new CommerceError('Live eBook checkout has not been approved.', 503);
    if (!process.env.COMMERCE_BLOB_READ_WRITE_TOKEN || !process.env.RAZORPAY_LIVE_WEBHOOK_SECRET) throw new CommerceError('Live payment delivery and webhook setup is incomplete.', 503);
  } else if (!process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_') && !process.env.RAZORPAY_TEST_KEY_ID?.startsWith('rzp_test_')) throw new CommerceError('Test checkout is not configured.', 503);
  if (!ebook.approved || !ebook.product.image || ebook.product.currency !== 'INR' || !ebook.product.resources.some(r => r.asset && r.asset.version === ebook.version)) throw new CommerceError('This eBook is awaiting its approved cover and final PDF.', 409);
}
