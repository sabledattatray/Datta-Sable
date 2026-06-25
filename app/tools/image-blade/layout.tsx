import type { Metadata } from 'next';

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
  return children;
}
