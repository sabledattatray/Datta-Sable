# Microsoft Fabric Architecture Explained: The Complete 2026 Guide

**SEO Title:** Microsoft Fabric Architecture Explained (2026 Guide)
**URL Slug:** /microsoft-fabric-architecture-explained-2026
**Meta Description:** A complete technical guide to Microsoft Fabric architecture: OneLake, Lakehouse, Warehouse, Direct Lake, governance, security, and certification paths.
**Focus Keyword:** Microsoft Fabric architecture
**Secondary Keywords:** OneLake architecture, Fabric Lakehouse vs Warehouse, Direct Lake mode, Fabric capacity units, Microsoft Fabric governance, Fabric security model, Medallion architecture in Fabric, Fabric capacity planning
**Long-Tail Keywords:** how does Microsoft Fabric architecture work, OneLake vs Azure Data Lake Storage Gen2, Direct Lake vs Import vs DirectQuery mode, Microsoft Fabric capacity unit planning guide, DP-600 vs DP-700 vs DP-800 which certification to choose, Microsoft Fabric medallion architecture bronze silver gold, Fabric security model Entra ID Purview
**Search Intent:** Mixed informational and commercial-investigation intent. Readers want a working mental model of how Fabric's compute, storage, security, and governance layers fit together before they design a platform, defend an architecture decision, migrate off Synapse, or sit a DP-600/DP-700/DP-800 exam.

---

## Introduction

Most explanations of Microsoft Fabric start with a list of workloads — Lakehouse, Warehouse, Data Factory, Power BI — and stop there. That's a feature list, not an architecture. If you've sat through a vendor deck on Fabric and walked away unable to explain *why* a Direct Lake query doesn't need a refresh, or *why* a workspace assigned to an F8 capacity behaves differently than one on F64, this article is written to close that gap.

This guide is built for a specific reader: someone who has to actually design, defend, or operate a Fabric platform — not just describe it in a slide. That includes Fabric beginners building their first lakehouse, Power BI developers migrating semantic models onto Direct Lake, data engineers deciding between a Warehouse and a Lakehouse for a given workload, analytics engineers responsible for a medallion pipeline, solution architects writing a target-state diagram for a steering committee, and candidates preparing for DP-600, DP-700, DP-800, or PL-300.

Whether you're designing a modern analytics platform from scratch, migrating from Azure Synapse Analytics, rolling Microsoft Fabric out across a large organization, or preparing for Microsoft's Fabric certifications, understanding the platform's underlying architecture is one of the most durable skills you can build right now — it doesn't expire when the next workload ships. If you haven't mapped out a learning sequence yet, our [Microsoft Fabric Certification Roadmap 2026](https://dattasable.com/blog/microsoft-fabric-certification-roadmap-2026) lays out the order most candidates should follow, and the [Microsoft Fabric Career Roadmap](https://dattasable.com/blog/microsoft-fabric-career-roadmap-2026) breaks down how Analytics Engineers, Data Engineers, BI Developers, and AI Developers actually divide the work in a real Fabric team.

Two architectural ideas drive almost every design decision in this article. The first is that Fabric stores everything in one logical lake — OneLake — instead of letting every workload keep its own copy of the data. The second is that compute is rented as a single shared pool of Capacity Units rather than purchased per-service. Once those two ideas are solid in your head, the rest of the platform — Direct Lake, Shortcuts, workspace-level security, the SaaS billing model — stops looking like a list of features and starts looking like the predictable consequence of those two decisions.

