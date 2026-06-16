import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Datta Sable | Let's Build Something Smarter",
  description: 'Ready to transform your web presence or data strategy? Get in touch with Datta Sable for Next.js development, Power BI consulting, SEO audits, or automation inquiries.',
  alternates: { canonical: 'https://dattasable.com/contact' },
  openGraph: {
    type: 'website',
    title: "Contact Datta Sable | Web Dev, BI & Digital Marketing",
    description: 'Connect for full-stack web development, Power BI consulting, SEO audits, and digital marketing services.',
    url: 'https://dattasable.com/contact',
    images: [{ url: 'https://dattasable.com/images/dattasable.com.webp', width: 1200, height: 630, alt: 'Contact Datta Sable — Web Developer & Digital Marketing Expert' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Datta Sable',
    description: 'Web development, BI consulting, SEO & digital marketing.',
    images: ['https://dattasable.com/images/dattasable.com.webp'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

