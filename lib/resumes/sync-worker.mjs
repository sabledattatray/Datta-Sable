import { copyFile, mkdir } from 'node:fs/promises';
await mkdir('public/resume-worker', { recursive: true });
await copyFile('node_modules/pdfjs-dist/build/pdf.worker.min.mjs', 'public/resume-worker/pdf.worker.min.mjs');
await copyFile('node_modules/pdfjs-dist/LICENSE', 'public/resume-worker/LICENSE.txt');
