import type { Metadata } from 'next';
import SchemaScript from '@/components/SchemaScript';

export const metadata: Metadata = {
  title: 'Image Blade — AI-Powered Image Processing Tool | Datta Sable',
  description:
    'Free Image Blade tool by Datta Sable. Process, compress, and optimize images for the web. Convert formats, resize, and enhance images for better performance and SEO without losing quality.',
  keywords: ['image optimizer', 'image compressor', 'image processing tool', 'web image optimizer', 'image converter', 'free image tool'],
  alternates: { canonical: 'https://dattasable.com/tools/image-blade' },
  openGraph: {
    title: 'Image Blade — AI-Powered Image Processing Tool',
    description: 'Process, compress, and optimize images for the web. Free image tool by Datta Sable.',
    url: 'https://dattasable.com/tools/image-blade',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaScript schema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Image-Blade Compressor",
        "description": "Process, compress, and optimize images for the web. Convert formats, resize, and enhance without losing quality.",
        "url": "https://dattasable.com/tools/image-blade",
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript",
        "featureList": [
          "Client-Side Image Compression",
          "WebP & AVIF Conversion",
          "Image Resize",
          "Quality Control",
          "Batch Processing",
          "No Upload Required"
        ],
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "author": { "@id": "https://dattasable.com/#person" },
        "publisher": { "@id": "https://dattasable.com/#organization" },
        "isPartOf": { "@id": "https://dattasable.com/#website" }
      }} />
      {children}
    </>
  );
}
