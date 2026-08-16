export const microsoftFabricCapacitySizingGuide2026Post = {
  id: "microsoft-fabric-capacity-sizing-guide-2026",
  slug: "microsoft-fabric-capacity-sizing-guide-2026",
  title: "Microsoft Fabric Capacity Sizing 2026: The Complete F-SKU Guide",
  category: "Architecture & BI",
  excerpt: "Master Microsoft Fabric capacity sizing. Learn to choose the right F-SKU, manage Capacity Units, and optimize costs with production telemetry in 2026.",
  date: "August 16, 2026",
  icon: "⚙️",
  image: "/images/blog/microsoft-fabric-capacity-sizing-guide-2026.webp",
  tags: ["Microsoft Fabric", "Capacity Sizing", "F-SKU", "Capacity Units", "FinOps", "Cost Optimization", "Fabric Master"],
  content: `<!-- BREADCRUMB_START -->
<div class="breadcrumb-container" style="font-family: monospace; font-size: 0.8rem; margin-bottom: 2rem; color: var(--muted); border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
  <a href="/" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Home</a> &gt; 
  <a href="/blog" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Blog</a> &gt; 
  <a href="/blog/microsoft-fabric" style="color: var(--accent); text-decoration: none; font-weight: 600;">Microsoft Fabric Hub</a> &gt; 
  <span style="color: var(--text);">Microsoft Fabric Capacity Sizing 2026</span>
</div>
<!-- BREADCRUMB_END -->
<div style="padding: 1rem; border-left: 4px solid var(--accent); background: var(--surface2); margin: 1.5rem 0; border-radius: 4px;"><strong>Enterprise Resource:</strong> For a complete view on data security and compliance inside your capacity, read our guide to <a href="/blog/microsoft-fabric-governance-purview-guide-2026" style="color: var(--accent); text-decoration: underline;">Microsoft Fabric governance</a>.</div>

<h2 id="introduction" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Introduction</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Two organizations can both use Microsoft Fabric but require completely different capacities. One may have a small Power BI workload with occasional refreshes, completely satisfied by an entry-level capacity. Another organization may have hundreds of concurrent users, complex Power BI semantic models, heavy Data Factory pipelines, large scheduled transformations, AI workloads, and highly bursty enterprise reporting.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Choosing a Fabric SKU is not simply about picking the biggest capacity that fits the budget. It is a workload-sizing problem involving compute demand, concurrency, workload mix, burst behavior, utilization, growth, performance requirements, and cost. Understanding how <a href="/blog/microsoft-fabric-architecture-explained-2026" style="color: var(--accent); text-decoration: underline;" title="Microsoft Fabric architecture">Microsoft Fabric architecture</a> distributes these compute demands across shared resources is essential before signing a capacity commitment.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">The traditional approach of provisioning isolated compute for isolated services — a dedicated cluster for Spark, a dedicated pool for SQL, a dedicated premium capacity for Power BI — has been replaced by a pooled Capacity Unit (CU) model. Every workload draws from the exact same bucket. Consequently, capacity planning must shift from a siloed component estimation toward a unified demand model: Workload → CU demand → concurrency → headroom → SKU → cost → validation.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">This article breaks down how to systematically size your Microsoft Fabric environment. A static SKU table is not enough. A basic calculator alone is not enough. We will explore how different engines consume CUs, how to plan for concurrency and headroom, what capacity throttling means in practice, and how to validate your modeled assumptions using production telemetry. Throughout the process, we will demonstrate how Fabric Master provides modeled estimation and decision support to accelerate this planning phase.</p>

<div class="blog-toc" style="padding: 1.5rem 2rem !important;">
  <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 1.25rem !important; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text);">Table of Contents</h4>
  <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.25rem 1.5rem; list-style-type: none !important; padding: 0 !important; margin: 0 !important; font-size: 0.85rem; line-height: 1.6; color: var(--muted);">
    <li><a href="#executive-summary" style="color: var(--muted); text-decoration: none;">Executive Summary</a></li>
    <li><a href="#quick-answer-which-fabric-f-sku-should-you-choose" style="color: var(--muted); text-decoration: none;">Quick Answer: Which F-SKU Should You Choose?</a></li>
    <li><a href="#what-is-microsoft-fabric-capacity" style="color: var(--muted); text-decoration: none;">What Is Microsoft Fabric Capacity?</a></li>
    <li><a href="#capacity-units-explained" style="color: var(--muted); text-decoration: none;">Capacity Units Explained</a></li>
    <li><a href="#how-fabric-capacity-sizing-actually-works" style="color: var(--muted); text-decoration: none;">How Fabric Capacity Sizing Actually Works</a></li>
    <li><a href="#workload-by-workload-sizing" style="color: var(--muted); text-decoration: none;">Workload-by-Workload Sizing</a></li>
    <li><a href="#how-much-capacity-headroom-should-you-keep" style="color: var(--muted); text-decoration: none;">How Much Capacity Headroom Should You Keep?</a></li>
    <li><a href="#fabric-capacity-throttling" style="color: var(--muted); text-decoration: none;">Fabric Capacity Throttling</a></li>
    <li><a href="#how-to-validate-your-capacity-size-using-the-microsoft-fabric-capacity-metrics-app" style="color: var(--muted); text-decoration: none;">Validating with the Capacity Metrics App</a></li>
    <li><a href="#f-sku-decision-table" style="color: var(--muted); text-decoration: none;">F-SKU Decision Table</a></li>
    <li><a href="#f32-vs-f64-when-should-you-upgrade" style="color: var(--muted); text-decoration: none;">F32 vs F64: When Should You Upgrade?</a></li>
    <li><a href="#capacity-sizing-example" style="color: var(--muted); text-decoration: none;">Capacity Sizing Example</a></li>
    <li><a href="#capacity-sizing-is-also-a-finops-problem" style="color: var(--muted); text-decoration: none;">Capacity Sizing Is Also a FinOps Problem</a></li>
    <li><a href="#payg-vs-reserved" style="color: var(--muted); text-decoration: none;">PAYG vs Reserved Pricing</a></li>
    <li><a href="#dont-scale-the-capacity-before-you-diagnose-the-workload" style="color: var(--muted); text-decoration: none;">Optimization Before Resizing</a></li>
    <li><a href="#calculate-your-fabric-capacity-requirement-with-fabric-master" style="color: var(--muted); text-decoration: none;">Calculate Your Fabric Capacity with Fabric Master</a></li>
    <li><a href="#fabric-master-feature-mapping" style="color: var(--muted); text-decoration: none;">Fabric Master Feature Mapping</a></li>
    <li><a href="#faq" style="color: var(--muted); text-decoration: none;">Frequently Asked Questions (FAQ)</a></li>
  </ul>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="executive-summary" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Executive Summary</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">If you only have two minutes, here are the key takeaways for planning Microsoft Fabric capacity sizing:</p>
<ul style="line-height: 1.8; padding-left: 1.5rem; list-style-type: disc; margin-bottom: 2rem; color: var(--muted);">
    <li><strong>Capacity sizing is workload-specific:</strong> User counts alone cannot determine your SKU. You must evaluate the intensity of Spark, SQL, and Power BI workloads.</li>
    <li><strong>Capacity Units are the core compute measurement:</strong> Every operation burns a predictable fraction of CUs based on execution time and intensity.</li>
    <li><strong>F-SKU selection should reflect workload demand:</strong> Choose a SKU based on concurrent demand plus buffer, not simply average utilization.</li>
    <li><strong>Average utilization can hide peaks:</strong> Designing a capacity purely on average daily consumption will lead to severe performance degradation during concurrent spikes.</li>
    <li><strong>Concurrency matters:</strong> Ten users querying large semantic models simultaneously demand exponentially more instantaneous CUs than ten users spread across the day.</li>
    <li><strong>Headroom matters:</strong> Planning for 100% baseline utilization leaves zero room for burst operations, growth, or unexpected workload scheduling collisions.</li>
    <li><strong>Throttling is a signal, not merely a pricing issue:</strong> Interactive rejection or background delays indicate either a need for workload optimization or a larger SKU.</li>
    <li><strong>Production telemetry should validate modeled estimates:</strong> Modeled estimates must eventually be validated against actual usage.</li>
    <li><strong>Workload optimization can sometimes be better than scaling:</strong> Tuning a poorly designed <a href="/blog/microsoft-fabric-warehouse-explained-2026" style="color: var(--accent); text-decoration: underline;" title="Fabric Warehouse workloads">Fabric Warehouse workload</a> is often cheaper and more effective than upgrading from F64 to F128.</li>
    <li><strong>Fabric Master can provide an initial modeled assessment:</strong> Use <a href="https://fabric.dattasable.com/wizard" style="color: var(--accent); text-decoration: underline;">Fabric Master</a> to generate initial estimates based on workload assumptions.</li>
    <li><strong>Microsoft Capacity Metrics should validate production usage:</strong> Microsoft's official app remains the definitive source for real-world CU burn and throttling diagnosis.</li>
</ul>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="quick-answer-which-fabric-f-sku-should-you-choose" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Quick Answer: Which Fabric F-SKU Should You Choose?</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">A common mistake is seeking a definitive mapping of "X users equals SKU Y." SKU selection cannot be determined reliably from user count alone because 100 casual report viewers require vastly less compute than 5 data engineers compiling massive Apache Spark transformations. However, a general directional framework based on workload profiles provides a starting point:</p>

<ul style="line-height: 1.8; padding-left: 1.5rem; list-style-type: disc; margin-bottom: 2rem; color: var(--muted);">
    <li><strong>Small workload (F2–F8):</strong> May be appropriate for lightweight, departmental reporting with minimal background transformation. Suitable for Dev/Test environments or small teams relying primarily on scheduled Power BI refresh without heavy concurrency.</li>
    <li><strong>Growing departmental workload (F8–F16):</strong> Fits mid-sized teams running moderate Data Factory pipelines and interactive dashboards. Concurrency is limited, and heavy Spark jobs should be strictly scheduled during off-peak hours.</li>
    <li><strong>Medium enterprise workload (F16–F32):</strong> Suitable for organizations running active data warehouses, regular semantic model processing, and consistent interactive querying across multiple departments. Supports more aggressive background transformations without immediately starving interactive performance.</li>
    <li><strong>High-concurrency / multi-workload enterprise (F32–F64+):</strong> The entry point for complex enterprise architectures running concurrent Spark jobs, continuous Data Factory orchestration, massive warehouse queries, and hundreds of interactive Power BI users. F64 is notably the tier where Power BI Free users can consume content without individual Pro licenses.</li>
    <li><strong>Large enterprise (F128+):</strong> Necessary for vast architectures requiring high-throughput <a href="/blog/microsoft-fabric-onelake-architecture-guide" style="color: var(--accent); text-decoration: underline;" title="capacity planning for Fabric workloads">capacity planning for Fabric workloads</a> spread across global teams, near real-time streaming pipelines, and thousands of concurrent interactive sessions.</li>
</ul>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">If you are unsure where your workload fits, use the <a href="https://fabric.dattasable.com/wizard" style="color: var(--accent); text-decoration: underline;">Fabric capacity calculator</a> within Fabric Master to model specific engine assumptions before provisioning.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="what-is-microsoft-fabric-capacity" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">What Is Microsoft Fabric Capacity?</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">In Microsoft Fabric, <strong>capacity</strong> refers to a dedicated pool of compute resources allocated to your tenant. Instead of provisioning an isolated virtual machine for your database and a separate cluster for your data integration, Fabric utilizes a shared compute model. Every workload — whether a Spark notebook execution, a SQL warehouse query, or a Power BI dashboard render — draws computing power from this shared pool.</p>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">This compute power is quantified in <strong>Capacity Units (CUs)</strong>. When you purchase Fabric, you purchase a specific <strong>F-SKU</strong>, which guarantees a continuous baseline of CUs available to all workspaces assigned to that capacity. When a workload executes, it consumes a fraction of those CUs based on the intensity and duration of the operation.</p>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">SKU</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Capacity Units (CUs)</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Typical Planning Context</th>
        <th style="padding: 12px; text-align: left; color: var(--text); font-weight: 600;">Important Caveat</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F2</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">2</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Dev/Test environments, small POCs</td>
        <td style="padding: 12px; color: var(--muted);">Will severely throttle under concurrent load.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F4</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">4</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Small departmental reporting</td>
        <td style="padding: 12px; color: var(--muted);">Avoid running heavy Spark and Warehouse workloads simultaneously.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F8</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">8</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Moderate analytical pipelines</td>
        <td style="padding: 12px; color: var(--muted);">Scheduled backgrounds tasks must be carefully orchestrated.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F16</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">16</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Mid-market standard analytics</td>
        <td style="padding: 12px; color: var(--muted);">Capable of decent parallelism but watch out for peak concurrency.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F32</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">32</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Medium enterprise multi-engine architecture</td>
        <td style="padding: 12px; color: var(--muted);">A common baseline for significant production deployments.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F64</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">64</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">High-concurrency enterprise workloads</td>
        <td style="padding: 12px; color: var(--muted);">Enables Power BI Free user consumption.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F128</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">128</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Large enterprise global scale</td>
        <td style="padding: 12px; color: var(--muted);">Typically requires splitting workspaces logically to isolate critical workloads.</td>
      </tr>
    </tbody>
  </table>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="capacity-units-explained" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Capacity Units Explained</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">A Capacity Unit (CU) is the standardized measure of compute power in Fabric. If you provision an F64 SKU, you receive 64 seconds of compute capacity every single second.</p>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Fabric calculates consumption through continuous evaluation periods. When a workload executes, Microsoft calculates the actual computational effort required (CPU seconds, memory footprint, data scanned) and translates it into a CU consumption metric. Because modern analytics workloads are inherently "bursty" — requiring massive compute for a few seconds and then sitting idle — Fabric employs an intelligent <strong>smoothing</strong> mechanism.</p>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Smoothing takes a massive spike in compute (a burst) and averages the CU consumption over a longer time window (e.g., 24 hours for background operations, shorter intervals for interactive queries). This allows a relatively small capacity to process a massive, instantaneous job without immediately throttling, by effectively borrowing against future idle capacity.</p>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><em>Illustrative Example:</em> If a scheduled Spark job demands 200 CUs for 1 minute, but you only have an F64 capacity, smoothing spreads that massive 200 CU burn rate out over the next 24 hours, registering as a tiny fractional CU burn per minute. The job finishes fast, but your capacity "pays off" the compute debt gradually. However, if you continuously burst without idle periods, your smoothed average will eventually exceed your baseline 64 CUs, leading to throttling.</p>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">This is why "64 CUs" does not equal "64 users." A single user running a catastrophically complex Data Factory pipeline could theoretically exhaust an F64 if they run it continuously, while 64 casual users viewing cached Power BI reports might barely register a blip on an F8.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="how-fabric-capacity-sizing-actually-works" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">How Fabric Capacity Sizing Actually Works</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">To avoid the trap of guessing a SKU based on user count, adopt a structured sizing methodology.</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0;">
<h4 style="margin-top:0; font-size: 1.1rem; color: var(--text);">Dattasable Capacity Sizing Framework</h4>
<ol style="line-height: 1.8; padding-left: 1.5rem; margin-bottom: 1rem; color: var(--muted);">
    <li><strong>Inventory workloads:</strong> Catalog all planned Spark jobs, SQL queries, Data Factory pipelines, and Power BI models.</li>
    <li><strong>Estimate baseline demand:</strong> Determine the average CU consumption required for steady-state operations.</li>
    <li><strong>Identify peak periods:</strong> Pinpoint when scheduled data loads intersect with high interactive usage (e.g., Monday 8:00 AM).</li>
    <li><strong>Model concurrency:</strong> Calculate the impact of multiple users hitting the Warehouse or Semantic Models simultaneously.</li>
    <li><strong>Account for burst workloads:</strong> Acknowledge that smoothing handles short bursts, but continuous bursts require raw capacity.</li>
    <li><strong>Add growth assumptions:</strong> Factor in expected data volume increases and new user onboarding over the next 12-18 months.</li>
    <li><strong>Define acceptable headroom:</strong> Decide the maximum utilization threshold before performance risks become unacceptable (e.g., targeting 70% peak utilization).</li>
    <li><strong>Evaluate throttling risk:</strong> Assess what happens to business operations if background rejection or interactive delays occur.</li>
    <li><strong>Compare candidate SKUs:</strong> Map the resulting CU requirement to the closest F-SKU.</li>
    <li><strong>Validate with production telemetry:</strong> Monitor the Microsoft Fabric Capacity Metrics app post-deployment.</li>
    <li><strong>Reassess periodically:</strong> Treat sizing as a continuous FinOps cycle, not a one-time event.</li>
</ol>
</div>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      WorkloadInventory[Workload Inventory] --> BaselineDemand[Baseline Demand]
      BaselineDemand --> PeakDemand[Peak Demand]
      PeakDemand --> Concurrency[Concurrency]
      Concurrency --> Headroom[Headroom]
      Headroom --> CandidateSKU[Candidate F-SKU]
      CandidateSKU --> CostEval[Cost Evaluation]
      CostEval --> ProdValidation[Production Validation]
  </pre>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="workload-by-workload-sizing" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Workload-by-Workload Sizing</h2>

<h3 style="color: var(--text); font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 1rem;">Power BI / Semantic Models</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Power BI represents the visualization and semantic modeling layer. Interactive report usage consumes interactive CUs, while scheduled refreshes consume background CUs. Concurrency is a massive factor here: 100 executives viewing an executive dashboard at exactly 9:00 AM generates a spike in query processing. The underlying model architecture fundamentally dictates consumption. Complex DAX running against an Import model behaves differently than a Direct Lake setup. Proper tuning for <a href="/blog/power-bi-direct-lake-performance-tuning-fabric" style="color: var(--accent); text-decoration: underline;" title="Direct Lake performance">Direct Lake performance</a> ensures optimal paging of Delta Parquet columns into memory, reducing sustained CU demand compared to heavy DirectQuery models which push compute down to the underlying SQL engine.</p>

<h3 style="color: var(--text); font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 1rem;">Data Factory</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Data Factory handles pipeline orchestration and data movement. Scheduled background workloads are smoothed over 24 hours, meaning heavy nightly ETL pipelines can often run on relatively small capacities without impacting daytime interactive performance. However, high-concurrency pipeline execution or continuously running micro-batches will aggregate and steadily raise the baseline utilization.</p>

<h3 style="color: var(--text); font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 1rem;">Spark</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Spark notebooks and batch processing jobs are notorious for bursty compute. Spark can autoscale to consume massive amounts of compute very quickly to process large data volumes. While smoothed, a poorly optimized Spark job that scans excessive partitions can artificially inflate CU consumption. The <a href="https://fabric.dattasable.com/spark-estimator" style="color: var(--accent); text-decoration: underline;">Spark CU estimator</a> in Fabric Master can help model the impact of node sizing and execution time.</p>

<h3 style="color: var(--text); font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 1rem;">Warehouse</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Fabric’s distributed T-SQL engine provides relational data warehousing capabilities. SQL workloads consume CUs during concurrent queries, complex joins, and heavy ingestion transformations. Every BI consumption query directed at the warehouse utilizes CUs. Unoptimized queries scanning massive fact tables without proper filtering will burn CUs aggressively.</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      PBI[Power BI]
      DF[Data Factory]
      SPK[Spark]
      WH[Warehouse]
      AI[AI Functions]
      
      PBI --> SharedCap
      DF --> SharedCap
      SPK --> SharedCap
      WH --> SharedCap
      AI --> SharedCap
      
      SharedCap((Shared Fabric Capacity)) --> CUConsume[CU Consumption]
      CUConsume --> Util[Utilization]
      Util --> Perf[Performance / Throttling]
  </pre>
</div>

<p style="margin-bottom: 2rem; text-align: center;">
  <a href="https://fabric.dattasable.com/wizard" style="display: inline-block; background-color: var(--accent); color: white; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 6px; font-size: 1.1rem;">Calculate Your Fabric Capacity</a>
</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="how-much-capacity-headroom-should-you-keep" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">How Much Capacity Headroom Should You Keep?</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">A common misconception is that a capacity should target 100% utilization to maximize return on investment. Designing for 100% average utilization is functionally guaranteeing failure during peak periods. Headroom is not wasted compute; it is the operational shock absorber for your data platform.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Headroom absorbs unexpected bursts (e.g., an analyst runs a massive ad-hoc query), manages scheduling collisions (when a pipeline runs long and overlaps with early morning BI usage), and provides a buffer for natural organic growth before requiring a formal FinOps approval for an SKU upgrade.</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      subgraph Dattasable Capacity Headroom Model
      Base[Baseline Demand] --> Plus1(+)
      Plus1 --> Peak[Peak Demand]
      Peak --> Plus2(+)
      Plus2 --> Burst[Burst Buffer]
      Burst --> Plus3(+)
      Plus3 --> Growth[Growth Buffer]
      Growth --> Equals(=)
      Equals --> PlanReq[Planning Requirement]
      end
  </pre>
  <p style="text-align: center; font-size: 0.85rem; color: var(--muted); margin-top: 10px;"><em>Dattasable planning model</em></p>
</div>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Dattasable recommendation: Treat sustained peak utilization, workload concurrency, and growth headroom as separate planning dimensions rather than sizing from average utilization alone. Targeting roughly 70-80% utilization during known peak windows provides a sensible safety margin.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="fabric-capacity-throttling" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Fabric Capacity Throttling</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">When a capacity's smoothed CU consumption exceeds 100% of its provisioned limit, it enters capacity pressure. To protect the underlying service infrastructure and enforce the SKU limits, Microsoft Fabric initiates throttling.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Throttling applies in stages based on the severity of the overage:</p>
<ul style="line-height: 1.8; padding-left: 1.5rem; list-style-type: disc; margin-bottom: 2rem; color: var(--muted);">
    <li><strong>Interactive Delay:</strong> The first stage. Interactive operations (like a user clicking a Power BI visual or running a T-SQL query) are intentionally delayed. The system makes the request wait before execution.</li>
    <li><strong>Interactive Rejection:</strong> If pressure worsens, Fabric will flatly reject new interactive requests. Users receive errors indicating the capacity is overloaded.</li>
    <li><strong>Background Rejection:</strong> The most severe stage. Even background operations (like scheduled Data Factory pipelines or Semantic Model refreshes) are rejected and fail to run.</li>
</ul>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Fabric utilizes a "carryforward" mechanism. If you burn 200% of your capacity in one hour, the debt is carried forward. You must burn down this debt before full performance is restored. Persistent throttling indicates a fundamental architectural issue: you must optimize workloads, reschedule heavy jobs to off-peak hours, distribute workloads, increase capacity, or re-evaluate your entire capacity architecture.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><em>Crucial distinction:</em> Poor query performance is not automatically caused by capacity throttling. A poorly written query on an idle F128 will still be slow. Always diagnose the workload before assuming throttling is the culprit.</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart LR
      PerfIssue[Performance issue] --> CheckMetrics[Check Metrics]
      CheckMetrics --> Identify[Identify workload]
      Identify --> CheckUtil[Check utilization]
      CheckUtil --> CheckThrot[Check throttling]
      CheckThrot --> Opt[Optimize workload]
      Opt --> Rebal[Rebalance]
      Rebal --> Resize[Resize if required]
      Resize --> Mon[Monitor again]
  </pre>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="how-to-validate-your-capacity-size-using-the-microsoft-fabric-capacity-metrics-app" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">How to Validate Your Capacity Size Using the Microsoft Fabric Capacity Metrics App</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Microsoft documents the Capacity Metrics app as a mechanism for monitoring utilization and informing sizing decisions. It is the absolute source of truth for production telemetry.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">The practical validation loop involves:</p>
<ol style="line-height: 1.8; padding-left: 1.5rem; margin-bottom: 1rem; color: var(--muted);">
    <li><strong>Establish workload:</strong> Deploy your analytical solutions to the capacity.</li>
    <li><strong>Observe utilization:</strong> Use the Compute tab to monitor CU consumption trends over 14 days.</li>
    <li><strong>Identify peak timepoints:</strong> Locate the highest spikes in utilization.</li>
    <li><strong>Drill into operations:</strong> Use the Timepoint item detail drill-down to see exact interactive vs. background breakdown.</li>
    <li><strong>Identify top consumers:</strong> Find the specific item (e.g., an inefficient Notebook or semantic model) driving the burn.</li>
    <li><strong>Inspect throttling:</strong> Review the throttling information to see if delays or rejections have actively occurred.</li>
    <li><strong>Compare against SKU:</strong> Determine if your baseline + headroom comfortably fits the F-SKU.</li>
    <li><strong>Resize if justified:</strong> Scale up or down based on hard evidence.</li>
    <li><strong>Monitor again:</strong> Repeat the cycle.</li>
</ol>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="f-sku-decision-table" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">F-SKU Decision Table</h2>

<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">SKU</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">CUs</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Best-fit scenario</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Typical workload profile</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Growth considerations</th>
        <th style="padding: 12px; text-align: left; color: var(--text); font-weight: 600;">Warning signs that you may have outgrown it</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F2</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">2</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">POCs, Dev/Test</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Very light Power BI Import refreshes</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Scales poorly with any heavy data volumes</td>
        <td style="padding: 12px; color: var(--muted);">Frequent background rejections when testing Spark.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F4</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">4</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Small isolated reporting</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Scheduled ELT and simple semantic models</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Cannot handle complex concurrent background jobs</td>
        <td style="padding: 12px; color: var(--muted);">Struggles with large Direct Lake paging.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F8</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">8</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Departmental workloads</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Moderate analytical pipelines</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Limited by concurrency peaks</td>
        <td style="padding: 12px; color: var(--muted);">Long-running data factory pipelines causing interactive lag.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F16</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">16</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">SME data platforms</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Standard Warehouse queries, steady pipelines</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Provides buffer for increasing report concurrency</td>
        <td style="padding: 12px; color: var(--muted);">Interactive delays during morning peak login windows.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F32</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">32</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Medium enterprise multi-engine architecture</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Regular scheduled pipelines and heavy queries</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Good baseline for robust ELT, but watch concurrency</td>
        <td style="padding: 12px; color: var(--muted);">Heavy Spark jobs eating into Power BI reporting CUs.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F64</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">64</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Enterprise baseline, Free user report sharing</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Heavy Direct Lake models, concurrent Spark</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Solid baseline for onboarding new business units</td>
        <td style="padding: 12px; color: var(--muted);">Sustained 90%+ utilization preventing new workloads.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F128</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">128</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Large-scale global enterprise operations</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Massive KQL streaming, continuous ETL</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Consider splitting into multiple capacities by domain</td>
        <td style="padding: 12px; color: var(--muted);">Cost overhead outweighs the benefits of a single unified pool.</td>
      </tr>
    </tbody>
  </table>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="f32-vs-f64-when-should-you-upgrade" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">F32 vs F64: When Should You Upgrade?</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">The jump from F32 to F64 is the most critical decision point in Fabric capacity planning. F64 is the tier that unlocks Power BI Free user consumption (comparable to the old Power BI Premium P1 tier). However, beyond licensing, the compute difference is vast.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">You should upgrade from F32 to F64 when your workload intensity shifts from "departmental scheduled pipelines" to "enterprise continuous processing." If your Spark jobs require higher node counts for efficient parallelism, or if your Data Factory pipelines consistently collide with interactive Power BI users causing throttling, F64 provides the necessary compute depth to absorb these continuous shocks.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Warehouse workloads particularly benefit from F64 when concurrent complex queries are running. Heavy Direct Lake architectures similarly benefit when caching large datasets. If growth forecasting shows your F32 exceeding 80% baseline utilization, an upgrade is prudent.</p>

<p style="margin-bottom: 2rem; text-align: center;">
  <a href="https://fabric.dattasable.com/compare/f32-vs-f64" style="display: inline-block; background-color: var(--accent); color: white; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 6px; font-size: 1.1rem;">Compare F32 vs F64 comparison</a>
</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="capacity-sizing-example" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Capacity Sizing Example</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Imagine a fictional enterprise, Contoso Financial, evaluating Fabric. Their workload consists of high-concurrency Power BI interactive usage, massive overnight semantic model refreshes, continuous Data Factory pipelines, heavy Warehouse query patterns at month-end close, and some Spark jobs for forecasting.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><em>Illustrative Dattasable sizing example:</em></p>
<ul style="line-height: 1.8; padding-left: 1.5rem; margin-bottom: 1rem; color: var(--muted);">
    <li><strong>Baseline:</strong> 15 CUs continuous demand for background orchestration.</li>
    <li><strong>Peak:</strong> +25 CUs required during the 9:00 AM interactive login rush and month-end close overlap.</li>
    <li><strong>Concurrency Buffer:</strong> +10 CUs to handle simultaneous complex DAX queries.</li>
    <li><strong>Headroom & Growth:</strong> +14 CUs for unexpected bursts and next year's onboarding.</li>
    <li><strong>Total Planning Requirement:</strong> 64 CUs.</li>
</ul>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">This structured approach directs Contoso firmly toward an F64 SKU, ensuring stability during month-end close without flying blind into throttling.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="capacity-sizing-is-also-a-finops-problem" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Capacity Sizing Is Also a FinOps Problem</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Capacity planning and cost management are fundamentally linked. Over-provisioning wastes budget, while under-provisioning destroys user trust through poor performance. Effective FinOps in Fabric requires right-sizing the capacity, optimizing workload schedules (moving heavy ETL to weekends or nights where smoothing handles the load), and potentially separating workloads into multiple capacities (e.g., an F32 for production ELT and an F16 for Dev/Test) to isolate noisy neighbors and enact capacity consolidation.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">For a comprehensive look at the financial models underlying these decisions, review our <a href="/blog/microsoft-fabric-pricing-guide-2026" style="color: var(--accent); text-decoration: underline;" title="Fabric pricing">Microsoft Fabric pricing and capacity planning</a> guide.</p>

<p style="margin-bottom: 2rem; text-align: center;">
  <a href="https://fabric.dattasable.com/cost-calculator" style="display: inline-block; background-color: var(--accent); color: white; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 6px; font-size: 1.1rem;">Estimate Fabric Capacity Costs</a>
</p>

<h3 id="payg-vs-reserved" style="color: var(--text); font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 1rem;">PAYG vs Reserved Pricing</h3>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Fabric Capacities can be purchased via Pay-As-You-Go (PAYG) or Reserved Instances (typically a 1-year commitment horizon). PAYG is highly flexible—you can pause it or scale it dynamically, making it excellent for unpredictable workloads or short-term POCs. Reserved Instances require an upfront or monthly commitment but offer significantly lower effective hourly rates. The break-even point often heavily favors Reserved Instances if a capacity runs 24/7 for steady-state workloads. Evaluate your commitment horizons carefully using our <a href="https://fabric.dattasable.com/reserved-savings" style="color: var(--accent); text-decoration: underline;">Fabric reserved savings calculator</a>.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="dont-scale-the-capacity-before-you-diagnose-the-workload" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Don't Scale the Capacity Before You Diagnose the Workload</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Scaling up from F64 to F128 doubles your compute, but it also roughly doubles your cost. Before requesting a budget increase, enforce this troubleshooting checklist:</p>
<ul style="line-height: 1.8; padding-left: 1.5rem; list-style-type: disc; margin-bottom: 2rem; color: var(--muted);">
    <li>Are inefficient queries draining resources?</li>
    <li>Are Power BI models suffering from poor semantic model design (e.g., high-cardinality unused columns)?</li>
    <li>Are you running an excessive refresh frequency?</li>
    <li>Are Warehouse queries performing excessive full table scans instead of leveraging partitioning?</li>
    <li>Are Data Factory pipelines scheduled simultaneously, causing massive scheduling collisions?</li>
    <li>Are Spark jobs configured with massive driver nodes for tiny data manipulations?</li>
    <li>Can you implement better workload distribution?</li>
</ul>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Optimization before scaling is a golden rule in FinOps.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="calculate-your-fabric-capacity-requirement-with-fabric-master" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Calculate Your Fabric Capacity Requirement with Fabric Master</h2>
<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">Fabric Master v3.0 is an independent workload modeling, capacity planning, FinOps and decision-support platform designed specifically for Microsoft Fabric architects. It helps you translate abstract workloads into concrete F-SKU recommendations.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);"><em>Important Note:</em> Fabric Master provides a modeled assessment based on the workload assumptions entered by the user. Production decisions should always be validated against Microsoft Fabric Capacity Metrics and actual telemetry.</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart LR
      Inputs[User Inputs] --> Model[Workload Model]
      Model --> CUEst[CU Estimate]
      CUEst --> Cands[F-SKU Candidates]
      Cands --> Cost[Cost Model]
      Cost --> Growth[Growth Forecast]
      Growth --> Rec[Recommendation]
      Rec --> PDF[PDF Assessment]
      PDF --> Prod[Production Validation]
  </pre>
</div>

<h3 id="fabric-master-feature-mapping" style="color: var(--text); font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 1rem;">Fabric Master Feature Mapping</h3>
<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">Planning Need</th>
        <th style="padding: 12px; text-align: left; color: var(--text); font-weight: 600;">Fabric Master Capability</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Capacity sizing</td>
        <td style="padding: 12px; color: var(--muted);">Capacity Calculator</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">F-SKU selection</td>
        <td style="padding: 12px; color: var(--muted);">F-SKU Comparison</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Cost estimation</td>
        <td style="padding: 12px; color: var(--muted);">Cost Estimator</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Reserved pricing</td>
        <td style="padding: 12px; color: var(--muted);">Reserved Savings</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Spark workloads</td>
        <td style="padding: 12px; color: var(--muted);">Spark CU Estimator</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Power BI</td>
        <td style="padding: 12px; color: var(--muted);"><a href="https://fabric.dattasable.com/power-bi-capacity" style="color: var(--accent); text-decoration: underline;">Power BI Capacity planning</a></td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Enterprise assessment</td>
        <td style="padding: 12px; color: var(--muted);">Capacity Consultant</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">PDF reporting</td>
        <td style="padding: 12px; color: var(--muted);">Assessment Report</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">Pricing</td>
        <td style="padding: 12px; color: var(--muted);">Global Pricing Matrix</td>
      </tr>
    </tbody>
  </table>
</div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 id="faq" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Frequently Asked Questions (FAQ)</h2>
<dl style="margin-bottom: 2rem;">
    <dt style="font-weight: 600; color: var(--text); margin-bottom: 0.5rem;">What is Microsoft Fabric capacity sizing?</dt>
    <dd style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">It is the process of evaluating compute demand across Spark, SQL, Power BI, and integration workloads to select an appropriate F-SKU that prevents throttling while managing costs.</dd>

    <dt style="font-weight: 600; color: var(--text); margin-bottom: 0.5rem;">How are Capacity Units used in Fabric?</dt>
    <dd style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">Capacity Units (CUs) represent the shared compute pool. Every workload consumes a fraction of these CUs based on processing intensity, and background bursts are smoothed over time.</dd>

    <dt style="font-weight: 600; color: var(--text); margin-bottom: 0.5rem;">How do I choose a Fabric F-SKU?</dt>
    <dd style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">Catalog your workloads, model peak concurrency, define headroom for growth, and evaluate throttling risks, then map that requirement to a specific tier (e.g., F32 vs F64).</dd>

    <dt style="font-weight: 600; color: var(--text); margin-bottom: 0.5rem;">Is F32 enough for Microsoft Fabric?</dt>
    <dd style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">F32 is excellent for medium enterprise workloads, but lacks the Power BI Free user consumption capabilities of F64. If your organization relies heavily on free report viewers, F64 is typically the baseline.</dd>

    <dt style="font-weight: 600; color: var(--text); margin-bottom: 0.5rem;">When should I move from F32 to F64?</dt>
    <dd style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">Upgrade when background tasks consistently collide with interactive queries, causing sustained throttling, or when you need Power BI free user viewing capabilities.</dd>

    <dt style="font-weight: 600; color: var(--text); margin-bottom: 0.5rem;">What causes Fabric capacity throttling?</dt>
    <dd style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">Throttling occurs when the smoothed CU consumption exceeds the capacity's limit. This triggers interactive delays, interactive rejections, and eventually background job failures.</dd>

    <dt style="font-weight: 600; color: var(--text); margin-bottom: 0.5rem;">How much headroom should I keep?</dt>
    <dd style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">Aim for roughly 70-80% peak utilization. The remaining 20-30% acts as an operational buffer against unexpected spikes and concurrent organic growth.</dd>

    <dt style="font-weight: 600; color: var(--text); margin-bottom: 0.5rem;">Can Fabric Master calculate my required capacity?</dt>
    <dd style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">Yes, Fabric Master provides comprehensive modeling tools to estimate CU consumption across various workload assumptions.</dd>

    <dt style="font-weight: 600; color: var(--text); margin-bottom: 0.5rem;">Is Fabric Master an official Microsoft sizing tool?</dt>
    <dd style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">No, Fabric Master is an independent decision-support platform. All modeled estimates must be validated against actual production telemetry via the Microsoft Capacity Metrics app.</dd>
    
    <dt style="font-weight: 600; color: var(--text); margin-bottom: 0.5rem;">How should I validate a capacity recommendation?</dt>
    <dd style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">Use the Microsoft Fabric Capacity Metrics app over a realistic 14-day cycle, analyzing peak timepoints and identifying top CU consumers to verify the modeled estimate.</dd>

    <dt style="font-weight: 600; color: var(--text); margin-bottom: 0.5rem;">What is the difference between PAYG and Reserved capacity?</dt>
    <dd style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">PAYG (Pay-As-You-Go) is flexible and can be paused, suitable for ad-hoc processing. Reserved instances involve a term commitment (e.g., 1 year) in exchange for significantly reduced hourly rates.</dd>

    <dt style="font-weight: 600; color: var(--text); margin-bottom: 0.5rem;">Can workload optimization reduce the required Fabric SKU?</dt>
    <dd style="color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7;">Absolutely. Tuning DAX models, optimizing T-SQL queries, and properly sizing Spark nodes can drastically reduce CU burn, avoiding expensive SKU upgrades.</dd>
</dl>

<p style="margin-bottom: 2rem; text-align: center;">
  <a href="https://fabric.dattasable.com/wizard" style="display: inline-block; background-color: var(--accent); color: white; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 6px; font-size: 1.1rem;">Generate an Enterprise Fabric Capacity Assessment</a>
</p>
`
};
