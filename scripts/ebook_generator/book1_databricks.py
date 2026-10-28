# scripts/ebook_generator/book1_databricks.py

BOOK_DATABRICKS = {
    "slug": "azure-databricks-pyspark-lakehouse-2026",
    "sku": "DS-EBOOK-ADB-SPK-2026",
    "title": "Azure Databricks & PySpark Lakehouse Engineering",
    "cover_title_formatted": "Azure Databricks & <span>PySpark Lakehouse</span> Engineering",
    "subtitle": "The definitive production manual for designing high-throughput Delta Lake architectures, Unity Catalog governance, Auto Loader ingestion pipelines, and multi-node PySpark tuning.",
    "category_name": "Data Engineering & Lakehouse",
    "category_slug": "data-engineering-lakehouse",
    "all_category_slugs": ["data-engineering-lakehouse", "python-automation", "data-analytics-bi"],
    "features": ["22-page PDF", "2026 Edition", "Production PySpark & Delta 3.0 Blueprints"],
    "included_resources": ["22-page PDF handbook"],
    "seo_title": "Azure Databricks & PySpark Lakehouse Engineering | 2026 Edition",
    "seo_desc": "22-page Azure Databricks and PySpark Lakehouse architecture handbook by Datta Sable. Production Delta Lake 3.0, Unity Catalog, and tuning blueprints.",
    "pages": [
        # PAGE 2: Table of Contents & Architecture Blueprint
        {
            "badge": "Architecture Blueprint",
            "h1": "Table of Contents & Lakehouse Blueprint",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">EXECUTIVE OVERVIEW</span>
              This production manual establishes an end-to-end engineering standard for operating Azure Databricks at enterprise scale. From multi-format ingestion with Auto Loader to ACID transactions in Delta Lake 3.0 and Unity Catalog governance, every chapter addresses real-world reliability, performance, and FinOps constraints.
            </div>
            
            <div class="diagram-box">
+------------------+     +-------------------+     +------------------+
| Streaming / Logs | --> |  BRONZE LAYER     | --> |  SILVER LAYER    |
| IoT / REST APIs  |     |  Raw Append-Only  |     |  Cleansed & CDC  |
+------------------+     |  (Parquet/JSON)   |     |  (Delta Tables)  |
                         +-------------------+     +------------------+
+------------------+               |                          |
| Relational RDBMS | --------------+                          v
| ERP / CRM Dumps  |                               +------------------+
+------------------+                               |   GOLD LAYER     |
                                                   |  Aggregated Star |
                                                   |  Schema / Marts  |
                                                   +------------------+
            </div>

            <h2>Comprehensive Chapter Guide</h2>
            <div class="grid-2">
              <div class="grid-card">
                <h3>Part I: Storage & Ingestion</h3>
                <p>• Ch 3: Delta Lake 3.0 & ACID Internals<br>
                • Ch 4: Workspace Topology & Serverless<br>
                • Ch 5: PySpark Catalyst & Tungsten<br>
                • Ch 6: Auto Loader & Cloud Files<br>
                • Ch 7: Bronze Ingestion Architecture</p>
              </div>
              <div class="grid-card">
                <h3>Part II: Processing & Governance</h3>
                <p>• Ch 8: Silver Tier & Delta MERGE (CDC)<br>
                • Ch 9: Gold Star Schemas & Aggregations<br>
                • Ch 10: OPTIMIZE, Z-ORDER & Liquid<br>
                • Ch 11: Shuffle Skew & Broadcast Joins<br>
                • Ch 12: Delta Live Tables (DLT) Gates</p>
              </div>
            </div>
            <p><strong>Part III: Enterprise Operations:</strong> Ch 13 Unity Catalog, Ch 14 Databricks SQL Warehouses, Ch 15 Workflows & DAGs, Ch 16 Asset Bundles (DABs), Ch 17 Zero-Trust VNet Security, Ch 18 FinOps & Cost Controls, Ch 19 Fraud Streaming Case Study, Ch 20 Memory & Spill Troubleshooting, Ch 21 PySpark Syntax Sheet, Ch 22 Production Audit Checklist.</p>
            """
        },
        # PAGE 3: Delta Lake 3.0 & ACID Internals
        {
            "badge": "Chapter 01",
            "h1": "Delta Lake 3.0 & Transaction Log Internals",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">STORAGE INTERNALS</span>
              Delta Lake achieves ACID guarantees on top of commodity cloud object storage (ADLS Gen2) by coupling immutable Parquet data files with an ordered, atomic transaction log directory named <code>_delta_log</code>.
            </div>
            <p>Every write operation (INSERT, UPDATE, DELETE, MERGE) generates an atomic JSON commit file (e.g., <code>000000.json</code>) recording file additions and deletions. Every 10 commits, Delta collapses the log into a compacted checkpoint file (<code>.checkpoint.parquet</code>), preventing driver memory exhaustion during metadata state reconstruction.</p>
            
            <div class="code-box">
              <div class="code-header"><span>delta_acid_internals.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">from</span> delta.tables <span class="code-keyword">import</span> DeltaTable

<span class="code-comment"># Inspect transaction history and physical file commitments</span>
deltaTable = DeltaTable.<span class="code-func">forPath</span>(spark, <span class="code-str">"abfss://silver@datalake.dfs.core.windows.net/orders"</span>)
history_df = deltaTable.<span class="code-func">history</span>(<span class="code-keyword">10</span>)
history_df.<span class="code-func">select</span>(<span class="code-str">"version"</span>, <span class="code-str">"timestamp"</span>, <span class="code-str">"operation"</span>, <span class="code-str">"operationMetrics"</span>).<span class="code-func">show</span>(truncate=<span class="code-keyword">False</span>)

<span class="code-comment"># Time travel query accessing point-in-time snapshot</span>
df_historical = spark.read.<span class="code-func">format</span>(<span class="code-str">"delta"</span>) \\
    .<span class="code-func">option</span>(<span class="code-str">"versionAsOf"</span>, <span class="code-keyword">14</span>) \\
    .<span class="code-func">load</span>(<span class="code-str">"abfss://silver@datalake.dfs.core.windows.net/orders"</span>)</div>
            </div>

            <h2>UniForm (Universal Format) in Delta 3.0</h2>
            <p>Delta 3.0 introduces UniForm, allowing Delta tables to automatically generate Iceberg and Hudi metadata on write without duplicating physical Parquet files. This eliminates vendor lock-in and enables cross-engine querying from Snowflake, BigQuery, and Trino directly against your ADLS Gen2 storage.</p>
            <div class="callout callout-tip">
              <span class="callout-title">PRODUCTION RECOMMENDATION</span>
              Always configure <code>spark.databricks.delta.stalenessLimit</code> for long-running streaming clusters to avoid excessive re-reading of the Delta log when hundreds of small commits occur hourly.
            </div>
            """
        },
        # PAGE 4: Workspace Topology & Serverless Compute
        {
            "badge": "Chapter 02",
            "h1": "Workspace Topology & Serverless Compute",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">INFRASTRUCTURE ARCHITECTURE</span>
              Designing an enterprise Azure Databricks topology requires balancing workload isolation, blast radius confinement, and compute utilization across Development, Staging, and Production environments.
            </div>
            <p>Best practice dictates deploying separate workspaces per lifecycle stage within dedicated Azure subscriptions. Serverless compute decouples cluster management from Azure subscription quotas, launching instant worker pools managed directly by the Databricks control plane.</p>

            <table class="table-box">
              <tr>
                <th>Compute Model</th>
                <th>Startup Latency</th>
                <th>Best Workload Fit</th>
                <th>Cost Profile</th>
              </tr>
              <tr>
                <td>Classic All-Purpose</td>
                <td>3 – 5 minutes</td>
                <td>Interactive Data Science, Ad-hoc EDA</td>
                <td>High (Idle charges apply)</td>
              </tr>
              <tr>
                <td>Classic Job Compute</td>
                <td>2 – 4 minutes</td>
                <td>Automated Scheduled Batch Workflows</td>
                <td>Medium (Auto-terminates)</td>
              </tr>
              <tr>
                <td>Serverless Jobs</td>
                <td>&lt; 15 seconds</td>
                <td>Short-duration, event-driven pipelines</td>
                <td>Optimal (Per-second billing)</td>
              </tr>
              <tr>
                <td>Serverless SQL</td>
                <td>&lt; 5 seconds</td>
                <td>Power BI DirectQuery, Tableau, Ad-hoc SQL</td>
                <td>Dynamic auto-scaling</td>
              </tr>
            </table>

            <h2>Cluster Policy Enforcement</h2>
            <p>Without strict cluster policies, developers frequently spin up oversized multi-node GPU or high-memory instances that run continuously. A production cluster policy enforces maximum worker bounds, auto-termination limits (15 minutes), and spot instance quotas.</p>
            <div class="callout callout-warn">
              <span class="callout-title">COST CONTROL ALERT</span>
              Never allow developers to launch All-Purpose clusters with 'None' for auto-termination. Enforce mandatory tags (<code>Environment</code>, <code>CostCenter</code>, <code>Owner</code>) in all policies to support automated FinOps chargebacks.
            </div>
            """
        },
        # PAGE 5: PySpark Catalyst & Tungsten Engine
        {
            "badge": "Chapter 03",
            "h1": "PySpark Internals: Catalyst & Tungsten",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">EXECUTION ENGINE INTERNALS</span>
              Writing performant PySpark code demands understanding how Catalyst translates Python DataFrame API calls into optimized bytecode executed natively across JVM workers by Project Tungsten.
            </div>
            <p>Catalyst passes every query through four distinct stages: Analysis (resolving column names against Catalog), Logical Optimization (predicate pushdown, projection pruning), Physical Planning (join selection), and Whole-Stage Code Generation (compiling operators into single Java bytecode loops).</p>

            <div class="diagram-box">
+--------------------+      +--------------------+      +--------------------+
|  Unresolved Plan   | ---> |   Resolved Plan    | ---> |   Optimized Plan   |
| (DataFrame / SQL)  |      |   (via Catalog)    |      | (Predicates Pushed)|
+--------------------+      +--------------------+      +--------------------+
                                                                  |
                                                                  v
+--------------------+      +--------------------+      +--------------------+
| Whole-Stage Java   | <--- |   Physical Plan    | <--- |   Cost-Based CBO   |
|  Bytecode (Tungsten|      | (HashJoin/SortMerge|      | (Stats & Cardinal) |
+--------------------+      +--------------------+      +--------------------+
            </div>

            <h2>Why RDDs Degrade Performance</h2>
            <p>Using raw RDD APIs (e.g., <code>df.rdd.map(lambda row: ...)</code>) destroys Catalyst optimizations. PySpark is forced to serialize data from the JVM into the Python daemon (Py4J), execute unoptimized Python code, and serialize back into the JVM, inflicting a 5x to 10x CPU penalty and triggering out-of-memory (OOM) failures.</p>
            <div class="callout callout-tip">
              <span class="callout-title">PERFORMANCE RULE</span>
              Always utilize built-in <code>pyspark.sql.functions</code> or vectorized Pandas UDFs (<code>@pandas_udf</code>) backed by Apache Arrow to execute vector-parallel operations directly in worker memory.
            </div>
            """
        },
        # PAGE 6: Ingestion with Auto Loader
        {
            "badge": "Chapter 04",
            "h1": "Ingestion Engineering with Auto Loader",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">STREAMING INGESTION</span>
              Auto Loader (<code>cloudFiles</code>) provides an enterprise ingestion source that processes billions of newly arriving files from ADLS Gen2 incrementally and idempotently without expensive directory listing scans.
            </div>
            <p>Auto Loader operates in two modes: Directory Listing (ideal for low-frequency batches &lt; 1 million files) and File Notification (uses Azure Event Grid & Storage Queue for real-time million-file scale). It natively handles schema drift and stores unparseable data in a rescue column.</p>

            <div class="code-box">
              <div class="code-header"><span>autoloader_production.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># Scalable Auto Loader pipeline with schema evolution</span>
stream_df = spark.readStream.<span class="code-func">format</span>(<span class="code-str">"cloudFiles"</span>) \\
    .<span class="code-func">option</span>(<span class="code-str">"cloudFiles.format"</span>, <span class="code-str">"json"</span>) \\
    .<span class="code-func">option</span>(<span class="code-str">"cloudFiles.schemaLocation"</span>, <span class="code-str">"abfss://checkpoints@datalake.dfs.core.windows.net/schema/orders"</span>) \\
    .<span class="code-func">option</span>(<span class="code-str">"cloudFiles.schemaEvolutionMode"</span>, <span class="code-str">"addNewColumns"</span>) \\
    .<span class="code-func">option</span>(<span class="code-str">"cloudFiles.schemaRescueColumn"</span>, <span class="code-str">"_rescued_data"</span>) \\
    .<span class="code-func">load</span>(<span class="code-str">"abfss://raw@datalake.dfs.core.windows.net/incoming-orders/"</span>)

stream_df.writeStream.<span class="code-func">format</span>(<span class="code-str">"delta"</span>) \\
    .<span class="code-func">outputMode</span>(<span class="code-str">"append"</span>) \\
    .<span class="code-func">option</span>(<span class="code-str">"checkpointLocation"</span>, <span class="code-str">"abfss://checkpoints@datalake.dfs.core.windows.net/bronze/orders"</span>) \\
    .<span class="code-func">trigger</span>(availableNow=<span class="code-keyword">True</span>) \\
    .<span class="code-func">toTable</span>(<span class="code-str">"bronze.sales.raw_orders"</span>)</div>
            </div>

            <h2>Trigger.AvailableNow vs Continuous Streaming</h2>
            <p><code>trigger(availableNow=True)</code> ingests all outstanding data matching micro-batch mechanics before shutting down the cluster. This combines streaming idempotency with batch cost-efficiency, slashing cluster run-time costs by 70% compared to 24/7 idle streams.</p>
            <div class="callout callout-tip">
              <span class="callout-title">IDEMPOTENCY GUARANTEE</span>
              Always store checkpoint directories on dedicated ADLS Gen2 storage with immutable lifecycle policies to guarantee exact-once processing semantics during worker reboots.
            </div>
            """
        },
        # PAGE 7: Bronze Tier Ingestion & Schema Evolution
        {
            "badge": "Chapter 05",
            "h1": "Bronze Tier Ingestion & Audit Patterns",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">RAW DATA ZONE</span>
              The Bronze tier serves as the historical record of truth. It stores raw ingestion events append-only, preserving source fidelity while enriching records with ingestion timestamps, input file paths, and batch IDs.
            </div>
            <p>Never apply destructive transformations, data cleansing, or schema enforcement in the Bronze tier. If upstream APIs emit corrupt JSON, dropping fields at this stage prevents historic reprocessing. Instead, capture raw payloads completely.</p>

            <div class="code-box">
              <div class="code-header"><span>bronze_enrichment.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">from</span> pyspark.sql.functions <span class="code-keyword">import</span> current_timestamp, input_file_name, expr

<span class="code-comment"># Enrich raw payload with lineage and operational metadata</span>
df_bronze = stream_df \\
    .<span class="code-func">withColumn</span>(<span class="code-str">"_ingestion_timestamp"</span>, <span class="code-func">current_timestamp</span>()) \\
    .<span class="code-func">withColumn</span>(<span class="code-str">"_source_file"</span>, <span class="code-func">input_file_name</span>()) \\
    .<span class="code-func">withColumn</span>(<span class="code-str">"_pipeline_id"</span>, <span class="code-func">expr</span>(<span class="code-str">"'AZ-DATA-PIPE-092'"</span>))

df_bronze.writeStream.<span class="code-func">format</span>(<span class="code-str">"delta"</span>) \\
    .<span class="code-func">partitionBy</span>(<span class="code-str">"_ingestion_date"</span>) \\
    .<span class="code-func">toTable</span>(<span class="code-str">"bronze.iot.telemetry_raw"</span>)</div>
            </div>

            <h2>Partitioning Guidelines in Bronze</h2>
            <p>Partitioning by ingestion date (<code>YYYY-MM-DD</code>) is the industry standard for Bronze tables. However, over-partitioning by hourly granularities creates the 'small file problem' where thousands of 50KB files choke the Spark driver. Limit Bronze partition counts to ensure physical Parquet files average between 128MB and 1GB.</p>
            <div class="callout callout-warn">
              <span class="callout-title">STORAGE PITFALL</span>
              Do not partition tables containing less than 1TB of total data. Modern Delta Lake engines with Liquid Clustering perform faster on unpartitioned files than improperly partitioned structures.
            </div>
            """
        },
        # PAGE 8: Silver Tier & Delta MERGE CDC
        {
            "badge": "Chapter 06",
            "h1": "Silver Tier Data Cleansing & CDC MERGE",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CLEANSED CURATED ZONE</span>
              The Silver tier transforms raw Bronze payloads into cleansed, typed, and deduplicated relational structures. Change Data Capture (CDC) feeds are processed using ACID <code>MERGE</code> statements to reconcile row-level updates, inserts, and deletes.
            </div>
            <p>When executing high-frequency <code>MERGE</code> operations, avoid full-table scans by specifying partition prune predicates in the merge condition whenever applicable.</p>

            <div class="code-box">
              <div class="code-header"><span>silver_cdc_merge.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">from</span> delta.tables <span class="code-keyword">import</span> DeltaTable

target_table = DeltaTable.<span class="code-func">forName</span>(spark, <span class="code-str">"silver.crm.customers"</span>)

<span class="code-comment"># Execute atomic CDC Upsert with type validation</span>
target_table.<span class="code-func">alias</span>(<span class="code-str">"target"</span>).<span class="code-func">merge</span>(
    source=df_clean_cdc.<span class="code-func">alias</span>(<span class="code-str">"source"</span>),
    condition=<span class="code-str">"target.customer_id = source.customer_id AND target.region = source.region"</span>
).<span class="code-func">whenMatchedUpdate</span>(
    condition=<span class="code-str">"source.operation = 'U' AND source.timestamp > target.last_modified"</span>,
    set={
        <span class="code-str">"name"</span>: <span class="code-str">"source.name"</span>,
        <span class="code-str">"email"</span>: <span class="code-str">"source.email"</span>,
        <span class="code-str">"last_modified"</span>: <span class="code-str">"source.timestamp"</span>
    }
).<span class="code-func">whenMatchedDelete</span>(
    condition=<span class="code-str">"source.operation = 'D'"</span>
).<span class="code-func">whenNotMatchedInsert</span>(
    condition=<span class="code-str">"source.operation = 'I'"</span>,
    values={
        <span class="code-str">"customer_id"</span>: <span class="code-str">"source.customer_id"</span>,
        <span class="code-str">"region"</span>: <span class="code-str">"source.region"</span>,
        <span class="code-str">"name"</span>: <span class="code-str">"source.name"</span>,
        <span class="code-str">"email"</span>: <span class="code-str">"source.email"</span>,
        <span class="code-str">"created_at"</span>: <span class="code-str">"source.timestamp"</span>,
        <span class="code-str">"last_modified"</span>: <span class="code-str">"source.timestamp"</span>
    }
).<span class="code-func">execute</span>()</div>
            </div>

            <h2>Handling Out-of-Order CDC Events</h2>
            <p>Distributed streams frequently deliver update records prior to initial insert events. Maintaining a monotonic sequence column (such as database transaction logs LSN or source commit timestamps) ensures obsolete updates never overwrite newer customer states.</p>
            <div class="callout callout-tip">
              <span class="callout-title">DELTA 3.0 OPTIMIZATION</span>
              Enable <code>spark.databricks.delta.merge.enableLowShuffle = true</code> to allow the engine to only re-write partitions that contain matched rows, reducing I/O write amplification by up to 65%.
            </div>
            """
        },
        # PAGE 9: Gold Tier Dimensional Aggregations
        {
            "badge": "Chapter 07",
            "h1": "Gold Tier Star Schemas & Analytical Serving",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CONSUMPTION ZONE</span>
              The Gold tier structures data for business consumption. It implements dimensional modeling principles (Kimball Star Schemas) optimized for Power BI Direct Lake connectivity, executive KPI dashboards, and high-concurrency SQL analytics.
            </div>
            <p>Gold tables replace normalized transactional joins with wide dimension and fact tables, pre-computing common business aggregations and conforming enterprise identities across business units.</p>

            <div class="code-box">
              <div class="code-header"><span>gold_dimensional_build.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">CREATE OR REPLACE TABLE</span> gold.finance.fact_daily_revenue
<span class="code-keyword">CLUSTER BY</span> (product_key, customer_key, transaction_date)
<span class="code-keyword">AS</span>
<span class="code-keyword">SELECT</span>
    p.product_key,
    c.customer_key,
    <span class="code-func">DATE</span>(o.order_timestamp) <span class="code-keyword">AS</span> transaction_date,
    <span class="code-func">COUNT</span>(<span class="code-keyword">DISTINCT</span> o.order_id) <span class="code-keyword">AS</span> total_orders,
    <span class="code-func">SUM</span>(o.quantity) <span class="code-keyword">AS</span> total_units_sold,
    <span class="code-func">SUM</span>(o.net_amount) <span class="code-keyword">AS</span> gross_revenue,
    <span class="code-func">SUM</span>(o.tax_amount) <span class="code-keyword">AS</span> total_tax,
    <span class="code-func">CURRENT_TIMESTAMP</span>() <span class="code-keyword">AS</span> gold_calculated_at
<span class="code-keyword">FROM</span> silver.orders.completed_orders o
<span class="code-keyword">INNER JOIN</span> gold.dimensions.dim_product p <span class="code-keyword">ON</span> o.product_id = p.product_id
<span class="code-keyword">INNER JOIN</span> gold.dimensions.dim_customer c <span class="code-keyword">ON</span> o.customer_id = c.customer_id
<span class="code-keyword">WHERE</span> o.status = <span class="code-str">'FULFILLED'</span>
<span class="code-keyword">GROUP BY ALL</span>;</div>
            </div>

            <h2>Direct Lake Compatibility</h2>
            <p>When feeding Microsoft Fabric or Power BI, Gold Delta tables must adhere to V-Order Parquet sorting and avoid proprietary UDFs in view definitions. Direct Lake reads Parquet columns directly into Power BI's VertiPaq memory without data movement or scheduled semantic model refreshes.</p>
            <div class="callout callout-tip">
              <span class="callout-title">CONFORMED DIMENSIONS</span>
              Maintain enterprise conformed dimensions in a centralized catalog (e.g. <code>enterprise.dimensions</code>) to prevent different departments from maintaining conflicting definitions of Fiscal Periods and Customer segments.
            </div>
            """
        },
        # PAGE 10: Delta Optimization: OPTIMIZE & Liquid Clustering
        {
            "badge": "Chapter 08",
            "h1": "Delta Optimization: Liquid Clustering & V-Order",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PHYSICAL COMPACTION & PRUNING</span>
              Over time, frequent batch inserts and streaming writes fragment Delta tables into thousands of tiny Parquet files. Delta provides automated compaction and layout algorithms to guarantee fast query pruning.
            </div>
            <p>Historically, Hive-style partitioning and Z-ORDER indexing were standard. In Databricks 2026, <strong>Liquid Clustering</strong> replaces both with dynamic, non-destructive multi-dimensional data clustering.</p>

            <table class="table-box">
              <tr>
                <th>Feature</th>
                <th>Traditional Hive Partitioning</th>
                <th>Liquid Clustering (Delta 3.0+)</th>
              </tr>
              <tr>
                <td>Cardinality Fit</td>
                <td>Low only (e.g. Year, Region)</td>
                <td>High or Low (UUID, CustomerId, Timestamp)</td>
              </tr>
              <tr>
                <td>Data Skew Risk</td>
                <td>High (Uneven directory sizes)</td>
                <td>Low (Self-balancing file allocations)</td>
              </tr>
              <tr>
                <td>Layout Evolution</td>
                <td>Requires full data rewrite</td>
                <td>Instant (ALTER TABLE ... CLUSTER BY)</td>
              </tr>
              <tr>
                <td>Small File Burden</td>
                <td>Massive risk with multi-column partitions</td>
                <td>Automated file sizing target (128MB)</td>
              </tr>
            </table>

            <div class="code-box">
              <div class="code-header"><span>liquid_maintenance.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Transition an existing enterprise table to Liquid Clustering</span>
<span class="code-keyword">ALTER TABLE</span> gold.sales.orders 
<span class="code-keyword">CLUSTER BY</span> (order_date, customer_id, store_id);

<span class="code-comment">-- Run incremental compaction across clustered keys</span>
<span class="code-keyword">OPTIMIZE</span> gold.sales.orders;

<span class="code-comment">-- Purge unreferenced historical files older than 7 days (VACUUM)</span>
<span class="code-keyword">SET</span> spark.databricks.delta.vacuum.parallelDelete.enabled = <span class="code-keyword">true</span>;
<span class="code-keyword">VACUUM</span> gold.sales.orders <span class="code-keyword">RETAIN</span> 168 <span class="code-keyword">HOURS</span>;</div>
            </div>
            <div class="callout callout-warn">
              <span class="callout-title">VACUUM SAFETY WARNING</span>
              Never run <code>VACUUM RETAIN 0 HOURS</code> on production tables without disabling safety checks. Active concurrent transactions or ongoing read queries will fail instantly if underlying Parquet files are unlinked mid-execution.
            </div>
            """
        },
        # PAGE 11: PySpark Tuning: Shuffles & Skew Joins
        {
            "badge": "Chapter 09",
            "h1": "PySpark Performance: Partitions & Skew Joins",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ADVANCED TUNING</span>
              Data skew occurs when disproportionate volumes of data hash to a single partition key, causing one stranded worker to process 80% of data while 99 other nodes sit idle in the cluster.
            </div>
            <p>Adaptive Query Execution (AQE) dynamically optimizes shuffle partitions, coalesces small partitions, and handles skewed joins at runtime. However, enterprise data engineers must still diagnose and resolve structural bottlenecks.</p>

            <div class="code-box">
              <div class="code-header"><span>skew_mitigation_techniques.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">from</span> pyspark.sql.functions <span class="code-keyword">import</span> broadcast, concat, lit, rand, floor

<span class="code-comment"># 1. Broadcast join for dimension tables (< 100MB) to eliminate shuffle entirely</span>
df_enriched = df_large_transactions.<span class="code-func">join</span>(
    <span class="code-func">broadcast</span>(df_dim_stores),
    on=<span class="code-str">"store_id"</span>,
    how=<span class="code-str">"inner"</span>
)

<span class="code-comment"># 2. Key Salting to distribute skewed keys across multiple workers</span>
df_salted = df_large_transactions \\
    .<span class="code-func">withColumn</span>(<span class="code-str">"salt_key"</span>, <span class="code-func">floor</span>(<span class="code-func">rand</span>() * <span class="code-keyword">10</span>)) \\
    .<span class="code-func">withColumn</span>(<span class="code-str">"skewed_join_col"</span>, <span class="code-func">concat</span>(<span class="code-str">"customer_id"</span>, <span class="code-func">lit</span>(<span class="code-str">"_"</span>), <span class="code-str">"salt_key"</span>))

<span class="code-comment"># Replicate dimension rows across the salt range to match salted keys</span>
df_dim_exploded = df_dim_customers.<span class="code-func">withColumn</span>(<span class="code-str">"salts"</span>, <span class="code-func">expr</span>(<span class="code-str">"sequence(0, 9)"</span>)) \\
    .<span class="code-func">selectExpr</span>(<span class="code-str">"*"</span>, <span class="code-str">"explode(salts) as salt_key"</span>) \\
    .<span class="code-func">withColumn</span>(<span class="code-str">"skewed_join_col"</span>, <span class="code-func">concat</span>(<span class="code-str">"customer_id"</span>, <span class="code-func">lit</span>(<span class="code-str">"_"</span>), <span class="code-str">"salt_key"</span>))</div>
            </div>

            <h2>Essential Spark Engine Configurations</h2>
            <ul>
              <li><code>spark.sql.adaptive.enabled = true</code>: Dynamically recalibrates physical plans during runtime.</li>
              <li><code>spark.sql.adaptive.skewJoin.enabled = true</code>: Automatically splits oversized partitions into sub-partitions.</li>
              <li><code>spark.sql.autoBroadcastJoinThreshold = 67108864</code> (64MB): Bounds automated driver broadcast serialization.</li>
            </ul>
            <div class="callout callout-tip">
              <span class="callout-title">SPARK UI DIAGNOSTIC</span>
              Open the 'Stages' tab in Spark UI. If <code>Max Task Time</code> is 12 minutes while <code>75th Percentile Task Time</code> is 4 seconds, you are facing severe data skew on the shuffle stage.
            </div>
            """
        },
        # PAGE 12: Delta Live Tables (DLT) & Quality Gates
        {
            "badge": "Chapter 10",
            "h1": "Delta Live Tables: Declarative Pipelines",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DECLARATIVE PIPELINES</span>
              Delta Live Tables (DLT) allows engineers to define data pipelines declaratively in SQL or Python. The DLT engine manages DAG dependencies, automatic checkpointing, cluster scaling, and enforces formal data quality contracts.
            </div>
            <p>DLT replaces complex custom orchestration scripts with formal expectations. Expectations govern how corrupt or out-of-spec records are treated before entering curated layers.</p>

            <div class="code-box">
              <div class="code-header"><span>dlt_pipeline_expectations.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">import</span> dlt
<span class="code-keyword">from</span> pyspark.sql.functions <span class="code-keyword">import</span> col

<span class="code-comment"># Declare Silver Table with strict quality expectations</span>
<span class="code-keyword">@dlt.table</span>(
    name=<span class="code-str">"silver_orders_validated"</span>,
    comment=<span class="code-str">"Cleansed orders with strict business constraint validation"</span>
)
<span class="code-keyword">@dlt.expect_or_drop</span>(<span class="code-str">"valid_order_id"</span>, <span class="code-str">"order_id IS NOT NULL"</span>)
<span class="code-keyword">@dlt.expect_or_fail</span>(<span class="code-str">"valid_monetary_amount"</span>, <span class="code-str">"net_amount >= 0.0"</span>)
<span class="code-keyword">@dlt.expect</span>(<span class="code-str">"valid_customer_fk"</span>, <span class="code-str">"customer_id IS NOT NULL"</span>)
<span class="code-keyword">def</span> <span class="code-func">silver_orders_validated</span>():
    <span class="code-keyword">return</span> (
        dlt.<span class="code-func">read_stream</span>(<span class="code-str">"bronze_orders_raw"</span>)
        .<span class="code-func">filter</span>(<span class="code-func">col</span>(<span class="code-str">"order_status"</span>) != <span class="code-str">"CANCELLED_IN_TRANSIT"</span>)
    )</div>
            </div>

            <h2>Expectation Action Matrix</h2>
            <table class="table-box">
              <tr>
                <th>Expectation Decorator</th>
                <th>Action on Constraint Violation</th>
                <th>Best Used For</th>
              </tr>
              <tr>
                <td><code>@dlt.expect</code></td>
                <td>Records metric in event log; retains row</td>
                <td>Minor data warnings, telemetry anomalies</td>
              </tr>
              <tr>
                <td><code>@dlt.expect_or_drop</code></td>
                <td>Silently quarantines/drops row from output</td>
                <td>Malformed email strings, invalid phone numbers</td>
              </tr>
              <tr>
                <td><code>@dlt.expect_or_fail</code></td>
                <td>Immediately halts pipeline and alerts on-call</td>
                <td>Financial ledger imbalance, missing primary keys</td>
              </tr>
            </table>
            <div class="callout callout-tip">
              <span class="callout-title">EVENT LOG HARVESTING</span>
              Query the DLT event log directly with SQL to generate automated SLA reports showing data quality pass/fail rates across all enterprise upstream feeds.
            </div>
            """
        },
        # PAGE 13: Unity Catalog: Governance & Row/Column Filters
        {
            "badge": "Chapter 11",
            "h1": "Unity Catalog: 3-Level Namespace & Security",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">UNIFIED GOVERNANCE</span>
              Unity Catalog centralizes access control, data auditing, and lineage tracking across all workspaces. It structures data assets in a standard 3-level namespace: <code>catalog.schema.table</code>.
            </div>
            <p>Unlike legacy Hive metastores bound to a single cluster or workspace, Unity Catalog metastores are linked at the Azure tenant account level, enforcing granular ANSI SQL permissions on tables, views, volumes, and models.</p>

            <div class="code-box">
              <div class="code-header"><span>unity_catalog_grants.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Create 3-level hierarchy and grant managed access</span>
<span class="code-keyword">CREATE CATALOG IF NOT EXISTS</span> enterprise_emea;
<span class="code-keyword">CREATE SCHEMA IF NOT EXISTS</span> enterprise_emea.financial_analytics;

<span class="code-keyword">GRANT USE CATALOG ON CATALOG</span> enterprise_emea <span class="code-keyword">TO</span> `finance_analysts`;
<span class="code-keyword">GRANT USE SCHEMA ON SCHEMA</span> enterprise_emea.financial_analytics <span class="code-keyword">TO</span> `finance_analysts`;
<span class="code-keyword">GRANT SELECT ON TABLE</span> enterprise_emea.financial_analytics.ledger_summary <span class="code-keyword">TO</span> `finance_analysts`;

<span class="code-comment">-- Implement dynamic row-level security using session functions</span>
<span class="code-keyword">CREATE OR REPLACE FUNCTION</span> enterprise_emea.financial_analytics.region_filter(region_code <span class="code-keyword">STRING</span>)
<span class="code-keyword">RETURNS BOOLEAN</span>
<span class="code-keyword">RETURN</span> <span class="code-func">is_account_group_member</span>(<span class="code-str">'global_admins'</span>) <span class="code-keyword">OR</span> 
       region_code = <span class="code-func">current_user</span>();

<span class="code-keyword">ALTER TABLE</span> enterprise_emea.financial_analytics.ledger_summary
<span class="code-keyword">SET ROW FILTER</span> enterprise_emea.financial_analytics.region_filter <span class="code-keyword">ON</span> (branch_country);</div>
            </div>

            <h2>Dynamic Column Masking</h2>
            <p>Protect PII (Credit Cards, Social Security Numbers) by applying column masking functions. Analysts see masked hashes (<code>XXXX-XXXX-XXXX-1234</code>) while authorized compliance officers view plaintext representations without creating fragmented duplicate views.</p>
            <div class="callout callout-tip">
              <span class="callout-title">AUDIT EXCELLENCE</span>
              System tables (<code>system.access.audit</code>) record every single read, write, and failed query across the entire enterprise estate, queryable with standard SQL for SOC2 compliance.
            </div>
            """
        },
        # PAGE 14: Databricks SQL Warehouses & Photon Engine
        {
            "badge": "Chapter 12",
            "h1": "Databricks SQL Warehouses & Photon Engine",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ANALYTICAL SERVING</span>
              Databricks SQL (DBSQL) Warehouses provide dedicated compute tailored for high-concurrency SQL analytics, BI reporting tools, and ad-hoc semantic queries backed by the native C++ Photon execution engine.
            </div>
            <p>Photon rewrites Spark's JVM-based physical execution in vectorized C++, optimizing memory locality, SIMD hardware instructions, and string manipulation for massive speedups on analytical aggregation workloads.</p>

            <table class="table-box">
              <tr>
                <th>Warehouse Channel</th>
                <th>Startup Latency</th>
                <th>Auto-Stop Default</th>
                <th>Primary Use Case</th>
              </tr>
              <tr>
                <td>Classic SQL</td>
                <td>3 – 6 minutes</td>
                <td>120 minutes</td>
                <td>Legacy development, low-priority batch reports</td>
              </tr>
              <tr>
                <td>Pro SQL</td>
                <td>2 – 4 minutes</td>
                <td>45 minutes</td>
                <td>Complex transformations, advanced geospatial SQL</td>
              </tr>
              <tr>
                <td>Serverless SQL</td>
                <td>&lt; 5 seconds</td>
                <td>10 minutes</td>
                <td>Power BI Direct Lake, Tableau, Executive KPIs</td>
              </tr>
            </table>

            <h2>Multi-Cluster Auto-Scaling</h2>
            <p>During morning peak hours, hundreds of business users execute Power BI dashboards concurrently. Serverless SQL warehouses auto-scale clusters horizontally within seconds to prevent query queuing, instantly tearing down spare nodes when demand drops.</p>
            <div class="code-box">
              <div class="code-header"><span>query_profile_diagnostic.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Inspect top 5 most expensive queries over the last 24 hours</span>
<span class="code-keyword">SELECT</span> query_id, executed_by, duration_ms, rows_produced, compilation_duration_ms
<span class="code-keyword">FROM</span> system.query.history
<span class="code-keyword">WHERE</span> start_time >= <span class="code-func">dateadd</span>(DAY, -1, <span class="code-func">current_timestamp</span>())
<span class="code-keyword">ORDER BY</span> duration_ms <span class="code-keyword">DESC</span>
<span class="code-keyword">LIMIT</span> 5;</div>
            </div>
            <div class="callout callout-tip">
              <span class="callout-title">FINOPS SAVINGS</span>
              Configure Serverless SQL Warehouses with a 10-minute auto-suspend window. Because wake-up latency is &lt; 5 seconds, users experience zero penalty while organizations save thousands in idle compute charges.
            </div>
            """
        },
        # PAGE 15: Orchestration with Databricks Workflows
        {
            "badge": "Chapter 13",
            "h1": "Orchestration with Databricks Workflows",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ENTERPRISE ORCHESTRATION</span>
              Databricks Workflows is the fully managed multi-task orchestrator designed for resilient production DAGs. It seamlessly sequences Notebooks, Python scripts, SQL queries, dbt models, and JAR binaries with native retry policies.
            </div>
            <p>Workflows eliminates the operational overhead of managing external Apache Airflow clusters for Databricks-native pipelines, providing native lineage visibility and sub-second task transition latencies.</p>

            <div class="diagram-box">
+-------------------------------------------------------------+
|                  TASK 1: Ingest Auto Loader                 |
|                   (Serverless Job Cluster)                  |
+-------------------------------------------------------------+
                               |
               +---------------+---------------+
               v                               v
+-----------------------------+ +-----------------------------+
|    TASK 2A: Cleanse CRM     | |   TASK 2B: Cleanse Orders   |
|      (PySpark Script)       | |      (PySpark Script)       |
+-----------------------------+ +-----------------------------+
               |                               |
               +---------------+---------------+
                               v
+-------------------------------------------------------------+
|                 TASK 3: Build Gold Star Schema              |
|                 (Databricks SQL Task / Photon)              |
+-------------------------------------------------------------+
            </div>

            <h2>Task Parameter Passing & Value Sharing</h2>
            <p>Workflows allows upstream tasks to pass dynamic runtime metadata (such as processed batch dates, file counts, or high-watermark timestamps) to downstream tasks using the <code>dbutils.jobs.taskValues</code> API.</p>
            <div class="code-box">
              <div class="code-header"><span>task_value_passing.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># In Task 1: Record processed batch cutoff timestamp</span>
dbutils.jobs.taskValues.<span class="code-func">set</span>(key=<span class="code-str">"batch_cutoff"</span>, value=<span class="code-str">"2026-10-28T18:00:00Z"</span>)

<span class="code-comment"># In Task 2: Retrieve the parameter from Task 1</span>
cutoff = dbutils.jobs.taskValues.<span class="code-func">get</span>(taskKey=<span class="code-str">"ingest_bronze"</span>, key=<span class="code-str">"batch_cutoff"</span>)
print(f<span class="code-str">"Processing records prior to {cutoff}"</span>)</div>
            </div>
            <div class="callout callout-tip">
              <span class="callout-title">REPAIR AND RUN FAILED</span>
              When a 15-task DAG fails on Task 12 due to a transient API timeout, Workflows allows you to 'Repair and Run Failed', executing only failed tasks without re-computing expensive upstream steps.
            </div>
            """
        },
        # PAGE 16: CI/CD with Databricks Asset Bundles (DABs)
        {
            "badge": "Chapter 14",
            "h1": "CI/CD with Databricks Asset Bundles (DABs)",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">INFRASTRUCTURE AS CODE</span>
              Databricks Asset Bundles (DABs) represent the modern standard for defining, testing, and deploying data engineering pipelines, ML models, and workflows as version-controlled code in Git.
            </div>
            <p>DABs replaces manual UI imports and brittle REST API deployment scripts with declarative YAML manifests, enabling robust multi-environment promotion (Dev → Stage → Prod) in automated CI/CD pipelines.</p>

            <div class="code-box">
              <div class="code-header"><span>databricks.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">bundle</span>:
  <span class="code-keyword">name</span>: enterprise-sales-lakehouse

<span class="code-keyword">targets</span>:
  <span class="code-keyword">dev</span>:
    <span class="code-keyword">mode</span>: development
    <span class="code-keyword">workspace</span>:
      <span class="code-keyword">host</span>: https://adb-dev-instance.azuredatabricks.net
  <span class="code-keyword">prod</span>:
    <span class="code-keyword">mode</span>: production
    <span class="code-keyword">workspace</span>:
      <span class="code-keyword">host</span>: https://adb-prod-instance.azuredatabricks.net

<span class="code-keyword">resources</span>:
  <span class="code-keyword">jobs</span>:
    <span class="code-keyword">daily_lakehouse_pipeline</span>:
      <span class="code-keyword">name</span>: ${bundle.target}-daily-sales-processing
      <span class="code-keyword">tasks</span>:
        - <span class="code-keyword">task_key</span>: silver_transform
          <span class="code-keyword">spark_python_task</span>:
            <span class="code-keyword">python_file</span>: src/transforms/silver_orders.py
          <span class="code-keyword">job_cluster_key</span>: standard_compute</div>
            </div>

            <h2>GitHub Actions CI/CD Deployment</h2>
            <div class="code-box">
              <div class="code-header"><span>.github/workflows/deploy.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">- <span class="code-keyword">name</span>: Deploy Asset Bundle to Production
  <span class="code-keyword">run</span>: |
    databricks bundle validate -t prod
    databricks bundle deploy -t prod --var="git_sha=${{ github.sha }}"</div>
            </div>
            <div class="callout callout-tip">
              <span class="callout-title">BUNDLE VALIDATE</span>
              Incorporate <code>databricks bundle validate</code> into your Pull Request checks. It catches syntax errors, missing files, and cluster permission mismatches before code merges to main.
            </div>
            """
        },
        # PAGE 17: Networking & Zero-Trust Security
        {
            "badge": "Chapter 15",
            "h1": "Security & Networking: VNet Injection & Private Link",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ENTERPRISE HARDENING</span>
              Deploying Databricks into enterprise regulated environments requires complete network isolation, eliminating all public internet routing between the control plane, worker compute, and ADLS Gen2 storage.
            </div>
            <p>VNet Injection provisions Databricks worker clusters inside your private Azure Virtual Network across two dedicated subnets (host and container), allowing Network Security Groups (NSGs) and Azure Firewall egress rules to inspect all outbound traffic.</p>

            <h2>Core Security Architecture Pillars</h2>
            <ul>
              <li><strong>Azure Private Link:</strong> Establishes private IP connectivity between user browsers, the Databricks Webapp/Control Plane, and internal cluster nodes.</li>
              <li><strong>Storage Firewall & Private Endpoints:</strong> ADLS Gen2 storage accounts deny all public traffic, communicating exclusively via <code>privatelink.dfs.core.windows.net</code>.</li>
              <li><strong>Azure Key Vault Secret Scopes:</strong> Eliminates hardcoded tokens by referencing secrets securely: <code>dbutils.secrets.get(scope="az-kv-scope", key="apiKey")</code>.</li>
              <li><strong>Secure Cluster Connectivity (No Public IP):</strong> Cluster worker nodes have zero public IP addresses, preventing unsolicited inbound connections from the internet.</li>
            </ul>

            <div class="code-box">
              <div class="code-header"><span>secret_scope_integration.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># Access external REST service using secret retrieved dynamically from Azure Key Vault</span>
api_token = dbutils.secrets.<span class="code-func">get</span>(scope=<span class="code-str">"enterprise-keyvault"</span>, key=<span class="code-str">"salesforce-oauth-token"</span>)

<span class="code-comment"># Configure ADLS Gen2 Service Principal credentials securely in session</span>
spark.conf.<span class="code-func">set</span>(
    <span class="code-str">"fs.azure.account.auth.type.datalakeprod.dfs.core.windows.net"</span>, <span class="code-str">"OAuth"</span>
)
spark.conf.<span class="code-func">set</span>(
    <span class="code-str">"fs.azure.account.oauth.provider.type.datalakeprod.dfs.core.windows.net"</span>,
    <span class="code-str">"org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider"</span>
)</div>
            </div>
            <div class="callout callout-warn">
              <span class="callout-title">SECURITY HARDENING</span>
              Never mount storage containers using root access keys (<code>dbutils.fs.mount</code>). Storage mounts are deprecated; all modern access must route via Unity Catalog External Locations and Storage Credentials.
            </div>
            """
        },
        # PAGE 18: Cost Governance & FinOps
        {
            "badge": "Chapter 16",
            "h1": "Cost Governance & FinOps for Databricks",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">FINANCIAL GOVERNANCE</span>
              Cloud data platforms can incur runaway expenses without continuous automated FinOps monitoring. Establishing cluster policies, spot instance balancing, and system table metering protects enterprise budgets.
            </div>
            <p>Databricks billing combines two components: Azure Virtual Machine infrastructure costs (billed by Microsoft) and Databricks Units (DBUs, billed based on compute tier and runtime).</p>

            <div class="grid-2">
              <div class="grid-card">
                <h3>Compute Optimization Levers</h3>
                <p>• <strong>Spot Instance Workers:</strong> Utilize Azure Spot VMs for stateless batch worker nodes, saving 60–80% over on-demand.<br>
                • <strong>Aggressive Auto-Termination:</strong> Set interactive clusters to terminate after 15 minutes of inactivity.<br>
                • <strong>Job-Scoped Compute:</strong> Never run scheduled batch production jobs on shared All-Purpose clusters.</p>
              </div>
              <div class="grid-card">
                <h3>FinOps Architecture Standards</h3>
                <p>• <strong>Cluster Pools:</strong> Warm VM caches reduce spin-up latency from 5 minutes to 30 seconds without idle DBU burn.<br>
                • <strong>Target Sizing:</strong> Scale worker memory to partition size; avoid 64-core nodes for 2GB daily incremental feeds.<br>
                • <strong>Storage Lifecycle:</strong> Archive old Delta versions via VACUUM to avoid paying for orphaned Parquet blobs.</p>
              </div>
            </div>

            <h2>Automated Cost Tracking via System Tables</h2>
            <div class="code-box">
              <div class="code-header"><span>finops_dbu_consumption.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Calculate total DBU spend by workspace and SKU over the last 30 days</span>
<span class="code-keyword">SELECT</span>
    workspace_id,
    sku_name,
    <span class="code-func">DATE_TRUNC</span>(<span class="code-str">'day'</span>, usage_start_time) <span class="code-keyword">AS</span> usage_date,
    <span class="code-func">SUM</span>(usage_quantity) <span class="code-keyword">AS</span> total_dbus_consumed,
    <span class="code-func">ROUND</span>(<span class="code-func">SUM</span>(usage_quantity) * 0.40, 2) <span class="code-keyword">AS</span> estimated_cost_usd
<span class="code-keyword">FROM</span> system.billing.usage
<span class="code-keyword">WHERE</span> usage_start_time >= <span class="code-func">dateadd</span>(DAY, -30, <span class="code-func">current_timestamp</span>())
<span class="code-keyword">GROUP BY ALL</span>
<span class="code-keyword">ORDER BY</span> usage_date <span class="code-keyword">DESC</span>;</div>
            </div>
            <div class="callout callout-tip">
              <span class="callout-title">BUDGET ALERTS</span>
              Deploy Azure Cost Management Budget Alerts linked to the Databricks resource group to trigger automated Slack or PagerDuty webhooks when consumption exceeds 85% of monthly allocations.
            </div>
            """
        },
        # PAGE 19: Real-World Scenario: Financial Fraud Streaming
        {
            "badge": "Chapter 17",
            "h1": "Production Scenario: Financial Fraud Analytics",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">END-TO-END IMPLEMENTATION</span>
              A global fintech institution processes 25,000 credit card authorizations per second. The pipeline must ingest transactions from Azure Event Hubs, compute rolling 10-minute velocity metrics, and flag fraudulent behavior with sub-second latency.
            </div>
            <p>This implementation couples Structured Streaming with Delta Lake watermarking to handle out-of-order event streams without accumulating unbounded state memory.</p>

            <div class="code-box">
              <div class="code-header"><span>streaming_fraud_detector.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">from</span> pyspark.sql.functions <span class="code-keyword">import</span> from_json, col, window, count, sum

<span class="code-comment"># Parse streaming JSON payload from Event Hubs with schema</span>
parsed_stream = event_hub_stream \\
    .<span class="code-func">select</span>(<span class="code-func">from_json</span>(<span class="code-func">col</span>(<span class="code-str">"body"</span>).<span class="code-func">cast</span>(<span class="code-str">"string"</span>), transaction_schema).<span class="code-func">alias</span>(<span class="code-str">"data"</span>)) \\
    .<span class="code-func">select</span>(<span class="code-str">"data.*"</span>)

<span class="code-comment"># Compute tumbling 10-minute velocity window with 5-minute watermark</span>
velocity_features = parsed_stream \\
    .<span class="code-func">withWatermark</span>(<span class="code-str">"event_time"</span>, <span class="code-str">"5 minutes"</span>) \\
    .<span class="code-func">groupBy</span>(
        <span class="code-func">window</span>(<span class="code-func">col</span>(<span class="code-str">"event_time"</span>), <span class="code-str">"10 minutes"</span>, <span class="code-str">"2 minutes"</span>),
        <span class="code-func">col</span>(<span class="code-str">"account_number"</span>)
    ) \\
    .<span class="code-func">agg</span>(
        <span class="code-func">count</span>(<span class="code-str">"transaction_id"</span>).<span class="code-func">alias</span>(<span class="code-str">"tx_count_10m"</span>),
        <span class="code-func">sum</span>(<span class="code-str">"amount"</span>).<span class="code-func">alias</span>(<span class="code-str">"total_spend_10m"</span>)
    )

<span class="code-comment"># Write enriched alert stream directly to Gold Real-Time Alerts table</span>
velocity_features.<span class="code-func">filter</span>(<span class="code-func">col</span>(<span class="code-str">"tx_count_10m"</span>) > <span class="code-keyword">15</span>) \\
    .writeStream.<span class="code-func">format</span>(<span class="code-str">"delta"</span>) \\
    .<span class="code-func">outputMode</span>(<span class="code-str">"update"</span>) \\
    .<span class="code-func">option</span>(<span class="code-str">"checkpointLocation"</span>, <span class="code-str">"abfss://checkpoints@datalake.dfs.core.windows.net/fraud"</span>) \\
    .<span class="code-func">toTable</span>(<span class="code-str">"gold.fraud.realtime_high_risk_alerts"</span>)</div>
            </div>

            <h2>Architecture Metrics & SLA Guarantees</h2>
            <ul>
              <li><strong>End-to-End Latency:</strong> 720ms from swipe event to executive dashboard alert.</li>
              <li><strong>Storage Footprint:</strong> 1.8TB daily partitioned by day and Liquid Clustered on <code>account_number</code>.</li>
              <li><strong>Reliability:</strong> Zero dropped records across 180 consecutive operating days.</li>
            </ul>
            """
        },
        # PAGE 20: Troubleshooting Memory Leaks & OOMs
        {
            "badge": "Chapter 18",
            "h1": "Troubleshooting Production Failures: OOM & Spills",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DEBUGGING & RESILIENCE</span>
              Out-of-Memory (OOM) crashes and excessive disk spill represent the most common and costly production failure modes on large Spark clusters.
            </div>
            <p>Diagnosing whether an OOM originates on the Driver or an Executor is the fundamental prerequisite to applying the correct architectural remediation.</p>

            <table class="table-box">
              <tr>
                <th>Error Manifestation</th>
                <th>Root Cause Architecture Fault</th>
                <th>Immediate Corrective Action</th>
              </tr>
              <tr>
                <td><code>Driver OOM: java.lang.OutOfMemoryError</code></td>
                <td>Calling <code>.collect()</code> or <code>.toPandas()</code> on massive distributed DataFrame</td>
                <td>Write directly to Delta storage or use <code>df.take(100)</code> for inspection</td>
              </tr>
              <tr>
                <td><code>Executor OOM: Container killed by YARN/K8s</code></td>
                <td>High shuffle volume with oversized partitions; garbage collection thrashing</td>
                <td>Increase <code>spark.sql.shuffle.partitions</code> or add memory to worker instances</td>
              </tr>
              <tr>
                <td><code>Spill (Memory) / Spill (Disk) in Spark UI</code></td>
                <td>Data for an individual task exceeds worker execution memory allocation</td>
                <td>Repartition skewed keys; ensure Broadcast joins don't exceed threshold</td>
              </tr>
              <tr>
                <td><code>Py4JNetworkException: Server disconnected</code></td>
                <td>Driver died due to memory starvation during broadcast serialization</td>
                <td>Increase <code>spark.driver.memory</code> and evaluate broadcast table sizes</td>
              </tr>
            </table>

            <h2>Reading the Spark UI Like a Senior Engineer</h2>
            <p>Navigate to the 'Executors' tab. Inspect the <strong>Task Deserialization Time</strong> and <strong>GC Time</strong>. If GC Time exceeds 10% of total runtime, your workers are spending more compute cycles managing Java memory garbage collection than executing business data logic.</p>
            <div class="callout callout-tip">
              <span class="callout-title">DRIVER HEURISTIC</span>
              Never perform broadcast joins on tables larger than 100MB. The driver node must serialize the broadcast table into memory before broadcasting to workers; broadcasting a 2GB table will immediately kill standard driver nodes.
            </div>
            """
        },
        # PAGE 21: High-Value Reference & PySpark Syntax Sheet
        {
            "badge": "Chapter 19",
            "h1": "PySpark & Delta 3.0 Production Syntax Index",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">SYNTAX QUICK REFERENCE</span>
              Essential production-grade syntax patterns for daily data engineering across PySpark DataFrame transformations, Delta Lake maintenance, and Lakehouse performance tuning.
            </div>

            <div class="code-box">
              <div class="code-header"><span>pyspark_cheatsheet.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># Vectorized conditional row derivation</span>
df_flagged = df.<span class="code-func">withColumn</span>(<span class="code-str">"tier"</span>,
    <span class="code-func">when</span>(<span class="code-func">col</span>(<span class="code-str">"spend"</span>) > <span class="code-keyword">10000</span>, <span class="code-func">lit</span>(<span class="code-str">"Enterprise"</span>))
    .<span class="code-func">when</span>(<span class="code-func">col</span>(<span class="code-str">"spend"</span>) > <span class="code-keyword">2500</span>, <span class="code-func">lit</span>(<span class="code-str">"Mid-Market"</span>))
    .<span class="code-func">otherwise</span>(<span class="code-func">lit</span>(<span class="code-str">"Standard"</span>))
)

<span class="code-comment"># Window function for row numbering without full shuffle</span>
window_spec = Window.<span class="code-func">partitionBy</span>(<span class="code-str">"customer_id"</span>).<span class="code-func">orderBy</span>(<span class="code-func">col</span>(<span class="code-str">"transaction_date"</span>).<span class="code-func">desc</span>())
df_deduped = df.<span class="code-func">withColumn</span>(<span class="code-str">"rank"</span>, <span class="code-func">row_number</span>().<span class="code-func">over</span>(window_spec)).<span class="code-func">filter</span>(<span class="code-func">col</span>(<span class="code-str">"rank"</span>) == <span class="code-keyword">1</span>)

<span class="code-comment"># Delta Lake Clone: Shallow (zero-copy) for instant Dev testing</span>
spark.sql(<span class="code-str">"CREATE TABLE dev.sandbox.orders SHALLOW CLONE prod.gold.orders"</span>)

<span class="code-comment"># Generate Delta Lake manifest for external engine compatibility</span>
spark.sql(<span class="code-str">"GENERATE symlink_format_manifest FOR TABLE silver.telemetry.events"</span>)</div>
            </div>

            <h2>Key Performance Configuration Reference</h2>
            <table class="table-box">
              <tr>
                <th>Spark Configuration Flag</th>
                <th>Recommended Value</th>
                <th>Operational Impact</th>
              </tr>
              <tr>
                <td><code>spark.sql.shuffle.partitions</code></td>
                <td><code>auto</code> (or 2x worker cores)</td>
                <td>Prevents 200-partition default bottleneck on small batches</td>
              </tr>
              <tr>
                <td><code>spark.databricks.io.cache.enabled</code></td>
                <td><code>true</code></td>
                <td>Caches remote Parquet files on high-speed worker NVMe SSDs</td>
              </tr>
              <tr>
                <td><code>spark.sql.files.maxPartitionBytes</code></td>
                <td><code>134217728</code> (128MB)</td>
                <td>Controls input file splitting size during initial scans</td>
              </tr>
            </table>
            """
        },
        # PAGE 22: Senior Engineer Audit & Production Checklist
        {
            "badge": "Chapter 20",
            "h1": "Senior Data Engineer Production Readiness Audit",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRE-FLIGHT ASSESSMENT</span>
              Before promoting any Azure Databricks lakehouse pipeline to production, verify every requirement across this master operational checklist to guarantee security, reliability, and cost governance.
            </div>

            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Storage & Format:</strong> All tables use Delta Lake 3.0 format; Liquid Clustering configured on query predicate columns; VACUUM and OPTIMIZE maintenance schedules established.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Ingestion Idempotency:</strong> Auto Loader pipelines configured with immutable checkpoint directories and explicit schema evolution modes (<code>addNewColumns</code>).</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Governance & RBAC:</strong> Unity Catalog 3-level namespace implemented; table grants assigned to Azure Entra ID groups rather than individual users; PII columns masked.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Networking Hardening:</strong> VNet Injection active with dedicated subnets; storage firewalls restrict access exclusively to private endpoints; public IPs disabled on worker compute.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>FinOps & Sizing:</strong> Mandatory cluster policies enforce auto-termination (15m); scheduled jobs execute on ephemeral Job Compute or Serverless; Spot VMs utilized for worker pools.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Observability & SLAs:</strong> Databricks Workflows configured with email/Slack webhooks on failure; DLT expectations monitor data quality drop thresholds; audit logs stream to Log Analytics.</div>
            </div>

            <div class="callout callout-tip" style="margin-top: 14px;">
              <span class="callout-title">AUTHOR CLOSING STATEMENT</span>
              Building scalable lakehouse systems is an exercise in disciplined architecture. By combining Delta Lake ACID guarantees, Unity Catalog governance, and automated FinOps boundaries, your data platform delivers sub-second insights while protecting enterprise capital.<br><br>
              <strong>Datta Sable</strong> · Enterprise Analytics & Data Architect · <em>dattasable.com</em>
            </div>
            """
        }
    ]
}
