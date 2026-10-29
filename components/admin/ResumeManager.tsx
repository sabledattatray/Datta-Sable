'use client';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FileText, ShieldCheck, Download, History, Upload, Eye, X } from 'lucide-react';
import type { ResumeCollection } from '@/lib/resumes/service';
import s from './ResumeManager.module.css';
import ResumePdfPreview from './ResumePdfPreview';

export default function ResumeManager() {
  const { status } = useSession();
  const [data, setData] = useState<ResumeCollection | null>(null);
  const [selected, setSelected] = useState('master');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{ profile: string; version: string } | null>(null);
  const [restore, setRestore] = useState<string | null>(null);
  const clear = useCallback(() => { setData(null); setPreview(null); setRestore(null); }, []);
  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/resumes', { cache: 'no-store' });
      if (response.status === 401 || response.status === 403) clear();
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not load resumes.');
      setData(result); setError('');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not load resumes.'); }
  }, [clear]);
  useEffect(() => {
    if (status !== 'authenticated') { clear(); return; }
    void refresh();
    const focus = () => { void refresh(); };
    window.addEventListener('focus', focus);
    return () => window.removeEventListener('focus', focus);
  }, [status, clear, refresh]);
  async function save(body: FormData | object) {
    setBusy(true); setError(''); setMessage('');
    try {
      const form = body instanceof FormData;
      const response = await fetch('/api/admin/resumes', { method: 'POST', ...(form ? {} : { headers: { 'Content-Type': 'application/json' } }), body: form ? body : JSON.stringify(body), cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) { if (response.status === 401 || response.status === 403) clear(); throw new Error(result.error || 'Update failed.'); }
      setPreview(null); setRestore(null); await refresh(); setMessage('Saved. The previous documents remain in version history.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Update failed.'); }
    finally { setBusy(false); }
  }
  const profile = data?.profiles.find(p => p.id === selected);
  const active = profile?.versions.find(v => v.id === profile.active);
  const fileUrl = (id: string, format: 'pdf' | 'docx', download = false) => `/api/admin/resumes/${selected}/file?version=${encodeURIComponent(id)}&format=${format}${download ? '&download=1' : ''}`;
  if (status !== 'authenticated') return <p className={s.notice}>Sign in as an administrator to manage private resumes.</p>;
  return <div className={s.workspace}>
    <header className={s.header}><div><p className={s.kicker}>PROFESSIONAL DOCUMENTS</p><h1>Resume management</h1><p>One public master. Role-specific documents kept private.</p></div><span className={s.secure}><ShieldCheck size={16}/> Administrator access</span></header>
    {error && <div role="alert" className={s.notice}>{error}<button onClick={() => void refresh()}>Retry</button></div>}
    {message && <p role="status" className={s.notice}>{message}</p>}
    {!data ? <p aria-live="polite">{error ? 'The collection could not be loaded.' : 'Loading your resumes…'}</p> : <>
      <section className={s.facts} aria-label="Verified professional information"><span>{data.canonical.name}</span><span>{data.canonical.email}</span><span>B.Sc. {data.canonical.graduation}</span><span>DBS Mintek ended {data.canonical.lastEmployerEnd}</span></section>
      <div className={s.profiles} role="group" aria-label="Resume profiles">{data.profiles.map(p => <button key={p.id} className={`${s.profile} ${selected === p.id ? s.selected : ''}`} aria-pressed={selected === p.id} onClick={() => { setSelected(p.id); setPreview(null); setRestore(null); setMessage(''); }}><FileText size={21}/><span>{p.public ? 'PUBLIC MASTER' : 'PRIVATE PROFILE'}</span><strong>{p.title}</strong><small>{p.versions.length} {p.versions.length === 1 ? 'version' : 'versions'}</small></button>)}</div>
      {profile && <section className={s.panel}>
        <div className={s.panelHeader}><div><h2>{profile.title}</h2><p>{active ? `Last updated ${new Date(profile.updatedAt || active.createdAt).toLocaleString('en-IN')}` : 'No files uploaded yet.'}</p></div><span className={s.badge}>{profile.public ? 'Public PDF · private Word master' : 'Private · admin only'}</span></div>
        <div className={s.toolbar}>{active && <><button onClick={() => setPreview({ profile: selected, version: active.id })}><Eye size={15}/>Preview PDF</button><a href={fileUrl(active.id, 'pdf', true)}><Download size={15}/>Download PDF</a><a href={fileUrl(active.id, 'docx', true)}><Download size={15}/>Download Word</a></>}</div>
        {profile.public && <p className={s.hint}>The active master PDF is available at the existing public resume URL. Replacing or restoring this profile updates that public PDF. Regenerate the presentation image when changing its visible content.</p>}
        {preview && <div className={s.preview}><div><strong>PDF preview</strong><button aria-label="Close PDF preview" onClick={() => setPreview(null)}><X size={17}/></button></div><ResumePdfPreview url={`/api/admin/resumes/${preview.profile}/file?version=${preview.version}&format=pdf`}/><p>PDF rendering stays in your browser. Use Download PDF for the original document.</p></div>}
        <form key={selected} className={s.upload} onSubmit={e => { e.preventDefault(); const form = new FormData(e.currentTarget); form.set('profile', selected); form.set('revision', data.revision); form.set('verified', form.get('verified') === 'on' ? 'true' : 'false'); void save(form); }}>
          <h3><Upload size={17}/> Add a replacement version</h3><p>Upload a matching PDF and Word pair, up to 4 MB each. Existing versions are retained.</p>
          <fieldset disabled={busy}><div className={s.fileFields}><label>PDF document<input required name="pdf" type="file" accept="application/pdf,.pdf"/></label><label>Editable Word document<input required name="docx" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"/></label></div>
          <label>Version note<input required name="note" maxLength={300} placeholder="What changed in this version?"/></label><label className={s.check}><input type="checkbox" name="verified" required/>I checked both files against the verified dates, education and contact details above.</label><button className={s.primary} type="submit">{busy ? 'Saving…' : profile.public ? 'Save version and update public master' : 'Save private version'}</button></fieldset>
        </form>
        <div className={s.history}><h3><History size={17}/>Version history</h3>{!profile.versions.length ? <p>No versions yet. Upload the initial PDF and DOCX pair.</p> : profile.versions.map((v, i) => <article key={v.id}><div><strong>Version {profile.versions.length - i}{v.id === profile.active && <span className={s.badge}>Active</span>}</strong><p>{v.note}</p><small>{new Date(v.createdAt).toLocaleString('en-IN')} · PDF {Math.ceil(v.files.pdf.bytes / 1024)} KB · Word {Math.ceil(v.files.docx.bytes / 1024)} KB</small></div><div className={s.versionActions}><button onClick={() => setPreview({ profile: selected, version: v.id })}>Preview</button><a href={fileUrl(v.id, 'pdf', true)}>PDF</a><a href={fileUrl(v.id, 'docx', true)}>Word</a>{v.id !== profile.active && <button disabled={busy || v.sourceHash !== data.canonical.sourceHash} onClick={() => setRestore(v.id)}>Restore</button>}</div>{restore === v.id && <div className={s.confirm}><p>Make this version active? {profile.public ? 'This will change the public master PDF.' : 'The current files will remain in history.'}</p><button disabled={busy} onClick={() => void save({ action: 'restore', profile: selected, version: v.id, revision: data.revision })}>Confirm restore</button><button onClick={() => setRestore(null)}>Cancel</button></div>}</article>)}</div>
      </section>}
    </>}
  </div>;
}
