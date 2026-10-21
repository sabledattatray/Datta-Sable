import { prisma } from '@/lib/prisma';
import { parseProductDetails, type ProductDetails } from './product-details';
export const productSettingKey = (id: string) => `commerce.product.${id}`;
export async function productDetailsMap(ids: string[]): Promise<Map<string, ProductDetails>> {
  if (!ids.length) return new Map();
  const settings = await prisma.systemSetting.findMany({ where: { key: { in: ids.map(productSettingKey) } }, select: { key: true, value: true } });
  return new Map(settings.map(s => [s.key.slice('commerce.product.'.length), parseProductDetails(s.value)]));
}
