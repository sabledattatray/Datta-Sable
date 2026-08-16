export const microsoftFabricOneLakeArchitectureGuidePost = {
  id: "microsoft-fabric-onelake-architecture-guide",
  slug: "microsoft-fabric-onelake-architecture-guide",
  title: "OneLake Explained: The Complete Microsoft Fabric OneLake Architecture Guide (2026 Edition)",
  category: "Microsoft Fabric",
  excerpt: "The definitive architecture guide to Microsoft Fabric OneLake — covering Delta Lake, V-Order, Shortcuts, Mirroring, Direct Lake, security, governance, migration, troubleshooting, and certification tips for DP-600 and DP-700.",
  readTime: 42,
  date: "July 15, 2026",
  icon: "🌊",
  image: "/images/blog/OneLake a data lake.webp",
  tags: ["Microsoft Fabric", "OneLake", "Direct Lake", "Delta Lake", "Data Mesh", "Shortcuts", "Mirroring", "DP-600", "DP-700", "Data Architecture", "Enterprise Data"],
  content: `<!-- BREADCRUMB_START -->
<div class="breadcrumb-container" style="font-family: monospace; font-size: 0.8rem; margin-bottom: 2rem; color: var(--muted); border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
  <a href="/" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Home</a> &gt; 
  <a href="/blog" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Blog</a> &gt; 
  <a href="/blog/microsoft-fabric" style="color: var(--accent); text-decoration: none; font-weight: 600;">Microsoft Fabric Hub</a> &gt; 
  <span style="color: var(--text);">OneLake Explained: The Complete Microsoft Fabric OneLake Architecture Guide (2026 Edition)</span>
</div>
<!-- BREADCRUMB_END -->
<div style="padding: 1rem; border-left: 4px solid var(--accent); background: var(--surface2); margin: 1.5rem 0; border-radius: 4px;"><strong>Enterprise Resource:</strong> For a complete security and compliance framework, read our guide to <a href="/blog/microsoft-fabric-governance-purview-guide-2026" style="color: var(--accent); text-decoration: underline;">OneLake governance</a>.</div>

<div class="featured-snippet" style="background: rgba(201, 243, 29, 0.05); padding: 1.5rem; border-left: 4px solid var(--accent); border-radius: 0 8px 8px 0; margin-bottom: 2rem; font-size: 1.1rem; line-height: 1.8; color: var(--text);"><p><strong>Looking for the most comprehensive OneLake architecture guide for 2026?</strong> This definitive resource covers OneLake internal architecture, Delta Lake foundations, V-Order, Shortcuts, Mirroring, <a href="/blog/power-bi-direct-lake-performance-tuning-fabric" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Direct Lake Explained">Direct Lake</a>, security, governance, CI/CD, cost optimization, migration from ADLS Gen2/Synapse/Databricks — plus 30 FAQs, a decision matrix, best practices checklist, and DP-600/DP-700 certification tips.</p></div>
<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Executive Summary</h2>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;"><a href="/blog/microsoft-fabric-architecture-explained-2026" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Microsoft Fabric Architecture Guide">Microsoft Fabric</a> represents the most significant shift in Microsoft's data platform strategy since the launch of Azure Synapse Analytics. At the absolute core of this SaaS analytics platform is <strong>OneLake</strong> — a single, unified, logical data lake for the entire organization that fundamentally changes how enterprises store, access, and govern data at scale.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Just as Microsoft OneDrive provides a single storage location for all office documents regardless of which device or application created them, OneLake acts as the single repository for all enterprise data — eliminating silos, preventing data duplication, and collapsing the governance fragmentation that defined the previous decade of cloud analytics architectures.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">This guide is the most comprehensive technical reference to OneLake available. Whether you are a data engineer designing your first Microsoft Fabric architecture, an analytics engineer preparing for the <a href="/blog/dp-600-study-guide-2026" class="autolink" style="color: var(--accent); text-decoration: underline;" title="DP-600 Study Guide">DP-600</a> or DP-700 certifications, a solution architect migrating from Azure Synapse or Databricks, or a data platform leader evaluating Microsoft Fabric for enterprise adoption — this guide covers every technical layer of OneLake in depth.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Key Takeaways</h2>

<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Single Logical Tenant</strong>: OneLake is provisioned automatically with every Microsoft Fabric tenant. There is only one OneLake per tenant, and all workspaces within that tenant share this unified logical namespace.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Open Storage Standards</strong>: OneLake stores all tabular data in <strong>Delta Lake (Parquet)</strong> format. This open format ensures any compute engine — Fabric Spark, SQL, Power BI, even external Databricks — can read data without format conversion or ETL.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>The OneCopy Principle</strong>: Data stored in OneLake exists as a single physical copy. Multiple compute engines read from the same Delta files simultaneously — there is no Import Mode copy, no warehouse copy, no reporting layer copy.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>V-Order Serialization</strong>: Microsoft applies a proprietary write-optimization called <strong>V-Order</strong> to Parquet files in OneLake, enabling sub-second <a href="/blog/power-bi-direct-lake-performance-tuning-fabric" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Direct Lake performance tuning guide">Direct Lake</a> query performance in Power BI without data movement.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Data Virtualization via Shortcuts</strong>: Shortcuts allow OneLake to reference data in other workspaces, Azure Data Lake Storage Gen2, Amazon S3, or Google Cloud Storage without moving or duplicating the underlying files.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Zero-ETL Mirroring</strong>: Mirroring continuously replicates operational databases (Azure SQL, Cosmos DB, Snowflake, MongoDB) directly into OneLake in Delta format using Change Data Capture — with no ETL pipelines required.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Direct Lake Mode</strong>: Power BI Semantic Models query OneLake Delta tables directly without importing data into VertiPaq memory or running live DirectQuery, combining the speed of Import with the freshness of DirectQuery.</li></ol>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">1. Why Microsoft Built OneLake: The Vision and History</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">The Problem Microsoft Was Solving</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Between 2015 and 2023, enterprises building cloud analytics platforms on Azure assembled complex stacks: Azure Data Factory for ingestion, Azure Data Lake Storage Gen2 for raw storage, Azure Synapse Analytics or Databricks for transformation, Azure Analysis Services or Power BI Premium for reporting. Each service was excellent in isolation. Together, they created extraordinary operational complexity:</p>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Data was copied 3-4 times</strong>: Raw → Bronze Lake → Silver Warehouse → Gold Power BI Import Model.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>ETL pipelines consumed 60% of engineering time</strong>: Just keeping copies synchronized.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Security was fragmented</strong>: ADLS ACLs, Synapse SQL RBAC, Power BI workspace roles — all configured independently.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Governance was impossible</strong>: Data lineage could not span service boundaries without expensive third-party tooling.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Costs were unpredictable</strong>: Storage and compute were billed independently across 6+ services.</li></ul>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Microsoft's engineering team spent three years solving this at the platform level, not at the application level. The result was <strong>Microsoft Fabric</strong>, launched in general availability in November 2023, with OneLake as its architectural foundation.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">The Architectural Philosophy</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">OneLake is not a feature of <a href="/blog/microsoft-fabric-architecture-explained-2026" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Microsoft Fabric architecture">Microsoft Fabric</a>. It is the foundation that makes Microsoft Fabric architecturally coherent. Every design decision in Fabric flows from three storage-layer commitments:</p>

<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>One physical copy of data</strong> — the OneCopy Principle.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Open format for all tabular data</strong> — Delta Lake on Parquet.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>SaaS-managed infrastructure</strong> — no storage accounts, no firewall rules, no resource keys.</li></ol>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Without these three commitments, Fabric would be yet another analytics suite of loosely coupled services. With them, it becomes a coherent platform where a data engineer's Bronze table, an analytics engineer's Gold semantic model, and a data scientist's training dataset are the same physical bytes.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">2. The OneCopy Principle: One Physical Copy, Many Engines</h2>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">The single most important concept in OneLake architecture is the <strong>OneCopy Principle</strong>: data stored in OneLake exists as exactly one physical copy of files, readable by every authorized compute engine simultaneously.</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;"><pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.82rem; line-height: 1.5; white-space: pre;">flowchart TD
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">subgraph OneLake ["OneLake — Single Physical Storage"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DeltaFiles["Delta Parquet Files\\n(fact_sales, dim_customer, etc.)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">end</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">subgraph Engines ["Compute Engines — All Read the Same Files"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Spark["🔥 Spark Notebooks\\nWrite + Read"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SQL["🗃️ SQL Analytics Endpoint\\nRead-only SQL"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">PBI["📊 Power BI Direct Lake\\nSub-second queries"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">ADF["⚙️ Data Factory\\nCopy + Transform"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DS["🧠 Data Science\\nNotebook ML Training"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">end</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DeltaFiles --&gt; Spark</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DeltaFiles --&gt; SQL</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DeltaFiles --&gt; PBI</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DeltaFiles --&gt; ADF</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DeltaFiles --&gt; DS</p>
</pre></div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Before OneCopy: The Data Multiplication Problem</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">In a traditional architecture, the same <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">fact_sales</code> data existed in:</p>
<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">ADLS Gen2 as raw CSV files (ingestion layer)</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Synapse dedicated SQL pool tables (warehouse layer)</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Power BI <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">.pbix</code> VertiPaq columnar model (reporting layer)</li></ul>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Three copies. Three pipeline jobs keeping them in sync. Three access control systems. Three places to apply data quality rules.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">After OneCopy: The Unified Storage Reality</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">In OneLake, <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">fact_sales</code> is a Delta Parquet table in the <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code> directory of a Lakehouse. That is the only copy. The SQL Analytics Endpoint reads it directly. Power BI Direct Lake loads its V-Ordered columns directly into VertiPaq memory. Spark notebooks read and write it using standard Delta APIs. A Data Factory pipeline can also read it. Every engine, same files.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">3. OneLake Internal Architecture Deep Dive</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Physical Infrastructure</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">OneLake is built on top of <strong>Azure Data Lake Storage Gen2</strong> (ADLS Gen2). This means it inherits Azure's enterprise-grade storage characteristics: 99.9999999999% (12 nines) durability, geo-redundant replication options, 10Gbps+ throughput, and hierarchical namespace support for efficient file system operations.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">However, OneLake completely abstracts the ADLS Gen2 infrastructure layer from the user. There are no storage accounts to provision, no SAS tokens to manage, no firewall rules to configure, no container endpoints to expose. Microsoft provisions, manages, and scales the underlying ADLS Gen2 infrastructure as part of the Fabric SaaS offering.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">The Logical Namespace Hierarchy</h3>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;"><pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.82rem; line-height: 1.5; white-space: pre;">flowchart TD
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Tenant["🏢 Fabric Tenant\\n(Organization Level)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Tenant --&gt; Domain1["📁 Domain: Finance"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Tenant --&gt; Domain2["📁 Domain: Operations"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Tenant --&gt; Domain3["📁 Domain: Marketing"]</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Domain1 --&gt; WS1["🗂️ Workspace: Finance_Ingest"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Domain1 --&gt; WS2["🗂️ Workspace: Finance_Analytics"]</p>
    
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">WS1 --&gt; LH1["🏠 Lakehouse: raw_financial_data"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">WS2 --&gt; WH1["🏛️ Warehouse: finance_gold"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">WS2 --&gt; SEM1["📊 Semantic Model: Executive KPIs"]</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">LH1 --&gt; Files["Files/\\n(CSV, JSON, PDF)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">LH1 --&gt; Tables["Tables/\\n(Delta Parquet)"]</p>
</pre></div>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Hierarchy Level</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Description</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Governance Scope</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Tenant</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">One per organization. One OneLake per tenant.</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Fabric Admin Portal</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Domain</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Logical grouping of workspaces by business unit</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Domain Admin</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Workspace</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Collaborative project folder, assigned to a Capacity</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Workspace Admin</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Item</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Lakehouse, Warehouse, Pipeline, Semantic Model, etc.</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Item Owner</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Files/Tables</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Physical data within a Lakehouse</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">OneLake Data Access Roles</td></tr></tbody></table></div>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">OneLake DFS Endpoint</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">OneLake exposes a standard ADLS Gen2-compatible DFS (Distributed File System) endpoint:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">https://onelake.dfs.fabric.microsoft.com/{workspace}/{item}.Lakehouse/Tables/{table}/
</code></pre></div>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">This means any tool that understands ADLS Gen2 — Azure Storage Explorer, Spark, azcopy, the Azure SDK — can read from and write to OneLake using the same code that previously targeted ADLS Gen2 storage accounts. This dramatically simplifies migrations.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">4. OneLake vs Azure Data Lake Storage Gen2: Detailed Comparison</h2>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Dimension</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">OneLake</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">ADLS Gen2</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Provisioning</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Automatic with Fabric tenant</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Manual storage account creation</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Authentication</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Microsoft Entra ID (OAuth 2.0)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Entra ID, SAS tokens, storage keys</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Namespace</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Hierarchical (tenant/workspace/item)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Container-based (account/container/path)</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Storage Format</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Delta Lake enforced for tables</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Any format (no enforcement)</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Multi-engine Access</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Native (Spark, SQL, Power BI share files)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Requires separate configuration per engine</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Governance</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Fabric roles + Purview (unified)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">ADLS ACLs + separate Purview policy</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Shortcuts</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Built-in (can point to ADLS Gen2)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Not applicable</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Mirroring</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Built-in CDC replication</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Not applicable</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>V-Order</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Applied automatically by Fabric engines</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Not applied</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Cost Model</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Bundled in <a href="/blog/microsoft-fabric-pricing-guide-2026" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Microsoft Fabric Pricing Guide">Fabric capacity</a> + storage rate</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Separate storage account billing</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Firewall</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Managed by Microsoft</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">User-configured per account</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Region</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Co-located with <a href="/blog/microsoft-fabric-pricing-guide-2026" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Fabric capacity planning">Fabric capacity</a></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">User-selected</td></tr></tbody></table></div>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">5. Delta Lake Foundations: The Storage Engine of OneLake</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Why Delta Lake?</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">OneLake mandates <strong>Delta Lake</strong> as the table format for all tabular data. Delta Lake is an open-source storage layer created by Databricks and donated to the Linux Foundation. OneLake's adoption of Delta Lake is one of Microsoft's most strategically significant decisions — it ensures that data written by a Microsoft Fabric Lakehouse is directly readable by Databricks, open-source Spark, DuckDB, Polars, and any other Delta-aware compute engine without an export step.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Delta Lake Physical Structure</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Every Delta table in OneLake consists of exactly two components:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">fact_sales/
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">├── _delta_log/</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">│   ├── 00000000000000000000.json    ← Commit 0: CREATE TABLE</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">│   ├── 00000000000000000001.json    ← Commit 1: INSERT (Append)</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">│   ├── 00000000000000000002.json    ← Commit 2: UPDATE</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">│   └── 00000000000000000010.checkpoint.parquet  ← Checkpoint (every 10 commits)</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">├── part-00000-abc123.c000.snappy.parquet   ← Data file 1</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">├── part-00001-def456.c000.snappy.parquet   ← Data file 2</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">└── part-00002-ghi789.c000.snappy.parquet   ← Data file 3</p>
</code></pre></div>

<strong>The transaction log</strong> (<code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">_delta_log/</code>) is what makes Delta Lake more than just Parquet files. Every insert, update, delete, schema change, or partition operation is atomically recorded as a JSON commit entry. The checkpoint file, created every 10 commits by default, compacts the log for faster reads.

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">ACID Guarantees in OneLake</h3>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">ACID Property</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Delta Lake Implementation</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Atomicity</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">A transaction either commits fully (all files listed in the log entry) or not at all</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Consistency</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Schema enforcement rejects writes that violate the table's declared schema</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Isolation</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Snapshot isolation allows concurrent reads while writes are in progress</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Durability</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Committed transactions are permanent; Azure's ADLS Gen2 provides geo-redundant backup</td></tr></tbody></table></div>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Time Travel</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Delta's transaction log enables <strong>time travel queries</strong> — querying the table as it existed at a previous point in time or at a specific version number:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">SELECT * FROM fact_sales VERSION AS OF 5;
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SELECT * FROM fact_sales TIMESTAMP AS OF '2026-06-01';</p>
</code></pre></div>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">This is invaluable for auditing, recovering from accidental deletes, and debugging pipeline failures.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Parquet: The Column-Oriented Format</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Delta Lake stores data in <strong>Apache Parquet</strong> files. Parquet is a column-oriented storage format, meaning that values from the same column are stored physically adjacent on disk. This layout has profound performance implications for analytical queries:</p>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Column pruning</strong>: A <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">SELECT SalesAmount, Region</code> query only reads two columns from disk, even if the table has 200 columns.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Predicate pushdown</strong>: A <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">WHERE Region = 'APAC'</code> filter is evaluated at the Parquet reader level using min/max statistics stored in row group metadata, skipping entire row groups that cannot contain matching rows.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Compression efficiency</strong>: Columnar data compresses far more effectively than row data because similar values are grouped together (e.g., a <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Status</code> column with 3 distinct values across 100M rows compresses to near-zero).</li></ul>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">6. V-Order: Microsoft's Proprietary Write Optimization Engine</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">What V-Order Does</h3>

<strong>V-Order</strong> is a proprietary write optimization that Microsoft applies to Parquet files written to OneLake by any Fabric compute engine (Spark, Data Factory Copy, Dataflow Gen2, Warehouse). V-Order is a post-compression, pre-write sorting and encoding step that reorganizes the internal layout of each Parquet row group to match the memory model expected by the <strong>Power BI VertiPaq engine</strong>.

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Specifically, V-Order applies:</p>
<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Vertical (columnar) sorting</strong> within each row group to increase value locality.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Microsoft-proprietary compression</strong> on top of standard Parquet encodings (dictionary, RLE, delta).</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Optimized dictionary ordering</strong> to improve encoding ratios for low-cardinality columns.</li></ol>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Why V-Order Matters for Direct Lake</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">When Power BI opens a Direct Lake semantic model, the VertiPaq engine reads column data directly from OneLake Parquet files into its in-memory cache. With standard Parquet files, VertiPaq must decode and re-encode column data to match its internal memory format — a CPU-intensive step.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">With V-Ordered Parquet files, the on-disk layout is already aligned with VertiPaq's memory model. The engine reads and loads column segments in a single pass without transformation overhead, achieving:</p>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Sub-second query performance</strong> on tables with billions of rows.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Reduced memory pressure</strong> during initial column loading.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Faster cold-start</strong> times when a report first loads.</li></ul>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Enabling and Verifying V-Order</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">V-Order is enabled by default in all Fabric Spark runtimes. You can verify it is enabled:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">spark.conf.get("spark.sql.parquet.vorder.enabled")
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">// Expected: "true"</p>
</code></pre></div>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">To explicitly enable it in a Spark session:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">spark.conf.set("spark.sql.parquet.vorder.enabled", "true")
</code></pre></div>

<blockquote style="border-left: 4px solid var(--border); padding: 0.5rem 1rem; margin: 1.5rem 0; color: var(--muted); font-style: italic;"><strong>Note</strong>: V-Order adds 5-15% overhead during the write operation. This is a deliberate trade-off — you pay a small write cost once to gain significant read performance improvements for every subsequent query.</blockquote>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">7. OneLake Shortcuts: Data Virtualization Architecture</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">What a Shortcut Is</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">A <strong>Shortcut</strong> is a logical pointer stored in OneLake's metadata that makes external data appear as native OneLake content. When you create a shortcut, OneLake does not copy any files. It stores only the target path, the credential reference, and the mount location. At query time, OneLake resolves the shortcut transparently.</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;"><pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.82rem; line-height: 1.5; white-space: pre;">flowchart LR
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">subgraph WS_A["Workspace A / Lakehouse"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Native["📄 raw_logs/\\n(Native Delta Files)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SC1["🔗 aws_billing/\\n(S3 Shortcut)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SC2["🔗 customer_crm/\\n(ADLS Shortcut)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SC3["🔗 finance_dim/\\n(Internal Shortcut)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">end</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">subgraph External["External Storage"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">S3["☁️ Amazon S3\\ns3://acme-billing/"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">ADLS["🔵 Azure ADLS Gen2\\nabfss://crm@storage.dfs.core.windows.net/"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">end</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">subgraph Internal["Another Workspace"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">LH2["🏠 Finance Lakehouse\\nTables/DimCustomer"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">end</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SC1 -.-&gt;|"Resolves at query time\\n(no data copy)"| S3</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SC2 -.-&gt;|"Resolves at query time\\n(no data copy)"| ADLS</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SC3 -.-&gt;|"Resolves at query time\\n(no data copy)"| LH2</p>
</pre></div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Types of Shortcuts</h3>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Shortcut Type</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Source</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Use Case</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Internal</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Another Fabric workspace</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Share Gold tables between departments without data duplication</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>ADLS Gen2</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Azure Data Lake Storage Gen2</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Migrate existing ADLS investments step-by-step; keep existing pipelines running</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Amazon S3</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">AWS S3 (and S3-compatible: MinIO, Cloudflare R2)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Multi-cloud data access; connect existing AWS data lake</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Google Cloud Storage</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">GCS buckets</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Cross-cloud analytics without data movement</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Dataverse</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Microsoft Dataverse tables</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Connect Power Platform and Fabric without exports</td></tr></tbody></table></div>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Shortcut Resolution at Runtime</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">When a Spark job or SQL query accesses a shortcut path:</p>

<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">The compute engine sends a file list request to the OneLake DFS endpoint.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">OneLake's metadata service detects the path is a shortcut.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">OneLake retrieves the credentials stored in Fabric's secure credential store (managed identities or service principal certificates).</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">OneLake generates a scoped, short-lived access token for the target storage.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">The compute engine's storage driver accesses the target (S3, ADLS, etc.) directly, streaming data blocks to its compute nodes.</li></ol>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">The query engine sees no difference between native OneLake files and shortcut-mounted files. Both appear under the same DFS namespace.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Performance Considerations for Shortcuts</h3>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Same Azure region</strong>: Network latency is negligible (< 1ms). Performance is nearly identical to native OneLake tables.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Cross-Azure region</strong>: Expect 5-20ms additional latency per request. For large analytical scans, this adds up. Consider caching or replication.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Cross-cloud (S3, GCS)</strong>: Network egress costs apply from the source cloud. Cross-cloud latency can be 20-100ms per request. For frequently queried data, mirroring is preferable over shortcuts.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Shortcut to Delta tables</strong>: Full Delta features (time travel, ACID) work when the shortcut targets a Delta table. Non-Delta files (CSV, Parquet without Delta log) are accessible but lack transaction guarantees.</li></ul>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">8. Mirroring: Zero-ETL Real-Time Database Replication</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">The Problem Mirroring Solves</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Every enterprise has operational databases (Azure SQL, Azure Cosmos DB, Snowflake, MySQL, MongoDB) that contain the freshest transactional data. Getting that data into a data lake for analytics traditionally required building and maintaining complex ETL pipelines — scheduled extracts, change detection logic, upsert handling, error recovery.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Mirroring eliminates this entire layer. It connects directly to the database's transaction log and streams changes into OneLake continuously, with latency measured in seconds.</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;"><pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.82rem; line-height: 1.5; white-space: pre;">flowchart LR
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">subgraph Source["Operational Database"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DB["🗄️ Azure SQL / Cosmos DB\\n/ Snowflake / MongoDB"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">TLog["📋 Transaction Log\\n(CDC Enabled)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DB --&gt; TLog</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">end</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">subgraph Fabric["Microsoft Fabric"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Agent["⚙️ Mirroring Agent\\n(Managed by Fabric)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Landing["📥 Landing Zone\\n(Raw CDC Events)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Delta["📦 Delta Parquet Files\\nV-Order Applied"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SQLEndpoint["🗃️ SQL Analytics Endpoint\\n(Auto-updated)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">PBI["📊 Power BI Reports\\n(Near Real-Time)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">end</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">TLog --&gt;|"CDC Stream\\n(seconds latency)"| Agent</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Agent --&gt; Landing</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Landing --&gt; Delta</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Delta --&gt; SQLEndpoint</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Delta --&gt; PBI</p>
</pre></div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Supported Mirroring Sources (2026)</h3>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Source</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">CDC Mechanism</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Latency</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Full/Incremental</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Azure SQL Database</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">SQL Server CDC (log-based)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">< 30 seconds</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Both</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Azure Cosmos DB (NoSQL)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Change Feed</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">< 60 seconds</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Both</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Snowflake</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Snowflake Streams</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">< 5 minutes</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Incremental</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">MongoDB Atlas</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Change Streams</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">< 60 seconds</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Incremental</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Azure SQL Managed Instance</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">SQL Server CDC</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">< 30 seconds</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Both</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Azure Database for PostgreSQL</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Logical Replication</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">< 60 seconds</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Incremental</td></tr></tbody></table></div>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">How Mirroring Works — Technical Detail</h3>

<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>CDC Activation</strong>: Fabric enables Change Data Capture on the source database's transaction log or uses a native streaming API (Cosmos Change Feed, Mongo Change Streams).</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Event Capture</strong>: The Mirroring Agent (a managed Fabric service, not a customer-deployed component) reads uncommitted change events from the log in real time.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Serialization</strong>: Each CDC event (INSERT, UPDATE, DELETE) is serialized into a Parquet row with metadata columns: <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">_change_type</code>, <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">_commit_version</code>, <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">_commit_timestamp</code>.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>V-Order + Delta Commit</strong>: The agent applies V-Order and writes the changes as Delta table commit entries in the Mirrored Database item in OneLake.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>SQL Endpoint Auto-update</strong>: The SQL Analytics Endpoint's metadata cache is invalidated, making the new rows immediately queryable via T-SQL.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Merge Logic</strong>: The Mirroring engine periodically runs a MERGE operation to apply updates and deletes to the base table, compacting the Delta log.</li></ol>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Mirroring vs Shortcuts: When to Use Which</h3>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Scenario</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Use Shortcut</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Use Mirroring</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Source is a file store (ADLS, S3, GCS)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Source is a transactional database</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Need near real-time freshness</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Source data rarely changes</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌ (wasteful)</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Need full ACID table in OneLake</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Need to avoid database load</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅ (log-based, minimal impact)</td></tr></tbody></table></div>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">9. Domains and Workspace Hierarchy: Organizing at Scale</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Why Domains Exist</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">A large enterprise can have hundreds or thousands of Fabric workspaces. Without organizational structure, OneLake becomes a flat namespace that is difficult to govern, navigate, and delegate. <strong>Domains</strong> provide a hierarchical grouping layer above workspaces that maps to business units, regions, or data mesh design patterns.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Domains in Practice</h3>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;"><pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.82rem; line-height: 1.5; white-space: pre;">flowchart TD
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Tenant["🏢 Enterprise Tenant"]</p>
    
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Tenant --&gt; FinanceDomain["📁 Finance Domain\\n(Domain Admin: CFO Office)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Tenant --&gt; OpsDomain["📁 Operations Domain\\n(Domain Admin: COO Office)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Tenant --&gt; MarketingDomain["📁 Marketing Domain\\n(Domain Admin: CMO Office)"]</p>
    
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">FinanceDomain --&gt; FinIngest["Workspace: Finance_Ingestion"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">FinanceDomain --&gt; FinAnalytics["Workspace: Finance_Analytics"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">FinanceDomain --&gt; FinReporting["Workspace: Finance_Reports"]</p>
    
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">OpsDomain --&gt; OpsIngest["Workspace: Ops_Ingestion"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">OpsDomain --&gt; OpsGold["Workspace: Ops_Gold"]</p>
    
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">MarketingDomain --&gt; MktCDP["Workspace: Marketing_CDP"]</p>
</pre></div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Domain Governance Features</h3>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Domain-scoped Admin roles</strong>: Domain Admins can manage all workspaces within their domain without having Fabric Tenant Admin rights.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Domain-level default sensitivity labels</strong>: All workspaces in a domain can inherit a sensitivity label policy.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Cross-domain shortcuts</strong>: A Marketing workspace can create an Internal Shortcut to a Finance Gold table without either domain admin needing to create a new workspace.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Domain metadata in Purview</strong>: Microsoft Purview displays data assets organized by domain for catalog browsing and lineage.</li></ul>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">10. Lakehouse Storage: Files and Tables</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">The Lakehouse as a Storage Item</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">A <strong>Fabric Lakehouse</strong> is the primary storage item for data engineering workloads. It exposes two distinct storage zones within OneLake:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">my_lakehouse.Lakehouse/
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">├── Files/          ← Unstructured or semi-structured data (any format)</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">│   ├── raw_uploads/</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">│   │   ├── 2026-07-15_transactions.csv</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">│   │   └── sensor_data.json</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">│   └── notebooks/</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">│       └── analysis.ipynb</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">└── Tables/         ← Managed Delta Lake tables (enforced by Fabric)</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">├── fact_sales/</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">│   ├── _delta_log/</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">│   └── *.parquet</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">└── dim_customer/</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">├── _delta_log/</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">└── *.parquet</p>
</code></pre></div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Files Directory</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">The <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Files/</code> directory accepts any format — CSV, JSON, Parquet, AVRO, ORC, XML, PDF, images, binaries. This is the raw ingestion zone. There are no schema enforcement constraints. A Data Factory pipeline can write raw API responses as JSON files here. A Python notebook can write model artifacts as pickle files here. Spark can read any of these formats directly.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Tables Directory</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">The <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code> directory is schema-enforced. Every table stored here must be in Delta Lake format. When a Spark notebook writes a Delta table to <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code>, the SQL Analytics Endpoint automatically discovers and registers it as a readable SQL view — without any manual schema registration.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">This auto-discovery is a powerful feature. Data engineers write tables via Spark; SQL analysts immediately query them via T-SQL through the endpoint, with no intermediary step.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">SQL Analytics Endpoint</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Every Lakehouse automatically provisions a <strong>SQL Analytics Endpoint</strong> — a read-only SQL serverless compute layer that translates T-SQL queries into Parquet file reads against the Lakehouse's <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code> directory. The endpoint is a serverless compute surface; there is no SQL pool to manage, no index to build, no statistics to update manually.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">This means a data analyst who only knows T-SQL can run queries like <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">SELECT TOP 100 * FROM fact_sales WHERE region = 'APAC'</code> against Delta files that were written by a data engineer using PySpark — without either party needing to know how the other works.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">11. Data Warehouse Storage in OneLake</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">How Fabric Warehouse Stores Data</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Unlike the Lakehouse, where tables are created via Spark or file uploads, the <strong>Fabric Data Warehouse</strong> is a fully managed T-SQL engine where tables are created using standard DDL:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">CREATE TABLE dbo.fact_sales (
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SaleID INT,</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">CustomerID INT,</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SalesAmount DECIMAL(18,2),</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SaleDate DATE</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">);</p>
</code></pre></div>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Despite this SQL-first interface, the Fabric Data Warehouse does <strong>not</strong> store data in proprietary SQL Server database files (<code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">.mdf</code>, <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">.ndf</code>). Every table in the Fabric Data Warehouse is stored as Delta Parquet files in OneLake, under the warehouse's folder in the workspace.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">This architectural decision has a profound consequence: <strong>Warehouse tables are readable by Spark and Power BI Direct Lake without any export step</strong>. The Lakehouse and Warehouse are the same physical storage layer viewed through different compute interfaces.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Lakehouse vs Warehouse: Decision Framework</h3>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Consideration</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Choose Lakehouse</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Choose Warehouse</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Primary users</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Data engineers, data scientists</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">SQL analysts, DBAs</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Primary interface</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Spark notebooks, Python</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">T-SQL, SQL views</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Table creation method</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Spark WRITE, Delta API</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">T-SQL CREATE TABLE</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Schema enforcement</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Flexible (schema-on-read for Files/)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Strict (schema-on-write)</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Streaming workloads</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅ Spark Structured Streaming</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Complex SQL transactions</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Limited</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅ Full T-SQL ACID</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Cross-database queries</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Shortcut-based</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅ Native via three-part naming</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Power BI Direct Lake</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td></tr></tbody></table></div>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">12. Semantic Models and Direct Lake: Query Flow Architecture</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">The Three Power BI Query Modes</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Before Direct Lake, Power BI had two query modes:</p>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Import Mode</strong>: Data is extracted from the source and loaded into VertiPaq's in-memory compressed columnar store. Queries are extremely fast. But data goes stale between refreshes, and refresh jobs consume compute and time.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>DirectQuery Mode</strong>: Every report interaction fires a live SQL query to the source database. Data is always fresh. But query latency is high (seconds per visual), and the source database takes the query load.</li></ul>
<strong>Direct Lake</strong> is the third mode, only available for OneLake Delta tables. It combines the best of both:

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;"><pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.82rem; line-height: 1.5; white-space: pre;">flowchart LR
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">subgraph OneLake["OneLake"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Delta["📦 Delta Parquet Files\\n(V-Ordered)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">end</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">subgraph SemanticModel["Power BI Semantic Model\\n(Direct Lake Mode)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">VertiPaq["🧠 VertiPaq Engine\\nIn-Memory Cache"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Framing["📐 Framing\\n(Column metadata snapshot)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">end</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">subgraph Reports["Power BI Reports"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Report["📊 Dashboard / Report\\nSub-second queries"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">end</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Delta --&gt;|"1. Framing: Read column segments\\ndirectly into memory"| Framing</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Framing --&gt; VertiPaq</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">VertiPaq --&gt;|"2. Query served from cache"| Report</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Delta -.-&gt;|"3. Auto-fallback to DirectQuery\\nif memory paged out"| Report</p>
</pre></div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">How Direct Lake Works — Step by Step</h3>

<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Framing</strong>: When a Direct Lake semantic model is opened or refreshed, the VertiPaq engine executes a <strong>framing</strong> operation — it reads the Delta table's transaction log to determine the current set of Parquet files and their column segment metadata.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Column Loading</strong>: VertiPaq reads V-Ordered Parquet column segments directly from OneLake into its memory cache. Because V-Order aligns the on-disk layout with VertiPaq's internal format, this is a near-zero-transformation read.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Query Serving</strong>: All DAX queries and report interactions are served from the VertiPaq in-memory cache. Performance is equivalent to Import Mode.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Automatic Freshness</strong>: When new data is committed to the Delta table, the semantic model automatically detects the new transaction log entry on the next query, re-frames to include new data, and loads new column segments. <strong>There is no manual refresh button</strong>.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Fallback</strong>: If the Fabric capacity's available memory is exhausted, Direct Lake automatically falls back to DirectQuery mode, issuing live SQL queries to the SQL Analytics Endpoint. This maintains query correctness at the cost of latency.</li></ol>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Direct Lake Paging Limits by Capacity SKU</h3>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Capacity SKU</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Max Direct Lake Table Rows</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Memory per Query</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">F2 / F4</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">~300M rows</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Limited</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">F8</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">~1B rows</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">3 GB</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">F16</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">~3B rows</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">5 GB</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">F32</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">~6B rows</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">10 GB</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">F64+</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Unlimited (Enterprise)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">25 GB+</td></tr></tbody></table></div>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">13. Data Factory Integration with OneLake</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Data Factory in the Fabric Context</h3>

<strong>Data Factory</strong> in Microsoft Fabric is the orchestration and ingestion engine. Unlike standalone Azure Data Factory (which writes to ADLS Gen2 accounts), Fabric Data Factory writes directly to OneLake items using the same Delta format.

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Key integration patterns:</p>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Copy Activity → Lakehouse</strong>: Copy data from any of 90+ supported connectors (Salesforce, REST API, SAP, Oracle) directly into a Lakehouse <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Files/</code> or <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code> directory.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Dataflow Gen2 → Delta Table</strong>: Transform data with Power Query M expressions and output directly as Delta tables in a Lakehouse.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Pipeline → Spark Notebook</strong>: Orchestrate PySpark transformation notebooks that read from and write to OneLake.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Pipeline → Warehouse T-SQL</strong>: Execute stored procedures in a Fabric Warehouse as part of a pipeline.</li></ul>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">All Data Factory outputs go directly to OneLake. There is no intermediate ADLS Gen2 account to manage.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">14. Eventhouse and Eventstream: Real-Time Intelligence in OneLake</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Eventstream</h3>

<strong>Eventstream</strong> is the real-time ingestion layer in Fabric. It connects to event sources (Azure Event Hubs, Apache Kafka, IoT Hub, Custom endpoints) and routes streaming data to destinations within Fabric.

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Eventstream can route data to:</p>
<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Eventhouse (KQL Database)</strong>: For real-time analytics with Kusto Query Language.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Lakehouse</strong>: Streaming data written as Delta files in the Lakehouse <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code> directory via Spark Structured Streaming.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Reflex (Fabric data activator)</strong>: For real-time alerts and automated actions.</li></ul>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Eventhouse (KQL Database)</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">An <strong>Eventhouse</strong> is a time-series and log analytics database optimized for high-throughput, low-latency queries on streaming data (IoT telemetry, application logs, clickstream, financial ticks). It uses the <strong>Kusto Query Language (KQL)</strong> — a read-optimized, LINQ-inspired query language purpose-built for time-series exploration.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Eventhouse data is stored in its own columnar format inside OneLake, within the Eventhouse item's folder in the workspace. A <strong>KQL Database Shortcut</strong> can expose Eventhouse tables to Lakehouse queries, enabling joins between historical Delta data and real-time KQL data.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">15. Notebook Storage in OneLake</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Where Notebook Artifacts Live</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Fabric Notebooks are Jupyter-compatible <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">.ipynb</code> files. When saved, they are stored in the workspace's OneLake folder as item metadata. The actual notebook code and output cells are stored in OneLake under the notebook item's path.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Where Notebook Outputs Live</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Notebook outputs — Spark-written Delta tables, exported files, ML model artifacts — are written to the target Lakehouse configured in the notebook's session. A notebook session with a default Lakehouse writes to <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code> or <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Files/</code> in that Lakehouse's OneLake path.</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text"># Reading from OneLake in a Spark Notebook
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">df = spark.read.format("delta").load("Tables/fact_sales")</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;"># Writing a transformed table back to OneLake</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">df_gold.write.format("delta").mode("overwrite").saveAsTable("gold_fact_sales")</p>
</code></pre></div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">ML Model Storage</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Machine learning models trained in Fabric Notebooks are saved to <strong>MLflow experiments</strong> stored in OneLake. Model artifacts (weights, parameters, metrics) are persisted in the OneLake path associated with the MLflow experiment item in the workspace, making them accessible to other Fabric items for inference pipelines.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">16. OneLake Security Architecture</h2>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;"><pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.82rem; line-height: 1.5; white-space: pre;">flowchart TD
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">EntraID["🔐 Microsoft Entra ID\\n(Identity Provider)"]</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">subgraph FabricSecurity["Fabric Security Layers"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">TenantAdmin["Fabric Tenant Admin\\n(Full control)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DomainAdmin["Domain Admin\\n(Domain-scoped control)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">WorkspaceRoles["Workspace Roles\\n(Admin / Member / Contributor / Viewer)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">ItemSharing["Item Sharing\\n(Read / ReadData / Reshare)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DataAccessRoles["OneLake Data Access Roles\\n(Folder/Table-level)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SQLRLS["SQL Row-Level Security\\n(Lakehouse SQL Endpoint)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SQLOLS["SQL Object-Level Security\\n(Column masking)"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">end</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">EntraID --&gt; TenantAdmin</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">EntraID --&gt; DomainAdmin</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">TenantAdmin --&gt; WorkspaceRoles</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DomainAdmin --&gt; WorkspaceRoles</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">WorkspaceRoles --&gt; ItemSharing</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">ItemSharing --&gt; DataAccessRoles</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DataAccessRoles --&gt; SQLRLS</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">DataAccessRoles --&gt; SQLOLS</p>
</pre></div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Workspace Roles</h3>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Role</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Create Items</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Write Data</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Share Items</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Manage Permissions</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Admin</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Member</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Contributor</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Viewer</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td></tr></tbody></table></div>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">OneLake Data Access Roles (Preview)</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">OneLake Data Access Roles allow data architects to define read permissions on specific <strong>sub-folders</strong> or <strong>Delta tables</strong> within a Lakehouse. A user assigned to a role sees only the tables and folders specified in that role's policy — even if they have Viewer access to the workspace.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">This enables <strong>column-safe sharing within a Lakehouse</strong>: a Finance Lakehouse can contain both <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">fact_sales_detailed</code> (restricted to Finance Analysts) and <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">fact_sales_summary</code> (accessible to all Business Analysts), without splitting them into separate Lakehouses.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">SQL Row-Level Security (RLS)</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">The SQL Analytics Endpoint supports T-SQL Row-Level Security predicates that filter rows based on the querying user's identity:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">CREATE SECURITY POLICY RegionFilter
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">ADD FILTER PREDICATE dbo.fn_securitypredicate(Region)</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">ON dbo.fact_sales WITH (STATE = ON);</p>
</code></pre></div>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">A user from the APAC team sees only APAC rows; a user from EMEA sees only EMEA rows — transparently, without application-level filtering.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">17. Microsoft Purview Integration and Governance</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Purview as the Governance Layer</h3>

<strong>Microsoft Purview</strong> is the unified data governance platform for OneLake. Every Fabric item (Lakehouse, Warehouse, Pipeline, Semantic Model) automatically registers itself in Purview's Data Catalog when Fabric-Purview integration is enabled.

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Sensitivity Labels</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Sensitivity labels (from Microsoft Information Protection) can be applied to:</p>
<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Workspaces</strong> (all items inherit the label)</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Individual Lakehouses, Warehouses, Semantic Models</strong></li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Individual Delta tables</strong> (via Purview's data map)</li></ul>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">When a user exports data from a labeled item — downloading a CSV from a Power BI report, copying data to Excel — the sensitivity label travels with the export and enforces encryption, watermarking, or copy restrictions based on enterprise policy.</p>

<strong>Label Inheritance</strong>: A Gold Delta table labeled "Confidential — Finance" automatically propagates that label to any Semantic Model built on top of it and any reports consuming that model.

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Data Lineage in Purview</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Purview tracks lineage end-to-end across OneLake:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">Azure SQL DB → [Mirroring] → OneLake Lakehouse (Bronze) →
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">[Spark Notebook] → OneLake Lakehouse (Gold) →</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">[Direct Lake] → Semantic Model →</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">[Power BI] → Executive Dashboard</p>
</code></pre></div>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">This lineage graph is invaluable for impact analysis: "If I change the schema of <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">fact_sales</code>, which downstream dashboards will break?"</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">18. RBAC, RLS, and OLS — Security Best Practices</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Layered Security Model</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Microsoft recommends a <strong>layered security approach</strong> for OneLake:</p>

<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Layer 1 — Workspace Roles</strong>: Coarse-grained access control. Use Workspace Roles to control who can create and manage items.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Layer 2 — Item Sharing</strong>: Grant non-workspace-members access to specific items (a single Lakehouse or Semantic Model) without workspace access.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Layer 3 — OneLake Data Access Roles</strong>: Fine-grained table/folder-level access within a Lakehouse.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Layer 4 — SQL RLS/OLS</strong>: Row and column filtering for users querying via the SQL Analytics Endpoint or Semantic Models.</li></ol>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Object-Level Security (OLS)</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Object-Level Security allows you to hide specific columns from non-privileged users in a Semantic Model. For example, a <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">SalaryAmount</code> column can be hidden from all roles except HR Analysts, without removing it from the underlying Delta table:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">EVALUATE
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">CALCULATETABLE(</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">SUMMARIZE(Employee, Employee[Name], Employee[Department])</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">)</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">-- SalaryAmount is invisible to this user due to OLS</p>
</code></pre></div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>
<!-- PREREQUISITE_START -->
<div class="prereq-callout" style="margin: 2rem 0; padding: 1.5rem; background: rgba(201, 243, 29, 0.01); border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 0 4px 4px 0;">
  <span style="font-family: monospace; font-size: 0.75rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem;">Recommended Prerequisite</span>
  <p style="font-size: 0.85rem; color: var(--muted); margin: 0 0 0.75rem 0; line-height: 1.5;">To fully grasp this concept, we recommend reviewing our foundational guide first:</p>
      <a href="/blog/microsoft-fabric-architecture-explained-2026" style="color: var(--text); text-decoration: none; font-weight: 700; font-size: 0.9rem; display: block; margin-top: 0.25rem;">&rarr; Microsoft Fabric Architecture</a>
</div>
<!-- PREREQUISITE_END -->




<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">19. CI/CD Considerations for OneLake</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Deployment Pipelines</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Fabric's <strong>Deployment Pipelines</strong> enable promotion of workspace content through Dev → Test → Production environments. For OneLake-backed items:</p>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Lakehouse schemas</strong> can be version-controlled in Git.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Spark notebooks</strong> are stored as <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">.py</code> or <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">.ipynb</code> files and pushed through the pipeline.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Delta table data</strong> is not promoted through Deployment Pipelines (only schemas/definitions move, not data).</li></ul>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Git Integration</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Fabric workspaces support <strong>Git integration</strong> with Azure DevOps or GitHub. When enabled:</p>
<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Every Lakehouse table schema, notebook, pipeline, and semantic model definition is serialized to <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">.json</code> and <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">.py</code> files in the connected repository.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Pull Requests enforce code review before changes reach production workspaces.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Branching strategies (feature branches, release branches) work the same way as application code.</li></ul>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Infrastructure as Code</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Fabric items can be provisioned and configured using:</p>
<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Fabric REST APIs</strong>: Programmatically create Lakehouses, Warehouses, and Pipelines.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Terraform (Community Provider)</strong>: Declare Fabric workspaces and capacity assignments as infrastructure-as-code.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Bicep / ARM Templates</strong>: Deploy Fabric capacities and workspaces alongside other Azure resources.</li></ul>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">20. Performance Tuning OneLake</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">1. File Size Optimization (OPTIMIZE)</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Frequent small appends — streaming ingestion, hourly partitions, micro-batch pipelines — generate hundreds of small Parquet files per table. Reading a table with 10,000 small files is dramatically slower than reading one with 50 large files, because each file requires a separate metadata lookup and network round-trip.</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Run <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">OPTIMIZE</code> regularly to compact small files into larger row groups (typically targeting 256MB–1GB per file):</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">OPTIMIZE fact_sales WHERE SaleDate &gt;= '2026-01-01'
</code></pre></div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">2. VACUUM: Reclaiming Storage</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Delta's time travel retains old Parquet files even after they have been superseded by updates. After 30 days, those old files consume significant storage. Run <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">VACUUM</code> to purge them:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">VACUUM fact_sales RETAIN 168 HOURS  -- Keep 7 days of history
</code></pre></div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">3. Partition Pruning</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Partition your large Delta tables by date or region columns to enable partition pruning — queries with date filters skip entire partitions without reading them:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">df.write.format("delta")
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">.partitionBy("SaleYear", "SaleMonth")</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">.saveAsTable("fact_sales_partitioned")</p>
</code></pre></div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">4. Z-Ordering</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">For high-cardinality filter columns that are not partition keys, apply <strong>Z-Ordering</strong> to colocate related values in the same Parquet row groups:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">OPTIMIZE fact_sales ZORDER BY (CustomerID, ProductID)
</code></pre></div>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Z-Ordering improves data skipping for queries like <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">WHERE CustomerID = 12345</code>.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">5. Liquid Clustering (Delta 3.0+)</h3>

<strong>Liquid Clustering</strong> is the successor to static partitioning and Z-Ordering, available in Fabric Spark Runtime 3.4+. It automatically reorganizes data based on declared cluster keys without requiring OPTIMIZE:

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;"><pre style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4;"><code class="language-text">CREATE TABLE fact_sales
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">CLUSTER BY (SaleYear, Region);</p>
</code></pre></div>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">21. Cost Optimization for OneLake</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">OneLake Storage Pricing</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">OneLake storage is billed at approximately <strong>$0.023 per GB per month</strong> — effectively the same rate as Azure Data Lake Storage Gen2. For most enterprises, OneLake storage cost is trivial compared to compute cost.</p>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Compute Cost Drivers</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">All compute in Fabric (Spark, SQL, Data Factory, Power BI refreshes) consumes <strong>Capacity Units (CUs)</strong> from the Fabric capacity assigned to the workspace. CU consumption is the primary cost lever.</p>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Optimization</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Impact</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Run OPTIMIZE to reduce small files</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Reduces Spark and SQL scan time → fewer CUs</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Partition large tables</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Enables partition pruning → fewer files scanned → fewer CUs</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Use Direct Lake over Import</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Eliminates refresh CU consumption entirely</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Use Shortcuts instead of copying data</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Eliminates Data Factory copy CU cost</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Schedule heavy Spark jobs off-peak</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Smoothing (Fabric Capacity handles burst smoothing over 24-hour windows)</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Right-size Fabric SKU</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Overpaying for unused CUs is common; monitor utilization in Capacity Metrics app</td></tr></tbody></table></div>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Fabric Capacity Metrics App</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">The <strong>Microsoft Fabric Capacity Metrics App</strong> (a Power BI template app) provides dashboards showing CU consumption by workspace, item type, and operation. Use this to identify the top 10 CU-consuming operations and optimize them first.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">22. Enterprise Architecture Patterns</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Pattern 1: Medallion Architecture on OneLake</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">The most common Fabric pattern is the Medallion (Bronze/Silver/Gold) architecture implemented as multiple Lakehouses within a workspace:</p>

<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;"><pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.82rem; line-height: 1.5; white-space: pre;">flowchart LR
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Source["🌐 Data Sources\\n(APIs, DBs, Files)"] --&gt;|"Data Factory Copy\\nor Mirroring"| Bronze</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">subgraph OneLake["OneLake — Single Workspace"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Bronze["🥉 Bronze Lakehouse\\nRaw Delta files"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Silver["🥈 Silver Lakehouse\\nCleaned + Conformed Delta"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Gold["🥇 Gold Lakehouse\\nAggregated Business Tables"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">end</p>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Bronze --&gt;|"Spark Notebooks\\nor Dataflow Gen2"| Silver</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Silver --&gt;|"Spark Notebooks\\nor Dataflow Gen2"| Gold</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Gold --&gt;|"Direct Lake"| PBI["📊 Power BI Reports"]</p>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Gold --&gt;|"SQL Endpoint"| Analysts["🧑‍💼 SQL Analysts"]</p>
</pre></div>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Pattern 2: Data Mesh with OneLake Domains</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">For large enterprises with multiple independent data teams, implement a Data Mesh pattern using Fabric Domains:</p>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Each business unit owns its own Domain and manages its own Ingest + Analytics workspaces.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Cross-domain data sharing is achieved via <strong>Internal Shortcuts</strong> — the Marketing domain creates a shortcut to the Finance domain's <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">DimCustomer</code> table without physically copying it.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">An Executive Reporting workspace can shortcut to curated Gold tables from all domains, presenting a unified view without centralized ETL.</li></ul>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Pattern 3: Medallion + Hub-and-Spoke for Multi-tenant Analytics</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">For ISVs or enterprises with multiple subsidiaries:</p>
<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">A <strong>Hub Lakehouse</strong> contains enterprise-wide master data (Dimensions, Reference tables).</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Spoke Lakehouses for each subsidiary or tenant shortcut to the Hub for shared dimensions.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Spoke workloads can proceed independently without Hub team involvement.</li></ul>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">23. OneLake Best Practices Checklist</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Folder and Naming Organization</h3>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Use consistent lowercase snake_case for table names (<code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">fact_sales</code>, <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">dim_customer</code>)</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Prefix Bronze/Silver/Gold tables with layer indicator if in one Lakehouse (<code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">bronze_raw_orders</code>, <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">gold_sales_summary</code>)</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Never store sensitive PII data in <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Files/</code> without a sensitivity label on the Lakehouse</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Use managed tables (<code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code>) for all analytical data; use <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Files/</code> only for raw staging</li></ul>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Workspace Organization</h3>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] One workspace per environment (Dev, Test, Production)</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Assign workspaces to appropriate Fabric capacities (Prod → large SKU, Dev → small SKU)</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Use Domains to group workspaces by business unit</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Enable Git integration for all production workspaces</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Document workspace purpose and owner in the workspace description</li></ul>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Capacity Planning</h3>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Start with F8 for development environments</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Use F64+ for production workloads with Direct Lake on large semantic models</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Monitor CU utilization in the Capacity Metrics App weekly</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Enable Autoscale (Fabric Trial or Pay-as-you-go) for burst workloads</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Schedule heavy batch Spark jobs during off-peak hours to avoid CU throttling</li></ul>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Security Boundaries</h3>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Never grant workspace Admin role to service accounts; use Member or Contributor</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Use OneLake Data Access Roles for table-level security within shared Lakehouses</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Apply sensitivity labels at the workspace level for consistent inheritance</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Enable Purview lineage scanning for all production workspaces</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Audit workspace membership quarterly</li></ul>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Data Quality</h3>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Enable Delta constraints (NOT NULL, CHECK) for critical business key columns</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Run OPTIMIZE weekly on tables with high write frequency</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Run VACUUM with 168-hour retention on tables where time travel is not required</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">[ ] Monitor Delta table health using <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">DESCRIBE DETAIL</code> and <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">DESCRIBE HISTORY</code></li></ul>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">24. OneLake Decision Matrix</h2>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Scenario</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Recommended Approach</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Migrating from ADLS Gen2 with existing pipelines</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">ADLS Gen2 Shortcut → Gradually migrate to native Lakehouse tables</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Multi-team analytics, shared dimensions</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Internal Shortcuts from team workspaces to central DimHub</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Large enterprise with 10+ business units</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Fabric Domains + Workspace separation per business unit</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Self-service BI with SQL analysts</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Fabric Lakehouse + SQL Analytics Endpoint</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Enterprise reporting with Power BI</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Lakehouse or Warehouse → Semantic Model in Direct Lake mode</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Near real-time analytics (< 1 minute latency)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Mirroring from operational DB → Direct Lake Semantic Model</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">IoT / clickstream telemetry</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Eventstream → Eventhouse (KQL) + Lakehouse Shortcut</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">ML model training</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Lakehouse Files/ for raw data → Lakehouse Tables/ for feature store</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Regulatory compliance with data sovereignty</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Domain + Workspace per region, capacity in sovereign region</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Replacing Databricks</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Fabric Lakehouse (Spark) + Unity Catalog Shortcut during transition</td></tr></tbody></table></div>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">25. OneLake Feature Comparison: vs. Cloud Storage Alternatives</h2>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Feature</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">OneLake</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">ADLS Gen2</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Amazon S3</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Google Cloud Storage</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Databricks Unity Catalog</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Managed service</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅ Full SaaS</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Partial (IaaS)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Partial (IaaS)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Partial (IaaS)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Partial</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Delta Lake native</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Optional</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Optional</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Optional</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>V-Order optimization</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Direct Lake Power BI</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Built-in SQL endpoint</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅ (Delta Sharing)</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Zero-ETL Mirroring</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Shortcuts (virtual mount)</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Delta Sharing</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Purview governance</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅ Native</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">✅ via connector</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Via connector</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Via connector</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Via connector</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Pricing model</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">CU + Storage</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Storage + transactions</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Storage + requests</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Storage + requests</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">DBU + Storage</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);"><strong>Multi-cloud access</strong></td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Via Shortcuts</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">❌</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Via Delta Sharing</td></tr></tbody></table></div>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">26. Common Mistakes in OneLake Architecture</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Mistake 1: Creating Separate Workspaces Instead of Using Shortcuts</h3>

<strong>Problem</strong>: Teams create separate workspaces and copy shared dimension tables between them manually.
<strong>Fix</strong>: Use Internal Shortcuts to share Gold tables across workspaces. One source of truth, zero duplication.

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Mistake 2: Using Files/ Instead of Tables/ for Analytical Data</h3>

<strong>Problem</strong>: Data engineers write Parquet files to <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Files/</code> without a Delta log. Power BI cannot query these with Direct Lake; the SQL Endpoint cannot auto-discover them.
<strong>Fix</strong>: Always write analytical tables to <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code> using Delta format. Use <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Files/</code> only for raw staging.

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Mistake 3: Skipping OPTIMIZE on High-Write Tables</h3>

<strong>Problem</strong>: Streaming or hourly-batch tables accumulate thousands of small Parquet files. Query performance degrades over weeks.
<strong>Fix</strong>: Schedule a weekly OPTIMIZE job on all high-write tables using a Fabric Pipeline.

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Mistake 4: Not Enabling V-Order in Legacy Spark Code</h3>

<strong>Problem</strong>: Teams migrating existing Spark code from Databricks disable V-Order to match the Databricks behavior, breaking Direct Lake performance.
<strong>Fix</strong>: Always verify <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">spark.sql.parquet.vorder.enabled</code> is <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">true</code> in Fabric Spark sessions. Never disable it unless testing.

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Mistake 5: Assigning All Workspaces to a Single Large Capacity</h3>

<strong>Problem</strong>: Dev, Test, and Production workspaces share one capacity. A heavy dev Spark job throttles production Power BI reports.
<strong>Fix</strong>: Use separate capacity SKUs for Dev/Test (F4-F8) and Production (F64+).

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Mistake 6: Using Mirroring for Static Reference Data</h3>

<strong>Problem</strong>: Teams enable Mirroring for tables that rarely change, consuming continuous CU compute unnecessarily.
<strong>Fix</strong>: Use a scheduled Data Factory pipeline for low-change reference data. Reserve Mirroring for tables with frequent transactional changes.

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">27. Migration Guides</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Migrating from ADLS Gen2 to OneLake</h3>

<strong>Phase 1 — Zero-downtime bridge (Weeks 1-4)</strong>:
<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Create an ADLS Gen2 Shortcut in a Fabric Lakehouse pointing to your existing ADLS Gen2 storage account containers.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Update Power BI and SQL analytics tools to point to the Lakehouse SQL Endpoint (which serves the shortcut data).</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Existing ADLS pipelines continue writing to ADLS Gen2. No changes required.</li></ol>
<strong>Phase 2 — Migrate pipelines (Months 2-3)</strong>:
<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Repoint Data Factory pipelines to write directly to Lakehouse <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code> instead of ADLS Gen2.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Verify Delta writes land in <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code> with V-Order enabled.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Remove ADLS Gen2 shortcuts as native tables are available.</li></ol>
<strong>Phase 3 — Decommission ADLS Gen2 (Month 4+)</strong>:
<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Delete shortcuts. Remove ADLS Gen2 storage accounts.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Apply OneLake Data Access Roles to replace ADLS ACLs.</li></ol>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Migrating from Azure Synapse Analytics</h3>

<div style="overflow-x: auto; margin: 2rem 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;"><thead><tr style="background: var(--surface2); border-bottom: 2px solid var(--border);"><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Synapse Component</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Fabric Equivalent</th><th style="padding: 12px 16px; text-align: left; font-weight: 700; border-right: 1px solid var(--border);">Migration Approach</th></tr></thead><tbody><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Dedicated SQL Pool</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Fabric Data Warehouse</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Export data as Parquet → Import to Warehouse via COPY INTO</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Serverless SQL Pool</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Lakehouse SQL Endpoint</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Create Shortcuts to existing ADLS; re-point queries</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Spark Pool</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Lakehouse + Notebooks</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Migrate <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">.ipynb</code> notebooks; update storage paths</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Synapse Pipelines</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Fabric Data Factory</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Recreate pipelines using Fabric's pipeline editor</td></tr><tr style="border-bottom: 1px solid var(--border);"><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Linked Services</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Connections (Fabric)</td><td style="padding: 12px 16px; border-right: 1px solid var(--border);">Recreate in Fabric Connections hub</td></tr></tbody></table></div>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Migrating from Databricks</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">The Databricks-to-Fabric migration is significantly smoother than other migrations because both platforms use <strong>Delta Lake on Parquet</strong> as the table format:</p>

<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Storage</strong>: If your Databricks Unity Catalog uses ADLS Gen2, create a Shortcut in a Fabric Lakehouse pointing to the Unity Catalog managed storage path. Delta tables are immediately readable.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Notebooks</strong>: Databricks PySpark notebooks run in Fabric Spark with minimal changes. The primary change is the storage path format.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Unity Catalog → OneLake ACLs</strong>: Map Unity Catalog grants to Fabric OneLake Data Access Roles and workspace roles.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>MLflow</strong>: Fabric supports MLflow natively for experiment tracking; migrate MLflow experiment paths.</li></ol>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">28. Troubleshooting Guide</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Shortcut Failures</h3>

<strong>Symptoms</strong>: Queries against a shortcut return <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Path not found</code> or <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Access denied</code>.

<strong>Resolution</strong>:
<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Verify the credential in the Fabric Connection Hub is valid and not expired.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Check that the service principal or managed identity has <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Storage Blob Data Reader</code> on the target ADLS Gen2 account or S3 bucket policy.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Verify the target path still exists in the external storage.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">For S3 shortcuts, ensure the S3 bucket policy allows the Fabric service principal's ARN.</li></ol>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Direct Lake Fallback to DirectQuery</h3>

<strong>Symptoms</strong>: Power BI reports become slow; telemetry shows <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">DirectQuery</code> mode instead of <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Direct Lake</code>.

<strong>Resolution</strong>:
<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Check if the semantic model's tables exceed the capacity SKU's memory limits.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Run <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">OPTIMIZE</code> on the underlying Delta tables to reduce file count.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Reduce the number of high-cardinality columns in the semantic model.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Upgrade the Fabric capacity SKU.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Set <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">DirectLakeBehavior = DirectLakeOnly</code> to surface errors rather than silently falling back.</li></ol>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Delta Table Corruption</h3>

<strong>Symptoms</strong>: <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">DeltaTableOperationException: No snapshot found</code> or transaction log errors.

<strong>Resolution</strong>:
<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Run <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">DESCRIBE HISTORY table_name</code> to identify the last valid commit.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Restore the table to the last valid version: <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">RESTORE TABLE table_name TO VERSION AS OF <version/></code>.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Investigate the Spark job that caused the corrupted commit and fix the root cause.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Enable <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">delta.checkpointInterval = 10</code> (default) to maintain checkpoint files for faster recovery.</li></ol>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Mirroring Latency Spikes</h3>

<strong>Symptoms</strong>: Mirrored tables fall significantly behind the source database (latency > 5 minutes).

<strong>Resolution</strong>:
<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Check source database CDC health: <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">SELECT * FROM sys.dm_cdc_log_scan_sessions</code>.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Verify there are no long-running transactions blocking log reads on the source.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Ensure the Fabric capacity has sufficient CUs for the Mirroring background agent.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Check for large schema changes on the source (ALTER TABLE) that trigger a full table resync.</li></ol>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Workspace Access Issues</h3>

<strong>Symptoms</strong>: Users report <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Access denied</code> when accessing Lakehouse items despite having workspace roles.

<strong>Resolution</strong>:
<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Verify the user's Entra ID group membership has propagated (can take up to 24 hours for large groups).</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Check if OneLake Data Access Roles are configured and the user is not assigned to any role with access to the requested table.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Confirm the workspace is not in a capacity that is paused or suspended.</li></ol>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Capacity Throttling</h3>

<strong>Symptoms</strong>: Jobs fail with <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Capacity overloaded</code> or Power BI reports time out.

<strong>Resolution</strong>:
<ol style="list-style-type: decimal; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Open the Fabric Capacity Metrics App and identify the top CU-consuming operations.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Move heavy batch Spark jobs to off-peak hours.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Upgrade the capacity SKU, or split high-demand workspaces to a separate capacity.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);">Enable Fabric Burst and Smoothing (available for Pay-as-you-go capacities).</li></ol>
<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">29. OneLake Future Roadmap</h2>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Microsoft's public Fabric roadmap (as of 2026) includes several OneLake-specific enhancements. The following items are either in preview or on the announced roadmap:</p>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>OneLake Catalog (GA)</strong>: A unified metadata catalog embedded within Fabric, replacing the need for external Purview scanning for Fabric-native assets.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>OneLake Data Access Roles (GA)</strong>: Folder and table-level security is currently in Preview; GA is targeted for 2026.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Mirroring for PostgreSQL (GA)</strong>: Logical replication-based mirroring for Azure Database for PostgreSQL.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Mirroring for MySQL</strong>: Announced for preview.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>OneLake External Data Sharing</strong>: Share Delta tables from OneLake with external partners or other Fabric tenants without data movement (similar to Databricks Delta Sharing).</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Liquid Clustering (GA)</strong>: Auto-optimizing clustering for Delta tables without manual OPTIMIZE commands.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Fabric Workspace Git Integration — Branching Strategies</strong>: Advanced Git branching (feature branches, pull request templates) for Fabric workspace items.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Vector Store in OneLake</strong>: Native support for vector embeddings stored in OneLake for AI/RAG applications.</li></ul>
<blockquote style="border-left: 4px solid var(--border); padding: 0.5rem 1rem; margin: 1.5rem 0; color: var(--muted); font-style: italic;"><strong>Note</strong>: Roadmap items are subject to change. Always verify current feature availability in the official <a href="https://learn.microsoft.com/en-us/fabric/release-plan/" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline; text-underline-offset: 3px;">Microsoft Fabric release notes</a>.</blockquote>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">30. Certification Tips: DP-600 and DP-700</h2>

<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">DP-600: Analytics Engineer (OneLake Focus Areas)</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">The <a href="/blog/dp-600-study-guide-2026" style="color: var(--accent); text-decoration: underline; text-underline-offset: 3px;">DP-600 study guide</a> covers OneLake extensively. Key exam areas:</p>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>OneLake storage hierarchy</strong>: Know the Tenant → Domain → Workspace → Item → Tables/Files hierarchy cold.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Direct Lake vs Import vs DirectQuery</strong>: Understand when each mode is appropriate and what causes Direct Lake to fall back to DirectQuery.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Delta Lake table operations</strong>: OPTIMIZE, VACUUM, RESTORE, DESCRIBE HISTORY, DESCRIBE DETAIL.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Shortcut types</strong>: Know which credential type each shortcut type requires (Managed Identity, Service Principal, Account Key).</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Workspace Roles</strong>: Know exactly what each role (Admin, Member, Contributor, Viewer) can and cannot do.</li></ul>
<h3 style="color: var(--text); font-size: 1.3rem; margin-top: 2.2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">DP-700: Data Engineer (OneLake Focus Areas)</h3>

<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">The <a href="/blog/dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison" class="autolink" style="color: var(--accent); text-decoration: underline;" title="DP-700 Certification Guide">DP-700</a> goes deeper into data engineering patterns on OneLake:</p>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Medallion Architecture implementation</strong>: How to design Bronze/Silver/Gold Lakehouses, partition strategies, schema evolution.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Spark notebook integration with OneLake</strong>: Reading and writing Delta tables, configuring V-Order, using Spark Structured Streaming to OneLake.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Mirroring configuration</strong>: Setting up CDC-based mirroring, monitoring mirroring health, handling schema changes.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Pipeline orchestration</strong>: Building Data Factory pipelines that orchestrate Lakehouse writes, transformations, and validation.</li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><strong>Security implementation</strong>: Implementing OneLake Data Access Roles, Purview sensitivity labels, and workspace governance policies.</li></ul>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">For a complete comparison of all three Fabric certifications, see our <a href="/blog/dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison" style="color: var(--accent); text-decoration: underline; text-underline-offset: 3px;">DP-600 vs DP-700 vs DP-800 comparison guide</a>.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">31. Frequently Asked Questions (FAQs)</h2>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">1. Is OneLake a data lake?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Yes. OneLake is a single, unified, logical data lake for your entire Microsoft Fabric tenant, built on top of Azure Data Lake Storage Gen2 and delivered as a fully managed SaaS service.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">2. Is OneLake the same as Azure Data Lake Storage Gen2?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Physically, OneLake is built on ADLS Gen2 infrastructure. Logically, it is a SaaS abstraction that eliminates storage account provisioning, firewall configuration, SAS key management, and container endpoint exposure.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">3. What is the OneCopy Principle?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">The OneCopy Principle means data in OneLake is stored exactly once as physical Delta Parquet files. Every compute engine (Spark, SQL, Power BI, Data Factory) reads from the same files without copying data between engines.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">4. How do shortcuts work?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Shortcuts are logical pointers stored in OneLake's metadata that make external storage (ADLS Gen2, S3, GCS) or data in other Fabric workspaces appear as native OneLake folders. No data is copied. At query time, OneLake resolves the pointer and generates scoped access tokens for the target storage.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">5. What is V-Order and why does it matter?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">V-Order is a proprietary write optimization that Microsoft applies to Parquet files written by Fabric engines. It reorganizes column data within Parquet files to match the Power BI VertiPaq engine's memory layout, enabling sub-second Direct Lake query performance without data loading or import.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">6. What is Direct Lake mode?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Direct Lake is a Power BI query mode exclusive to OneLake Delta tables. Instead of importing data into VertiPaq memory (Import Mode) or querying a database live (DirectQuery), VertiPaq loads V-Ordered Parquet column segments directly from OneLake into its cache. Reports are as fast as Import but data is always current.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">7. What triggers a Direct Lake fallback to DirectQuery?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Fallback occurs when the semantic model's column segments exceed the Fabric capacity's available memory. To prevent it: run OPTIMIZE, reduce high-cardinality columns in the model, or upgrade the capacity SKU.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">8. How is Mirroring different from data pipelines?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Mirroring uses the source database's built-in Change Data Capture (CDC) or change feed APIs to continuously stream changes at the transaction level — with latency under 30 seconds for Azure SQL. Traditional pipelines use scheduled full or incremental extracts, with minutes-to-hours of latency and significant engineering maintenance.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">9. Can I use OneLake with Databricks?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Yes. Since OneLake exposes ADLS Gen2-compatible APIs, Databricks can connect to OneLake using its ADLS Gen2 storage driver. You can also create a Shortcut in a Fabric Lakehouse pointing to Databricks-managed Delta tables in ADLS Gen2.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">10. What is a Fabric Domain?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">A Domain is a logical grouping of Fabric workspaces aligned to a business unit, region, or data mesh product team. Domains enable domain-scoped admin delegation, shared sensitivity label policies, and organized data catalog browsing in Purview.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">11. Can multiple workspaces share the same Delta table?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Yes, via Internal Shortcuts. A Gold Delta table in the Finance workspace can be shortcut-mounted in the Executive Reporting workspace and the Marketing workspace simultaneously. All three see the same data without duplication.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">12. What is the Lakehouse SQL Analytics Endpoint?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">The SQL Analytics Endpoint is a serverless T-SQL query layer automatically provisioned with every Fabric Lakehouse. It translates T-SQL queries into Parquet file reads against the Lakehouse's <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code> directory, making Delta tables queryable with standard SQL without any configuration.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">13. What file formats does OneLake support?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">OneLake's <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Files/</code> directory supports any format (CSV, JSON, Parquet, AVRO, ORC, PDF, images, binaries). The <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code> directory requires Delta Lake format. External shortcuts can reference any format supported by the external storage (S3, ADLS Gen2).</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">14. Does OneLake support streaming data?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Yes. Fabric Eventstream routes real-time data from Event Hubs, Kafka, and IoT Hub to Eventhouse (KQL) or Lakehouse (Delta via Spark Structured Streaming). Spark Structured Streaming can write to Delta tables in <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">Tables/</code> continuously.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">15. What is the difference between Mirroring and Shortcuts for operational databases?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Shortcuts work for file stores (ADLS, S3, GCS), not databases. Mirroring connects to database transaction logs (Azure SQL, Cosmos DB) and streams changes into Delta tables in OneLake. Use Mirroring for databases; use Shortcuts for file storage.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">16. How does OneLake handle schema evolution?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Delta Lake supports schema evolution natively. New columns can be added to existing Delta tables using <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">mergeSchema</code> option. Schema enforcement rejects writes with unexpected column types unless <code style="background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">overwriteSchema</code> is explicitly set.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">17. Can Power BI Import Mode still be used with OneLake?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Yes. Power BI Import Mode can import data from a Lakehouse SQL Endpoint or Warehouse, just as it would from any SQL source. However, Direct Lake is recommended for OneLake-backed tables as it eliminates refresh jobs and provides always-current data.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">18. How is OneLake priced?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">OneLake storage is billed at approximately $0.023 per GB per month — equivalent to ADLS Gen2 LRS pricing. Compute operations (Spark, SQL, Data Factory, Power BI) consume Capacity Units (CUs) billed through the Fabric capacity SKU (F2 through F2048). For a complete breakdown, read our guide on <a href="/blog/microsoft-fabric-capacity-sizing-guide-2026" style="color: var(--accent); text-decoration: underline;" title="capacity planning for Fabric workloads">capacity planning for Fabric workloads</a>.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">19. What is an Eventhouse?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">An Eventhouse is a Fabric item hosting one or more KQL (Kusto Query Language) databases, optimized for high-throughput time-series and log analytics. Eventhouse data is stored in OneLake in a columnar format optimized for KQL queries.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">20. Can I access OneLake from my local machine?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Yes. The <strong>OneLake File Explorer</strong> Windows application mounts OneLake as a local drive in Windows Explorer. Files can be browsed, downloaded, and uploaded using drag-and-drop. Programmatic access is available via the ADLS Gen2 SDK using the OneLake DFS endpoint URL.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">21. What is Liquid Clustering?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Liquid Clustering is a Delta Lake 3.0+ feature that automatically reorganizes data within a table based on declared cluster keys, replacing static partitioning and manual Z-Ordering. It is available in Fabric Spark Runtime 3.4+ and eliminates the need for scheduled OPTIMIZE with ZORDER.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">22. What is Delta table time travel?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Time travel allows you to query a Delta table as it existed at a previous commit version or timestamp. This is enabled by the Delta transaction log, which records every schema change, insert, update, and delete operation.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">23. What are OneLake Data Access Roles?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">OneLake Data Access Roles are a preview feature that enables data architects to configure read permissions on specific sub-folders or Delta tables within a Lakehouse. Users assigned to a role see only the tables in that role's scope, even if they have Viewer access to the workspace.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">24. Does OneLake support GDPR / data deletion?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Yes. Delta Lake's DELETE command removes rows from Delta tables, with the changes recorded in the transaction log. VACUUM purges the old physical Parquet files containing deleted rows. For complete data subject erasure, run DELETE followed by VACUUM with a minimal retention window.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">25. What is the difference between Fabric Lakehouse and Fabric Warehouse?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">A Lakehouse is primarily designed for data engineering (Spark, Python) workloads. Tables are created by writing Delta files. A Warehouse is designed for SQL analysts and DBAs. Tables are created using T-SQL DDL. Both store data as Delta Parquet files in OneLake.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">26. Can Databricks read OneLake Delta tables?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Yes. Databricks can read OneLake Delta tables by connecting to the OneLake DFS endpoint using its ADLS Gen2 storage driver. No data movement or export is required — Databricks reads the same Delta files that Fabric Spark and Power BI use.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">27. What is the Mirrored Database item?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">A Mirrored Database is a Fabric item that represents an operational database being replicated into OneLake via Mirroring. It appears in the Fabric workspace as a collection of Delta tables, one per source database table, along with an auto-provisioned SQL Analytics Endpoint.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">28. What is CI/CD support for OneLake?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Fabric supports Git integration with Azure DevOps and GitHub. Workspace item definitions (Lakehouse schemas, notebooks, pipelines, semantic model definitions) are serialized to JSON/YAML and pushed to Git. Deployment Pipelines promote content through Dev → Test → Production environments.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">29. What is Fabric External Data Sharing?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">Fabric External Data Sharing (Preview) allows sharing OneLake Delta tables with external Fabric tenants or external Delta-compatible engines using an open protocol similar to Databricks Delta Sharing. Recipients access the data without data being physically copied to their environment.</p>

<h4 style="color: var(--text); font-size: 1.05rem; margin-top: 1.8rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">30. Should I use OneLake or keep my existing ADLS Gen2 data lake?</h4>
<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--muted); font-size: 1.05rem;">You do not need to choose immediately. The recommended migration path starts with ADLS Gen2 Shortcuts — mount your existing ADLS Gen2 containers into a Fabric Lakehouse and begin using Fabric compute engines (Spark, SQL, Power BI Direct Lake) against existing data. Migrate workloads incrementally over 3-6 months, eventually writing new data natively to OneLake while transitioning existing pipelines.</p>

<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;"/>

<h2 style="color: var(--text); font-size: 1.6rem; margin-top: 3rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">Technical References</h2>

<ul style="list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem;"><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><a href="https://learn.microsoft.com/en-us/fabric/enterprise/licenses" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline; text-underline-offset: 3px;">Microsoft Fabric Capacity Planning Guidelines</a></li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><a href="https://learn.microsoft.com/en-us/fabric/onelake/onelake-overview" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline; text-underline-offset: 3px;">OneLake Documentation — Microsoft Learn</a></li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><a href="https://delta.io/" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline; text-underline-offset: 3px;">Delta Lake Open Source Project</a></li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><a href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-600" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline; text-underline-offset: 3px;">DP-600 Exam Study Guide</a></li><li style="margin-bottom: 0.5rem; line-height: 1.7; color: var(--muted);"><a href="https://learn.microsoft.com/en-us/fabric/release-plan/" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline; text-underline-offset: 3px;">Microsoft Fabric Release Notes</a></li></ul>
<!-- PROGRESSION_START -->
<div class="progression-callout" style="margin: 3rem 0; padding: 2rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 4px;">
  <h4 style="font-family: Syne, sans-serif; font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text); font-weight: 700;">Microsoft Fabric Curriculum progression</h4>
  <p style="color: var(--muted); font-size: 0.85rem; margin-bottom: 1.5rem; line-height: 1.5;">Continue your progression through the structured topical learning path:</p>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <a href="/blog/microsoft-fabric-medallion-architecture-guide" style="background: var(--accent); color: #000; padding: 0.55rem 1.25rem; font-weight: 700; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 2px;">Next: Medallion Architecture &rarr;</a>
      <a href="/blog/power-bi-direct-lake-performance-tuning-fabric" style="background: var(--accent); color: #000; padding: 0.55rem 1.25rem; font-weight: 700; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 2px;">Next: Direct Lake Mode &rarr;</a>
  </div>
</div>
<!-- PROGRESSION_END -->
<!-- TOOL_START -->
<div class="tool-callout" style="margin: 2rem 0; padding: 1.5rem; background: var(--surface2); border-left: 4px solid var(--accent); border-radius: 0 4px 4px 0;">
  <span style="font-family: monospace; font-size: 0.75rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem;">Interactive Developer Tool</span>
  <h5 style="font-size: 1.05rem; margin: 0 0 0.5rem 0; font-family: Syne, sans-serif;">Build Professional Architecture Flowcharts Instantly</h5>
  <p style="font-size: 0.85rem; color: var(--muted); margin: 0 0 1rem 0; line-height: 1.5;">We built a custom Mermaid diagram optimizer specifically for data architects. Create, edit, and export visual blueprints in seconds.</p>
  <a href="/tools/mermaid-forge" style="color: var(--accent); text-decoration: none; font-size: 0.85rem; font-weight: 700;">Try Mermaid Forge &rarr;</a>
</div>
<!-- TOOL_END -->
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
      <a href="/blog/microsoft-fabric-architectural-guide" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">The Fabric Architect’s Manifesto: The Unofficial Microsoft Fabric Architectural Guide</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Architecture & BI</span>
      <a href="/blog/dp-600-study-guide-2026" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">DP-600 Study Guide 2026: Complete Microsoft Fabric Analytics Engineer Exam Preparation</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Data Engineering</span>
      <a href="/blog/dp-700-study-guide-2026" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">DP-700 Study Guide 2026: Complete Microsoft Fabric Data Engineer Certification Preparation</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Architecture & BI</span>
      <a href="/blog/microsoft-fabric-certification-roadmap-2026" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">Microsoft Fabric Certification Roadmap 2026: Plan Your Learning Path</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Architecture & BI</span>
      <a href="/blog/why-microsoft-fabric-skills-will-dominate-the-data-industry-in-2026" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">Why Microsoft Fabric Skills Will Dominate the Data Industry in 2026</a>
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
