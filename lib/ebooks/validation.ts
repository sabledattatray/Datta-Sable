import { z } from 'zod';

export const ebookEnabled = () => process.env.EBOOK_STORE_ENABLED === 'true';
export const ebookPaymentMode = (): 'test' | 'live' => process.env.EBOOK_PAYMENT_MODE === 'live' || process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_') ? 'live' : 'test';
const lines = z.array(z.string().trim().min(1).max(500)).max(40);
export const categoryInput = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100), name: z.string().trim().min(2).max(100),
  description: z.string().max(2000), icon: z.string().max(40).default('BookOpen'), sortOrder: z.number().int().min(0).max(1000),
  published: z.boolean(), seoTitle: z.string().max(180).nullable().optional(), seoDescription: z.string().max(300).nullable().optional(),
});
export const profileInput = z.object({
  sku: z.string().trim().min(1).max(100), author: z.string().trim().min(1).max(180), edition: z.string().trim().min(1).max(100),
  pageCount: z.number().int().positive().max(10000), language: z.string().min(1).max(80), version: z.string().min(1).max(80),
  featured: z.boolean(), approved: z.boolean(), contents: lines, outcomes: lines, audience: lines, prerequisites: lines, notIncluded: lines,
  license: z.string().min(10).max(2000), updatePolicy: z.string().min(10).max(2000),
});
export const categorySeeds = [
  ['power-bi-dax', 'Power BI & DAX'], ['microsoft-fabric', 'Microsoft Fabric'], ['advanced-excel', 'Advanced Excel'],
  ['sql-databases', 'SQL & Databases'], ['data-analytics-bi', 'Data Analytics & BI'], ['python-automation', 'Python & Automation'],
  ['career-certifications', 'Career & Certifications'], ['ai-productivity', 'AI & Productivity'],
];
export const firstBook = {
  slug: 'power-bi-real-world-projects-2026', title: 'Power BI Real-World Projects',
  excerpt: 'A practical handbook covering five business analytics project walkthroughs.',
  description: 'Build your understanding of business analytics through five guided Power BI scenarios: Sales Performance, HR Analytics, Finance P&L and Budget Variance, Customer Churn and Marketing, and Inventory and Supply Chain. This independently authored practical handbook includes DAX reference notes, troubleshooting and practice challenges. It is not affiliated with or endorsed by Microsoft.',
  category: 'Power BI & DAX', priceMinor: 9900, currency: 'INR', status: 'DRAFT', salesEnabled: false, deliveryReady: false,
  features: ['33-page PDF', '5 guided projects', '2026 Edition'], includedResources: ['33-page PDF handbook'], deliveryMethod: 'ACCOUNT_DOWNLOAD',
};
export const firstProfile = profileInput.parse({
  sku: 'DS-EBOOK-PBI-RWP-2026', author: 'Datta Sable', edition: '2026 Edition', pageCount: 33, language: 'English', version: '1.0', featured: true, approved: false,
  contents: ['Sales Performance', 'HR Analytics', 'Finance P&L and Budget Variance', 'Customer Churn and Marketing', 'Inventory and Supply Chain', 'DAX reference, troubleshooting and practice challenges'],
  outcomes: ['Follow five business analytics workflows', 'Practice translating business questions into measures', 'Use troubleshooting notes and practice challenges'],
  audience: ['Power BI learners', 'Data analysts building practical skills'], prerequisites: ['Basic familiarity with Power BI Desktop and DAX'],
  notIncluded: ['PBIX project files', 'Downloadable CSV datasets', 'Completed dashboard source files'],
  license: 'Personal use only. Redistribution and resale are not permitted.', updatePolicy: 'Includes the purchased edition. Future editions are not included unless expressly stated.',
});
