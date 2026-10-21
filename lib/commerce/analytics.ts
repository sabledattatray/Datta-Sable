'use client';

type EcommerceItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  price?: number;
  currency?: string;
  index?: number;
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Safely emit GA4 analytics events adhering to GDPR/privacy guidelines.
 * Never includes PII (no names, emails, phone numbers).
 */
export function trackEcommerceEvent(eventName: string, params: Record<string, any>) {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
    }
  } catch (err) {
    // Analytics failures must never crash or block UI operations
    console.debug('Analytics telemetry ignored:', err);
  }
}

export function trackViewItemList(items: EcommerceItem[], listName = 'Digital Products Catalog') {
  trackEcommerceEvent('view_item_list', {
    item_list_name: listName,
    items: items.map((item, idx) => ({
      item_id: item.item_id,
      item_name: item.item_name,
      item_category: item.item_category || 'Digital Resource',
      price: item.price,
      currency: item.currency || 'USD',
      index: item.index ?? idx + 1,
    })),
  });
}

export function trackSelectItem(item: EcommerceItem, listName = 'Digital Products Catalog') {
  trackEcommerceEvent('select_item', {
    item_list_name: listName,
    items: [
      {
        item_id: item.item_id,
        item_name: item.item_name,
        item_category: item.item_category || 'Digital Resource',
        price: item.price,
        currency: item.currency || 'USD',
      },
    ],
  });
}

export function trackViewItem(item: EcommerceItem) {
  trackEcommerceEvent('view_item', {
    currency: item.currency || 'USD',
    value: item.price,
    items: [
      {
        item_id: item.item_id,
        item_name: item.item_name,
        item_category: item.item_category || 'Digital Resource',
        price: item.price,
        currency: item.currency || 'USD',
      },
    ],
  });
}

export function trackBeginCheckout(item: EcommerceItem) {
  trackEcommerceEvent('begin_checkout', {
    currency: item.currency || 'USD',
    value: item.price,
    items: [
      {
        item_id: item.item_id,
        item_name: item.item_name,
        item_category: item.item_category || 'Digital Resource',
        price: item.price,
        currency: item.currency || 'USD',
      },
    ],
  });
}

export function trackWhatsAppInquiry(productSlug: string, productTitle: string) {
  trackEcommerceEvent('whatsapp_click', {
    source_page: 'product_detail',
    product_slug: productSlug,
    product_title: productTitle,
    contact_method: 'whatsapp',
  });
}
