import 'server-only';
import { randomUUID } from 'node:crypto';
import { checksum, mimeTypes, validateFile } from './files';
import { canonical, profiles, ResumeError, sourceHash, type ProfileId, type ResumeVersion } from './model';
import { readManifest, readObject, updateManifest, writeDocument } from './storage';

export async function listResumes() {
  const { manifest } = await readManifest();
  return { revision: manifest.revision, canonical: { name: canonical.candidate.name, email: canonical.candidate.email, graduation: canonical.candidate.education.year, lastEmployerEnd: canonical.candidate.dbs_end_date, sourceHash }, profiles: profiles.map(profile => ({ ...profile, updatedAt: manifest.events.filter(e => e.profile === profile.id).at(-1)?.at || null, active: manifest.active[profile.id] || null, versions: manifest.versions.filter(v => v.profile === profile.id).map(({ files, ...v }) => ({ ...v, files: { pdf: { sha256: files.pdf.sha256, bytes: files.pdf.bytes }, docx: { sha256: files.docx.sha256, bytes: files.docx.bytes } } })) })) };
}
export async function replaceResume(input: { profile: ProfileId; revision: string; actor: string; note: string; pdf: Buffer; docx: Buffer; verified: boolean }) {
  if (!input.verified) throw new ResumeError('Confirm that both documents match the verified professional information.');
  validateFile(input.pdf, 'pdf'); validateFile(input.docx, 'docx');
  const before = await readManifest();
  if (before.manifest.revision !== input.revision) throw new ResumeError('The collection changed. Refresh before saving.', 409);
  const id = randomUUID(), createdAt = new Date().toISOString();
  const files = { pdf: { key: `resumes/files/${id}/pdf`, sha256: checksum(input.pdf), bytes: input.pdf.length }, docx: { key: `resumes/files/${id}/docx`, sha256: checksum(input.docx), bytes: input.docx.length } };
  for (const format of ['pdf', 'docx'] as const) {
    await writeDocument(files[format].key, input[format], mimeTypes[format]);
    const stored = await readObject(files[format].key);
    if (!stored || checksum(stored.bytes) !== files[format].sha256) throw new ResumeError('Stored document verification failed. The previous version is still active.', 503);
  }
  const version: ResumeVersion = { id, profile: input.profile, createdAt, updatedBy: input.actor, note: input.note, sourceHash, files };
  await updateManifest(input.revision, manifest => {
    manifest.versions.unshift(version); manifest.active[input.profile] = id;
    manifest.events.push({ at: createdAt, actor: input.actor, action: 'replace', profile: input.profile, version: id });
  });
  return { id };
}
export async function restoreResume(input: { profile: ProfileId; version: string; revision: string; actor: string }) {
  const { manifest } = await readManifest();
  const version = manifest.versions.find(v => v.id === input.version && v.profile === input.profile);
  if (!version) throw new ResumeError('Resume version not found.', 404);
  if (version.sourceHash !== sourceHash) throw new ResumeError('This version uses older professional facts. Review and upload an updated pair instead.', 409);
  for (const format of ['pdf', 'docx'] as const) {
    const file = await readObject(version.files[format].key);
    if (!file || checksum(file.bytes) !== version.files[format].sha256) throw new ResumeError('Version files are missing or damaged. Nothing was restored.', 409);
  }
  await updateManifest(input.revision, current => {
    current.active[input.profile] = version.id;
    current.events.push({ at: new Date().toISOString(), actor: input.actor, action: 'restore', profile: input.profile, version: version.id });
  });
}
export async function resumeFile(profile: ProfileId, id: string | undefined, format: 'pdf' | 'docx') {
  const { manifest } = await readManifest();
  const version = manifest.versions.find(v => v.profile === profile && v.id === (id || manifest.active[profile]));
  if (!version) throw new ResumeError('Document not found.', 404);
  const stored = await readObject(version.files[format].key);
  if (!stored || checksum(stored.bytes) !== version.files[format].sha256) throw new ResumeError('Document integrity verification failed.', 503);
  return { bytes: stored.bytes, version };
}
export type ResumeCollection = Awaited<ReturnType<typeof listResumes>>;
