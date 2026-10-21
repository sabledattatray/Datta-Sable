'use client';
import { hasAnalyticsConsent } from '@/lib/analytics-consent';
import { readLocalStorage, writeLocalStorage } from '@/lib/browser-storage';
export type EcommerceItem = { item_id: string; item_name: string; item_category?: string; price: number; currency: string; index?: number; testOnly?: boolean };
declare global { interface Window { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[]; } }
const sentTransactions = new Set<string>();
function itemFields(item: EcommerceItem) {
  return { item_id: item.item_id, item_name: item.item_name, item_category: item.item_category, price: item.price, ...(item.index === undefined ? {} : { index: item.index }) };
}
function emit(name: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return false;
  try {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
    else if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...params });
    else return false;
    return true;
  } catch { return false; }
}
export function trackViewItemList(items: EcommerceItem[]) {
  const real = items.filter(i => !i.testOnly);
  if (real.length) emit('view_item_list', { item_list_name: 'Digital Products Catalog', items: real.map(itemFields) });
}
export function trackSelectItem(item: EcommerceItem) { if (!item.testOnly) emit('select_item', { item_list_name: 'Digital Products Catalog', items: [itemFields(item)] }); }
export function trackViewItem(item: EcommerceItem) { if (!item.testOnly) emit('view_item', { currency: item.currency, value: item.price, items: [itemFields(item)] }); }
export function trackBeginCheckout(item: EcommerceItem) { if (!item.testOnly) emit('begin_checkout', { currency: item.currency, value: item.price, items: [itemFields(item)] }); }
export function trackVerifiedPurchase(order: { mode: string; status: string; number: string; totalMinor: number; currency: string; items: { productId: string; title: string; unitPriceMinor: number }[] }) {
  if (order.mode !== 'live' || order.status !== 'PAID' || !hasAnalyticsConsent()) return;
  const key = `commerce.analytics.purchase:${order.number}`;
  if (sentTransactions.has(key) || readLocalStorage(key)) return;
  if (emit('purchase', { transaction_id: order.number, currency: order.currency, value: order.totalMinor / 100, items: order.items.map(i => ({ item_id: i.productId, item_name: i.title, price: i.unitPriceMinor / 100, quantity: 1 })) })) {
    sentTransactions.add(key); writeLocalStorage(key, 'sent');
  }
}
export function trackWhatsAppInquiry(productSlug: string) { emit('whatsapp_click', { source_page: 'product_detail', product_slug: productSlug }); }