We'll go layer by layer: storage (OneLake), the engines that sit on top of it (Lakehouse, Warehouse, Data Factory, Power BI, Real-Time Intelligence, Data Science), the compute model that pays for all of it (F-SKUs and Capacity Units), and the security/governance fabric that wraps around everything (Entra ID, Purview, RLS, OLS). Along the way you'll get comparison tables, decision frameworks, common mistakes seen in production deployments, and a full interview and certification section. For a layer-by-layer breakdown of how raw data gets refined as it moves through a Fabric platform, our [Microsoft Fabric Medallion Architecture guide](https://dattasable.com/blog/microsoft-fabric-medallion-architecture-guide) is a useful companion to the Lakehouse section below, and if you're building Power BI reports against Fabric data, the [Direct Lake performance tuning guide](https://dattasable.com/blog/power-bi-direct-lake-performance-tuning-fabric) goes deeper into the query engine internals than we have room for here.

If certification is part of your motivation, start with the [DP-600 Study Guide](https://dattasable.com/blog/dp-600-study-guide-2026), and if you're still deciding which of the three Fabric-adjacent exams fits your role, the [DP-600 vs DP-700 vs DP-800 comparison](https://dattasable.com/blog/dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison) walks through the trade-offs before you commit study time.

---

## Table of Contents

1. What Is Microsoft Fabric?
2. Core Architectural Principles
3. OneLake: The Single Logical Data Lake
4. The Seven Fabric Workloads
5. Data Factory: Ingestion and Orchestration
6. Lakehouse Architecture
7. Data Warehouse Architecture
8. Lakehouse vs. Warehouse: Choosing the Right Engine
9. Power BI, Semantic Models, and Direct Lake
10. Real-Time Intelligence: Eventstream, Eventhouse, KQL
11. Data Science and AI Workloads
12. Capacity Units, F-SKUs, and Capacity Planning
13. Security Architecture
14. Governance: RBAC, RLS, OLS, and Purview
15. Enterprise Best Practices, CI/CD, and Git Integration
16. Performance Optimization
17. Cost Optimization
18. Disaster Recovery, High Availability, and Scalability
19. Migration Strategy: Moving Off Synapse and Legacy Stacks
20. Common Mistakes in Fabric Architecture
21. Real-World Architecture Example
22. Decision Frameworks
23. Certification Paths: DP-600, DP-700, DP-800, PL-300
24. Career Roadmap
25. Interview Questions (20+)
26. Frequently Asked Questions (20+)
27. Summary, Key Takeaways, and Next Steps

---

## 1. What Is Microsoft Fabric?

**Definition.** Microsoft Fabric is a software-as-a-service analytics platform that unifies data engineering, data integration, data warehousing, real-time intelligence, data science, and business intelligence under a single logical storage layer called OneLake. It reached general availability in November 2023, consolidating capabilities previously spread across Azure Synapse Analytics, Azure Data Factory, Azure Data Explorer, and Power BI Premium.

**Purpose.** Before Fabric, a typical enterprise analytics stack looked like five or six separately licensed, separately secured, separately monitored Azure services stitched together with custom code: Data Factory for ingestion, Synapse Spark or Databricks for transformation, a Synapse dedicated SQL pool or Azure SQL Data Warehouse for serving, Azure Data Explorer for streaming telemetry, and Power BI Premium for the visualization layer — each with its own storage account, its own access model, and its own billing line. Fabric's purpose is to collapse that stitching into one product with one copy of the data, one security model, and one capacity bill.

**Architecture, at a glance.** Fabric is delivered entirely as SaaS. There is no virtual machine to provision, no Spark cluster to size, and no storage account to configure — Microsoft operates the compute fabric underneath, and you consume it through a capacity (an F-SKU) that you assign to one or more workspaces. Every item you create inside a workspace — a lakehouse, a warehouse, a pipeline, a notebook, a Power BI report — writes its data into OneLake using the open Delta Parquet format, which is the same format used by Apache Spark and Databricks. That single decision is what allows a Spark notebook, a T-SQL warehouse, and a Power BI semantic model to all read the exact same physical files without anyone copying anything between them.

**How it works in practice.** A workspace is the unit of collaboration and security in Fabric — think of it as a project folder that contains related items and is assigned to a capacity. A tenant can have any number of workspaces, each potentially backed by a different capacity (which matters enormously for cost allocation, covered in Section 12). Inside a workspace, every item is automatically backed by OneLake storage; you never explicitly provision storage the way you would with an Azure Data Lake Storage account.

**Benefits.** A single governed copy of data, native open-format interoperability with the broader Spark/Delta ecosystem, consolidated billing, and a meaningfully shorter time-to-first-report compared with assembling the equivalent Azure-native stack by hand.

**Limitations.** Fabric is younger than the services it replaces, and some advanced capabilities that existed in mature, narrowly-scoped Azure services (certain Synapse dedicated SQL pool tuning options, for example) are still catching up inside Fabric's unified surface. Multi-region and sovereign-cloud availability also lag general availability in commercial regions.

**Real-world use case.** A retail analytics team running Azure Synapse dedicated pools for reporting, Azure Data Factory for ingestion, and Power BI Premium for dashboards consolidates onto a single Fabric F64 capacity, eliminating three separate billing relationships and removing a nightly copy job that used to move data from the lake into the warehouse purely so Power BI could query it fast.

**Best practice.** Treat the workspace-to-capacity assignment as an architectural decision made on day one, not an afterthought — moving workspaces between capacities later is possible but disruptive to active refresh schedules.

**Common mistake.** Teams frequently assume Fabric is "just Power BI Premium renamed." It isn't — Premium was a BI-only capacity; Fabric capacities run Spark, T-SQL, KQL, and ML workloads on the same compute pool, which changes capacity planning math substantially.

**Certification relevance.** DP-600 and DP-700 both open with foundational questions on what Fabric is and how its SaaS model differs from IaaS/PaaS Azure analytics services — this is consistently the first knowledge domain tested.

📌 *Enterprise Reference Architecture Diagram — Fabric tenant, capacities, workspaces, and OneLake*

---

## 2. Core Architectural Principles

Four principles explain almost every design decision Microsoft made in Fabric. Understanding them lets you predict how the platform will behave in situations the documentation doesn't explicitly cover.

**Principle one: one logical copy of data.** OneLake is the single storage layer for the entire tenant. Every workload — Lakehouse, Warehouse, KQL Database, Power BI — reads and writes against the same underlying Delta Parquet files. This is the architectural opposite of the traditional pattern where each tool maintains its own copy and a batch job keeps them in sync.

**Principle two: compute is shared, not siloed.** A Fabric capacity is a pool of Capacity Units that every workload draws from. A heavy Spark job and a Power BI refresh compete for the same underlying resource pool, which is a meaningfully different operational model than separately-billed, separately-scaled Azure services.

**Principle three: open format over proprietary format.** OneLake stores data in Delta Lake's open table format on top of Parquet files — not a Microsoft-proprietary binary format. This means data written by a Fabric Lakehouse is directly readable by Databricks, open-source Spark, or any Delta-aware engine without an export step, and it's the technical foundation that makes Shortcuts (covered below) possible without data duplication.

**Principle four: security and governance are platform-level, not per-tool.** Identity flows through Microsoft Entra ID for every workload, and sensitivity labels, lineage, and cataloging flow through Microsoft Purview across all item types — a Lakehouse, a Warehouse, and a Power BI semantic model are governed the same way rather than each needing a separate compliance integration.

**Why this matters architecturally.** Each of these principles trades some flexibility for consistency. You give up the ability to pick a best-of-breed point solution for every single workload, but you gain a platform where a data engineer's Bronze table, a BI developer's semantic model, and a data scientist's training set are the same physical bytes, secured the same way, cataloged in the same place. (Compare this with our [Modern BI Stack](https://dattasable.com/blog/modern-bi-stack-2026) breakdown for how this consistency shows up in day-to-day team workflows.)

---

## 3. OneLake: The Single Logical Data Lake

**Definition.** OneLake is the tenant-wide, SaaS-managed data lake that underlies every Fabric workload. There is exactly one OneLake per Microsoft Entra tenant, organized hierarchically into capacities, workspaces, and items — conceptually similar to how OneDrive provides one personal storage root per user, except OneLake is the analytics-grade equivalent at the organizational level.

**Purpose.** Before OneLake, a typical pipeline copied data at least three times: once into a raw landing zone, once into a curated lake zone, and once again into a warehouse or BI extract purely so the reporting tool could query it efficiently. Each copy meant another sync job, another point of staleness, and another place permissions could drift out of alignment with the source. OneLake's purpose is to make the second and third copies unnecessary by letting every engine query the same files directly.

**Architecture.** Physically, OneLake is built on Azure Data Lake Storage Gen2 infrastructure, but you never provision an ADLS account yourself — Fabric manages that container automatically per tenant. Data is stored in Delta Parquet format by default for tabular data. Folder structure mirrors the workspace/item hierarchy: every Lakehouse, Warehouse, or KQL Database you create gets its own logical area inside OneLake without you choosing a path or a region for that specific item.

**How it works — Shortcuts.** The single most important OneLake feature for enterprise architecture is the Shortcut. A Shortcut is a pointer that makes data physically stored somewhere else — another Fabric workspace, an Azure Data Lake Storage Gen2 account, an Amazon S3 bucket, or a Dataverse environment — appear inside OneLake as if it were natively stored there, with zero data movement and zero duplication cost. A Spark notebook or a SQL warehouse querying a Shortcut behaves exactly as if the data were local.

**Benefits.** Eliminates duplicate storage costs for data that already lives in Azure or AWS, removes an entire category of "which copy is the source of truth" governance debate, and lets a Fabric workspace virtualize data across regions or clouds without an ETL job.

**Limitations.** Shortcuts to external clouds introduce network egress and latency considerations that a native copy wouldn't have, and not every engine handles every Shortcut target with identical performance — cross-cloud Shortcuts are generally best for lower-frequency analytical queries, not sub-second serving.

**Real-world use case.** A financial services firm with an existing multi-petabyte Azure Data Lake Storage Gen2 estate adopts Fabric for its compute and BI layer without re-platforming storage: every existing ADLS folder becomes a OneLake Shortcut, so Spark notebooks and Power BI semantic models can query historical data on day one with no migration window.

**Best practices.** Use Shortcuts for read-heavy integration across workspaces or clouds; avoid chaining Shortcuts through multiple hops, which adds latency and makes lineage harder to trace in Purview; apply consistent naming conventions across Bronze/Silver/Gold so a Shortcut's logical name matches its physical intent.

**Common mistakes.** Treating a Shortcut as a full data copy and forgetting that deleting the source data breaks every Shortcut pointing to it; assuming Shortcut performance is identical to native OneLake storage for very high-frequency, low-latency workloads, which is not guaranteed for cross-region or cross-cloud targets.

**Enterprise recommendation.** For greenfield Fabric adoptions, write new data natively into OneLake. For brownfield adoptions sitting on an existing data lake investment, Shortcuts are usually the correct first move rather than a wholesale migration — this is the single highest-leverage architecture decision in a Synapse-to-Fabric migration. To understand how OneLake fits into Microsoft's overall cloud analytics ecosystem alongside Azure Data Lake Storage and Synapse, read our companion [Microsoft Fabric Architectural Guide](https://dattasable.com/blog/microsoft-fabric-architectural-guide).

**Interview question.** *"How would you give three different Fabric workspaces read access to the same Gold-layer table without copying it three times?"* — the expected answer centers on creating OneLake Shortcuts from each consuming workspace back to the single physical Gold table, paired with workspace-level role assignments to control who can read through the Shortcut.

**Certification relevance.** OneLake fundamentals — what it is, how Shortcuts work, and the difference between a OneLake-native table and a Shortcut — are core to both DP-600 and DP-700, and increasingly appear as scenario-based questions rather than simple definitions.

**Performance impact.** Native OneLake storage benefits from V-Order, a write-time Parquet optimization (sorting and encoding) that improves downstream read performance for Power BI and SQL engines; data accessed purely via Shortcut to a non-Fabric source does not get V-Order applied unless it's rewritten into Fabric.

**Cost impact.** OneLake storage is billed independently of compute, at a rate comparable to standard Azure Data Lake Storage Gen2 pricing — and Shortcuts carry no additional storage charge for the *referenced* data, since nothing is duplicated; you pay once for the underlying bytes regardless of how many workspaces shortcut to them.

📌 *OneLake Data Flow Diagram — capacities, workspaces, items, and Shortcut pointers*

| OneLake Concept | What It Is | What It Is Not |
|---|---|---|
| Native table/file | Physically stored in OneLake, Delta Parquet format, V-Order eligible | A copy synced from elsewhere on a schedule |
| Shortcut | A virtual pointer to data stored elsewhere (internal or external) | A snapshot or a one-time import |
| Workspace | A security and collaboration boundary containing items | A storage account you configure manually |
| Capacity | The compute pool (F-SKU) a workspace is assigned to | Storage — capacity and storage are billed separately |

---

## 4. The Seven Fabric Workloads

Fabric ships seven workload experiences, each a distinct engine pointed at the same OneLake storage. Knowing what each one is *for* — and just as importantly, what it is *not* for — is the fastest way to stop over-engineering a Fabric design.

| Workload | Primary Engine | Best For | Typical Persona |
|---|---|---|---|
| Data Factory | Pipeline orchestration, Dataflows Gen2 | Ingestion, scheduling, 200+ connector ETL/ELT | Data Engineer |
| Data Engineering (Lakehouse) | Apache Spark, Delta Lake | Large-scale transformation, semi-structured data, notebooks | Data Engineer |
| Data Warehouse | Distributed T-SQL engine | Transactional SQL, stored procedures, governed reporting | Analytics/BI Engineer, DBA |
| Power BI | VertiPaq / Direct Lake | Visualization, semantic modeling, self-service BI | BI Developer, Analyst |
| Real-Time Intelligence | Eventstream, Eventhouse, KQL | Streaming telemetry, logs, IoT, near-instant analytics | Data Engineer, SRE |
| Data Science | Spark ML, MLflow, Azure ML integration | Model training, experiment tracking, deployment | Data Scientist |
| Databases (SQL database in Fabric) | Transactional SQL with auto-sync to OneLake | Operational app data that also needs analytics access | App/Database Developer |

Every one of these workloads is included in a single Fabric capacity — you don't license Data Warehouse separately from Real-Time Intelligence the way you'd license separate Azure services. That consolidation is the core commercial argument for Fabric: an organization paying separately for Power BI Premium, Azure Synapse, and Azure Data Factory is very often paying more in aggregate than a single equivalent Fabric capacity that includes all seven workloads plus headroom.

📌 *Process Flow Diagram — data moving from source systems through Data Factory into Lakehouse/Warehouse, then into Power BI*

---

## 5. Data Factory: Ingestion and Orchestration

**Definition.** Data Factory in Fabric is the ingestion and orchestration layer — pipelines that move and transform data on a schedule or trigger, built from the same visual pipeline canvas long-time Azure Data Factory users will recognize, plus Dataflows Gen2 for low-code, Power Query–style transformation.

**Purpose.** Raw data rarely arrives already shaped for analytics. Data Factory exists to pull data from source systems — databases, SaaS APIs, files, on-premises systems via gateway — on a defined cadence, and land it into a Lakehouse or Warehouse, optionally applying transformation along the way.

**Architecture and how it works.** A pipeline is a directed graph of activities: Copy Data, Notebook, Stored Procedure, Lookup, conditional branches, and ForEach loops. Pipelines support over 200 native connectors spanning cloud SaaS systems, on-premises databases (via the on-premises data gateway), and other Azure services. Dataflows Gen2 sit one layer above raw Copy activities, giving citizen-integrator-style transformation logic without writing Spark or SQL code, with output landing directly in OneLake.

**Benefits.** Visual authoring lowers the bar for building production ingestion without a full data-engineering team; native Git integration allows pipeline definitions to be version-controlled and promoted through environments via deployment pipelines.

**Limitations.** Very high-throughput or highly custom transformation logic is often better served by a Spark notebook in the Lakehouse than by a Dataflow; Dataflows Gen2 consume Capacity Units more aggressively per row processed than an equivalent hand-written Spark job, which matters once you're operating at scale.

**Real-world use case.** A logistics company ingests order data from a SaaS ERP, shipment events from a partner API, and reference data from an on-premises SQL Server, all on independent schedules, landing each into Bronze Lakehouse tables before a separate Spark notebook merges and conforms them into Silver.

**Best practices.** Use parameterized, metadata-driven pipelines (a single pipeline template driven by a control table) rather than one pipeline per source table; isolate Dataflows Gen2 to genuinely lightweight, business-user-maintained transformations and push heavy lifting to Spark; monitor CU consumption per pipeline run, not just success/failure, since a "succeeding" pipeline can quietly be the most expensive item in the workspace.

**Common mistakes.** Building hundreds of near-identical pipelines instead of one parameterized pipeline; using Dataflows Gen2 for transformations that would be both cheaper and more maintainable as a notebook; ignoring pipeline-level retry and alerting until a production incident forces the conversation.

**Enterprise recommendation.** Data Factory is one of the most heavily tested topics in the DP-700 certification exam — if you're studying for that path specifically, our [DP-700 Study Guide](https://dattasable.com/blog/dp-700-study-guide-2026) walks through the pipeline activity types and orchestration patterns the exam leans on most.

**Interview question.** *"A pipeline ingesting from 40 source tables currently exists as 40 separate pipelines. How would you redesign this?"* — expected answer: a single parameterized pipeline driven by a metadata/control table, with a ForEach activity iterating over table definitions, reducing maintenance overhead and centralizing logging.

**Certification relevance.** DP-700 (Fabric Data Engineer Associate).

**Performance impact.** Copy activities scale with parallelism settings (Degree of Copy Parallelism) and source system throughput limits, not just Fabric capacity size — undersized parallelism is a more common bottleneck than capacity size in ingestion-heavy workloads.

**Cost impact.** Pipeline orchestration overhead (trigger evaluation, activity scheduling) consumes relatively few CUs; the actual data movement and any embedded Dataflow Gen2 transformation is where consumption concentrates.

📌 *Architecture Diagram — Data Factory pipeline activities feeding a metadata-driven ingestion framework*

---

## 6. Lakehouse Architecture

**Definition.** A Fabric Lakehouse is a unified data store combining the flexibility of a data lake (any file type, schema-on-read) with the structure of a database (Delta tables, an automatically generated SQL Analytics Endpoint for read-only querying). It's the primary surface for data engineers working with Spark notebooks and large-scale transformation.

**Purpose.** Before lakehouse architecture, organizations ran two parallel systems — a data lake for unstructured/semi-structured data and a warehouse for structured, query-optimized reporting data — with constant duplication between them. A Lakehouse exists to collapse that duality: you can drop raw JSON files in a Files area and query a curated Delta table in the same item, using the same security boundary.

**Architecture.** Every Lakehouse has two logical areas: **Tables**, which holds managed and unmanaged Delta tables queryable via Spark, the SQL Analytics Endpoint, and Power BI; and **Files**, an unstructured area for landing raw data (CSV, JSON, images, Parquet) before it's transformed into managed Delta tables. The SQL Analytics Endpoint is generated automatically the moment you create a table — there's no separate provisioning step to enable T-SQL read access.

**How it works.** Data engineers write PySpark, Scala, or Spark SQL in notebooks against Lakehouse tables, typically organized using medallion architecture: Bronze (raw, minimally transformed), Silver (cleaned, conformed, deduplicated), and Gold (business-ready, aggregated, dimensional). Each layer is its own set of Delta tables, often in separate Lakehouses or at minimum separate schemas, with lineage tracked as data moves between them. (Read our dedicated [Microsoft Fabric Medallion Architecture guide](https://dattasable.com/blog/microsoft-fabric-medallion-architecture-guide) for a full layer-by-layer breakdown with transformation patterns for each tier.)

**Benefits.** Native Spark for complex transformation logic that's awkward to express in pure SQL; automatic SQL endpoint means BI tools and analysts get T-SQL access without a separate ETL hop; Delta's ACID transactions and time travel give you reliable upserts and the ability to query historical table state.

**Limitations.** The SQL Analytics Endpoint is read-only — you cannot run INSERT/UPDATE/DELETE against it directly; write operations belong to Spark or pipeline activities. Very small, highly transactional workloads with frequent single-row writes are a poor fit for a Lakehouse and are better served by a Warehouse or a SQL database in Fabric.

**Real-world use case.** A healthcare analytics team ingests raw HL7 and claims files into a Bronze Lakehouse, applies de-identification and schema enforcement in Silver via PySpark, and produces a Gold star schema consumed directly by Power BI through Direct Lake — all three layers living in the same OneLake without a single export/import step.

**Best practices.** Apply V-Order optimization on Gold tables that feed Power BI to maximize Direct Lake read performance; partition large fact tables thoughtfully (date-based partitioning is the most common pattern); use Lakehouse schemas (the preview/GA "schema-enabled Lakehouse" capability) to organize tables logically instead of flat namespaces once table counts grow past a few dozen.

**Common mistakes.** Skipping the Bronze layer and transforming directly from source into Gold, which destroys your ability to reprocess history when business logic changes; running small, row-by-row updates through Spark instead of batching, which is both slow and CU-expensive; forgetting that the SQL endpoint refreshes metadata on a short delay after a Spark write, which can confuse downstream consumers expecting instant consistency.

**Enterprise recommendation.** Separate Bronze/Silver/Gold into either separate Lakehouses (for hard isolation and independent security) or separate schemas within one Lakehouse (for simpler navigation) based on your governance requirements — there is no universally correct answer, and the decision belongs in your architecture review, not left to whoever builds the first pipeline.

**Interview question.** *"Why does a Lakehouse have both a Tables area and a Files area, and when would you use each?"* — expected answer: Files is for landing raw/unstructured data before transformation; Tables holds structured Delta tables that are queryable by Spark, SQL, and Power BI, and only the Tables area is queryable by the SQL Analytics Endpoint.

**Certification relevance.** Core to DP-700 (Data Engineer) and present in DP-600 (Analytics Engineer) for how Lakehouse Gold tables feed semantic models.

**Performance impact.** Small-file problems (many tiny Parquet files instead of fewer, larger ones) degrade both Spark and Direct Lake read performance; running OPTIMIZE and VACUUM on Delta tables regularly keeps file layout efficient.

**Cost impact.** Spark compute is billed as Capacity Units consumed for the duration of a notebook or pipeline run, scaling with the Spark pool size (node count and SKU) you select — oversized default Spark pools are one of the most common sources of capacity over-consumption in early Fabric deployments.

📌 *Medallion Diagram — Bronze, Silver, Gold layers inside a Fabric Lakehouse*

---

## 7. Data Warehouse Architecture

**Definition.** Fabric's Data Warehouse is a fully transactional T-SQL engine running over OneLake storage, supporting standard DML (INSERT, UPDATE, DELETE), DDL, views, stored procedures, and multi-table transactions — the closest analog to a traditional enterprise data warehouse inside the Fabric platform.

**Purpose.** Some teams — particularly those staffed by SQL Server DBAs and traditional BI developers — need a fully governed, ACID-compliant, T-SQL-native serving layer with stored procedures and familiar DDL, rather than a Spark-first experience. The Warehouse exists for that audience and that workload pattern.

**Architecture.** Like the Lakehouse, the Warehouse stores its data as Delta Parquet in OneLake — meaning a Warehouse table is *also* directly queryable by Spark and visible to other workspaces via Shortcut, even though you interact with it through T-SQL. Compute is fully managed and automatically scaled; there is no cluster sizing or distribution key configuration exposed to the administrator the way there was with Synapse dedicated SQL pools.

**How it works.** You create schemas, tables, views, and stored procedures using familiar T-SQL syntax (close to Azure SQL Database / Synapse dialect). Cross-database queries let a single T-SQL statement join tables that live in different Warehouses or even Lakehouses within the same workspace, treating the whole OneLake estate as one logical database surface.

**Benefits.** Full DML support (unlike the Lakehouse's read-only SQL endpoint), familiar T-SQL development experience for SQL Server-trained teams, native source control and CI/CD integration through Fabric's Git support, and automatic compute scaling without manual cluster management.

**Limitations.** No support for some advanced T-SQL features found in SQL Server or Azure SQL Database (certain index types, full cross-database transactions in earlier capabilities); workloads requiring extremely high-concurrency OLTP-style transactions are a better fit for a SQL database in Fabric or Azure SQL Database than a Warehouse, which is optimized for analytical, not transactional, concurrency.

**Real-world use case.** A finance team migrating off an on-premises SQL Server data warehouse moves its star schema, stored procedures, and nightly ETL stored-procedure logic almost directly into a Fabric Warehouse, preserving most of the existing T-SQL codebase while gaining OneLake-native storage and Power BI Direct Lake compatibility for free.

**Best practices.** Use stored procedures for complex, multi-step transformation logic that's awkward in Spark; rely on statistics and query plan review (similar disciplines to SQL Server tuning) rather than assuming the engine needs zero tuning; design star schemas explicitly rather than querying flattened source-shaped tables directly from Power BI.

**Common mistakes.** Assuming a Warehouse and a Lakehouse are interchangeable — they are not, and choosing the wrong one early often means a costly mid-project migration; neglecting statistics maintenance and assuming "fully managed" means "zero tuning required."

**Enterprise recommendation.** DP-800 is the certification most directly relevant to teams building AI-enabled extensions on top of SQL-based data — including embedding vector search and Retrieval-Augmented Generation patterns directly into T-SQL — so if your Warehouse team is also being asked to bring AI capability into SQL workloads rather than pure BI serving, the [DP-800 Study Guide](https://dattasable.com/blog/dp-800-study-guide) is the more relevant credential to pursue alongside core Warehouse skills.

**Interview question.** *"Your team has deep SQL Server stored-procedure expertise and a tight migration deadline. Would you recommend a Fabric Warehouse or a Fabric Lakehouse, and why?"* — expected answer: Warehouse, because it preserves T-SQL DML/DDL patterns, full transactional support, and stored-procedure-based ETL logic the team already knows, minimizing retraining risk against the deadline.

**Certification relevance.** Central to DP-600; increasingly intersects with DP-800 where Warehouse tables are extended with AI/vector capabilities.

**Performance impact.** Query performance benefits from the same statistics-driven optimizer discipline as any modern SQL engine; poorly designed schemas (wide flat tables, missing date dimensions) hurt performance regardless of how much capacity you throw at the problem.

**Cost impact.** Warehouse compute draws from the same shared Capacity Unit pool as every other workload — a poorly tuned, full-scan-heavy query competes directly with your Power BI refreshes and Spark jobs for the same CUs.

📌 *Comparison Table — Fabric Warehouse vs. traditional SQL Server data warehouse*

---

## 8. Lakehouse vs. Warehouse: Choosing the Right Engine

This is the single most common architecture decision Fabric teams face, and getting it wrong is expensive to unwind later.

| Dimension | Lakehouse | Warehouse |
|---|---|---|
| Primary language | PySpark, Scala, Spark SQL | T-SQL |
| Write access | Spark/notebooks/pipelines (SQL endpoint is read-only) | Full T-SQL DML (INSERT/UPDATE/DELETE) |
| Best-fit data | Semi-structured, large-volume, varied file types | Structured, schema-stable, transactional reporting data |
| Best-fit team | Data engineers comfortable with Spark/Python | SQL Server DBAs, T-SQL developers |
| Transformation style | Code-first, notebook-driven | Stored procedures, views, set-based SQL |
| Typical role in medallion | Bronze and Silver layers | Often Gold layer for governed serving |
| Cross-querying | Readable by Warehouse, Power BI, other workspaces via Shortcut | Readable by Spark and other workspaces via Shortcut |

**Decision framework.** Choose a Lakehouse when your team is Python/Spark-first, your source data is semi-structured or highly variable in shape, or you're building the Bronze/Silver layers of a medallion pipeline. Choose a Warehouse when your team is T-SQL-first, you need full DML against the serving layer, or you're migrating an existing SQL Server/Synapse warehouse codebase with minimal rewrite. Many mature enterprise architectures use both: Lakehouse for ingestion and transformation, Warehouse for governed Gold-layer serving with stored-procedure-based business logic — connected through cross-item queries rather than data duplication, since both ultimately store Delta Parquet in the same OneLake.

📌 *Decision Tree — Lakehouse vs. Warehouse selection criteria*

---

## 9. Power BI, Semantic Models, and Direct Lake

**Definition.** Power BI inside Fabric is the visualization and semantic modeling layer, built on the VertiPaq in-memory analytics engine, with three storage modes available to a semantic model: Import, DirectQuery, and the Fabric-exclusive Direct Lake.

**Purpose.** Raw Delta tables in a Lakehouse or Warehouse are rarely shaped for business consumption — they need relationships, measures, hierarchies, and row-level security defined on top. The semantic model (formerly "dataset") is where that business layer lives, sitting between governed data and the report canvas.

**Storage mode comparison.**

| Mode | Data Freshness | Query Performance | Refresh Required? | Best For |
|---|---|---|---|---|
| Import | As of last refresh | Fastest (in-memory) | Yes, scheduled | Smaller, stable datasets where some staleness is acceptable |
| DirectQuery | Real-time | Slower (pushed to source) | No | Very large or rapidly changing data where freshness matters most |
| Direct Lake | Near real-time | Import-like speed | No | Fabric-native data needing both speed and freshness |

**How Direct Lake works.** Direct Lake lets the VertiPaq engine read Delta Parquet files directly from OneLake into memory, mapping columns on demand rather than running a traditional import/refresh job and without pushing every query back to a source database the way DirectQuery does. The practical effect is Import-mode-like query speed against data that's as current as the underlying Delta table, with no scheduled refresh pipeline required for the semantic layer itself.

**Benefits.** Eliminates the refresh-latency tradeoff that has defined Power BI architecture for a decade — you genuinely get speed and freshness in the same model for Fabric-native data; removes duplicate storage, since the semantic model doesn't hold its own copy.

**Limitations.** Direct Lake automatically falls back to DirectQuery when it encounters constructs it can't handle natively — very complex DAX, certain relationship cardinalities, or specific row-level security scenarios — and that fallback is silent unless you're actively monitoring it. Each capacity SKU has guardrails on table size (rows, file counts, on-disk size); exceeding them on Direct Lake on OneLake causes outright query failure rather than a graceful fallback, which makes table-size monitoring a non-optional operational discipline, not a nice-to-have.

**Real-world use case.** A retail chain rebuilds its sales semantic model on Direct Lake against Gold-layer Lakehouse tables, eliminating a 90-minute nightly Import refresh window and giving regional managers sales figures that are current within minutes of a transaction landing in the warehouse, with no separate refresh schedule to maintain.

**Best practices.** Apply V-Order to Gold tables feeding Direct Lake models; keep DAX measures within Direct Lake's supported feature set to avoid silent DirectQuery fallback; actively monitor table size against your capacity SKU's guardrails as data volume grows, not just at initial design time.

**Common mistakes.** Assuming Direct Lake "just works" without checking SKU guardrails, then being surprised by performance cliffs as a table crosses a size threshold; building overly complex DAX that silently triggers fallback, leaving the team debugging slow reports without realizing the model quietly stopped using Direct Lake at all.

**Enterprise recommendation.** Mention Power BI and Fabric integration patterns specifically in your semantic-layer design reviews — our [Power BI & Microsoft Fabric Integration](https://dattasable.com/blog/power-bi-fabric-integration-2026) guide covers how existing Power BI workspaces interoperate with Fabric items, and the dedicated [Direct Lake performance tuning guide](https://dattasable.com/blog/power-bi-direct-lake-performance-tuning-fabric) is the right next read if you're actively building or troubleshooting a Direct Lake model.

**Interview question.** *"A Direct Lake semantic model that performed well for months suddenly starts running slowly with no error message. What would you check first?"* — expected answer: check whether the model has silently fallen back to DirectQuery, either due to a DAX construct outside Direct Lake's supported surface or because a table has exceeded the capacity SKU's size guardrails.

**Certification relevance.** Direct Lake is one of the most heavily emphasized new topics on DP-600, reflecting its centrality to Fabric's BI value proposition.

**Performance impact.** Direct Lake performance is bound by both capacity SKU guardrails and the quality of the underlying Delta table layout (V-Order, file count, partitioning) — modeling decisions and data engineering decisions are now coupled in a way they weren't under pure Import mode.

**Cost impact.** Removing scheduled Import refreshes reduces recurring CU consumption tied to refresh jobs, but Direct Lake query-time framing operations still consume capacity — the savings are real but not unlimited, and very high query concurrency against a Direct Lake model on a small SKU can still throttle.

📌 *Architecture Diagram — VertiPaq engine reading Delta Parquet directly from OneLake in Direct Lake mode*

---

## 10. Real-Time Intelligence: Eventstream, Eventhouse, KQL

**Definition.** Real-Time Intelligence is Fabric's workload for streaming and high-velocity data, built around three components: **Eventstream**, a no-code ingestion pipeline for streaming sources; **Eventhouse**, a database container optimized for time-series and log-style data; and **KQL Databases**, queried using the Kusto Query Language familiar from Azure Data Explorer and Azure Monitor.

**Purpose.** Batch pipelines and scheduled refreshes are the wrong tool for IoT telemetry, application logs, clickstream events, or financial tick data, where insight measured in minutes is too slow. Real-Time Intelligence exists to ingest, store, and query data with latency measured in seconds.

**Architecture and how it works.** Eventstream connects to sources like Azure Event Hubs, IoT Hub, Kafka topics, or change-data-capture feeds, applies lightweight in-flight transformation, and routes events into a destination — most often a KQL Database inside an Eventhouse, but also optionally a Lakehouse table for downstream batch analytics. KQL Databases are optimized for append-heavy, time-series query patterns and integrate directly with Power BI and Real-Time Dashboards for live visualization. Data Activator, a related capability, lets you define trigger conditions on this streaming data and fire automated alerts or actions without writing custom code.

**Benefits.** Genuinely low-latency analytics without standing up separate Azure Data Explorer clusters; native integration with the rest of Fabric means streaming data can also land in OneLake for blended batch/streaming analysis.

**Limitations.** KQL is a different query language from T-SQL or Spark SQL, requiring a real skills investment for teams unfamiliar with Azure Data Explorer or Application Insights; not every streaming pattern (very high-cardinality joins, for instance) is a natural fit for KQL's columnar, time-series-optimized design.

**Real-world use case.** A manufacturing company streams sensor telemetry from factory floor equipment through Eventstream into an Eventhouse, with Data Activator configured to alert maintenance teams the moment vibration readings cross a threshold — entirely without a custom streaming application.

**Best practices.** Use Eventhouse's built-in retention and partitioning controls deliberately rather than accepting defaults for high-volume telemetry; route a copy of streaming data into a Lakehouse table when you need it joined against slower-moving dimensional data for historical analysis.

**Common mistakes.** Treating Eventhouse as a general-purpose data warehouse rather than a time-series-optimized engine; underestimating the KQL learning curve for teams with only T-SQL backgrounds.

**Certification relevance.** Real-Time Intelligence is a growing share of DP-700's skills-measured document, reflecting Microsoft's investment in streaming as a first-class Fabric workload rather than an afterthought.

**Performance / cost impact.** Streaming ingestion and KQL query compute draw from the same shared Capacity Unit pool — high-frequency streaming sources can be a meaningfully larger and steadier consumer of capacity than batch pipelines, and should be sized for accordingly.

📌 *Data Flow Diagram — Eventstream ingesting into Eventhouse with Data Activator triggering alerts*

---

## 11. Data Science and AI Workloads

**Definition.** The Data Science workload provides Spark-based ML model development, MLflow-based experiment tracking, and model deployment, plus growing integration with Azure OpenAI and Copilot capabilities across the platform.

**Purpose.** Training and evaluating models against data that's already governed and stored in OneLake removes the export-to-a-separate-ML-platform step that historically introduced both latency and a second copy of sensitive data outside the governance boundary.

**Architecture and how it works.** Data scientists work in notebooks against Lakehouse or Warehouse tables, using standard Python ML libraries alongside Spark MLlib for distributed training. MLflow, built into the workspace experience, automatically tracks experiments, parameters, and metrics without separate infrastructure. Trained models can be registered and deployed for batch scoring jobs that write predictions directly back into OneLake tables.

**Benefits.** No separate ML platform to provision or secure; models train against governed, access-controlled production data rather than an export; experiment tracking is built in rather than bolted on.

**Limitations.** Very large-scale deep learning workloads with specialized GPU requirements are often still better served by a dedicated platform like Azure Machine Learning; Fabric's Data Science workload is strongest for tabular ML and classical/Spark-distributed modeling rather than cutting-edge deep learning research.

**Real-world use case.** An insurance company builds a claims-fraud propensity model using Spark MLlib against Silver-layer claims tables, tracks every training run automatically via MLflow, and writes batch fraud scores back into a Gold table that a Power BI report surfaces to investigators the next morning.

**Best practices.** Keep training data access scoped through the same RLS/OLS rules as analytical access rather than granting blanket data-scientist exceptions; register models with clear versioning so a reverted model can be traced to the exact training run.

**Common mistakes.** Training on an unfiltered copy of sensitive data "just for the data science team," which quietly bypasses the governance model the rest of the platform enforces.

**Certification relevance.** Lighter coverage on DP-600/DP-700 relative to core BI and engineering topics, but increasingly relevant as DP-800's focus on AI-enabled database solutions (vector search, embeddings, RAG patterns) intersects with Fabric's broader AI investment.

📌 *Architecture Diagram — MLflow experiment tracking against Lakehouse training data*

---

## 12. Capacity Units, F-SKUs, and Capacity Planning

**Definition.** A Fabric capacity is a dedicated, purchasable pool of Capacity Units (CUs) — Microsoft's normalized measure of compute (CPU, memory, I/O) — sized as an F-SKU ranging from F2 up through F2048, where the number denotes CU/second throughput (F2 = 2 CU/s, F64 = 64 CU/s, and so on).

**Purpose.** Rather than billing each workload separately, Fabric charges for one shared compute pool that every workload — Power BI, Spark, T-SQL, KQL, ML — draws from simultaneously. This is the commercial and architectural backbone of the entire "one platform" pitch.

**How it works.** Every operation — opening a report, running a Spark job, executing a SQL query, processing a streaming event — consumes CUs for its duration. Fabric supports temporary **bursting** beyond the purchased CU allocation for short spikes, and **smoothing**, which averages consumption over a rolling window rather than billing peak instantaneous usage, both of which reduce the need to overprovision for occasional spikes. The Capacity Metrics app gives administrators a rolling 14-day view of consumption broken down by workload, which is the primary tool for right-sizing.

**The F64 threshold.** F64 is the single most consequential pricing decision in Fabric capacity planning. Below F64, every individual who *views* published Power BI content needs a Pro or Premium-Per-User license. At F64 and above, viewers with only a free license can consume Power BI content at no per-user cost — only content *creators* still need a Pro/PPU license regardless of SKU size. For organizations with roughly 250+ active Power BI viewers, F64 capacity cost is typically lower in aggregate than the equivalent number of Pro licenses, making F64 a natural break-even point worth modeling explicitly rather than assuming.

**Benefits.** Predictable, fixed monthly cost regardless of viewer count once past the F64 threshold; one purchasing decision covers every workload rather than separate line items for BI, engineering, and warehousing.

**Limitations.** Smaller SKUs (F2–F32) impose meaningful Direct Lake table-size guardrails and Pro-license requirements for every viewer, which can make a "start small" approach more expensive in aggregate than expected once viewer counts grow.

**Real-world use case.** An organization with 300 Power BI users currently on F32 capacity plus 300 individual Pro licenses recalculates total monthly cost against F64-with-no-Pro-licenses-for-viewers and finds the F64 path meaningfully cheaper once the license savings are netted against the larger capacity price — a calculation worth running explicitly rather than assuming based on SKU price alone.

**Best practices.** Use the Capacity Metrics app continuously, not just at initial sizing; model pay-as-you-go for unpredictable or development workloads and reserved 1-year pricing (meaningfully cheaper) for steady production workloads; consider pausing non-production capacities outside business hours, since Fabric capacity (unlike a license) can be turned off when unused.

**Common mistakes.** Sizing capacity once at project kickoff and never revisiting it as workload composition shifts from "mostly BI" to "mostly Spark," which consume CUs very differently; ignoring the F64 license-economics threshold entirely and assuming a smaller SKU is automatically cheaper.

**Enterprise recommendation.** Capacity planning decisions belong in the same governance review as security and architecture decisions, not left purely to a finance team reading a price sheet — the F64 threshold has real architectural implications (Direct Lake guardrails, license requirements) beyond pure cost.

**Interview question.** *"Walk me through how you'd decide between F32 and F64 for a 280-person Power BI rollout."* — expected answer: comparing total monthly cost of F32-plus-280-Pro-licenses against F64-with-creator-only-licensing, while also checking whether F64's larger Direct Lake guardrails matter for the organization's table sizes.

**Certification relevance.** Capacity and SKU planning appears across DP-600 and is a named topic in administrator-track Fabric content.

**Cost impact.** This entire section *is* the cost-impact discussion for the platform — capacity sizing is the largest controllable lever in total Fabric spend.

📌 *Capacity Planning Diagram — F-SKU tiers, CU/s allocation, and the F64 license threshold*

| SKU | CU/s | Typical Use Case |
|---|---|---|
| F2–F8 | 2–8 | Embedded portals, light pilots, dev/test |
| F16–F32 | 16–32 | Growing Fabric workloads, moderate Spark usage |
| F64 | 64 | Free-viewer threshold; standard enterprise entry point |
| F128–F512 | 128–512 | Heavy multi-team production workloads |
| F1024–F2048 | 1024–2048 | Very large enterprise or burst-heavy seasonal workloads |

---

## 13. Security Architecture

**Definition.** Fabric's security model is built on Microsoft Entra ID (formerly Azure AD) for identity and authentication across every workload, layered with item-level permissions, workspace roles, and OneLake-native data-level security (often referred to as OneLake security) that applies consistently regardless of which engine is reading the data.

**Purpose.** A platform where Spark, T-SQL, KQL, and Power BI all read the same physical files needs one consistent answer to "who can see this row/column," not seven different per-tool security models that can drift out of sync with each other.

**Architecture.** Authentication flows through Entra ID at the tenant level. Workspace roles (Admin, Member, Contributor, Viewer) control what a user can *do* within a workspace — create items, edit, or only view. Item-level permissions layer on top, controlling access to specific Lakehouses, Warehouses, or reports. OneLake security extends this further down to the data itself, supporting folder- and table-level access control that's enforced consistently whether the request comes from Spark, the SQL endpoint, or Power BI.

**How it works.** A data engineer might have Contributor access to a workspace and full read/write on Bronze and Silver Lakehouse tables, while a business analyst has Viewer access to the workspace and read-only access scoped to Gold tables only — enforced at the OneLake layer, not duplicated separately in Spark permissions and SQL permissions and Power BI permissions.

**Benefits.** One identity and authorization model across every workload removes an entire class of security drift; integration with conditional access policies, multi-factor authentication, and Privileged Identity Management inherits directly from existing Entra ID investments rather than requiring new tooling.

**Limitations.** OneLake security's granularity is still maturing relative to decades-old, highly granular database-level security models in mature RDBMS platforms — some very fine-grained legacy security patterns require translation rather than a direct lift-and-shift.

**Real-world use case.** A healthcare organization scopes Entra ID security groups to clinical roles, mapping those groups directly onto OneLake folder-level permissions so that a nurse's Power BI report, a data engineer's Spark notebook, and a compliance officer's ad hoc T-SQL query all enforce the identical de-identification boundary without three separate configuration efforts.

**Best practices.** Use Entra ID security groups rather than individual user assignments for every workspace role and OneLake permission, so access reviews scale with org-chart changes instead of manual list maintenance; apply least-privilege at the workspace level by default and elevate deliberately rather than starting broad.

**Common mistakes.** Granting workspace Admin or Contributor access broadly "to avoid support tickets," which quietly erodes the row/column-level controls applied elsewhere; assuming Power BI RLS alone is sufficient without confirming the same boundary holds when the same data is queried through Spark or the SQL endpoint.

**Enterprise recommendation.** For organizations with mature cybersecurity programs extending into the BI estate, read our [cybersecurity hardening guide for BI and data platforms](https://dattasable.com/blog/cybersecurity-bi-data-vault-hardening) alongside this section — Fabric's unified data layer changes the threat model compared with siloed point solutions, and that guide goes deeper into hardening patterns than this article has room for.

**Interview question.** *"A Power BI report enforces row-level security correctly, but a data engineer querying the same Gold table from a notebook can see rows the RLS rule should be blocking. What's wrong?"* — expected answer: RLS defined purely inside the Power BI semantic model only applies to queries against that semantic model — it does not automatically extend to raw Spark or SQL queries against the underlying table, which require their own OneLake-level or Warehouse-level security configuration to enforce the same boundary.

**Certification relevance.** Security architecture spans both DP-600 and DP-700, and is a dedicated domain in administrator-focused Fabric certification content.

📌 *Security Model Diagram — Entra ID, workspace roles, item permissions, and OneLake data security*

---

## 14. Governance: RBAC, RLS, OLS, and Purview

**Definition.** Governance in Fabric covers four overlapping mechanisms: Role-Based Access Control (RBAC) at the workspace and item level, Row-Level Security (RLS) restricting which rows a user can see within a table, Object-Level Security (OLS) restricting which tables or columns a user can see at all, and Microsoft Purview integration for cataloging, lineage, and sensitivity labeling across the entire estate.

**Purpose.** As data volume and the number of consuming teams grow, "who can see what" stops being answerable from memory. Governance tooling exists to make access auditable, sensitivity classification consistent, and lineage traceable from raw source to final report — a board-level requirement at most enterprises adopting Fabric at scale, not an optional add-on.

**Architecture and how it works.** RBAC is configured at the workspace (roles) and item (sharing/permissions) level. RLS is typically defined inside a Power BI semantic model using DAX-based filter expressions tied to the querying user's identity, though Warehouse-level RLS is also supported using T-SQL security policies for protection that holds regardless of query tool. OLS restricts visibility of entire tables or columns — useful for hiding sensitive columns (salary, SSN) from roles that should never see them, rather than merely filtering rows. Purview connects to a Fabric tenant to automatically catalog items, trace lineage from source connector through pipeline through Lakehouse/Warehouse to final report, and apply sensitivity labels that travel with the data even as it moves between workloads.

**Benefits.** Centralized lineage means a compliance audit can trace any number on a dashboard back to its originating source system without manual documentation; sensitivity labels applied once in Purview are respected consistently across Power BI, Excel exports, and other Microsoft 365 surfaces.

**Limitations.** Purview's lineage capture is strongest for native Fabric items; custom external processes feeding into OneLake via API may require additional configuration to appear correctly in lineage views; RLS performance overhead grows with model complexity, and very intricate row-level rules can measurably slow Direct Lake query performance.

**Real-world use case.** A multinational retailer applies OLS to hide cost-of-goods and margin columns from regional store managers while leaving sales-volume columns visible, applies RLS so each manager only sees their own region's rows, and uses Purview to demonstrate to auditors exactly which source systems feed the margin figures restricted from store-level visibility.

**Best practices.** Design RLS and OLS rules around Entra ID security groups mapped to business roles, not individual exceptions; review Purview-captured lineage during any architecture change, since lineage frequently reveals undocumented downstream dependencies before they break in production; apply sensitivity labels at the earliest possible point in the pipeline (ideally at ingestion) rather than retrofitting them at the reporting layer.

**Common mistakes.** Implementing RLS only in the Power BI layer while leaving the same data ungoverned when queried directly via Spark or SQL, creating an inconsistent security boundary depending on access path; treating Purview cataloging as a one-time project rather than an ongoing operational discipline tied to every new item created.

**Enterprise recommendation.** As Fabric increasingly intersects with AI-driven features — Copilot summarizing report content, agents querying semantic models on a user's behalf — governance needs to extend explicitly to AI access patterns, not just human dashboard access; our [AI governance for BI platforms](https://dattasable.com/blog/ai-governance-bi) guide covers that emerging discipline in more depth than this section can.

**Interview question.** *"How would you prevent an AI Copilot feature from surfacing salary data to a user who shouldn't see it in a normal report?"* — expected answer: enforce OLS/RLS at the semantic model and OneLake layer so the restriction is structural, not dependent on the AI feature's own filtering logic — Copilot and similar AI surfaces inherit the same underlying security context as the querying user, so governance applied at the data layer protects every consumption surface, present and future.

**Certification relevance.** RLS, OLS, and RBAC are explicitly named in the DP-600 skills-measured document; Purview-based governance increasingly appears in both DP-600 and enterprise-administrator Fabric content.

📌 *Security Model Diagram — RLS, OLS, and RBAC layered with Purview lineage and sensitivity labeling*

---

## 15. Enterprise Best Practices, CI/CD, and Git Integration

Production Fabric environments need the same software-engineering discipline any other enterprise platform requires — version control, environment promotion, and monitoring — applied to items that didn't traditionally get that treatment in legacy BI tooling.

**Git integration.** Workspaces can connect directly to Azure DevOps or GitHub repositories, with item definitions (notebooks, pipelines, semantic model definitions) version-controlled as source files rather than living only inside the Fabric service. This enables branching, pull-request review, and rollback for BI and data-engineering artifacts the same way application code has worked for years.

**Deployment pipelines.** Fabric's built-in deployment pipelines support promoting items through Development → Test → Production stages, with rule-based parameter overrides (different connection strings or capacity assignments per stage) so the same notebook or report definition behaves correctly as it moves through environments.

**Monitoring, logging, and alerting.** The Capacity Metrics app provides workload-level consumption visibility; Fabric's monitoring hub gives a unified view of pipeline runs, Spark job status, and refresh history across a workspace, replacing the fragmented monitoring story of separately-managed Azure services. Data Activator extends this into automated alerting based on defined conditions, not just dashboards someone has to remember to check.

**Best practices.** Treat workspace Git connections as mandatory for any item touching production data, not optional; build deployment pipeline rules deliberately for connection strings and capacity assignment rather than manually reconfiguring after each promotion; centralize alerting through Data Activator or external tooling rather than relying on someone noticing a failed pipeline in the UI.

**Common mistakes.** Building directly in a production workspace without Git-backed Dev/Test stages "because it's faster," which works until the first rollback is needed; skipping deployment pipeline parameter rules and manually editing connection strings after every promotion, which is both slow and error-prone.

**Enterprise recommendation.** For platform teams thinking about the broader BI operating model — not just Fabric's specific CI/CD mechanics — our [Modern BI Stack](https://dattasable.com/blog/modern-bi-stack-2026) guide covers how source control, testing, and release discipline fit into a contemporary analytics organization beyond what's specific to Fabric tooling.

**Certification relevance.** Git integration and deployment pipelines are explicitly named in DP-600's skills-measured document under lifecycle management.

📌 *Process Flow Diagram — Git-backed Dev/Test/Prod deployment pipeline for a Fabric workspace*

---

## 16. Performance Optimization

Performance in Fabric is determined by the interaction of three layers, and tuning only one of them while ignoring the others is the most common reason "we threw a bigger SKU at it and it didn't help."

**Data layout.** V-Order optimization on Delta Parquet files materially improves both Spark and Direct Lake read performance — apply it to Gold-layer tables feeding reporting workloads as a default practice, not an afterthought. Avoid the small-file problem (thousands of tiny Parquet files instead of fewer, well-sized files) by running OPTIMIZE compaction regularly; small files hurt both Spark scan performance and Direct Lake framing time.

**Query and model design.** For Power BI, keep DAX within Direct Lake's natively supported feature set to avoid silent fallback to DirectQuery, which is dramatically slower. For Warehouse workloads, maintain statistics and design schemas (star schema over flattened wide tables) the same way you would for any modern SQL engine — Fabric's managed compute doesn't eliminate the need for query and schema-level tuning discipline.

**Capacity sizing.** Even a perfectly tuned table and a perfectly designed semantic model will throttle on an undersized capacity during concurrent peak usage. Use the Capacity Metrics app to correlate slow-query complaints with actual CU consumption spikes before assuming the problem is purely a modeling issue.

**Best practices.** Profile before optimizing — use the Capacity Metrics app and Spark/SQL query plans to identify the actual bottleneck layer rather than guessing; apply V-Order and OPTIMIZE as standard pipeline steps for Gold tables rather than manual one-off maintenance; monitor Direct Lake fallback rates as an ongoing metric, not just at initial go-live.

**Common mistakes.** Assuming a capacity upgrade fixes a problem that's actually caused by table file fragmentation or an unsupported DAX construct triggering DirectQuery fallback; never running VACUUM/OPTIMIZE maintenance on Delta tables until performance has already degraded noticeably.

**Enterprise recommendation.** Direct Lake performance specifically deserves its own deep dive beyond what fits in a single section here — see our [Power BI Direct Lake performance tuning guide](https://dattasable.com/blog/power-bi-direct-lake-performance-tuning-fabric) for query-plan-level detail on diagnosing fallback and sizing guardrails correctly.

**Certification relevance.** Performance tuning across Spark, Warehouse, and Direct Lake is tested throughout DP-600 and DP-700.

📌 *Performance Comparison Table — Import vs. DirectQuery vs. Direct Lake under varying data volumes*

---

## 17. Cost Optimization

**Storage costs.** OneLake storage is billed independently of compute, at rates comparable to standard Azure Data Lake Storage Gen2 — typically a small fraction of total Fabric spend compared with capacity costs. V-Order's improved compression on Gold-layer tables reduces storage footprint meaningfully at multi-terabyte scale, which compounds with the performance benefit already discussed.

**Compute costs.** Capacity (the F-SKU) is almost always the dominant cost line. The reserved 1-year pricing model offers substantial savings (commonly cited around 40%) over pay-as-you-go for steady production workloads, while pay-as-you-go suits unpredictable dev/test usage where you might pause capacity entirely outside business hours.

**Shortcut economics.** Using Shortcuts instead of copying data between workspaces or from external clouds avoids duplicate storage charges entirely and reduces the CU cost of running redundant copy pipelines — this is frequently the single largest avoidable cost in a Fabric estate that grew organically without an explicit Shortcut strategy.

**The F64 break-even.** As covered in Section 12, organizations crossing roughly 250+ active Power BI viewers typically find F64's capacity cost is offset by eliminating per-viewer Pro licensing — this calculation should be run explicitly with actual headcount, not assumed from general guidance.

**Best practices.** Use the Microsoft Fabric Capacity Estimator before committing to a SKU; pair reserved pricing for baseline production load with pay-as-you-go bursting for predictable seasonal spikes (month-end close, Black Friday-style retail peaks) rather than permanently provisioning for peak; review the Capacity Metrics app monthly as a standing cost-governance practice, not a one-time exercise.

**Common mistakes.** Provisioning permanently for peak load instead of using burst/pay-as-you-go for temporary spikes; ignoring Shortcut opportunities and quietly accumulating duplicate copies of the same data across workspaces; never revisiting SKU sizing after initial go-live even as workload composition shifts.

**Cost impact summary.** Across enterprise Fabric deployments, the most consistently reported savings driver isn't any single tuning trick — it's consolidating what used to be three to six separately licensed Azure/Power BI services onto one capacity, which is the platform's core economic thesis.

📌 *Cost Comparison Table — Separate Azure services vs. consolidated Fabric capacity, by workload*

---

## 18. Disaster Recovery, High Availability, and Scalability

**Availability.** As a SaaS platform, Fabric's underlying infrastructure availability is managed by Microsoft, with capacities provisioned within a specific Azure region and benefiting from the region's standard availability commitments — there's no customer-managed failover cluster to configure for the platform itself, which removes an entire category of operational work compared with self-managed Spark or SQL clusters.

**Disaster recovery considerations.** Because OneLake data is built on Delta Parquet, the open format itself provides a form of portability resilience — data is never locked behind a proprietary binary that only Fabric can read, which matters for both DR planning and vendor-risk conversations. Organizations with strict cross-region DR requirements typically architect explicit replication of critical Gold-layer tables to a secondary region using Shortcuts, pipelines, or Mirroring, since a single capacity does not automatically span regions.

**Scalability.** Capacity can be scaled up or down (changing F-SKU) or scaled out (adding additional capacities for different workspaces/teams) without infrastructure provisioning — this elasticity is one of Fabric's clearest advantages over self-managed Spark clusters or fixed-size on-premises warehouses, where scaling required a procurement and deployment cycle.

**Best practices.** Document which Gold-layer tables are business-critical enough to warrant explicit cross-region replication versus which can tolerate regional-outage downtime; test capacity scale-up procedures before a real peak event, not during one; separate development, test, and production onto distinct capacities so a runaway dev workload can never consume production's compute budget.

**Common mistakes.** Assuming SaaS automatically means "disaster recovery is someone else's problem" without architecting explicit replication for genuinely critical datasets; co-locating dev/test and production workloads on the same capacity, where a bad notebook in test can degrade production query performance.

**Certification relevance.** Disaster recovery, scalability, and capacity isolation patterns appear in enterprise-administration-focused Fabric content and increasingly in DP-700's operational topics.

📌 *Enterprise Reference Architecture Diagram — multi-region replication pattern for critical Fabric workloads*

---

## 19. Migration Strategy: Moving Off Synapse and Legacy Stacks

**Why migrate.** Organizations running Azure Synapse Analytics, standalone Azure Data Factory, and Power BI Premium separately are frequently paying more in aggregate licensing than an equivalent consolidated Fabric capacity, while also maintaining more separate security and monitoring surfaces than necessary.

**Migration patterns.**

1. **Storage-first, Shortcut-based migration.** Point Fabric workspaces at existing Azure Data Lake Storage Gen2 data via Shortcuts on day one, avoiding a risky big-bang data migration window while gaining immediate access to Fabric's compute and BI layer.
2. **Pipeline re-platforming.** Azure Data Factory pipelines generally port to Fabric Data Factory with moderate rework — most connectors and activity types carry over conceptually, though some activity-specific configuration differs.
3. **Synapse dedicated SQL pool to Fabric Warehouse.** T-SQL schemas and stored procedures generally migrate with the most direct translation path of any Synapse component, since both are T-SQL-based, though distribution-key-specific tuning logic from dedicated pools doesn't carry over since Fabric Warehouse compute is fully managed.
4. **Synapse Spark to Fabric Lakehouse.** Spark notebooks and Delta table logic generally port with minimal change, since both rely on the same open Delta Lake format underneath.
5. **Power BI Premium to Fabric capacity.** Existing semantic models continue functioning, with the opportunity (not requirement) to incrementally re-architect high-value models onto Direct Lake for the freshness/performance benefit.

**Best practices.** Migrate incrementally by workload rather than attempting a single cutover weekend; use Shortcuts to decouple the storage migration timeline from the compute/BI migration timeline; run both platforms in parallel for critical reports during a validation window before fully decommissioning the legacy stack.

**Common mistakes.** Attempting a full big-bang migration across storage, compute, and BI simultaneously, which maximizes risk for no real benefit over an incremental approach; underestimating the retraining required for Synapse dedicated-pool-specific tuning knowledge that doesn't directly transfer to Fabric's managed Warehouse model.

**Real-world example.** A mid-size insurer running Synapse dedicated SQL pools, standalone ADF, and Power BI Premium P1 migrates over a two-quarter program: Quarter one Shortcuts existing ADLS data into Fabric and re-platforms ADF pipelines; quarter two migrates the dedicated pool schema into a Fabric Warehouse and cuts Power BI reports over to Direct Lake against the new Gold tables, decommissioning the legacy Synapse workspace only after both quarters of parallel validation.

**Certification relevance.** Migration scenarios are common in DP-600 and DP-700 scenario-based exam questions, reflecting how frequently this is the actual job, not just a theoretical exercise.

📌 *Enterprise Reference Architecture Diagram — phased Synapse-to-Fabric migration timeline*

---

## 20. Common Mistakes in Fabric Architecture

A consolidated list of the failure patterns referenced throughout this guide, gathered in one place for quick architecture-review reference:

- Treating Shortcuts as full data copies and being surprised when deleting source data breaks every dependent Shortcut.
- Choosing between Lakehouse and Warehouse based on team familiarity alone, without weighing the actual workload pattern (DML needs, file-type variety, transaction volume).
- Enforcing Row-Level Security only inside the Power BI semantic model while leaving the same data ungoverned through direct Spark or SQL access.
- Assuming Direct Lake "just works" without monitoring capacity SKU table-size guardrails as data volume grows.
- Building dozens of near-identical pipelines instead of one parameterized, metadata-driven pipeline.
- Skipping the Bronze layer in medallion architecture, destroying the ability to reprocess history when business logic changes.
- Never running OPTIMIZE/VACUUM maintenance on Delta tables until performance has already visibly degraded.
- Sizing capacity once at kickoff and never revisiting it as workload composition shifts from BI-heavy to Spark-heavy or vice versa.
- Co-locating development/test and production workloads on the same capacity.
- Attempting a single big-bang migration across storage, compute, and BI simultaneously instead of an incremental, Shortcut-enabled approach.
- Ignoring the F64 license-economics threshold entirely when sizing capacity.

📌 *Decision Tree — diagnosing the root cause behind common Fabric performance and governance complaints*

---

## 21. Real-World Architecture Example

Consider a composite (illustrative) example pulling several preceding sections together: a national retail chain consolidating point-of-sale, e-commerce, and loyalty data into one analytics platform.

**Ingestion.** Data Factory pipelines pull nightly batch extracts from the e-commerce platform and loyalty system, while Eventstream ingests real-time point-of-sale transactions, both landing into Bronze Lakehouse tables.

**Transformation.** Spark notebooks clean, deduplicate, and conform data into Silver, applying business rules (return-fraud flags, customer identity resolution across channels) before publishing Gold-layer star schemas optimized with V-Order.

**Serving.** A Fabric Warehouse hosts governed finance-reporting tables with stored-procedure-based monthly close logic, while Power BI semantic models built on Direct Lake against the Gold Lakehouse tables serve store-level and regional dashboards with near-real-time freshness.

**Real-time operations.** An Eventhouse holds streaming POS telemetry, with Data Activator alerting regional operations teams the instant a store's transaction volume drops below an expected threshold, indicating a possible system outage.

**Governance.** Purview catalogs lineage from each source connector through to final dashboard; OLS hides margin data from store-level roles while RLS restricts each regional manager to their own region's rows, enforced consistently whether accessed via Power BI, the Warehouse, or direct Spark queries.

**Capacity.** A reserved F128 capacity hosts production workloads, sized using the Capacity Metrics app after an initial three-month pay-as-you-go observation period, with a separate, smaller capacity isolating development and test workspaces.

This composite pattern — Eventstream/Data Factory ingestion, Spark-based medallion transformation, Warehouse for governed finance serving, Direct Lake for near-real-time dashboards, Purview-backed governance, and explicit capacity tiering — recurs across most mature enterprise Fabric deployments regardless of industry vertical.

📌 *Enterprise Reference Architecture Diagram — full retail analytics platform on Microsoft Fabric*

---

## 22. Decision Frameworks

**Framework 1 — Lakehouse vs. Warehouse.** Covered in full in Section 8: choose based on team skillset (Spark/Python vs. T-SQL), DML requirements, and data structure variability.

**Framework 2 — Import vs. DirectQuery vs. Direct Lake.** Choose Import when some staleness is acceptable and data volume is moderate; choose DirectQuery when freshness matters more than raw query speed and data lives outside OneLake or exceeds Direct Lake guardrails; choose Direct Lake when data is Fabric-native, volume fits within your SKU's guardrails, and you need both speed and freshness simultaneously.

**Framework 3 — Native storage vs. Shortcut.** Use native OneLake storage for newly created data, especially anything feeding Direct Lake (to benefit from V-Order). Use Shortcuts for integrating existing external data (other clouds, other Fabric workspaces) without duplicating storage or rebuilding pipelines that already work.

**Framework 4 — Capacity sizing.** Start with the Fabric Capacity Estimator and a pay-as-you-go pilot capacity; observe real consumption via the Capacity Metrics app for at least one full business cycle; commit to reserved pricing for the validated baseline once consumption patterns stabilize; explicitly model the F64 license break-even against your actual Power BI viewer count.

**Framework 5 — Build vs. migrate incrementally.** For greenfield platforms, build Bronze/Silver/Gold natively in OneLake from day one. For brownfield migrations from Synapse or other Azure services, Shortcut existing storage first, re-platform pipelines and Spark workloads second, and migrate SQL-pool-based warehousing last, validating each stage in parallel with the legacy system before cutover.

📌 *Decision Matrix — choosing storage mode, engine, and capacity tier by workload characteristics*

---

## 23. Certification Paths: DP-600, DP-700, DP-800, PL-300

Microsoft's data certification ladder around Fabric has grown into four distinct, persona-aligned exams. Picking the right one — or the right sequence — depends on which side of the platform you actually work on day to day.

| Exam | Official Name | Target Persona | Core Technologies |
|---|---|---|---|
| PL-300 | Microsoft Power BI Data Analyst Associate | BI Analysts, report authors | Power BI Desktop, DAX, data modeling, basic Fabric awareness |
| DP-600 | Microsoft Fabric Analytics Engineer Associate | Analytics Engineers, BI Developers | Semantic modeling, DAX, Lakehouse/Warehouse fundamentals, Direct Lake, governance |
| DP-700 | Microsoft Fabric Data Engineer Associate | Data Engineers | Spark, Lakehouse, Data Factory pipelines, Real-Time Intelligence, orchestration |
| DP-800 | Microsoft Certified: SQL AI Developer Associate (Developing AI-Enabled Database Solutions) | SQL Developers, AI/Database Engineers | T-SQL, Azure SQL, SQL databases in Fabric, vector search, embeddings, RAG patterns |

**PL-300 — Power BI Data Analyst Associate.** The entry point for most BI careers, focused on Power BI Desktop, data modeling, DAX fundamentals, and visualization design, with growing awareness of how Power BI now sits inside the broader Fabric platform rather than standing alone.

**DP-600 — Fabric Analytics Engineer Associate.** Squarely the certification this article maps to most closely. Likely exam objectives include designing and implementing semantic models, working with Lakehouse and Warehouse items, implementing Direct Lake, applying RLS/OLS, and lifecycle management via Git and deployment pipelines. Study recommendation: hands-on practice building a full medallion pipeline feeding a Direct Lake semantic model is more valuable than memorizing feature lists. (Read our [DP-600 Study Guide](https://dattasable.com/blog/dp-600-study-guide-2026) for a structured prep plan.)

**DP-700 — Fabric Data Engineer Associate.** Heavier on Spark notebooks, pipeline orchestration, Real-Time Intelligence, and operational concerns like monitoring and CI/CD for engineering artifacts. Study recommendation: build and troubleshoot an actual Eventstream-to-Eventhouse pipeline and a parameterized Data Factory pipeline before sitting the exam — scenario questions reward hands-on familiarity over textbook knowledge. (See our [DP-700 Study Guide](https://dattasable.com/blog/dp-700-study-guide-2026).)

**DP-800 — SQL AI Developer Associate.** Worth being precise about: unlike DP-600 and DP-700, which are entirely Fabric-scoped, DP-800 spans Microsoft's broader SQL platform family — SQL Server, Azure SQL Database, and SQL databases in Microsoft Fabric — with a primary focus on embedding AI capability (vector search, semantic indexing, Retrieval-Augmented Generation patterns) directly into T-SQL solutions rather than Fabric Warehouse administration specifically. It's the right next step for Warehouse-focused professionals whose roadmap is heading toward AI-enabled SQL development rather than pure BI serving. (See our [DP-800 Study Guide](https://dattasable.com/blog/dp-800-study-guide).)

**Choosing your path.** If your work is closer to semantic modeling, DAX, and BI delivery, start with DP-600. If your work is closer to pipelines, Spark, and orchestration, start with DP-700. If you're a T-SQL developer moving toward AI-enabled database features, DP-800 is the more relevant next credential. For a full side-by-side breakdown with study-time estimates and role mapping, see our [DP-600 vs DP-700 vs DP-800 comparison](https://dattasable.com/blog/dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison), and use the [Microsoft Fabric Certification Roadmap 2026](https://dattasable.com/blog/microsoft-fabric-certification-roadmap-2026) to sequence multiple certifications if your role spans more than one persona.

| Cert Mapping by Concept | DP-600 | DP-700 | DP-800 | PL-300 |
|---|---|---|---|---|
| OneLake & Shortcuts | ✔ | ✔ | Partial | — |
| Lakehouse / Spark | ✔ | ✔✔ | — | — |
| Warehouse / T-SQL | ✔✔ | Partial | ✔ (AI-extended) | — |
| Direct Lake | ✔✔ | Partial | — | Partial |
| Data Factory pipelines | Partial | ✔✔ | — | — |
| Real-Time Intelligence | Partial | ✔✔ | — | — |
| RLS / OLS / Governance | ✔✔ | Partial | Partial | Partial |
| Vector search / RAG / embeddings | — | — | ✔✔ | — |
| DAX / semantic modeling | ✔✔ | — | — | ✔✔ |

📌 *Certification Mapping Table — exam-to-skill alignment across DP-600, DP-700, DP-800, and PL-300*

---

## 24. Career Roadmap

Fabric architecture knowledge maps onto several distinct, increasingly well-defined career tracks rather than one generic "Fabric developer" role:

- **Analytics Engineer** — owns semantic models, Direct Lake performance, and the bridge between governed data and business-facing reporting. DP-600-aligned.
- **Data Engineer** — owns ingestion pipelines, Spark transformation, medallion architecture, and Real-Time Intelligence. DP-700-aligned.
- **BI Developer** — focused primarily on Power BI report and dashboard delivery, often the entry point before specializing into Analytics Engineering. PL-300-aligned, growing into DP-600.
- **AI/SQL Developer** — embeds AI capability directly into SQL-based solutions, increasingly relevant as vector search and RAG patterns move into mainstream database development. DP-800-aligned.
- **Solution/Enterprise Architect** — owns capacity strategy, governance design, and migration planning across the entire platform, drawing on all of the above domains rather than specializing in one workload.

These roles aren't strictly hierarchical — a BI Developer can move directly into either Analytics Engineering or specialize further into AI/SQL development depending on interest, and most mature Fabric teams have at least one person whose role spans Data Engineering and Analytics Engineering rather than treating them as fully separate functions. For a detailed breakdown of how these roles interact day to day, including typical reporting lines and how responsibilities shift as a Fabric platform matures from pilot to enterprise scale, see our full [Microsoft Fabric Career Roadmap](https://dattasable.com/blog/microsoft-fabric-career-roadmap-2026).

---

## 25. Interview Questions (20+)

**1. What problem does OneLake solve that a traditional data lake plus separate warehouse architecture doesn't?**
OneLake eliminates the need to maintain separate physical copies of data for the lake and the warehouse — every Fabric engine reads the same Delta Parquet files, removing an entire category of sync jobs and "which copy is correct" governance debates.

**2. Explain the difference between a OneLake Shortcut and a native OneLake table.**
A native table is physically stored in OneLake and eligible for V-Order optimization. A Shortcut is a virtual pointer to data stored elsewhere — internally in another workspace or externally in ADLS, S3, or Dataverse — with zero data duplication and zero additional storage cost for the referenced bytes.

**3. When would you choose a Fabric Warehouse over a Lakehouse?**
When the team needs full T-SQL DML (INSERT/UPDATE/DELETE), is staffed by SQL Server-trained developers, or is migrating an existing stored-procedure-based ETL codebase with minimal rewrite.

**4. How does Direct Lake achieve Import-like speed without a refresh job?**
The VertiPaq engine maps Delta Parquet columns directly from OneLake into memory on query, rather than running a scheduled copy-and-load refresh — giving import-speed reads against data that's as current as the underlying Delta table.

**5. What happens when a Direct Lake model encounters an unsupported DAX construct?**
It silently falls back to DirectQuery mode for that query, which is significantly slower — and because the fallback is silent, teams need active monitoring to catch it rather than assuming Direct Lake is always engaged.

**6. What is a Capacity Unit, and why does it matter that compute is shared across workloads?**
A CU is Microsoft's normalized measure of compute (CPU, memory, I/O) consumed per second. Because every workload — Spark, T-SQL, Power BI, KQL — draws from the same capacity pool, a heavy job in one workload can degrade performance for every other workload sharing that capacity, making cross-workload capacity monitoring essential.

**7. Explain the F64 licensing threshold and why it matters for capacity planning.**
Below F64, every Power BI viewer needs an individual Pro or PPU license; at F64 and above, viewers with a free license can consume content at no per-user cost, while creators still need Pro/PPU. Organizations with roughly 250+ viewers typically find F64 cheaper in aggregate once license costs are netted out.

**8. What's the difference between RLS and OLS?**
RLS restricts which rows a user can see within a table (filtering data); OLS restricts which entire tables or columns a user can see at all (hiding structure), commonly used to hide sensitive columns like salary regardless of row filtering.

**9. Why might Row-Level Security defined in a Power BI semantic model fail to protect the same data when queried via Spark?**
RLS defined inside a semantic model only applies to queries against that specific model — it doesn't automatically extend to direct Spark or SQL queries against the underlying OneLake table, which need their own security configuration to enforce the same boundary.

**10. Describe the medallion architecture pattern and why skipping the Bronze layer is risky.**
Bronze holds raw, minimally transformed data; Silver holds cleaned and conformed data; Gold holds business-ready, aggregated data. Skipping Bronze and transforming directly from source destroys the ability to reprocess history when business logic changes, since the original raw state is never preserved.

**11. What is V-Order, and when does it matter most?**
V-Order is a write-time Parquet sorting and encoding optimization that improves downstream read performance for Power BI and SQL engines. It matters most on Gold-layer tables feeding Direct Lake or heavily-queried Warehouse tables.

**12. A pipeline succeeds every night but capacity costs keep climbing. What would you investigate?**
Check the Capacity Metrics app for CU consumption trends by workload — a "succeeding" pipeline can still be the most expensive item in a workspace if its Dataflow Gen2 transformations or Spark pool sizing are inefficient, independent of whether it technically completes successfully.

**13. How would you design ingestion for 40 similar source tables without building 40 separate pipelines?**
Build one parameterized, metadata-driven pipeline using a control table and a ForEach activity to iterate over table definitions, centralizing logic and logging instead of duplicating pipeline objects.

**14. What's the architectural reason Fabric is delivered as SaaS rather than requiring cluster provisioning?**
Removing infrastructure provisioning (Spark cluster sizing, storage account configuration) lowers time-to-value and operational overhead, letting Microsoft manage the compute fabric while customers focus on capacity sizing and workspace organization instead of infrastructure management.

**15. Explain how Shortcuts support a phased Synapse-to-Fabric migration.**
Shortcuts let Fabric workspaces read existing Azure Data Lake Storage Gen2 data immediately without a risky big-bang migration, decoupling the storage migration timeline from the compute and BI re-platforming timeline.

**16. What governance risk does Purview lineage tracking specifically mitigate?**
It lets compliance teams trace any number on a dashboard back to its originating source system, satisfying audit requirements without manual documentation — and it surfaces undocumented downstream dependencies before an architecture change breaks them.

**17. Why is KQL a different skill investment than T-SQL for a SQL-background team adopting Real-Time Intelligence?**
KQL is optimized for time-series, append-heavy query patterns and uses different syntax and conceptual models than set-based T-SQL, requiring genuine training investment rather than assuming SQL fluency transfers directly.

**18. Describe a scenario where DirectQuery is the correct semantic model choice over Direct Lake.**
When data lives outside OneLake (a live operational database that must stay the source of truth) or exceeds Direct Lake's capacity-SKU guardrails, DirectQuery's ability to query the source directly — at the cost of slower performance — is the correct trade-off.

**19. How do you prevent a development workload from degrading production query performance in Fabric?**
Assign development/test workspaces to a separate capacity from production, so a runaway notebook or query in dev cannot consume the CU pool that production reports and pipelines depend on.

**20. What's the practical difference between DP-600, DP-700, and DP-800 for someone deciding which to study first?**
DP-600 targets analytics engineers and BI developers (semantic modeling, Direct Lake, governance); DP-700 targets data engineers (Spark, pipelines, Real-Time Intelligence); DP-800 targets SQL/AI developers building vector search and RAG capability into T-SQL across SQL Server, Azure SQL, and Fabric SQL databases — the right starting point depends on which workload the candidate's actual day-to-day work centers on.

**21. (Scenario) A retail client wants near-real-time sales dashboards but is currently on a 90-minute nightly Import refresh. What would you propose?**
Re-architect the semantic model onto Direct Lake against Gold-layer Lakehouse tables, eliminating the scheduled refresh entirely while validating that DAX measures stay within Direct Lake's supported feature set to avoid silent DirectQuery fallback.

**22. (Troubleshooting) Capacity Metrics shows a sudden spike in Spark consumption with no corresponding increase in data volume. What would you check?**
Review recent notebook or pipeline changes for inefficient transformations (excessive shuffles, missing partition pruning, accidental full-table scans), and check Spark pool sizing defaults that may have been left oversized relative to the actual workload.

**23. (Best practice) How would you structure workspaces for a multi-team enterprise Fabric rollout?**
Organize workspaces by business domain or function rather than purely by technical layer, assign each to an appropriately sized capacity, use Git-backed deployment pipelines for Dev/Test/Prod promotion, and isolate development capacity from production to prevent cross-contamination of compute and untested changes.

---

## 26. Frequently Asked Questions

**1. What is Microsoft Fabric in simple terms?**
Microsoft Fabric is a single SaaS platform that combines data engineering, data warehousing, real-time analytics, data science, and Power BI under one shared storage layer called OneLake. Instead of licensing and securing separate Azure services for each of those functions, an organization buys one capacity and every workload draws from the same compute pool and reads the same physical data.

**2. Is Microsoft Fabric the same as Power BI?**
No. Power BI is one of seven workloads inside Fabric, focused on visualization and semantic modeling. Fabric also includes Data Factory, Lakehouse, Warehouse, Real-Time Intelligence, and Data Science workloads that have nothing to do with report visualization, all sharing the same OneLake storage and capacity.

**3. What is OneLake and how is it different from Azure Data Lake Storage?**
OneLake is the single, tenant-wide logical data lake built into Fabric — every Fabric item stores its data there automatically. Azure Data Lake Storage Gen2 is the underlying infrastructure technology OneLake is built on, but with ADLS you provision and manage storage accounts yourself, whereas OneLake is fully managed and automatically provisioned per tenant, with Shortcuts available to reference existing ADLS data without copying it.

**4. What is a Fabric Shortcut?**
A Shortcut is a virtual pointer that makes data stored elsewhere — another workspace, an external Azure Data Lake Storage Gen2 account, an Amazon S3 bucket, or Dataverse — appear inside OneLake without physically copying it. Any Fabric engine can query through a Shortcut as if the data were natively stored there, with no duplicate storage cost for the referenced bytes.

**5. What is Direct Lake mode in Power BI?**
Direct Lake is a Fabric-exclusive semantic model storage mode where the VertiPaq engine reads Delta Parquet files directly from OneLake into memory, without a scheduled import refresh and without pushing every query back to a source system. It combines Import-mode query speed with near-real-time data freshness, though it can silently fall back to DirectQuery for unsupported DAX or oversized tables.

**6. Should I use a Lakehouse or a Warehouse in Fabric?**
Choose a Lakehouse if your team works primarily in Spark/Python and your data is semi-structured or highly variable in shape. Choose a Warehouse if your team needs full T-SQL DML support, is staffed by SQL Server-trained developers, or is migrating an existing stored-procedure-based codebase. Many enterprise architectures use both together rather than picking one exclusively.

**7. What are Capacity Units in Microsoft Fabric?**
Capacity Units, or CUs, are Microsoft's normalized measure of compute — covering CPU, memory, and I/O — consumed by every operation across every Fabric workload. You purchase a fixed CU allocation as an F-SKU (F2 through F2048), and that allocation is shared across Power BI, Spark, SQL, KQL, and ML workloads running on that capacity.

**8. What is the F64 threshold and why does it matter?**
F64 is the capacity tier at which Power BI viewers with only a free license can consume published content without needing an individual Pro or Premium-Per-User license — content creators still need Pro/PPU regardless of SKU. Organizations with roughly 250 or more active viewers typically find F64's capacity cost is offset by the eliminated per-viewer licensing, making it a natural economic break-even point.

**9. How much does Microsoft Fabric cost?**
Fabric cost has two main components: capacity (the F-SKU, billed either pay-as-you-go or at a discounted reserved rate) and OneLake storage (billed separately at rates comparable to standard Azure Data Lake Storage). Total cost depends heavily on SKU size, reserved versus pay-as-you-go terms, and whether your organization crosses the F64 free-viewer threshold — using the official Fabric Capacity Estimator against your actual workload patterns is the most reliable way to project cost.

**10. Is Microsoft Fabric replacing Azure Synapse Analytics?**
Fabric consolidates the capabilities that Synapse Analytics, Azure Data Factory, and Power BI Premium previously provided separately into one SaaS platform. Microsoft continues to support existing Synapse workloads, but new analytics platform investment is increasingly directed toward Fabric, and most organizations on Synapse are actively evaluating or executing a migration path.

**11. What is the medallion architecture in Microsoft Fabric?**
Medallion architecture organizes data into three progressively refined layers: Bronze (raw, minimally transformed), Silver (cleaned and conformed), and Gold (business-ready, aggregated). It's a data-organization pattern rather than a Fabric-specific feature, but it maps cleanly onto Fabric Lakehouse tables and is the most common structure underlying production Fabric pipelines.

**12. What is row-level security (RLS) in Fabric, and where is it enforced?**
RLS restricts which rows a given user can see within a table, most commonly defined using DAX filter expressions inside a Power BI semantic model, though it can also be enforced at the Warehouse level using T-SQL security policies. Importantly, RLS defined only inside a semantic model does not automatically extend to direct Spark or SQL queries against the same underlying table — those access paths need their own security configuration to enforce an equivalent boundary.

**13. What's the difference between row-level security and object-level security?**
Row-level security filters which rows within a table a user can see, while object-level security restricts visibility of entire tables or specific columns regardless of row content. OLS is typically used to hide sensitive columns like salary or social security numbers from roles that should never see them at all, independent of any row-level filtering.

**14. Does Microsoft Fabric support real-time data?**
Yes, through the Real-Time Intelligence workload, which includes Eventstream for ingesting streaming sources, Eventhouse for storing time-series and log-style data, and KQL Databases for querying it — with Data Activator available to trigger automated alerts based on streaming conditions, all with latency measured in seconds rather than the hours typical of batch pipelines.

**15. What is Microsoft Purview's role in Fabric governance?**
Purview integrates with a Fabric tenant to automatically catalog items, trace data lineage from source connectors through pipelines and Lakehouses to final reports, and apply sensitivity labels that persist as data moves across workloads. It turns governance from a manually-documented exercise into something an auditor can trace directly through the platform's own metadata.

**16. Can I use Microsoft Fabric with data stored in AWS or Google Cloud?**
Yes, through Shortcuts, which can reference data in Amazon S3 and other external object storage without copying it into OneLake. Performance for cross-cloud Shortcuts is generally strongest for lower-frequency analytical queries rather than sub-second, high-concurrency serving, due to the added network and latency considerations of cross-cloud access.

**17. What certification should I pursue if I want to work with Microsoft Fabric?**
It depends on your role. Power BI-focused analysts typically start with PL-300; analytics engineers and BI developers working with semantic modeling and Direct Lake should target DP-600; data engineers working with Spark, pipelines, and Real-Time Intelligence should target DP-700; and SQL developers moving toward AI-enabled database features (vector search, RAG) should look at DP-800, which spans the broader Microsoft SQL platform family rather than being Fabric-exclusive.

**18. Is DP-800 a Fabric-specific certification?**
Not exclusively. DP-800, officially the SQL AI Developer Associate certification covering "Developing AI-Enabled Database Solutions," spans SQL Server, Azure SQL Database, and SQL databases in Microsoft Fabric, with a primary focus on embedding AI capabilities — vector search, semantic indexing, Retrieval-Augmented Generation — directly into T-SQL solutions, rather than testing Fabric Warehouse administration specifically.

**19. What is V-Order and why does it matter for performance?**
V-Order is a write-time optimization applied to Delta Parquet files that sorts and encodes data to improve downstream read performance for both Spark and Direct Lake queries, alongside improved compression that reduces storage footprint. Applying it consistently to Gold-layer tables feeding reporting workloads is considered a baseline best practice rather than an advanced tuning technique.

**20. How do I migrate from Azure Synapse Analytics to Microsoft Fabric?**
Most successful migrations are incremental rather than all-at-once: Shortcut existing Azure Data Lake Storage data into Fabric workspaces first to decouple the storage timeline from re-platforming, migrate Data Factory pipelines and Spark notebooks next (since both port with relatively direct translation), and migrate dedicated SQL pool schemas into a Fabric Warehouse last, validating in parallel with the legacy system before fully decommissioning it.

**21. What happens if I exceed my Fabric capacity's Direct Lake table size guardrails?**
Behavior depends on the specific guardrail and configuration: on standard Direct Lake, exceeding certain table-size limits triggers an automatic fallback to DirectQuery for affected queries, while on Direct Lake on OneLake specifically, exceeding guardrails can cause queries to fail outright rather than gracefully falling back. This makes active table-size monitoring against your SKU's documented guardrails a genuinely operational, not optional, practice as data volume grows.

**22. Can different teams in the same organization use different Fabric capacities?**
Yes, and it's a recommended practice for larger organizations — different workspaces can be assigned to different capacities, allowing teams to isolate development from production, allocate cost by department, and prevent one team's heavy workload from degrading performance for another team sharing what would otherwise be a single shared capacity pool.

**23. Does Microsoft Fabric require Power BI Premium licensing?**
No — Fabric capacities (F-SKUs) have replaced Power BI Premium per-capacity (P-SKUs) as Microsoft's primary capacity licensing model, with Microsoft gradually retiring P-SKUs in favor of F-SKUs. Existing Premium customers are expected to transition to Fabric capacity subscriptions, which include all the BI capability Premium offered plus the additional six Fabric workloads.

---

## 27. Summary, Key Takeaways, and Next Steps

### Summary

Microsoft Fabric's architecture is best understood as the consequence of two decisions: one logical copy of data in OneLake, and one shared pool of Capacity Units paying for every workload built on top of it. Once those two ideas are solid, everything else — Shortcuts, Direct Lake, workspace-level security, consolidated billing — follows as a predictable design choice rather than an arbitrary feature. The platform succeeds when teams respect the trade-offs that come with that consolidation: choosing Lakehouse versus Warehouse deliberately rather than by habit, enforcing governance at the data layer rather than only inside Power BI, sizing capacity based on measured consumption rather than a one-time guess, and migrating incrementally rather than attempting a single risky cutover.

### Key Takeaways

- OneLake is the single logical data lake for the entire tenant; Shortcuts let you reference external or internal data without duplicating it.
- Direct Lake combines Import-speed performance with near-real-time freshness, but silently falls back to DirectQuery when it hits unsupported constructs or capacity guardrails — monitor it actively.
- Lakehouse and Warehouse are complementary, not interchangeable; the right choice depends on team skillset, DML needs, and data structure.
- Capacity Units are shared across every workload on a capacity, making the F64 license threshold and ongoing Capacity Metrics monitoring central to both performance and cost management.
- Governance — RLS, OLS, RBAC, and Purview lineage — must be enforced at the data layer, not only inside the BI tool, to hold consistently across every access path.
- Migration from Synapse or other legacy stacks succeeds most reliably when phased: Shortcuts first, pipelines and Spark second, SQL warehousing last.
- DP-600, DP-700, and DP-800 map to distinct personas — Analytics Engineer, Data Engineer, and SQL/AI Developer respectively — and DP-800 is broader than Fabric alone.

### Architecture Checklist

- [ ] OneLake Shortcut strategy defined for any existing external or cross-workspace data before duplicating storage
- [ ] Medallion (Bronze/Silver/Gold) structure defined and documented for every major data domain
- [ ] Lakehouse vs. Warehouse decision explicitly made and justified per workload, not defaulted by habit
- [ ] V-Order and OPTIMIZE/VACUUM maintenance scheduled for Gold-layer Delta tables
- [ ] Direct Lake DAX constructs validated against the supported feature set; fallback rate monitored
- [ ] RLS/OLS rules verified consistent across Power BI, Warehouse, and direct Spark/SQL access paths
- [ ] Purview lineage and sensitivity labeling enabled and reviewed as part of any architecture change
- [ ] Capacity sized using the Fabric Capacity Estimator and validated against real Capacity Metrics data
- [ ] Development/test workspaces isolated onto a separate capacity from production
- [ ] Git integration and deployment pipelines configured for any item touching production data
- [ ] Disaster recovery plan defined explicitly for business-critical Gold-layer tables, not assumed from SaaS availability alone

### Decision Matrix

| If your priority is… | …choose |
|---|---|
| Fastest query speed against stable, moderate-volume data | Import mode |
| Real-time freshness against very large or external data | DirectQuery |
| Speed and freshness together, on Fabric-native data | Direct Lake |
| Spark/Python-first transformation on varied data shapes | Lakehouse |
| Full T-SQL DML and stored-procedure-based logic | Warehouse |
| Integrating existing external storage with zero duplication | OneLake Shortcut |
| Free Power BI viewing at scale (250+ viewers) | F64+ capacity |
| Streaming/IoT analytics under seconds of latency | Eventstream + Eventhouse |

### Learning Path

1. Build a foundational mental model: OneLake, capacities, and workspaces (this guide).
2. Build a hands-on medallion pipeline: Bronze ingestion → Silver transformation → Gold serving.
3. Build a Direct Lake semantic model against your Gold layer and deliberately test its DirectQuery fallback behavior.
4. Implement RLS/OLS and verify it holds across Power BI, Warehouse, and direct query access.
5. Size and monitor capacity using the Fabric Capacity Estimator and Capacity Metrics app over a full business cycle.
6. Choose and pursue the certification aligned to your role — PL-300, DP-600, DP-700, or DP-800.

### Next Steps

If you're formalizing a study plan, start with the [Microsoft Fabric Certification Roadmap 2026](https://dattasable.com/blog/microsoft-fabric-certification-roadmap-2026) to sequence your exams, and use the [Microsoft Fabric Career Roadmap](https://dattasable.com/blog/microsoft-fabric-career-roadmap-2026) to confirm which persona — Analytics Engineer, Data Engineer, BI Developer, or AI Developer — best matches where you want your Fabric career to go next.

---

### Continue Learning

- [Microsoft Fabric Certification Roadmap 2026](https://dattasable.com/blog/microsoft-fabric-certification-roadmap-2026)
- [Microsoft Fabric Career Roadmap 2026](https://dattasable.com/blog/microsoft-fabric-career-roadmap-2026)
- [Microsoft Fabric Medallion Architecture Guide](https://dattasable.com/blog/microsoft-fabric-medallion-architecture-guide)
- [Power BI Direct Lake Performance Tuning](https://dattasable.com/blog/power-bi-direct-lake-performance-tuning-fabric)
- [DP-600 Study Guide 2026](https://dattasable.com/blog/dp-600-study-guide-2026)
- [DP-700 Study Guide 2026](https://dattasable.com/blog/dp-700-study-guide-2026)
- [DP-800 Study Guide](https://dattasable.com/blog/dp-800-study-guide)
- [DP-600 vs DP-700 vs DP-800 Comparison](https://dattasable.com/blog/dp-600-vs-dp-700-vs-dp-800-microsoft-fabric-certification-comparison)
- [Microsoft Fabric Architectural Guide](https://dattasable.com/blog/microsoft-fabric-architectural-guide)
- [Power BI & Microsoft Fabric Integration 2026](https://dattasable.com/blog/power-bi-fabric-integration-2026)

---

*External references for further reading: [Microsoft Learn — Microsoft Fabric documentation](https://learn.microsoft.com/en-us/fabric/), [Microsoft Fabric capacity and SKU licensing](https://learn.microsoft.com/en-us/fabric/enterprise/licenses), [Delta Lake project documentation](https://delta.io/), [Apache Spark documentation](https://spark.apache.org/docs/latest/), [Apache Parquet format documentation](https://parquet.apache.org/), and [SQLBI](https://www.sqlbi.com/) for advanced DAX and semantic modeling guidance.*
