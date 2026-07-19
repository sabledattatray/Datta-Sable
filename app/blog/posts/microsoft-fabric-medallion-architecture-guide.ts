export const microsoftFabricMedallionArchitectureGuidePost = {
  id: "cmqr1c1re0007fnlqgnqhshwc",
  slug: "microsoft-fabric-medallion-architecture-guide",
  title: "Microsoft Fabric Medallion Architecture Guide: Ingesting Bronze, Silver, and Gold Tiers",
  category: "Architecture",
  excerpt: "Stop learning Microsoft Fabric tools in isolation. Discover how Lakehouse, Pipelines, Dataflows, Synapse Spark, and Power BI align through the core Medallion Architecture framework.",
  date: "May 17, 2026",
  readTime: 15,
  color: "var(--accent)",
  icon: "🏅",
  image: "/images/blog/medallion-architecture.webp",
  tags: ["Microsoft Fabric", "Medallion Architecture", "Bronze-Silver-Gold", "Data Engineering"],
  published: true,
  blocks: {
    focusedKeyword: "Microsoft Fabric Medallion Architecture Guide"
  },
  content: `<!-- BREADCRUMB_START -->
<div class="breadcrumb-container" style="font-family: monospace; font-size: 0.8rem; margin-bottom: 2rem; color: var(--muted); border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
  <a href="/" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Home</a> &gt; 
  <a href="/blog" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Blog</a> &gt; 
  <a href="/blog/microsoft-fabric" style="color: var(--accent); text-decoration: none; font-weight: 600;">Microsoft Fabric Hub</a> &gt; 
  <span style="color: var(--text);">Microsoft Fabric Medallion Architecture Guide: Ingesting Bronze, Silver, and Gold Tiers</span>
</div>
<!-- BREADCRUMB_END -->
<p>Open any tutorial on <a href="/blog/microsoft-fabric-architecture-explained-2026" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Microsoft Fabric Architecture Guide">Microsoft Fabric</a>, and you will immediately be bombarded with technical walkthroughs. You will learn how to build an ingestion pipeline, spin up a Spark notebook, construct an enterprise data warehouse, and model data inside Power BI.</p>

      <p>But if you learn Microsoft Fabric this way, you are missing the forest for the trees.</p>

      <p><a href="/blog/microsoft-fabric-architecture-explained-2026" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Microsoft Fabric architecture">Microsoft Fabric</a> is not merely a collection of standalone software-as-a-service (SaaS) tools. It is a highly cohesive ecosystem designed to solve the modern enterprise’s data fragmentation problem. Learning the individual interfaces of Data Factory, Synapse Data Engineering, and Synapse Data Science without a unifying framework is like memorizing the controls of a fighter jet without learning aerodynamic theory. You might get the engine to start, but you won't know how to navigate the skies.</p>

      <p>The missing organizing principle that binds the entire Fabric ecosystem together is the <strong>Medallion Architecture</strong> (also known as the Bronze, Silver, and Gold data layers).</p>

      <p>Understanding this architectural philosophy is the difference between building a fragile, ad-hoc data pipeline that breaks at the first schema change and engineering an elite, scalable, governance-hardened Modern Data Platform Architecture. This comprehensive guide will dissect how the components of Microsoft Fabric align under the Medallion framework, providing a clear roadmap from raw data ingestion to executive-level business intelligence.</p>

      <p style="background: rgba(201, 243, 29, 0.05); padding: 1.25rem; border-left: 4px solid var(--accent); border-radius: 0 8px 8px 0; margin: 1.5rem 0; font-size: 0.95rem; line-height: 1.6;">
        <strong>💡 Validating Your Skills:</strong> If you are looking to certify your knowledge in these architectural principles, Microsoft is currently offering 100% free vouchers for Fabric Analytics and Data Engineering. Check out our <a href="/blog/free-microsoft-certifications-fabric-data-days-2026">Fabric Data Days 2026 voucher guide</a> to secure a free voucher, and read our comparative breakdown of the <a href="/blog/dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison">DP-600 vs DP-700 vs DP-800 exams</a> to pick your path.
      </p>

      <h2>What is Microsoft Fabric? The SaaS Data Revolution</h2>
      <p>Before mapping the architecture, we must establish a baseline understanding of Microsoft Fabric. At its core, Microsoft Fabric is a unified SaaS analytics platform that consolidates data movement, data lake storage, data engineering, data science, real-time analytics, and business intelligence into a single, managed workspace.</p>

      <div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;">
        <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
          graph TD
            A[OneLake: The Single Source of Truth] --> B(Data Factory: Pipelines & Dataflows Gen2)
            A --> C(Synapse Data Engineering: Lakehouse & Spark Notebooks)
            A --> D(Synapse Data Warehouse: Serverless T-SQL)
            A --> E(Synapse Data Science: ML Models & Experiments)
            A --> F(Power BI: Direct Lake Semantic Models)
        </pre>
      </div>

      <p>Fabric decouples computing from storage by introducing <strong>OneLake</strong>—a single, logical, multi-cloud data lake built on the open Delta Parquet format. <a href="/blog/microsoft-fabric-onelake-architecture-guide" class="autolink" style="color: var(--accent); text-decoration: underline;" title="OneLake Architecture Explained">OneLake</a> is the storage foundation that every Fabric workload reads and writes to — understanding it in depth is essential before designing a Medallion Architecture. Our <a href="/blog/microsoft-fabric-onelake-architecture-guide" style="color: var(--accent); text-decoration: underline;">OneLake Architecture Guide</a> covers Delta Lake internals, Shortcuts, Mirroring, and <a href="/blog/power-bi-direct-lake-performance-tuning-fabric" class="autolink" style="color: var(--accent); text-decoration: underline;" title="Direct Lake Explained">Direct Lake</a> in full technical detail. Underneath the unified interface lie several key computing engines:</p>
      <ul>
        <li><strong>Lakehouse:</strong> A unified storage layer combining the scale of a data lake with the ACID transaction guarantees of a database.</li>
        <li><strong>Data Factory (Pipelines and Dataflows Gen2):</strong> The low-code ingestion and orchestration engines.</li>
        <li><strong>Synapse Notebooks & Spark Jobs:</strong> The code-first engine for high-volume data engineering and data science.</li>
        <li><strong>Synapse Data Warehouse:</strong> A fully managed, highly performant SQL computing engine.</li>
        <li><strong>Power BI:</strong> The visualization and reporting layer, utilizing the revolutionary <strong>Direct Lake mode</strong> to query data straight from <a href="/blog/microsoft-fabric-onelake-architecture-guide" class="autolink" style="color: var(--accent); text-decoration: underline;" title="OneLake data storage layout">OneLake</a> without importing or refreshing.</li>
      </ul>

      <h2>The Real Problem with Learning Tools Individually</h2>
      <p>Why do so many developers, MIS managers, and data engineers feel utterly overwhelmed when starting their Microsoft Fabric Tutorial journey? The confusion stems from <strong>tool overload and functional overlap</strong>.</p>
      <p>Without an overarching architectural plan, engineering teams default to whatever tool they feel comfortable with. The result? A chaotic data landscape where raw CSVs sit next to pre-aggregated financial reports, pipelines fetch data directly into operational warehouses, and nobody knows where the single source of truth lies. This ad-hoc approach creates severe pipeline fragility, high maintenance debt, and a complete lack of data governance.</p>

      <h2>What is Medallion Architecture? The Art of Data Refinement</h2>
      <p>Invented by Databricks and quickly adopted as an industry standard, the <strong>Medallion Architecture</strong> is a data design pattern that divides a data platform into three progressive layers of quality: <strong>Bronze (Raw Ingestion)</strong>, <strong>Silver (Cleaned & Standardized)</strong>, and <strong>Gold (Business-Ready Analytics)</strong>.</p>

      <div style="background: var(--surface2); padding: 1.2rem; border-left: 4px solid var(--accent); margin: 1.5rem 0; border-radius: 0 4px 4px 0;">
        <strong>Architect's Note:</strong> Think of Medallion Architecture like water filtration. Raw reservoir water (Bronze) contains debris and mud. It must go through chemical treatment and filtering (Silver) to become clean, safe utility water. Finally, it is mineralized and bottled (Gold) for targeted human consumption.
      </div>

      <p>By dividing the pipeline into these three isolated zones, you protect your production dashboards from structural API modifications and database schema drift. If an upstream system changes a column name, your Bronze layer still captures the data, and your Silver layer can transform it without breaking the final Gold Power BI semantic models.</p>

      <h2>The Bronze Layer: Ingesting Raw Data in Microsoft Fabric</h2>
      <p>The primary objective of the <strong>Bronze Layer</strong> is raw data preservation. Here, data is ingested from external sources (databases, SaaS applications, REST APIs, IoT streams) exactly as it exists in the source system. No transformations, no corrections, and no business logic are applied.</p>
      <p>In the context of Microsoft Fabric Architecture, the Bronze layer is implemented using a <strong>Fabric Lakehouse</strong>'s "Files" directory.</p>
      <ul>
        <li><strong>Fabric Pipelines:</strong> Pipelines are ideal for high-volume, low-code data copy actions. You use the Copy Activity to pull multi-gigabyte database tables or API endpoints directly into OneLake.</li>
        <li><strong>Dataflows Gen2:</strong> For developers who prefer a visual, Power Query-based interface, Dataflows Gen2 can ingest raw files and write them to the lake.</li>
        <li><strong>OneLake Shortcuts:</strong> A game-changing feature in Fabric. Instead of duplicating data, you can create a shortcut to external Amazon S3, ADLS Gen2, or Google Cloud storage, making external raw files instantly visible in your Bronze layer without moving a single byte.</li>
      </ul>
      <p><strong>Operational Principles:</strong> Keep it Append-Only (Bronze data should be historical and immutable, always append new data with an ingestion timestamp) and Schema On Read (don't enforce rigid schemas here; ingest raw formats as-is).</p>

      <h2>The Silver Layer: Cleaning & Conforming Data with Spark</h2>
      <p>The <strong>Silver Layer</strong> is the heart of your data engineering pipeline. It represents your enterprise's <strong>Single Source of Truth (SSOT)</strong>. In this layer, raw data from the Bronze lakehouse is read, validated, cleaned, standardized, and conformed into a unified schema.</p>
      <p><strong>Typical Silver Transformations:</strong> Data Cleansing (converting empty strings to standardized NULLs), Type Casting (enforcing strict data types), Deduplication (removing identical transaction keys), Enrichment (joining transaction records with master operational lookup tables), and ACID Compliance (storing data in Delta Parquet format to enable update/delete transactions via UPSERT or MERGE).</p>
      <p>In Microsoft Fabric, PySpark is the premium tool of choice here. Using Synapse Spark Notebooks, you write optimized scripts to read millions of Bronze raw files, clean them, and save them as Delta tables in your Silver Lakehouse, orchestrating them on schedules or event-triggers using Data Factory Pipelines.</p>

      <h2>The Gold Layer: Aggregated Business-Ready Analytics</h2>
      <p>The <strong>Gold Layer</strong> is where raw engineering turns into actionable business value. Data in the Gold layer is optimized for consumption. It is no longer organized by technical source systems, but rather structured into business-ready subject areas (such as Sales, Finance, Logistics, or Marketing).</p>
      <p>Gold data is structured as a <strong>Star Schema</strong>, composed of Fact Tables (numerical transaction metrics) and Dimension Tables (descriptive lookup variables).</p>
      <ul>
        <li><strong>Synapse Data Warehouse:</strong> Unlike Silver which is managed via code-first Spark Lakehouses, the Gold layer is often modeled using the Synapse Data Warehouse. Here, you use standard, highly performant Serverless SQL views, stored procedures, and T-SQL queries to build dimensional star schemas.</li>
        <li><strong>Direct Lake Power BI Semantic Models:</strong> This is Microsoft Fabric's greatest engineering feat. Power BI can read Gold Delta tables directly from OneLake in Direct Lake mode. There is no import step, no data duplication, and no query lag. You get the performance of an in-memory import with the real-time availability of Direct Query.</li>
      </ul>

      <h2>Putting it All Together: The End-to-End Fabric Workflow</h2>
      <p>How do these layers connect in a live enterprise? Let's trace the journey of an order transaction at a multi-national logistics company using a unified Medallion pipeline:</p>

      <div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 4px; margin: 2rem 0; overflow-x: auto;">
        <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
          graph LR
            Source[Raw Order API] --> Bronze[Bronze Layer: Order CSV]
            Bronze --> Silver[Silver Layer: Conformed Delta Table]
            Silver --> Gold[Gold Layer: SQL Star Schema]
            Gold --> Output[Power BI Direct Lake Dashboard]
        </pre>
      </div>

      <p>By separating the architecture into these discrete segments, you achieve a level of clarity that transforms how your data engineering and analytical departments collaborate: Data Engineers own the ingestion and transformation pipelines from Bronze to Silver, while Data Analysts & Business Intelligence Specialists own the Gold layer modeling and Power BI dashboard creation, free from the complexities of cleaning corrupt raw formats.</p>

      <h2>Why Medallion Architecture Matters: The Business Case</h2>
      <ul>
        <li><strong>Elite Data Quality & Governance:</strong> If an analyst spots an anomaly in an executive Power BI dashboard (Gold), you can easily trace it back to the conformed state (Silver) and inspect the pristine historical data (Bronze) to pinpoint the exact logic error.</li>
        <li><strong>Massive Cost & Performance Savings:</strong> Because Silver and Gold layers utilize Delta Parquet and V-Order indexing, downstream operations consume significantly less computing resource, dramatically lowering your capacity costs.</li>
        <li><strong>AI Readiness:</strong> Clean, organized Silver and Gold datasets provide a clean ground truth to train machine learning models and feed context to autonomous AI business agents without exposing LLMs to chaotic, raw formats.</li>
      </ul>

      <h2>Common Mistakes Beginners Make</h2>
      <ol>
        <li><strong>Skipping the Silver Layer:</strong> Beginners often ingest raw data into Bronze and build Power BI reports directly off the raw files. This causes massive calculation lag and breaks dashboards the second a file schema changes.</li>
        <li><strong>Mixing Raw and Transformed Data:</strong> Never store cleaned, standardized tables in the same workspace or Lakehouse folder as raw CSVs. Maintain strict structural separation.</li>
        <li><strong>Ignoring Data Modeling:</strong> Microsoft Fabric is powerful, but it cannot fix a poor database design. Do not dump flat Silver tables straight into Power BI. Always model your Gold layer into a clean, star schema to ensure DAX performance remains ultra-fast.</li>
      </ol>

      <h2>Conclusion: The System is the Key</h2>
      <p>Microsoft Fabric is a revolutionary platform, but its strength lies not in its individual tools, but in how those tools serve a unified architectural system. By organizing your Lakehouses, Pipelines, Notebooks, SQL Warehouses, and Power BI semantic models around the Medallion Architecture, you transform Microsoft Fabric from a confusing suite of tools into a robust, high-performance data pipeline. Stop memorizing buttons and interface components. Start thinking like a data architect. Build a system, not just a pipeline.</p>

      <h2 id="related-reading" style="font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; color: var(--text);">Related Resources & Internal Links</h2>
      <p>To further expand your expertise in advanced data architectures and artificial intelligence, explore these detailed technical write-ups:</p>
      <ul style="list-style-type: disc; padding-left: 1.5rem; margin-bottom: 2rem; line-height: 1.7; color: var(--muted);">
        <li><a href="/blog/microsoft-fabric-architectural-guide" style="color: var(--accent); text-decoration: none; font-weight: 600;">The Fabric Architect’s Manifesto: The Unofficial Microsoft Fabric Architectural Guide</a></li>
        <li><a href="/blog/why-microsoft-fabric-skills-will-dominate-the-data-industry-in-2026" style="color: var(--accent); text-decoration: none; font-weight: 600;">Why Microsoft Fabric Skills Will Dominate the Data Industry in 2026</a></li>
      </ul>
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
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Data Engineering</span>
      <a href="/blog/dp-700-study-guide-2026" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">DP-700 Study Guide 2026: Complete Microsoft Fabric Data Engineer Certification Preparation</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Architecture</span>
      <a href="/blog/architecting-compound-ai-systems-microsoft-fabric" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">Architecting Compound AI Systems: A Microsoft Fabric and Python Guide</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Architecture & BI</span>
      <a href="/blog/why-microsoft-fabric-skills-will-dominate-the-data-industry-in-2026" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">Why Microsoft Fabric Skills Will Dominate the Data Industry in 2026</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Architecture & BI</span>
      <a href="/blog/microsoft-fabric-architecture-explained-2026" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">Microsoft Fabric Architecture Explained: The Complete 2026 Guide</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Microsoft Fabric</span>
      <a href="/blog/microsoft-fabric-onelake-architecture-guide" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">OneLake Explained: The Complete Microsoft Fabric OneLake Architecture Guide (2026 Edition)</a>
    </li>
    <li style="border-left: 2px solid var(--accent); padding-left: 1rem;">
      <span style="font-family: monospace; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 0.25rem;">Architecture</span>
      <a href="/blog/architecting-compound-ai-systems-microsoft-fabric" style="color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.95rem; line-height: 1.4; hover: text-[var(--accent)]">Most Enterprises Build Fragile RAG Pipelines — Here is How to Architect Compound AI Systems Using Microsoft Fabric and Python</a>
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
