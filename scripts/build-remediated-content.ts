import fs from 'fs';
import path from 'path';
import { editorialRevisions } from '../content/editorial/revisions';

// Helper to compute word count from HTML string
function countWords(html: string): number {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
}

// Map existing sourceHashes and sourceTitles
const existingMap = new Map(editorialRevisions.map(r => [r.slug, r]));

console.log(`Starting content remediation builder for ${editorialRevisions.length} articles...`);

