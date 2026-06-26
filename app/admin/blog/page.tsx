'use client';
import { useState, useEffect, useRef } from 'react';
import {
  FileText, Plus, Search, Trash2, Edit2,
  ChevronLeft, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Type, Highlighter, Save, Settings, Image as ImageIcon,
  Eye, EyeOff, Columns, Globe, Laptop, Smartphone, CheckCircle2, XCircle, AlertCircle, Sparkles
} from 'lucide-react';
import { posts as mainPosts } from '@/app/blog/data';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import FullEditor from '@/components/editor/FullEditor';

const initialPosts = mainPosts.map((p, idx) => ({
  id: idx + 1,
  title: p.title,
  slug: p.slug,
  category: p.category,
  status: 'Published',
  date: p.date,
  views: Math.floor(Math.random() * 2000).toString(),
  excerpt: p.excerpt,
  content: p.content,
  image: p.image,
}));

function calculateSeoScore(title: string, slug: string, content: string, excerpt: string, keyword: string, otherPosts: any[] = []) {
  if (!keyword) return {
    score: 0,
    categories: {
      basic: [],
      additional: [],
      title: [],
      content: []
    }
  };

  const basicChecks: any[] = [];
  const additionalChecks: any[] = [];
  const titleChecks: any[] = [];
  const contentChecks: any[] = [];
  
  let earnedPoints = 0;
  let maxPoints = 0;
  
  const kw = keyword.toLowerCase().trim();
  const cleanTitle = title.toLowerCase();
  const cleanSlug = slug.toLowerCase();
  
  // Extract plain text from TipTap HTML
  let textContent = '';
  if (typeof document !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    textContent = tempDiv.textContent || tempDiv.innerText || '';
  } else {
    textContent = content.replace(/<[^>]*>/g, '');
  }
  const cleanContent = textContent.toLowerCase();
  const cleanExcerpt = excerpt.toLowerCase();
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
  
  const addCheck = (category: 'basic' | 'additional' | 'title' | 'content', id: string, label: string, passed: boolean, pts: number) => {
    const checkItem = { id, label, passed, pts };
    if (category === 'basic') basicChecks.push(checkItem);
    else if (category === 'additional') additionalChecks.push(checkItem);
    else if (category === 'title') titleChecks.push(checkItem);
    else if (category === 'content') contentChecks.push(checkItem);
    
    maxPoints += pts;
    if (passed) earnedPoints += pts;
  };

  // 1. BASIC SEO CATEGORY (60 pts)
  // A. Focus Keyword in Title (15 pts)
  const kwInTitle = cleanTitle.includes(kw);
  addCheck('basic', 'title_kw', 'Focus keyword in SEO title', kwInTitle, 15);

  // B. Focus Keyword in URL Slug (10 pts)
  const formattedKwSlug = kw.replace(/\s+/g, '-');
  const kwInSlug = cleanSlug.includes(formattedKwSlug);
  addCheck('basic', 'slug_kw', 'Focus keyword in URL slug', kwInSlug, 10);

  // C. Focus Keyword in Excerpt / Meta Description (10 pts)
  const kwInExcerpt = cleanExcerpt.includes(kw);
  addCheck('basic', 'excerpt_kw', 'Focus keyword in meta description', kwInExcerpt, 10);

  // D. Focus Keyword in First 10% / Beginning of Content (15 pts)
  const cleanText = textContent.trim();
  const firstParagraph = cleanText.split('\n')[0] || '';
  const first300Chars = cleanText.slice(0, 300);
  const kwInBeginning = firstParagraph.toLowerCase().includes(kw) || first300Chars.toLowerCase().includes(kw);
  addCheck('basic', 'beginning_kw', 'Focus keyword at beginning of content', kwInBeginning, 15);

  // E. Content Length check (10 pts)
  const wordCountOk = wordCount >= 600;
  addCheck('basic', 'word_count', `Content length (${wordCount} words, ideal 600+)`, wordCountOk, 10);

  // 2. ADDITIONAL CATEGORY (35 pts)
  // A. Focus Keyword in H2/H3 subheadings (10 pts)
  const subheadingRegex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  let matches;
  let kwInSubheading = false;
  while ((matches = subheadingRegex.exec(content)) !== null) {
    const text = matches[1].replace(/<[^>]*>/g, '').toLowerCase();
    if (text.includes(kw)) {
      kwInSubheading = true;
      break;
    }
  }
  addCheck('additional', 'subheading_kw', 'Focus keyword in H2/H3 subheadings', kwInSubheading, 10);

  // B. Image Alt Text contains keyword (5 pts)
  const imgRegex = /<img([^>]+)>/gi;
  let imgMatch;
  let hasImages = false;
  let kwInAlt = false;
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    hasImages = true;
    const attributes = imgMatch[1];
    const altMatch = /alt=["']([^"']*)["']/i.exec(attributes);
    if (altMatch && altMatch[1].toLowerCase().includes(kw)) {
      kwInAlt = true;
    }
  }
  addCheck('additional', 'image_alt_kw', hasImages ? 'Focus keyword found in image ALT attributes' : 'Add images with focus keyword in ALT text', hasImages && kwInAlt, 5);

  // C. Keyword Density (5 pts)
  let densityOk = false;
  let densityMsg = 'Keyword density (ideal 0.5% - 2.5%)';
  if (wordCount > 0 && cleanContent.includes(kw)) {
    const matchesCount = cleanContent.split(kw).length - 1;
    const density = (matchesCount / wordCount) * 100;
    densityOk = density >= 0.5 && density <= 2.5;
    densityMsg = `Keyword density: ${density.toFixed(2)}% (ideal 0.5% - 2.5%)`;
  }
  addCheck('additional', 'density', densityMsg, densityOk, 5);

  // D. Internal Links (5 pts)
  // E. External Links (5 pts)
  const linkRegex = /href=["']([^"']*)["']/gi;
  let hasInternalLink = false;
  let hasExternalLink = false;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    const url = linkMatch[1];
    if (url.startsWith('/') || url.includes('dattasable.com') || url.startsWith('#')) {
      if (!url.startsWith('#')) {
        hasInternalLink = true;
      }
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      hasExternalLink = true;
    }
  }
  addCheck('additional', 'internal_link', 'Contains at least one internal link', hasInternalLink, 5);
  addCheck('additional', 'external_link', 'Contains at least one external outbound link', hasExternalLink, 5);

  // F. Unique Keyword Check (5 pts)
  const isUnique = !otherPosts.some(p => {
    let otherKwStr = '';
    if (p.blocks && typeof p.blocks === 'object') {
      otherKwStr = (p.blocks as any).focusedKeyword || '';
    } else if (typeof p.blocks === 'string') {
      try {
        const parsed = JSON.parse(p.blocks);
        otherKwStr = parsed.focusedKeyword || '';
      } catch (e) {}
    }
    return otherKwStr.toLowerCase().split(',').map((s: string) => s.trim()).includes(kw);
  });
  addCheck('additional', 'unique_kw', 'Keyword is unique (not used in other posts)', isUnique, 5);

  // 3. TITLE READABILITY CATEGORY (20 pts)
  // A. Focus Keyword at beginning of title (5 pts)
  const kwStartsTitle = cleanTitle.startsWith(kw) || cleanTitle.indexOf(kw) < 15;
  addCheck('title', 'title_start', 'Focus keyword at beginning of title', kwInTitle && kwStartsTitle, 5);

  // B. Sentiment checking (5 pts)
  const sentimentWords = [
    'best', 'great', 'easy', 'simple', 'ultimate', 'perfect', 'top', 'amazing', 'awesome', 'guide',
    'master', 'successful', 'build', 'high', 'performance', 'smart', 'clean', 'power', 'premium',
    'worst', 'bad', 'fix', 'avoid', 'mistake', 'error', 'warning', 'problem', 'fail', 'critical',
    'failure', 'issue', 'bottleneck', 'threat', 'risky', 'hard', 'difficult', 'troubleshooting',
    'tuning'
  ];
  const hasSentiment = sentimentWords.some(word => cleanTitle.includes(word));
  addCheck('title', 'title_sentiment', 'Title has positive or negative sentiment', hasSentiment, 5);

  // C. Power words presence (5 pts)
  const powerWords = [
    'proven', 'guaranteed', 'powerful', 'secret', 'hack', 'ultimate', 'expert', 'advanced',
    'breakthrough', 'shocking', 'magic', 'instant', 'free', 'today', 'now', 'masterclass',
    'professional', 'enterprise', 'production-grade', 'architecting', 'reliability', 'troubleshooting',
    'tuning'
  ];
  const hasPowerWord = powerWords.some(word => cleanTitle.includes(word));
  addCheck('title', 'title_power_word', 'Title contains at least one power word', hasPowerWord, 5);

  // D. Number in the title (5 pts)
  const hasNumber = /\d+/.test(title);
  addCheck('title', 'title_number', 'Title contains a number', hasNumber, 5);

  // 4. CONTENT READABILITY CATEGORY (15 pts)
  // A. Table of Contents (TOC) presence (5 pts)
  const hasTocLabel = cleanContent.includes('table of contents') || cleanContent.includes('toc') || cleanContent.includes('what we will cover');
  const hasAnchorLinks = /href=["']#[a-z0-9-_]+["']/i.test(content);
  const hasToc = hasTocLabel || (hasAnchorLinks && (content.includes('<ul>') || content.includes('<ol>')));
  addCheck('content', 'content_toc', 'Content includes a Table of Contents', hasToc, 5);

  // B. Short paragraphs check (5 pts)
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  let paragraphCount = 0;
  let longParagraphCount = 0;
  while ((pMatch = pRegex.exec(content)) !== null) {
    paragraphCount++;
    const text = pMatch[1].replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words > 120) {
      longParagraphCount++;
    }
  }
  const shortParagraphsOk = paragraphCount === 0 || (longParagraphCount / paragraphCount) <= 0.2;
  addCheck('content', 'content_short_paragraphs', 'Content uses short paragraphs (< 120 words)', shortParagraphsOk, 5);

  // C. Presence of images/videos (5 pts)
  const hasMedia = content.includes('<img') || content.includes('<video') || content.includes('<iframe');
  addCheck('content', 'content_media', 'Content contains images, videos or interactive frames', hasMedia, 5);

  const score = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;

  return {
    score,
    categories: {
      basic: basicChecks,
      additional: additionalChecks,
      title: titleChecks,
      content: contentChecks
    }
  };
}

