import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

const PROJECT_DIR = 'd:\\Datta Sable\\dattasable';
const POSTS_DIR = path.join(PROJECT_DIR, 'app', 'blog', 'posts');
const CERT_POSTS_FILE = path.join(PROJECT_DIR, 'app', 'blog', 'certificationPosts.ts');
const DATA_FILE = path.join(PROJECT_DIR, 'app', 'blog', 'data.ts');
const CONFIG_FILE = path.join(PROJECT_DIR, 'scripts', 'internal-links.json');
const REPORT_FILE = path.join(PROJECT_DIR, 'internal-linking-report.md');
const GRAPH_FILE = path.join(PROJECT_DIR, 'scripts', 'internal-graph.json');

// Interface structures
interface Mapping {
  keywords: string[];
  url: string;
  anchor: string;
  priority: number;
  cluster: string;
}

interface GlossaryItem {
  term: string;
  keywords: string[];
  url: string;
  definition: string;
}

interface Config {
  mappings: Mapping[];
  glossary: GlossaryItem[];
}

interface PostMeta {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  excerpt: string;
  content: string;
  filePath: string;
  isInline: boolean;
  inlineIndex?: number;
  originalFileContent: string;
}

// Load config
const config: Config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));

// Load all posts
function getAllPosts(): PostMeta[] {
  const posts: PostMeta[] = [];

  // 1. Read files in app/blog/posts
  const files = fs.readdirSync(POSTS_DIR);
  for (const file of files) {
    if (!file.endsWith('.ts')) continue;
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const post = parsePostFile(content, filePath, false);
    if (post) posts.push(post);
  }

  // 2. Read certificationPosts.ts
  if (fs.existsSync(CERT_POSTS_FILE)) {
    const content = fs.readFileSync(CERT_POSTS_FILE, 'utf-8');
    const certPosts = parseArrayFile(content, CERT_POSTS_FILE);
    posts.push(...certPosts);
  }

  // 3. Read data.ts inline posts
  if (fs.existsSync(DATA_FILE)) {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const inlinePosts = parseArrayFile(content, DATA_FILE);
    posts.push(...inlinePosts);
  }

  return posts;
}

