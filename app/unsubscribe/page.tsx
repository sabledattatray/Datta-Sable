'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Mail, ArrowLeft } from 'lucide-react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const isConfirmed = searchParams.get('confirmed') === 'true';

  const [email, setEmail] = useState(initialEmail);
  const [unsubscribed, setUnsubscribed] = useState(isConfirmed);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
    if (isConfirmed) {
      setUnsubscribed(true);
    }
  }, [initialEmail, isConfirmed]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      setLoading(true);
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setUnsubscribed(true);
        setMessage(data.message);
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (err: any) {
      setMessage(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#0f141f] border border-slate-800 shadow-2xl text-center">
        
        {unsubscribed ? (
          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">You Have Been Unsubscribed</h1>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {email ? (
                <span><code className="text-slate-200">{email}</code> has been removed from our dispatch list. You won't receive future blog dispatches.</span>
              ) : (
                <span>You have been successfully removed from future blog announcements.</span>
              )}
            </p>
            <div className="pt-4 border-t border-slate-800">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#c9f31d] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to dattasable.com Blog
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <Mail className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Unsubscribe from Dispatches</h1>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Enter your email address below to confirm unsubscription from future engineering articles and architecture updates.
            </p>

            <form onSubmit={handleUnsubscribe} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-[#161c2b] text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c9f31d]"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wider transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Unsubscribe'}
              </button>
            </form>

            {message && (
              <p className="mt-4 text-xs text-slate-400">{message}</p>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
              >
                Cancel and return home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090e]" />}>
      <UnsubscribeContent />
    </Suspense>
  );
}
