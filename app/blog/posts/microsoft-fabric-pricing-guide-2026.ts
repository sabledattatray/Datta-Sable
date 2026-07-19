export const microsoftFabricPricingGuide2026Post = {
  id: "microsoft-fabric-pricing-guide-2026",
  slug: "microsoft-fabric-pricing-guide-2026",
  title: "Microsoft Fabric Pricing Explained (2026): Complete Guide to F-SKUs, Capacity Planning, Cost Optimization & Enterprise Sizing",
  category: "Architecture & BI",
  excerpt: "The most comprehensive Microsoft Fabric pricing guide available. Master F-SKUs, Capacity Units, cost optimization, Reserved Capacity, enterprise sizing, and FinOps governance for 2026.",
  date: "July 19, 2026",
  readTime: 55,
  color: "var(--accent)",
  icon: "💰",
  image: "/images/blog/microsoft-fabric-pricing-guide-2026-f-sku-capacity-planning.webp",
  tags: ["Microsoft Fabric", "Fabric Pricing", "Capacity Units", "F-SKU", "Cost Optimization", "FinOps", "Capacity Planning", "Power BI", "Enterprise"],
  published: true,
  blocks: {
    focusedKeyword: "Microsoft Fabric Pricing"
  },
  content: `<!-- BREADCRUMB_START -->
<div class="breadcrumb-container" style="font-family: monospace; font-size: 0.8rem; margin-bottom: 2rem; color: var(--muted); border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
  <a href="/" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Home</a> &gt; 
  <a href="/blog" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Blog</a> &gt; 
  <a href="/blog/microsoft-fabric" style="color: var(--accent); text-decoration: none; font-weight: 600;">Microsoft Fabric Hub</a> &gt; 
  <span style="color: var(--text);">Microsoft Fabric Pricing Explained (2026): Complete Guide to F-SKUs, Capacity Planning, Cost Optimization & Enterprise Sizing</span>
</div>
<!-- BREADCRUMB_END -->
<div class="featured-snippet" style="background: rgba(201, 243, 29, 0.05); padding: 1.5rem; border-left: 4px solid var(--accent); border-radius: 0 8px 8px 0; margin-bottom: 2rem; font-size: 1.05rem; line-height: 1.8; color: var(--text);">
  <p><strong>Microsoft Fabric Pricing in 2026</strong> is built on a single, capacity-based model: you purchase a pool of Capacity Units (CUs), assign it to a workspace, and every workload — Spark, SQL, Power BI, Data Factory, Real-Time Intelligence — draws from that same shared pool. This guide covers every F-SKU from F2 to F2048, shows you how to estimate cost for your specific workload profile, and gives you the FinOps playbook enterprises use to cut Fabric spend by 30–60%.</p>
</div>

<div class="blog-toc" style="padding: 1.5rem 2rem !important; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 2.5rem;">
  <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 1.25rem !important; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text);">Table of Contents</h4>
  <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.25rem 1.5rem; list-style-type: none !important; padding: 0 !important; margin: 0 !important; font-size: 0.85rem; line-height: 1.6; color: var(--muted);">
    <li><a href="#executive-summary" style="color: var(--muted); text-decoration: none;">1. Executive Summary</a></li>
    <li><a href="#quick-decision-table" style="color: var(--muted); text-decoration: none;">2. Quick Decision Table</a></li>
    <li><a href="#pricing-model-history" style="color: var(--muted); text-decoration: none;">3. Understanding Fabric Pricing</a></li>
    <li><a href="#capacity-units-explained" style="color: var(--muted); text-decoration: none;">4. Capacity Units Explained</a></li>
    <li><a href="#complete-sku-breakdown" style="color: var(--muted); text-decoration: none;">5. Complete F-SKU Breakdown</a></li>
    <li><a href="#pricing-examples" style="color: var(--muted); text-decoration: none;">6. Pricing Examples</a></li>
    <li><a href="#capacity-planning" style="color: var(--muted); text-decoration: none;">7. Capacity Planning Framework</a></li>
    <li><a href="#enterprise-scenarios" style="color: var(--muted); text-decoration: none;">8. Real Enterprise Scenarios</a></li>
    <li><a href="#fabric-vs-pbi-premium" style="color: var(--muted); text-decoration: none;">9. Fabric vs Power BI Premium</a></li>
    <li><a href="#fabric-vs-synapse" style="color: var(--muted); text-decoration: none;">10. Fabric vs Synapse</a></li>
    <li><a href="#fabric-vs-databricks" style="color: var(--muted); text-decoration: none;">11. Fabric vs Databricks</a></li>
    <li><a href="#cost-optimization" style="color: var(--muted); text-decoration: none;">12. Cost Optimization</a></li>
    <li><a href="#fabric-finops" style="color: var(--muted); text-decoration: none;">13. Fabric FinOps</a></li>
    <li><a href="#capacity-monitoring" style="color: var(--muted); text-decoration: none;">14. Capacity Monitoring</a></li>
    <li><a href="#common-mistakes" style="color: var(--muted); text-decoration: none;">15. Common Mistakes</a></li>
    <li><a href="#faq" style="color: var(--muted); text-decoration: none;">16. FAQs</a></li>
    <li><a href="#conclusion" style="color: var(--muted); text-decoration: none;">17. Conclusion & Decision Tree</a></li>
  </ul>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="executive-summary" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">1. Executive Summary</h2>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><a href="/blog/microsoft-fabric-architecture-explained-2026" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Microsoft Fabric Architecture Guide">Microsoft Fabric</a> pricing is deceptively simple on the surface: you buy capacity, you use it, you pay for what you buy. In practice, getting this right requires a working understanding of how Capacity Units are consumed across seven distinct workload types simultaneously, how Microsoft's smoothing algorithm prevents short-duration bursts from immediately triggering throttling, and why a team that bought an F64 last year is now running out of CUs after adding three Power BI Semantic Models.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">I've designed Fabric platforms for enterprises across manufacturing, retail, banking, and healthcare over the past two years. The pricing and capacity questions are almost always the same: "We're paying $X per month — is that right? How many users can we support? Will adding another Spark workload break our dashboards?" This guide is the reference I wish had existed when I started these conversations.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Here is the high-level picture before we go deep:</p>

<ul style="line-height: 1.8; padding-left: 1.5rem; margin-bottom: 1.5rem; color: var(--muted);">
  <li><strong>Microsoft Fabric is a SaaS analytics platform</strong> that consolidates data engineering, data science, warehousing, real-time analytics, and Power BI under one roof with one storage layer (<a href="/blog/microsoft-fabric-onelake-architecture-guide" class="autolink" style="color: var(--accent); text-decoration: underline;" title="OneLake Architecture Explained">OneLake</a>) and one compute billing model (Capacity Units).</li>
  <li><strong>All compute workloads share a single CU pool.</strong> Spark jobs, SQL queries, Power BI report refreshes, Data Factory pipelines, and Real-Time Intelligence all draw from the same capacity pool you purchased.</li>
  <li><strong>F-SKUs range from F2 to F2048.</strong> F2 costs roughly $262/month and suits small PoCs. F2048 costs around $268,000/month and serves the largest global enterprises. Most production deployments land between F8 and F128.</li>
  <li><strong>Storage is billed separately</strong> at approximately $0.023 per GB/month — usually a rounding error compared to compute costs.</li>
  <li><strong>Reserved Capacity (1-year or 3-year)</strong> saves 37–52% over pay-as-you-go rates — the single most impactful cost lever available.</li>
  <li><strong>Pausing and resuming capacity</strong> eliminates costs during off-hours, making pay-as-you-go viable for environments with predictable usage patterns.</li>
</ul>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>Who this guide is for:</strong> Data engineers estimating their first Fabric deployment, Power BI developers migrating from Premium Per User, solution architects making SKU recommendations to a CTO, enterprise architects designing multi-workspace governance frameworks, FinOps practitioners building showback reports, IT managers evaluating total cost of ownership versus Databricks or Snowflake, and candidates preparing for <a href="/blog/dp-600-study-guide-2026" class="autolink" style="color: var(--accent); text-decoration: underline;" title="DP-600 Study Guide">DP-600</a> or DP-700 exams who need to understand the capacity model deeply.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>What you'll be able to do after reading this:</strong> Choose the right SKU for your workload profile, build a bottom-up cost estimate for a stakeholder presentation, configure Reserved Capacity to cut costs by half, monitor capacity utilization without guessing, and avoid the 25 most common mistakes that cause enterprises to overspend or underperform on Fabric.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="quick-decision-table" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">2. Quick Decision Table</h2>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">If you need an immediate orientation before reading the rest of this guide, this table maps company size and workload type to the most common starting SKU. These are starting points — your actual requirements may be higher or lower depending on workload intensity.</p>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Company Size / Use Case</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Recommended SKU</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Est. BI Users</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Est. Monthly Cost (PAYG)</th>
        <th style="padding: 12px; text-align: left; color: var(--text); font-weight: 600;">Typical Workloads</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Proof of Concept / Learning</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--accent); font-weight: bold;">F2</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">1–5</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">~$262</td>
        <td style="padding: 12px; color: var(--muted);">Light Lakehouse, small notebooks, basic Power BI reports</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Small Team / Startup</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--accent); font-weight: bold;">F4 / F8</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">5–25</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">$524 – $1,048</td>
        <td style="padding: 12px; color: var(--muted);">Medallion pipelines, Dataflows Gen2, daily refreshes, 3–5 dashboards</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Mid-Market Company</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--accent); font-weight: bold;">F16 / F32</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">25–150</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">$2,097 – $4,194</td>
        <td style="padding: 12px; color: var(--muted);">Multi-domain Lakehouse, Spark ETL, Warehouse, real-time dashboards</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Enterprise (Division level)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--accent); font-weight: bold;">F64</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">150–500</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">~$8,388</td>
        <td style="padding: 12px; color: var(--muted);">Full Medallion, Mirroring, <a href="/blog/power-bi-direct-lake-performance-tuning-fabric" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Direct Lake Explained">Direct Lake</a> large models, streaming</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Large Enterprise</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--accent); font-weight: bold;">F128 / F256</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">500–2,000</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">$16,776 – $33,553</td>
        <td style="padding: 12px; color: var(--muted);">Multi-domain platform, concurrent Spark + SQL + heavy BI</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Global Enterprise</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--accent); font-weight: bold;">F512+</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">2,000+</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">$67,107+</td>
        <td style="padding: 12px; color: var(--muted);">Global multi-region, high concurrency, AI, Real-Time Intelligence</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Power BI-only migration from PPU</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--accent); font-weight: bold;">F4 / F8</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">10–100</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">$524 – $1,048</td>
        <td style="padding: 12px; color: var(--muted);">Power BI semantic models, scheduled refreshes, embedded reporting</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><em>Note: Prices shown are approximate US East pay-as-you-go rates. Regional pricing varies. Apply a 1-year Reserved Capacity discount of approximately 37% to get the reserved price. Verify all pricing on the Azure pricing calculator before procurement decisions.</em></p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="pricing-model-history" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">3. Understanding Microsoft Fabric Pricing</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">3.1 The History: How We Got Here</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">To understand why Fabric pricing works the way it does, you need to understand the mess it replaced. Before Fabric's general availability in November 2023, a typical enterprise Microsoft analytics stack had at least six independently billed components: Azure Data Factory (pipeline runs billed per activity), Azure Data Lake Storage Gen2 (billed per GB and per transaction), Azure Synapse Analytics (dedicated SQL pool billed per DWU-hour plus Spark pool billing per vCore-hour), Azure Analysis Services or Power BI Premium (billed per node tier), and Azure Monitor (for logs).</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">These services had different billing APIs, different cost centers, and different utilization patterns. A FinOps team trying to answer "how much did the quarterly financial report cost us to run?" had to join cost records across six services and account for indirect costs like storage reads from Data Factory, which billed differently than storage reads from Synapse. The result was that most teams had no idea what their analytics infrastructure actually cost at a workload level.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><a href="/blog/microsoft-fabric-architecture-explained-2026" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Microsoft Fabric architecture">Microsoft Fabric</a> changed this by introducing a single shared capacity pool model. You buy capacity measured in CUs. Every workload — regardless of whether it's a Spark notebook, a SQL query, a Power BI refresh, or a pipeline run — consumes from that same pool. The billing unit is the CU-second, and your monthly bill is a function of the SKU size you're running times the number of hours it runs.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">3.2 Capacity Model vs Consumption Model</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>Capacity Model (F-SKU):</strong> You provision a fixed-size capacity — an F8, an F64, an F256 — and pay for it by the hour regardless of whether workloads are running. This is analogous to renting a server rack: the cost is predictable and the performance ceiling is defined by the SKU. Most enterprises run on this model because predictable billing simplifies budgeting.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>Pay-as-you-go (Consumption) Model:</strong> Fabric also offers a consumption-based model for specific workloads (primarily Data Factory pipelines and certain Eventstream scenarios) where you pay per unit of work done rather than per hour of capacity. This is useful for workloads with highly variable volume — you're not paying for idle time. For most teams, the F-SKU capacity model is the right choice.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">3.3 Shared vs Dedicated Capacity</h3>

<ul style="line-height: 1.8; padding-left: 1.5rem; margin-bottom: 1.5rem; color: var(--muted);">
  <li><strong>Shared Capacity (Free Trial):</strong> Microsoft provides a 60-day free Fabric trial with a small shared capacity pool. Suitable for individual exploration only. Performance is not guaranteed, and it cannot be used for production workloads.</li>
  <li><strong>Dedicated Capacity (F-SKU):</strong> You purchase a capacity provisioned exclusively for your tenant. CUs are not shared with other customers. This is the model for all development, test, and production deployments beyond basic exploration.</li>
</ul>

<div style="background: rgba(201, 243, 29, 0.05); padding: 1.25rem; border-left: 4px solid var(--accent); border-radius: 0 8px 8px 0; margin: 1.5rem 0; font-size: 0.95rem; line-height: 1.6;">
  <strong>Architect's Note:</strong> In large enterprises with distinct organizational units (Finance, Operations, Marketing), a common pattern is to buy one capacity per domain rather than one shared capacity for the entire company. This gives each domain a guaranteed performance budget and a clean chargeback boundary. The tradeoff is that you lose the ability to burst across domains during off-peak periods for other domains.
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="capacity-units-explained" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">4. Capacity Units Explained</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">4.1 What Is a Capacity Unit?</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">A <strong>Capacity Unit (CU)</strong> is Microsoft's abstraction for compute resources in Fabric. Rather than exposing raw CPU cores, RAM, or Spark executor counts, Fabric expresses all compute as CUs — a normalized unit that accounts for both CPU and memory proportionally. An F8 capacity provides 8 CUs of concurrent compute. Every workload you run costs some number of CU-seconds. If the rate of consumption exceeds your capacity's available CU rate, Microsoft applies smoothing before throttling.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">4.2 Interactive vs Background Operations</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">One of the most important concepts in Fabric's CU model is the distinction between <strong>Interactive</strong> and <strong>Background</strong> operations. This affects how throttling behaves.</p>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Operation Type</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Examples</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Throttle Response</th>
        <th style="padding: 12px; text-align: left; color: var(--text); font-weight: 600;">User Impact</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">Interactive</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Power BI report loads, SQL queries (ad hoc), <a href="/blog/power-bi-direct-lake-performance-tuning-fabric" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Direct Lake performance tuning guide">Direct Lake</a> queries, notebook cell executions triggered by a user</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Requests are queued, then either served slowly or rejected with a 429 error if severe overload</td>
        <td style="padding: 12px; color: var(--muted);">Directly visible — report loads slowly or shows error</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">Background</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Scheduled Spark jobs, pipeline runs, scheduled Power BI refreshes, Dataflow Gen2 runs, OPTIMIZE/VACUUM operations</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Jobs are delayed (queued for future execution windows) rather than immediately throttled</td>
        <td style="padding: 12px; color: var(--muted);">Not immediately visible — data may be stale, pipeline finishes late</td>
      </tr>
    </tbody>
  </table>
</div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">4.3 The Smoothing Algorithm (Bursting)</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Microsoft Fabric does not enforce your capacity limit in real-time at the millisecond level. Instead, it uses a <strong>smoothing algorithm</strong> that averages CU consumption over a rolling window — typically 24 hours for background workloads and shorter windows for interactive operations.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">This means your capacity can legitimately burst above its nominal CU rate for short periods. An F8 running 8 CUs continuously can briefly absorb a 20 CU Spark job without immediately throttling, because the 24-hour smoothing window shows average utilization well below the 8 CU rate. The burst headroom depends on how much available CU "credit" has accumulated during quiet periods.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">When you exhaust the smoothing buffer — typically from sustained high utilization over many hours — background operations begin queuing first, and interactive operations are throttled second. Understanding this hierarchy is why adding one large scheduled Spark job can suddenly make Power BI dashboards slow: the Spark job has consumed the smoothing credit, so the next interactive Power BI query has no headroom.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">4.4 CU Consumption by Workload Type</h3>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Workload</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Typical CU Range</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Peak Duration</th>
        <th style="padding: 12px; text-align: left; color: var(--text); font-weight: 600;">Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Spark Notebook (small)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">4–16 CUs</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Minutes</td>
        <td style="padding: 12px; color: var(--muted);">&lt;10GB data, basic transformations</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Spark Notebook (large)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">32–256 CUs</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Hours</td>
        <td style="padding: 12px; color: var(--muted);">100GB+ data, complex joins, window functions</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Power BI Report Load</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">0.5–2 CUs</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Seconds</td>
        <td style="padding: 12px; color: var(--muted);">Direct Lake; higher for Import refresh</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Semantic Model Refresh</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">4–32 CUs</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Minutes</td>
        <td style="padding: 12px; color: var(--muted);">Import mode; Direct Lake framing is much lower</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Warehouse SQL Query</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">2–8 CUs</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Seconds–minutes</td>
        <td style="padding: 12px; color: var(--muted);">Per concurrent query; scales with data volume</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Data Factory Pipeline</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">1–8 CUs</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Minutes–hours</td>
        <td style="padding: 12px; color: var(--muted);">Copy Activity + orchestration overhead</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Dataflow Gen2</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">2–16 CUs</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Minutes</td>
        <td style="padding: 12px; color: var(--muted);">Power Query M expressions; depends on source volume</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Eventstream / Real-Time</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">4–16 CUs (ongoing)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Continuous</td>
        <td style="padding: 12px; color: var(--muted);">Steady-state consumption while stream is active</td>
      </tr>
    </tbody>
  </table>
</div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">4.5 A Practical CU Budget Example</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">A retail analytics team with this daily workload profile:</p>

<ul style="line-height: 1.8; padding-left: 1.5rem; margin-bottom: 1rem; color: var(--muted);">
  <li>1 large Spark notebook at 6 AM, processing 50GB, 45 minutes, consuming ~40 CUs during that window</li>
  <li>5 Power BI reports refreshed on 4-hour schedules, max 2 run concurrently = ~16 CUs at peak</li>
  <li>20 report users active 9 AM–5 PM, ~1–2 CUs concurrent</li>
  <li>1 Dataflow Gen2 run every 2 hours, consuming ~6 CUs for 10 minutes</li>
</ul>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Peak CU demand during morning processing window: ~40 (Spark) + 16 (refreshes) + 2 (interactive) + 6 (Dataflow) = <strong>~64 CUs peak demand</strong>. An F32 would struggle at this peak. An F64 handles it comfortably. But because the Spark job runs only 45 minutes a day, the 24-hour smoothed average is much lower — an F32 with smoothing might absorb the burst without sustained throttling. The Capacity Metrics App tells you exactly how close you are to the limit.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="complete-sku-breakdown" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">5. Complete F-SKU Breakdown</h2>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Microsoft Fabric offers 11 capacity tiers, from F2 to F2048. Each doubles in CU count from the previous tier. Below is a detailed breakdown of each SKU with practical guidance on who should use it and what workloads it supports.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">F2 — The Exploration Tier</h3>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text); width: 200px;">CUs</td>
        <td style="padding: 10px 12px; color: var(--muted);">2 Capacity Units</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Est. PAYG Monthly</td>
        <td style="padding: 10px 12px; color: var(--muted);">~$262/month (US East)</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Reserved 1-Year</td>
        <td style="padding: 10px 12px; color: var(--muted);">~$165/month (~37% saving)</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Direct Lake Row Limit</td>
        <td style="padding: 10px 12px; color: var(--muted);">~300M rows per table</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Typical BI Users</td>
        <td style="padding: 10px 12px; color: var(--muted);">1–5 (non-concurrent)</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Who should use F2:</strong> Individual developers building proofs of concept, students preparing for <a href="/blog/dp-600-study-guide-2026" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Fabric Analytics Engineer exam preparation">DP-600</a> or DP-700 who need a real Fabric environment, small teams evaluating the platform.</p>
<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>What works well:</strong> Individual Spark notebooks on small datasets under 5GB, basic Lakehouse exploration, Dataflows Gen2 on small sources, a few Power BI reports with lightweight data models.</p>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>What doesn't work:</strong> Any concurrent workloads, large Spark jobs, production pipelines with SLA requirements, datasets over 300M rows in Direct Lake, more than one or two simultaneous report users.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">F4 — The Small Team Tier</h3>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text); width: 200px;">CUs</td>
        <td style="padding: 10px 12px; color: var(--muted);">4 Capacity Units</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Est. PAYG Monthly</td>
        <td style="padding: 10px 12px; color: var(--muted);">~$524/month</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Reserved 1-Year</td>
        <td style="padding: 10px 12px; color: var(--muted);">~$330/month</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Direct Lake Row Limit</td>
        <td style="padding: 10px 12px; color: var(--muted);">~300M rows per table</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Typical BI Users</td>
        <td style="padding: 10px 12px; color: var(--muted);">5–15 (light usage)</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Who should use F4:</strong> Small startups with a single data engineer and a handful of analysts. Development environments for teams whose production runs on F16+. Power BI deployments migrating from Premium Per User with light usage patterns.</p>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>What works well:</strong> A simple <a href="/blog/microsoft-fabric-medallion-architecture-guide" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Microsoft Fabric Medallion Architecture Guide">Medallion pipeline</a> with daily batch processing, 2–3 Dataflows Gen2, 5–10 Power BI reports with up to 10 concurrent users, a basic Warehouse with T-SQL queries for small team reporting.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">F8 — The Development and SMB Production Tier</h3>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text); width: 200px;">CUs</td>
        <td style="padding: 10px 12px; color: var(--muted);">8 Capacity Units</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Est. PAYG Monthly</td>
        <td style="padding: 10px 12px; color: var(--muted);">~$1,048/month</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Reserved 1-Year</td>
        <td style="padding: 10px 12px; color: var(--muted);">~$661/month</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Direct Lake Row Limit</td>
        <td style="padding: 10px 12px; color: var(--muted);">~1 billion rows per table</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Typical BI Users</td>
        <td style="padding: 10px 12px; color: var(--muted);">15–40 (moderate usage)</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Who should use F8:</strong> Small-to-medium companies with 1–2 data engineers and 20–40 business users. Microsoft Partners building customer PoCs. Teams migrating from Power BI Premium P1 with moderate analytical workloads.</p>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>What works well:</strong> Full <a href="/blog/microsoft-fabric-medallion-architecture-guide" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Medallion architecture bronze-silver-gold framework">Medallion Architecture</a>, Spark notebooks processing up to 50GB datasets, 10–15 Power BI reports with scheduled refreshes, a Fabric Warehouse with concurrent SQL users, basic Mirroring from a single Azure SQL source.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">F16 — The Mid-Market Tier</h3>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text); width: 200px;">CUs</td>
        <td style="padding: 10px 12px; color: var(--muted);">16 Capacity Units</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Est. PAYG Monthly</td>
        <td style="padding: 10px 12px; color: var(--muted);">~$2,097/month</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Reserved 1-Year</td>
        <td style="padding: 10px 12px; color: var(--muted);">~$1,322/month</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Direct Lake Row Limit</td>
        <td style="padding: 10px 12px; color: var(--muted);">~3 billion rows per table</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Typical BI Users</td>
        <td style="padding: 10px 12px; color: var(--muted);">40–100 (moderate)</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>Who should use F16:</strong> Mid-market companies with multiple data engineering and analytics teams sharing a platform. Organizations running moderately complex Spark ETL alongside active Power BI usage during business hours. Teams that find F8 is being consistently throttled at peak but don't need a full F32.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">F32 — The Serious Production Tier</h3>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text); width: 200px;">CUs</td>
        <td style="padding: 10px 12px; color: var(--muted);">32 Capacity Units</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Est. PAYG Monthly</td>
        <td style="padding: 10px 12px; color: var(--muted);">~$4,194/month</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Reserved 1-Year</td>
        <td style="padding: 10px 12px; color: var(--muted);">~$2,644/month</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Direct Lake Row Limit</td>
        <td style="padding: 10px 12px; color: var(--muted);">~6 billion rows per table</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Typical BI Users</td>
        <td style="padding: 10px 12px; color: var(--muted);">100–200</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>Who should use F32:</strong> Growing enterprises with active data engineering pipelines and a meaningful Power BI user base. Organizations with multi-domain Lakehouse architecture. Retail and logistics companies with daily batch plus continuous monitoring workloads. A manufacturing company with 150 analysts, 8 Spark pipelines running overnight, and 40 reports accessed during shift changes fits comfortably on F32.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">F64 — The Enterprise Standard</h3>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text); width: 200px;">CUs</td>
        <td style="padding: 10px 12px; color: var(--muted);">64 Capacity Units</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Est. PAYG Monthly</td>
        <td style="padding: 10px 12px; color: var(--muted);">~$8,388/month</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Reserved 1-Year</td>
        <td style="padding: 10px 12px; color: var(--muted);">~$5,285/month</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Direct Lake Row Limit</td>
        <td style="padding: 10px 12px; color: var(--muted);">Unlimited (Enterprise)</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Typical BI Users</td>
        <td style="padding: 10px 12px; color: var(--muted);">200–600</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Why F64 is the enterprise standard:</strong> F64 is the first tier that removes Direct Lake row limits, provides meaningful Spark parallelism for production data engineering, and can sustain 400–600 concurrent report users during peak hours. It's also where the Reserved Capacity math becomes compelling: at ~$5,285/month with a 1-year reservation, F64 costs far less than the equivalent Power BI Premium P2 + Synapse Spark + ADLS Gen2 stack that often runs $12,000–$18,000/month.</p>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>Who should use F64:</strong> Division-level analytics platforms at large enterprises, Microsoft Partners building managed service offerings, healthcare organizations processing large clinical datasets, financial institutions running daily batch plus continuous reporting.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">F128, F256, F512, F1024, and F2048</h3>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--text);">SKU</th>
        <th style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--text);">CUs</th>
        <th style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--text);">PAYG/Month</th>
        <th style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--text);">Reserved 1-Yr</th>
        <th style="padding: 10px 12px; color: var(--text);">Typical Users</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">F128</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">128</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$16,776</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$10,570</td>
        <td style="padding: 10px 12px; color: var(--muted);">600–1,500</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">F256</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">256</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$33,553</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$21,139</td>
        <td style="padding: 10px 12px; color: var(--muted);">1,500–3,000</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">F512</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">512</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$67,107</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$42,278</td>
        <td style="padding: 10px 12px; color: var(--muted);">3,000–7,000</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">F1024</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">1,024</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$134,214</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$84,555</td>
        <td style="padding: 10px 12px; color: var(--muted);">7,000–15,000</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">F2048</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">2,048</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$268,428</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$169,110</td>
        <td style="padding: 10px 12px; color: var(--muted);">15,000+</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">These tiers are for large enterprises running enterprise-wide Fabric platforms, organizations with heavy Spark workloads alongside high-concurrency reporting, and companies with significant Real-Time Intelligence requirements. At F128+, the architecture conversation shifts from "will this fit in our capacity?" to "how do we partition workloads across capacities to isolate critical workloads from development noise?" At these scales, the procurement process typically involves Enterprise Agreement negotiations with Microsoft, with additional volume discounts of 15–25% beyond published reserved rates.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="pricing-examples" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">6. Pricing Examples: Real-World Cost Calculations</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">Example 1: Startup Analytics Team</h3>
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 1.5rem 0;">
  <p style="margin-bottom: 0.75rem; color: var(--text); font-weight: 600;">SaaS startup, 8 employees, one data analyst, basic BI needs</p>
  <ul style="line-height: 1.8; padding-left: 1.5rem; color: var(--muted); margin-bottom: 0.75rem;">
    <li>5 Power BI dashboards, 5 users, daily refresh</li>
    <li>One Lakehouse ingesting from Salesforce and PostgreSQL via Dataflow Gen2</li>
    <li>No Spark workloads — Dataflows Gen2 only</li>
  </ul>
  <p style="margin: 0; color: var(--accent); font-weight: bold;">Recommended: F4 | Reserved 1-Year: ~$330/month | Storage: ~$2/month | Total: ~$332/month</p>
</div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">Example 2: Regional Retail Company</h3>
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 1.5rem 0;">
  <p style="margin-bottom: 0.75rem; color: var(--text); font-weight: 600;">250 stores, 80 report users, 3 data engineers</p>
  <ul style="line-height: 1.8; padding-left: 1.5rem; color: var(--muted); margin-bottom: 0.75rem;">
    <li>Full Medallion Architecture with 2 Spark notebooks running nightly (2 hours each), 30 Power BI reports refreshed 4x daily, 50 concurrent users at midday, hourly pipeline from ERP, 100GB storage</li>
  </ul>
  <p style="margin-bottom: 0.5rem; color: var(--text); font-weight: 600;">Cost: F32 Reserved (~$2,644) + Storage ($2.30) = <span style="color: var(--accent);">~$2,646/month</span></p>
  <p style="margin: 0; color: var(--muted); font-size: 0.9rem;">Equivalent legacy cost (ADLS + Synapse + PBI Premium P1 + ADF): ~$6,500/month. Fabric saves ~60%.</p>
</div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">Example 3: Mid-Size Bank</h3>
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 1.5rem 0;">
  <p style="margin-bottom: 0.75rem; color: var(--text); font-weight: 600;">Regional bank, 400 analysts, compliance-heavy, 3 domains</p>
  <ul style="line-height: 1.8; padding-left: 1.5rem; color: var(--muted); margin-bottom: 0.75rem;">
    <li>Mirroring from Azure SQL and Cosmos DB, 8 Spark notebooks daily, 60 Power BI reports, 300 active business-hours users, Real-Time Intelligence for fraud monitoring, 1TB storage</li>
  </ul>
  <p style="margin: 0; color: var(--accent); font-weight: bold;">F64 Reserved (~$5,285) + Storage ($23) = ~$5,308/month</p>
</div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">Example 4: Global Manufacturing Enterprise</h3>
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 1.5rem 0;">
  <p style="margin-bottom: 0.75rem; color: var(--text); font-weight: 600;">50 plants, 1,500 analysts, 3 regions (Europe + APAC + Americas)</p>
  <ul style="line-height: 1.8; padding-left: 1.5rem; color: var(--muted); margin-bottom: 0.75rem;">
    <li>30 Spark notebooks nightly processing 500GB+ IoT sensor data, 200+ Power BI reports, 1,200 concurrent global users, streaming telemetry from 50,000 sensors, 10TB storage per region</li>
  </ul>
  <p style="margin-bottom: 0.5rem; color: var(--text); font-weight: 600;">Architecture: F256 per region (3 regions) + F16 Dev per region:</p>
  <p style="margin: 0; color: var(--accent); font-weight: bold;">3 × $21,139 + 3 × $1,322 + Storage ($690) = ~$68,073/month</p>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="capacity-planning" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">7. Capacity Planning Framework</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">7.1 The Five-Factor Sizing Framework</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Use these five factors to estimate your capacity need. Score each factor and sum to get an approximate CU target:</p>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Factor</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Low</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Medium</th>
        <th style="padding: 12px; text-align: left; color: var(--text); font-weight: 600;">High</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Concurrent BI Users (peak hour)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">&lt;25 → 2–4 CU</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">25–100 → 8–16 CU</td>
        <td style="padding: 12px; color: var(--muted);">100–500 → 32–64 CU</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Spark / Data Engineering</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">None/light → 0–4 CU</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Daily batch ≤50GB → 8–16 CU</td>
        <td style="padding: 12px; color: var(--muted);">Daily batch &gt;50GB or concurrent → 32–128 CU</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Semantic Model Refreshes</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">1–5 models, daily → 2–4 CU</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">5–20 models, 4x daily → 8–16 CU</td>
        <td style="padding: 12px; color: var(--muted);">20+ models, hourly → 16–32 CU</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Warehouse / SQL Workloads</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">None → 0 CU</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">1–10 concurrent queries → 4–8 CU</td>
        <td style="padding: 12px; color: var(--muted);">10+ concurrent queries → 16–32 CU</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Real-Time / Streaming</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">None → 0 CU</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Low-volume Eventstream → 4–8 CU</td>
        <td style="padding: 12px; color: var(--muted);">High-volume streaming + Eventhouse → 16–64 CU</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Sum your five CU estimates and add a <strong>30% buffer</strong> for growth and unexpected bursts, then round up to the next F-SKU. This gives you a starting point — the Capacity Metrics App will tell you within 2–4 weeks whether you've sized correctly.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">7.2 Estimating User Capacity</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">What matters is peak concurrency — how many users are actively loading or interacting with reports at the same time. In most enterprise environments, only 15–25% of total licensed users are active at peak hour. A 1,000-user organization typically has 150–250 concurrent users at its busiest time. For Direct Lake semantic models, each report load triggers a framing operation consuming 0.5–2 CUs for a few seconds. Under very high concurrency (300+ simultaneous loads), the aggregate CU demand spikes significantly. An F64 comfortably handles 400–600 users during peak hour with well-optimized semantic models.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">7.3 Storage Planning</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><a href="/blog/microsoft-fabric-onelake-architecture-guide" class="autolink" style="color: var(--accent); text-decoration: underline;" title="OneLake data storage layout">OneLake</a> storage at ~$0.023/GB/month is usually a minor cost. However, poorly managed Delta tables accumulate old Parquet files from time-travel history, ballooning storage unexpectedly. Run <code style="font-family: monospace; background: var(--surface2); padding: 0.1rem 0.4rem; border-radius: 3px;">VACUUM</code> with a 7–30 day retention window to keep storage predictable. V-Ordered Parquet files achieve 20–40% better compression than unoptimized Parquet, directly reducing storage costs.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="enterprise-scenarios" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">8. Real Enterprise Scenarios</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">8.1 Manufacturing: IoT + ERP Analytics</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">A European automotive parts manufacturer deployed Fabric to unify IoT sensor data from 12 plants with SAP ERP data. Three domains: Manufacturing Quality (sensor telemetry), Finance (ERP cost data), and Supply Chain. One F64 for Production, one F16 for Dev/Test. The manufacturing quality domain ingests 200,000 sensor readings per hour via Eventstream, routing to an Eventhouse for real-time anomaly detection. Nightly Spark jobs process the day's sensor archive into Silver Delta tables. The key cost optimization: 8 Spark notebooks running concurrently from 11 PM to 3 AM (when zero Power BI users are active) are absorbed within the F64's 24-hour smoothing window, so interactive report performance during business hours is never affected. <strong>Total cost: ~$6,619/month</strong>.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">8.2 Healthcare: Clinical Data Analytics</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">A regional hospital network across 8 facilities needed a HIPAA-compliant analytics platform. They chose F32 with separate workspaces for Clinical Operations (PHI data, restricted) and Research (de-identified data, broader access). OneLake Data Access Roles enforce table-level access control — research analysts can only see de-identified Silver tables, not raw PHI Bronze data. Mirroring from Azure SQL Database provides near-real-time patient census data without custom ETL. <strong>Total cost: ~$3,351/month</strong>.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">8.3 Retail: High-Concurrency BI</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">A national grocery chain needed to replace a fragile SSAS + SSRS stack serving 450 store managers. The Monday morning peak — all 450 managers loading the weekly dashboard between 8 AM and 9 AM — required F64, validated through load testing. The F32 they initially considered reached 95% CU utilization and throttled 15% of users. Cost optimization: from Tuesday through Sunday, peak drops to 50–80 users. They dynamically resize to F16 on Tuesday morning and back to F64 Sunday night using the Fabric API, saving approximately 30% of monthly capacity cost while maintaining Monday SLAs.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">8.4 Banking: Multi-Domain FinOps Platform</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">A mid-size bank with $8B AUM deployed Fabric as a unified risk and finance analytics platform on a single F128 capacity with 6 domains, replacing separate Teradata DW, Oracle Analytics, and managed Databricks. The FinOps team implemented full chargeback: workspace CU consumption is allocated back to business units monthly based on Capacity Metrics App data. The Risk team's heavy Spark workloads made them the largest cost center — they voluntarily moved Monte Carlo simulation jobs to 2 AM to reduce their chargeback allocation.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">8.5 Government: High-Availability Reporting</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">A government statistics agency migrated national economic data reporting to Fabric with a 99.9% availability requirement. Rather than one F64, they run two F32 capacities in active-active configuration — Production Workspace on Capacity A, standby on Capacity B. If Capacity A experiences unexpected throttling, an administrator reassigns the public reporting workspace to Capacity B within minutes via the Fabric Admin Portal, without data loss (since data lives in OneLake, not in the capacity).</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="fabric-vs-pbi-premium" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">9. Microsoft Fabric vs Power BI Premium</h2>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Dimension</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Power BI Premium (P-SKU)</th>
        <th style="padding: 12px; text-align: left; color: var(--text); font-weight: 600;">Microsoft Fabric (F-SKU)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Compute model</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">BI-only compute pool (v-cores)</td>
        <td style="padding: 12px; color: var(--muted);">Unified CU pool for all workloads</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Spark / Data Engineering</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">❌ Not included</td>
        <td style="padding: 12px; color: var(--muted);">✅ Included in same CU pool</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Data Warehouse</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">❌ Not included</td>
        <td style="padding: 12px; color: var(--muted);">✅ Included</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Real-Time Intelligence</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">❌ Not included</td>
        <td style="padding: 12px; color: var(--muted);">✅ Included</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Direct Lake mode</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">✅ (via Fabric workspace)</td>
        <td style="padding: 12px; color: var(--muted);">✅ Native</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">P1 equivalent PAYG monthly</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">~$4,995/month</td>
        <td style="padding: 12px; color: var(--muted);">F64 ~$8,388 (but includes Spark + Warehouse + RTI)</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">P1 Reserved 1-year</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">~$4,161/month</td>
        <td style="padding: 12px; color: var(--muted);">F64 ~$5,285/month (full platform)</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Roadmap</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">New features shipping exclusively to Fabric F-SKUs</td>
        <td style="padding: 12px; color: var(--muted);">Active development, all new features land here first</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">For organizations on <strong>Power BI Premium Per User (PPU)</strong> at $20/user/month: at 50+ users, a Fabric F8 Reserved ($661/month) is more cost-effective than PPU ($1,000/month for 50 users) while providing Spark, Warehouse, and Lakehouse capabilities that PPU doesn't offer.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="fabric-vs-synapse" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">10. Microsoft Fabric vs Azure Synapse Analytics</h2>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Dimension</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Azure Synapse Analytics</th>
        <th style="padding: 12px; text-align: left; color: var(--text); font-weight: 600;">Microsoft Fabric</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">SQL Compute billing</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Per DWU (dedicated pool) or per TB scanned (serverless)</td>
        <td style="padding: 12px; color: var(--muted);">CU-based, shared with all workloads</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Spark billing</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Per vCore-hour (separate from SQL)</td>
        <td style="padding: 12px; color: var(--muted);">Same CU pool as everything else</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Storage</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">ADLS Gen2 (separate billing) + Synapse DW storage</td>
        <td style="padding: 12px; color: var(--muted);">OneLake ($0.023/GB/month, single storage)</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Typical enterprise cost (medium co)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">$8,000–$15,000/month (SQL + Spark + ADLS + PBI P1)</td>
        <td style="padding: 12px; color: var(--muted);">$3,000–$6,000/month (equivalent F64 Reserved + storage)</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Migration complexity</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">N/A (incumbent)</td>
        <td style="padding: 12px; color: var(--muted);">Medium — Spark notebooks port with minor changes; T-SQL largely compatible; ADF pipelines recreated in Fabric Data Factory</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">The direction of development is clear: every new data platform feature ships to Microsoft Fabric first. For new deployments in 2026, Fabric is the standard recommendation. For existing Synapse customers, migration timelines vary — simple Spark + SQL workloads can migrate in weeks; complex Dedicated SQL Pool architectures may take 6–12 months.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="fabric-vs-databricks" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">11. Microsoft Fabric vs Databricks</h2>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Dimension</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Databricks</th>
        <th style="padding: 12px; text-align: left; color: var(--text); font-weight: 600;">Microsoft Fabric</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Spark maturity</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Industry-leading. Databricks created Apache Spark; Photon engine delivers 2–4× better performance vs open-source Spark</td>
        <td style="padding: 12px; color: var(--muted);">Good. Fabric Spark is open-source Spark 3.x. Strong for most enterprise workloads but trails Photon for CPU-intensive transforms</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Power BI / BI integration</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Possible via Databricks SQL Warehouse + Power BI DirectQuery, but requires additional configuration and licensing</td>
        <td style="padding: 12px; color: var(--muted);">Native. Power BI Direct Lake is the most performant BI-on-lakehouse integration available anywhere</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">SaaS simplicity</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">PaaS — requires cluster management, instance types, autoscaling configuration, security group setup</td>
        <td style="padding: 12px; color: var(--muted);">SaaS — no cluster management, no instance types, no infrastructure configuration required</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Typical cost (F64-equivalent)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">$15,000–$25,000/month (Spark + SQL Warehouse + ADLS + PBI Premium)</td>
        <td style="padding: 12px; color: var(--muted);">$5,285/month (F64 Reserved includes everything)</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Best for</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Data science-heavy teams, MLOps-mature orgs, very large-scale Spark ETL (&gt;100TB daily), multi-cloud, deep Spark expertise</td>
        <td style="padding: 12px; color: var(--muted);">Microsoft-ecosystem orgs, Power BI-centric enterprises, teams needing SaaS simplicity, mixed BI + engineering, cost-sensitive deployments</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">A notable 2026 trend: enterprises running a <strong>Databricks + Fabric hybrid</strong>. Databricks handles large-scale ML training and complex Spark ETL, writing results as Delta tables to ADLS Gen2. Fabric shortcuts into those same Delta files via OneLake Shortcuts. Power BI Direct Lake queries the Databricks-managed Delta tables. This hybrid approach maximizes the strengths of both platforms.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="cost-optimization" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">12. Cost Optimization Strategies</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">12.1 Reserved Capacity — The #1 Lever</h3>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text);">SKU</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text);">PAYG/Month</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text);">1-Year Reserved</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text);">3-Year Reserved</th>
        <th style="padding: 12px; text-align: left; color: var(--text);">Annual Saving (1-yr)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">F8</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">$1,048</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">$661</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$504</td>
        <td style="padding: 10px 12px; color: var(--accent); font-weight: bold;">$4,644/year saved</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">F32</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">$4,194</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">$2,644</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$2,015</td>
        <td style="padding: 10px 12px; color: var(--accent); font-weight: bold;">$18,600/year saved</td>
      </tr>
      <tr>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">F64</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">$8,388</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">$5,285</td>
        <td style="padding: 10px 12px; border-right: 1px solid var(--border); color: var(--muted);">~$4,030</td>
        <td style="padding: 10px 12px; color: var(--accent); font-weight: bold;">$37,236/year saved</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>Recommended approach:</strong> Run on pay-as-you-go for 2–4 weeks in production to validate your SKU choice using the Capacity Metrics App. Once confident in the SKU, purchase a 1-year Reserved Capacity. Reserve only the SKU you run 24/7.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">12.2 Pause and Resume</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Fabric capacities can be paused via the Azure Portal, Fabric Admin Portal, or REST API. When paused, no compute charges accrue. All OneLake data persists — you continue paying storage charges only. For development capacities running only business hours: an F8 PAYG at $1,048/month 24/7 costs only ~$335/month when limited to 10 hours/day × 5 days/week. Use Azure Automation or Logic Apps to schedule pause/resume automatically.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">12.3 Workload Scheduling</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Scheduling is free. It costs nothing to move a pipeline from 9 AM to 3 AM. Heavy background operations (Spark jobs, large Dataflow Gen2 runs, OPTIMIZE/VACUUM) should run during hours when interactive users are inactive. For US companies, that's overnight. This single change eliminates throttling for many organizations without any capacity upgrade.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">12.4 Direct Lake vs Import Mode</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">A large semantic model refresh (100M rows, 15 tables) in Import mode might consume 20–30 CUs for 15–30 minutes, scheduled 4× daily. The equivalent Direct Lake framing operation typically consumes 2–5 CUs for 30–60 seconds — a 95%+ reduction. Migrating semantic models backed by Delta tables from Import to Direct Lake frequently reduces total capacity utilization enough to drop one SKU tier.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">12.5 Delta Optimization (V-Order, OPTIMIZE, VACUUM)</h3>
<ul style="line-height: 1.8; padding-left: 1.5rem; margin-bottom: 1.5rem; color: var(--muted);">
  <li><strong>V-Order:</strong> Applied automatically by Fabric engines during writes. Verify with <code style="font-family: monospace; background: var(--surface2); padding: 0.1rem 0.4rem; border-radius: 3px;">spark.conf.get("spark.sql.parquet.vorder.enabled")</code>. Without V-Order, Direct Lake query performance degrades significantly.</li>
  <li><strong>OPTIMIZE:</strong> Compacts small Parquet files. An unoptimized table with 10,000 files might take 10× more CUs to scan than the same data in 20 optimized files. Run weekly on frequently updated tables.</li>
  <li><strong>VACUUM:</strong> Removes Parquet files no longer referenced by the Delta log. Default 7-day retention is reasonable: <code style="font-family: monospace; background: var(--surface2); padding: 0.1rem 0.4rem; border-radius: 3px;">VACUUM table_name RETAIN 168 HOURS</code>.</li>
</ul>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">12.6 Workload Isolation with Multiple Capacities</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">At F64+ scale, splitting workloads across multiple smaller capacities provides isolation guarantees that a single large capacity cannot offer. Example: Production BI Capacity (F32) hosts only Power BI workspaces; Data Engineering Capacity (F32) hosts Lakehouse, Warehouse, Spark notebooks; Real-Time Capacity (F8) hosts Eventstream and Eventhouse. Engineers can run heavy jobs without impacting BI users. The premium over a single F64 is small (~$949/month more) but the SLA guarantees are invaluable for organizations with strict reporting availability requirements.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="fabric-finops" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">13. Fabric FinOps: Governance, Chargeback, and Cost Accountability</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">13.1 Establishing Visibility, Accountability, and Governance</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>Visibility:</strong> Use the Capacity Metrics App to track CU consumption per workspace, per workload type, and over time. Export this data to a Fabric Lakehouse and build a cost allocation dashboard in Power BI showing each team's monthly CU consumption as a percentage of total capacity.</p>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>Accountability:</strong> Assign workspace owners. Every workspace should have a named owner who receives monthly reports on their workspace's CU consumption and is responsible for optimizing underperforming workloads.</p>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><strong>Governance:</strong> Set workspace-level CU limits in the Fabric Admin Portal. A workspace exceeding its allocated CU budget triggers a notification (or in strict enforcement, throttling) before it impacts other workspaces.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">13.2 Showback vs Chargeback</h3>
<ul style="line-height: 1.8; padding-left: 1.5rem; margin-bottom: 1.5rem; color: var(--muted);">
  <li><strong>Showback:</strong> Calculate each team's share of monthly Fabric capacity cost and show them the number — but don't actually bill their budget. Creates awareness without requiring complex internal accounting. The right starting point for most organizations.</li>
  <li><strong>Chargeback:</strong> Each team's cost center is actually billed for their Fabric consumption share. Requires integration between Capacity Metrics App data and your financial management system. Appropriate once consumption patterns are stable.</li>
</ul>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">13.3 FinOps KPIs for Fabric</h3>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.88rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">KPI</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Definition</th>
        <th style="padding: 12px; text-align: left; color: var(--text); font-weight: 600;">Target</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Average CU Utilization</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Average CU consumption as % of capacity over 30 days</td>
        <td style="padding: 12px; color: var(--muted);">50–75% (headroom for bursts)</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Peak CU Utilization</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Maximum CU consumption in any 5-minute window</td>
        <td style="padding: 12px; color: var(--muted);">&lt;85% (above 90% triggers throttling risk)</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Throttle Incident Rate</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Number of throttling events per month</td>
        <td style="padding: 12px; color: var(--muted);">Zero for interactive workloads</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Cost Per Active User</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Monthly capacity cost / monthly active Power BI users</td>
        <td style="padding: 12px; color: var(--muted);">&lt;$30/user/month</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Reserved Coverage %</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">% of compute spend covered by Reserved Capacity</td>
        <td style="padding: 12px; color: var(--muted);">&gt;80% (minimize PAYG exposure)</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--text);">Off-Hours Idle Cost</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">% of monthly spend on non-production capacities during off-hours</td>
        <td style="padding: 12px; color: var(--muted);">&lt;5% (most off-hours dev capacity should be paused)</td>
      </tr>
    </tbody>
  </table>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="capacity-monitoring" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">14. Capacity Monitoring</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">14.1 The Fabric Capacity Metrics App</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">The <strong>Microsoft Fabric Capacity Metrics App</strong> is a Power BI app published by Microsoft that connects to your Fabric capacity's telemetry data. Every Fabric administrator should install it on day one. Go to AppSource, search "Microsoft Fabric Capacity Metrics," install, and connect to your capacity ID.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Key pages in the Metrics App:</p>
<ul style="line-height: 1.8; padding-left: 1.5rem; margin-bottom: 1.5rem; color: var(--muted);">
  <li><strong>Overview:</strong> 14-day CU utilization trend, total throttling events, capacity health score. The first page you open when investigating a performance complaint.</li>
  <li><strong>Multi-Metric Ribbon Chart:</strong> Interactive vs background CU consumption over time. When the interactive (orange) ribbon spikes, users are experiencing slowdowns.</li>
  <li><strong>Item Detail:</strong> Drills down to individual Fabric items and shows their CU consumption by operation. This is how you identify the "expensive" workloads.</li>
  <li><strong>Timepoint Explorer:</strong> Pick any specific minute and see exactly what was running on the capacity at that instant. Invaluable for root-cause analysis of throttling incidents.</li>
</ul>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">14.2 Monitoring via REST API</h3>
<pre style="background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; overflow-x: auto; margin: 2rem 0;"><code style="font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--accent); line-height: 1.5;">GET https://api.fabric.microsoft.com/v1/capacities/{capacityId}/operations

# Returns capacity operation history including:
# - Operation type (Interactive / Background)
# - Duration in seconds  
# - CU seconds consumed
# - Status (Completed / Throttled / Rejected)
# - Workspace and item that triggered the operation</code></pre>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Export this data nightly to a Fabric Lakehouse and build a Power BI report on top — this becomes your organization's custom FinOps dashboard with far more detail than the out-of-the-box Metrics App provides. Use a Fabric Reflex alert on a KQL query that fires when interactive CU utilization exceeds 80% for more than 10 consecutive minutes, posting a Teams message to the platform engineering channel.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="common-mistakes" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">15. The 25 Most Common Fabric Pricing Mistakes</h2>

<ol style="line-height: 1.85; padding-left: 1.5rem; color: var(--muted);">
  <li style="margin-bottom: 0.9rem;"><strong>Sizing by user count alone.</strong> Licensing headcount tells you nothing about concurrent CU demand. Peak concurrency, not total users, drives the sizing decision. 200 users who all open dashboards at 9:00 AM Monday need far more capacity than 200 users with staggered patterns.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Forgetting that Spark is a CU monster.</strong> A single Spark notebook processing 100GB can consume as many CUs in 2 hours as 500 Power BI report loads. Teams adding Spark ETL to an existing BI-only deployment without resizing are almost always shocked by throttling.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Committing to Reserved Capacity too early.</strong> Reserving an F64 before running 4 weeks in production often results in locking into the wrong SKU. One enterprise reserved an F128 after a PoC, then discovered their workloads comfortably fit in F64 — costing $60,000+ extra per year.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Running dev/test capacities 24/7 without pausing.</strong> Development workloads run during business hours. An F16 dev capacity running 24/7 costs ~$2,097/month. Running it only 50 hours/week reduces effective cost to ~$625/month. Implement pause automation on day one.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Not installing the Capacity Metrics App.</strong> You cannot optimize what you cannot see. Teams that skip the Metrics App fly blind, adding capacity whenever they experience throttling without understanding whether scheduling changes would have solved it.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Running OPTIMIZE and VACUUM during business hours.</strong> These background operations consume meaningful CUs. Running OPTIMIZE on a large table while users load dashboards is a common cause of unexplained afternoon slowdowns.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Keeping Power BI semantic models in Import mode unnecessarily.</strong> Any semantic model backed by Delta tables in a Lakehouse or Warehouse should be evaluated for Direct Lake migration. The CU savings from eliminating scheduled refreshes frequently justify the migration engineering effort within one billing cycle.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Ignoring V-Order on existing tables.</strong> Tables created before V-Order was standard are not V-Ordered. Running OPTIMIZE rewrites files with V-Order, dramatically improving Direct Lake query performance and reducing per-query CU consumption.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Assigning Real-Time Intelligence to the same capacity as batch and BI.</strong> Eventstream and Eventhouse are continuous consumers. Isolate streaming workloads on a dedicated capacity to prevent constant background noise from affecting interactive BI performance.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Misunderstanding the smoothing algorithm as "free bursting."</strong> Sustained overutilization depletes the smoothing credit and triggers throttling, often at the worst possible moment — Monday morning report loads after a weekend of pipeline backlog.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Not separating production and development workspaces across different capacities.</strong> A data engineer testing a Spark notebook that runs for 3 hours and consumes 80% of CUs directly degrades production dashboard performance for all users. Separation eliminates this risk.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Buying multiple small capacities when one larger is cheaper.</strong> Three F8 capacities (3 × $1,048 = $3,144/month PAYG) cost more than one F32 ($4,194/month) while providing less combined burst headroom. Consolidate small capacities where isolation isn't needed.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Using Dataflows Gen2 for large-scale transformations.</strong> Dataflows Gen2 is ideal for medium complexity Power Query M transformations. For high-volume transformations (50GB+), Spark notebooks are more CU-efficient because they parallelize across the cluster.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Not implementing efficient RLS on high-cardinality fact tables.</strong> Poorly designed row-level security that forces a full table scan on every report load multiplies the CU cost per query by 10–100×. Design RLS using fact-table-level filters on properly indexed columns.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Neglecting VACUUM and accumulating massive Delta storage.</strong> Without regular VACUUM runs, old Parquet files accumulate indefinitely. A table holding 100GB of current data might store 500GB of historical versions. At enterprise scale with hundreds of tables, this becomes significant unnecessary cost.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Treating Fabric storage as negligible without tracking growth.</strong> OneLake grows silently. Without monitoring, a team can accumulate terabytes of unneeded files over months. Implement a monthly storage growth report.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Skipping partition strategy on large Delta tables.</strong> An unpartitioned 1TB fact table queried by date range forces a full scan on every query. A table partitioned by year/month skips 95% of files for typical queries, reducing CU consumption proportionally.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Running interactive SQL queries directly against the Bronze Lakehouse.</strong> Bronze data contains raw, unoptimized files. Every analyst who queries Bronze instead of Silver or Gold generates expensive scans consuming disproportionate CUs and producing unreliable results.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Assuming all regions cost the same.</strong> Fabric pricing varies by Azure region by 15–30%. Multi-region deployments should calculate costs per region rather than using a single global figure.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Not tagging capacities with cost center information.</strong> Without resource tags, Azure Cost Management shows Fabric capacity charges as a single undifferentiated line item. Apply tags (cost-center, environment, domain) at provisioning time.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Building complex semantic models against Bronze Lakehouse data.</strong> Bronze data is raw and large. Gold-layer aggregated Delta tables are optimized for consumption. Always connect semantic models to Gold-layer data.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Ignoring the DirectLakeBehavior property.</strong> Left at the default (AlwaysFallback), a Direct Lake model that exceeds memory silently falls back to DirectQuery mode. Set to DirectLakeOnly and configure alerting on fallback events so you know when memory limits are being hit.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Not negotiating Enterprise Agreement pricing for large commitments.</strong> Published list prices are the starting point, not the final price. Enterprises with annual Fabric spend above $500,000 should engage their Microsoft account team for EA pricing — additional 10–25% discounts are available.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Over-architecting for current workload while ignoring growth.</strong> Building an F256 platform for a workload that currently needs F32 "to leave room for growth" ties up capital unnecessarily. Start right-sized, use the Metrics App to track trends, and scale up when utilization consistently approaches 70–80%.</li>
  <li style="margin-bottom: 0.9rem;"><strong>Not reading the OneLake storage billing details carefully.</strong> OneLake charges for data storage plus data transactions (reads and writes). For workloads with very high transaction volume, transaction charges can become non-negligible. Monitor both storage and transaction costs in Azure Cost Management monthly.</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="faq" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">16. Frequently Asked Questions</h2>

<h3 style="color: var(--text); font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">Pricing Basics</h3>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q1: How much does Microsoft Fabric cost?</strong><br/>Fabric capacity ranges from ~$262/month (F2, PAYG, US East) to ~$268,428/month (F2048). Most production deployments use F32–F128 at $4,194–$16,776/month PAYG or $2,644–$10,570/month with 1-year Reserved Capacity. Storage is additional at ~$0.023/GB/month.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q2: What is included in the Fabric capacity price?</strong><br/>The capacity price covers all compute workloads: Lakehouse (Spark), Data Warehouse (SQL), Data Factory (pipelines, Dataflows Gen2), Power BI (refresh, rendering), Data Science (notebooks, experiments), Real-Time Intelligence (Eventstream, Eventhouse, Reflex), and Mirroring. OneLake storage is billed separately.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q3: Do I need Power BI Premium licenses separately from Fabric?</strong><br/>No. F-SKU capacities include all Power BI Premium features. Users consuming content from a workspace on Fabric capacity need either a Microsoft Fabric Free license (for read-only report consumption) or a Power BI Pro/PPU license (for creating and publishing content).</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q4: What is the cheapest way to use Microsoft Fabric?</strong><br/>The Fabric Free Trial provides 60 days of access at no cost. After the trial, F2 at ~$262/month PAYG or ~$165/month with a 1-year reservation is the lowest cost entry. Pausing the capacity when not in use reduces effective monthly cost significantly.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q5: How does Fabric pricing compare to Databricks?</strong><br/>Fabric tends to be significantly less expensive for workloads that combine BI (Power BI) with data engineering (Spark). A comparable Databricks + Power BI Premium stack typically costs 2–3× more than the equivalent Fabric F-SKU for mid-market deployments.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q6: Is Microsoft Fabric billed monthly or annually?</strong><br/>Pay-as-you-go Fabric capacity is billed hourly and appears on your Azure monthly invoice. Reserved Capacity is paid upfront for 1 or 3 years (or monthly installments for 1-year reservations at some tiers). Storage is billed monthly based on consumption.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q7: Can I try Microsoft Fabric for free?</strong><br/>Yes. Microsoft offers a 60-day free Fabric trial providing access to all Fabric workloads on a shared trial capacity. For any production validation, a paid capacity is strongly recommended.</p>

<h3 style="color: var(--text); font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">Capacity Units and SKUs</h3>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q8: What is the difference between an F-SKU and a P-SKU?</strong><br/>P-SKUs (P1–P5) were Power BI Premium capacity tiers, now legacy. F-SKUs (F2–F2048) are the Microsoft Fabric capacity tiers that replace them. F-SKUs include all P-SKU features plus Spark, Warehouse, Lakehouse, Real-Time Intelligence, and OneLake access. Always buy F-SKU for new deployments.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q9: What does a Capacity Unit (CU) actually represent?</strong><br/>A CU is Microsoft's normalized compute unit for Fabric. It abstracts the underlying CPU, memory, and I/O resources into a single measurement. An F8 capacity provides 8 CUs of concurrent compute. Every workload consumes CUs at some rate — a Spark job might consume 32 CUs for 30 minutes; a Power BI report load might consume 1 CU for 2 seconds.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q10: Can I have multiple capacities in one Fabric tenant?</strong><br/>Yes. You can provision multiple F-SKU capacities within a single Fabric tenant. Each capacity operates independently with different CU pools and different billing. This is standard practice for large enterprises: separate Production and Development capacities, or separate capacities by geographic region or business domain.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q11: Can I assign multiple workspaces to the same capacity?</strong><br/>Yes, and this is the recommended approach. A single F64 capacity can host hundreds of workspaces. All workspaces share the 64 CU pool. The Capacity Metrics App shows the breakdown of CU consumption by workspace.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q12: What happens if my capacity runs out of CUs?</strong><br/>Microsoft applies a smoothing algorithm rather than a hard real-time limit. If sustained usage exceeds capacity limits, background operations are delayed first, then interactive operations are throttled. Users see slow reports or error messages; data engineers see delayed pipeline completions.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q13: Can I scale my Fabric capacity up or down?</strong><br/>Yes. You can change the SKU of a running Fabric capacity in the Azure Portal or Fabric Admin Portal. Scaling up takes a few minutes. Data in OneLake is unaffected by capacity changes. Reserved Capacity reservations are for a specific SKU — changing SKU breaks the reservation.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q14: What is the Direct Lake row limit for each SKU?</strong><br/>F2 and F4 support approximately 300M rows per table; F8 supports ~1 billion rows; F16 supports ~3 billion; F32 supports ~6 billion. F64 and above have no documented row limits. Organizations with tables above these limits need to either upgrade SKUs or implement table partitioning strategies.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q15: What is the minimum SKU for production use?</strong><br/>There is no hard minimum. In practice, most production deployments start at F8 for small teams and F32–F64 for enterprise deployments. F2 and F4 are best reserved for development, exploration, and PoC scenarios.</p>

<h3 style="color: var(--text); font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">Reserved Capacity and Cost Optimization</h3>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q16: How much do I save with Reserved Capacity?</strong><br/>Approximately 37% for a 1-year commitment and 52% for a 3-year commitment compared to pay-as-you-go. On an F64, this translates to over $37,000/year saved with a 1-year reservation.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q17: What happens if I need to cancel my Reserved Capacity?</strong><br/>Microsoft Reserved Capacity follows Azure Reservations policies. You can cancel with a prorated refund within the first 7 days. After 7 days, cancellation is generally not available. Exchanges (changing to a different SKU reservation) may be possible — check current Azure Reservations policy at time of purchase.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q18: Should I pause and resume capacity or keep it running 24/7?</strong><br/>For production capacities serving users in a single timezone, pausing overnight and on weekends saves 40–60% of monthly compute costs. For all non-production capacities, pause automation is strongly recommended. Use Azure Automation or Logic Apps to schedule pauses automatically.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q19: Can I reserve capacity at one SKU and run at a higher SKU during peak periods?</strong><br/>Reservations apply to a specific SKU. If you reserve F32 but scale up to F64 for a peak period, you pay PAYG rates for the F64 during that period. Some organizations use this deliberately: reserve the base SKU, scale up temporarily for seasonal peaks.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q20: Does Microsoft offer enterprise pricing discounts beyond Reserved Capacity?</strong><br/>Yes, through Microsoft Enterprise Agreements. Organizations with annual Azure committed spend above certain thresholds can negotiate additional discounts through their Microsoft account team — typically 10–25% below published reserved rates for large commitments.</p>

<h3 style="color: var(--text); font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">User Licensing</h3>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q21: Do report viewers need a Power BI Pro license with Fabric?</strong><br/>When a workspace is assigned to Fabric capacity, users who only view Power BI reports can use the free Microsoft Fabric license — no Pro license required. Report creators and people who publish content still need Power BI Pro, Premium Per User, or a Microsoft Fabric subscription.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q22: How many users can access Fabric without additional user licenses?</strong><br/>Unlimited read-only users can access content from a Fabric capacity with the free Microsoft Fabric license. The capacity itself is the billing mechanism — adding more viewers doesn't increase cost if the capacity is large enough. This is a significant advantage over PPU.</p>

<h3 style="color: var(--text); font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">Architecture and Technical</h3>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q23: Can I use Fabric without OneLake?</strong><br/>No. OneLake is the storage foundation of Microsoft Fabric. All Fabric workloads read from and write to OneLake. You cannot use Fabric compute against external ADLS Gen2 storage accounts as the primary storage (though you can access external storage via Shortcuts).</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q24: How is OneLake storage priced?</strong><br/>OneLake storage is approximately $0.023/GB/month (varies by region), the same as Azure Data Lake Storage Gen2 LRS pricing. Data transaction costs are also billed similarly to ADLS Gen2. For most organizations, OneLake storage is a minor fraction of total Fabric cost.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q25: Does Mirroring consume capacity CUs?</strong><br/>Yes. Mirroring continuously replicates data from source databases into OneLake and consumes CUs for the ongoing replication process. The CU consumption depends on the rate of change in the source database — a high-transaction OLTP database generates more Mirroring activity than a slowly changing reference database.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q26: How does Direct Lake affect capacity consumption compared to Import mode?</strong><br/>Direct Lake framing consumes significantly fewer CUs than a full Import mode refresh. A scheduled Import refresh of a large model might take 20–30 minutes consuming 20–30 CUs; the equivalent Direct Lake framing operation takes 30–60 seconds consuming 2–5 CUs — an 80–90% reduction.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q27: What is the Fabric Capacity API?</strong><br/>The Fabric REST API provides programmatic access to capacity management: pause/resume, scale up/down, workspace assignment changes, and utilization monitoring. Organizations use this API to automate capacity scheduling, build custom monitoring dashboards, and integrate Fabric metrics into enterprise observability platforms.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q28: Can I use Fabric for embedded analytics in customer-facing applications?</strong><br/>Yes. Power BI Embedded is the standard mechanism for embedding Fabric reports in external applications. For embedded scenarios, you purchase an A-SKU (Azure) capacity rather than an F-SKU — the A-SKU is specifically designed for embedded use cases with different licensing terms for ISVs and customer-facing deployments.</p>

<h3 style="color: var(--text); font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">Governance and Management</h3>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q29: Who can manage a Fabric capacity?</strong><br/>Fabric capacity administrators are specified in the Fabric Admin Portal. Tenant administrators automatically have capacity admin rights. Capacity admins can assign workspaces to the capacity, monitor utilization, and manage capacity settings.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q30: Can I set CU quotas per workspace to prevent one team from monopolizing capacity?</strong><br/>Yes. Fabric provides workspace-level controls that allow administrators to limit maximum CU consumption per workspace. When a workspace reaches its limit, its workloads are throttled while workloads in other workspaces continue operating. Configure these limits in the Fabric Admin Portal under workspace settings.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q31: How do I implement chargeback for Fabric costs across business units?</strong><br/>Use the Capacity Metrics App or Fabric REST API to export workspace-level CU consumption data monthly. Build a cost allocation calculation that apportions the total capacity monthly cost to business units based on their workspace's share of total CU consumption. Feed this data into your internal finance system as journal entries against the appropriate cost centers.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q32: Can I audit which users are consuming the most Fabric capacity?</strong><br/>Yes. The Capacity Metrics App provides item-level granularity for CU consumption. You can identify which specific notebook executions, report loads, or pipeline runs consumed the most CUs, and trace them back to the user or service principal that triggered them. The Fabric Audit Log in Microsoft Purview provides a complementary record of all user actions.</p>

<h3 style="color: var(--text); font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">Migration Questions</h3>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q33: How do I migrate from Power BI Premium P1 to Fabric F-SKU?</strong><br/>Provision an F-SKU capacity alongside your existing P1, move workspaces one at a time from P1 to F-SKU, validate report performance and functionality, then decommission the P1. Semantic models and dashboards carry over without modification; XMLA endpoints and dataset refresh schedules continue working.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q34: How long does migrating from Azure Synapse to Fabric take?</strong><br/>Simple Synapse workloads (Spark notebooks with basic transformations, straightforward SQL queries) can migrate in 2–4 weeks. Complex architectures (Synapse Link, Dedicated SQL Pools with many stored procedures) typically take 3–9 months. Plan for a parallel-run period where both platforms operate simultaneously to validate results before cutting over.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q35: What happens to my Power BI Premium reports on Fabric?</strong><br/>Power BI reports on Fabric work identically to Power BI Premium. The difference is that Fabric adds Lakehouse, Warehouse, Spark, and Real-Time Intelligence alongside your existing Power BI investment. Your existing .pbix files, semantic models, and report configurations remain unchanged.</p>

<h3 style="color: var(--text); font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">Certifications</h3>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q36: Is Fabric capacity planning covered in the DP-600 exam?</strong><br/>Yes. The DP-600 exam covers workspace governance, capacity settings, and deployment pipelines as part of the "Plan and Implement Data Analytics Environments" domain (10–15% of the exam). See our <a href="/blog/dp-600-study-guide-2026" style="color: var(--accent); text-decoration: underline;">DP-600 Study Guide 2026</a> for complete exam preparation.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q37: Is capacity optimization covered in the DP-700 exam?</strong><br/>Yes. The <a href="/blog/dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison" class="autolink" style="color: var(--accent); text-decoration: underline;" title="DP-700 Certification Guide">DP-700</a> exam covers the Capacity Metrics App, Spark cluster optimization, and pipeline performance tuning as part of the "Monitor and Optimize Solutions" domain (15–20% of the exam). See our <a href="/blog/dp-700-study-guide-2026" style="color: var(--accent); text-decoration: underline;">DP-700 Study Guide 2026</a> for detailed coverage.</p>

<h3 style="color: var(--text); font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">Troubleshooting</h3>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q38: Why are my Power BI reports slow when Spark jobs are running?</strong><br/>This is the most common symptom of shared capacity over-utilization. Spark jobs consume large amounts of CUs, depleting the smoothing buffer. Solutions: schedule Spark jobs during off-hours, upgrade capacity SKU, or isolate Spark workloads on a separate capacity.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q39: Why does my Direct Lake report fall back to DirectQuery mode?</strong><br/>Direct Lake falls back to DirectQuery when the VertiPaq engine's memory is exhausted and column segments cannot be loaded into the in-memory cache. Solutions: upgrade to a higher SKU, reduce the number of columns in your semantic model, or run OPTIMIZE on your Delta tables to improve compression.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q40: My pipeline is failing with a 429 error. What does this mean?</strong><br/>A 429 error indicates capacity is throttled and rejecting new requests after sustained overutilization depleted the smoothing buffer. Immediate fix: pause non-critical workloads to free CU headroom. Medium-term: reschedule workloads or upgrade capacity. Use the Capacity Metrics App's Timepoint Explorer to find what was consuming CUs at the time of the 429 errors.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q41: My Fabric costs are higher than expected. Where should I look first?</strong><br/>Open the Capacity Metrics App → Item Detail → sort by CU Seconds descending. The top 10 items account for the majority of your cost. In most cases, a few large Spark jobs or poorly designed scheduled refreshes account for 60–80% of total CU consumption. Fix those first.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q42: What should I do if my Fabric capacity is consistently at 90%+ utilization?</strong><br/>Run a 2-week analysis in the Capacity Metrics App to understand the utilization pattern. If consistently high throughout the day, you need a larger SKU. If high only during specific windows, start with scheduling optimization before upgrading — moving 2–3 large background jobs to off-peak hours often resolves sustained high utilization at a fraction of the cost of an SKU upgrade.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q43: In which Azure subscription do Fabric costs appear?</strong><br/>Fabric capacity is an Azure resource in the Azure subscription it was provisioned in. All Fabric charges (capacity + OneLake storage) appear in Azure Cost Management under that subscription. Filter by resource type "Microsoft.Fabric/capacities" to see Fabric-specific charges separately from other Azure services.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q44: Does Fabric support multi-region for disaster recovery?</strong><br/>Fabric capacities are provisioned in a single Azure region. For multi-region redundancy, provision separate capacities in each target region. A common approach for mission-critical workloads is active-active: two F32 capacities in separate regions, with workspace assignments switched if one capacity has issues. Since data lives in OneLake (not in the capacity), there is no data loss from capacity failover.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q45: Can I reduce cost by using fewer workspaces?</strong><br/>Workspace count doesn't directly affect CU consumption — an empty workspace costs nothing in compute. Reducing the number of semantic models and Spark notebooks (by combining related workloads into fewer, more efficient items) can reduce total CU consumption. Workspace consolidation is more a governance simplification than a direct cost reduction.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q46: How does Fabric billing handle partial months?</strong><br/>Pay-as-you-go Fabric capacity is billed hourly to the nearest hour. If you create a capacity mid-month and delete it before month-end, you pay only for the hours it was running. Reserved Capacity is purchased for a full year or 3 years regardless of actual usage — pausing the capacity doesn't reduce the reservation payment, only pay-as-you-go capacity benefits from the billing pause.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q47: What is the difference between Fabric capacity and Power BI Embedded (A-SKU)?</strong><br/>Fabric F-SKU is for internal organizational analytics platforms. A-SKU (Azure, for Power BI Embedded) is for ISVs and customer-facing applications where you embed Power BI reports in your product for your customers. A-SKU pricing is similar to F-SKU pricing but with different licensing terms that allow non-organizational users to access content.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q48: Is there autoscaling available for Fabric capacity?</strong><br/>As of mid-2026, Fabric does not have native autoscaling — you cannot configure a capacity to automatically scale from F32 to F64 during peak demand and back down afterward. The Fabric REST API can be used to build custom autoscaling logic. Native autoscaling is on the product roadmap and expected to change this in future releases.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q49: How does the Fabric Trial differ from a purchased F2 capacity?</strong><br/>The Fabric Trial provides a shared capacity pool — you share compute resources with other trial users and performance is not guaranteed. A purchased F2 capacity is a dedicated capacity — you have exclusive access to 2 CUs with SLA-backed performance guarantees. For any meaningful testing or development work, a purchased F2 is strongly preferable to the shared trial.</p>

<p style="margin-bottom: 1rem; line-height: 1.7; color: var(--muted);"><strong>Q50: Where should I verify current Microsoft Fabric pricing?</strong><br/>Always verify current pricing on the official <a href="https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/" style="color: var(--accent); text-decoration: underline;" target="_blank" rel="noopener">Azure Fabric Pricing page</a> before making procurement decisions. Prices change periodically and vary by region. The prices referenced in this guide are approximate US East rates current as of July 2026 and should be used for estimation purposes only, not for contract commitments.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="conclusion" style="color: var(--text); font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">17. Conclusion: Decision Tree and Final Recommendations</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">17.1 The SKU Selection Decision Tree</h3>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 1.5rem 0; line-height: 1.85; color: var(--muted);">
  <p style="color: var(--text); font-weight: 700; margin-bottom: 0.75rem;">Follow this decision path to your starting SKU:</p>
  <p><strong>Step 1: Purpose</strong><br/>→ Learning/PoC only? → <span style="color: var(--accent); font-weight: bold;">F2</span><br/>→ Production workload? → Continue to Step 2</p>
  <p><strong>Step 2: Team size and concurrent users at peak hour</strong><br/>→ &lt;20 users, no Spark → <span style="color: var(--accent); font-weight: bold;">F4 or F8</span><br/>→ 20–100 users, light Spark → <span style="color: var(--accent); font-weight: bold;">F8 or F16</span><br/>→ 100–300 users, active Spark → <span style="color: var(--accent); font-weight: bold;">F32</span><br/>→ 300–600 users, active Spark + Streaming → <span style="color: var(--accent); font-weight: bold;">F64</span><br/>→ 600–2,000 users, heavy multi-domain → <span style="color: var(--accent); font-weight: bold;">F128 or F256</span><br/>→ 2,000+ users, global enterprise → <span style="color: var(--accent); font-weight: bold;">F512+</span></p>
  <p><strong>Step 3: Validate with the Metrics App</strong><br/>→ Run PAYG for 4 weeks → Monitor average and peak CU utilization<br/>→ Average &lt;50%: consider downgrade → Average &gt;70%: plan for upgrade → Peak &gt;85%: immediate scheduling optimization needed</p>
  <p><strong>Step 4: Commit to Reserved Capacity</strong><br/>→ Once SKU validated: purchase 1-year Reserved Capacity → Annual saving: ~37%</p>
</div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">17.2 The Five Rules for Long-Term Cost Control</h3>

<ol style="line-height: 1.85; padding-left: 1.5rem; color: var(--muted);">
  <li style="margin-bottom: 0.75rem;"><strong>Measure before you resize.</strong> Never upgrade a SKU without first running 2–4 weeks of Metrics App analysis. Many throttling incidents that look like "we need more capacity" turn out to be "we need to reschedule this one large pipeline."</li>
  <li style="margin-bottom: 0.75rem;"><strong>Separate production and development capacity.</strong> This prevents development experiments from impacting production performance, eliminates the need to run large dev capacities 24/7, and simplifies cost attribution.</li>
  <li style="margin-bottom: 0.75rem;"><strong>Schedule background work during off-peak hours.</strong> Pipeline runs, Spark notebooks, and OPTIMIZE/VACUUM operations should run when users are sleeping. This single discipline eliminates most throttling incidents at no cost.</li>
  <li style="margin-bottom: 0.75rem;"><strong>Migrate to Direct Lake wherever possible.</strong> Every Import mode semantic model on a Fabric Delta data source is costing you unnecessary CUs on every scheduled refresh. Direct Lake framing is dramatically more efficient and provides better data freshness as a bonus.</li>
  <li style="margin-bottom: 0.75rem;"><strong>Review the FinOps dashboard monthly.</strong> Cost awareness creates cost accountability. Teams that see their monthly CU consumption consistently optimize their workloads. Teams that never see the numbers consistently over-consume.</li>
</ol>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 1.75rem; margin-bottom: 0.75rem;">17.3 Where Fabric is Heading</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Microsoft Fabric's development roadmap in 2026 focuses on Copilot and AI integration, autonomous capacity management, and expanded external connectivity. Copilot features consuming CUs are shipping to Fabric F-SKUs — as these features mature and adoption grows, factor AI workload CU consumption into capacity planning. Native autoscaling is on the product roadmap and will change capacity planning significantly when available: rather than sizing for peak demand and reserving headroom, organizations will be able to size for average demand and let Fabric handle peaks automatically.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">The fundamental bet remains the same: Microsoft Fabric is the platform Microsoft is building toward. Power BI, Synapse, Analysis Services, and Azure Data Factory are all converging here. Understanding the Fabric pricing and capacity model today is not just a cost optimization exercise — it's building fluency in the infrastructure language of enterprise analytics for the next decade.</p>

<div style="background: rgba(201, 243, 29, 0.05); padding: 1.5rem; border-left: 4px solid var(--accent); border-radius: 0 8px 8px 0; margin: 2rem 0;">
  <p style="color: var(--text); font-weight: 700; margin-bottom: 0.5rem;">Your Next Steps</p>
  <ul style="line-height: 1.85; color: var(--muted); padding-left: 1.25rem; margin: 0;">
    <li>Install the <a href="https://appsource.microsoft.com/en-us/product/power-bi/pbi_pcmm.microsoftpremiumfabricpreviewreport" style="color: var(--accent); text-decoration: underline;" target="_blank" rel="noopener">Fabric Capacity Metrics App</a> if you haven't already.</li>
    <li>Review our <a href="/blog/microsoft-fabric-onelake-architecture-guide" style="color: var(--accent); text-decoration: underline;">OneLake Architecture Guide</a> to understand the storage layer that everything builds on.</li>
    <li>Study the <a href="/blog/microsoft-fabric-medallion-architecture-guide" style="color: var(--accent); text-decoration: underline;">Medallion Architecture Guide</a> to understand how to structure your data for maximum CU efficiency.</li>
    <li>Our <a href="/blog/dp-600-study-guide-2026" style="color: var(--accent); text-decoration: underline;">DP-600</a> and <a href="/blog/dp-700-study-guide-2026" style="color: var(--accent); text-decoration: underline;">DP-700</a> study guides cover capacity management in detail if you're preparing for certification.</li>
    <li>Read our <a href="/blog/microsoft-fabric-architecture-explained-2026" style="color: var(--accent); text-decoration: underline;">Microsoft Fabric Architecture guide</a> for a comprehensive technical foundation on the full platform.</li>
  </ul>
</div>

<h2 id="related-reading" style="font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; color: var(--text);">Related Resources</h2>
<ul style="list-style-type: disc; padding-left: 1.5rem; margin-bottom: 2rem; line-height: 1.7; color: var(--muted);">
  <li><a href="/blog/microsoft-fabric-architecture-explained-2026" style="color: var(--accent); text-decoration: none; font-weight: 600;">Microsoft Fabric Architecture Explained: The Complete 2026 Guide</a></li>
  <li><a href="/blog/microsoft-fabric-onelake-architecture-guide" style="color: var(--accent); text-decoration: none; font-weight: 600;">OneLake Architecture Guide: Delta Lake, Shortcuts, Mirroring, and Direct Lake</a></li>
  <li><a href="/blog/microsoft-fabric-medallion-architecture-guide" style="color: var(--accent); text-decoration: none; font-weight: 600;">Microsoft Fabric Medallion Architecture Guide</a></li>
  <li><a href="/blog/dp-600-study-guide-2026" style="color: var(--accent); text-decoration: none; font-weight: 600;">DP-600 Study Guide 2026: Complete Exam Preparation</a></li>
  <li><a href="/blog/dp-700-study-guide-2026" style="color: var(--accent); text-decoration: none; font-weight: 600;">DP-700 Study Guide 2026: Complete Exam Preparation</a></li>
  <li><a href="/blog/dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison" style="color: var(--accent); text-decoration: none; font-weight: 600;">DP-600 vs DP-700 vs DP-800: Which Certification is Right for You?</a></li>
</ul>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Microsoft Fabric Pricing Explained (2026): Complete Guide to F-SKUs, Capacity Planning, Cost Optimization & Enterprise Sizing",
  "description": "The most comprehensive Microsoft Fabric pricing guide available. Master F-SKUs, Capacity Units, cost optimization, Reserved Capacity, enterprise sizing, and FinOps governance for 2026.",
  "author": {
    "@type": "Person",
    "name": "Datta Sable",
    "url": "https://dattasable.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Datta Sable",
    "logo": {
      "@type": "ImageObject",
      "url": "https://dattasable.com/favicon.svg"
    }
  },
  "datePublished": "2026-07-19",
  "mainEntityOfPage": "https://dattasable.com/blog/microsoft-fabric-pricing-guide-2026"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does Microsoft Fabric cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Microsoft Fabric capacity ranges from approximately $262/month (F2, PAYG, US East) to $268,428/month (F2048). Most production deployments use F32-F128 at $4,194-$16,776/month PAYG or $2,644-$10,570/month with 1-year Reserved Capacity. Storage is additional at approximately $0.023/GB/month."
      }
    },
    {
      "@type": "Question",
      "name": "What is a Capacity Unit in Microsoft Fabric?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Capacity Unit (CU) is Microsoft's normalized compute unit for Fabric. It abstracts underlying CPU, memory, and I/O into a single measurement. An F8 capacity provides 8 CUs of concurrent compute. Every workload — Spark, SQL, Power BI, Data Factory — consumes CUs from the same shared pool."
      }
    },
    {
      "@type": "Question",
      "name": "How do I choose the right Microsoft Fabric SKU?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start with a pay-as-you-go capacity based on peak concurrent users and Spark workload intensity. For under 25 concurrent users with no Spark, F4/F8 is usually sufficient. For 100-300 concurrent users with active Spark, F32 is a common starting point. For 300-600 users, F64 is the enterprise standard. Run the Capacity Metrics App for 4 weeks to validate your choice before committing to Reserved Capacity."
      }
    },
    {
      "@type": "Question",
      "name": "How much does Reserved Capacity save on Microsoft Fabric?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "1-year Reserved Capacity saves approximately 37% versus pay-as-you-go rates. 3-year reservations save approximately 52%. On an F64, this translates to over $37,000/year saved with a 1-year reservation."
      }
    },
    {
      "@type": "Question",
      "name": "Can I pause a Microsoft Fabric capacity to save money?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Fabric capacities can be paused via the Azure Portal, Fabric Admin Portal, or REST API. When paused, no compute charges accrue. Data in OneLake persists. For dev/test capacities, pausing evenings and weekends typically reduces monthly cost by 60-70%."
      }
    }
  ]
}
</script>
<!-- CTA_START -->
<div class="auto-cta-box" style="margin-top: 3rem; padding: 2rem; border: 1px solid var(--accent); background: rgba(201, 243, 29, 0.02); border-radius: 4px; text-align: center;">
  <h4 style="font-family: Syne, sans-serif; font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--text);">Want to become a Microsoft Fabric Architect?</h4>
  <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Start here to scale your data engineering career with our certification resources and mentorship paths.</p>
  <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
    <a href="/blog/microsoft-fabric-architecture-explained-2026" style="background: var(--accent); color: #000; padding: 0.6rem 1.5rem; font-weight: 700; text-decoration: none; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Start Here</a>
    <a href="/mentorship" style="border: 1px solid var(--accent); color: var(--text); padding: 0.6rem 1.5rem; font-weight: 700; text-decoration: none; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Mentorship</a>
    <a href="/blog/microsoft-fabric-certification-roadmap-2026" style="border: 1px solid var(--border); color: var(--muted); padding: 0.6rem 1.5rem; font-weight: 700; text-decoration: none; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Certification Roadmap</a>
  </div>
</div>
<!-- CTA_END -->
<!-- RELATED_START -->
<div class="related-articles-section" style="margin-top: 4rem; padding: 2.5rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;">
  <h3 style="font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text); margin: 0 0 1.5rem 0; font-family: Syne, sans-serif;">Related Reading</h3>
  <ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Architecture & BI</span>
      <a href="/blog/microsoft-fabric-architecture-explained-2026" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">Microsoft Fabric Architecture Explained: The Complete 2026 Guide</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Architecture & BI</span>
      <a href="/blog/dp-600-study-guide-2026" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">DP-600 Study Guide 2026: Complete Microsoft Fabric Analytics Engineer Exam Preparation</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Architecture & BI</span>
      <a href="/blog/microsoft-fabric-architectural-guide" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">The Fabric Architect’s Manifesto: The Unofficial Microsoft Fabric Architectural Guide</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Microsoft Fabric</span>
      <a href="/blog/microsoft-fabric-onelake-architecture-guide" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">OneLake Explained: The Complete Microsoft Fabric OneLake Architecture Guide (2026 Edition)</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Architecture & BI</span>
      <a href="/blog/microsoft-fabric-certification-roadmap-2026" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">Microsoft Fabric Certification Roadmap 2026: Plan Your Learning Path</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Architecture & BI</span>
      <a href="/blog/free-microsoft-certifications-fabric-data-days-2026" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">Free Microsoft Fabric Certification Voucher 2026: Complete Guide to DP-600, DP-700 & DP-800 (With Proof)</a>
    </li>
  </ul>
</div>
<!-- RELATED_END -->
<!-- POPULAR_START -->
<div class="popular-fabric-guides" style="margin-top: 2rem; padding: 2rem; background: var(--surface2); border-left: 4px solid var(--accent); border-radius: 0 8px 8px 0; border: 1px solid var(--border); border-left-width: 4px;">
  <h3 style="font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin: 0 0 1.25rem 0; font-family: Syne, sans-serif;">Popular Microsoft Fabric Guides</h3>
  <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem;">
    <li><a href="/blog/microsoft-fabric-architecture-explained-2026" style="color: var(--text); text-decoration: none; font-size: 0.9rem; hover: underline;">→ Microsoft Fabric Architecture: The Complete Blueprint (2026)</a></li>
    <li><a href="/blog/microsoft-fabric-pricing-guide-2026" style="color: var(--text); text-decoration: none; font-size: 0.9rem; hover: underline;">→ Microsoft Fabric Capacity Sizing &amp; Pricing Masterclass</a></li>
    <li><a href="/blog/microsoft-fabric-onelake-architecture-guide" style="color: var(--text); text-decoration: none; font-size: 0.9rem; hover: underline;">→ OneLake Architecture: Enterprise Virtualization Deep-Dive</a></li>
    <li><a href="/blog/dp-600-study-guide-2026" style="color: var(--text); text-decoration: none; font-size: 0.9rem; hover: underline;">→ DP-600 Fabric Analytics Engineer Pass Preparation Roadmap</a></li>
  </ul>
</div>
<!-- POPULAR_END -->`
};
