import { inflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { ResumeError } from './model';

export const checksum = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
export const mimeTypes = { pdf: 'application/pdf', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
export function validateFile(bytes: Buffer, format: 'pdf' | 'docx') {
  if (!bytes.length || bytes.length > 4 * 1024 * 1024) throw new ResumeError('Each document must be between 1 byte and 4 MB.', 413);
  if (format === 'pdf') {
    const text = bytes.toString('latin1');
    if (!text.startsWith('%PDF-') || !text.slice(-2048).includes('%%EOF') || /\/(JavaScript|JS|Launch|EmbeddedFile|Encrypt)\b/.test(text)) throw new ResumeError('Use a valid, unencrypted PDF without scripts or attached files.');
    return;
  }
  // Read ZIP central-directory metadata; never unpack user-controlled filenames.
  if (bytes.length < 22 || bytes.readUInt32LE(0) !== 0x04034b50) throw new ResumeError('Choose an actual DOCX file.');
  let end = bytes.length - 22;
  for (; end >= Math.max(0, bytes.length - 65557); end--) if (bytes.readUInt32LE(end) === 0x06054b50) break;
  if (end < 0 || end < bytes.length - 65557) throw new ResumeError('Invalid DOCX archive.');
  const count = bytes.readUInt16LE(end + 10); let offset = bytes.readUInt32LE(end + 16), total = 0;
  const entries = new Set<string>();
  if (count > 500) throw new ResumeError('DOCX archive has too many entries.');
  for (let i = 0; i < count; i++) {
    if (offset + 46 > bytes.length || bytes.readUInt32LE(offset) !== 0x02014b50) throw new ResumeError('Invalid DOCX directory.');
    const length = bytes.readUInt16LE(offset + 28), compressed = bytes.readUInt32LE(offset + 20), size = bytes.readUInt32LE(offset + 24), method = bytes.readUInt16LE(offset + 10), local = bytes.readUInt32LE(offset + 42);
    if (offset + 46 + length > bytes.length) throw new ResumeError('Invalid DOCX entry.');
    const name = bytes.subarray(offset + 46, offset + 46 + length).toString('utf8'); total += size;
    if (entries.has(name) || name.includes('..') || name.includes('\\') || name.startsWith('/') || /vbaProject|activeX|embeddings\//i.test(name) || total > 40 * 1024 * 1024 || size > 8 * 1024 * 1024 || ![0, 8].includes(method)) throw new ResumeError('Unsafe or oversized DOCX archive.');
    entries.add(name);
    if (name === 'word/document.xml') {
      if (local + 30 > bytes.length || bytes.readUInt32LE(local) !== 0x04034b50) throw new ResumeError('Invalid DOCX document.');
      const start = local + 30 + bytes.readUInt16LE(local + 26) + bytes.readUInt16LE(local + 28);
      if (start + compressed > bytes.length) throw new ResumeError('Truncated DOCX document.');
      const raw = bytes.subarray(start, start + compressed);
      const xml = (method === 8 ? inflateRawSync(raw, { maxOutputLength: 8 * 1024 * 1024 }) : raw).toString('utf8');
      if (!xml.includes('<w:document') || /<!DOCTYPE|<!ENTITY/.test(xml)) throw new ResumeError('Unsafe DOCX XML.');
    }
    offset += 46 + length + bytes.readUInt16LE(offset + 30) + bytes.readUInt16LE(offset + 32);
  }
  if (!entries.has('word/document.xml') || !entries.has('[Content_Types].xml')) throw new ResumeError('The archive is not a Word document.');
}
