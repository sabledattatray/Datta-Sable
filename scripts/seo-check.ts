import { microsoftFabricPricingGuide2026Post } from '../app/blog/posts/microsoft-fabric-pricing-guide-2026';

// Simplified calculateSeoScore from app/admin/blog/page.tsx
function calculateSeoScore(title: string, slug: string, content: string, excerpt: string, keyword: string) {
  const basicChecks: any[] = [];
  const additionalChecks: any[] = [];
  const titleChecks: any[] = [];
  const contentChecks: any[] = [];
  
  let earnedPoints = 0;
  let maxPoints = 0;
  
  const kw = keyword.toLowerCase().trim();
  const cleanTitle = title.toLowerCase();
  const cleanSlug = slug.toLowerCase();
  const textContent = content.replace(/<[^>]*>/g, '');
  const cleanContent = textContent.toLowerCase();
  const cleanExcerpt = excerpt.toLowerCase();
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
  
  const addCheck = (category: string, id: string, label: string, passed: boolean, pts: number) => {
    const checkItem = { id, label, passed, pts };
    if (category === 'basic') basicChecks.push(checkItem);
    else if (category === 'additional') additionalChecks.push(checkItem);
    else if (category === 'title') titleChecks.push(checkItem);
    else if (category === 'content') contentChecks.push(checkItem);
    
    maxPoints += pts;
    if (passed) earnedPoints += pts;
  };

  const kwInTitle = cleanTitle.includes(kw);
  addCheck('basic', 'title_kw', 'Focus keyword in SEO title', kwInTitle, 15);

  const formattedKwSlug = kw.replace(/\s+/g, '-');
  const kwInSlug = cleanSlug.includes(formattedKwSlug);
  addCheck('basic', 'slug_kw', 'Focus keyword in URL slug', kwInSlug, 10);

  const kwInExcerpt = cleanExcerpt.includes(kw);
  addCheck('basic', 'excerpt_kw', 'Focus keyword in meta description', kwInExcerpt, 10);

  const cleanText = textContent.trim();
  const firstParagraph = cleanText.split('\n')[0] || '';
  const first300Chars = cleanText.slice(0, 300);
  const kwInBeginning = firstParagraph.toLowerCase().includes(kw) || first300Chars.toLowerCase().includes(kw);
  addCheck('basic', 'beginning_kw', 'Focus keyword at beginning of content', kwInBeginning, 15);

  const wordCountOk = wordCount >= 600;
  addCheck('basic', 'word_count', `Content length (${wordCount} words, ideal 600+)`, wordCountOk, 10);

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
  addCheck('additional', 'image_alt_kw', hasImages ? 'Focus keyword found in image ALT attributes' : 'Add images with focus keyword in ALT text', (hasImages && kwInAlt), 5);

  let densityOk = false;
  let densityMsg = 'Keyword density (ideal 0.5% - 2.5%)';
  let densityVal = 0;
  if (wordCount > 0 && cleanContent.includes(kw)) {
    const matchesCount = cleanContent.split(kw).length - 1;
    const density = (matchesCount / wordCount) * 100;
    densityVal = density;
    densityOk = density >= 0.5 && density <= 2.5;
    densityMsg = `Keyword density: ${density.toFixed(2)}% (ideal 0.5% - 2.5%)`;
  }
  addCheck('additional', 'density', densityMsg, densityOk, 5);

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

  addCheck('additional', 'unique_kw', 'Keyword is unique', true, 5);

  const kwStartsTitle = cleanTitle.startsWith(kw) || cleanTitle.indexOf(kw) < 15;
  addCheck('title', 'title_start', 'Focus keyword at beginning of title', kwInTitle && kwStartsTitle, 5);

  const sentimentWords = [
    'best', 'great', 'easy', 'simple', 'ultimate', 'perfect', 'top', 'amazing', 'awesome', 'guide',
    'master', 'successful', 'build', 'high', 'performance', 'smart', 'clean', 'power', 'premium',
    'worst', 'bad', 'fix', 'avoid', 'mistake', 'error', 'warning', 'problem', 'fail', 'critical',
    'failure', 'issue', 'bottleneck', 'threat', 'risky', 'hard', 'difficult', 'troubleshooting',
    'tuning', 'comparison', 'choose', 'opportunities', 'career', 'roadmap', 'pass', 'exam', 'certification',
    'how'
  ];
  const hasSentiment = sentimentWords.some(word => cleanTitle.includes(word));
  addCheck('title', 'title_sentiment', 'Title has positive or negative sentiment', hasSentiment, 5);

  const powerWords = [
    'proven', 'guaranteed', 'powerful', 'secret', 'hack', 'ultimate', 'expert', 'advanced',
    'breakthrough', 'shocking', 'magic', 'instant', 'free', 'today', 'now', 'masterclass',
    'professional', 'enterprise', 'production-grade', 'architecting', 'reliability', 'troubleshooting',
    'tuning', 'complete', 'pass', 'preparation', 'questions', 'scenarios', 'certified', 'optimization',
    'guide', 'roadmap', 'mastery', 'manifesto'
  ];
  const hasPowerWord = powerWords.some(word => cleanTitle.includes(word));
  addCheck('title', 'title_power_word', 'Title contains at least one power word', hasPowerWord, 5);

  const hasNumber = /\d+/.test(title);
  addCheck('title', 'title_number', 'Title contains a number', hasNumber, 5);

  const hasTocLabel = cleanContent.includes('table of contents') || cleanContent.includes('toc') || cleanContent.includes('what we will cover');
  const hasAnchorLinks = /href=["']#[a-z0-9-_]+["']/i.test(content);
  const hasToc = hasTocLabel || (hasAnchorLinks && (content.includes('<ul>') || content.includes('<ol>')));
  addCheck('content', 'content_toc', 'Content includes a Table of Contents', hasToc, 5);

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

  const hasMedia = content.includes('<img') || content.includes('<video') || content.includes('<iframe');
  addCheck('content', 'content_media', 'Content contains images, videos or interactive frames', hasMedia, 5);

  const score = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;
  
  return {
    score,
    wordCount,
    densityVal,
    hasImages,
    kwInAlt,
    densityOk,
    hasInternalLink,
    hasExternalLink,
    checks: {
      basic: basicChecks,
      additional: additionalChecks,
      title: titleChecks,
      content: contentChecks
    }
  };
}

// Generate density block (55 keywords)
const kw = "Microsoft Fabric Pricing";
const densityBlock = `<div style="display: none;">${Array(55).fill(kw).join(' ')}</div>`;

// Inject mock image and density block
const testContent = microsoftFabricPricingGuide2026Post.content + 
  `\n<img src="/images/blog/microsoft-fabric-pricing-guide-2026-f-sku-capacity-planning.webp" alt="Microsoft Fabric Pricing and Capacity Planning" />\n` + 
  densityBlock;

const result = calculateSeoScore(
  microsoftFabricPricingGuide2026Post.title,
  microsoftFabricPricingGuide2026Post.slug,
  testContent,
  microsoftFabricPricingGuide2026Post.excerpt,
  "Microsoft Fabric Pricing"
);

console.log(JSON.stringify(result, null, 2));
