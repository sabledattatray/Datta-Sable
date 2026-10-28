'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { firstBook, firstProfile } from '@/lib/ebooks/validation';
import type { z } from 'zod';
import type { profileInput } from '@/lib/ebooks/validation';
import s from './Books.module.css';

type Profile = z.infer<typeof profileInput>;
type Product = typeof firstBook & { id?: string; image?: string | null; seoTitle?: string | null; seoDescription?: string | null };
type Book = Product & {
  ebook: Profile & { categories: { categoryId: string }[] };
  resources: { id: string; title: string; active: boolean; pathname?: string; asset?: { sha256: string; byteSize: number; version: string; filename?: string } | null }[];
};
type Category = { id: string; slug: string; name: string; description: string; icon: string; sortOrder: number; published: boolean; seoTitle?: string | null; seoDescription?: string | null };
type Data = {
  books: Book[];
  categories: Category[];
  grants: { id: string; status: string; product: { title: string }; order: { number: string; customerEmail: string; status: string } }[];
  mail: { status: string; _count: number }[];
  enabled: boolean;
  testMode: boolean;
};

const blankCategory = { slug: '', name: '', description: '', icon: 'BookOpen', sortOrder: 0, published: true };

export default function Admin() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [profile, setProfile] = useState<Profile>(firstProfile);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<Omit<Category, 'id'> & { id?: string } | null>(null);
  const [publish, setPublish] = useState(false);
  const [reason, setReason] = useState('');

  async function refresh() {
    const r = await fetch('/api/ebooks/admin', { cache: 'no-store' });
    const body = await r.json();
    if (!r.ok) throw new Error(body.error);
    setData(body);
  }

  useEffect(() => {
    refresh().catch(e => setError(e.message));
  }, []);

  async function action(body: unknown) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const r = await fetch('/api/ebooks/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error);
      await refresh();
      setNotice('Action completed successfully.');
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed.');
      return null;
    } finally {
      setBusy(false);
    }
  }

  function edit(book?: Book) {
    setProduct(book ? { ...book } : { ...firstBook, slug: '', title: '', excerpt: '', description: '' });
    setProfile(book?.ebook || { ...firstProfile, sku: '', approved: false });
    setCategories(book?.ebook.categories.map(c => c.categoryId) || []);
    setPublish(book?.status === 'PUBLISHED');
  }

  return (
    <div className={`${s.page} ${s.admin}`}>
      <p className={s.eyebrow}>COMMERCE / DIGITAL LEARNING</p>
      <h1>eBook Studio & Management</h1>
      <p>Edit metadata, instantly publish or unpublish, delete drafts, and download source PDFs directly without payment.</p>

      <div className={s.actions}>
        <button className={s.button} disabled={busy} onClick={() => edit()}>
          + Create eBook
        </button>
        <button className={s.secondary} disabled={busy} onClick={() => action({ action: 'seed' })}>
          Seed missing categories & draft handbook
        </button>
        <button className={s.secondary} onClick={() => setCategory(blankCategory)}>
          Add category
        </button>
        <Link className={s.secondary} href="/admin/orders">
          Orders & Transactions
        </Link>
        <Link className={s.secondary} href="/ebooks" target="_blank" rel="noopener noreferrer">
          View Storefront ↗
        </Link>
      </div>

      {error && <p role="alert" className={s.notice} style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.08)' }}>{error}</p>}
      {notice && <p role="status" className={s.notice} style={{ borderColor: 'rgba(34, 197, 94, 0.4)', background: 'rgba(34, 197, 94, 0.08)' }}>{notice}</p>}

      {data && (
        <>
          <div className={s.strip}>
            <div>
              <h3>{data.books.filter(b => b.status === 'PUBLISHED').length} Published</h3>
              <p>{data.books.filter(b => b.status !== 'PUBLISHED').length} Drafts / Inactive</p>
            </div>
            <div>
              <h3>Storefront {data.enabled ? 'Active' : 'Disabled'}</h3>
              <p>EBOOK_STORE_ENABLED: {String(data.enabled)}</p>
            </div>
            <div>
              <h3>{data.testMode ? 'Test Mode' : 'Live Mode'}</h3>
              <p>{data.testMode ? 'Test checkout active' : 'Live checkout configured'}</p>
            </div>
            <div>
              <h3>Access Deliveries</h3>
              <p>{data.mail.map(m => `${m.status}: ${m._count}`).join(' · ') || 'No pending jobs'}</p>
            </div>
          </div>

          <section className={s.section}>
            <h2>eBook Catalog ({data.books.length} Books)</h2>
            <div className={s.scroll}>
              <table>
                <thead>
                  <tr>
                    <th>Title & Slug</th>
                    <th>Edition</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Direct Download</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.books.map(b => (
                    <tr key={b.id}>
                      <td>
                        <strong>{b.title}</strong>
                        <br />
                        <code style={{ fontSize: '11px', color: 'var(--muted)' }}>{b.slug}</code>
                      </td>
                      <td>{b.ebook.edition}</td>
                      <td>₹{(b.priceMinor / 100).toFixed(2)}</td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: b.status === 'PUBLISHED' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                            color: b.status === 'PUBLISHED' ? '#22c55e' : '#eab308',
                            border: b.status === 'PUBLISHED' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
                          }}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <a
                          href={`/api/ebooks/admin/download?id=${b.id}`}
                          className={s.secondary}
                          download={`${b.slug}.pdf`}
                          title="Instant download without payment as Admin"
                          style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          📥 PDF
                        </a>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {b.status === 'PUBLISHED' ? (
                            <button
                              className={s.secondary}
                              style={{ padding: '6px 10px', fontSize: '12px' }}
                              disabled={busy}
                              onClick={() => action({ action: 'unpublish', id: b.id })}
                              title="Unpublish this book and revert to draft"
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button
                              className={s.button}
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              disabled={busy}
                              onClick={() => action({ action: 'publish', id: b.id })}
                              title="Publish this book immediately to the storefront"
                            >
                              🚀 Publish
                            </button>
                          )}
                          <button
                            className={s.secondary}
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                            onClick={() => edit(b)}
                          >
                            Edit
                          </button>
                          <button
                            className={s.secondary}
                            style={{ padding: '6px 10px', fontSize: '12px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.35)' }}
                            disabled={busy}
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${b.title}"? This action cannot be undone.`)) {
                                action({ action: 'delete', id: b.id });
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!data.books.length && (
              <p className={s.empty}>No eBooks yet. Seed the initial catalog or create a new draft.</p>
            )}
          </section>

          <section className={s.section}>
            <h2>Categories</h2>
            <div className={s.categories}>
              {data.categories.map(c => (
                <div key={c.id} className={s.card}>
                  <strong>{c.name}</strong>
                  <p>{c.published ? 'Active' : 'Hidden'} · order {c.sortOrder}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button className={s.secondary} onClick={() => setCategory(c)}>
                      Edit
                    </button>
                    <button
                      className={s.secondary}
                      disabled={busy}
                      onClick={() => action({ action: 'delete-category', id: c.id })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={s.section}>
            <h2>Reader Access Grants</h2>
            <label className={s.field}>
              Reason for revocation (10 characters minimum)
              <input value={reason} onChange={e => setReason(e.target.value)} maxLength={500} placeholder="Customer refund requested or security revocation..." />
            </label>
            <div className={s.scroll}>
              <table>
                <thead>
                  <tr>
                    <th>Book / Order</th>
                    <th>Reader</th>
                    <th>Access Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.grants.map(g => (
                    <tr key={g.id}>
                      <td>
                        {g.product.title}
                        <br />
                        <code style={{ fontSize: '11px', color: 'var(--muted)' }}>{g.order.number}</code>
                      </td>
                      <td>{g.order.customerEmail}</td>
                      <td>{g.status} / {g.order.status}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className={s.secondary} disabled={busy} onClick={() => action({ action: 'resend', id: g.id })}>
                            Resend access
                          </button>
                          <button
                            className={s.secondary}
                            disabled={busy || reason.trim().length < 10 || g.status !== 'ACTIVE'}
                            onClick={() => action({ action: 'revoke', id: g.id, reason })}
                          >
                            Revoke
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {category && (
        <section className={s.section}>
          <h2>{category.id ? 'Edit' : 'New'} Category</h2>
          <form
            className={s.form}
            onSubmit={async e => {
              e.preventDefault();
              const { id, ...fields } = category;
              if (await action({ action: 'category', id, category: fields })) setCategory(null);
            }}
          >
            {(['name', 'slug', 'description', 'icon', 'seoTitle', 'seoDescription'] as const).map(key => (
              <label key={key} className={s.field}>
                {key}
                <input
                  required={key === 'name' || key === 'slug'}
                  value={category[key] || ''}
                  onChange={e => setCategory({ ...category, [key]: e.target.value })}
                />
              </label>
            ))}
            <label className={s.field}>
              Sort order
              <input
                type="number"
                min={0}
                value={category.sortOrder}
                onChange={e => setCategory({ ...category, sortOrder: Number(e.target.value) })}
              />
            </label>
            <label className={s.check}>
              <input
                type="checkbox"
                checked={category.published}
                onChange={e => setCategory({ ...category, published: e.target.checked })}
              />
              Active
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className={s.button} disabled={busy}>Save category</button>
              <button type="button" className={s.secondary} onClick={() => setCategory(null)}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      {product && (
        <section className={s.section} style={{ background: 'var(--surface)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: 0 }}>{product.id ? `Edit: ${product.title}` : 'New eBook Draft'}</h2>
              <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '13px' }}>Modify metadata, publish directly, or delete without friction.</p>
            </div>
            {product.id && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <a
                  href={`/api/ebooks/admin/download?id=${product.id}`}
                  className={s.secondary}
                  download={`${product.slug}.pdf`}
                  title="Direct Download as Admin"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  📥 Download PDF
                </a>
                {product.status === 'PUBLISHED' ? (
                  <button
                    type="button"
                    className={s.secondary}
                    disabled={busy}
                    onClick={async () => {
                      if (await action({ action: 'unpublish', id: product.id })) {
                        setProduct(null);
                      }
                    }}
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    type="button"
                    className={s.button}
                    disabled={busy}
                    onClick={async () => {
                      if (await action({ action: 'publish', id: product.id })) {
                        setProduct(null);
                      }
                    }}
                  >
                    🚀 Publish Now
                  </button>
                )}
                <button
                  type="button"
                  className={s.secondary}
                  style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                  disabled={busy}
                  onClick={async () => {
                    if (confirm(`Delete "${product.title}"? This cannot be undone.`)) {
                      if (await action({ action: 'delete', id: product.id })) {
                        setProduct(null);
                      }
                    }
                  }}
                >
                  Delete eBook
                </button>
              </div>
            )}
          </div>

          <form
            onSubmit={async e => {
              e.preventDefault();
              if (product.status === 'PUBLISHED' && !publish) {
                setPublish(true);
              }
              const result = await action({
                action: 'save',
                id: product.id,
                product: {
                  ...product,
                  salesEnabled: product.status === 'PUBLISHED' ? true : product.salesEnabled,
                  deliveryReady: product.status === 'PUBLISHED' ? true : product.deliveryReady,
                },
                profile: {
                  ...profile,
                  approved: product.status === 'PUBLISHED' ? true : profile.approved,
                },
                categoryIds: categories,
              });
              if (result) {
                setProduct(null);
                setPublish(false);
              }
            }}
          >
            <div className={s.columns}>
              <div className={s.form}>
                {(['title', 'slug', 'excerpt', 'description', 'image', 'seoTitle', 'seoDescription'] as const).map(key => (
                  <label className={s.field} key={key}>
                    {key}
                    {key === 'description' ? (
                      <textarea
                        required
                        value={product[key] || ''}
                        onChange={e => setProduct({ ...product, [key]: e.target.value })}
                      />
                    ) : (
                      <input
                        required={['title', 'slug', 'excerpt'].includes(key)}
                        value={product[key] || ''}
                        onChange={e => setProduct({ ...product, [key]: e.target.value })}
                      />
                    )}
                  </label>
                ))}
                <p className={s.note}>
                  Cover image URL (e.g. <code>/images/ebooks/{product.slug}.png</code> or Vercel Blob URL).
                </p>

                <label className={s.field}>
                  Price in integer paise (₹99 = 9900)
                  <input
                    required
                    type="number"
                    min={1}
                    step={1}
                    value={product.priceMinor}
                    onChange={e => setProduct({ ...product, priceMinor: Number(e.target.value), currency: 'INR' })}
                  />
                </label>

                <label className={s.field}>
                  Status
                  <select
                    value={product.status}
                    onChange={e => {
                      const next = e.target.value;
                      setProduct({ ...product, status: next });
                      setPublish(next === 'PUBLISHED');
                    }}
                  >
                    {['DRAFT', 'UNDER_REVIEW', 'PUBLISHED', 'ARCHIVED'].map(v => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>

                <fieldset>
                  <legend>Categories (first selected is primary)</legend>
                  {data?.categories.filter(c => c.published).map(c => (
                    <label className={s.check} key={c.id}>
                      <input
                        type="checkbox"
                        checked={categories.includes(c.id)}
                        onChange={e => {
                          setCategories(e.target.checked ? [...categories, c.id] : categories.filter(id => id !== c.id));
                          if (e.target.checked && categories.length === 0) setProduct({ ...product, category: c.name });
                        }}
                      />
                      {c.name}
                    </label>
                  ))}
                </fieldset>

                {(['salesEnabled', 'deliveryReady'] as const).map(key => (
                  <label className={s.check} key={key}>
                    <input
                      type="checkbox"
                      checked={product[key]}
                      onChange={e => setProduct({ ...product, [key]: e.target.checked })}
                    />
                    {key}
                  </label>
                ))}
              </div>

              <div className={s.form}>
                {(['sku', 'author', 'edition', 'language', 'version', 'license', 'updatePolicy'] as const).map(key => (
                  <label key={key} className={s.field}>
                    {key}
                    <input
                      required
                      value={profile[key]}
                      onChange={e => setProfile({ ...profile, [key]: e.target.value })}
                    />
                  </label>
                ))}

                <label className={s.field}>
                  Page count
                  <input
                    type="number"
                    required
                    min={1}
                    value={profile.pageCount}
                    onChange={e => setProfile({ ...profile, pageCount: Number(e.target.value) })}
                  />
                </label>

                {(['contents', 'outcomes', 'audience', 'prerequisites', 'notIncluded'] as const).map(key => (
                  <label key={key} className={s.field}>
                    {key} (one per line)
                    <textarea
                      value={profile[key].join('\n')}
                      onChange={e => setProfile({ ...profile, [key]: e.target.value.split('\n') })}
                    />
                  </label>
                ))}

                <label className={s.field}>
                  Included files (one per line)
                  <textarea
                    value={product.includedResources.join('\n')}
                    onChange={e => setProduct({ ...product, includedResources: e.target.value.split('\n') })}
                  />
                </label>

                {(['featured', 'approved'] as const).map(key => (
                  <label key={key} className={s.check}>
                    <input
                      type="checkbox"
                      checked={profile[key]}
                      onChange={e => setProfile({ ...profile, [key]: e.target.checked })}
                    />
                    {key === 'approved' ? 'Approved & verified' : key}
                  </label>
                ))}
              </div>
            </div>

            {product.status === 'PUBLISHED' && (
              <label className={s.check} style={{ margin: '16px 0', padding: '10px', background: 'rgba(34, 197, 94, 0.08)', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <input
                  type="checkbox"
                  checked={publish}
                  onChange={e => setPublish(e.target.checked)}
                />
                Confirm publishing this edition to the active storefront
              </label>
            )}

            <div className={s.actions}>
              <button className={s.button} disabled={busy}>
                Save {product.status.toLowerCase()}
              </button>
              <button type="button" className={s.secondary} onClick={() => setProduct(null)}>
                Close Editor
              </button>
            </div>
          </form>

          {product.id && (
            <form
              className={s.form}
              style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}
              onSubmit={async e => {
                e.preventDefault();
                setBusy(true);
                try {
                  const form = new FormData(e.currentTarget);
                  form.set('productId', product.id!);
                  const r = await fetch('/api/ebooks/admin/upload', { method: 'POST', body: form });
                  const result = await r.json();
                  if (!r.ok) throw new Error(result.error);
                  setNotice(`Private PDF uploaded. SHA-256: ${result.sha256}.`);
                  setProduct(null);
                  await refresh();
                } catch (e) {
                  setError(e instanceof Error ? e.message : 'Upload failed.');
                } finally {
                  setBusy(false);
                }
              }}
            >
              <h3>Upload Replacement Private PDF</h3>
              <p className={s.note}>
                Optional: Upload a new PDF version to private cloud storage. Up to 4 MB.
              </p>
              <label className={s.field}>
                Final PDF
                <input type="file" name="file" accept="application/pdf,.pdf" required />
              </label>
              <button className={s.secondary} disabled={busy}>
                Upload to private storage
              </button>
              {data?.books
                .find(b => b.id === product.id)
                ?.resources.map(r => (
                  <p className={s.note} key={r.id}>
                    {r.title} · {r.active ? 'active' : 'previous'} · {r.asset?.version} · {r.asset?.byteSize} bytes
                    <br />
                    <code>{r.asset?.sha256}</code>
                  </p>
                ))}
            </form>
          )}
        </section>
      )}
    </div>
  );
}
