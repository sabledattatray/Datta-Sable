# scripts/ebook_generator/book5_snowflake.py

BOOK_SNOWFLAKE = {
    "slug": "snowflake-architecture-finops-2026",
    "sku": "DS-EBOOK-SNOW-FIN-2026",
    "title": "Snowflake Cloud Data Platform Architecture & FinOps",
    "cover_title_formatted": "Snowflake Cloud Data Platform <span>Architecture & FinOps</span>",
    "subtitle": "The definitive production guide to multi-cluster warehouse sizing, micro-partition pruning, continuous Snowpipe streaming, Zero-Copy Cloning, and aggressive FinOps credit governance.",
    "category_name": "Cloud Data Platforms",
    "category_slug": "cloud-data-platforms",
    "all_category_slugs": ["cloud-data-platforms", "sql-databases", "data-analytics-bi"],
    "features": ["22-page PDF", "2026 Edition", "Production Snowflake FinOps & Architecture"],
    "included_resources": ["22-page PDF handbook"],
    "seo_title": "Snowflake Cloud Data Platform Architecture & FinOps | 2026 Edition",
    "seo_desc": "22-page Snowflake Cloud Data Platform and FinOps handbook by Datta Sable. Production warehouse sizing, micro-partition pruning, Snowpipe, and cost optimization.",
    "pages": [
        # PAGE 2: Table of Contents & Architecture Blueprint
        {
            "badge": "Architecture Blueprint",
            "h1": "Table of Contents & Snowflake Platform Blueprint",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">EXECUTIVE OVERVIEW</span>
              Snowflake revolutionised data warehousing by completely decoupling storage, compute, and cloud services. Operating Snowflake at scale requires orchestrating auto-scaling virtual warehouses, continuous data pipelines, and implementing disciplined FinOps governance to prevent runaway credit consumption.
            </div>

            <div class="diagram-box">
+----------------------------------------------------------------------------+
|                          CLOUD SERVICES LAYER                              |
|          Authentication, Metadata, Optimization, Access Control            |
+----------------------------------------------------------------------------+
                     |                                     |
       +-------------+-------------+         +-------------+-------------+
       v                           v         v                           v
+---------------+           +---------------+       +---------------+
| VIRTUAL WH A  |           | VIRTUAL WH B  |       | VIRTUAL WH C  |
|  (ETL Tasks)  |           | (Power BI BI) |       | (Data Science)|
+---------------+           +---------------+       +---------------+
       |                           |                       |
       +---------------------------+-----------------------+
                                   |
                                   v
+----------------------------------------------------------------------------+
|                        CENTRAL STORAGE LAYER                               |
|              Micro-Partitions on S3 / Azure Blob / GCS                     |
+----------------------------------------------------------------------------+
            </div>

            <h2>Comprehensive Chapter Guide</h2>
            <div class="grid-2">
              <div class="grid-card">
                <h3>Part I: Engine & Storage</h3>
                <p>• Ch 3: Virtual Warehouse Sizing<br>
                • Ch 4: Micro-Partitions & Pruning<br>
                • Ch 5: Cloud Services Layer<br>
                • Ch 6: Snowpipe & Streaming<br>
                • Ch 7: Streams & Task Pipelines</p>
              </div>
              <div class="grid-card">
                <h3>Part II: Data Management</h3>
                <p>• Ch 8: Zero-Copy Cloning Sandboxes<br>
                • Ch 9: Time Travel & Fail-safe<br>
                • Ch 10: Semi-Structured JSON/VARIANT<br>
                • Ch 11: FinOps Credit Governance<br>
                • Ch 12: Account Usage Analytics</p>
              </div>
            </div>
            <p><strong>Part III: Enterprise Security & Governance:</strong> Ch 13 Snowpark & Python, Ch 14 Secure Data Sharing, Ch 15 RBAC Role Hierarchies, Ch 16 Dynamic Data Masking & Row Access, Ch 17 Cross-Cloud Disaster Recovery, Ch 18 Query Profile Deep Dive, Ch 19 E-Commerce FinOps Case Study, Ch 20 Cost Traps, Ch 21 SQL Diagnostic Scripts, Ch 22 SnowPro Architect Audit Checklist.</p>
            """
        },
        # PAGE 3: Virtual Warehouses Sizing
        {
            "badge": "Chapter 01",
            "h1": "Virtual Warehouses: Sizing & Multi-Cluster Scaling",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">COMPUTE ARCHITECTURE</span>
              A Virtual Warehouse is an MPP compute cluster allocated on demand. Warehouses do not store persistent data; they execute SQL queries, transform data, and populate local SSD caches.
            </div>

            <h2>Warehouse T-Shirt Sizes & Credit Burn Rate</h2>
            <p>Each size increase exactly doubles compute capacity and credit burn per operating hour:</p>
            <table class="table-box">
              <tr>
                <th>T-Shirt Size</th>
                <th>Compute Nodes</th>
                <th>Credits / Hour</th>
                <th>Ideal Production Workload</th>
              </tr>
              <tr>
                <td>X-Small</td>
                <td>1 node</td>
                <td>1 credit</td>
                <td>Staging ingestion, lightweight dbt tests, ad-hoc queries</td>
              </tr>
              <tr>
                <td>Small</td>
                <td>2 nodes</td>
                <td>2 credits</td>
                <td>Standard departmental reporting, single-table aggregations</td>
              </tr>
              <tr>
                <td>Medium</td>
                <td>4 nodes</td>
                <td>4 credits</td>
                <td>Daily batch dbt transformation runs, multi-table joins</td>
              </tr>
              <tr>
                <td>Large / X-Large</td>
                <td>8 – 16 nodes</td>
                <td>8 – 16 credits</td>
                <td>High-volume historical backfills, 500M+ row fact builds</td>
              </tr>
            </table>

            <h2>Multi-Cluster Auto-Scaling</h2>
            <p>Scaling 'Up' (larger T-shirt size) speeds up large individual queries. Scaling 'Out' (adding clusters to a multi-cluster warehouse) handles concurrency spikes without query queuing.</p>
            <div class="code-box">
              <div class="code-header"><span>create_multi_cluster_wh.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">CREATE WAREHOUSE</span> bi_reporting_wh
  <span class="code-keyword">WITH WAREHOUSE_SIZE</span> = <span class="code-str">'MEDIUM'</span>
  <span class="code-keyword">MIN_CLUSTER_COUNT</span> = 1
  <span class="code-keyword">MAX_CLUSTER_COUNT</span> = 5
  <span class="code-keyword">SCALING_POLICY</span> = <span class="code-str">'STANDARD'</span>
  <span class="code-keyword">AUTO_SUSPEND</span> = 60           <span class="code-comment">-- Suspend after 60 seconds of idle time</span>
  <span class="code-keyword">AUTO_RESUME</span> = <span class="code-keyword">TRUE</span>
  <span class="code-keyword">INITIALLY_SUSPENDED</span> = <span class="code-keyword">TRUE</span>;</div>
            </div>
            """
        },
        # PAGE 4: Storage Internals: Micro-Partitions
        {
            "badge": "Chapter 02",
            "h1": "Storage Layer Internals: Micro-Partitions & Pruning",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">STORAGE INTERNALS</span>
              Snowflake stores all data in immutable, compressed, columnar files called <strong>Micro-Partitions</strong>. Each micro-partition contains between 50MB and 500MB of uncompressed data.
            </div>

            <h2>How Metadata Drives Micro-Partition Pruning</h2>
            <p>During data ingestion, the Cloud Services Layer automatically extracts metadata for each micro-partition: min/max values for every column, null counts, and distinct value distributions. When a query executes with a filter, Snowflake consults metadata and skips unneeded micro-partitions entirely without reading them from storage.</p>

            <div class="diagram-box">
+-------------------------------------------------------------+
| QUERY: SELECT * FROM sales WHERE sale_date = '2026-10-28'    |
+-------------------------------------------------------------+
                               |
            [ Cloud Services Metadata Inspection ]
                               |
         +---------------------+---------------------+
         | (Min: 2026-10-01)   | (Min: 2026-10-25)   | (Min: 2026-11-01)
         | (Max: 2026-10-15)   | (Max: 2026-10-31)   | (Max: 2026-11-15)
         | Micro-Partition 1   | Micro-Partition 2   | Micro-Partition 3
         +---------------------+---------------------+---------------------+
         |     [ PRUNED ]      |     [ SCANNED ]     |     [ PRUNED ]      |
         |    (Zero I/O)       |   (1 Partition Read)|    (Zero I/O)       |
         +---------------------+---------------------+---------------------+
            </div>

            <h2>Explicit Clustering Keys</h2>
            <p>For tables &gt; 1TB where queries filter on columns other than the natural ingestion sequence, define a clustering key:</p>
            <div class="code-box">
              <div class="code-header"><span>cluster_key_ddl.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">ALTER TABLE</span> core.sales.fact_transactions 
<span class="code-keyword">CLUSTER BY</span> (transaction_date, region_id);</div>
            </div>
            """
        },
        # PAGE 5: Cloud Services Layer
        {
            "badge": "Chapter 03",
            "h1": "The Cloud Services Layer: Optimization & Billing",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">THE BRAIN OF SNOWFLAKE</span>
              The Cloud Services Layer ties the platform together: authenticating connections, parsing and optimizing SQL queries, managing ACID transactions, and tracking metadata security policies.
            </div>

            <h2>Free vs. Billable Cloud Services</h2>
            <p>Snowflake provides free Cloud Services compute up to <strong>10% of total daily Virtual Warehouse spend</strong>. If an enterprise consumes 100 warehouse credits in a day, up to 10 Cloud Services credits are completely waived.</p>

            <table class="table-box">
              <tr>
                <th>Operation Type</th>
                <th>Layer Consumed</th>
                <th>Cost Profile</th>
              </tr>
              <tr>
                <td><code>SELECT COUNT(*) FROM table</code></td>
                <td>Cloud Services Only</td>
                <td>Zero warehouse credits; resolved instantly from metadata</td>
              </tr>
              <tr>
                <td>Zero-Copy Clone</td>
                <td>Cloud Services Only</td>
                <td>Zero storage or warehouse cost; updates metadata pointers</td>
              </tr>
              <tr>
                <td>Query Compilation & Optimization</td>
                <td>Cloud Services</td>
                <td>Waived within 10% daily credit allowance</td>
              </tr>
              <tr>
                <td>High-frequency <code>SHOW TABLES</code> polling</td>
                <td>Cloud Services Only</td>
                <td>Can trigger billable overage if polling exceeds 10% allowance</td>
              </tr>
            </table>

            <div class="callout callout-tip">
              <span class="callout-title">FINOPS ALERT</span>
              BI tools or third-party orchestration tools that issue <code>SHOW OBJECTS</code> every 5 seconds can inflate Cloud Services consumption beyond the 10% threshold, generating surprise bills.
            </div>
            """
        },
        # PAGE 6: Ingestion Pipelines: Snowpipe & Streaming
        {
            "badge": "Chapter 04",
            "h1": "Continuous Ingestion: Snowpipe & Snowpipe Streaming",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">REAL-TIME INGESTION</span>
              Snowpipe is Snowflake's serverless continuous ingestion service. It listens for cloud storage notifications (S3 SQS, Azure Event Grid) and loads newly arrived micro-batches automatically without user warehouse compute.
            </div>

            <h2>Configuring an Automated Snowpipe</h2>
            <div class="code-box">
              <div class="code-header"><span>create_snowpipe.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">CREATE OR REPLACE PIPE</span> raw.ingestion.pipe_web_clicks
  <span class="code-keyword">AUTO_INGEST</span> = <span class="code-keyword">TRUE</span>
  <span class="code-keyword">INTEGRATION</span> = <span class="code-str">'AZURE_STORAGE_NOTIFICATION'</span>
<span class="code-keyword">AS</span>
<span class="code-keyword">COPY INTO</span> raw.events.web_clicks
<span class="code-keyword">FROM</span> @raw.stages.stage_azure_clicks
<span class="code-keyword">FILE_FORMAT</span> = (TYPE = <span class="code-str">'JSON'</span>)
<span class="code-keyword">ON_ERROR</span> = <span class="code-str">'CONTINUE'</span>;</div>
            </div>

            <h2>Snowpipe vs. Snowpipe Streaming</h2>
            <table class="table-box">
              <tr>
                <th>Capability</th>
                <th>Traditional Snowpipe</th>
                <th>Snowpipe Streaming (SDK)</th>
              </tr>
              <tr>
                <td>Data Transit</td>
                <td>Writes files to S3/Blob first</td>
                <td>Direct streaming from Kafka/Java SDK</td>
              </tr>
              <tr>
                <td>Ingestion Latency</td>
                <td>30 seconds – 2 minutes</td>
                <td>Sub-second (&lt; 1 second)</td>
              </tr>
              <tr>
                <td>Cost Model</td>
                <td>Per-file serverless compute fee</td>
                <td>Direct micro-partition row ingestion</td>
              </tr>
            </table>
            """
        },
        # PAGE 7: Streams & Tasks
        {
            "badge": "Chapter 05",
            "h1": "Continuous Data Pipelines: Streams & Tasks",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">SERVERLESS CDC</span>
              Snowflake Streams record Change Data Capture (CDC) deltas against source tables, while Tasks execute scheduled SQL transformations, creating automated ELT pipelines natively within Snowflake.
            </div>

            <h2>Creating an Append-Only Stream</h2>
            <div class="code-box">
              <div class="code-header"><span>streams_and_tasks.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- 1. Create CDC stream tracking new insertions</span>
<span class="code-keyword">CREATE OR REPLACE STREAM</span> raw.events.stream_raw_orders 
<span class="code-keyword">ON TABLE</span> raw.events.orders
<span class="code-keyword">APPEND_ONLY</span> = <span class="code-keyword">TRUE</span>;

<span class="code-comment">-- 2. Create serverless scheduled task that executes only when data is pending</span>
<span class="code-keyword">CREATE OR REPLACE TASK</span> core.tasks.task_process_orders
  <span class="code-keyword">USER_TASK_MANAGED_INITIAL_WAREHOUSE_SIZE</span> = <span class="code-str">'XSMALL'</span>
  <span class="code-keyword">SCHEDULE</span> = <span class="code-str">'5 MINUTE'</span>
  <span class="code-keyword">WHEN</span> <span class="code-func">SYSTEM$STREAM_HAS_DATA</span>(<span class="code-str">'raw.events.stream_raw_orders'</span>)
<span class="code-keyword">AS</span>
<span class="code-keyword">INSERT INTO</span> core.sales.fact_orders (order_id, customer_id, amount, processed_at)
<span class="code-keyword">SELECT</span> order_id, customer_id, amount, <span class="code-func">CURRENT_TIMESTAMP</span>()
<span class="code-keyword">FROM</span> raw.events.stream_raw_orders;

<span class="code-comment">-- 3. Resume the newly created task</span>
<span class="code-keyword">ALTER TASK</span> core.tasks.task_process_orders <span class="code-keyword">RESUME</span>;</div>
            </div>

            <h2>Why <code>SYSTEM$STREAM_HAS_DATA</code> Saves Thousands</h2>
            <p>Without the <code>WHEN</code> condition, a task scheduled every 5 minutes spins up warehouse compute 288 times a day even when zero rows arrive. <code>SYSTEM$STREAM_HAS_DATA</code> checks stream metadata in Cloud Services for free, firing warehouse compute only when real data exists.</p>
            """
        },
        # PAGE 8: Zero-Copy Cloning
        {
            "badge": "Chapter 06",
            "h1": "Zero-Copy Cloning: Sandboxes & Dev Environments",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">METADATA-ONLY CLONING</span>
              Zero-Copy Cloning creates instant copies of databases, schemas, or tables without duplicating physical storage micro-partitions. Clones are fully independent, read/write sandboxes.
            </div>

            <h2>Instant Multi-Terabyte Production Clones</h2>
            <div class="code-box">
              <div class="code-header"><span>zero_copy_cloning.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Clone a 10TB production database in 3 seconds for staging tests</span>
<span class="code-keyword">CREATE DATABASE</span> staging_sandbox 
<span class="code-keyword">CLONE</span> production_db;

<span class="code-comment">-- Clone table at an exact historical timestamp (Time Travel + Clone)</span>
<span class="code-keyword">CREATE TABLE</span> dev.finance.fact_revenue_clone
<span class="code-keyword">CLONE</span> prod.finance.fact_revenue
<span class="code-keyword">AT</span> (TIMESTAMP => <span class="code-str">'2026-10-28 10:00:00 -0700'</span>::timestamp_tz);</div>
            </div>

            <h2>Copy-on-Write Storage Economics</h2>
            <div class="diagram-box">
[ PROD_DB ] ---> [ Micro-Partition A ] [ Micro-Partition B ] [ Micro-Partition C ]
                        ^                     ^                     ^
                        |                     |                     |
[ DEV_CLONE ] ----------+---------------------+---------------------+
           (Initially consumes 0 bytes of additional storage!)
           
When DEV modifies row in B:
[ DEV_CLONE ] ---> [ Micro-Partition A ] [ Modified Part B* ] [ Micro-Partition C ]
           (Only newly written blocks incur storage fees!)
            </div>
            """
        },
        # PAGE 9: Time Travel & Fail-safe
        {
            "badge": "Chapter 07",
            "h1": "Time Travel & Fail-Safe: Disaster Protection",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DATA RECOVERY</span>
              Snowflake's immutable micro-partition architecture provides native point-in-time historical querying, table restoration, and catastrophic disaster recovery through Time Travel and Fail-safe.
            </div>

            <h2>Time Travel Recovery Mechanics</h2>
            <p>Standard tables support up to 90 days of Time Travel (Enterprise Edition). If an engineer accidentally runs <code>DROP TABLE customers;</code> or corrupts data with an unconstrained UPDATE, the table can be restored in seconds:</p>

            <div class="code-box">
              <div class="code-header"><span>time_travel_restoration.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- 1. Restore an accidentally dropped table instantly</span>
<span class="code-keyword">UNDROP TABLE</span> core.crm.customers;

<span class="code-comment">-- 2. Query table as it existed before a rogue transaction executed</span>
<span class="code-keyword">SELECT</span> * <span class="code-keyword">FROM</span> core.crm.customers
<span class="code-keyword">BEFORE</span> (STATEMENT => <span class="code-str">'01b34a90-0001-44ab-0002-89cd00034a12'</span>);</div>
            </div>

            <h2>Fail-Safe: The 7-Day Safety Net</h2>
            <p>Once Time Travel expires, data enters a non-configurable 7-day <strong>Fail-safe</strong> window. Fail-safe is accessible only by Snowflake Support for disaster recovery (e.g. recovering from regional storage cataclysms). Customers pay standard storage fees for Fail-safe historical blocks.</p>
            <div class="callout callout-tip">
              <span class="callout-title">STORAGE OPTIMIZATION</span>
              Use <code>TRANSIENT</code> or <code>TEMPORARY</code> tables for ETL staging layers. Transient tables have 0 or 1 day of Time Travel and ZERO Fail-safe, slashing intermediate storage costs by 80%.
            </div>
            """
        },
        # PAGE 10: Semi-Structured Data: VARIANT & FLATTEN
        {
            "badge": "Chapter 08",
            "h1": "Semi-Structured Data: VARIANT, OBJECT & FLATTEN",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">POLYMORPHIC JSON MASTERY</span>
              Snowflake treats semi-structured data (JSON, Avro, Parquet, XML) as a first-class citizen using the native <code>VARIANT</code> datatype. The engine automatically shreds nested JSON elements into columnar micro-partitions under the hood.
            </div>

            <h2>Dot-Notation & Path Traversal</h2>
            <div class="code-box">
              <div class="code-header"><span>query_json_variant.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Extracting scalar values and casting types from VARIANT column</span>
<span class="code-keyword">SELECT</span>
    raw_payload:order_id::<span class="code-keyword">INT</span> <span class="code-keyword">AS</span> order_id,
    raw_payload:customer.email::<span class="code-keyword">VARCHAR</span> <span class="code-keyword">AS</span> customer_email,
    raw_payload:meta.tags[0]::<span class="code-keyword">VARCHAR</span> <span class="code-keyword">AS</span> primary_tag
<span class="code-keyword">FROM</span> raw.events.orders_stream;</div>
            </div>

            <h2>Exploding Arrays with the FLATTEN Table Function</h2>
            <p>When JSON payloads contain nested arrays (e.g. line items within an invoice), the <code>FLATTEN</code> function explodes array elements into relational rows:</p>
            <div class="code-box">
              <div class="code-header"><span>flatten_json_array.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">SELECT</span>
    o.raw_payload:order_id::<span class="code-keyword">INT</span> <span class="code-keyword">AS</span> order_id,
    item.value:item_sku::<span class="code-keyword">VARCHAR</span> <span class="code-keyword">AS</span> item_sku,
    item.value:quantity::<span class="code-keyword">INT</span> <span class="code-keyword">AS</span> quantity,
    item.value:unit_price::<span class="code-keyword">DECIMAL(10,2)</span> <span class="code-keyword">AS</span> unit_price
<span class="code-keyword">FROM</span> raw.events.orders_stream o,
<span class="code-keyword">LATERAL FLATTEN</span>(input => o.raw_payload:line_items) item;</div>
            </div>
            """
        },
        # PAGE 11: FinOps: Credit Quotas & Resource Monitors
        {
            "badge": "Chapter 09",
            "h1": "Snowflake FinOps: Credit Quotas & Governance",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">FINANCIAL GOVERNANCE</span>
              Without automated guardrails, an accidental infinite Cartesian join running on an X-Large warehouse will burn hundreds of dollars before morning. Resource Monitors provide automated circuit breakers.
            </div>

            <h2>Deploying a Tiered Resource Monitor</h2>
            <div class="code-box">
              <div class="code-header"><span>resource_monitor_ddl.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">CREATE OR REPLACE RESOURCE MONITOR</span> rm_analytics_monthly
  <span class="code-keyword">WITH CREDIT_QUOTA</span> = 2000
  <span class="code-keyword">FREQUENCY</span> = <span class="code-str">'MONTHLY'</span>
  <span class="code-keyword">START_TIMESTAMP</span> = <span class="code-str">'IMMEDIATELY'</span>
  <span class="code-keyword">TRIGGERS</span>
    <span class="code-keyword">ON</span> 75 <span class="code-keyword">PERCENT DO NOTIFY</span>
    <span class="code-keyword">ON</span> 90 <span class="code-keyword">PERCENT DO NOTIFY</span>
    <span class="code-keyword">ON</span> 100 <span class="code-keyword">PERCENT DO SUSPEND</span>              <span class="code-comment">-- Let active queries finish, block new ones</span>
    <span class="code-keyword">ON</span> 110 <span class="code-keyword">PERCENT DO SUSPEND_IMMEDIATELY</span>;  <span class="code-comment">-- Kill all active queries immediately</span>

<span class="code-keyword">ALTER WAREHOUSE</span> bi_reporting_wh 
<span class="code-keyword">SET RESOURCE_MONITOR</span> = rm_analytics_monthly;</div>
            </div>

            <h2>Query Timeout Safety Bounds</h2>
            <p>Set <code>STATEMENT_TIMEOUT_IN_SECONDS = 1800</code> (30 minutes) at the warehouse level. If a rogue query hangs or blocks on table locks, Snowflake terminates the query after 30 minutes, preventing 24-hour idle runaway charges.</p>
            """
        },
        # PAGE 12: Account Usage Views & Monitoring
        {
            "badge": "Chapter 10",
            "h1": "Account Usage Views & Cost Diagnostics",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">OBSERVABILITY</span>
              The <code>SNOWFLAKE.ACCOUNT_USAGE</code> schema provides 365 days of historical audit telemetry, query execution profiles, and billing breakdowns queryable directly with SQL.
            </div>

            <h2>Top 5 Most Expensive Queries in the Past 30 Days</h2>
            <div class="code-box">
              <div class="code-header"><span>top_expensive_queries.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">SELECT</span>
    query_id,
    user_name,
    warehouse_name,
    execution_time / 1000 <span class="code-keyword">AS</span> execution_seconds,
    <span class="code-func">SUBSTRING</span>(query_text, 1, 80) <span class="code-keyword">AS</span> truncated_query,
    bytes_scanned / 1024 / 1024 / 1024 <span class="code-keyword">AS</span> gb_scanned
<span class="code-keyword">FROM</span> snowflake.account_usage.query_history
<span class="code-keyword">WHERE</span> start_time >= <span class="code-func">DATEADD</span>(<span class="code-str">'day'</span>, -30, <span class="code-func">CURRENT_TIMESTAMP</span>())
<span class="code-keyword">ORDER BY</span> execution_time <span class="code-keyword">DESC</span>
<span class="code-keyword">LIMIT</span> 5;</div>
            </div>

            <h2>Warehouse Metering by Department</h2>
            <div class="code-box">
              <div class="code-header"><span>warehouse_spend_breakdown.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">SELECT</span>
    warehouse_name,
    <span class="code-func">DATE_TRUNC</span>(<span class="code-str">'month'</span>, start_time) <span class="code-keyword">AS</span> billing_month,
    <span class="code-func">SUM</span>(credits_used) <span class="code-keyword">AS</span> total_credits,
    <span class="code-func">ROUND</span>(<span class="code-func">SUM</span>(credits_used) * 3.00, 2) <span class="code-keyword">AS</span> estimated_cost_usd
<span class="code-keyword">FROM</span> snowflake.account_usage.warehouse_metering_history
<span class="code-keyword">WHERE</span> start_time >= <span class="code-func">DATEADD</span>(<span class="code-str">'month'</span>, -3, <span class="code-func">CURRENT_TIMESTAMP</span>())
<span class="code-keyword">GROUP BY ALL</span>
<span class="code-keyword">ORDER BY</span> total_credits <span class="code-keyword">DESC</span>;</div>
            </div>
            """
        },
        # PAGE 13: Snowpark & Python Workflows
        {
            "badge": "Chapter 11",
            "h1": "Snowpark Python & Stored Procedures",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">NATIVE PYTHON EXECUTION</span>
              Snowpark executes Python, Java, and Scala code securely within Snowflake's virtual warehouse sandbox. DataFrames compile into lazy SQL expressions, executing data transformations directly in the engine without data extraction.
            </div>

            <h2>Building a Snowpark Data Pipeline</h2>
            <div class="code-box">
              <div class="code-header"><span>snowpark_pipeline.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">from</span> snowflake.snowpark <span class="code-keyword">import</span> Session
<span class="code-keyword">from</span> snowflake.snowpark.functions <span class="code-keyword">import</span> col, when, current_timestamp

<span class="code-keyword">def</span> <span class="code-func">cleanse_orders</span>(session: Session) -> <span class="code-keyword">str</span>:
    <span class="code-comment"># Lazy DataFrame definition - zero data moved to local client!</span>
    df = session.table(<span class="code-str">"raw.sales.orders"</span>)
    
    df_transformed = df.filter(<span class="code-func">col</span>(<span class="code-str">"order_status"</span>) == <span class="code-str">"COMPLETED"</span>) \\
        .with_column(<span class="code-str">"net_usd"</span>, <span class="code-func">col</span>(<span class="code-str">"amount"</span>) * 0.95) \\
        .with_column(<span class="code-str">"processed_at"</span>, <span class="code-func">current_timestamp</span>())
        
    <span class="code-comment"># Writes directly to target Snowflake table in warehouse memory</span>
    df_transformed.write.mode(<span class="code-str">"append"</span>).save_as_table(<span class="code-str">"core.sales.orders_clean"</span>)
    <span class="code-keyword">return</span> <span class="code-str">"Successfully cleansed orders"</span></div>
            </div>

            <h2>Deploying as an In-Engine Stored Procedure</h2>
            <div class="code-box">
              <div class="code-header"><span>register_procedure.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">CREATE OR REPLACE PROCEDURE</span> core.sales.sp_cleanse_orders()
  <span class="code-keyword">RETURNS STRING</span>
  <span class="code-keyword">LANGUAGE PYTHON</span>
  <span class="code-keyword">RUNTIME_VERSION</span> = <span class="code-str">'3.10'</span>
  <span class="code-keyword">PACKAGES</span> = (<span class="code-str">'snowflake-snowpark-python'</span>)
  <span class="code-keyword">HANDLER</span> = <span class="code-str">'cleanse_orders'</span>
  <span class="code-keyword">AS</span> <span class="code-str">$$
# Inline python function definition
$$</span>;</div>
            </div>
            """
        },
        # PAGE 14: Secure Data Sharing & Clean Rooms
        {
            "badge": "Chapter 12",
            "h1": "Secure Data Sharing & Data Clean Rooms",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ZERO DATA MOVEMENT</span>
              Traditional data sharing relies on brittle SFTP exports or REST APIs that duplicate data and leak control. Snowflake Secure Data Sharing grants external consumers direct read access to live data without copying files.
            </div>

            <h2>Creating a Secure Share</h2>
            <div class="code-box">
              <div class="code-header"><span>secure_share_producer.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Producer: Create share and grant read permissions</span>
<span class="code-keyword">CREATE SHARE</span> vendor_partner_share;
<span class="code-keyword">GRANT USAGE ON DATABASE</span> core_analytics <span class="code-keyword">TO SHARE</span> vendor_partner_share;
<span class="code-keyword">GRANT USAGE ON SCHEMA</span> core_analytics.partner_feeds <span class="code-keyword">TO SHARE</span> vendor_partner_share;
<span class="code-keyword">GRANT SELECT ON TABLE</span> core_analytics.partner_feeds.daily_inventory <span class="code-keyword">TO SHARE</span> vendor_partner_share;

<span class="code-comment">-- Add consumer Snowflake account locator</span>
<span class="code-keyword">ALTER SHARE</span> vendor_partner_share <span class="code-keyword">ADD ACCOUNTS</span> = xy12345.eu-west-1;</div>
            </div>

            <h2>Consumer Experience</h2>
            <p>The consumer account executes: <code>CREATE DATABASE partner_inventory FROM SHARE myorg.account.vendor_partner_share;</code>. The database is instantly queryable. The producer pays for storage; the consumer pays for their own query compute.</p>
            """
        },
        # PAGE 15: Role-Based Access Control (RBAC)
        {
            "badge": "Chapter 13",
            "h1": "RBAC: System Roles & Functional Hierarchies",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">SECURITY GOVERNANCE</span>
              Snowflake enforces a strict, hierarchical Role-Based Access Control (RBAC) model. Designing functional and access role hierarchies prevents permission chaos and privilege escalation.
            </div>

            <div class="diagram-box">
+-------------------------------------------------------------+
|               ACCOUNTADMIN (Ultimate Authority)             |
+-------------------------------------------------------------+
              ^                               ^
              |                               |
+---------------------------+   +---------------------------+
|         SYSADMIN          |   |        SECURITYADMIN      |
| (Creates Objects/WH/DB)   |   |   (Manages Users/Roles)   |
+---------------------------+   +---------------------------+
              ^                               ^
              |                               |
+-------------------------------------------------------------+
|         FUNCTIONAL ROLE: BI_ANALYST_ROLE                    |
+-------------------------------------------------------------+
              ^                               ^
              |                               |
+---------------------------+   +---------------------------+
|  ACCESS ROLE: AR_CORE_R   |   |  ACCESS ROLE: AR_FIN_R    |
|  (SELECT on core tables)  |   |  (SELECT on finance views)|
+---------------------------+   +---------------------------+
            </div>

            <h2>The Functional vs Access Role Rule</h2>
            <ul>
              <li><strong>Access Roles (AR):</strong> Granted direct permissions on database objects (e.g. <code>GRANT SELECT ON ALL TABLES IN SCHEMA sales TO ROLE ar_sales_read</code>). Never assigned directly to users.</li>
              <li><strong>Functional Roles (FR):</strong> Model job functions (e.g. <code>bi_developer</code>, <code>finance_analyst</code>). Inherit multiple Access Roles and are granted directly to end-users.</li>
            </ul>
            """
        },
        # PAGE 16: Dynamic Data Masking & Row Access
        {
            "badge": "Chapter 14",
            "h1": "Dynamic Data Masking & Row Access Policies",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">GRANULAR SECURITY</span>
              Dynamic Data Masking and Row Access Policies (RAP) evaluate user roles at query runtime, masking sensitive PII columns or filtering rows on the fly without duplicating underlying physical tables.
            </div>

            <h2>Dynamic Masking Policy: Hashing Emails</h2>
            <div class="code-box">
              <div class="code-header"><span>masking_policy.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">CREATE OR REPLACE MASKING POLICY</span> core.security.mask_email <span class="code-keyword">AS</span> (val <span class="code-keyword">VARCHAR</span>) 
<span class="code-keyword">RETURNS VARCHAR</span> ->
  <span class="code-keyword">CASE</span>
    <span class="code-keyword">WHEN CURRENT_ROLE</span>() <span class="code-keyword">IN</span> (<span class="code-str">'COMPLIANCE_OFFICER'</span>, <span class="code-str">'ACCOUNTADMIN'</span>) <span class="code-keyword">THEN</span> val
    <span class="code-keyword">ELSE REGEXP_REPLACE</span>(val, <span class="code-str">'(^.).*(@.*$)'</span>, <span class="code-str">'\\\\1***\\\\2'</span>) <span class="code-comment">-- e.g. j***@company.com</span>
  <span class="code-keyword">END</span>;

<span class="code-comment">-- Apply policy to column</span>
<span class="code-keyword">ALTER TABLE</span> core.crm.customers 
<span class="code-keyword">MODIFY COLUMN</span> email <span class="code-keyword">SET MASKING POLICY</span> core.security.mask_email;</div>
            </div>

            <h2>Row Access Policy: Multi-Tenant Region Isolation</h2>
            <div class="code-box">
              <div class="code-header"><span>row_access_policy.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">CREATE OR REPLACE ROW ACCESS POLICY</span> core.security.rap_region <span class="code-keyword">AS</span> (region_code <span class="code-keyword">VARCHAR</span>)
<span class="code-keyword">RETURNS BOOLEAN</span> ->
  <span class="code-keyword">CURRENT_ROLE</span>() = <span class="code-str">'GLOBAL_ADMIN'</span> <span class="code-keyword">OR</span>
  region_code = <span class="code-func">CURRENT_USER</span>();</div>
            </div>
            """
        },
        # PAGE 17: Disaster Recovery: Cross-Cloud Replication
        {
            "badge": "Chapter 15",
            "h1": "Disaster Recovery: Cross-Cloud & Region Replication",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">BUSINESS CONTINUITY</span>
              Snowflake's cloud-agnostic architecture enables continuous database replication across cloud providers (AWS, Azure, GCP) and geographical regions, guaranteeing failover survival during major public cloud outages.
            </div>

            <h2>Configuring Account Replication</h2>
            <div class="code-box">
              <div class="code-header"><span>cross_cloud_replication.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- In Primary Account (AWS us-east-1)</span>
<span class="code-keyword">ALTER DATABASE</span> core_sales_db 
<span class="code-keyword">ENABLE REPLICATION TO ACCOUNTS</span> myorg.azure_westeurope_account;

<span class="code-comment">-- In Secondary Account (Azure westeurope)</span>
<span class="code-keyword">CREATE DATABASE</span> core_sales_db 
<span class="code-keyword">AS REPLICA OF</span> myorg.aws_useast1_account.core_sales_db;

<span class="code-comment">-- Execute initial synchronization refresh</span>
<span class="code-keyword">ALTER DATABASE</span> core_sales_db <span class="code-keyword">REFRESH</span>;</div>
            </div>

            <h2>Failover & RTO/RPO Metrics</h2>
            <ul>
              <li><strong>RTO (Recovery Time Objective):</strong> &lt; 5 minutes. Execute <code>ALTER DATABASE core_sales_db PRIMARY;</code> to promote secondary database instantly.</li>
              <li><strong>RPO (Recovery Point Objective):</strong> Bounded by replication refresh schedules (e.g. 15 minutes).</li>
            </ul>
            """
        },
        # PAGE 18: Query Profile Analysis
        {
            "badge": "Chapter 16",
            "h1": "Query Profile Analysis: Exploding Joins & Spills",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DIAGNOSTIC MASTERY</span>
              Snowflake's visual Query Profile breaks down physical execution metrics: percentage of time spent in processing, local disk spilling, remote storage spilling, and micro-partition pruning efficiency.
            </div>

            <h2>Key Performance Red Flags in Query Profiles</h2>
            <table class="table-box">
              <tr>
                <th>Profile Metric Indicator</th>
                <th>Underlying Architecture Bottleneck</th>
                <th>Remediation Action</th>
              </tr>
              <tr>
                <td><code>Spilling to local storage: 120GB</code></td>
                <td>Data for hash joins or aggregations exceeds virtual warehouse RAM</td>
                <td>Increase warehouse T-shirt size (Medium -> Large)</td>
              </tr>
              <tr>
                <td><code>Spilling to remote storage: 45GB</code></td>
                <td>Local SSD cache exhausted; writing temporary blocks to S3/Blob! Severe 10x penalty!</td>
                <td>Immediate resize to larger warehouse; refactor exploding joins</td>
              </tr>
              <tr>
                <td><code>Partitions scanned: 4,000 / 4,000 (0% pruned)</code></td>
                <td>Query filters on unclustered columns; full table scan executed</td>
                <td>Define clustering key or filter on ingestion timestamp</td>
              </tr>
              <tr>
                <td><code>Join operator outputs 50x input rows</code></td>
                <td>Cartesian product or non-unique join keys exploding cardinality</td>
                <td>Deduplicate dimension keys; review join predicates</td>
              </tr>
            </table>

            <div class="callout callout-tip">
              <span class="callout-title">REMOTE SPILL HEURISTIC</span>
              If a query spills to <em>remote</em> storage, resizing the warehouse to double its size usually cuts execution time by 75% while burning virtually the same total net credits.
            </div>
            """
        },
        # PAGE 19: Case Study: Global E-Commerce FinOps
        {
            "badge": "Chapter 17",
            "h1": "Production FinOps Case Study: $1.2M Cost Optimization",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ENTERPRISE CASE STUDY</span>
              A global retail e-commerce conglomerate saw annual Snowflake consumption surge from $400K to $1.8M. Implementing structured FinOps governance, auto-suspend tuning, and workload segregation reduced annual spend to $600K without degrading SLAs.
            </div>

            <h2>Phase 1: Workload Segregation</h2>
            <p>Discovered that 80 reporting analysts and 12 automated ETL ingestion tasks shared a single 24/7 running <code>X-LARGE</code> warehouse. Split into:</p>
            <ul>
              <li><code>ETL_WH</code> (Large, auto-suspend 60s, runs only during pipeline windows)</li>
              <li><code>BI_REPORTING_WH</code> (Medium multi-cluster 1-3, auto-suspend 60s)</li>
              <li><code>AD_HOC_WH</code> (Small, statement timeout 10 minutes)</li>
            </ul>

            <h2>Phase 2: Auto-Suspend Optimization</h2>
            <p>Default auto-suspend on 8 warehouses was set to 10 minutes (600s). Because Snowflake charges in 1-second increments after the initial 60 seconds, reducing auto-suspend to 60 seconds across all warehouses eliminated 400 idle credit hours monthly.</p>

            <h2>Phase 3: Transient Staging Tables</h2>
            <p>Converted 50TB of ephemeral staging tables to <code>TRANSIENT</code>, eliminating 7-day Fail-safe storage fees and saving $14,000 monthly on cloud storage invoices.</p>
            """
        },
        # PAGE 20: Common FinOps Traps
        {
            "badge": "Chapter 18",
            "h1": "Common Snowflake FinOps Traps & How to Avoid Them",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PITFALL PREVENTION</span>
              Avoid these 4 ubiquitous operational configuration mistakes that bleed enterprise budgets in Snowflake environments.
            </div>

            <table class="table-box">
              <tr>
                <th>FinOps Trap</th>
                <th>Why It Wastes Money</th>
                <th>Enforced Standard</th>
              </tr>
              <tr>
                <td><strong>Auto-Suspend &gt; 5 Minutes</strong></td>
                <td>Warehouses sit idle burning credits long after analysts close their dashboards</td>
                <td>Set <code>AUTO_SUSPEND = 60</code> on all interactive reporting warehouses</td>
              </tr>
              <tr>
                <td><strong>Over-Clustering Small Tables</strong></td>
                <td>Continuous Background Re-clustering burns serverless credits on tables &lt; 500GB</td>
                <td>Never cluster tables &lt; 250GB. Natural micro-partitioning is sufficient</td>
              </tr>
              <tr>
                <td><strong>Single Massive Shared Warehouse</strong></td>
                <td>A 10-second query keeps an X-Large warehouse alive for 60 seconds (16 credits/hr)</td>
                <td>Segregate workloads by warehouse size and operational domain</td>
              </tr>
              <tr>
                <td><strong>Infinite Time Travel on Stage Tables</strong></td>
                <td>Paying 90 days of storage + 7 days of Fail-safe on disposable intermediate dumps</td>
                <td>Set <code>DATA_RETENTION_TIME_IN_DAYS = 0</code> on staging schemas</td>
              </tr>
            </table>

            <h2>The Auto-Resume Ping Storm</h2>
            <p>BI tools querying Snowflake periodically to test connectivity (e.g. heartbeat pings) will wake up suspended warehouses every 3 minutes. Configure dedicated lightweight X-Small warehouses for connection polling.</p>
            """
        },
        # PAGE 21: Diagnostic SQL Queries
        {
            "badge": "Chapter 19",
            "h1": "Snowflake FinOps Diagnostic Queries & Dashboards",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DIAGNOSTIC RUNBOOK</span>
              Deploy these production SQL queries into your enterprise monitoring dashboards to track credit spikes and identify underutilized compute clusters.
            </div>

            <div class="code-box">
              <div class="code-header"><span>finops_diagnostic_queries.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- 1. Identify warehouses with highest idle credit waste</span>
<span class="code-keyword">SELECT</span>
    warehouse_name,
    <span class="code-func">SUM</span>(credits_used) <span class="code-keyword">AS</span> total_credits,
    <span class="code-func">SUM</span>(credits_used_compute) <span class="code-keyword">AS</span> compute_credits,
    <span class="code-func">SUM</span>(credits_used_cloud_services) <span class="code-keyword">AS</span> cloud_service_credits
<span class="code-keyword">FROM</span> snowflake.account_usage.warehouse_metering_history
<span class="code-keyword">WHERE</span> start_time >= <span class="code-func">DATEADD</span>(<span class="code-str">'day'</span>, -7, <span class="code-func">CURRENT_TIMESTAMP</span>())
<span class="code-keyword">GROUP BY</span> warehouse_name
<span class="code-keyword">ORDER BY</span> total_credits <span class="code-keyword">DESC</span>;

<span class="code-comment">-- 2. Detect queries that spilled to remote disk in the last 24 hours</span>
<span class="code-keyword">SELECT</span> query_id, user_name, warehouse_name, warehouse_size,
       bytes_spilled_to_remote_storage / 1024 / 1024 / 1024 <span class="code-keyword">AS</span> remote_spill_gb,
       execution_time / 1000 <span class="code-keyword">AS</span> execution_sec
<span class="code-keyword">FROM</span> snowflake.account_usage.query_history
<span class="code-keyword">WHERE</span> start_time >= <span class="code-func">DATEADD</span>(<span class="code-str">'hour'</span>, -24, <span class="code-func">CURRENT_TIMESTAMP</span>())
<span class="code-keyword">AND</span> bytes_spilled_to_remote_storage > 0
<span class="code-keyword">ORDER BY</span> remote_spill_gb <span class="code-keyword">DESC</span>
<span class="code-keyword">LIMIT</span> 10;</div>
            </div>
            """
        },
        # PAGE 22: SnowPro Architect Audit Checklist
        {
            "badge": "Chapter 20",
            "h1": "SnowPro Enterprise Architect Production Audit",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRE-FLIGHT ASSESSMENT</span>
              Verify every architectural standard across this checklist before certifying any Snowflake enterprise account for production workloads.
            </div>

            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Warehouse Boundaries:</strong> Workloads segregated across dedicated warehouses (ETL, BI, Ad-Hoc); all warehouses configured with <code>AUTO_SUSPEND &le; 60</code>.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Resource Monitors:</strong> Monthly credit quotas assigned to every warehouse with automatic suspend circuit breakers at 100% threshold.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Storage Optimization:</strong> Transient tables utilized for raw ETL staging; permanent tables configured with appropriate Time Travel retention policies.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Continuous Ingestion:</strong> Snowpipe pipelines configured with serverless notifications; streams and tasks protected with <code>SYSTEM$STREAM_HAS_DATA</code> guards.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>RBAC Discipline:</strong> Permissions granted via Functional & Access Role hierarchy; MFA enforced on all human users; ACCOUNTADMIN access audited.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Data Protection:</strong> Dynamic Data Masking applied to all PII attributes; cross-region disaster recovery replication verified.</div>
            </div>

            <div class="callout callout-tip" style="margin-top: 14px;">
              <span class="callout-title">AUTHOR CLOSING STATEMENT</span>
              Snowflake provides unmatched analytical agility when coupled with disciplined engineering governance. By decoupling compute workloads, automating ingestion pipelines, and enforcing strict FinOps boundaries, your organization scales analytical power while protecting financial margins.<br><br>
              <strong>Datta Sable</strong> · Enterprise Analytics & Data Architect · <em>dattasable.com</em>
            </div>
            """
        }
    ]
}
