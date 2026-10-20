export class UploadValidationError extends Error {}
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const mediaTypes: Record<string, { extension: string; matches: (bytes: Uint8Array) => boolean }> = {
  'image/jpeg': { extension: 'jpg', matches: bytes => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  'image/png': { extension: 'png', matches: bytes => [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte) },
  'image/webp': { extension: 'webp', matches: bytes => new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP' },
  'image/gif': { extension: 'gif', matches: bytes => /^GIF8[79]a$/.test(new TextDecoder().decode(bytes.slice(0, 6))) },
  'application/pdf': { extension: 'pdf', matches: bytes => new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-' },
};

export async function validateUpload(file: FormDataEntryValue | null, mode: 'media' | 'resume' = 'media') {
  if (!(file instanceof File)) throw new UploadValidationError('Select a file to upload.');
  if (!file.size || file.size > MAX_UPLOAD_BYTES) throw new UploadValidationError('Files must be nonempty and no larger than 5 MB.');
  const rule = mediaTypes[file.type.toLowerCase()];
  if (!rule || (mode === 'resume' && file.type !== 'application/pdf')) throw new UploadValidationError(mode === 'resume' ? 'Upload a PDF resume.' : 'Upload a JPEG, PNG, WebP, GIF or PDF file.');
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension !== rule.extension && !(rule.extension === 'jpg' && extension === 'jpeg')) throw new UploadValidationError('The file extension does not match its declared type.');
  const prefix = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!rule.matches(prefix)) throw new UploadValidationError('The file content does not match its declared type.');
  return { file, extension: rule.extension };
}
