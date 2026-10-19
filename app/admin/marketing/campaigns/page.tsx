'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import {
  Megaphone,
  Mail,
  Send,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Users,
  Smartphone,
  Monitor,
  Sparkles,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Flame,
} from 'lucide-react';

interface BlogPostOption {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image?: string | null;
  readTime?: number | string;
  date?: string;
}

export default function MarketingCampaignsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Loading & stats states
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [totalRecipients, setTotalRecipients] = useState(77);
  const [posts, setPosts] = useState<BlogPostOption[]>([]);

  // Campaign Form State
  const [selectedSlug, setSelectedSlug] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Architecture & BI');
  const [readTime, setReadTime] = useState<number | string>(15);
  const [imageUrl, setImageUrl] = useState('');
  const [subject, setSubject] = useState('');
  const [shortStory, setShortStory] = useState('');
  const [takeaway1, setTakeaway1] = useState('');
  const [takeaway2, setTakeaway2] = useState('');
  const [takeaway3, setTakeaway3] = useState('');
  const [testEmail, setTestEmail] = useState('sabledattatray@gmail.com');

  // Preview & Action States
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Status & Notification feedback
  const [statusFeedback, setStatusFeedback] = useState<{
    type: 'success' | 'error' | 'warning' | null;
    title: string;
    message: string;
    authFailed?: boolean;
  }>({ type: null, title: '', message: '' });

  // 1. Fetch initial campaign data & available posts
  useEffect(() => {
    async function loadCampaignData() {
      try {
        setLoadingInitial(true);
        const res = await fetch('/api/admin/marketing/broadcast');
        if (!res.ok) throw new Error('Failed to load campaign data');
        const data = await res.json();

        if (data.totalRecipients !== undefined) {
          setTotalRecipients(data.totalRecipients);
        }
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }

        if (data.defaultCampaign) {
          const def = data.defaultCampaign;
          setSelectedSlug(def.slug);
          setTitle(def.title);
          setCategory(def.category || 'Architecture & BI');
          setReadTime(def.readTime || 15);
          setImageUrl(def.image || '');
          setSubject(def.subject || '');
          setShortStory(def.shortStory || '');
          if (def.takeaways && def.takeaways.length >= 3) {
            setTakeaway1(def.takeaways[0]);
            setTakeaway2(def.takeaways[1]);
            setTakeaway3(def.takeaways[2]);
          }
          if (def.testEmail) {
            setTestEmail(def.testEmail);
          }
        }
      } catch (err: any) {
        console.error('Error fetching campaign setup:', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadCampaignData();
  }, []);

  // 2. Fetch live HTML preview whenever form content updates or on demand
  const updateLivePreview = async () => {
    if (!title || !selectedSlug) return;
    try {
      setIsGeneratingPreview(true);
      const res = await fetch('/api/admin/marketing/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'preview',
          slug: selectedSlug,
          title,
          category,
          readTime,
          imageUrl,
          customSubject: subject,
          shortStory,
          takeaways: [takeaway1, takeaway2, takeaway3].filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.html) {
        setPreviewHtml(data.html);
      }
    } catch (err) {
      console.error('Error generating preview:', err);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  useEffect(() => {
    if (!loadingInitial && title) {
      const timer = setTimeout(() => {
        updateLivePreview();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedSlug, title, category, readTime, imageUrl, subject, shortStory, takeaway1, takeaway2, takeaway3, loadingInitial]);

  // Handle post selection change
  const handleSelectPost = (slug: string) => {
    const post = posts.find(p => p.slug === slug);
    if (!post) return;
    setSelectedSlug(post.slug);
    setTitle(post.title);
    setCategory(post.category);
    setReadTime(post.readTime || 15);
    setImageUrl(post.image || '');
    setSubject(`New Guide: ${post.title} 🚀`);

    if (post.slug === 'pl-300-vs-dp-600-vs-dp-700-microsoft-certification-guide-2026') {
      setShortStory(`Last week, a senior data analyst reached out to me with a burning dilemma:

"Datta, I cleared my PL-300 two years ago, but recruiters are passing me over for senior Microsoft Fabric roles. Should I spend the next month cramming for DP-600, or should I skip it and jump straight into the brand-new DP-700 Fabric Data Engineer exam?"

It's a dilemma hundreds of data professionals, BI developers, and cloud engineers are wrestling with right now as Microsoft rapidly reshapes enterprise analytics around Fabric, OneLake, and Direct Lake.

Studying for the wrong certification costs months of precious preparation and leaves massive gaps in your actual architectural chops. That's why I spent the past few weeks breaking down every syllabus overlap, Direct Lake trapdoor, real exam difficulty rating, and salary benchmark into this comprehensive guide.`);
      setTakeaway1("PL-300 vs DP-600 vs DP-700 side-by-side syllabus breakdown and exact overlap percentages.");
      setTakeaway2("The Direct Lake vs PySpark requirement matrix: which exam tests DAX optimizations vs Lakehouse engineering.");
      setTakeaway3("The 2026 Career Decision Tree & Salary Benchmarks to pick the highest ROI credential for your goals.");
    } else {
      setShortStory(post.excerpt || `In this technical publication, I break down crucial enterprise architecture patterns, production trade-offs, and practical lessons learned from enterprise deployments.`);
      setTakeaway1(`Architectural blueprints and best practices for modern cloud data platforms.`);
      setTakeaway2(`Avoid common performance bottlenecks and hidden licensing costs.`);
      setTakeaway3(`Actionable takeaways you can directly implement in your production environments.`);
    }
  };

  // 3. Send Test Email
  const handleSendTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      alert('Please enter a valid test email address.');
      return;
    }

    setIsSendingTest(true);
    setStatusFeedback({ type: null, title: '', message: '' });

    try {
      const res = await fetch('/api/admin/marketing/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          slug: selectedSlug,
          title,
          category,
          readTime,
          imageUrl,
          customSubject: subject,
          shortStory,
          takeaways: [takeaway1, takeaway2, takeaway3].filter(Boolean),
          testEmail: testEmail.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatusFeedback({
          type: 'success',
          title: 'Test Email Sent Successfully! 🚀',
          message: `The campaign preview was dispatched to ${testEmail}. Please check your inbox or spam folder.`,
        });
      } else {
        const errorMsg = data.errors?.[0] || data.message || data.error || 'Failed to dispatch test email.';
        const isAuthError = errorMsg.includes('535') || errorMsg.includes('authentication') || errorMsg.includes('Invalid login');
        setStatusFeedback({
          type: 'error',
          title: isAuthError ? 'Hostinger SMTP Authentication Alert' : 'Test Email Failed',
          message: errorMsg,
          authFailed: isAuthError,
        });
      }
    } catch (err: any) {
      setStatusFeedback({
        type: 'error',
        title: 'Network or Server Error',
        message: err.message || 'Could not communicate with the broadcast service.',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  // 4. Send Full Broadcast to All Users
  const handleBroadcastToAll = async () => {
    setShowConfirmModal(false);
    setIsBroadcasting(true);
    setStatusFeedback({ type: null, title: '', message: '' });

    try {
      const res = await fetch('/api/admin/marketing/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'broadcast',
          slug: selectedSlug,
          title,
          category,
          readTime,
          imageUrl,
          customSubject: subject,
          shortStory,
          takeaways: [takeaway1, takeaway2, takeaway3].filter(Boolean),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatusFeedback({
          type: 'success',
          title: 'Broadcast Dispatched to All Members! 🎉',
          message: data.message || `Successfully sent campaign to ${data.sentCount} out of ${data.totalRecipients} recipients.`,
        });
      } else {
        const errorMsg = data.errors?.[0] || data.message || data.error || 'Broadcast failed.';
        const isAuthError = errorMsg.includes('535') || errorMsg.includes('authentication') || errorMsg.includes('Invalid login');
        setStatusFeedback({
          type: 'error',
          title: isAuthError ? 'Hostinger SMTP Authentication Alert' : 'Broadcast Dispatch Failed',
          message: errorMsg,
          authFailed: isAuthError,
        });
      }
    } catch (err: any) {
      setStatusFeedback({
        type: 'error',
        title: 'Broadcast Error',
        message: err.message || 'Broadcast request failed.',
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  const copyHtmlCode = () => {
    if (!previewHtml) return;
    navigator.clipboard.writeText(previewHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDark ? 'bg-[#090b10] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Header & Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500 dark:text-[#c9f31d] mb-1">
              <Megaphone className="w-4 h-4" /> Email Marketing & Automation Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Blog Post Campaign Broadcast
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Write compelling short stories, test email templates, and broadcast updates to your entire member network.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121620] flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Total Audience</div>
                <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {totalRecipients} Users
                </div>
              </div>
            </div>

            <Link
              href="/admin/users"
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition"
            >
              View User List &rarr;
            </Link>
          </div>
        </div>

        {/* Status Feedback Toast/Banner */}
        {statusFeedback.type && (
          <div
            className={`mt-6 p-4 rounded-xl border flex items-start gap-3 transition ${
              statusFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {statusFeedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="text-sm flex-1">
              <div className="font-bold">{statusFeedback.title}</div>
              <div className="mt-0.5 text-xs opacity-90">{statusFeedback.message}</div>
              {statusFeedback.authFailed && (
                <div className="mt-2.5 p-3 rounded-lg bg-black/40 border border-red-500/20 text-xs text-slate-300">
                  <span className="font-semibold text-amber-300">💡 How to resolve Hostinger SMTP Authentication:</span>
                  <ol className="list-decimal list-inside mt-1 space-y-1 text-slate-300">
                    <li>Log in to your <strong>Hostinger hPanel &rarr; Emails &rarr; dattasable.com</strong></li>
                    <li>Verify the mailbox password for <code className="text-[#c9f31d]">hello@dattasable.com</code></li>
                    <li>Update <code className="text-[#c9f31d]">EMAIL_SERVER_PASSWORD</code> in your <code className="text-slate-200">.env.local</code> and restart the server</li>
                    <li>Meanwhile, use the <strong>Live Preview</strong> below to inspect and review the generated marketing template!</li>
                  </ol>
                </div>
              )}
            </div>
            <button
              onClick={() => setStatusFeedback({ type: null, title: '', message: '' })}
              className="text-xs opacity-60 hover:opacity-100 ml-2"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Left = Campaign Editor, Right = Live Preview */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Campaign Builder (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Choose Blog Post */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121620] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#c9f31d]" />
                Select Blog Post to Broadcast
              </label>
              <span className="text-xs text-slate-500 font-mono">
                {posts.length} articles available
              </span>
            </div>

            <select
              value={selectedSlug}
              onChange={(e) => handleSelectPost(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a202c] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9f31d]"
            >
              {posts.map((post) => (
                <option key={post.slug} value={post.slug}>
                  [{post.category || 'Blog'}] {post.title}
                </option>
              ))}
            </select>

            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Target URL: <code className="text-slate-700 dark:text-slate-300">/blog/{selectedSlug}</code></span>
              <a
                href={`/blog/${selectedSlug}`}
                target="_blank"
                rel="noreferrer"
                className="text-amber-500 dark:text-[#c9f31d] hover:underline"
              >
                Open live post &rarr;
              </a>
            </div>
          </div>

          {/* Section 2: Subject Line & Narrative Story */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121620] shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Email Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Which Fabric certification actually gets you hired in 2026? 🚀"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a202c] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#c9f31d]"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Tip: Asking a burning career question or teasing a dilemma results in 40%+ higher open rates.
              </p>
            </div>

            {/* Short Story Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c9f31d]" />
                  Short Story / Narrative Hook (The Core Marketing Element)
                </label>
                <span className="text-[11px] text-[#c9f31d] font-mono font-medium">
                  High Engagement Box
                </span>
              </div>
              <textarea
                rows={7}
                value={shortStory}
                onChange={(e) => setShortStory(e.target.value)}
                placeholder="Share the personal story, client dilemma, or production incident that inspired you to write this article..."
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a202c] text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#c9f31d]"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                This story will be formatted inside a premium highlighted callout card in the email, right before the article link.
              </p>
            </div>

            {/* Key Takeaways */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                3 Key Takeaways (Numbered Highlights)
              </label>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 text-xs font-mono font-bold text-[#c9f31d]">01.</span>
                  <input
                    type="text"
                    value={takeaway1}
                    onChange={(e) => setTakeaway1(e.target.value)}
                    placeholder="Key takeaway #1"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a202c] text-xs focus:ring-2 focus:ring-[#c9f31d]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-xs font-mono font-bold text-[#c9f31d]">02.</span>
                  <input
                    type="text"
                    value={takeaway2}
                    onChange={(e) => setTakeaway2(e.target.value)}
                    placeholder="Key takeaway #2"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a202c] text-xs focus:ring-2 focus:ring-[#c9f31d]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-xs font-mono font-bold text-[#c9f31d]">03.</span>
                  <input
                    type="text"
                    value={takeaway3}
                    onChange={(e) => setTakeaway3(e.target.value)}
                    placeholder="Key takeaway #3"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a202c] text-xs focus:ring-2 focus:ring-[#c9f31d]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Test Dispatch & Mass Broadcast Actions */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121620] shadow-sm space-y-6">
            
            {/* Step 1: Send Test Email */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  Step 1: Send a Test Email First
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                  Safe & Isolated
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Verify how the template renders directly in your inbox before broadcasting to all 77 registered users.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="sabledattatray@gmail.com"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a202c] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md shadow-emerald-600/20"
                >
                  {isSendingTest ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Test Email
                    </>
                  )}
                </button>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Step 2: Mass Broadcast */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Step 2: Broadcast to All {totalRecipients} Users
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono">
                  Production Blast
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                This will queue the email campaign with throttling (5 emails/sec) to every registered user and newsletter subscriber in the database.
              </p>

              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={isBroadcasting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 transition shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                {isBroadcasting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Broadcasting Campaign...
                  </>
                ) : (
                  <>
                    <Megaphone className="w-4 h-4" />
                    Broadcast to All ({totalRecipients} Recipients) Now
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Live Interactive Email Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121620] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Preview Mode:
              </span>
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
                  previewDevice === 'desktop'
                    ? 'bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Desktop view"
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
                  previewDevice === 'mobile'
                    ? 'bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Mobile view"
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={updateLivePreview}
                disabled={isGeneratingPreview}
                className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                title="Refresh preview"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingPreview ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={copyHtmlCode}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
                title="Copy Raw HTML"
              >
                {copiedHtml ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedHtml ? 'Copied' : 'HTML'}
              </button>
            </div>
          </div>

          {/* Device Frame */}
          <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-[#05070a] p-3 shadow-2xl flex justify-center overflow-hidden">
            <div
              style={{
                width: previewDevice === 'mobile' ? '375px' : '100%',
                maxWidth: '600px',
                transition: 'width 0.3s ease',
              }}
              className="rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-[#0b0f17]"
            >
              {previewHtml ? (
                <iframe
                  title="Email Live Preview"
                  srcDoc={previewHtml}
                  className="w-full h-[700px] border-0"
                  sandbox="allow-same-origin"
                />
              ) : (
                <div className="h-[600px] flex flex-col items-center justify-center text-slate-500 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin mb-2 text-[#c9f31d]" />
                  Generating high-fidelity email preview...
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#121620]/50 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% CAN-SPAM compliant with 1-click unsubscribe link.
            </span>
            <span className="font-mono text-[10px]">HTML 4.01 / MSO</span>
          </div>

        </div>

      </div>

      {/* Confirmation Modal for Mass Broadcast */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <Megaphone className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-bold">Confirm Broadcast to {totalRecipients} Users</h3>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              You are about to broadcast the email campaign for:
            </p>
            
            <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <div className="font-bold text-slate-900 dark:text-white line-clamp-2">{title}</div>
              <div className="mt-1 text-[11px] text-amber-500 dark:text-[#c9f31d] font-mono">
                Subject: {subject}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcastToAll}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs tracking-wider transition shadow-lg shadow-orange-500/20"
              >
                Yes, Send to All Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
