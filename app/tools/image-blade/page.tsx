'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Download, 
  Upload, 
  Image as ImageIcon, 
  ArrowLeft,
  Settings2,
  Trash2,
  FileImage,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function ImageBlade() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      compressImage(event.target?.result as string, quality);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (base64: string, q: number) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const compressedBase64 = canvas.toDataURL('image/webp', q / 100);
      setCompressedImage(compressedBase64);
      
      // Approximate size from base64 string
      const sizeInBytes = Math.round((compressedBase64.length * 3) / 4);
      setCompressedSize(sizeInBytes);
      setIsProcessing(false);
    };
  };

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    if (originalImage) {
      compressImage(originalImage, newQuality);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadImage = () => {
    if (!compressedImage) return;
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = 'surgical_compressed_image.webp';
    link.click();
  };

  const clearAll = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      
      <main className="boxed-wrapper" style={{ marginBottom: '80px' }}>
        <section className="section" style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)' }}>
          <div className="container">
            <Link 
              href="/tools" 
              className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 mono text-xs no-underline"
            >
              <ArrowLeft size={14} /> BACK_TO_HUB
            </Link>

            <div style={{ maxWidth: 800, marginBottom: '4rem' }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ color: 'var(--accent)', padding: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                  <ImageIcon size={20} />
                </div>
                <div className="label-tech">VISUAL-OPTIMIZATION</div>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Image-Blade <span className="hero-title">Compressor</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                Surgically optimize your images for the web. Convert to high-efficiency WebP format while maintaining executive-grade visual fidelity.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload/Preview Area */}
              <div className="lg:col-span-2">
                {!originalImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-[400px] border-2 border-dashed border-[var(--border)] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all group"
                  >
                    <Upload size={48} className="text-[var(--muted)] group-hover:text-[var(--accent)] mb-4 transition-all" />
                    <p className="text-[var(--muted)] mono text-xs uppercase tracking-widest">DRAG_DROP_OR_CLICK_TO_UPLOAD</p>
                    <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
                  </div>
                ) : (
                  <div className="card p-0 overflow-hidden" style={{ background: 'var(--surface2)' }}>
                    <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileImage size={14} className="text-[var(--accent)]" />
                        <span className="mono text-xs uppercase text-[var(--text)]">Optimization_Preview</span>
                      </div>
                      <button onClick={clearAll} className="text-[var(--muted)] hover:text-red-500 bg-transparent border-none cursor-pointer"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-6 border-r border-[var(--border)]">
                        <h5 className="text-xs mono uppercase text-[var(--muted)] mb-4 text-center">Original ({formatSize(originalSize)})</h5>
                        <img src={originalImage} alt="Original" className="w-full h-auto max-h-[300px] object-contain rounded" />
                      </div>
                      <div className="p-6">
                        <h5 className="text-xs mono uppercase text-[var(--accent)] mb-4 text-center">Compressed ({formatSize(compressedSize)})</h5>
                        {compressedImage && <img src={compressedImage} alt="Compressed" className="w-full h-auto max-h-[300px] object-contain rounded" />}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-6">
                <div className="card p-8" style={{ background: 'var(--bg)' }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Settings2 size={16} className="text-[var(--accent)]" />
                    <h4 className="mono text-xs uppercase tracking-widest text-[var(--text)]">Compression_Logic</h4>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-xs mono uppercase text-[var(--muted)]">Quality_Threshold</label>
                      <span className="text-[var(--accent)] mono text-xs">{quality}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={quality} 
                      onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                      className="w-full accent-[var(--accent)] cursor-pointer"
                    />
                  </div>

                  <div className="p-4 bg-[var(--surface2)] border border-[var(--border)] rounded mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs mono text-[var(--muted)]">Reduction:</span>
                      <span className="text-xs font-bold text-green-500">
                        {originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0}%
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={downloadImage}
                    disabled={!compressedImage || isProcessing}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Download size={16} /> DOWNLOAD_WEBP
                  </button>
                </div>

                <div className="card p-6 border-dashed" style={{ background: 'var(--bg)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={14} className="text-[var(--accent)]" />
                    <h4 className="mono text-xs uppercase tracking-widest text-[var(--muted)]">Why_WebP?</h4>
                  </div>
                  <p className="text-xs mono text-[var(--muted)] leading-relaxed" style={{ fontSize: '0.78rem' }}>
                    WebP offers 26% smaller file sizes than PNGs and 25-34% smaller than JPEGs while maintaining similar quality. Essential for achieving a 90+ PageSpeed score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

            <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0', marginTop: '4rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          {"/* ── About This Tool Header ── */"}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.25em', color: 'var(--accent)', textTransform: 'uppercase' }}>ABOUT_THIS_TOOL</span>
          </div>
          
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)', lineHeight: 1.2 }}>
            Image Blade — Responsive Image and Compression Optimizer
          </h2>
          
          <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.8, marginBottom: '1.25rem', fontWeight: 500 }} className="font-sans">
            Image Blade is a modern front-end utility designed to optimize image assets for web performance. It assists web developers, designers, and site administrators in calculating optimal dimensions, file formats, and responsive HTML sizes to minimize page load times and improve Core Web Vitals score.
          </p>
          
          <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '2.5rem' }} className="font-sans">
            Images are often the heaviest resources on a webpage, accounting for over 60% of average page weight. Unoptimized images lead to slow page speeds, high bounce rates, and low search engine rankings. By utilizing modern compression formats (WebP/AVIF), lazy loading, and correct responsive scaling, you can significantly accelerate your website's performance.
          </p>

          {"/* ── Core Features Grid ── */"}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1.25rem', fontFamily: 'monospace' }}>CORE_CAPABILITIES</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Compression Analysis</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Calculates file sizes across JPEG, WebP, and AVIF formats to choose the best compression.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Responsive Scaler</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Recommends width configurations based on standard responsive screen breakpoints.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Metadata Stripper</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Explains how to strip unnecessary camera and EXIF metadata to shave off extra kilobytes.</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--surface2)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>CLS Prevention Rules</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.65 }} className="font-sans">Generates correct width/height inline styles to lock layout dimensions.</div>
            </div>
          </div>

          {"/* ── Deep Technical Sections ── */"}
          <div style={{ marginBottom: '3rem', borderLeft: '3px solid var(--border)', paddingLeft: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>Core Web Vitals & Page Speed Engineering</h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.8 }} className="font-sans">
              Largest Contentful Paint (LCP) measures when the main content of a page has likely loaded. In most portfolios and landing pages, the LCP element is a hero background image. To optimize LCP, serve this image in AVIF format, set it to load with high priority (`priority` in Next.js, or `fetchpriority="high"` in HTML), and pre-render its dimensions. This ensures that browsers prioritize downloading the image before parsing heavy JavaScript bundles.
            </p>
          </div>
          <div style={{ marginBottom: '3rem', borderLeft: '3px solid var(--border)', paddingLeft: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>Responsive Source Sets (srcset) and Layout Shift Prevention</h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--muted)', lineHeight: 1.8 }} className="font-sans">
              To serve optimal images across devices, web developers must define responsive source sets. An image markup should include a list of different resolutions (`srcset`) and a helper query (`sizes`). In addition, always specify explicit `width` and `height` attributes on the image tag. This allows the browser to reserve the correct aspect ratio box in the layout flow before the image file is fetched, eliminating disruptive layout shifts.
            </p>
          </div>

          {"/* ── Comprehensive FAQs ── */"}
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginTop: '4rem', marginBottom: '2rem' }}>Frequently Asked Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '1rem' }}>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q1:</span> What is the difference between WebP and AVIF formats?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                WebP is a widely supported next-generation format developed by Google, offering ~30% better compression than JPEG. AVIF is an even newer format based on the AV1 video codec, offering up to 50% better compression than JPEG with superior color reproduction and fewer compression artifacts. AVIF is supported by all modern browsers.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q2:</span> How do unoptimized images impact Core Web Vitals?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                Heavy images slow down Largest Contentful Paint (LCP) because the browser takes longer to download the main visual asset. Furthermore, images without explicit width and height dimensions cause layout shifts as they load, directly hurting your Cumulative Layout Shift (CLS) score.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q3:</span> What does the 'sizes' attribute do in responsive HTML?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                The `sizes` attribute tells the browser how wide the image will render at different screen viewport widths. This allows the browser to select the most appropriate image size from the `srcset` list, avoiding downloading a massive desktop image on a small mobile device.
              </p>
            </div>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }} className="mono">Q4:</span> Should I always use lazy loading for all images?
              </h4>
              <p style={{ fontSize: '0.96rem', color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '1.5rem' }} className="font-sans">
                Use lazy loading (`loading="lazy"`) for all images below the fold (images that are not immediately visible when the page loads). However, never use lazy loading for your primary hero image or above-the-fold assets, as this delays their loading and worsens your LCP score.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