function calculateReadTime(content: string): number {
  let textContent = '';
  if (typeof document !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    textContent = tempDiv.textContent || tempDiv.innerText || '';
  } else {
    textContent = content.replace(/<[^>]*>/g, '');
  }
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export default function AdminBlog() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState(['Tech Trends', 'Tutorials', 'Technical', 'BI Tools', 'SQL']);
  const [newCat, setNewCat] = useState('');
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editorMode, setEditorMode] = useState<'edit' | 'split' | 'preview'>('edit');
  const [editingPost, setEditingPost] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty' | ''>('saved');
  const [originalData, setOriginalData] = useState<any>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [hasAutosaveToRestore, setHasAutosaveToRestore] = useState<any>(null);
  const [sidebarTab, setSidebarTab] = useState<'settings' | 'seo'>('settings');
  const [formData, setFormData] = useState({
    title: '', slug: '', category: 'Tech Trends', status: 'Draft',
    excerpt: '', content: '', image: '', date: '',
    readTime: 5, focusedKeyword: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isReadTimeManual, setIsReadTimeManual] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Phase 1: Writer Experience Foundation States
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [imageTab, setImageTab] = useState<'upload' | 'url' | 'library'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [libraryImages, setLibraryImages] = useState<any[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const triggerAutosaveRef = useRef<(() => void) | null>(null);

  // Rank Math SEO states
  const [activeKeywordIndex, setActiveKeywordIndex] = useState(0);
  const [seoTab, setSeoTab] = useState<'basic' | 'additional' | 'title' | 'content'>('basic');
  const [snippetDevice, setSnippetDevice] = useState<'desktop' | 'mobile'>('desktop');


  // Theme-aware CSS variables
  const css = isDark
    ? {
        bg: '#000000',
        surface: '#000000',
        surface2: '#121212',
        border: '#1a1a1a',
        text: '#f1f5f9',
        muted: '#64748b',
        accent: '#6366f1',
        inputBg: '#1e293b',
        shadow: '0 4px 24px rgba(0,0,0,0.35)',
        hoverBg: 'rgba(255,255,255,0.03)',
      }
    : {
        bg: '#f0f4ff',
        surface: '#ffffff',
        surface2: '#f8faff',
        border: '#e2e8f0',
        text: '#0f172a',
        muted: '#64748b',
        accent: '#4f46e5',
        inputBg: '#f8faff',
        shadow: '0 4px 24px rgba(0,0,0,0.07)',
        hoverBg: 'rgba(0,0,0,0.02)',
      };

  // Renders the clean live preview markup (used in Split & Preview modes)
  const renderPreviewContent = () => {
    return (
      <div style={{ width: '100%', maxWidth: 760, paddingBottom: 80 }}>
        {/* Nav / Category Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: css.accent,
              borderColor: `${css.accent}44`,
              borderWidth: 1,
              borderStyle: 'solid',
              padding: '3px 10px',
              borderRadius: 999,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            {formData.category}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: css.muted, fontSize: '0.8rem' }}>
            ⏱️ {formData.readTime || '5'} min read
          </span>
          <span style={{ color: css.muted, fontSize: '0.8rem' }}>
            {formData.date}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            lineHeight: 1.2,
            fontWeight: 900,
            color: css.text,
            marginBottom: '2rem',
          }}
        >
          {formData.title || 'Untitled Story'}
        </h1>

        {/* Featured Image */}
        {formData.image && (
          <div
            style={{
              width: '100%',
              marginBottom: '2.5rem',
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${css.border}`,
              borderRadius: '12px',
              background: css.surface2,
              aspectRatio: '16/9',
            }}
          >
            <Image
              src={formData.image}
              alt={formData.title}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Author Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: `1px solid ${css.border}`,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `2px solid ${css.accent}`,
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <Image
              src="/images/datta.webp"
              alt="Datta Sable"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 5%' }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: css.text }}>
              Datta Sable
            </div>
            <div style={{ color: css.muted, fontSize: '0.8rem' }}>
              BI & Analytics Expert
            </div>
          </div>
        </div>

        {/* Content Renderer */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{
            __html: formData.content || '<p style="color:var(--muted)">Write some content to preview it.</p>'
          }}
        />

        {/* Author Bio Box */}
        <div
          style={{
            marginTop: '5rem',
            padding: '2.5rem',
            background: css.surface2,
            border: `1px solid ${css.border}`,
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: css.accent,
            }}
          />
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid ${css.accent}`,
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <Image
                src="/images/datta.webp"
                alt="Datta Sable"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center 5%' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: css.accent,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Verified Author
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: css.text, margin: '0 0 10px' }}>
                Datta Sable
              </h3>
              <p style={{ color: css.muted, fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                Senior BI Developer & Data Architect with over 10 years of experience in engineering high-fidelity analytics systems. Specialized in Tableau, Power BI, SQL, and Python-driven automation for enterprise-grade decision clarity.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/blog');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      const mapped = data.map((p: any) => ({
        ...p,
        status: p.published ? 'Published' : 'Draft',
        views: p.views || '0',
      }));
      setPosts(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while loading posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const uniqueCats = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));
      const merged = Array.from(new Set([...['Tech Trends', 'Tutorials', 'Technical', 'BI Tools', 'SQL'], ...uniqueCats]));
      setCategories(merged as string[]);
    }
  }, [posts]);

  useEffect(() => {
    if (isEditing && editorRef.current && editorRef.current.innerHTML !== formData.content) {
      editorRef.current.innerHTML = formData.content;
    }
  }, [isEditing]);

  useEffect(() => {
    if (editorMode === 'edit') return;

    const renderMermaidDiagrams = async () => {
      const mermaidElements = document.querySelectorAll('.blog-editor-preview-area .mermaid, .blog-editor-preview-area .language-mermaid');
      if (mermaidElements.length === 0) return;

      try {
        const mermaid = (await import('mermaid')).default;
        
        const isLightTheme = theme === 'light';
        
        mermaid.initialize({
          startOnLoad: false,
          theme: isLightTheme ? 'default' : 'dark',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: false
          },
          themeVariables: isLightTheme ? {
            background: 'transparent',
            primaryColor: '#e0f2fe',
            primaryTextColor: '#000000',
            lineColor: '#cbd5e1',
            primaryBorderColor: '#cbd5e1',
            nodeBorder: '#cbd5e1',
            mainBkg: '#ffffff',
            textColor: '#000000',
            actorTextColor: '#000000',
            actorBkg: '#ffffff',
            signalColor: '#0059B3',
            signalLineColor: '#cbd5e1',
          } : {
            background: '#0d1117',
            primaryColor: '#00e5ff',
            primaryTextColor: '#fff',
            lineColor: '#2f363d'
          }
        });

        for (let i = 0; i < mermaidElements.length; i++) {
          const element = mermaidElements[i] as HTMLElement;
          
          let text = element.getAttribute('data-original-code');
          if (!text) {
            text = element.innerText || element.textContent || '';
            if (!text.trim()) continue;
            element.setAttribute('data-original-code', text);
          }

          const id = `mermaid-svg-preview-${i}-${theme}`;
          try {
            const { svg } = await mermaid.render(id, text);
            element.innerHTML = svg;
            element.style.background = 'transparent';
            
            // If it is a <code> tag inside a <pre> block, style the parent <pre> block
            if (element.tagName.toLowerCase() === 'code' && element.parentElement?.tagName.toLowerCase() === 'pre') {
              const pre = element.parentElement;
              pre.style.background = 'transparent';
              pre.style.border = 'none';
              pre.style.padding = '0';
            }
          } catch (renderError) {
            console.error('Error rendering diagram in preview:', renderError);
          }
        }
      } catch (err) {
        console.error('Mermaid init failed inside blog preview:', err);
      }
    };

    const timer = setTimeout(() => {
      renderMermaidDiagrams();
    }, 150);

    return () => clearTimeout(timer);
  }, [editorMode, formData.content, theme]);

  // Window resize listener to automatically exit Split View on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900 && editorMode === 'split') {
        setEditorMode('edit');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [editorMode]);

  // 1. Browser reload/external exit warning (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isEditing || !originalData) return;
      const dirty = JSON.stringify(formData) !== JSON.stringify(originalData);
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isEditing, formData, originalData]);

  // Slug formatting helper
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-')         // replace spaces with -
      .replace(/-+/g, '-');         // remove multiple consecutive -
  };

  // Debounced Slug uniqueness check
  useEffect(() => {
    if (!isEditing || !formData.slug) {
      setSlugError('');
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const excludeParam = editingPost ? `&excludeId=${editingPost.id}` : '';
        const res = await fetch(`/api/admin/blog/validate-slug?slug=${formData.slug}${excludeParam}`);
        if (res.ok) {
          const data = await res.json();
          if (data.exists) {
            setSlugError('This URL slug is already in use by another article.');
          } else {
            setSlugError('');
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.slug, isEditing, editingPost]);

  // Primary Autosave function to PostgreSQL
  const triggerAutosave = async () => {
    if (!isEditing || !originalData) return;
    const isDirty = JSON.stringify(formData) !== JSON.stringify(originalData);
    if (!isDirty || saveStatus === 'saving') return;

    if (!formData.title.trim() || !formData.content.trim()) {
      return; // Skip if title or content is empty (API requires both)
    }

    setSaveStatus('saving');
    try {
      const url = editingPost ? `/api/admin/blog/${editingPost.id}` : '/api/admin/blog';
      const method = editingPost ? 'PUT' : 'POST';
      
      const payload = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image || null,
        date: formData.date,
        published: editingPost ? editingPost.published : false, // defaults to draft
        readTime: Number(formData.readTime) || 1,
        blocks: {
          focusedKeyword: formData.focusedKeyword || '',
        },
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error || 'Database autosave failed');
      }

      const data = await res.json();
      const mappedPost = {
        ...data,
        status: data.published ? 'Published' : 'Draft',
        views: data.views || '0',
      };

      // Update local storage backup to be in sync with DB
      try {
        localStorage.setItem(
          'admin_blog_autosave',
          JSON.stringify({
            editingId: mappedPost.id,
            formData,
            timestamp: Date.now()
          })
        );
      } catch (e) {}

      if (!editingPost) {
        setEditingPost(mappedPost);
      }
      
      setOriginalData(formData);
      setSaveStatus('saved');
      fetchPosts(); // refresh list in background
    } catch (err) {
      console.error('Autosave error:', err);
      setSaveStatus('dirty');
    }
  };

  // Keep triggerAutosaveRef updated
  useEffect(() => {
    triggerAutosaveRef.current = triggerAutosave;
  }, [formData, isEditing, originalData, editingPost, saveStatus]);

  // Debounced trigger for typing autosave (keeps UI responsive)
  useEffect(() => {
    if (!isEditing || !originalData) return;
    
    const isDirty = JSON.stringify(formData) !== JSON.stringify(originalData);
    if (isDirty) {
      setSaveStatus('dirty');
      
      // Save local backup immediately to avoid crash loss
      try {
        localStorage.setItem(
          'admin_blog_autosave',
          JSON.stringify({
            editingId: editingPost ? editingPost.id : 'new',
            formData,
            timestamp: Date.now()
          })
        );
      } catch (e) {}

      const timer = setTimeout(() => {
        if (triggerAutosaveRef.current) triggerAutosaveRef.current();
      }, 2000); // 2 seconds after user stops typing
      
      return () => clearTimeout(timer);
    } else {
      setSaveStatus('saved');
    }
  }, [formData, isEditing, originalData]);

  // Interval trigger for autosave (every 20 seconds)
  useEffect(() => {
    if (!isEditing) return;
    const interval = setInterval(() => {
      if (triggerAutosaveRef.current) triggerAutosaveRef.current();
    }, 20000);
    return () => clearInterval(interval);
  }, [isEditing]);

  // Auto-recovery check when entering editing mode
  useEffect(() => {
    if (!isEditing) {
      setHasAutosaveToRestore(null);
      setShowRecoveryModal(false);
      return;
    }
    
    try {
      const saved = localStorage.getItem('admin_blog_autosave');
      if (saved) {
        const parsed = JSON.parse(saved);
        const currentId = editingPost ? editingPost.id : 'new';
        
        if (parsed.editingId === currentId) {
          const isDifferent = parsed.formData.title !== formData.title || 
                              parsed.formData.content !== formData.content ||
                              parsed.formData.excerpt !== formData.excerpt;
          
          if (isDifferent) {
            setHasAutosaveToRestore(parsed);
            setShowRecoveryModal(true);
          }
        }
      }
    } catch (e) {
      console.error('Failed to retrieve autosave', e);
    }
  }, [isEditing]);

  const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const handleAddCategory = () => {
    if (newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
      setNewCat('');
    }
  };

  const handleRenameCategory = async (oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) {
      setEditingCategory(null);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/admin/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rename', oldName, newName }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to rename category');
      }
      setCategories(prev => prev.map(cat => cat === oldName ? newName : cat));
      if (formData.category === oldName) {
        setFormData(f => ({ ...f, category: newName }));
      }
      setEditingCategory(null);
      await fetchPosts();
    } catch (err: any) {
      alert(err.message || 'Error renaming category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"? Existing posts using this category will be reassigned to "Tech Trends".`)) {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', name }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to delete category');
        }
        setCategories(prev => prev.filter(cat => cat !== name));
        if (formData.category === name) {
          setFormData(f => ({ ...f, category: 'Tech Trends' }));
        }
        await fetchPosts();
      } catch (err: any) {
        alert(err.message || 'Error deleting category');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddNewCategory = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setFormData(f => ({ ...f, category: trimmed }));
      setNewCat('');
    }
  };

  const handleOpenEditor = (post: any = null) => {
    setEditorMode('edit');
    setSidebarTab('settings');
    setSaveStatus('saved');
    setSlugError('');
    if (post) {
      setIsSlugManual(true);
      let keyword = '';
      if (post.blocks && typeof post.blocks === 'object') {
        keyword = (post.blocks as any).focusedKeyword || '';
      }
      const calculated = calculateReadTime(post.content || '');
      const isManual = post.readTime && post.readTime !== calculated;
      setIsReadTimeManual(!!isManual);
      setEditingPost(post);
      const initEdit = {
        title: post.title,
        slug: post.slug || post.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        category: post.category,
        status: post.status,
        excerpt: post.excerpt || '',
        content: post.content || '',
        image: post.image || '',
        date: post.date,
        readTime: post.readTime || 5,
        focusedKeyword: keyword,
      };
      setFormData(initEdit);
      setOriginalData(initEdit);
    } else {
      setIsSlugManual(false);
      setIsReadTimeManual(false);
      setEditingPost(null);
      const initNew = {
        title: '', slug: '', category: 'Tech Trends', status: 'Draft',
        excerpt: '', content: '', image: '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: 1,
        focusedKeyword: '',
      };
      setFormData(initNew);
      setOriginalData(initNew);
    }
    setIsEditing(true);
  };

  const handleSave = async (overrideStatus?: 'Draft' | 'Published') => {
    try {
      setLoading(true);
      const url = editingPost ? `/api/admin/blog/${editingPost.id}` : '/api/admin/blog';
      const method = editingPost ? 'PUT' : 'POST';
      
      const statusToSave = overrideStatus ?? 'Published';
      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image || null,
        date: formData.date,
        published: statusToSave === 'Published',
        readTime: Number(formData.readTime) || 5,
        blocks: {
          focusedKeyword: formData.focusedKeyword || '',
        },
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save post');
      }

      try {
        localStorage.removeItem('admin_blog_autosave');
      } catch (e) {}
      
      setOriginalData(null);
      setIsEditing(false);
      await fetchPosts();
    } catch (err: any) {
      alert(err.message || 'Error saving post');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/blog/${deleteId}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to delete post');
        }
        setShowDeleteModal(false);
        setDeleteId(null);
        await fetchPosts();
      } catch (err: any) {
        alert(err.message || 'Error deleting post');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditorChange = (html?: string) => {
    const newContent = typeof html === 'string'
      ? html
      : (editorRef.current ? editorRef.current.innerHTML : '');

    setFormData(f => {
      let updatedReadTime = f.readTime;
      if (!isReadTimeManual) {
        updatedReadTime = calculateReadTime(newContent);
      }
      return { ...f, content: newContent, readTime: updatedReadTime };
    });
  };

  const execCommand = (cmd: string, val = '') => {
    document.execCommand(cmd, false, val);
    handleEditorChange();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const form = new FormData();
        form.append('file', file);
        
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: form,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Upload failed');
        }

        const data = await res.json();
        setFormData(f => ({ ...f, image: data.url }));
      } catch (err: any) {
        alert('Image upload failed: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // ═══════════════════════════════════════════════════════
  //  BLOG LIST VIEW
  // ═══════════════════════════════════════════════════════
  if (!isEditing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '4px 0' }}>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            style={{
              position: 'fixed', inset: 0,
              background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(15,23,42,0.3)',
              backdropFilter: 'blur(8px)',
              zIndex: 2000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}
          >
            <div
              style={{
                background: css.surface,
                border: `1px solid ${css.border}`,
                borderRadius: 24,
                padding: '2.5rem',
                maxWidth: 400,
                width: '100%',
                textAlign: 'center',
                boxShadow: css.shadow,
              }}
            >
              <div
                style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(239,68,68,0.1)',
                  color: '#ef4444',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: 28,
                }}
              >
                🗑️
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: css.text, margin: '0 0 10px' }}>
                Delete this article?
              </h3>
              <p style={{ color: css.muted, fontSize: 14, lineHeight: 1.6, margin: '0 0 28px' }}>
                This action is permanent and cannot be undone. The story will be removed from your public blog.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 12,
                    background: css.surface2, border: `1px solid ${css.border}`,
                    color: css.text, fontWeight: 600, cursor: 'pointer', fontSize: 14,
                    transition: 'opacity 0.15s',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 12,
                    background: '#ef4444', border: 'none',
                    color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
              Content
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: css.text, margin: 0, letterSpacing: '-0.02em' }}>
              Blog Articles
            </h1>
            <p style={{ fontSize: 13, color: css.muted, margin: '4px 0 0', fontWeight: 500 }}>
              {filtered.length} article{filtered.length !== 1 ? 's' : ''} {search ? 'found' : 'published'}
            </p>
          </div>
          <button
            onClick={() => handleOpenEditor()}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`,
              border: 'none', color: '#fff',
              fontWeight: 700, fontSize: 14,
              padding: '11px 20px', borderRadius: 12,
              cursor: 'pointer',
              boxShadow: `0 4px 14px ${css.accent}40`,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            <Plus size={17} /> Write New Story
          </button>
        </div>

        {/* Search Bar */}
        <div
          style={{
            background: css.surface, border: `1px solid ${css.border}`,
            borderRadius: 16, padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: css.shadow,
          }}
        >
          <Search size={16} color={css.muted} style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search articles by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 14, color: css.text, fontWeight: 500,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: css.muted, fontSize: 13, fontWeight: 600,
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Articles Table */}
        <div
          className="desktop-only"
          style={{
            background: css.surface, border: `1px solid ${css.border}`,
            borderRadius: 20, overflow: 'hidden', boxShadow: css.shadow,
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 860, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    background: css.surface2,
                    borderBottom: `1px solid ${css.border}`,
                  }}
                >
                  {['STORY', 'CATEGORY', 'VISIBILITY', 'REACH', 'ACTIONS'].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: '14px 20px',
                        fontSize: 10, fontWeight: 800,
                        color: css.muted, letterSpacing: '0.1em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: css.muted, fontSize: 14 }}>
                      No articles found.
                    </td>
                  </tr>
                )}
                {filtered.map((post, i) => (
                  <tr
                    key={post.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? `1px solid ${css.border}` : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = css.hoverBg}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    {/* Title */}
                    <td style={{ padding: '16px 20px', maxWidth: 420 }}>
                      <div
                        style={{
                          fontSize: 13.5, fontWeight: 700, color: css.text,
                          lineHeight: 1.45,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        } as any}
                        title={post.title}
                      >
                        {post.title}
                      </div>
                      <div style={{ fontSize: 11, color: css.muted, marginTop: 4, fontWeight: 500 }}>
                        {post.date} &bull; /blog/{post.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: 10, fontWeight: 700,
                          background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.07)',
                          color: css.accent,
                          border: `1px solid ${css.accent}30`,
                          padding: '3px 10px', borderRadius: 999,
                          textTransform: 'uppercase', letterSpacing: '0.07em',
                        }}
                      >
                        {post.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          fontSize: 10, fontWeight: 700,
                          background: post.status === 'Published'
                            ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                          color: post.status === 'Published' ? '#10b981' : '#3b82f6',
                          border: `1px solid ${post.status === 'Published' ? '#10b98130' : '#3b82f630'}`,
                          padding: '3px 10px', borderRadius: 999,
                          textTransform: 'uppercase', letterSpacing: '0.07em',
                        }}
                      >
                        <span
                          style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: post.status === 'Published' ? '#10b981' : '#3b82f6',
                          }}
                        />
                        {post.status}
                      </span>
                    </td>

                    {/* Views */}
                    <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 700, color: css.text, whiteSpace: 'nowrap' }}>
                      {parseInt(post.views || '0').toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => handleOpenEditor(post)}
                          title="Edit"
                          style={{
                            background: 'none', border: `1px solid ${css.border}`,
                            borderRadius: 9, padding: '7px', cursor: 'pointer',
                            color: css.muted, display: 'flex', alignItems: 'center',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.color = css.accent;
                            (e.currentTarget as HTMLElement).style.borderColor = css.accent;
                            (e.currentTarget as HTMLElement).style.background = `${css.accent}10`;
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.color = css.muted;
                            (e.currentTarget as HTMLElement).style.borderColor = css.border;
                            (e.currentTarget as HTMLElement).style.background = 'none';
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => { setDeleteId(post.id); setShowDeleteModal(true); }}
                          title="Delete"
                          style={{
                            background: 'none', border: `1px solid ${css.border}`,
                            borderRadius: 9, padding: '7px', cursor: 'pointer',
                            color: css.muted, display: 'flex', alignItems: 'center',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.color = '#ef4444';
                            (e.currentTarget as HTMLElement).style.borderColor = '#ef444440';
                            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.color = css.muted;
                            (e.currentTarget as HTMLElement).style.borderColor = css.border;
                            (e.currentTarget as HTMLElement).style.background = 'none';
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Articles Mobile Cards */}
        <div className="mobile-only" style={{ flexDirection: 'column', gap: 14 }}>
          {filtered.length === 0 ? (
            <div style={{ background: css.surface, border: `1px solid ${css.border}`, borderRadius: 20, padding: '32px 16px', textAlign: 'center', color: css.muted, fontSize: 14 }}>
              No articles found.
            </div>
          ) : (
            filtered.map((post) => (
              <div
                key={post.id}
                style={{
                  background: css.surface,
                  border: `1px solid ${css.border}`,
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: css.shadow,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: css.text, lineHeight: 1.45 }}>
                    {post.title}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => handleOpenEditor(post)}
                      title="Edit"
                      style={{
                        background: 'none', border: `1px solid ${css.border}`,
                        borderRadius: 8, padding: 6, cursor: 'pointer',
                        color: css.muted, display: 'flex', alignItems: 'center',
                      }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => { setDeleteId(post.id); setShowDeleteModal(true); }}
                      title="Delete"
                      style={{
                        background: 'none', border: `1px solid ${css.border}`,
                        borderRadius: 8, padding: 6, cursor: 'pointer',
                        color: css.muted, display: 'flex', alignItems: 'center',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: 9.5, fontWeight: 700,
                      background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.07)',
                      color: css.accent,
                      border: `1px solid ${css.accent}30`,
                      padding: '2px 8px', borderRadius: 999,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}
                  >
                    {post.category}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 9.5, fontWeight: 700,
                      background: post.status === 'Published'
                        ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                      color: post.status === 'Published' ? '#10b981' : '#3b82f6',
                      border: `1px solid ${post.status === 'Published' ? '#10b98130' : '#3b82f630'}`,
                      padding: '2px 8px', borderRadius: 999,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: post.status === 'Published' ? '#10b981' : '#3b82f6' }} />
                    {post.status}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${css.border}`, paddingTop: 10, fontSize: 11, color: css.muted }}>
                  <span>{post.date}</span>
                  <span style={{ fontWeight: 700, color: css.text }}>👁️ {parseInt(post.views || '0').toLocaleString()} views</span>
                </div>
              </div>
            ))
          )}
        </div>
        <style>{`
          .desktop-only {
            display: block !important;
          }
          .mobile-only {
            display: none !important;
          }
          @media (max-width: 768px) {
            .desktop-only {
              display: none !important;
            }
            .mobile-only {
              display: flex !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  //  EDITOR VIEW
  // ═══════════════════════════════════════════════════════
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: css.bg,
        display: 'flex', flexDirection: 'column',
        color: css.text, zIndex: 1000,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Unsaved Changes Confirmation Modal */}
      {showUnsavedModal && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(15,23,42,0.3)',
            backdropFilter: 'blur(8px)',
            zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
        >
          <div
            style={{
              background: css.surface,
              border: `1px solid ${css.border}`,
              borderRadius: 24,
              padding: '2.5rem',
              maxWidth: 440,
              width: '100%',
              boxShadow: css.shadow,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(245,158,11,0.1)',
                color: '#f59e0b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 28,
              }}
            >
              ⚠️
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: css.text, margin: '0 0 10px' }}>
              You have unsaved changes
            </h3>
            <p style={{ color: css.muted, fontSize: 13, lineHeight: 1.6, margin: '0 0 28px' }}>
              Would you like to save this article as a draft before leaving, or discard your modifications?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={async () => {
                  setShowUnsavedModal(false);
                  await handleSave('Draft');
                }}
                style={{
                  width: '100%', padding: '12px', borderRadius: 12,
                  background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`, border: 'none',
                  color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13,
                  boxShadow: `0 4px 12px ${css.accent}30`,
                }}
              >
                Save as Draft & Exit
              </button>
              <button
                onClick={() => {
                  setShowUnsavedModal(false);
                  try {
                    localStorage.removeItem('admin_blog_autosave');
                  } catch (e) {}
                  setOriginalData(null);
                  setIsEditing(false);
                }}
                style={{
                  width: '100%', padding: '12px', borderRadius: 12,
                  background: css.surface2, border: `1px solid ${css.border}`,
                  color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: 13,
                  transition: 'background 0.15s',
                }}
              >
                Discard Changes & Exit
              </button>
              <button
                onClick={() => setShowUnsavedModal(false)}
                style={{
                  width: '100%', padding: '12px', borderRadius: 12,
                  background: 'none', border: `1px solid ${css.border}`,
                  color: css.text, fontWeight: 600, cursor: 'pointer', fontSize: 13,
                }}
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(15,23,42,0.3)',
            backdropFilter: 'blur(8px)',
            zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
        >
          <div
            style={{
              background: css.surface,
              border: `1px solid ${css.border}`,
              borderRadius: 24,
              padding: '2.2rem',
              maxWidth: 480,
              width: '100%',
              boxShadow: css.shadow,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: css.text, margin: 0 }}>
                Manage Categories
              </h3>
              <button
                onClick={() => { setShowCategoryManager(false); setEditingCategory(null); }}
                style={{ background: 'none', border: 'none', color: css.muted, cursor: 'pointer', fontSize: 18, fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            {/* Add New Category */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="New category name..."
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                style={{
                  flex: 1, background: css.inputBg,
                  border: `1px solid ${css.border}`, color: css.text,
                  padding: '10px 12px', borderRadius: 10, outline: 'none', fontSize: 13,
                }}
                onKeyDown={e => { if (e.key === 'Enter') handleAddNewCategory(newCat); }}
              />
              <button
                onClick={() => handleAddNewCategory(newCat)}
                style={{
                  background: css.accent, border: 'none',
                  borderRadius: 10, padding: '10px 16px',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#fff',
                }}
              >
                Add
              </button>
            </div>

            {/* Categories List */}
            <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categories.map((cat) => (
                <div
                  key={cat}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', background: css.surface2, borderRadius: 12,
                    border: `1px solid ${css.border}`, gap: 10,
                  }}
                >
                  {editingCategory === cat ? (
                    <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                      <input
                        type="text"
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        style={{
                          flex: 1, background: css.inputBg,
                          border: `1px solid ${css.border}`, color: css.text,
                          padding: '6px 10px', borderRadius: 8, outline: 'none', fontSize: 12,
                        }}
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleRenameCategory(cat, renameValue);
                          if (e.key === 'Escape') setEditingCategory(null);
                        }}
                      />
                      <button
                        onClick={() => handleRenameCategory(cat, renameValue)}
                        style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        style={{ background: 'none', border: `1px solid ${css.border}`, color: css.text, borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontSize: 13, fontWeight: 600, color: css.text }}>{cat}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => { setEditingCategory(cat); setRenameValue(cat); }}
                          style={{
                            background: 'none', border: `1px solid ${css.border}`,
                            borderRadius: 8, padding: '5px 8px', fontSize: 11, fontWeight: 600,
                            color: css.muted, cursor: 'pointer', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = css.accent; (e.currentTarget as HTMLElement).style.borderColor = css.accent; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = css.muted; (e.currentTarget as HTMLElement).style.borderColor = css.border; }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          style={{
                            background: 'none', border: `1px solid ${css.border}`,
                            borderRadius: 8, padding: '5px 8px', fontSize: 11, fontWeight: 600,
                            color: '#ef4444', cursor: 'pointer', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Editor Top Bar */}
      <header
        style={{
          height: 56,
          background: css.surface,
          borderBottom: `1px solid ${css.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px',
          boxShadow: isDark ? '0 1px 0 rgba(255,255,255,0.03)' : '0 1px 0 rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => {
              const isDirty = originalData && JSON.stringify(formData) !== JSON.stringify(originalData);
              if (isDirty) {
                setShowUnsavedModal(true);
              } else {
                setIsEditing(false);
              }
            }}
            style={{
              background: 'none', border: `1px solid ${css.border}`,
              borderRadius: 9, padding: '7px 12px',
              cursor: 'pointer', color: css.muted,
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = css.text;
              (e.currentTarget as HTMLElement).style.background = css.surface2;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = css.muted;
              (e.currentTarget as HTMLElement).style.background = 'none';
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          <span
            style={{
              fontSize: 13, fontWeight: 700,
              color: css.muted, padding: '3px 10px',
              background: css.surface2, borderRadius: 8,
            }}
          >
            {editingPost ? 'Editing article' : 'New article'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {saveStatus && (
            <span
              className="editor-header-draft-label"
              style={{
                fontSize: 12,
                color: saveStatus === 'dirty' ? '#f59e0b' : saveStatus === 'saving' ? css.accent : '#10b981',
                fontWeight: 600,
                fontStyle: 'italic',
                marginRight: 6,
              }}
            >
              {saveStatus === 'dirty'
                ? 'Unsaved changes'
                : saveStatus === 'saving'
                ? 'Saving local backup...'
                : 'Draft saved locally'}
            </span>
          )}
          <div style={{
            display: 'flex',
            background: css.surface2,
            border: `1px solid ${css.border}`,
            borderRadius: 10,
            padding: 2,
            gap: 2,
          }}>
            {[
              { id: 'edit', label: 'Edit', icon: <FileText size={13} /> },
              { id: 'split', label: 'Split', icon: <Columns size={13} />, desktopOnly: true },
              { id: 'preview', label: 'Preview', icon: <Eye size={13} /> }
            ].map(tab => {
              const active = editorMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEditorMode(tab.id as any)}
                  className={tab.desktopOnly ? 'desktop-only-btn' : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    background: active ? css.surface : 'transparent',
                    border: 'none',
                    color: active ? css.accent : css.muted,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
          <ThemeToggle />
          <button
            onClick={() => handleSave('Published')}
            style={{
              background: `linear-gradient(135deg, ${css.accent}, #8b5cf6)`,
              border: 'none', color: '#fff',
              padding: '8px 20px', borderRadius: 10,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
              boxShadow: `0 4px 12px ${css.accent}40`,
            }}
          >
            <Save size={15} /> Publish
          </button>
        </div>
      </header>

      {/* Editor Main */}
      <div className="blog-editor-main" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {editorMode === 'preview' && (
          /* Live Preview Container */
          <div
            className="blog-editor-preview-area"
            style={{
              flex: 1,
              overflowY: 'auto',
              background: css.bg,
              display: 'flex',
              justifyContent: 'center',
              padding: '60px 20px',
            }}
          >
            {renderPreviewContent()}
          </div>
        )}

        {editorMode === 'edit' && (
          <>
            {/* Writing area */}
            <div
              className="blog-editor-writing-area"
              style={{
                flex: 1, overflowY: 'auto',
                background: css.bg,
                display: 'flex', justifyContent: 'center',
                padding: '60px 40px',
              }}
            >
              <div style={{ width: '100%', maxWidth: 1100 }}>
                {/* Recovery Banner */}
                {hasAutosaveToRestore && (
                  <div style={{
                    background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(79,70,229,0.05)',
                    border: `1px solid ${css.accent}44`,
                    borderRadius: 12,
                    padding: '12px 18px',
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: css.text }}>Unsaved local backup found</span>
                      <p style={{ fontSize: 11, color: css.muted, margin: '2px 0 0' }}>
                        An auto-saved draft from {new Date(hasAutosaveToRestore.timestamp).toLocaleString()} was found.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => {
                          setFormData(hasAutosaveToRestore.formData);
                          setOriginalData(hasAutosaveToRestore.formData);
                          setHasAutosaveToRestore(null);
                        }}
                        style={{
                          background: css.accent,
                          border: 'none',
                          color: '#fff',
                          padding: '6px 14px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Restore Draft
                      </button>
                      <button
                        onClick={() => {
                          try {
                            localStorage.removeItem('admin_blog_autosave');
                          } catch (e) {}
                          setHasAutosaveToRestore(null);
                        }}
                        style={{
                          background: 'none',
                          border: `1px solid ${css.border}`,
                          color: css.text,
                          padding: '6px 14px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                )}

                {/* Title */}
                <textarea
                  placeholder="Article title..."
                  value={formData.title}
                  onChange={e => {
                    const newTitle = e.target.value;
                    setFormData(f => {
                      const updated = { ...f, title: newTitle };
                      if (!isSlugManual) {
                        updated.slug = generateSlug(newTitle);
                      }
                      return updated;
                    });
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  ref={el => {
                    if (el) {
                      el.style.height = 'auto';
                      el.style.height = `${el.scrollHeight}px`;
                    }
                  }}
                  style={{
                    width: '100%', fontSize: '2.2rem', fontWeight: 800,
                    background: 'none', border: 'none',
                    color: css.text, outline: 'none', resize: 'none',
                    lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '1.5rem',
                    fontFamily: "'Inter', sans-serif",
                    height: 'auto',
                    minHeight: '2.8rem',
                    overflow: 'hidden',
                  }}
                />

                {/* TipTap Full Editor */}
                <FullEditor
                  content={formData.content}
                  onChange={(html: string) => handleEditorChange(html)}
                  isDark={isDark}
                />
              </div>
            </div>

        {/* Settings sidebar */}
        <aside
          className="blog-editor-sidebar"
          style={{
            width: 310, background: css.surface,
            borderLeft: `1px solid ${css.border}`,
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Tab Switcher */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${css.border}`, flexShrink: 0 }}>
            <button
              onClick={() => setSidebarTab('settings')}
              style={{
                flex: 1, padding: '14px 10px', fontSize: 11, fontWeight: 700,
                background: sidebarTab === 'settings' ? css.surface2 : 'transparent',
                color: sidebarTab === 'settings' ? css.accent : css.muted,
                border: 'none', borderBottom: sidebarTab === 'settings' ? `2px solid ${css.accent}` : 'none',
                cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
                transition: 'all 0.15s',
              }}
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => setSidebarTab('seo')}
              style={{
                flex: 1, padding: '14px 10px', fontSize: 11, fontWeight: 700,
                background: sidebarTab === 'seo' ? css.surface2 : 'transparent',
                color: sidebarTab === 'seo' ? css.accent : css.muted,
                border: 'none', borderBottom: sidebarTab === 'seo' ? `2px solid ${css.accent}` : 'none',
                cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
                transition: 'all 0.15s',
              }}
            >
              📈 SEO Score
            </button>
          </div>

          {sidebarTab === 'settings' ? (
            <div style={{ padding: '20px 20px' }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 18px' }}>
                Post Settings
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: css.muted, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Category
                  </label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select
                      value={formData.category}
                      onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
                      style={{
                        flex: 1, background: css.inputBg,
                        border: `1px solid ${css.border}`, color: css.text,
                        padding: '10px 12px', borderRadius: 10, outline: 'none',
                        cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      }}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowCategoryManager(true)}
                      style={{
                        background: css.surface2, border: `1px solid ${css.border}`,
                        borderRadius: 10, padding: '10px', cursor: 'pointer', color: css.text,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        height: 40, width: 40,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = css.hoverBg; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = css.surface2; }}
                      title="Manage Categories"
                    >
                      ⚙️
                    </button>
                  </div>
                </div>

                {/* Slug */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: css.muted, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    URL Slug
                  </label>
                  <input
                    type="text" value={formData.slug}
                    onChange={e => {
                      setIsSlugManual(true);
                      setFormData(f => ({ ...f, slug: e.target.value }));
                    }}
                    style={{
                      width: '100%', background: css.inputBg,
                      border: `1px solid ${slugError ? '#ef4444' : css.border}`, color: css.text,
                      padding: '10px 12px', borderRadius: 10, outline: 'none', fontSize: 12,
                    }}
                  />
                  {slugError && (
                    <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, margin: '6px 0 0' }}>
                      ⚠️ {slugError}
                    </p>
                  )}
                  {isSlugManual && (
                    <button
                      onClick={() => {
                        setIsSlugManual(false);
                        setFormData(f => ({ ...f, slug: generateSlug(f.title) }));
                      }}
                      style={{
                        background: 'none', border: 'none', color: css.accent, fontSize: 10, fontWeight: 700,
                        cursor: 'pointer', padding: 0, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}
                    >
                      Auto-generate from title 🔄
                    </button>
                  )}
                </div>

                {/* Read Time */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ display: 'block', fontSize: 11, color: css.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                      Read Time (minutes)
                    </label>
                    {isReadTimeManual && (
                      <button
                        onClick={() => {
                          setIsReadTimeManual(false);
                          setFormData(f => ({ ...f, readTime: calculateReadTime(f.content) }));
                        }}
                        style={{
                          background: 'none', border: 'none', color: css.accent, fontSize: 10, fontWeight: 700,
                          cursor: 'pointer', padding: 0, textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}
                      >
                        Auto-detect 🔄
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={formData.readTime}
                    onChange={e => {
                      setIsReadTimeManual(true);
                      setFormData(f => ({ ...f, readTime: parseInt(e.target.value) || 1 }));
                    }}
                    style={{
                      width: '100%', background: css.inputBg,
                      border: `1px solid ${css.border}`, color: css.text,
                      padding: '10px 12px', borderRadius: 10, outline: 'none', fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                </div>

                {/* Featured image */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: css.muted, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Featured Image
                  </label>
                  <div
                    onClick={() => document.getElementById('featured-image-input')?.click()}
                    style={{
                      width: '100%', height: 130,
                      background: css.inputBg,
                      border: `2px dashed ${css.border}`,
                      borderRadius: 12,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', overflow: 'hidden', position: 'relative',
                    }}
                  >
                    {formData.image ? (
                      <Image src={formData.image} fill style={{ objectFit: 'cover' }} alt="Featured" />
                    ) : (
                      <>
                        <ImageIcon size={22} color={css.muted} style={{ pointerEvents: 'none' }} />
                        <span style={{ fontSize: 12, color: css.muted, marginTop: 6, fontWeight: 500, pointerEvents: 'none' }}>
                          Set featured image
                        </span>
                      </>
                    )}
                  </div>
                  <input id="featured-image-input" type="file" hidden accept="image/*" onChange={handleImageUpload} />
                  {formData.image && (
                    <button
                      onClick={() => setFormData(f => ({ ...f, image: '' }))}
                      style={{ marginTop: 6, background: 'none', border: 'none', color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Remove image
                    </button>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: css.muted, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={e => setFormData(f => ({ ...f, excerpt: e.target.value }))}
                    rows={4}
                    style={{
                      width: '100%', background: css.inputBg,
                      border: `1px solid ${css.border}`, color: css.text,
                      padding: '10px 12px', borderRadius: 10, outline: 'none',
                      fontSize: 12, resize: 'none', lineHeight: 1.6,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                  SEO Analyzer
                </p>
                <span style={{ fontSize: 10, fontWeight: 700, color: css.accent, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Globe size={11} /> PRO Enabled
                </span>
              </div>

              {/* Focus Keyword Input */}
              <div>
                <label style={{ display: 'block', fontSize: 11, color: css.muted, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Focus Keyword(s)
                </label>
                <input
                  type="text"
                  placeholder="Enter keywords (comma separated)..."
                  value={formData.focusedKeyword}
                  onChange={e => setFormData(f => ({ ...f, focusedKeyword: e.target.value }))}
                  style={{
                    width: '100%', background: css.inputBg,
                    border: `1px solid ${css.border}`, color: css.text,
                    padding: '10px 12px', borderRadius: 10, outline: 'none', fontSize: 12,
                    fontWeight: 600,
                  }}
                />
                <span style={{ fontSize: 9.5, color: css.muted, marginTop: 4, display: 'block', fontWeight: 500 }}>
                  First keyword acts as the primary focus keyword.
                </span>
              </div>

              {(() => {
                const keywords = formData.focusedKeyword
                  ? formData.focusedKeyword.split(',').map((k: string) => k.trim()).filter(Boolean)
                  : [];

                if (keywords.length === 0) {
                  return (
                    <div style={{
                      padding: '30px 20px', textAlign: 'center', border: `1px dashed ${css.border}`,
                      borderRadius: 16, color: css.muted, fontSize: 12, lineHeight: 1.6
                    }}>
                      Enter a focus keyword to see your SEO score and analyze content in real-time.
                    </div>
                  );
                }

                const otherPosts = posts.filter((p: any) => p.id !== editingPost?.id);
                const keywordAnalyses = keywords.map((kw: string) => {
                  return {
                    keyword: kw,
                    analysis: calculateSeoScore(
                      formData.title,
                      formData.slug,
                      formData.content,
                      formData.excerpt,
                      kw,
                      otherPosts
                    )
                  };
                });

                const activeIdx = activeKeywordIndex >= keywords.length ? 0 : activeKeywordIndex;
                const activeAnalysis = keywordAnalyses[activeIdx];
                if (!activeAnalysis) return null;

                const radius = 26;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (activeAnalysis.analysis.score / 100) * circumference;
                const scoreColor = activeAnalysis.analysis.score >= 80 ? '#10b981' : activeAnalysis.analysis.score >= 50 ? '#f59e0b' : '#ef4444';

                const googleBg = isDark ? '#171717' : '#ffffff';
                const googleTitleColor = isDark ? '#8ab4f8' : '#1a0dab';
                const googleUrlColor = isDark ? '#bdc1c6' : '#202124';
                const googleSnippetColor = isDark ? '#bdc1c6' : '#4d5156';

                const getLengthColor = (len: number, min: number, max: number) => {
                  if (len >= min && len <= max) return '#10b981';
                  if (len > 0 && (len >= min - 10 && len <= max + 10)) return '#f59e0b';
                  return '#ef4444';
                };

                return (
                  <>
                    {/* Keyword Tags Switcher */}
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: css.muted, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        Selected Keywords & Scores
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {keywordAnalyses.map((item, idx) => {
                          const isActive = idx === activeIdx;
                          const score = item.analysis.score;
                          const tagScoreColor = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
                          const tagBg = isActive ? `${tagScoreColor}20` : css.surface2;
                          const tagBorder = `1px solid ${isActive ? tagScoreColor : css.border}`;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveKeywordIndex(idx)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '5px 10px',
                                borderRadius: 20,
                                background: tagBg,
                                border: tagBorder,
                                color: isActive ? css.text : css.muted,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                              }}
                            >
                              {idx === 0 && <Sparkles size={11} style={{ color: '#f59e0b' }} />}
                              <span>{item.keyword}</span>
                              <span style={{
                                background: tagScoreColor,
                                color: '#fff',
                                borderRadius: 99,
                                padding: '1px 5px',
                                fontSize: 9,
                                fontWeight: 800,
                              }}>{score}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Google Snippet Editor Accordion */}
                    <div style={{ borderTop: `1px solid ${css.border}`, paddingTop: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                          Google Snippet Preview
                        </span>
                        <div style={{ display: 'flex', background: css.surface2, border: `1px solid ${css.border}`, borderRadius: 8, padding: 2, gap: 2 }}>
                          <button
                            type="button"
                            onClick={() => setSnippetDevice('desktop')}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6,
                              fontSize: 10, fontWeight: 600, border: 'none', cursor: 'pointer',
                              background: snippetDevice === 'desktop' ? css.surface : 'transparent',
                              color: snippetDevice === 'desktop' ? css.accent : css.muted,
                            }}
                          >
                            <Laptop size={11} /> Desktop
                          </button>
                          <button
                            type="button"
                            onClick={() => setSnippetDevice('mobile')}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6,
                              fontSize: 10, fontWeight: 600, border: 'none', cursor: 'pointer',
                              background: snippetDevice === 'mobile' ? css.surface : 'transparent',
                              color: snippetDevice === 'mobile' ? css.accent : css.muted,
                            }}
                          >
                            <Smartphone size={11} /> Mobile
                          </button>
                        </div>
                      </div>

                      {/* Mock Card */}
                      {(() => {
                        const displayTitle = formData.title || 'Untitled Story';
                        const displaySlug = formData.slug || 'untitled-story';
                        const displayExcerpt = formData.excerpt || 'Please write a meta description (excerpt) for this article to display here in Google search results.';
                        const isMobile = snippetDevice === 'mobile';

                        return (
                          <div style={{
                            background: googleBg,
                            border: `1px solid ${css.border}`,
                            borderRadius: 12,
                            padding: 14,
                            boxShadow: css.shadow,
                            fontFamily: 'arial, sans-serif',
                            marginBottom: 16,
                            width: '100%',
                            boxSizing: 'border-box',
                            maxWidth: isMobile ? 280 : '100%',
                            margin: isMobile ? '0 auto 16px' : '0 0 16px',
                            textAlign: 'left',
                          }}>
                            {/* Favicon & Breadcrumb */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <div style={{
                                width: 14, height: 14, borderRadius: '50%', background: css.accent,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: 8, fontWeight: 800,
                              }}>
                                D
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <span style={{ fontSize: 11, color: isDark ? '#bdc1c6' : '#202124', fontWeight: 500, lineHeight: 1 }}>
                                  dattasable.com
                                </span>
                                <span style={{ fontSize: 9, color: isDark ? '#9aa0a6' : '#4d5156', lineHeight: 1 }}>
                                  blog › {displaySlug}
                                </span>
                              </div>
                            </div>

                            {/* Title */}
                            <h4 style={{
                              fontSize: isMobile ? 15 : 17,
                              fontWeight: 400,
                              color: googleTitleColor,
                              margin: '4px 0',
                              lineHeight: 1.3,
                              textDecoration: 'none',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                            >
                              {displayTitle}
                            </h4>

                            {/* Excerpt */}
                            <p style={{
                              fontSize: 12.5,
                              color: googleSnippetColor,
                              margin: '4px 0 0',
                              lineHeight: 1.4,
                              display: '-webkit-box',
                              WebkitLineClamp: isMobile ? 3 : 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}>
                              {displayExcerpt}
                            </p>
                          </div>
                        );
                      })()}

                      {/* Interactive Snippet Inputs */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: `1px dashed ${css.border}`, paddingTop: 14 }}>
                        {/* SEO Title Input */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <label style={{ fontSize: 10.5, color: css.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO Title</label>
                            <span style={{ fontSize: 10, fontWeight: 700, color: getLengthColor(formData.title.length, 40, 70) }}>
                              {formData.title.length} / 70
                            </span>
                          </div>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={e => {
                              const newTitle = e.target.value;
                              setFormData(f => {
                                const updated = { ...f, title: newTitle };
                                if (!isSlugManual) {
                                  updated.slug = generateSlug(newTitle);
                                }
                                return updated;
                              });
                            }}
                            style={{
                              width: '100%', background: css.inputBg, border: `1px solid ${css.border}`, color: css.text,
                              padding: '8px 10px', borderRadius: 8, outline: 'none', fontSize: 12, fontWeight: 600,
                            }}
                          />
                        </div>

                        {/* URL Slug Input */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <label style={{ fontSize: 10.5, color: css.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>URL Slug</label>
                            <span style={{ fontSize: 10, fontWeight: 700, color: getLengthColor(formData.slug.length, 1, 75) }}>
                              {formData.slug.length} / 75
                            </span>
                          </div>
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={e => {
                              setIsSlugManual(true);
                              setFormData(f => ({ ...f, slug: e.target.value }));
                            }}
                            style={{
                              width: '100%', background: css.inputBg, border: `1px solid ${slugError ? '#ef4444' : css.border}`, color: css.text,
                              padding: '8px 10px', borderRadius: 8, outline: 'none', fontSize: 12, fontWeight: 600,
                            }}
                          />
                        </div>

                        {/* Meta Description Input */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <label style={{ fontSize: 10.5, color: css.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meta Description</label>
                            <span style={{ fontSize: 10, fontWeight: 700, color: getLengthColor(formData.excerpt.length, 120, 160) }}>
                              {formData.excerpt.length} / 160
                            </span>
                          </div>
                          <textarea
                            value={formData.excerpt}
                            onChange={e => setFormData(f => ({ ...f, excerpt: e.target.value }))}
                            rows={3}
                            style={{
                              width: '100%', background: css.inputBg, border: `1px solid ${css.border}`, color: css.text,
                              padding: '8px 10px', borderRadius: 8, outline: 'none', fontSize: 12, fontWeight: 600,
                              resize: 'none', lineHeight: 1.5, fontFamily: 'inherit',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Circular Score Progress */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      background: css.surface2, padding: '12px 16px', borderRadius: 16,
                      border: `1px solid ${css.border}`
                    }}>
                      <div style={{ position: 'relative', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
                          <circle cx="28" cy="28" r="23" fill="transparent" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="5" />
                          <circle
                            cx="28" cy="28" r="23" fill="transparent"
                            stroke={scoreColor}
                            strokeWidth="5"
                            strokeDasharray={2 * Math.PI * 23}
                            strokeDashoffset={2 * Math.PI * 23 - (activeAnalysis.analysis.score / 100) * (2 * Math.PI * 23)}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.35s' }}
                          />
                        </svg>
                        <span style={{ fontSize: 12.5, fontWeight: 900, color: scoreColor }}>
                          {activeAnalysis.analysis.score}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: scoreColor }}>
                          {activeAnalysis.analysis.score >= 80 ? 'Great SEO' : activeAnalysis.analysis.score >= 50 ? 'Needs Work' : 'Poor SEO'}
                        </span>
                        <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: css.muted }}>
                          Keyword: "{activeAnalysis.keyword}"
                        </span>
                      </div>
                    </div>

                    {/* Categorized Diagnostic Tabs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 800, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        Analysis Diagnostics
                      </span>

                      {/* Sub-tab Selector */}
                      <div style={{
                        display: 'flex',
                        background: css.surface2,
                        border: `1px solid ${css.border}`,
                        borderRadius: 10,
                        padding: 2,
                        gap: 2,
                      }}>
                        {[
                          { id: 'basic', label: 'Basic' },
                          { id: 'additional', label: 'Additional' },
                          { id: 'title', label: 'Title' },
                          { id: 'content', label: 'Content' }
                        ].map(t => {
                          const active = seoTab === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setSeoTab(t.id as any)}
                              style={{
                                flex: 1,
                                padding: '6px 2px',
                                borderRadius: 8,
                                fontSize: 10.5,
                                fontWeight: active ? 700 : 500,
                                background: active ? css.surface : 'transparent',
                                border: 'none',
                                color: active ? css.accent : css.muted,
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.15s',
                              }}
                            >
                              {t.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Checklist */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                        {(activeAnalysis.analysis.categories[seoTab] || []).map((check: any) => (
                          <div
                            key={check.id}
                            style={{
                              display: 'flex', alignItems: 'flex-start', gap: 10,
                              fontSize: 12, fontWeight: 500, color: check.passed ? css.text : css.muted
                            }}
                          >
                            <span style={{
                              marginTop: 1,
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {check.passed ? (
                                <CheckCircle2 size={14.5} style={{ color: '#10b981' }} />
                              ) : (
                                <XCircle size={14.5} style={{ color: '#ef4444' }} />
                              )}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <span style={{ lineHeight: 1.25 }}>{check.label}</span>
                              <span style={{ fontSize: 9.5, color: css.muted, fontWeight: 600 }}>
                                {check.passed ? `Passed (+${check.pts} pts)` : `Missing (-${check.pts} pts)`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </aside>
          </>
        )}
      </div>
      <style>{`
        .desktop-only {
          display: block !important;
        }
        .mobile-only {
          display: none !important;
        }
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
          }
        }
        @media (max-width: 900px) {
          .blog-editor-main {
            flex-direction: column !important;
            overflow-y: auto !important;
          }
          .blog-editor-writing-area {
            padding: 30px 20px !important;
            flex: none !important;
            overflow-y: visible !important;
          }
          .blog-editor-sidebar {
            width: 100% !important;
            border-left: none !important;
            border-top: 1px solid ${css.border} !important;
            flex: none !important;
            overflow-y: visible !important;
          }
          .desktop-only-btn {
            display: none !important;
          }
        }
        @media (max-width: 500px) {
          .editor-header-draft-label {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
