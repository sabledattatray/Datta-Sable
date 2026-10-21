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
// Verified corrections for exact legacy passages. Distinct future prose is kept.
const factualParagraphCorrections = new Map([
  ["OneLake is built on top of Azure Data Lake Storage Gen2 (ADLS Gen2). This means it inherits Azure's enterprise-grade storage characteristics: 99.9999999999% (12 nines) durability, geo-redundant replication options, 10Gbps+ throughput, and hierarchical namespace support for efficient file system operations.",
    '<p>OneLake is built on Azure Data Lake Storage. That architectural relationship does not establish a universal durability percentage, throughput guarantee, or replication configuration for every Fabric workload. Verify the applicable service documentation and your configuration before making an availability or performance commitment. See <a href="https://learn.microsoft.com/en-us/fabric/onelake/onelake-overview">Microsoft’s OneLake overview</a>.</p>'],
  ['A government statistics agency migrated national economic data reporting to Fabric with a 99.9% availability requirement. Rather than one F64, they run two F32 capacities in active-active configuration — Production Workspace on Capacity A, standby on Capacity B. If Capacity A experiences unexpected throttling, an administrator reassigns the public reporting workspace to Capacity B within minutes via the Fabric Admin Portal, without data loss (since data lives in OneLake, not in the capacity).',
    '<p>Illustrative resilience planning exercise: compare a single-capacity deployment with a design that has an independently tested recovery path. Workspace reassignment is not itself evidence of active-active availability, zero interruption, or zero data loss. Define recovery objectives, supported service behavior, permissions, regional constraints, and a representative failure test before relying on the design. This is a hypothetical exercise, not a verified government engagement.</p>'],
]);
export function correctEditorialContent<T extends { slug: string; content?: string | null }>(post: T): T {
  post = applyEditorialRevision(post);
  let content = post.content;
  if (!content) return post;
  content = content.replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi,
    paragraph => factualParagraphCorrections.get(normalize(paragraph)) || paragraph);
  content = content.replace(
    'Yes, advanced AI capabilities like Copilot, Fabric IQ routing, and Data Agents require a Fabric F64 capacity or higher in 2026.',
    'Eligibility differs by feature. Copilot can qualify on paid F2 or higher, subject to region, tenant settings, permissions, and feature requirements. Do not use the F64 organizational free-viewer threshold as a blanket AI requirement. Check the current documentation for each feature, starting with <a href="https://learn.microsoft.com/en-us/fabric/fundamentals/copilot-fabric-overview">Microsoft’s Copilot overview</a>.');
  content = content.replace(
    'The Fabric Trial provides a shared capacity pool — you share compute resources with other trial users and performance is not guaranteed. A purchased F2 capacity is a dedicated capacity — you have exclusive access to 2 CUs with SLA-backed performance guarantees. For any meaningful testing or development work, a purchased F2 is strongly preferable to the shared trial.',
    'The Fabric trial is a time-limited capacity with specific feature and capacity conditions; it should not be described as the Power BI shared-capacity model. Check your assigned trial size and current restrictions, including AI-feature restrictions, in <a href="https://learn.microsoft.com/en-us/fabric/fundamentals/fabric-trial">Microsoft’s trial documentation</a>. Compare a paid capacity using the same workload and the applicable offer terms rather than assuming a purchased F2 guarantees a particular performance result.');
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
