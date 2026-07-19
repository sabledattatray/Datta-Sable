import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

const PROJECT_DIR = process.cwd();
const POSTS_DIR = path.join(PROJECT_DIR, 'app', 'blog', 'posts');
const CERT_POSTS_FILE = path.join(PROJECT_DIR, 'app', 'blog', 'certificationPosts.ts');
const DATA_FILE = path.join(PROJECT_DIR, 'app', 'blog', 'data.ts');
const GRAPH_DATA_FILE = path.join(PROJECT_DIR, 'data', 'knowledge-graph.json');

interface GraphNode {
  id: string;
  slug: string;
  title: string;
  parent: string | null;
  children: string[];
  prerequisites: string[];
  category: string;
  difficulty: string;
  definition: string;
}

interface PostMeta {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  tags: string[];
}

function parsePostFile(fileContent: string): PostMeta | null {
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
      slug: slugMatch[1],
      title: titleMatch[1],
      category: categoryMatch ? categoryMatch[1] : '',
      excerpt: excerptMatch ? excerptMatch[1] : '',
      tags,
      content
    };
  } catch (e) {
    return null;
  }
}

function parseArrayFile(fileContent: string): PostMeta[] {
  const posts: PostMeta[] = [];
  const slugRegex = /slug:\s*["'`]([^"'`]+?)["'`]/g;
  let match;
  
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
        slug,
        title: titleMatch[1],
        category: categoryMatch ? categoryMatch[1] : '',
        tags,
        excerpt: excerptMatch ? excerptMatch[1] : '',
        content
      });
    }
  }
  
  return posts;
}

export async function GET() {
  try {
    const posts: PostMeta[] = [];

    // Load static files
    if (fs.existsSync(POSTS_DIR)) {
      const files = fs.readdirSync(POSTS_DIR);
      for (const file of files) {
        if (!file.endsWith('.ts')) continue;
        const fileContent = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
        const post = parsePostFile(fileContent);
        if (post) posts.push(post);
      }
    }

    if (fs.existsSync(CERT_POSTS_FILE)) {
      const fileContent = fs.readFileSync(CERT_POSTS_FILE, 'utf-8');
      posts.push(...parseArrayFile(fileContent));
    }

    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      posts.push(...parseArrayFile(fileContent));
    }

    // Load Knowledge Graph
    const graphData: { topics: GraphNode[] } = JSON.parse(fs.readFileSync(GRAPH_DATA_FILE, 'utf-8'));
    const topics = graphData.topics;

    // Calculate Linking Metrics
    const incoming: Record<string, number> = {};
    const outgoing: Record<string, number> = {};
    posts.forEach(p => {
      incoming[p.slug] = 0;
      outgoing[p.slug] = 0;
    });

    const linkGraph: { from: string; to: string }[] = [];

    posts.forEach(post => {
      const $ = cheerio.load(post.content);
      $('a').each((_, el) => {
        const href = $(el).attr('href') || '';
        if (href.startsWith('/blog/')) {
          const targetSlug = href.replace('/blog/', '').split('#')[0];
          linkGraph.push({ from: post.slug, to: targetSlug });
          incoming[targetSlug] = (incoming[targetSlug] || 0) + 1;
          outgoing[post.slug] = (outgoing[post.slug] || 0) + 1;
        }
      });
    });

    // BFS Click Depth Calculation
    const depths: Record<string, number> = {};
    posts.forEach(p => depths[p.slug] = Infinity);
    const queue: { slug: string; depth: number }[] = [];
    const startPillar = 'microsoft-fabric-architecture-explained-2026';
    
    if (posts.some(p => p.slug === startPillar)) {
      queue.push({ slug: startPillar, depth: 1 });
      depths[startPillar] = 1;
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      const edges = linkGraph.filter(e => e.from === current.slug);
      for (const edge of edges) {
        if (depths[edge.to] > current.depth + 1) {
          depths[edge.to] = current.depth + 1;
          queue.push({ slug: edge.to, depth: current.depth + 1 });
        }
      }
    }

    const validDepths = Object.values(depths).filter(d => d !== Infinity);
    const avgDepth = validDepths.length > 0 ? Number((validDepths.reduce((a, b) => a + b, 0) / validDepths.length).toFixed(2)) : 1.0;
    const worstDepth = validDepths.length > 0 ? Math.max(...validDepths) : 1;

    // Optimization suggestions generator
    const suggestions: string[] = [];
    posts.forEach(post => {
      const isFabric = post.tags.some(t => t.toLowerCase().includes('fabric')) || post.title.toLowerCase().includes('fabric');
      if (isFabric) {
        const inLinks = incoming[post.slug] || 0;
        const outLinks = outgoing[post.slug] || 0;
        
        if (inLinks === 0) {
          suggestions.push(`Orphan post: "${post.title}" has 0 inbound links.`);
        } else if (inLinks < 3) {
          suggestions.push(`Weak authority: "${post.title}" has only ${inLinks} inbound links. Add ${3 - inLinks} more.`);
        }

        if (outLinks === 0) {
          suggestions.push(`Link sink: "${post.title}" has 0 outbound links. Connect it to child modules.`);
        }
      }
    });

    // Calculate Category Coverage
    const categoryTotals: Record<string, { total: number; matched: number }> = {};
    topics.forEach(node => {
      const cat = node.category;
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = { total: 0, matched: 0 };
      }
      categoryTotals[cat].total++;
      if (posts.some(p => p.slug === node.slug)) {
        categoryTotals[cat].matched++;
      }
    });

    const categoryCoverage = Object.entries(categoryTotals).map(([name, stats]) => ({
      name,
      percentage: Math.round((stats.matched / stats.total) * 100),
      total: stats.total,
      matched: stats.matched
    }));

    return NextResponse.json({
      success: true,
      totalArticles: posts.length,
      totalLinks: linkGraph.length,
      averageLinksPerArticle: Number((linkGraph.length / posts.length).toFixed(2)),
      avgClickDepth: avgDepth,
      worstClickDepth: worstDepth,
      categoryCoverage,
      suggestions: suggestions.slice(0, 10),
      nodes: topics.map(node => ({
        id: node.id,
        title: node.title,
        incoming: incoming[node.slug] || 0,
        outgoing: outgoing[node.slug] || 0,
        parent: node.parent,
        category: node.category
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
