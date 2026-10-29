'use client';
import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import s from './ResumeManager.module.css';

export default function ResumePdfPreview({ url }: { url: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const controller = new AbortController(); let disposed = false;
    let task: ReturnType<typeof import('pdfjs-dist').getDocument> | undefined;
    setPdf(null); setError(''); setPage(1); setReady(false);
    async function load() {
      try {
        const [engine, response] = await Promise.all([import('pdfjs-dist'), fetch(url, { cache: 'no-store', credentials: 'same-origin', signal: controller.signal })]);
        if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? 'Your session ended. Sign in again to preview this document.' : 'The PDF could not be loaded.');
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (disposed) return;
        engine.GlobalWorkerOptions.workerSrc = `/resume-worker/pdf.worker.min.mjs?v=${engine.version}`;
        task = engine.getDocument({ data: bytes, enableXfa: false });
        const document = await task.promise;
        if (disposed) { await task.destroy(); return; }
        setPdf(document);
      } catch (e) { if (!disposed) setError(e instanceof Error ? e.message : 'PDF preview unavailable. Use Download PDF.'); }
    }
    void load();
    const element = canvas.current;
    return () => { disposed = true; controller.abort(); void task?.destroy(); if (element) { element.width = 0; element.height = 0; } };
  }, [url]);
  useEffect(() => {
    if (!pdf || !canvas.current) return;
    const element = canvas.current; let disposed = false;
    let render: ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']> | undefined;
    setReady(false);
    async function draw() {
      try {
        const p = await pdf!.getPage(page); if (disposed) return;
        const context = element.getContext('2d'); if (!context) return;
        const viewport = p.getViewport({ scale: 1.5 }); element.width = viewport.width; element.height = viewport.height;
        render = p.render({ canvas: element, canvasContext: context, viewport }); await render.promise;
        if (!disposed) setReady(true);
      } catch (e) { if (!disposed) setError(e instanceof Error ? e.message : 'PDF rendering failed.'); }
    }
    void draw(); return () => { disposed = true; render?.cancel(); };
  }, [pdf, page]);
  return <div className={s.pdfViewer}>
    {pdf && <nav aria-label="PDF pages"><button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous page</button><span>Page {page} of {pdf.numPages}</span><button disabled={page === pdf.numPages} onClick={() => setPage(p => p + 1)}>Next page</button></nav>}
    {error ? <p role="alert">{error}</p> : !ready && <p role="status">Rendering PDF preview…</p>}
    <div className={s.pdfCanvas}><canvas ref={canvas} role="img" aria-label={`Resume PDF page ${page}. Download the PDF for selectable text.`}/></div>
  </div>;
}
