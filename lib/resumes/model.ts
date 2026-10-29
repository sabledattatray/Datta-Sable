import { createHash } from 'node:crypto';
import { z } from 'zod';
import candidate from '@/resume-system/data/candidate.json';
import experience from '@/resume-system/data/experience.json';
import projects from '@/resume-system/data/projects.json';

export const profileId = z.enum(['master', 'senior_mis', 'power_bi_analyst', 'bfsi_analytics']);
export type ProfileId = z.infer<typeof profileId>;
export const profiles: { id: ProfileId; title: string; public: boolean }[] = [
  { id: 'master', title: 'Master Professional Resume', public: true },
  { id: 'senior_mis', title: 'Senior MIS & Reporting Analyst', public: false },
  { id: 'power_bi_analyst', title: 'Power BI & Business Intelligence Analyst', public: false },
  { id: 'bfsi_analytics', title: 'BFSI Risk & Collections Analytics', public: false },
];
export const canonical = { candidate, experience, projects };
export const sourceHash = createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
export const fileSchema = z.object({ key: z.string().regex(/^resumes\/files\/[a-f0-9-]{36}\/(pdf|docx)$/), sha256: z.string().regex(/^[a-f0-9]{64}$/), bytes: z.number().int().positive().max(4 * 1024 * 1024) });
export const versionSchema = z.object({ id: z.string().uuid(), profile: profileId, createdAt: z.string().datetime(), updatedBy: z.string().max(100), note: z.string().max(300), sourceHash: z.string().length(64), files: z.object({ pdf: fileSchema, docx: fileSchema }) });
export const manifestSchema = z.object({ revision: z.string(), active: z.record(z.string(), z.string().uuid()), versions: z.array(versionSchema).max(1000), events: z.array(z.object({ at: z.string(), actor: z.string(), action: z.enum(['replace', 'restore', 'seed']), profile: profileId, version: z.string().uuid() })).max(10000) });
export type ResumeVersion = z.infer<typeof versionSchema>;
export type Manifest = z.infer<typeof manifestSchema>;
export const emptyManifest = (): Manifest => ({ revision: 'empty', active: {}, versions: [], events: [] });
export class ResumeError extends Error { constructor(message: string, public status = 400) { super(message); } }
export const privateHeaders = { 'Cache-Control': 'private, no-store, max-age=0', 'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store', 'Pragma': 'no-cache', 'Expires': '0', 'Vary': 'Cookie', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' };
