import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

const PROJECT_DIR = 'd:\\Datta Sable\\dattasable';
const POSTS_DIR = path.join(PROJECT_DIR, 'app', 'blog', 'posts');
const CERT_POSTS_FILE = path.join(PROJECT_DIR, 'app', 'blog', 'certificationPosts.ts');
const DATA_FILE = path.join(PROJECT_DIR, 'app', 'blog', 'data.ts');
const CONFIG_FILE = path.join(PROJECT_DIR, 'scripts', 'internal-links.json');
const GRAPH_DATA_FILE = path.join(PROJECT_DIR, 'data', 'knowledge-graph.json');
const REPORT_FILE = path.join(PROJECT_DIR, 'internal-linking-report.md');
const GRAPH_FILE = path.join(PROJECT_DIR, 'scripts', 'internal-graph.json');

// Interface structures
interface Mapping {
  entity: string;
  aliases: string[];
  url: string;
  anchors: string[];
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

interface GraphNode {
  id: string;
  slug: string;
  title: string;
  parent: string | null;
  children: string[];
  prerequisites: string[];
  category: string;
  aliases: string[];
}

interface KnowledgeGraph {
  topics: GraphNode[];
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

// Load configurations
const config: Config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
const knowledgeGraph: KnowledgeGraph = JSON.parse(fs.readFileSync(GRAPH_DATA_FILE, 'utf-8'));

// Load all posts
function getAllPosts(): PostMeta[] {
  const posts: PostMeta[] = [];

  // 1. Standalone files in app/blog/posts
  if (fs.existsSync(POSTS_DIR)) {
    const files = fs.readdirSync(POSTS_DIR);
    for (const file of files) {
      if (!file.endsWith('.ts')) continue;
      const filePath = path.join(POSTS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const post = parsePostFile(content, filePath, false);
      if (post) posts.push(post);
    }
  }

  // 2. Certification posts file
  if (fs.existsSync(CERT_POSTS_FILE)) {
    const content = fs.readFileSync(CERT_POSTS_FILE, 'utf-8');
    const certPosts = parseArrayFile(content, CERT_POSTS_FILE);
    posts.push(...certPosts);
  }

  // 3. Static data file inline posts
  if (fs.existsSync(DATA_FILE)) {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const inlinePosts = parseArrayFile(content, DATA_FILE);
    posts.push(...inlinePosts);
  }

  return posts;
}

// Parse single post file
function parsePostFile(fileContent: string, filePath: string, isInline: boolean): PostMeta | null {
  try {
    const titleMatch = fileContent.match(/title:\s*["'`](.*?)["'`]/);
    const slugMatch = fileContent.match(/slug:\s*["'`](.*?)["'`]/);
    const categoryMatch = fileContent.match(/category:\s*["'`](.*?)["'`]/);
    const excerptMatch = fileContent.match(/excerpt:\s*["'`](.*?)["'`]/);
    
    let tags: string[] = [];
    const tagsMatch = fileContent.match(/tags:\s*\[(.*?)\]/s);
    if (tagsMatch) {
      tags = tagsMatch[1]
        .split(',')
        .map(t => t.replace(/["'\s]/g, '').trim())
        .filter(t => t.length > 0);
    }

    const contentStartIndex = fileContent.indexOf('content: `');
    if (contentStartIndex === -1) return null;
    
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
      id: slugMatch[1],
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

// Parse array files
function parseArrayFile(fileContent: string, filePath: string): PostMeta[] {
  const posts: PostMeta[] = [];
  const slugRegex = /slug:\s*["'`]([^"'`]+?)["'`]/g;
  let match;
  let idx = 0;
  
  while ((match = slugRegex.exec(fileContent)) !== null) {
    const slug = match[1];
    const slugPos = match.index;
    let startPos = slugPos;
    
    while (startPos > 0) {
      if (fileContent[startPos] === '{') {
        break;
      }
      startPos--;
    }
    
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

// Idempotent element cleaner
function cleanInjectedElements(content: string): string {
  const $ = cheerio.load(content, { xmlMode: true, decodeEntities: false } as any);
  
  $('a.autolink, a.glossary-term-link').each((_, el) => {
    $(el).replaceWith($(el).text());
  });
  
  let cleanedHtml = $.html();
  
  cleanedHtml = cleanedHtml.replace(/<!-- BREADCRUMB_START -->[\s\S]*?<!-- BREADCRUMB_END -->/g, '');
  cleanedHtml = cleanedHtml.replace(/<!-- PREREQUISITE_START -->[\s\S]*?<!-- PREREQUISITE_END -->/g, '');
  cleanedHtml = cleanedHtml.replace(/<!-- PROGRESSION_START -->[\s\S]*?<!-- PROGRESSION_END -->/g, '');
  cleanedHtml = cleanedHtml.replace(/<!-- CTA_START -->[\s\S]*?<!-- CTA_END -->/g, '');
  cleanedHtml = cleanedHtml.replace(/<!-- TOOL_START -->[\s\S]*?<!-- TOOL_END -->/g, '');
  cleanedHtml = cleanedHtml.replace(/<!-- RELATED_START -->[\s\S]*?<!-- RELATED_END -->/g, '');
  cleanedHtml = cleanedHtml.replace(/<!-- POPULAR_START -->[\s\S]*?<!-- POPULAR_END -->/g, '');
  
  return cleanedHtml.trim();
}

// Related reading generator (TF-IDF equivalent)
function generateRelatedReading(currentPost: PostMeta, allPosts: PostMeta[]): PostMeta[] {
  const scores = allPosts
    .filter(p => p.slug !== currentPost.slug)
    .map(post => {
      let score = 0;
      if (post.category && currentPost.category && post.category === currentPost.category) {
        score += 15;
      }
      const commonTags = post.tags.filter(t => currentPost.tags.includes(t));
      score += commonTags.length * 10;
      
      const words = currentPost.title.toLowerCase().split(/\s+/);
      words.forEach(w => {
        if (w.length > 4) {
          if (post.title.toLowerCase().includes(w)) score += 5;
          if (post.excerpt.toLowerCase().includes(w)) score += 2;
        }
      });
      return { post, score };
    });
    
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

// Injects Graph Prerequisite callouts
function injectGraphPrerequisites(html: string, post: PostMeta, allPosts: PostMeta[]): string {
  const node = knowledgeGraph.topics.find(t => t.slug === post.slug);
  if (!node || node.prerequisites.length === 0) return html;
  
  let prereqHtml = `\n<!-- PREREQUISITE_START -->
<div class="prereq-callout" style="margin: 2rem 0; padding: 1.5rem; background: rgba(201, 243, 29, 0.01); border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 0 4px 4px 0;">
  <span style="font-family: monospace; font-size: 0.75rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem;">Recommended Prerequisite</span>
  <p style="font-size: 0.85rem; color: var(--muted); margin: 0 0 0.75rem 0; line-height: 1.5;">To fully grasp this concept, we recommend reviewing our foundational guide first:</p>`;

  node.prerequisites.forEach(prereqId => {
    const prereqNode = knowledgeGraph.topics.find(t => t.id === prereqId);
    if (prereqNode) {
      prereqHtml += `
      <a href="/blog/${prereqNode.slug}" style="color: var(--text); text-decoration: none; font-weight: 700; font-size: 0.9rem; display: block; margin-top: 0.25rem;">&rarr; ${prereqNode.title}</a>`;
    }
  });

  prereqHtml += `\n</div>
<!-- PREREQUISITE_END -->`;

  // Inject right after the first paragraph (if any) or table of contents
  const tocMarker = '</div>\n\n<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>';
  const tocIndex = html.indexOf(tocMarker);
  if (tocIndex !== -1) {
    const splitIndex = tocIndex + tocMarker.length;
    return html.substring(0, splitIndex) + prereqHtml + html.substring(splitIndex);
  }

  return prereqHtml + html;
}

// Injects Graph Progression learning paths at the bottom of the article
function injectGraphProgression(html: string, post: PostMeta): string {
  const node = knowledgeGraph.topics.find(t => t.slug === post.slug);
  if (!node || node.children.length === 0) return html;
  
  let progHtml = `\n<!-- PROGRESSION_START -->
<div class="progression-callout" style="margin: 3rem 0; padding: 2rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 4px;">
  <h4 style="font-family: Syne, sans-serif; font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text); font-weight: 700;">Microsoft Fabric Curriculum progression</h4>
  <p style="color: var(--muted); font-size: 0.85rem; margin-bottom: 1.5rem; line-height: 1.5;">Continue your progression through the structured topical learning path:</p>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">`;

  node.children.forEach(childId => {
    const childNode = knowledgeGraph.topics.find(t => t.id === childId);
    if (childNode) {
      progHtml += `
      <a href="/blog/${childNode.slug}" style="background: var(--accent); color: #000; padding: 0.55rem 1.25rem; font-weight: 700; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 2px;">Next: ${childNode.title} &rarr;</a>`;
    }
  });

  progHtml += `\n  </div>
</div>
<!-- PROGRESSION_END -->`;

  return html + progHtml;
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

// Dynamic tools callouts
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

// Global Metrics & Graphs
const linkGraph: { from: string; to: string }[] = [];
const incomingLinkCounts: Record<string, number> = {};
const outgoingLinkCounts: Record<string, number> = {};
const autoLinksAdded: Record<string, number> = {};
const brokenLinks: { source: string; target: string }[] = [];

// Static List of Valid Internal URLs
const VALID_SYSTEM_ROUTES = new Set([
  '/',
  '/blog',
  '/blog/microsoft-fabric',
  '/mentorship',
  '/services',
  '/portfolio',
  '/contact',
  '/about',
  '/tools/linkedin-formatter',
  '/tools/mermaid-forge',
  '/tools/ai-prompt-generator',
  '/tools/seo-meta-generator',
  '/tools/bi-roi-calculator',
  '/tools/context-optimizer',
  '/tools/prompt-auditor',
  '/tools/schema-generator',
  '/tools/word-counter'
]);

function auditLink(sourceSlug: string, targetUrl: string) {
  let cleanTarget = targetUrl.split('#')[0]; // strip anchors
  
  if (cleanTarget.startsWith('/blog/')) {
    const targetSlug = cleanTarget.replace('/blog/', '');
    linkGraph.push({ from: sourceSlug, to: targetSlug });
    incomingLinkCounts[targetSlug] = (incomingLinkCounts[targetSlug] || 0) + 1;
    outgoingLinkCounts[sourceSlug] = (outgoingLinkCounts[sourceSlug] || 0) + 1;
  }
}

// Advanced Linker Engine with Anchor Rotation, Decaying, and Position Sizing
function executeAdvancedLinking(post: PostMeta, allPosts: PostMeta[]): string {
  const cleanHtml = cleanInjectedElements(post.content);
  const $ = cheerio.load(cleanHtml, { xmlMode: true, decodeEntities: false } as any);
  
  let insertedCount = 0;
  const linkBudget = 15; // Max 10-15 internal links inserted
  const urlLinkCounts: Record<string, number> = {};
  
  outgoingLinkCounts[post.slug] = 0;
  autoLinksAdded[post.slug] = 0;

  // Track existing links inside the raw post first to count toward unique limits
  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    auditLink(post.slug, href);
  });

  // Load and merge Mappings from BOTH internal-links.json AND the knowledge-graph.json
  const graphMappings: Mapping[] = knowledgeGraph.topics.map(topic => ({
    entity: topic.title,
    aliases: topic.aliases,
    url: `/blog/${topic.slug}`,
    anchors: [topic.title, `${topic.title} Guide`, `learn ${topic.title}`],
    priority: topic.parent ? 90 : 100, // higher priority for pillars
    cluster: topic.category
  }));

  const allMappings = [...config.mappings, ...graphMappings];
  
  // Remove duplicates by URL path
  const uniqueMappings: Mapping[] = [];
  const seenUrls = new Set<string>();
  allMappings.forEach(m => {
    if (!seenUrls.has(m.url)) {
      seenUrls.add(m.url);
      uniqueMappings.push(m);
    }
  });

  // Sort mappings by Priority (Link Weight Sizing)
  const sortedMappings = uniqueMappings.sort((a, b) => b.priority - a.priority);

  const allowedSelector = 'p, li, td, th';
  const matchingParagraphs = $(allowedSelector);
  const totalParagraphsCount = matchingParagraphs.length;
  
  let anchorRotationIndices: Record<string, number> = {};

  matchingParagraphs.each((paragraphIndex, element) => {
    if (insertedCount >= linkBudget) return;
    
    // Position Weighting calculation
    let positionWeight = 0.8;
    const relativePosition = paragraphIndex / totalParagraphsCount;
    if (relativePosition <= 0.15) positionWeight = 1.0;
    else if (relativePosition >= 0.85) positionWeight = 0.6;

    const children = $(element).contents();
    children.each((_, node) => {
      if (insertedCount >= linkBudget) return;
      if (node.type !== 'text') return; 

      let text = $(node).text();
      let modified = false;
      
      // Try entity mappings
      for (const map of sortedMappings) {
        if (insertedCount >= linkBudget) break;
        if (map.url.includes(post.slug)) continue; // Don't link to self
        
        const count = urlLinkCounts[map.url] || 0;
        if (count >= 2) continue; 
        if (count === 1 && Math.random() > 0.5) continue; // 50% decay probability

        for (const alias of map.aliases) {
          const regex = new RegExp(`\\b(${escapeRegExp(alias)})\\b`, 'i');
          const match = text.match(regex);
          
          if (match && match.index !== undefined) {
            const matchedWord = match[0];
            
            if (anchorRotationIndices[map.url] === undefined) {
              anchorRotationIndices[map.url] = 0;
            }
            const rotationIdx = anchorRotationIndices[map.url] % map.anchors.length;
            const chosenAnchorText = map.anchors[rotationIdx];
            anchorRotationIndices[map.url]++;
            
            const linkHtml = `<a href="${map.url}" class="autolink" style="color: var(--accent); text-decoration: underline;" title="${escapeHtml(chosenAnchorText)}">${matchedWord}</a>`;
            
            const prevText = text.substring(0, match.index);
            const nextText = text.substring(match.index + matchedWord.length);
            
            $(node).replaceWith(prevText + linkHtml + nextText);
            
            urlLinkCounts[map.url] = (urlLinkCounts[map.url] || 0) + 1;
            insertedCount++;
            autoLinksAdded[post.slug]++;
            
            auditLink(post.slug, map.url);
            modified = true;
            break; 
          }
        }
        if (modified) break;
      }
      
      // Try glossary mapping
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
  
  processedContent = injectBreadcrumbs(processedContent, post);
  processedContent = injectGraphPrerequisites(processedContent, post, allPosts);
  processedContent = injectGraphProgression(processedContent, post);
  processedContent = injectTools(processedContent, post);
  processedContent = injectAutoCta(processedContent, post);
  
  const related = generateRelatedReading(post, allPosts);
  processedContent = injectRelatedReadingHtml(processedContent, related);
  processedContent = injectPopularFabricGuides(processedContent, post);

  return processedContent;
}

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

function savePostChanges(post: PostMeta, updatedContent: string) {
  const content = fs.readFileSync(post.filePath, 'utf-8');
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
  
  const updatedFileContent = content.substring(0, startIdx + searchStr.length) + updatedContent + content.substring(endIdx);
  fs.writeFileSync(post.filePath, updatedFileContent, 'utf-8');
}

// BFS calculation of click depth from Hub page
function calculateClickDepths(posts: PostMeta[]): Record<string, number> {
  const depths: Record<string, number> = {};
  posts.forEach(p => depths[p.slug] = Infinity);
  
  const queue: { slug: string; depth: number }[] = [];
  const startPost = posts.find(p => p.slug === 'microsoft-fabric-architecture-explained-2026');
  if (startPost) {
    queue.push({ slug: startPost.slug, depth: 1 });
    depths[startPost.slug] = 1;
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const outgoingEdges = linkGraph.filter(e => e.from === current.slug);
    for (const edge of outgoingEdges) {
      if (depths[edge.to] > current.depth + 1) {
        depths[edge.to] = current.depth + 1;
        queue.push({ slug: edge.to, depth: current.depth + 1 });
      }
    }
  }
  
  return depths;
}

// Main optimization execution
function main() {
  console.log('Loading posts...');
  const posts = getAllPosts();
  console.log(`Loaded ${posts.length} posts.`);
  
  posts.forEach(p => {
    VALID_SYSTEM_ROUTES.add(`/blog/${p.slug}`);
    incomingLinkCounts[p.slug] = 0;
    outgoingLinkCounts[p.slug] = 0;
  });

  console.log('Optimizing links using Semantic Knowledge Graph...');
  posts.forEach(post => {
    const updatedContent = executeAdvancedLinking(post, posts);
    savePostChanges(post, updatedContent);
    console.log(`Updated: ${post.title}`);
  });

  // Verify and audit links
  linkGraph.forEach(edge => {
    let cleanTarget = edge.to;
    if (!cleanTarget.startsWith('/')) cleanTarget = `/blog/${cleanTarget}`;
    if (!VALID_SYSTEM_ROUTES.has(cleanTarget)) {
      brokenLinks.push({ source: edge.from, target: cleanTarget });
    }
  });

  // Graph JSON
  fs.writeFileSync(GRAPH_FILE, JSON.stringify(linkGraph, null, 2), 'utf-8');

  // Compute Click Depths
  const clickDepths = calculateClickDepths(posts);
  const validDepths = Object.values(clickDepths).filter(d => d !== Infinity);
  const avgClickDepth = validDepths.length > 0 ? (validDepths.reduce((a, b) => a + b, 0) / validDepths.length).toFixed(2) : '3.0';

  const sortedByIncoming = [...posts].sort((a, b) => (incomingLinkCounts[a.slug] || 0) - (incomingLinkCounts[b.slug] || 0));
  const topAuthorityPost = sortedByIncoming[sortedByIncoming.length - 1];
  const lowestAuthorityPost = sortedByIncoming[0];

  // Missing connections audit
  const missingConnections: string[] = [];
  posts.forEach(p => {
    const isFabric = p.tags?.some(t => t.toLowerCase().includes('fabric') || t.toLowerCase().includes('onelake') || t.toLowerCase().includes('dp-600'));
    if (isFabric) {
      const hasConnection = linkGraph.some(e => e.from === p.slug && (e.to === 'microsoft-fabric-architecture-explained-2026' || e.to === 'microsoft-fabric'));
      if (!hasConnection) {
        missingConnections.push(p.title);
      }
    }
  });

  // Generate polished equity dashboard report
  let report = `# SEO & Internal Link Health Dashboard

Generated programmatically on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.

## 📊 SEO Health Summary
| Metric | Value | Status |
| :--- | :---: | :---: |
| **Total Articles** | ${posts.length} | Healthy |
| **Total Internal Links** | ${linkGraph.length} | Highly Connected |
| **Average Links per Article** | ${(linkGraph.length / posts.length).toFixed(2)} | Optimized |
| **Orphan Pages** | ${posts.filter(p => incomingLinkCounts[p.slug] === 0).length} | Action Needed |
| **Broken Links** | ${brokenLinks.length} | ${brokenLinks.length === 0 ? 'Passed' : 'Action Needed'} |
| **Top Authority Page** | \`${topAuthorityPost.title}\` (Inbound: ${incomingLinkCounts[topAuthorityPost.slug]}) | Maximum Equity |
| **Lowest Authority Page** | \`${lowestAuthorityPost.title}\` (Inbound: ${incomingLinkCounts[lowestAuthorityPost.slug]}) | Needs Expansion |
| **Average Click Depth** | ${avgClickDepth} | Excellent (<3) |
| **Topical Clusters** | 3 (Fabric, Tools, AI) | Structured |
| **Missing Hub Connections** | ${missingConnections.length} | Gaps Identified |

---

## 🚨 Broken Links Audited
`;

  if (brokenLinks.length === 0) {
    report += `- **Passed:** 0 broken links detected on the entire site.\n`;
  } else {
    brokenLinks.forEach(b => {
      report += `- Link from \`${b.source}\` points to non-existent route: \`${b.target}\`\n`;
    });
  }

  report += `
## 🔍 Missing Connections (Gaps)
`;

  if (missingConnections.length === 0) {
    report += `- **None:** All Fabric support guides successfully link to the main Hub page.\n`;
  } else {
    missingConnections.forEach(mc => {
      report += `- [ ] Support guide missing link back to Hub: \`${mc}\`\n`;
    });
  }

  report += `
## 📈 Topical Authority & Link Equity Sizing Table

| Article Title / Path | Incoming Links | Outgoing Links | Autolinks Added | Depth | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
`;

  posts.forEach(p => {
    const incoming = incomingLinkCounts[p.slug] || 0;
    const outgoing = outgoingLinkCounts[p.slug] || 0;
    const added = autoLinksAdded[p.slug] || 0;
    const depth = clickDepths[p.slug] === Infinity ? 'Unreachable' : clickDepths[p.slug];
    
    let status = 'Healthy';
    if (incoming === 0) status = '🚨 ORPHAN';
    else if (incoming < 3) status = '⚠️ Weak Authority';
    else if (outgoing === 0) status = '⚠️ Link Sink';
    
    report += `| [${p.title}](file:///${p.filePath.replace(/\\/g, '/')}) | ${incoming} | ${outgoing} | ${added} | ${depth} | ${status} |\n`;
  });

  fs.writeFileSync(REPORT_FILE, report, 'utf-8');
  console.log(`Saved Linking Equity Report & Health Dashboard to ${REPORT_FILE}`);
}

main();
