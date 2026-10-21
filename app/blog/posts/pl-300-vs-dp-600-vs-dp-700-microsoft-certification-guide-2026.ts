export const pl300VsDp600VsDp700MicrosoftCertificationGuide2026Post = {
  id: "pl-300-vs-dp-600-vs-dp-700-guide-2026",
  slug: "pl-300-vs-dp-600-vs-dp-700-microsoft-certification-guide-2026",
  title: "PL-300 vs DP-600 vs DP-700: The Definitive Microsoft Power BI & Fabric Certification Guide (2026)",
  category: "Architecture & BI",
  excerpt: "The ultimate 2026 engineering and career guide comparing PL-300 (Power BI Data Analyst), DP-600 (Fabric Analytics Engineer), and DP-700 (Fabric Data Engineer). Master syllabus differences, exam difficulty, Direct Lake architecture, PySpark requirements, salary benchmarks, and decision frameworks.",
  date: "October 20, 2026",
  readTime: 36,
  color: "var(--accent)",
  icon: "🏆",
  image: "/images/blog/dp-600-vs-dp-700-vs-dp-800-comparative-guide.webp",
  tags: [
    "Microsoft Fabric",
    "PL-300",
    "DP-600",
    "DP-700",
    "Power BI",
    "Analytics Engineering",
    "Data Engineering",
    "Direct Lake",
    "Certification Guide",
    "Career Roadmap"
  ],
  published: true,
  blocks: {
    focusedKeyword: "PL-300 vs DP-600 vs DP-700"
  },
  content: `
<!-- PREREQUISITE_START -->
<div class="prereq-callout" style="margin: 2rem 0; padding: 1.5rem; background: rgba(201, 243, 29, 0.02); border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 0 4px 4px 0;">
  <span style="font-family: monospace; font-size: 0.75rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem;">Recommended Architecture Companion</span>
  <p style="font-size: 0.85rem; color: var(--muted); margin: 0 0 0.75rem 0; line-height: 1.5;">To get the most out of this certification breakdown, review our core Microsoft Fabric architectural blueprints:</p>
  <a href="/blog/dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison" style="color: var(--text); text-decoration: none; font-weight: 700; font-size: 0.9rem; display: block; margin-top: 0.25rem;">&rarr; DP-600 vs DP-700 vs DP-800: The Three-Way Fabric Matrix</a>
  <a href="/blog/microsoft-fabric-architecture-explained-2026" style="color: var(--text); text-decoration: none; font-weight: 700; font-size: 0.9rem; display: block; margin-top: 0.25rem;">&rarr; Microsoft Fabric Architecture Explained (2026 Deep Dive)</a>
  <a href="/blog/power-bi-direct-lake-performance-tuning-fabric" style="color: var(--text); text-decoration: none; font-weight: 700; font-size: 0.9rem; display: block; margin-top: 0.25rem;">&rarr; Power BI Direct Lake Performance Tuning Guide</a>
  <a href="/certification" style="color: var(--text); text-decoration: none; font-weight: 700; font-size: 0.9rem; display: block; margin-top: 0.25rem;">&rarr; View Datta Sable Verified Microsoft & Google Credentials</a>
</div>
<!-- PREREQUISITE_END -->

<!-- BREADCRUMB_START -->
<div class="breadcrumb-container" style="font-family: monospace; font-size: 0.8rem; margin-bottom: 2rem; color: var(--muted); border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
  <a href="/" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Home</a> &gt; 
  <a href="/blog" style="color: var(--muted); text-decoration: none; hover: text-[var(--accent)]">Blog</a> &gt; 
  <a href="/blog/microsoft-fabric" style="color: var(--accent); text-decoration: none; font-weight: 600;">Microsoft Fabric Hub</a> &gt; 
  <span style="color: var(--text);">PL-300 vs DP-600 vs DP-700 Certification Guide</span>
</div>
<!-- BREADCRUMB_END -->

<div class="featured-snippet" style="background: rgba(201, 243, 29, 0.05); padding: 1.5rem; border-left: 4px solid var(--accent); border-radius: 0 8px 8px 0; margin-bottom: 2rem; font-size: 1.05rem; line-height: 1.8; color: var(--text);">
  <p><strong>What is the difference between PL-300, DP-600, and DP-700?</strong> In 2026, Microsoft data credentials represent three distinct tiers of the data ecosystem. <strong>PL-300 (Power BI Data Analyst)</strong> evaluates visualization, report design, Power Query data transformation, and fundamental DAX calculations. <strong>DP-600 (Fabric Analytics Engineer)</strong> elevates you into the semantic modeling and lakehouse architecture layer, requiring mastery of Direct Lake mode, OneLake storage, Fabric Warehouses, and Tabular Model Definition Language (TMDL). <strong>DP-700 (Fabric Data Engineer)</strong> tests the foundational data pipeline and storage backbone, focusing heavily on Apache Spark, PySpark transformations, OneLake shortcuts, database mirroring, and enterprise Purview governance.</p>
</div>

<h2 id="section-1" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">1. The 2026 Enterprise Context: The Fabric Convergence & The Death of Siloed BI</h2>
<p>For nearly a decade, the business intelligence landscape operated on clean, isolated fault lines. On one side stood the <strong>BI Developer</strong>, armed with Power BI Desktop, DAX Studio, and Power Query M. Their responsibility ended at the boundary of imported tabular models and scheduled refreshes. On the opposite side stood the <strong>Data Engineer</strong>, residing in Azure Data Factory, Databricks, and Synapse Analytics, orchestrating complex SQL and Spark pipelines to dump data into cloud storage.</p>
<p>In 2026, that boundary has dissolved entirely. The launch and enterprise adoption of <strong>Microsoft Fabric</strong> has unified storage into a single open format: <strong>OneLake</strong> with Delta Parquet tables. With this unified architecture, reporting layers no longer import data into proprietary VertiPaq files. Instead, semantic models query lakehouses directly at memory-speed through <strong>Direct Lake mode</strong>.</p>
<p>This technical revolution triggered immense confusion across the hiring market and among data practitioners. The most common questions asked by engineers, hiring managers, and enterprise directors are:</p>
<ul style="line-height: 1.8; padding-left: 1.5rem; list-style-type: square; margin-bottom: 1.5rem;">
  <li><em>"Is PL-300 dead? Has Microsoft Fabric made the Power BI Data Analyst Associate obsolete?"</em></li>
  <li><em>"Should I skip PL-300 entirely and go straight for DP-600?"</em></li>
  <li><em>"Where does DP-700 fit, and how does it compare to the retired DP-203 Azure Data Engineer exam?"</em></li>
  <li><em>"What is the actual compensation premium of becoming a certified Fabric Analytics Engineer vs a traditional Power BI developer?"</em></li>
</ul>
<p>This definitive masterclass answers every single one of those questions with architectural precision, hands-on syllabus analysis, and enterprise hiring realities.</p>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-2" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">2. Executive 30-Second Comparison Matrix</h2>
<p>If you need an immediate reference point before diving into our deep technical breakdowns, review this foundational comparison matrix:</p>

<div class="overflow-x-auto my-8" style="overflow-x: auto;">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem; background: var(--surface);">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 2px solid var(--border);">
        <th style="padding: 14px; text-align: left; border-right: 1px solid var(--border); color: var(--accent);">Evaluation Dimension</th>
        <th style="padding: 14px; text-align: left; border-right: 1px solid var(--border);">PL-300 (Power BI Analyst)</th>
        <th style="padding: 14px; text-align: left; border-right: 1px solid var(--border);">DP-600 (Fabric Analytics Engineer)</th>
        <th style="padding: 14px; text-align: left;">DP-700 (Fabric Data Engineer)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Primary Role Focus</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Report authoring, dashboard UX, business metrics, basic DAX.</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Enterprise semantic models, Direct Lake, Fabric Warehouses, TMDL.</td>
        <td style="padding: 12px;">Data ingestion, Spark processing, OneLake shortcuts, Medallion pipelines.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Core Technologies</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Power BI Desktop, Power Query, Service Workspaces.</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">OneLake, Fabric Lakehouse/Warehouse, DAX Studio, Git CI/CD.</td>
        <td style="padding: 12px;">Apache Spark, PySpark, Data Factory Pipelines, KQL, Purview.</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Primary Languages</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">DAX, Power Query M.</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Advanced DAX, T-SQL, M, basic PySpark.</td>
        <td style="padding: 12px;">PySpark / Python, SQL, KQL (Kusto Query Language).</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Exam Technical Depth</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Moderate (Business logic & visual storytelling focus).</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Advanced (Data modeling, performance optimization, Lakehouse internals).</td>
        <td style="padding: 12px;">Very Advanced (Code-heavy pipelines, distributed computing, governance).</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Average Global Salary (US)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">$85,000 – $115,000</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">$130,000 – $165,000</td>
        <td style="padding: 12px; font-weight: bold; color: var(--accent);">$140,000 – $180,000</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Pre-Requisite Recommendation</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">None (Great entry point for data careers).</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">PL-300 or 18+ months hands-on Power BI experience.</td>
        <td style="padding: 12px;">Solid SQL, Python/Spark fundamentals, and cloud storage basics.</td>
      </tr>
    </tbody>
  </table>
</div>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-3" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">3. Deep Dive: Exam PL-300 (Microsoft Certified: Power BI Data Analyst Associate)</h2>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">Target Persona & Philosophy</h3>
<p>The <strong>PL-300 exam</strong> validates your ability to deliver actionable business value through data storytelling. The persona targeted is the traditional <strong>Business Intelligence Analyst</strong>, <strong>Reporting Specialist</strong>, or <strong>Departmental Data Specialist</strong>. Your focus is user-centric: taking raw tables from diverse sources, cleaning them via Power Query, shaping them into a clean star schema, and building visually compelling dashboards that business leaders can navigate seamlessly.</p>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">Official Exam Domains & Weightage</h3>
<div style="background: var(--surface2); padding: 1.5rem; border-radius: 6px; border: 1px solid var(--border); margin-bottom: 1.5rem;">
  <ul style="list-style-type: disc; padding-left: 1.5rem; line-height: 1.8;">
    <li><strong>Prepare the Data (25–30%):</strong> Ingesting data from Excel, SQL databases, SharePoint, and Web endpoints; profiling columns; writing custom M code; pivoting, unpivoting, merging, and appending queries.</li>
    <li><strong>Model the Data (25–30%):</strong> Designing dimensional star schemas; configuring relationships (1:many, many:many, active vs inactive); implementing Row-Level Security (RLS); writing foundational DAX measures (<code style="color: var(--accent);">CALCULATE</code>, <code style="color: var(--accent);">FILTER</code>, time intelligence like <code style="color: var(--accent);">TOTALYTD</code>, <code style="color: var(--accent);">SAMEPERIODLASTYEAR</code>).</li>
    <li><strong>Visualize and Analyze the Data (25–30%):</strong> Selecting the appropriate chart types; conditional formatting; bookmarks and selection panes; drill-through and tooltips; AI visuals (Key Influencers, Decomposition Tree); Q&A configurations.</li>
    <li><strong>Deploy and Maintain Assets (15–20%):</strong> Managing workspace permissions; publishing apps; configuring scheduled gateway refreshes; managing semantic model endorsements (Promoted vs Certified).</li>
  </ul>
</div>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">The Limitations of PL-300 in 2026</h3>
<p>While PL-300 remains the most popular data credential in Microsoft history, it has clear architectural limits. PL-300 <strong>completely ignores</strong>:</p>
<ul style="line-height: 1.8; padding-left: 1.5rem; list-style-type: circle;">
  <li><strong>OneLake & Delta Parquet Architecture:</strong> PL-300 assumes data lives in isolated imported <code style="color: var(--accent);">.pbix</code> models or traditional DirectQuery relational databases.</li>
  <li><strong>Direct Lake Mode:</strong> You will not be tested on memory-mapping Delta tables from Fabric Lakehouses without data movement.</li>
  <li><strong>Enterprise DevOps & Git Integration:</strong> PL-300 does not test PBIP files, source control, Azure DevOps deployment pipelines, or Fabric workspace Git binding.</li>
  <li><strong>Fabric Capacity Planning:</strong> No questions on Capacity Units (CU), F-SKU sizing, bursting, or smoothing.</li>
</ul>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-4" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">4. Deep Dive: Exam DP-600 (Microsoft Certified: Fabric Analytics Engineer Associate)</h2>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">Target Persona & Philosophy</h3>
<p>The <strong>DP-600 exam</strong> tests the modern <strong>Analytics Engineer</strong>. In the modern data stack, the Analytics Engineer acts as the vital bridge between data infrastructure and consumption. You are not building colorful visuals for quarterly meetings; you are architecting the <strong>single source of truth</strong> for the entire enterprise. Your job is to transform raw Delta tables into governed, high-performance semantic models that hundreds of analysts can self-serve from simultaneously without crashing server capacities.</p>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">Official Exam Domains & Weightage</h3>
<div style="background: var(--surface2); padding: 1.5rem; border-radius: 6px; border: 1px solid var(--border); margin-bottom: 1.5rem;">
  <ul style="list-style-type: disc; padding-left: 1.5rem; line-height: 1.8;">
    <li><strong>Plan, Implement, and Manage a Solution for Data Analytics (10–15%):</strong> Workspace architecture, Fabric capacity management (smoothing, throttling, pausing), Git integration, deployment pipelines, semantic model lineage, and monitoring via the Microsoft Fabric Capacity Metrics app.</li>
    <li><strong>Prepare and Serve Data (40–45%):</strong> Loading data into Fabric Lakehouses and Warehouses; using Dataflows Gen2; querying Delta tables using T-SQL and Spark; selecting between Lakehouse and Warehouse architectures; optimizing Delta Parquet files (V-Order, compaction).</li>
    <li><strong>Implement and Manage Semantic Models (20–25%):</strong> Creating scalable Direct Lake semantic models; designing Star Schemas over Lakehouse Delta tables; managing calculation groups; configuring dynamic Row-Level Security (RLS) and Object-Level Security (OLS); deploying models using Tabular Model Definition Language (TMDL).</li>
    <li><strong>Explore and Analyze Data (20–25%):</strong> Writing complex T-SQL queries with Window functions (<code style="color: var(--accent);">LEAD</code>, <code style="color: var(--accent);">LAG</code>, <code style="color: var(--accent);">DENSE_RANK</code>); analyzing query execution plans; writing advanced DAX to avoid performance bottlenecks; evaluating VertiPaq vs Direct Lake memory footprints using DAX Studio.</li>
  </ul>
</div>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">Why DP-600 Has a 50%+ Failure Rate for Pure Power BI Developers</h3>
<p>Engineers coming from a traditional PL-300 background frequently fail DP-600 because they underestimate the <strong>backend data engineering depth</strong>. DP-600 tests scenarios such as:</p>
<ul style="line-height: 1.8; padding-left: 1.5rem; list-style-type: disc;">
  <li><strong>The Direct Lake Fallback Trap:</strong> Knowing the exact triggers that cause Direct Lake mode to drop back into slow DirectQuery mode (e.g., unsupported DAX functions, views over tables, row-level security applied directly on Lakehouse SQL endpoints instead of the semantic model).</li>
  <li><strong>T-SQL Warehousing Quirks:</strong> Fabric Warehouse is not traditional SQL Server; it is a distributed engine that does not support identity columns, primary key enforcement, or clustered rowstore indexes. You must understand distribution statistics, cross-database querying, and table partitioning.</li>
  <li><strong>TMDL and External Tooling:</strong> Editing semantic models through Tabular Editor 3, scripting deployments via XMLA endpoints, and managing code branches in Git.</li>
</ul>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-5" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">5. Deep Dive: Exam DP-700 (Microsoft Certified: Fabric Data Engineer Associate)</h2>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">Target Persona & Philosophy</h3>
<p>The <strong>DP-700 exam</strong> is the premier credential for the <strong>Fabric Data Engineer</strong>. While DP-600 centers on data consumption and semantic layers, DP-700 centers on <strong>data ingestion, heavy distributed computing, and enterprise data lifecycle orchestration</strong>. You are the builder of the pipeline highways. You ingest millions of records per minute from external clouds, on-premises systems, and operational databases, clean them using Apache Spark, and organize them into an immutable Medallion Architecture.</p>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">Official Exam Domains & Weightage</h3>
<div style="background: var(--surface2); padding: 1.5rem; border-radius: 6px; border: 1px solid var(--border); margin-bottom: 1.5rem;">
  <ul style="list-style-type: disc; padding-left: 1.5rem; line-height: 1.8;">
    <li><strong>Ingest and Transform Data (35–40%):</strong> Building Data Factory pipelines; orchestrating Copy activities, Web hooks, and ForEach loops; developing PySpark notebooks; tuning Spark session pools and executor cores; applying Delta Lake transformations (<code style="color: var(--accent);">MERGE INTO</code>, SCD Type 1 and Type 2 updates).</li>
    <li><strong>Design and Implement Data Storage (25–30%):</strong> Structuring OneLake storage; configuring OneLake Shortcuts to Amazon S3, Google Cloud Storage, and Azure Data Lake Storage Gen2; setting up Fabric Database Mirroring for Azure SQL, Cosmos DB, and Snowflake; optimizing Delta logs, V-Order, and compaction.</li>
    <li><strong>Secure and Govern Data (15–20%):</strong> Implementing OneLake security roles; integrating Microsoft Purview for sensitivity labeling and data loss prevention; configuring managed private endpoints and customer-managed keys (CMK); masking sensitive PII data.</li>
    <li><strong>Monitor and Optimize the Solution (15–20%):</strong> Troubleshooting pipeline failures; profiling Spark execution DAGs and skew; analyzing Capacity Unit consumption via Fabric Metrics; managing workspace disaster recovery and tenant governance settings.</li>
  </ul>
</div>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">DP-700 vs The Old DP-203 Exam</h3>
<p>For years, <strong>DP-203 (Data Engineering on Microsoft Azure)</strong> was the industry benchmark. However, DP-203 required mastering disconnected Azure resources: creating an Azure Synapse workspace, standing up a dedicated Azure Data Factory instance, configuring separate Azure Databricks clusters, and managing Azure Data Lake storage accounts manually.</p>
<p><strong>DP-700 modernizes this entirely into Microsoft Fabric.</strong> Instead of provisioning and maintaining 5 separate Azure resources with separate billing models, DP-700 tests your ability to achieve the same data engineering workflows inside a single SaaS workspace powered by OneLake and serverless Spark compute pools.</p>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-6" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">6. Head-to-Head Showdowns: Direct Exam Comparisons</h2>

<div class="showdown-card" style="border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; background: var(--surface);">
  <h3 style="color: var(--accent); margin-top: 0; font-size: 1.3rem;">Showdown 1: PL-300 vs DP-600 (The Power BI Upgrade Dilemma)</h3>
  <p><strong>The Core Question:</strong> <em>"I have 2 years of Power BI experience. Can I skip PL-300 and go directly to DP-600?"</em></p>
  <p><strong>The Architectural Verdict:</strong> You can skip PL-300 <strong>only if</strong> you have strong foundational experience in dimensional modeling and basic SQL. If all your Power BI models are built by importing a single flat Excel sheet and clicking buttons in the UI, jumping into DP-600 will be overwhelming.</p>
  <table style="width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.85rem;">
    <tr style="border-bottom: 1px solid var(--border);"><th style="padding: 8px; text-align: left;">Technical Area</th><th style="padding: 8px; text-align: left;">PL-300 Requirement</th><th style="padding: 8px; text-align: left;">DP-600 Requirement</th></tr>
    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; font-weight: bold;">DAX Complexity</td><td style="padding: 8px;">Basic to Intermediate (CALCULATE, RELATED, DATEADD)</td><td style="padding: 8px;">Advanced (Calculation Groups, Window DAX, Performance Tuning)</td></tr>
    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; font-weight: bold;">Data Storage</td><td style="padding: 8px;">VertiPaq In-Memory (Power BI Desktop cache)</td><td style="padding: 8px;">OneLake Delta Parquet + Direct Lake memory paging</td></tr>
    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; font-weight: bold;">Source Control</td><td style="padding: 8px;">Manual .PBIX file saves / SharePoint versions</td><td style="padding: 8px;">Git Integration, PBIP format, Azure DevOps pipelines</td></tr>
    <tr><td style="padding: 8px; font-weight: bold;">SQL Requirement</td><td style="padding: 8px;">Optional / Basic SELECT queries</td><td style="padding: 8px;">Mandatory advanced T-SQL over distributed tables</td></tr>
  </table>
</div>

<div class="showdown-card" style="border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; background: var(--surface);">
  <h3 style="color: var(--accent); margin-top: 0; font-size: 1.3rem;">Showdown 2: DP-600 vs DP-700 (Analytics Engineer vs Data Engineer)</h3>
  <p><strong>The Core Question:</strong> <em>"Both are Microsoft Fabric exams. How do I decide between Analytics Engineer and Data Engineer?"</em></p>
  <p><strong>The Architectural Verdict:</strong> Look at your day-to-day code. If your preferred languages are <strong>DAX, T-SQL, and semantic modeling</strong>, take <strong>DP-600</strong>. If your preferred languages are <strong>PySpark, Python, and data pipeline orchestration</strong>, take <strong>DP-700</strong>.</p>
  <table style="width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.85rem;">
    <tr style="border-bottom: 1px solid var(--border);"><th style="padding: 8px; text-align: left;">Architectural Layer</th><th style="padding: 8px; text-align: left;">DP-600 (Analytics Engineer)</th><th style="padding: 8px; text-align: left;">DP-700 (Data Engineer)</th></tr>
    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; font-weight: bold;">Medallion Stage</td><td style="padding: 8px;">Gold Layer (Business logic, star schema, aggregated views)</td><td style="padding: 8px;">Bronze & Silver Layers (Raw ingestion, cleansing, deduplication)</td></tr>
    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; font-weight: bold;">Compute Engine</td><td style="padding: 8px;">Fabric SQL Engine (T-SQL) & Analysis Services VertiPaq</td><td style="padding: 8px;">Apache Spark Engine (PySpark, Scala) & Data Factory</td></tr>
    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; font-weight: bold;">Integration Mode</td><td style="padding: 8px;">Direct Lake Semantic Models over Gold Tables</td><td style="padding: 8px;">OneLake Shortcuts, Real-Time Streams, Database Mirroring</td></tr>
    <tr><td style="padding: 8px; font-weight: bold;">Primary Stakeholder</td><td style="padding: 8px;">Business Analysts, C-Suite, BI consumers</td><td style="padding: 8px;">Analytics Engineers, Data Scientists, Security Architects</td></tr>
  </table>
</div>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-7" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">7. Comprehensive 25-Point Technical Skills Breakdown</h2>
<p>To help you audit your technical readiness, review this detailed 25-point skills matrix across all three exams:</p>

<div class="overflow-x-auto my-8" style="overflow-x: auto;">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.85rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 2px solid var(--border);">
        <th style="padding: 10px; text-align: left; border-right: 1px solid var(--border);">Technical Skill / Capability</th>
        <th style="padding: 10px; text-align: center; border-right: 1px solid var(--border);">PL-300</th>
        <th style="padding: 10px; text-align: center; border-right: 1px solid var(--border);">DP-600</th>
        <th style="padding: 10px; text-align: center;">DP-700</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">Power BI Visual Design & Navigation</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td><td style="text-align:center; color: var(--muted);">★ Basic</td><td style="text-align:center; color: var(--muted);">- None</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">Power Query M Transformations</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td><td style="text-align:center; color: #10b981;">★★ Intermediate</td><td style="text-align:center; color: var(--muted);">★ Basic</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">DAX Measures & Context Transition</td><td style="text-align:center; color: #10b981;">★★ Intermediate</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td><td style="text-align:center; color: var(--muted);">- None</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">DAX Calculation Groups & TMDL</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td><td style="text-align:center; color: var(--muted);">- None</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">Direct Lake Model Architecture</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td><td style="text-align:center; color: #10b981;">★★ Intermediate</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">OneLake Architecture & Delta Tables</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">Fabric T-SQL Data Warehouse</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td><td style="text-align:center; color: #10b981;">★★ Intermediate</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">Apache Spark & PySpark Notebooks</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981;">★ Basic (EDA)</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">Data Factory Ingestion Pipelines</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981;">★ Basic</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">OneLake Shortcuts (S3 / ADLS / Dataverse)</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981;">★★ Intermediate</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">Database Mirroring (Cosmos DB, Snowflake)</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981;">★ Basic</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">Delta Log V-Order & Compaction</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">Fabric Git Integration & CI/CD</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">Fabric Capacity Metrics & Throttling</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td></tr>
      <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 8px; border-right: 1px solid var(--border);">Microsoft Purview Governance & Lineage</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981;">★★ Intermediate</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td></tr>
      <tr><td style="padding: 8px; border-right: 1px solid var(--border);">Real-Time Intelligence (KQL / Eventhouse)</td><td style="text-align:center; color: var(--muted);">- None</td><td style="text-align:center; color: #10b981;">★ Basic</td><td style="text-align:center; color: #10b981; font-weight:bold;">★★★ Expert</td></tr>
    </tbody>
  </table>
</div>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-8" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">8. Direct Lake Internals, Memory Paging & Fallback Architecture</h2>
<p>Understanding <strong>Direct Lake mode</strong> is the single most tested architectural topic on DP-600 and DP-700. In legacy Power BI architectures, you had two distinct choices: <strong>Import mode</strong> (lightning-fast VertiPaq columnar memory, but constrained by file sizes and multi-hour scheduled refreshes) or <strong>DirectQuery mode</strong> (real-time data from SQL, but agonizingly slow rendering with high relational database load).</p>
<p><strong>Direct Lake eliminates this trade-off.</strong> Instead of copying and compressing data into proprietary <code style="color: var(--accent);">.abf</code> files, the Analysis Services engine reads natively formatted <strong>Delta Parquet files directly from OneLake storage</strong>. When a DAX query executes, the engine memory-maps the required parquet columns straight into server RAM. There is zero data duplication, zero scheduled model refresh latency, and pure in-memory VertiPaq query speeds.</p>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">The 6 Fatal Triggers That Cause Direct Lake Fallback</h3>
<p>In both real-world enterprise deployments and Microsoft certification exams, the greatest hazard is <strong>unintended fallback to DirectQuery</strong>. When fallback occurs, reports that loaded in 400 milliseconds suddenly degrade to 25 seconds. Microsoft exams test whether you can identify and prevent these 6 exact triggers:</p>

<div style="background: var(--surface2); padding: 1.5rem; border-radius: 6px; border: 1px solid var(--border); margin: 1.5rem 0;">
  <ul style="list-style-type: disc; padding-left: 1.5rem; line-height: 1.8;">
    <li><strong>1. Memory Budget Exceeded (SKU Paging Limits):</strong> Every Fabric capacity SKU has a strict Direct Lake memory ceiling. For example, an F64 capacity allows up to 25 GB of memory per semantic model. If user queries require paging columns that exceed this limit, Analysis Services falls back to DirectQuery over the Lakehouse SQL Analytics Endpoint.</li>
    <li><strong>2. Calculated Columns Defined in the Model:</strong> Direct Lake models do not allow DAX calculated columns. Because the VertiPaq engine reads immutable Parquet columns from storage, it cannot write back new calculated row vectors on the fly. If you create a calculated column in the semantic model, the table immediately drops to DirectQuery. <em>Exam Solution: Pre-calculate columns upstream in Delta tables using Spark or T-SQL views.</em></li>
    <li><strong>3. Row-Level Security (RLS) Applied at the SQL Endpoint:</strong> If you configure security roles on the Lakehouse SQL Analytics Endpoint, Direct Lake cannot bypass the relational security boundary. It must fall back to DirectQuery to enforce SQL permissions. <em>Exam Solution: Define RLS directly inside the Power BI semantic model using DAX expressions.</em></li>
    <li><strong>4. Pointing to SQL Views Instead of Native Delta Tables:</strong> Direct Lake requires native Delta Parquet files with transaction log checkpoints (<code style="color: var(--accent);">_delta_log</code>). If you point a semantic model partition to a T-SQL view created in the SQL endpoint, it will execute exclusively in DirectQuery mode.</li>
    <li><strong>5. Delta Transaction Log Framing Desynchronization:</strong> When a Spark notebook or Data Factory pipeline updates a Lakehouse table, the Delta log advances to a new version. If the semantic model has not refreshed its metadata framing (automatic or via XMLA), queries encountering schema mutations drop back to DirectQuery until framing syncs.</li>
    <li><strong>6. Unsupported Data Types:</strong> Tables containing unsupported types such as binary data, timestamps with non-UTC time zones, or precision scale exceeding 38 digits will refuse to load into Direct Lake memory.</li>
  </ul>
</div>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">Verifying Direct Lake Execution in DAX Studio</h3>
<p>To verify whether your queries run in pure Direct Lake or have suffered silent fallback, you must monitor <strong>Server Timings</strong> in DAX Studio:</p>

<div style="background: #0d1117; border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: monospace; font-size: 0.85rem; color: #c9d1d9; margin: 1.5rem 0; overflow-x: auto;">
  <span style="color: #8b949e;">// DAX Studio Server Timings Diagnostic Checklist</span><br/>
  <span style="color: #7ee787;">[Pure Direct Lake Execution]</span><br/>
  &bull; Storage Engine (SE) Events: Shows <span style="color: var(--accent); font-weight: bold;">VertiPaq SE</span> queries reading memory-mapped Parquet.<br/>
  &bull; DirectQuery Events: <strong>0 ms (No DirectQueryBegin or DirectQueryEnd events)</strong>.<br/>
  &bull; Total SE Duration: < 50 ms.<br/><br/>
  <span style="color: #f85149;">[Direct Lake Fallback Detected]</span><br/>
  &bull; Storage Engine (SE) Events: <strong>DirectQueryBegin</strong> and <strong>DirectQueryEnd</strong> triggered.<br/>
  &bull; Query Text: Shows generated SQL query sent to Lakehouse SQL endpoint.<br/>
  &bull; Root Cause: Verify memory limits, calculated columns, or Lakehouse SQL views.
</div>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">Tabular Model Definition Language (TMDL) Direct Lake Partition</h3>
<p>On DP-600, you are expected to understand how modern semantic models are declared in code. Here is how a Direct Lake partition is defined in TMDL:</p>

<div style="background: #0d1117; border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: monospace; font-size: 0.85rem; color: #c9d1d9; margin: 1.5rem 0; overflow-x: auto;">
  <span style="color: #ff7b72;">table</span> <span style="color: #79c0ff;">FactInternetSales</span><br/>
  &nbsp;&nbsp;<span style="color: #ff7b72;">lineageTag:</span> 4a5e3f12-78d1-4e2a-a92c-9bf8d312e091<br/><br/>
  &nbsp;&nbsp;<span style="color: #ff7b72;">partition</span> <span style="color: #79c0ff;">FactInternetSales-DirectLake</span> = <span style="color: #ffa657;">entity</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #7ee787;">mode:</span> <span style="color: var(--accent); font-weight: bold;">directLake</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #7ee787;">source</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #79c0ff;">entityName:</span> factinternetsales<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #79c0ff;">schemaName:</span> dbo<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #79c0ff;">expressionSource:</span> <span style="color: #a5d6ff;">'DatabaseQuery'</span>
</div>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-9" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">9. Apache Spark, Delta Lake & V-Order Optimization Mechanics</h2>
<p>For candidates taking <strong>DP-700</strong> (and advanced sections of DP-600), the underlying storage format is everything. Microsoft Fabric builds upon open-source <strong>Delta Lake</strong>, but layers on enterprise proprietary optimizations designed specifically for high-concurrency analytical reads.</p>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">Understanding Microsoft V-Order Write Optimization</h3>
<p><strong>V-Order</strong> is a write-time optimization algorithm engineered into Fabric Spark and Fabric Data Warehouses. Standard Parquet files organize data into row groups and columns, but their internal dictionary encoding is optimized for general disk reads, not in-memory columnar engines.</p>
<p>When V-Order is enabled, the writer applies specialized row sorting, dictionary compression, and bit-packing within each Parquet row group. The resulting Parquet file remains 100% compliant with the open Parquet specification, but when loaded into Power BI VertiPaq memory or Fabric SQL engines, it delivers:</p>
<ul style="line-height: 1.8; padding-left: 1.5rem; list-style-type: disc; margin-bottom: 1.5rem;">
  <li><strong>Up to 10x faster DAX query execution</strong> in Direct Lake mode because the memory structures mirror VertiPaq internal memory formats.</li>
  <li><strong>15% to 25% lower physical storage footprint</strong> in OneLake compared to standard Spark Parquet writes.</li>
  <li><strong>Automatic enablement:</strong> Fabric Spark notebooks and Dataflows Gen2 have V-Order enabled by default (<code style="color: var(--accent);">spark.sql.parquet.vorder.enabled = true</code>).</li>
</ul>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">Delta Liquid Clustering vs Traditional Hive Partitioning</h3>
<p>A classic exam question on DP-700 tests your knowledge of table partitioning strategy. Historically, data engineers partitioned tables by folder hierarchies (e.g., <code style="color: var(--accent);">/Year=2026/Month=10/Day=20/</code>). In modern Fabric lakehouses, this approach causes severe performance bottlenecks known as the <strong>Small File Problem</strong>.</p>
<p>Instead, DP-700 champions <strong>Delta Lake Liquid Clustering</strong> (<code style="color: var(--accent);">CLUSTER BY</code>). Liquid Clustering replaces rigid folder directories with dynamic file layout clustering that can adapt as query patterns evolve over time.</p>

<div class="overflow-x-auto my-6" style="overflow-x: auto;">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.85rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 2px solid var(--border);">
        <th style="padding: 10px; text-align: left; border-right: 1px solid var(--border);">Feature Dimension</th>
        <th style="padding: 10px; text-align: left; border-right: 1px solid var(--border);">Classic Hive Partitioning</th>
        <th style="padding: 10px; text-align: left;">Delta Liquid Clustering (Fabric Best Practice)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 8px; border-right: 1px solid var(--border); font-weight: bold;">Directory Structure</td>
        <td style="padding: 8px; border-right: 1px solid var(--border);">Rigid physical folder trees per partition key</td>
        <td style="padding: 8px;">Flat directory structure; metadata tracks clustering bounds</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 8px; border-right: 1px solid var(--border); font-weight: bold;">High Cardinality Columns</td>
        <td style="padding: 8px; border-right: 1px solid var(--border); color: #f85149;">Disastrous (Generates millions of tiny, inefficient files)</td>
        <td style="padding: 8px; color: #10b981; font-weight: bold;">Fully supported (Customer ID, Device ID, GUIDs)</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 8px; border-right: 1px solid var(--border); font-weight: bold;">Key Evolution</td>
        <td style="padding: 8px; border-right: 1px solid var(--border);">Requires complete table rewrite and data migration</td>
        <td style="padding: 8px;">Seamlessly altered via ALTER TABLE CLUSTER BY command</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-right: 1px solid var(--border); font-weight: bold;">Write Amplification</td>
        <td style="padding: 8px; border-right: 1px solid var(--border);">High when writing out-of-order data</td>
        <td style="padding: 8px;">Low; incremental clustering during scheduled OPTIMIZE runs</td>
      </tr>
    </tbody>
  </table>
</div>

<h3 style="color: var(--accent); font-size: 1.2rem; margin-top: 1.5rem;">Production Delta Maintenance Scripts (PySpark & SQL)</h3>
<p>To pass DP-700, you must know how to prevent Delta log bloat and table degradation. Commit these two maintenance commands to memory:</p>

<div style="background: #0d1117; border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: monospace; font-size: 0.85rem; color: #c9d1d9; margin: 1.5rem 0; overflow-x: auto;">
  <span style="color: #8b949e;">-- 1. Table Compaction & Z-Ordering in Fabric SQL / Spark</span><br/>
  <span style="color: #ff7b72;">OPTIMIZE</span> lakehouse_db.gold_sales<br/>
  <span style="color: #ff7b72;">ZORDER BY</span> (StoreKey, OrderDate);<br/><br/>
  <span style="color: #8b949e;">-- 2. Garbage Collection of Historical Delta Commits</span><br/>
  <span style="color: #8b949e;">-- Retains 7 days of historical time travel snapshots, purges orphaned files</span><br/>
  <span style="color: #ff7b72;">VACUUM</span> lakehouse_db.gold_sales <span style="color: #ff7b72;">RETAIN</span> <span style="color: #79c0ff;">168</span> <span style="color: #ff7b72;">HOURS</span>;
</div>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-10" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">10. Real-World Exam Case Studies: 3 Architectural Scenarios</h2>
<p>Both DP-600 and DP-700 conclude with extensive, multi-requirement <strong>Case Study Questions</strong>. Review these three real-world blueprints to understand how architectural trade-offs are evaluated:</p>

<div class="case-study-card" style="border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 4px; padding: 1.5rem; margin-bottom: 2rem; background: var(--surface);">
  <h3 style="color: var(--accent); margin-top: 0; font-size: 1.25rem;">Case Study 1 (DP-600 Focus): Enterprise Retail Migration</h3>
  <p><strong>Business Context:</strong> A retail conglomerate has 1,200 stores. Their existing on-premises SQL Data Warehouse refreshes nightly, taking 4.5 hours to finish. Business analysts complain that morning Power BI dashboards load slowly and frequently timeout during executive reviews.</p>
  <p><strong>Requirements:</strong></p>
  <ul style="line-height: 1.6; font-size: 0.85rem; color: var(--muted); padding-left: 1.25rem;">
    <li>Eliminate the 4.5-hour scheduled refresh window.</li>
    <li>Provide sub-second dashboard filtering across 250 million transaction rows.</li>
    <li>Support dynamic currency conversion between USD, EUR, and GBP without duplicating data.</li>
    <li>Enable strict team collaboration using Git source control.</li>
  </ul>
  <p><strong>The Architect's Approved Solution:</strong></p>
  <p style="font-size: 0.9rem; line-height: 1.7;">Provision a Fabric F64 capacity. Land raw POS transactions into a Lakehouse Gold Delta table using incremental Data Factory copy pipelines with V-Order enabled. Create a <strong>Direct Lake semantic model</strong> referencing the Gold Delta table. Implement <strong>Calculation Groups</strong> in Tabular Editor 3 to handle currency conversion dynamically at query runtime. Convert the Power BI project into <strong>PBIP format</strong> and synchronize the Fabric workspace with an Azure DevOps Git repository, deploying changes through Fabric Deployment Pipelines (Dev &rarr; Test &rarr; Prod).</p>
</div>

<div class="case-study-card" style="border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 4px; padding: 1.5rem; margin-bottom: 2rem; background: var(--surface);">
  <h3 style="color: var(--accent); margin-top: 0; font-size: 1.25rem;">Case Study 2 (DP-700 Focus): High-Frequency IoT Fleet Telemetry</h3>
  <p><strong>Business Context:</strong> A logistics enterprise operates 45,000 smart delivery vehicles. Every vehicle transmits GPS coordinates, engine temperature, and fuel levels every 5 seconds (generating over 60 million records per day).</p>
  <p><strong>Requirements:</strong></p>
  <ul style="line-height: 1.6; font-size: 0.85rem; color: var(--muted); padding-left: 1.25rem;">
    <li>Ingest streaming telemetry with sub-minute latency for dispatch operations.</li>
    <li>Store historical telemetry immutably for 5-year auditing compliance.</li>
    <li>Prevent the "small file problem" caused by continuous streaming writes.</li>
    <li>Track automated data lineage and sensitivity labels using Microsoft Purview.</li>
  </ul>
  <p><strong>The Architect's Approved Solution:</strong></p>
  <p style="font-size: 0.9rem; line-height: 1.7;">Route incoming vehicle streams into <strong>Fabric Real-Time Intelligence Eventstreams</strong>. Land real-time telemetry simultaneously into a <strong>KQL Eventhouse</strong> (for sub-second live dispatch queries) and a <strong>Lakehouse Bronze Delta table</strong> (for historical archival). Execute a scheduled Fabric Spark notebook using <strong>Structured Streaming with Liquid Clustering</strong> (<code style="color: var(--accent);">CLUSTER BY VehicleId, Timestamp</code>) to write cleansed records into the Silver layer. Schedule daily <code style="color: var(--accent);">OPTIMIZE</code> and weekly <code style="color: var(--accent);">VACUUM</code> jobs. Bind the workspace to <strong>Microsoft Purview</strong> to automatically inherit tenant-level data governance and lineage tracking.</p>
</div>

<div class="case-study-card" style="border: 1px solid var(--border); border-left: 4px solid var(--accent); border-radius: 4px; padding: 1.5rem; margin-bottom: 2rem; background: var(--surface);">
  <h3 style="color: var(--accent); margin-top: 0; font-size: 1.25rem;">Case Study 3 (Multi-Cloud Architecture): The Zero-Copy Data Mesh</h3>
  <p><strong>Business Context:</strong> A multinational financial institution runs customer analytics on AWS (using Amazon S3 data lakes) and marketing automation on Google Cloud Platform (Google Cloud Storage), while their central core banking application resides in an on-premises Azure SQL database.</p>
  <p><strong>Requirements:</strong></p>
  <ul style="line-height: 1.6; font-size: 0.85rem; color: var(--muted); padding-left: 1.25rem;">
    <li>Deliver a unified executive analytics layer combining AWS, GCP, and Azure data.</li>
    <li>Strict zero-ETL mandate: Do not duplicate or move raw petabytes across clouds to avoid massive egress fees.</li>
    <li>Near real-time sync with the core banking transactional database.</li>
  </ul>
  <p><strong>The Architect's Approved Solution:</strong></p>
  <p style="font-size: 0.9rem; line-height: 1.7;">Create a centralized Microsoft Fabric Lakehouse. Configure <strong>OneLake Shortcuts</strong> directly targeting the Amazon S3 buckets and Google Cloud Storage buckets using workload identity authentication. For the transactional banking database, configure <strong>Fabric Database Mirroring</strong> for Azure SQL to continuously stream change data capture (CDC) logs into OneLake Delta tables with zero pipeline coding. Create a <strong>Fabric Warehouse</strong> that queries across shortcuts and mirrored tables using standard cross-database T-SQL without paying egress costs or duplicating raw data.</p>
</div>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-11" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">11. 2026 Global Compensation & Market Demand Benchmarks</h2>
<p>Holding a certification badge is not just about passing an exam; it is about measurable career progression and salary leverage. Here is our 2026 global compensation analysis compiled from verified technical hiring data:</p>

<div class="overflow-x-auto my-8" style="overflow-x: auto;">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 2px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border);">Role / Credential</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border);">United States</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border);">United Kingdom</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border);">European Union</th>
        <th style="padding: 12px; text-align: left;">India (INR)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Power BI Data Analyst (PL-300)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">$85,000 – $115,000</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">£45,000 – £65,000</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">€50,000 – €75,000</td>
        <td style="padding: 12px;">₹8 – ₹16 LPA</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border); background: rgba(201, 243, 29, 0.02);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">Fabric Analytics Engineer (DP-600)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">$130,000 – $165,000</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">£75,000 – £95,000</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">€80,000 – €110,000</td>
        <td style="padding: 12px; font-weight: bold;">₹22 – ₹38 LPA</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold; color: var(--accent);">Fabric Data Engineer (DP-700)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">$140,000 – $180,000</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">£80,000 – £105,000</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">€85,000 – €120,000</td>
        <td style="padding: 12px; font-weight: bold;">₹25 – ₹45 LPA</td>
      </tr>
    </tbody>
  </table>
</div>

<div style="padding: 1rem; border-left: 4px solid var(--accent); background: var(--surface2); margin: 1.5rem 0; border-radius: 4px;">
  <strong>Market Insight:</strong> The jump from PL-300 to DP-600 represents an average <strong>35% to 45% compensation surge</strong>. Enterprise clients actively seek engineers who can replace expensive Snowflake and Databricks subscriptions by consolidating semantic modeling inside Microsoft Fabric.
</div>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-12" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">12. Architectural Decision Tree: Which Certification Should You Target?</h2>
<p>Follow this exact technical logic flow to select your next certification goal:</p>

<div style="background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
  <h4 style="color: var(--accent); margin-top: 0;">Case 1: You are a Junior / Mid Data Analyst using Excel and basic Power BI</h4>
  <p style="margin-bottom: 0.5rem;">&rarr; <strong>Target: PL-300</strong>. Master data storytelling, report distribution, and DAX fundamentals. Earning PL-300 will give you immediate credibility and prepare your dimensional modeling instincts.</p>

  <h4 style="color: var(--accent); margin-top: 1.5rem;">Case 2: You are a Senior Power BI Developer / BI Consultant</h4>
  <p style="margin-bottom: 0.5rem;">&rarr; <strong>Target: DP-600 Immediately</strong>. Do not waste time on PL-300. Enterprise organizations are aggressively moving to Direct Lake mode. DP-600 establishes you as a modern Fabric Analytics Engineer capable of managing Lakehouses, Warehouses, and large-scale semantic models.</p>

  <h4 style="color: var(--accent); margin-top: 1.5rem;">Case 3: You have an Azure Data Engineer background (DP-203 holder) or write Python/Spark</h4>
  <p style="margin-bottom: 0.5rem;">&rarr; <strong>Target: DP-700</strong>. You already understand distributed computing and ETL pipelines. DP-700 validates how to leverage Spark, OneLake Shortcuts, and database mirroring inside Fabric without the overhead of standalone Azure services.</p>

  <h4 style="color: var(--accent); margin-top: 1.5rem;">Case 4: You are an Enterprise Architect or Lead BI Architect</h4>
  <p style="margin-bottom: 0;">&rarr; <strong>The Power Duo: DP-600 + DP-700</strong>. Having both certifications proves total end-to-end command: from raw Lakehouse ingestion with Spark (DP-700) to the final Direct Lake semantic models and executive reporting layer (DP-600).</p>
</div>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-13" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">13. The 60-Day First-Attempt Pass Blueprint</h2>
<p>To pass on your first attempt without burning exam voucher fees, follow this proven 4-stage preparation roadmap:</p>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
  <div style="background: var(--surface2); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px;">
    <span style="font-family: monospace; font-size: 0.8rem; color: var(--accent); font-weight: bold;">WEEKS 1–2</span>
    <h4 style="margin: 0.5rem 0 1rem 0; color: var(--text);">Microsoft Learn Core Tracks</h4>
    <p style="font-size: 0.85rem; color: var(--muted); line-height: 1.6;">Complete the official Microsoft Learn modules. Do not skip the hands-on lab exercises. Build a free 60-day Microsoft Fabric trial workspace.</p>
  </div>
  <div style="background: var(--surface2); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px;">
    <span style="font-family: monospace; font-size: 0.8rem; color: var(--accent); font-weight: bold;">WEEKS 3–4</span>
    <h4 style="margin: 0.5rem 0 1rem 0; color: var(--text);">Hands-on Laboratory Builds</h4>
    <p style="font-size: 0.85rem; color: var(--muted); line-height: 1.6;">Ingest 10M rows into a Lakehouse. Build a Direct Lake semantic model. Use DAX Studio to check SE/FE queries and confirm Direct Lake is not falling back to DirectQuery.</p>
  </div>
  <div style="background: var(--surface2); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px;">
    <span style="font-family: monospace; font-size: 0.8rem; color: var(--accent); font-weight: bold;">WEEKS 5–6</span>
    <h4 style="margin: 0.5rem 0 1rem 0; color: var(--text);">Case Studies & T-SQL/PySpark Depth</h4>
    <p style="font-size: 0.85rem; color: var(--muted); line-height: 1.6;">For DP-600: Practice Calculation Groups and Window functions in T-SQL. For DP-700: Write Delta MERGE statements and configure OneLake shortcuts to S3.</p>
  </div>
  <div style="background: var(--surface2); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px;">
    <span style="font-family: monospace; font-size: 0.8rem; color: var(--accent); font-weight: bold;">WEEKS 7–8</span>
    <h4 style="margin: 0.5rem 0 1rem 0; color: var(--text);">Practice Assessments & Timing</h4>
    <p style="font-size: 0.85rem; color: var(--muted); line-height: 1.6;">Take the official Microsoft Practice Assessment until you consistently score 85%+. Review Microsoft exam case studies where multi-requirement trade-offs are tested.</p>
  </div>
</div>

<hr style="border: 0; height: 1px; background: var(--border); margin: 2rem 0;"/>

<h2 id="section-14" style="color: var(--text); font-size: 1.5rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">14. Frequently Asked Questions (FAQ)</h2>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">1. Is PL-300 being retired by Microsoft in 2026?</h4>
  <p style="color: var(--muted); line-height: 1.7;">No. Microsoft has confirmed that PL-300 remains the cornerstone credential for pure report creators and business data analysts. Not every company has migrated to Microsoft Fabric; hundreds of thousands of organizations still operate on standalone Power BI Pro licenses. PL-300 continues to receive active syllabus updates.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">2. Does DP-600 expire, and how do I maintain it?</h4>
  <p style="color: var(--muted); line-height: 1.7;">Like all Microsoft role-based associate credentials, DP-600 is valid for <strong>one year</strong> from the pass date. You can renew it completely free of charge by taking an unproctored online renewal assessment on Microsoft Learn starting 6 months before expiration.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">3. Do I need to write Python to pass DP-600?</h4>
  <p style="color: var(--muted); line-height: 1.7;">Only basic exploratory data analysis (EDA). You should know how to read a PySpark DataFrame, load a Delta table into a notebook, and convert data types. However, DP-600 does not test deep Spark optimization or PySpark pipeline writing; that is reserved for DP-700.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">4. Is DP-700 harder than the old DP-203 exam?</h4>
  <p style="color: var(--muted); line-height: 1.7;">DP-700 is technically more streamlined because it eliminates the architectural friction of managing separate Azure Synapse, Data Factory, and Databricks networking layers. However, DP-700 tests deeper OneLake concepts, database mirroring, shortcuts, and Purview governance that were not part of DP-203.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">5. Can I get a free exam voucher for DP-600 or DP-700?</h4>
  <p style="color: var(--muted); line-height: 1.7;">Yes. Microsoft frequently runs campaigns like the <strong>Microsoft Cloud Skills Challenge</strong> and <strong>Fabric Community Days</strong> where completing specified Learn collections awards a 50% to 100% discount exam voucher. Keep an eye on our <a href="/blog/free-microsoft-certifications-fabric-data-days-2026" style="color: var(--accent); text-decoration: underline;">Free Microsoft Certifications Guide</a> for updated voucher schedules.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">6. Which exam is best for transitioning from SQL Server DBA to Cloud Analytics?</h4>
  <p style="color: var(--muted); line-height: 1.7;">DP-600 is the ideal bridge for SQL DBAs. It leverages your deep understanding of relational star schemas, stored procedures, and T-SQL querying, while introducing you to Fabric Warehouses, Delta Parquet storage, and modern semantic layer modeling.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">7. How long should I study for DP-600 if I already have PL-300?</h4>
  <p style="color: var(--muted); line-height: 1.7;">If you already hold PL-300 and have hands-on Power BI experience, plan for <strong>4 to 6 weeks</strong> of dedicated study (approx. 10–12 hours per week). Focus almost exclusively on OneLake Lakehouses, T-SQL Warehouses, Direct Lake boundaries, and Git integration.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">8. What score do I need to pass PL-300, DP-600, or DP-700?</h4>
  <p style="color: var(--muted); line-height: 1.7;">All Microsoft technical exams use a scaled score where <strong>700 out of 1000</strong> is the passing mark. There is no penalty for guessing; unanswered questions count as incorrect.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">9. Can I access Microsoft Learn documentation during the live exam?</h4>
  <p style="color: var(--muted); line-height: 1.7;">Yes! All Microsoft role-based associate and expert certification exams (including PL-300, DP-600, and DP-700) now feature the built-in <strong>Microsoft Learn Open-Book interface</strong>. During the exam, a split-screen browser allows you to search learn.microsoft.com. However, time management is critical: you only have roughly 100–120 minutes for 45–55 questions. You cannot look up every question and finish in time; use Learn strictly for syntax verification and parameter lookups.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">10. How does Fabric Capacity Sizing (F32 vs F64) affect Direct Lake mode?</h4>
  <p style="color: var(--muted); line-height: 1.7;">Direct Lake limits are directly pegged to your workspace capacity SKU. An <strong>F64 capacity</strong> (equivalent to Power BI Premium P1) provides 25 GB of RAM per semantic model before paging occurs, whereas an <strong>F32 capacity</strong> provides only 12.5 GB. If you exceed this memory budget, Analysis Services will automatically fall back to DirectQuery mode. Furthermore, F64 is the minimum SKU required to enable free Power BI Pro report viewing for non-licensed consumers.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">11. What is the fundamental architectural difference between Dataflows Gen2 and Data Factory Pipelines?</h4>
  <p style="color: var(--muted); line-height: 1.7;"><strong>Dataflows Gen2</strong> use the Power Query M engine and are designed for low-code data transformation, small-to-medium datasets, and business self-service ETL that outputs directly to OneLake Delta tables. <strong>Data Factory Pipelines</strong> are distributed orchestrators designed for high-scale control flow, executing Spark notebooks, triggering stored procedures, running REST API loops, and copying petabyte-scale data without row-by-row transformation overhead.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">12. Is Python or Scala mandatory for passing DP-700?</h4>
  <p style="color: var(--muted); line-height: 1.7;"><strong>PySpark (Python) is mandatory</strong>; Scala is optional. DP-700 tests your ability to read and complete PySpark snippets for DataFrame transformations, reading and writing Delta tables with specific merge options, configuring Spark session pools, and handling JSON parsing from semi-structured columns. You do not need to build complex machine learning models, but you must know the core <code style="color: var(--accent);">pyspark.sql</code> API.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">13. Does PL-300 satisfy requirements for Microsoft Solutions Partner Designations?</h4>
  <p style="color: var(--muted); line-height: 1.7;">PL-300 still qualifies for the <strong>Solutions Partner for Data & AI (Azure)</strong> designation under the intermediate certification tier. However, Microsoft now places higher partner credential weighting on <strong>DP-600</strong> and <strong>DP-700</strong>, which qualify organizations for advanced Fabric specialization badges and prioritized co-sell benefits.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">14. What external tools should I master for DP-600?</h4>
  <p style="color: var(--muted); line-height: 1.7;">For DP-600, you must be comfortable with <strong>DAX Studio</strong> (for analyzing SE/FE query timings and verifying Direct Lake mode), <strong>Tabular Editor 2 or 3</strong> (for authoring Calculation Groups, Object-Level Security, and managing TMDL scripts), and <strong>Visual Studio Code with Git</strong> (for managing PBIP files and deployment branches).</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">15. Can I complete hands-on preparation for DP-600 and DP-700 without an enterprise subscription?</h4>
  <p style="color: var(--muted); line-height: 1.7;">Yes. Microsoft offers a <strong>free 60-day Microsoft Fabric trial</strong> that provides an F64 capacity equivalent with 64 Capacity Units. You can create Lakehouses, Warehouses, execute Spark notebooks, and build Direct Lake semantic models completely free of charge using a work or school organizational email address.</p>
</div>

<div class="faq-item" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--accent); margin-bottom: 0.5rem;">16. If I want to become an Enterprise Data Architect, which sequence is recommended?</h4>
  <p style="color: var(--muted); line-height: 1.7;">The industry-standard progression for enterprise architects in 2026 is: <strong>PL-300 (Foundational BI & Modeling) &rarr; DP-600 (Fabric Analytics Engineering & Direct Lake) &rarr; DP-700 (Distributed Spark & Data Pipelines)</strong>. Completing this sequence provides end-to-end mastery from raw cloud ingestion to C-suite executive dashboards.</p>
</div>

<!-- AUTHOR_BIO_START -->
<div class="author-bio-card" style="margin-top: 3rem; padding: 2rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;">
  <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
    <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold; color: var(--bg);">
      DS
    </div>
    <div style="flex: 1; min-width: 250px;">
      <h3 style="margin: 0 0 0.25rem 0; color: var(--text); font-size: 1.2rem;">Datta Sable</h3>
      <p style="margin: 0; color: var(--accent); font-size: 0.85rem; font-family: monospace;">Senior MIS & Business Intelligence Manager · Certified Microsoft Fabric Specialist</p>
      <p style="margin: 0.5rem 0 0 0; color: var(--muted); font-size: 0.85rem; line-height: 1.6;">
        With over 10 years of hands-on enterprise data engineering and BI architecture experience, Datta specializes in high-scale Power BI semantic modeling, Microsoft Fabric capacity optimization, and automated reporting systems. Explore verified credentials on the official <a href="/certification" style="color: var(--accent); text-decoration: underline;">Datta Sable Certifications Page</a>.
      </p>
    </div>
  </div>
</div>
<!-- AUTHOR_BIO_END -->
  `
};
