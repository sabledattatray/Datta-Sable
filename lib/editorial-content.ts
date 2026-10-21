import { dp600PracticeCompanion } from '@/content/editorial/dp600-practice-companion';
import { applyEditorialRevision } from './editorial-revisions';

// Exact, reviewed stock paragraphs found verbatim across 26–59 published posts.
// Preserve CMS originals; apply the same corrections to every public surface.
const stockParagraphs = new Set<string>([
  "When architecting automation pipelines with n8n, self-hosting on Docker or Kubernetes allows for unlimited execution logs and control over active workflows. To handle high concurrent webhook requests, n8n must be deployed in queue mode. This separates the main orchestrator from active worker nodes using Redis as a message broker. Worflow state data is stored in a dedicated PostgreSQL database, where transaction logs should be cleaned weekly to prevent storage exhaustion.",
  "Production challenges with n8n include memory leaks inside long-running code execution nodes (JavaScript/Python) and execution queue blocks during peak traffic. Developers should limit the size of payloads passed between nodes, configure strict execution timeout rules, and set up alert notifications using n8n error-trigger nodes to route logs directly to system administration channels.",
  "Benchmarking n8n in queue mode with 3 active worker nodes demonstrated an execution throughput of 250 workflows per second. Webhook response latency dropped from 450ms to 92ms when caching static API responses in Redis. Database lock contention was reduced by 60% after indexing execution log tables.",
  "Achieving stability and execution speed requires a dedicated engineering strategy, strict validation, and active telemetry. Implementing these practices will optimize your workflows and ensure system reliability.",
  "In the long term, investing in clean software standards and developer ergonomics will reduce maintenance overhead and accelerate release frequency, allowing your organization to remain agile and competitive in a rapidly changing technical landscape. Furthermore, establishing clear ownership profiles for each system component ensures that documentation and troubleshooting protocols remain in lockstep with codebase evolutions. This disciplined approach prevents technical debt accumulation, reduces onboarding latency for new developers, and guarantees that your operational infrastructure can adapt dynamically to emerging business requirements.",
  "Ultimately, a successful deployment is not just about making the code work today, but ensuring it is maintainable for the next five years. By building modules that are isolated and well-tested, you protect the core user experience from regression failures. This operational resilience translates directly into customer trust and long-term brand equity, providing a solid foundation for sustainable commercial growth.",
  "Success at scale requires a strategic commitment to modular systems, clean data flows, and active monitoring. By implementing these practices, you lay the foundation for a resilient, performant technology ecosystem.",
  "When scaling enterprise systems, architects must build modular, decoupled components. Decoupling storage from compute ensures independent scaling and high availability. Event-driven message brokers (like RabbitMQ) serialize transactions, while caching policies (such as Redis or CDN edge rules) offload database reads.",
  "Production operational challenges include handling concurrent user spikes, memory leaks in server runtimes, and database pool depletion. Developers should set container memory limits under Kubernetes, configure autoscaling, use database connection poolers, and run regular query execution profiling.",
  "Performance optimizations reduced page loading latency by 55% during high-concurrency testing. Database CPU utilization stabilized at 40%, and memory allocation followed a clean linear scale without garbage collection spikes."
]);
const normalize = (html: string) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
export function correctEditorialContent<T extends { slug: string; content?: string | null }>(post: T): T {
  post = applyEditorialRevision(post);
  let content = post.content;
  if (!content) return post;
  if (post.slug === 'dp-600-fabric-analytics-engineer-study-companion-notebook' &&
      content.includes('delta-store-mechanics')) {
    content = dp600PracticeCompanion;
  } else {
    content = content.replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi,
      paragraph => stockParagraphs.has(normalize(paragraph)) ? '' : paragraph);
    if (content !== post.content) {
      const emptyIds: string[] = [];
      content = content.replace(/<h([23])\b[^>]*\bid=["'](architectural-deepdive|production-challenges|performance-benchmarks|strategic-considerations|final-takeaway)["'][^>]*>(?:(?!<\/h[23]>)[\s\S])*?<\/h\1>\s*(?=<h[23]\b|$)/gi,
        (_heading, _level, id) => { emptyIds.push(id); return ''; });
      for (const id of emptyIds) {
        content = content.replace(new RegExp('<li\\b[^>]*>\\s*<a\\b[^>]*href=["\']#' + id + '["\'][^>]*>[\\s\\S]*?<\\/a>\\s*<\\/li>', 'gi'), '');
      }
    }
  }
  const aliases: Record<string, string> = {
  "/blog/microsoft-fabric-architecture-explained-complete-2026-guide": "/blog/microsoft-fabric-architecture-explained-2026",
  "/blog/dp-600-study-guide-2026-fabric-analytics-engineer": "/blog/dp-600-study-guide-2026",
  "/blog/microsoft-fabric-capacity-sizing-2026": "/blog/microsoft-fabric-capacity-sizing-guide-2026",
  "/blog/microsoft-fabric-governance-guide": "/blog/microsoft-fabric-governance-purview-guide-2026",
  "/blog/case-study-surgical-prompt-architecture-consistency": "/blog/case-study-precision-prompt-architecture-consistency",
  "/blog/surgical-prompt-architecture-framework": "/blog/precision-prompt-architecture-framework"
};
  content = content.replace(/href=(["'])([^"']+)\1/g, (attribute, quote, href) =>
    aliases[href] ? 'href=' + quote + aliases[href] + quote : attribute);
  // Replace references to nonexistent hubs/tools with accurately labelled resources.
  content = content.replace(/<a\b[^>]*href=["']\/blog\/cloud-security["'][^>]*>[\s\S]*?<\/a>/gi,
    '<a href="/blog">All technical guides</a>');
  content = content.replace(/<a\b[^>]*href=["']\/tools\/fabric-capacity-calculator["'][^>]*>[\s\S]*?<\/a>/gi,
    '<a href="/blog/microsoft-fabric-capacity-sizing-guide-2026">Fabric capacity sizing guide</a>');
  content = content.replace(/src=(["'])\/images\/hero\/datta-sable-portrait\.webp\1/g,
    'src="/images/author.webp"');
  // Format Markdown emphasis only in HTML text nodes; code and attributes stay unchanged.
  content = content.split(/(<pre\b[^>]*>[\s\S]*?<\/pre>|<code\b[^>]*>[\s\S]*?<\/code>|<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<[^>]+>)/gi)
    .map(part => part.startsWith('<') ? part : part.replace(/\*\*([^*<>]+)\*\*/g, '<strong>$1</strong>'))
    .join('');
  return { ...post, content };
}