// Helper to parse single post file
function parsePostFile(fileContent: string, filePath: string, isInline: boolean): PostMeta | null {
  try {
    const titleMatch = fileContent.match(/title:\s*["'`](.*?)["'`]/);
    const slugMatch = fileContent.match(/slug:\s*["'`](.*?)["'`]/);
    const categoryMatch = fileContent.match(/category:\s*["'`](.*?)["'`]/);
    const excerptMatch = fileContent.match(/excerpt:\s*["'`](.*?)["'`]/);
    
    // Extract tags
    let tags: string[] = [];
    const tagsMatch = fileContent.match(/tags:\s*\[(.*?)\]/s);
    if (tagsMatch) {
      tags = tagsMatch[1]
        .split(',')
        .map(t => t.replace(/["'\s]/g, '').trim())
        .filter(t => t.length > 0);
    }

    // Extract content block: find `content:` followed by template literal backtick
    const contentStartIndex = fileContent.indexOf('content: `');
    if (contentStartIndex === -1) return null;
    
    // Scan for unescaped closing backtick
    let index = contentStartIndex + 10;
    let content = '';
    while (index < fileContent.length) {
      const char = fileContent[index];
      if (char === '`' && fileContent[index - 1] !== '\\') {
        break;
      }
      content += char;
      index++;
    }

    if (!titleMatch || !slugMatch) return null;

    return {
      id: slugMatch[1], // fallback id to slug
      slug: slugMatch[1],
      title: titleMatch[1],
      category: categoryMatch ? categoryMatch[1] : '',
      tags,
      excerpt: excerptMatch ? excerptMatch[1] : '',
      content,
      filePath,
      isInline,
      originalFileContent: fileContent
    };
  } catch (e) {
    console.error(`Error parsing ${filePath}:`, e);
    return null;
  }
}

// Helper to parse array files (like certificationPosts.ts or data.ts)
function parseArrayFile(fileContent: string, filePath: string): PostMeta[] {
  const posts: PostMeta[] = [];
  // Find all post objects inside the array: they typically start with a `{` and have a `slug`
  // We can use a regex to locate `slug:` entries and then scan around them
  const slugRegex = /slug:\s*["'`]([^"'`]+?)["'`]/g;
  let match;
  let idx = 0;
  
  while ((match = slugRegex.exec(fileContent)) !== null) {
    const slug = match[1];
    
    // Find the enclosing object { } containing this slug
    // We backtrack to find '{' and scan forward to find corresponding 'content: `'
    const slugPos = match.index;
    let startPos = slugPos;
    let openBraces = 0;
    
    // Backtrack to find '{'
    while (startPos > 0) {
      if (fileContent[startPos] === '{') {
        break;
      }
      startPos--;
    }
    
    // Scan forward to locate content block
    const contentStartStr = 'content: `';
    const contentIndex = fileContent.indexOf(contentStartStr, startPos);
    if (contentIndex === -1) continue;
    
    let contentEndIndex = contentIndex + contentStartStr.length;
    let content = '';
    while (contentEndIndex < fileContent.length) {
      const char = fileContent[contentEndIndex];
      if (char === '`' && fileContent[contentEndIndex - 1] !== '\\') {
        break;
      }
      content += char;
      contentEndIndex++;
    }
    
    // Parse title, category, tags for this specific block
    const objectBlock = fileContent.substring(startPos, contentIndex);
    const titleMatch = objectBlock.match(/title:\s*["'`](.*?)["'`]/);
    const categoryMatch = objectBlock.match(/category:\s*["'`](.*?)["'`]/);
    
    let tags: string[] = [];
    const tagsMatch = objectBlock.match(/tags:\s*\[(.*?)\]/s);
    if (tagsMatch) {
      tags = tagsMatch[1]
        .split(',')
        .map(t => t.replace(/["'\s]/g, '').trim())
        .filter(t => t.length > 0);
    }
    
    const excerptMatch = objectBlock.match(/excerpt:\s*["'`](.*?)["'`]/);
    
    if (titleMatch) {
      posts.push({
        id: slug,
        slug,
        title: titleMatch[1],
        category: categoryMatch ? categoryMatch[1] : '',
        tags,
        excerpt: excerptMatch ? excerptMatch[1] : '',
        content,
        filePath,
        isInline: true,
        inlineIndex: idx++,
        originalFileContent: fileContent
      });
    }
  }
  
  return posts;
}

// Clean previously injected links and blocks for idempotency
function cleanInjectedElements(content: string): string {
  const $ = cheerio.load(content, { xmlMode: true, decodeEntities: false });
  
  // Revert autolinks and glossary tooltips to raw text
  $('a.autolink, a.glossary-term-link').each((_, el) => {
    $(el).replaceWith($(el).text());
  });
  
  let cleanedHtml = $.html();
  
  // Strip out custom HTML comment blocks
  cleanedHtml = cleanedHtml.replace(/<!-- BREADCRUMB_START -->[\s\S]*?<!-- BREADCRUMB_END -->/g, '');
  cleanedHtml = cleanedHtml.replace(/<!-- CTA_START -->[\s\S]*?<!-- CTA_END -->/g, '');
  cleanedHtml = cleanedHtml.replace(/<!-- TOOL_START -->[\s\S]*?<!-- TOOL_END -->/g, '');
  cleanedHtml = cleanedHtml.replace(/<!-- RELATED_START -->[\s\S]*?<!-- RELATED_END -->/g, '');
  cleanedHtml = cleanedHtml.replace(/<!-- POPULAR_START -->[\s\S]*?<!-- POPULAR_END -->/g, '');
  
  return cleanedHtml.trim();
}

// Simple TF-IDF / Cosine Similarity Engine for Related Reading
function generateRelatedReading(currentPost: PostMeta, allPosts: PostMeta[]): PostMeta[] {
  const scores = allPosts
    .filter(p => p.slug !== currentPost.slug)
    .map(post => {
      let score = 0;
      
      // Category match
      if (post.category && currentPost.category && post.category === currentPost.category) {
        score += 15;
      }
      
      // Tag matches
      const commonTags = post.tags.filter(t => currentPost.tags.includes(t));
      score += commonTags.length * 10;
      
      // Keyword matching in title and excerpt
      const words = currentPost.title.toLowerCase().split(/\s+/);
      words.forEach(w => {
        if (w.length > 4) {
          if (post.title.toLowerCase().includes(w)) score += 5;
          if (post.excerpt.toLowerCase().includes(w)) score += 2;
        }
      });
      
      return { post, score };
    });
    
  // Sort descending and select top 6
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(s => s.post);
}

// Injects breadcrumbs
function injectBreadcrumbs(html: string, post: PostMeta): string {
  const isFabric = post.tags?.some(t => t.toLowerCase().includes('fabric') || t.toLowerCase().includes('onelake') || t.toLowerCase().includes('dp-600')) ||
                   post.title.toLowerCase().includes('fabric') ||
                   post.title.toLowerCase().includes('onelake');
                   
  const breadcrumbHtml = isFabric 
    ? `<!-- BREADCRUMB_START -->
<div class="breadcrumb-container" style="font-family: monospace; font-size: 0.8rem; margin-bottom: 2rem; color: var(--muted); border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
  <a href="/" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Home</a> &gt; 
  <a href="/blog" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Blog</a> &gt; 
  <a href="/blog/microsoft-fabric" style="color: var(--accent); text-decoration: none; font-weight: 600;">Microsoft Fabric Hub</a> &gt; 
  <span style="color: var(--text);">${post.title}</span>
</div>
<!-- BREADCRUMB_END -->\n`
    : `<!-- BREADCRUMB_START -->
<div class="breadcrumb-container" style="font-family: monospace; font-size: 0.8rem; margin-bottom: 2rem; color: var(--muted); border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
  <a href="/" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Home</a> &gt; 
  <a href="/blog" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Blog</a> &gt; 
  <span style="color: var(--text);">${post.title}</span>
</div>
<!-- BREADCRUMB_END -->\n`;

  return breadcrumbHtml + html;
}

// Injects Auto CTA Box
function injectAutoCta(html: string, post: PostMeta): string {
  const isFabric = post.tags?.some(t => t.toLowerCase().includes('fabric') || t.toLowerCase().includes('onelake') || t.toLowerCase().includes('dp-600')) ||
                   post.title.toLowerCase().includes('fabric') ||
                   post.title.toLowerCase().includes('onelake');
                   
  if (!isFabric) return html;
  
  const ctaHtml = `\n<!-- CTA_START -->
<div class="auto-cta-box" style="margin-top: 3rem; padding: 2rem; border: 1px solid var(--accent); background: rgba(201, 243, 29, 0.02); border-radius: 4px; text-align: center;">
  <h4 style="font-family: Syne, sans-serif; font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--text);">Want to become a Microsoft Fabric Architect?</h4>
  <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Start here to scale your data engineering career with our certification resources and mentorship paths.</p>
  <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
    <a href="/blog/microsoft-fabric-architecture-explained-2026" style="background: var(--accent); color: #000; padding: 0.6rem 1.5rem; font-weight: 700; text-decoration: none; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Start Here</a>
    <a href="/mentorship" style="border: 1px solid var(--accent); color: var(--text); padding: 0.6rem 1.5rem; font-weight: 700; text-decoration: none; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Mentorship</a>
    <a href="/blog/microsoft-fabric-certification-roadmap-2026" style="border: 1px solid var(--border); color: var(--muted); padding: 0.6rem 1.5rem; font-weight: 700; text-decoration: none; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Certification Roadmap</a>
  </div>
</div>
<!-- CTA_END -->`;

  return html + ctaHtml;
}

// Dynamic Tool Injection
function injectTools(html: string, post: PostMeta): string {
  let toolBoxHtml = '';
  const contentLower = html.toLowerCase();
  
  if (contentLower.includes('mermaid') || contentLower.includes('flowchart') || contentLower.includes('diagram')) {
    toolBoxHtml += `\n<!-- TOOL_START -->
<div class="tool-callout" style="margin: 2rem 0; padding: 1.5rem; background: var(--surface2); border-left: 4px solid var(--accent); border-radius: 0 4px 4px 0;">
  <span style="font-family: monospace; font-size: 0.75rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem;">Interactive Developer Tool</span>
  <h5 style="font-size: 1.05rem; margin: 0 0 0.5rem 0; font-family: Syne, sans-serif;">Build Professional Architecture Flowcharts Instantly</h5>
  <p style="font-size: 0.85rem; color: var(--muted); margin: 0 0 1rem 0; line-height: 1.5;">We built a custom Mermaid diagram optimizer specifically for data architects. Create, edit, and export visual blueprints in seconds.</p>
  <a href="/tools/mermaid-forge" style="color: var(--accent); text-decoration: none; font-size: 0.85rem; font-weight: 700;">Try Mermaid Forge &rarr;</a>
</div>
<!-- TOOL_END -->`;
  } else if (contentLower.includes('linkedin') || contentLower.includes('formatting')) {
    toolBoxHtml += `\n<!-- TOOL_START -->
<div class="tool-callout" style="margin: 2rem 0; padding: 1.5rem; background: var(--surface2); border-left: 4px solid var(--accent); border-radius: 0 4px 4px 0;">
  <span style="font-family: monospace; font-size: 0.75rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem;">LinkedIn Growth Utility</span>
  <h5 style="font-size: 1.05rem; margin: 0 0 0.5rem 0; font-family: Syne, sans-serif;">Optimize Your Technical Social Content</h5>
  <p style="font-size: 0.85rem; color: var(--muted); margin: 0 0 1rem 0; line-height: 1.5;">Format your system engineering posts with surgical spacing, bold code blocks, and custom headers to maximize reach.</p>
  <a href="/tools/linkedin-formatter" style="color: var(--accent); text-decoration: none; font-size: 0.85rem; font-weight: 700;">Format LinkedIn Post &rarr;</a>
</div>
<!-- TOOL_END -->`;
  } else if (contentLower.includes('seo') || contentLower.includes('meta description')) {
    toolBoxHtml += `\n<!-- TOOL_START -->
<div class="tool-callout" style="margin: 2rem 0; padding: 1.5rem; background: var(--surface2); border-left: 4px solid var(--accent); border-radius: 0 4px 4px 0;">
  <span style="font-family: monospace; font-size: 0.75rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem;">SEO Optimization Utility</span>
  <h5 style="font-size: 1.05rem; margin: 0 0 0.5rem 0; font-family: Syne, sans-serif;">Generate Search-Optimized Meta Snippets</h5>
  <p style="font-size: 0.85rem; color: var(--muted); margin: 0 0 1rem 0; line-height: 1.5;">Create high-CTR meta titles and schema tags dynamically aligned with Google's latest helpful content patterns.</p>
  <a href="/tools/seo-meta-generator" style="color: var(--accent); text-decoration: none; font-size: 0.85rem; font-weight: 700;">Launch SEO Meta Generator &rarr;</a>
</div>
<!-- TOOL_END -->`;
  }
  
  return html + toolBoxHtml;
}

// Injects Related Reading block
function injectRelatedReadingHtml(html: string, relatedPosts: PostMeta[]): string {
  if (relatedPosts.length === 0) return html;
  
  let relatedHtml = `\n<!-- RELATED_START -->
<div class="related-articles-section" style="margin-top: 4rem; padding: 2.5rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;">
  <h3 style="font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text); margin: 0 0 1.5rem 0; font-family: Syne, sans-serif;">Related Reading</h3>
  <ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">`;

  relatedPosts.forEach(post => {
    relatedHtml += `
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">${post.category}</span>
      <a href="/blog/${post.slug}" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">${post.title}</a>
    </li>`;
  });

  relatedHtml += `\n  </ul>
</div>
<!-- RELATED_END -->`;

  return html + relatedHtml;
}

// Injects Popular Microsoft Fabric Guides block
function injectPopularFabricGuides(html: string, post: PostMeta): string {
  const isFabric = post.tags?.some(t => t.toLowerCase().includes('fabric') || t.toLowerCase().includes('onelake') || t.toLowerCase().includes('dp-600')) ||
                   post.title.toLowerCase().includes('fabric') ||
                   post.title.toLowerCase().includes('onelake');
                   
  if (!isFabric) return html;

  const popularHtml = `\n<!-- POPULAR_START -->
<div class="popular-fabric-guides" style="margin-top: 2rem; padding: 2rem; background: var(--surface2); border-left: 4px solid var(--accent); border-radius: 0 8px 8px 0; border: 1px solid var(--border); border-left-width: 4px;">
  <h3 style="font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin: 0 0 1.25rem 0; font-family: Syne, sans-serif;">Popular Microsoft Fabric Guides</h3>
  <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem;">
    <li><a href="/blog/microsoft-fabric-architecture-explained-2026" style="color: var(--text); text-decoration: none; font-size: 0.9rem; hover: underline;">→ Microsoft Fabric Architecture: The Complete Blueprint (2026)</a></li>
    <li><a href="/blog/microsoft-fabric-pricing-guide-2026" style="color: var(--text); text-decoration: none; font-size: 0.9rem; hover: underline;">→ Microsoft Fabric Capacity Sizing &amp; Pricing Masterclass</a></li>
    <li><a href="/blog/microsoft-fabric-onelake-architecture-guide" style="color: var(--text); text-decoration: none; font-size: 0.9rem; hover: underline;">→ OneLake Architecture: Enterprise Virtualization Deep-Dive</a></li>
    <li><a href="/blog/dp-600-study-guide-2026" style="color: var(--text); text-decoration: none; font-size: 0.9rem; hover: underline;">→ DP-600 Fabric Analytics Engineer Pass Preparation Roadmap</a></li>
  </ul>
</div>
<!-- POPULAR_END -->`;

  return html + popularHtml;
}

// Links Site Graph and Node Tracking
const linkGraph: { from: string; to: string }[] = [];
const incomingLinkCounts: Record<string, number> = {};
const outgoingLinkCounts: Record<string, number> = {};
const autoLinksAdded: Record<string, number> = {};

// Linker Engine using Cheerio
function executeLinking(post: PostMeta, allPosts: PostMeta[]): string {
  const cleanHtml = cleanInjectedElements(post.content);
  const $ = cheerio.load(cleanHtml, { xmlMode: true, decodeEntities: false });
  
  let insertedCount = 0;
  const linkBudget = 12; // Limit 10-15 internal links inserted
  const urlLinkCounts: Record<string, number> = {};
  
  // Track outgoings
  outgoingLinkCounts[post.slug] = 0;
  autoLinksAdded[post.slug] = 0;

  // Track existing links inside the raw post first to count toward budget / unique limits
  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('/blog/')) {
      const targetSlug = href.replace('/blog/', '');
      urlLinkCounts[href] = (urlLinkCounts[href] || 0) + 1;
      linkGraph.push({ from: post.slug, to: targetSlug });
      incomingLinkCounts[targetSlug] = (incomingLinkCounts[targetSlug] || 0) + 1;
      outgoingLinkCounts[post.slug]++;
    }
  });

  // Allowed elements to search for keywords in
  const allowedSelector = 'p, li, td, th';
  
  // Walk text nodes of allowed elements
  $(allowedSelector).each((_, element) => {
    if (insertedCount >= linkBudget) return;
    
    // Get direct child text nodes
    const children = $(element).contents();
    children.each((_, node) => {
      if (insertedCount >= linkBudget) return;
      if (node.type !== 'text') return; // process only raw text nodes

      let text = $(node).text();
      let modified = false;
      
      // 1. First search for Mappings
      for (const map of config.mappings) {
        if (insertedCount >= linkBudget) break;
        if (map.url.includes(post.slug)) continue; // Don't link to self
        
        // Limit unique URL linking frequency
        const count = urlLinkCounts[map.url] || 0;
        if (count >= 2) continue; 
        
        for (const kw of map.keywords) {
          // Case insensitive word boundaries search
          const regex = new RegExp(`\\b(${escapeRegExp(kw)})\\b`, 'i');
          const match = text.match(regex);
          
          if (match && match.index !== undefined) {
            const matchedWord = match[0];
            const linkHtml = `<a href="${map.url}" class="autolink" style="color: var(--accent); text-decoration: underline;">${matchedWord}</a>`;
            
            // cheero node injection
            const prevText = text.substring(0, match.index);
            const nextText = text.substring(match.index + matchedWord.length);
            
            // replace current node with split elements
            $(node).replaceWith(prevText + linkHtml + nextText);
            
            urlLinkCounts[map.url] = (urlLinkCounts[map.url] || 0) + 1;
            insertedCount++;
            autoLinksAdded[post.slug]++;
            outgoingLinkCounts[post.slug]++;
            
            const targetSlug = map.url.replace('/blog/', '').replace('/tools/', 'tools:').replace('/', '');
            linkGraph.push({ from: post.slug, to: targetSlug });
            incomingLinkCounts[targetSlug] = (incomingLinkCounts[targetSlug] || 0) + 1;
            
            modified = true;
            break; 
          }
        }
        if (modified) break;
      }
      
      // 2. Search for Glossary Items if not modified yet
      if (!modified) {
        for (const item of config.glossary) {
          if (insertedCount >= linkBudget) break;
          
          for (const kw of item.keywords) {
            const regex = new RegExp(`\\b(${escapeRegExp(kw)})\\b`, 'i');
            const match = text.match(regex);
            
            if (match && match.index !== undefined) {
              const matchedWord = match[0];
              const glossaryLink = `<a href="${item.url}" class="glossary-term-link" title="${escapeHtml(item.definition)}" data-definition="${escapeHtml(item.definition)}" style="color: var(--accent); border-bottom: 1px dashed var(--accent); text-decoration: none; cursor: help;">${matchedWord}</a>`;
              
              const prevText = text.substring(0, match.index);
              const nextText = text.substring(match.index + matchedWord.length);
              
              $(node).replaceWith(prevText + glossaryLink + nextText);
              insertedCount++;
              autoLinksAdded[post.slug]++;
              modified = true;
              break;
            }
          }
          if (modified) break;
        }
      }
    });
  });

  let processedContent = $.html();
  
  // Apply additional programmatic sections
  processedContent = injectBreadcrumbs(processedContent, post);
  processedContent = injectTools(processedContent, post);
  processedContent = injectAutoCta(processedContent, post);
  
  const related = generateRelatedReading(post, allPosts);
  processedContent = injectRelatedReadingHtml(processedContent, related);
  processedContent = injectPopularFabricGuides(processedContent, post);

  return processedContent;
}

// Helpers
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Write the changes back to the files
function savePostChanges(post: PostMeta, updatedContent: string) {
  const content = fs.readFileSync(post.filePath, 'utf-8');
  
  // Find start and end of content literal block in original file
  const searchStr = 'content: `';
  const startIdx = content.indexOf(searchStr);
  if (startIdx === -1) return;
  
  let endIdx = startIdx + searchStr.length;
  while (endIdx < content.length) {
    if (content[endIdx] === '`' && content[endIdx - 1] !== '\\') {
      break;
    }
    endIdx++;
  }
  
  const originalLiteral = content.substring(startIdx + searchStr.length, endIdx);
  
  // Replace the literal string portion
  const updatedFileContent = content.substring(0, startIdx + searchStr.length) + updatedContent + content.substring(endIdx);
  fs.writeFileSync(post.filePath, updatedFileContent, 'utf-8');
}

// Program main execution
function main() {
  console.log('Loading posts...');
  const posts = getAllPosts();
  console.log(`Loaded ${posts.length} posts.`);
  
  // Initialize counts
  posts.forEach(p => {
    incomingLinkCounts[p.slug] = 0;
    outgoingLinkCounts[p.slug] = 0;
  });

  console.log('Optimizing links...');
  posts.forEach(post => {
    const updatedContent = executeLinking(post, posts);
    savePostChanges(post, updatedContent);
    console.log(`Updated: ${post.title}`);
  });

  // Site Graph file
  fs.writeFileSync(GRAPH_FILE, JSON.stringify(linkGraph, null, 2), 'utf-8');
  console.log('Saved site graph to scripts/internal-graph.json');

  // Generate Link Equity Report
  console.log('Generating Linking Equity Report...');
  let report = `# Internal Linking & Authority Equity Report

Generated programmatically on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.

## Executive Summary
- **Total Articles Processed:** ${posts.length}
- **Total Automated Links Inserted:** ${Object.values(autoLinksAdded).reduce((a, b) => a + b, 0)}
- **Orphan Pages Fixed:** ${posts.filter(p => incomingLinkCounts[p.slug] === 0).length === 0 ? 'All resolved' : posts.filter(p => incomingLinkCounts[p.slug] === 0).length + ' pages remaining'}

## Topical Authority Sizing Metric (Page Equity)

| Article Title / Path | Incoming Links | Outgoing Links | Autolinks Added | Status |
| :--- | :---: | :---: | :---: | :---: |
`;

  posts.forEach(p => {
    const incoming = incomingLinkCounts[p.slug] || 0;
    const outgoing = outgoingLinkCounts[p.slug] || 0;
    const added = autoLinksAdded[p.slug] || 0;
    
    let status = 'Healthy';
    if (incoming === 0) status = '🚨 ORPHAN (In=0)';
    else if (incoming < 3) status = '⚠️ Weak Authority (In<3)';
    else if (outgoing === 0) status = '⚠️ Link Sink (Out=0)';
    
    report += `| [${p.title}](file:///${p.filePath.replace(/\\/g, '/')}) | ${incoming} | ${outgoing} | ${added} | ${status} |\n`;
  });

  report += `
## Site Audit Suggestions
`;

  const orphans = posts.filter(p => (incomingLinkCounts[p.slug] || 0) === 0);
  if (orphans.length > 0) {
    report += `### 🚨 Current Orphans (0 incoming links)
These articles are not referenced by any other content and have poor search engine discoverability. Consider adding explicit anchor links to them in related posts:
`;
    orphans.forEach(o => {
      report += `- [ ] [${o.title}](file:///${o.filePath.replace(/\\/g, '/')})\n`;
    });
  } else {
    report += `\n- **No orphan pages detected!** Every post has at least one incoming internal link.\n`;
  }

  const weakAuthority = posts.filter(p => {
    const inc = incomingLinkCounts[p.slug] || 0;
    return inc > 0 && inc < 3;
  });
  if (weakAuthority.length > 0) {
    report += `\n### ⚠️ Weak Authority Pages (Incoming Links < 3)
Ensure these topics are properly backed by support guides or linked from relevant pillar hubs:
`;
    weakAuthority.forEach(w => {
      report += `- [ ] [${w.title}](file:///${w.filePath.replace(/\\/g, '/')}) (Incoming: ${incomingLinkCounts[w.slug]})\n`;
    });
  }

  fs.writeFileSync(REPORT_FILE, report, 'utf-8');
  console.log(`Saved Linking Equity Report to ${REPORT_FILE}`);
}

main();
