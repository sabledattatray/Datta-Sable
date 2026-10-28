# scripts/ebook_generator/book3_postgres.py

BOOK_POSTGRES = {
    "slug": "postgresql-performance-tuning-dba-2026",
    "sku": "DS-EBOOK-PG-PERF-2026",
    "title": "PostgreSQL High-Performance Tuning & Database Administration",
    "cover_title_formatted": "PostgreSQL <span>High-Performance Tuning</span> & DBA Guide",
    "subtitle": "The comprehensive production manual for database administrators and senior engineers: shared_buffers sizing, autovacuum optimization, EXPLAIN BUFFERS mastery, PgBouncer pooling, and disaster recovery.",
    "category_name": "SQL & Databases",
    "category_slug": "sql-databases",
    "all_category_slugs": ["sql-databases", "devops-dataops"],
    "features": ["22-page PDF", "2026 Edition", "Production PostgreSQL 16/17 DBA Runbooks"],
    "included_resources": ["22-page PDF handbook"],
    "seo_title": "PostgreSQL High-Performance Tuning & Database Administration | 2026 Edition",
    "seo_desc": "22-page PostgreSQL performance tuning and DBA handbook by Datta Sable. Production autovacuum, memory sizing, PgBouncer, and HA Patroni architectures.",
    "pages": [
        # PAGE 2: Table of Contents & Architecture Topology
        {
            "badge": "Architecture Blueprint",
            "h1": "Table of Contents & PostgreSQL Node Topology",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">EXECUTIVE OVERVIEW</span>
              PostgreSQL powers mission-critical enterprise workloads globally. Operating PostgreSQL at high throughput (50,000+ transactions per second) requires deep mastery of shared memory structures, disk write-ahead log mechanics, indexing strategies, and automated connection pooling.
            </div>

            <div class="diagram-box">
+----------------------------------------------------------------------------+
|                          CLIENT APPLICATION POOL                           |
+----------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
|                   PGBOUNCER (Transaction Mode Pooler)                      |
+----------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
|                      POSTGRESQL INSTANCE ARCHITECTURE                      |
|                                                                            |
|  +---------------------------+  +---------------------------------------+  |
|  |     SHARED BUFFERS        |  |            WAL BUFFER & LOG           |  |
|  | (25% RAM In-Memory Cache) |  |   (Sequential Commit Log / fsync)     |  |
|  +---------------------------+  +---------------------------------------+  |
|                |                                    |                      |
|                v                                    v                      |
|  +---------------------------+  +---------------------------------------+  |
|  |   WORKER BACKEND MEMORY   |  |        BACKGROUND PROCESSES           |  |
|  |  work_mem / maint_work_mem|  |   Autovacuum, Checkpointer, BgWriter  |  |
|  +---------------------------+  +---------------------------------------+  |
+----------------------------------------------------------------------------+
            </div>

            <h2>Comprehensive Chapter Guide</h2>
            <div class="grid-2">
              <div class="grid-card">
                <h3>Part I: Engine & Storage</h3>
                <p>• Ch 3: Memory & shared_buffers<br>
                • Ch 4: WAL & Checkpoint Sizing<br>
                • Ch 5: Autovacuum & Bloat Mitigation<br>
                • Ch 6: Index Types (B-Tree, BRIN, GIN)<br>
                • Ch 7: Covering & Partial Indexes</p>
              </div>
              <div class="grid-card">
                <h3>Part II: Execution & Scale</h3>
                <p>• Ch 8: EXPLAIN BUFFERS Mastery<br>
                • Ch 9: Join Spills & Hash Work Mem<br>
                • Ch 10: Declarative Partitioning<br>
                • Ch 11: PgBouncer Pooling Topology<br>
                • Ch 12: Locks & Deadlock Defense</p>
              </div>
            </div>
            <p><strong>Part III: Enterprise Reliability:</strong> Ch 13 Streaming & Logical Replication, Ch 14 Patroni HA Failover, Ch 15 pgBackRest & PITR Recovery, Ch 16 pg_stat_statements & Plan Regression, Ch 17 Security Hardening & RLS, Ch 18 Linux Kernel sysctl Sizing, Ch 19 Corruption Recovery Case Study, Ch 20 Anti-Patterns, Ch 21 Emergency Runbook, Ch 22 Production Health Checklist.</p>
            """
        },
        # PAGE 3: Memory Architecture
        {
            "badge": "Chapter 01",
            "h1": "Memory Architecture: shared_buffers & work_mem",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">MEMORY SIZING INTERNALS</span>
              PostgreSQL relies on a dual-caching architecture: its internal shared_buffers cache works in tandem with the Linux operating system kernel page cache. Allocating memory requires balancing shared pools with per-query worker allocations.
            </div>

            <h2>The Memory Allocation Triad</h2>
            <ul>
              <li><strong>shared_buffers:</strong> Set to 25% of total server RAM for dedicated Linux database hosts (e.g. 16GB on a 64GB node). Setting it above 40% degrades performance due to double-buffering overhead and Linux page eviction contention.</li>
              <li><strong>work_mem:</strong> Memory allocated to <em>each individual sort, hash join, and aggregation operator</em> within a query. A query with 4 joins can consume 4x work_mem. Formula: <code>((Total RAM - shared_buffers) * 0.8) / (max_connections * 2)</code>.</li>
              <li><strong>maintenance_work_mem:</strong> Memory utilized during VACUUM, CREATE INDEX, and ALTER TABLE operations. Set to 1GB – 2GB on production systems to accelerate index builds.</li>
            </ul>

            <div class="code-box">
              <div class="code-header"><span>postgresql.conf</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># Production Memory Configuration for 64GB RAM Node</span>
shared_buffers = 16GB
effective_cache_size = 48GB
work_mem = 64MB
maintenance_work_mem = 2GB
max_connections = 200
temp_buffers = 32MB</div>
            </div>
            <div class="callout callout-warn">
              <span class="callout-title">OOM KILLER ALERT</span>
              If <code>max_connections = 1000</code> and <code>work_mem = 128MB</code>, a burst of complex queries can demand 128GB of RAM, triggering the Linux Out-Of-Memory (OOM) killer to terminate the PostgreSQL postmaster process instantly.
            </div>
            """
        },
        # PAGE 4: WAL & Checkpoints
        {
            "badge": "Chapter 02",
            "h1": "Write-Ahead Logging & Checkpoint Tuning",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">TRANSACTION DURABILITY</span>
              PostgreSQL writes all database modifications sequentially to the Write-Ahead Log (WAL) before updating data pages in shared_buffers. A Checkpoint flushes dirty memory buffers to disk to bound crash recovery time.
            </div>
            <p>Infrequent checkpoints maximize write throughput by smoothing I/O spikes, while overly frequent checkpoints trigger I/O saturation and write amplification.</p>

            <table class="table-box">
              <tr>
                <th>Configuration Parameter</th>
                <th>Default Setting</th>
                <th>Production Value</th>
                <th>Architectural Justification</th>
              </tr>
              <tr>
                <td><code>max_wal_size</code></td>
                <td>1GB</td>
                <td>32GB – 64GB</td>
                <td>Prevents premature checkpoint triggers during bulk ingestion</td>
              </tr>
              <tr>
                <td><code>min_wal_size</code></td>
                <td>80MB</td>
                <td>4GB – 8GB</td>
                <td>Re-uses pre-allocated WAL segments to avoid filesystem churn</td>
              </tr>
              <tr>
                <td><code>checkpoint_completion_target</code></td>
                <td>0.9</td>
                <td>0.9</td>
                <td>Spreads buffer writes across 90% of checkpoint interval</td>
              </tr>
              <tr>
                <td><code>checkpoint_timeout</code></td>
                <td>5min</td>
                <td>15min – 30min</td>
                <td>Reduces checkpoint frequency while maintaining recovery bounds</td>
              </tr>
            </table>

            <h2>Diagnosing Checkpoint Frequency</h2>
            <div class="code-box">
              <div class="code-header"><span>checkpoint_diagnostics.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Check if checkpoints are triggered by timeout or wal volume</span>
<span class="code-keyword">SELECT</span> 
    checkpoints_timed, 
    checkpoints_req, 
    checkpoint_write_time, 
    checkpoint_sync_time,
    <span class="code-func">ROUND</span>(checkpoints_req * 100.0 / (checkpoints_timed + checkpoints_req), 2) <span class="code-keyword">AS</span> pct_requested_checkpoints
<span class="code-keyword">FROM</span> pg_stat_bgwriter;</div>
            </div>
            <div class="callout callout-tip">
              <span class="callout-title">TUNING RULE</span>
              If <code>pct_requested_checkpoints</code> exceeds 10%, PostgreSQL is constantly running out of WAL capacity before reaching <code>checkpoint_timeout</code>. Increase <code>max_wal_size</code> immediately.
            </div>
            """
        },
        # PAGE 5: Vacuuming & Autovacuum Tuning
        {
            "badge": "Chapter 03",
            "h1": "Vacuuming, Bloat Mitigation & Autovacuum",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">MVCC MAINTENANCE</span>
              PostgreSQL's Multi-Version Concurrency Control (MVCC) never overwrites existing rows in-place. An UPDATE marks the original row as 'dead' and writes a new row version. Autovacuum reclaims dead tuple space and prevents transaction ID wraparound.
            </div>
            <p>Default autovacuum settings are famously conservative. On tables with 50 million rows, waiting for 20% of rows to die before triggering vacuum leads to catastrophic table bloat and disk exhaustion.</p>

            <div class="code-box">
              <div class="code-header"><span>autovacuum_production.conf</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># High-Throughput Autovacuum Tuning in postgresql.conf</span>
autovacuum = on
autovacuum_max_workers = 6
autovacuum_naptime = 15s
autovacuum_vacuum_threshold = 50
autovacuum_vacuum_scale_factor = 0.05       <span class="code-comment"># Trigger after 5% change instead of 20%</span>
autovacuum_vacuum_cost_limit = 2000         <span class="code-comment"># Increase I/O budget (default is 200)</span>
autovacuum_vacuum_cost_delay = 2ms          <span class="code-comment"># Reduce throttling sleep delay</span></div>
            </div>

            <h2>Table-Specific Autovacuum Overrides</h2>
            <p>For ultra-high-velocity tables (e.g. <code>sessions</code>, <code>queue_jobs</code>), configure table-level storage parameters:</p>
            <div class="code-box">
              <div class="code-header"><span>table_vacuum_override.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">ALTER TABLE</span> public.active_user_sessions <span class="code-keyword">SET</span> (
    autovacuum_vacuum_scale_factor = 0.01,
    autovacuum_vacuum_threshold = 100,
    autovacuum_vacuum_cost_limit = 5000
);</div>
            </div>
            <div class="callout callout-tip">
              <span class="callout-title">TRANSACTION ID WRAPAROUND</span>
              Never disable autovacuum. If the system approaches 2 billion transactions without vacuum freezing old tuples, PostgreSQL enters read-only emergency recovery mode to prevent data corruption.
            </div>
            """
        },
        # PAGE 6: Indexing Deep Dive: B-Tree, GIN, BRIN
        {
            "badge": "Chapter 04",
            "h1": "Indexing Deep Dive: B-Tree, GIN, GiST & BRIN",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ACCESS METHOD SELECTION</span>
              Selecting the appropriate index access method transforms multi-second table scans into sub-millisecond lookups while avoiding index maintenance overhead.
            </div>

            <table class="table-box">
              <tr>
                <th>Index Access Method</th>
                <th>Underlying Data Structure</th>
                <th>Optimal Workload Fit</th>
                <th>Storage Size Footprint</th>
              </tr>
              <tr>
                <td><strong>B-Tree (Default)</strong></td>
                <td>Self-balancing search tree</td>
                <td>Equality (=) and range (&lt;, &gt;, BETWEEN) on unique/high cardinality keys</td>
                <td>Medium (Increases with table size)</td>
              </tr>
              <tr>
                <td><strong>GIN (Generalized Inverted)</strong></td>
                <td>Inverted index mapping elements to rows</td>
                <td>Full-text search, arrays, JSONB <code>?</code>, <code>@&gt;</code> containment operators</td>
                <td>Large (Can exceed base table size)</td>
              </tr>
              <tr>
                <td><strong>GiST (Generalized Search)</strong></td>
                <td>Lossy tree index</td>
                <td>Geometric shapes, PostGIS geospatial coordinates, range intervals</td>
                <td>Medium</td>
              </tr>
              <tr>
                <td><strong>BRIN (Block Range Index)</strong></td>
                <td>Min/max value summary per disk page block</td>
                <td>Append-only naturally sorted time-series or sequential IDs</td>
                <td>Tiny (&lt; 1% of B-Tree size)</td>
              </tr>
            </table>

            <h2>Creating BRIN Indexes on Multi-Terabyte Tables</h2>
            <div class="code-box">
              <div class="code-header"><span>brin_index_creation.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- 100M row audit table: B-Tree index = 2.4GB; BRIN index = 4MB!</span>
<span class="code-keyword">CREATE INDEX</span> idx_audit_log_created_at_brin 
<span class="code-keyword">ON</span> logging.audit_events 
<span class="code-keyword">USING BRIN</span> (created_at) <span class="code-keyword">WITH</span> (pages_per_range = 128);</div>
            </div>
            """
        },
        # PAGE 7: Covering & Partial Indexes
        {
            "badge": "Chapter 05",
            "h1": "Covering Indexes, Partial Indexes & Expressions",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ADVANCED INDEXING</span>
              Advanced indexing techniques allow the PostgreSQL planner to satisfy queries directly from the index structure (Index-Only Scans) without touching underlying table heap blocks.
            </div>

            <h2>Covering Indexes with the INCLUDE Clause</h2>
            <p>A covering index appends non-key payload columns to the B-Tree leaf pages without incorporating them into the search tree traversal logic. This enables Index-Only Scans while preserving low index maintenance overhead.</p>

            <div class="code-box">
              <div class="code-header"><span>covering_and_partial_indexes.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Covering Index: Index-Only Scan for user lookups by email</span>
<span class="code-keyword">CREATE INDEX</span> idx_users_email_covering 
<span class="code-keyword">ON</span> public.users (email) 
<span class="code-keyword">INCLUDE</span> (first_name, last_name, status, role);

<span class="code-comment">-- Partial Index: Only index active uncompleted orders (1% of table)</span>
<span class="code-keyword">CREATE INDEX</span> idx_orders_unprocessed 
<span class="code-keyword">ON</span> public.orders (created_at) 
<span class="code-keyword">WHERE</span> status <span class="code-keyword">IN</span> (<span class="code-str">'PENDING'</span>, <span class="code-str">'PROCESSING'</span>);

<span class="code-comment">-- Expression-based Index: Accelerated case-insensitive search</span>
<span class="code-keyword">CREATE INDEX</span> idx_users_lower_username 
<span class="code-keyword">ON</span> public.users (<span class="code-func">LOWER</span>(username));</div>
            </div>

            <h2>Why Partial Indexes Slash I/O</h2>
            <p>If an e-commerce database stores 10 million historical fulfilled orders and 10,000 active processing orders, an index on <code>status</code> indexes all 10 million rows. A partial index with <code>WHERE status = 'PENDING'</code> indexes only 10,000 rows, consuming 500KB of RAM instead of 250MB.</p>
            <div class="callout callout-tip">
              <span class="callout-title">CONCURRENT BUILDS</span>
              Always specify <code>CREATE INDEX CONCURRENTLY</code> in production environments. Standard index creation locks the table against all write operations (INSERT/UPDATE/DELETE) until completion.
            </div>
            """
        },
        # PAGE 8: EXPLAIN BUFFERS Mastery
        {
            "badge": "Chapter 06",
            "h1": "EXPLAIN (ANALYZE, BUFFERS) Mastery",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">QUERY PLAN ANALYSIS</span>
              <code>EXPLAIN (ANALYZE, BUFFERS)</code> is the DBA's primary diagnostic weapon. While <code>ANALYZE</code> measures actual execution wall-clock time, <code>BUFFERS</code> reveals physical disk reads and shared memory cache hits.
            </div>

            <div class="code-box">
              <div class="code-header"><span>query_plan_diagnostic.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">EXPLAIN (ANALYZE, BUFFERS, VERBOSE, SETTINGS)</span>
<span class="code-keyword">SELECT</span> c.customer_name, <span class="code-func">SUM</span>(o.total_amount)
<span class="code-keyword">FROM</span> customers c
<span class="code-keyword">INNER JOIN</span> orders o <span class="code-keyword">ON</span> c.customer_id = o.customer_id
<span class="code-keyword">WHERE</span> o.order_date >= <span class="code-str">'2026-01-01'</span>
<span class="code-keyword">GROUP BY</span> c.customer_name;</div>
            </div>

            <h2>Key Plan Metrics Decoded</h2>
            <ul>
              <li><strong>Buffers: shared hit=42100 read=120:</strong> <code>hit</code> indicates pages found in PostgreSQL RAM; <code>read</code> indicates pages fetched from physical OS disk. High reads indicate cache eviction or cold data.</li>
              <li><strong>Actual Rows vs Plan Rows:</strong> If the planner estimates <code>rows=10</code> but actual execution processes <code>rows=500000</code>, optimizer statistics are stale. Re-run <code>ANALYZE</code> immediately.</li>
              <li><strong>Seq Scan vs Index Scan:</strong> Sequential scans are fast on small tables (&lt; 1,000 rows), but devastating when scanning 10GB heap tables to return 3 records.</li>
            </ul>

            <div class="callout callout-warn">
              <span class="callout-title">COST FORMAT</span>
              In <code>cost=0.42..8.45</code>, <code>0.42</code> is the startup cost before the first row is output; <code>8.45</code> is the total estimated cost to complete the node.
            </div>
            """
        },
        # PAGE 9: Join Strategies & Spill Tuning
        {
            "badge": "Chapter 07",
            "h1": "Join Strategies: Nested Loop, Hash & Merge",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ALGORITHMIC JOIN SELECTION</span>
              The query planner evaluates three fundamental join algorithms based on estimated row cardinality, available indexes, and memory constraints.
            </div>

            <table class="table-box">
              <tr>
                <th>Join Strategy</th>
                <th>Algorithmic Mechanism</th>
                <th>Ideal Scenario</th>
                <th>Risk Factor</th>
              </tr>
              <tr>
                <td><strong>Nested Loop</strong></td>
                <td>For each outer row, search inner table via index</td>
                <td>Small outer set (&lt; 1,000 rows) joining indexed inner table</td>
                <td>Exponential O(N*M) slowdown if inner table lacks index</td>
              </tr>
              <tr>
                <td><strong>Hash Join</strong></td>
                <td>Build in-memory hash table of inner set; probe with outer</td>
                <td>Large, unsorted tables with equality join conditions</td>
                <td>Spills to disk (Batches &gt; 1) if hash table exceeds work_mem</td>
              </tr>
              <tr>
                <td><strong>Merge Join</strong></td>
                <td>Sort both inputs by join key; advance pointers in lockstep</td>
                <td>Large pre-sorted datasets (e.g. via B-Tree index)</td>
                <td>Expensive sort phase if inputs are not already ordered</td>
              </tr>
            </table>

            <h2>Detecting Hash Join Disk Spills</h2>
            <p>When an in-memory hash table exceeds <code>work_mem</code>, PostgreSQL splits the hash table into multiple batches and spills chunks to temporary disk files. In EXPLAIN output, look for:</p>
            <div class="code-box">
              <div class="code-header"><span>explain_spill_output.txt</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">Hash (cost=420.00..420.00 rows=25000 width=16)
  Buckets: 32768  Batches: 4  Memory Usage: 1024kB  Disk Usage: 4280kB</div>
            </div>
            <p><strong>Remediation:</strong> Increase <code>work_mem</code> for the session or optimize the join predicate to prevent temporary disk write amplification.</p>
            """
        },
        # PAGE 10: Declarative Partitioning
        {
            "badge": "Chapter 08",
            "h1": "Declarative Partitioning: Range, List & Hash",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PHYSICAL HORIZONTAL SCALING</span>
              Declarative partitioning splits massive tables (e.g. &gt; 100GB) into smaller physical tables managed under a single parent logical entity, dramatically accelerating query pruning and index maintenance.
            </div>

            <h2>Partitioning Typologies</h2>
            <ul>
              <li><strong>RANGE:</strong> Partitioned by continuous numeric or timestamp boundaries (e.g. Monthly orders).</li>
              <li><strong>LIST:</strong> Partitioned by explicit categorical keys (e.g. Country code: US, EMEA, APAC).</li>
              <li><strong>HASH:</strong> Uniformly distributes rows across N modulus shards for even distribution.</li>
            </ul>

            <div class="code-box">
              <div class="code-header"><span>declarative_range_partitioning.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Parent Partitioned Table</span>
<span class="code-keyword">CREATE TABLE</span> billing.invoices (
    invoice_id <span class="code-keyword">BIGINT</span>,
    customer_id <span class="code-keyword">INT</span>,
    invoice_date <span class="code-keyword">DATE NOT NULL</span>,
    total_amount <span class="code-keyword">DECIMAL(12,2)</span>
) <span class="code-keyword">PARTITION BY RANGE</span> (invoice_date);

<span class="code-comment">-- Child Partitions for 2026 Quarters</span>
<span class="code-keyword">CREATE TABLE</span> billing.invoices_2026_q1 <span class="code-keyword">PARTITION OF</span> billing.invoices
    <span class="code-keyword">FOR VALUES FROM</span> (<span class="code-str">'2026-01-01'</span>) <span class="code-keyword">TO</span> (<span class="code-str">'2026-04-01'</span>);

<span class="code-keyword">CREATE TABLE</span> billing.invoices_2026_q2 <span class="code-keyword">PARTITION OF</span> billing.invoices
    <span class="code-keyword">FOR VALUES FROM</span> (<span class="code-str">'2026-04-01'</span>) <span class="code-keyword">TO</span> (<span class="code-str">'2026-07-01'</span>);</div>
            </div>

            <h2>Run-Time Partition Pruning</h2>
            <p>Ensure <code>enable_partition_pruning = on</code> in <code>postgresql.conf</code>. When queries include <code>WHERE invoice_date = '2026-02-15'</code>, the planner prunes all partitions except <code>invoices_2026_q1</code>, avoiding table scans across 95% of database storage.</p>
            <div class="callout callout-tip">
              <span class="callout-title">INSTANT DATA PURGE</span>
              Dropping an old monthly partition via <code>DROP TABLE billing.invoices_2024_q1</code> executes in 5 milliseconds with zero table bloat, completely bypassing slow <code>DELETE WHERE date &lt; ...</code> commands.
            </div>
            """
        },
        # PAGE 11: Connection Pooling: PgBouncer
        {
            "badge": "Chapter 09",
            "h1": "Connection Pooling: PgBouncer Architecture",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CONCURRENCY SCALING</span>
              PostgreSQL allocates a dedicated operating system process (fork) for every connected client. Maintaining 2,000 direct database connections exhausts server RAM and causes CPU context-switching starvation.
            </div>
            <p>PgBouncer sits between applications and PostgreSQL, multiplexing thousands of application connections into a lean pool of 50 – 100 persistent database backend connections.</p>

            <table class="table-box">
              <tr>
                <th>PgBouncer Pool Mode</th>
                <th>Connection Lifecycle</th>
                <th>Prepared Statements</th>
                <th>Production Suitability</th>
              </tr>
              <tr>
                <td><strong>Session Mode</strong></td>
                <td>Server connection held until client explicitly disconnects</td>
                <td>Fully supported</td>
                <td>Low-scale; behaves like direct connections</td>
              </tr>
              <tr>
                <td><strong>Transaction Mode</strong></td>
                <td>Server connection released back to pool when transaction ends</td>
                <td>Supported via named protocol in PgBouncer 1.21+</td>
                <td><strong>Optimal</strong> (95% of microservices)</td>
              </tr>
              <tr>
                <td><strong>Statement Mode</strong></td>
                <td>Server connection released immediately after single statement</td>
                <td>Not supported</td>
                <td>Autocommit only (Multi-statement txns fail)</td>
              </tr>
            </table>

            <h2>Production pgbouncer.ini Configuration</h2>
            <div class="code-box">
              <div class="code-header"><span>pgbouncer.ini</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">[databases]
production_db = host=127.0.0.1 port=5432 dbname=production_db pool_size=50

[pgbouncer]
listen_port = 6432
listen_addr = *
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 5000
default_pool_size = 40
reserve_pool_size = 10
reserve_pool_timeout = 5.0</div>
            </div>
            """
        },
        # PAGE 12: Concurrency & Lock Management
        {
            "badge": "Chapter 10",
            "h1": "Concurrency & Lock Management: Deadlocks",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CONCURRENCY DEFENSE</span>
              High-concurrency systems encounter transaction lock contention. Diagnosing deadlocks, row-level locks, and table locks prevents multi-minute application outages.
            </div>

            <h2>Lock Hierarchy & Conflicts</h2>
            <p>PostgreSQL defines 8 table lock modes. Two transactions requesting mutually conflicting lock levels on the same resource cause one transaction to block. If Transaction A waits for Transaction B while B waits for A, a <strong>Deadlock</strong> occurs.</p>

            <div class="code-box">
              <div class="code-header"><span>lock_investigation.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Real-time blocked vs blocking query detection</span>
<span class="code-keyword">SELECT</span>
    blocked_locks.pid     <span class="code-keyword">AS</span> blocked_pid,
    blocked_activity.usename <span class="code-keyword">AS</span> blocked_user,
    blocking_locks.pid    <span class="code-keyword">AS</span> blocking_pid,
    blocking_activity.usename <span class="code-keyword">AS</span> blocking_user,
    blocked_activity.query    <span class="code-keyword">AS</span> blocked_statement,
    blocking_activity.query   <span class="code-keyword">AS</span> current_statement_in_blocking_process
<span class="code-keyword">FROM</span>  pg_catalog.pg_locks         blocked_locks
<span class="code-keyword">JOIN</span> pg_catalog.pg_stat_activity blocked_activity <span class="code-keyword">ON</span> blocked_activity.pid = blocked_locks.pid
<span class="code-keyword">JOIN</span> pg_catalog.pg_locks         blocking_locks 
    <span class="code-keyword">ON</span> blocking_locks.locktype = blocked_locks.locktype
    <span class="code-keyword">AND</span> blocking_locks.database <span class="code-keyword">IS NOT DISTINCT FROM</span> blocked_locks.database
    <span class="code-keyword">AND</span> blocking_locks.relation <span class="code-keyword">IS NOT DISTINCT FROM</span> blocked_locks.relation
    <span class="code-keyword">AND</span> blocking_locks.page <span class="code-keyword">IS NOT DISTINCT FROM</span> blocked_locks.page
    <span class="code-keyword">AND</span> blocking_locks.tuple <span class="code-keyword">IS NOT DISTINCT FROM</span> blocked_locks.tuple
    <span class="code-keyword">AND</span> blocking_locks.virtualxid <span class="code-keyword">IS NOT DISTINCT FROM</span> blocked_locks.virtualxid
    <span class="code-keyword">AND</span> blocking_locks.transactionid <span class="code-keyword">IS NOT DISTINCT FROM</span> blocked_locks.transactionid
    <span class="code-keyword">AND</span> blocking_locks.classid <span class="code-keyword">IS NOT DISTINCT FROM</span> blocked_locks.classid
    <span class="code-keyword">AND</span> blocking_locks.objid <span class="code-keyword">IS NOT DISTINCT FROM</span> blocked_locks.objid
    <span class="code-keyword">AND</span> blocking_locks.objsubid <span class="code-keyword">IS NOT DISTINCT FROM</span> blocked_locks.objsubid
    <span class="code-keyword">AND</span> blocking_locks.pid != blocked_locks.pid
<span class="code-keyword">JOIN</span> pg_catalog.pg_stat_activity blocking_activity <span class="code-keyword">ON</span> blocking_activity.pid = blocking_locks.pid
<span class="code-keyword">WHERE NOT</span> blocked_locks.granted;</div>
            </div>

            <div class="callout callout-tip">
              <span class="callout-title">DEADLOCK MITIGATION RULE</span>
              Always acquire row locks in the exact same deterministic order across application code (e.g. <code>SELECT ... FOR UPDATE ORDER BY id ASC</code>) to eliminate cyclical deadlock conditions.
            </div>
            """
        },
        # PAGE 13: Replication Architectures
        {
            "badge": "Chapter 11",
            "h1": "Replication: Physical Streaming vs. Logical",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DATA PROPAGATION</span>
              PostgreSQL offers two distinct replication architectures: Physical Streaming Replication (exact binary replica of entire database cluster) and Logical Replication (publish/subscribe on individual tables).
            </div>

            <table class="table-box">
              <tr>
                <th>Replication Parameter</th>
                <th>Physical Streaming Replication</th>
                <th>Logical Replication (Pub/Sub)</th>
              </tr>
              <tr>
                <td>Replication Unit</td>
                <td>Entire cluster (All databases & tables)</td>
                <td>Granular tables or schemas</td>
              </tr>
              <tr>
                <td>Target Writeability</td>
                <td>Read-Only Standby</td>
                <td>Read/Write (Can insert local data)</td>
              </tr>
              <tr>
                <td>Cross-Version Upgrades</td>
                <td>Impossible (Exact major version match)</td>
                <td>Supported (e.g. PG 15 -> PG 17 zero-downtime)</td>
              </tr>
              <tr>
                <td>Local Indexes / Triggers</td>
                <td>Identical to primary</td>
                <td>Can create custom indexes on subscriber</td>
              </tr>
            </table>

            <h2>Configuring Logical Publication & Subscription</h2>
            <div class="code-box">
              <div class="code-header"><span>logical_replication_setup.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- On Primary Server (Publisher)</span>
<span class="code-keyword">CREATE PUBLICATION</span> pub_analytics_feed 
<span class="code-keyword">FOR TABLE</span> orders, order_items, customers;

<span class="code-comment">-- On Analytics Replica Server (Subscriber)</span>
<span class="code-keyword">CREATE SUBSCRIPTION</span> sub_analytics_feed 
<span class="code-keyword">CONNECTION</span> <span class="code-str">'host=primary.prod.internal port=5432 dbname=prod_db user=rep_user password=SecretPassword'</span> 
<span class="code-keyword">PUBLICATION</span> pub_analytics_feed;</div>
            </div>
            <div class="callout callout-warn">
              <span class="callout-title">REPLICATION LAG WARNING</span>
              Monitor <code>pg_stat_replication</code> on the primary. If <code>write_lag</code> or <code>replay_lag</code> exceeds 30 seconds, read-replicas will serve stale data to reporting applications.
            </div>
            """
        },
        # PAGE 14: High Availability (HA) & Patroni
        {
            "badge": "Chapter 12",
            "h1": "High Availability & Automatic Failover: Patroni",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ZERO-DOWNTIME TOPOLOGY</span>
              Enterprise SLAs demand automatic failover without split-brain scenarios. Patroni orchestrates high-availability PostgreSQL clusters using a Distributed Consensus Store (DCS) such as etcd or Consul.
            </div>

            <div class="diagram-box">
+----------------------------------------------------------------------------+
|                         DISTRIBUTED CONSENSUS (etcd)                       |
|                             Leader Key Lease Holder                        |
+----------------------------------------------------------------------------+
                     ^                                     ^
                     |                                     |
       +-------------+-------------+         +-------------+-------------+
       |   PRIMARY POSTGRESQL      |         |   STANDBY POSTGRESQL      |
       |     (Patroni Leader)      | ======> |     (Patroni Replica)     |
       |      Holds DCS Lease      | Stream  |   Awaiting Lease Expiry   |
       +---------------------------+         +---------------------------+
            </div>

            <h2>How Patroni Prevents Split-Brain Disasters</h2>
            <p>In standard replication setups, a network partition can trick a standby into promoting itself while the old primary continues accepting writes. Patroni enforces leader key leasing in etcd with TTL heartbeats (10s). If the leader fails to renew its lease, it immediately demotes itself to read-only before the DCS elects a standby.</p>

            <h2>HA Failover Timeline</h2>
            <ol>
              <li>Primary node encounters hardware panic or kernel lockup.</li>
              <li>etcd leader key lease expires after 10 seconds.</li>
              <li>Standby with the lowest replication lag wins the consensus election.</li>
              <li>Patroni promotes new primary, issues timeline switch, and updates health check endpoints for HAProxy/Keepalived routing. Total downtime: &lt; 15 seconds.</li>
            </ol>
            """
        },
        # PAGE 15: Backup & Disaster Recovery: pgBackRest
        {
            "badge": "Chapter 13",
            "h1": "Backup & Point-in-Time Recovery: pgBackRest",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DISASTER RECOVERY</span>
              <code>pg_dump</code> is a logical text export unsuitable for large multi-terabyte production databases. Enterprise disaster recovery requires physical binary backups with continuous WAL archiving via pgBackRest.
            </div>

            <h2>Why pgBackRest Outperforms pg_dump</h2>
            <ul>
              <li><strong>Parallel Multi-Threaded Compression:</strong> Compresses database files in parallel directly to AWS S3, Azure Blob, or local NAS storage.</li>
              <li><strong>Differential & Incremental Backups:</strong> Copies only blocks changed since the last full or differential backup, reducing backup times from 6 hours to 10 minutes.</li>
              <li><strong>Point-in-Time Recovery (PITR):</strong> Allows restoring the database to the exact millisecond before a disastrous <code>DROP TABLE</code> occurred.</li>
            </ul>

            <div class="code-box">
              <div class="code-header"><span>pgbackrest.conf</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">[global]
repo1-type=s3
repo1-s3-bucket=enterprise-pg-backups
repo1-s3-endpoint=s3.us-east-1.amazonaws.com
repo1-s3-region=us-east-1
repo1-path=/backups/production
process-max=8
compress-type=lz4
compress-level=3

[production_stanza]
pg1-path=/var/lib/postgresql/16/main
pg1-user=postgres</div>
            </div>

            <h2>Executing Point-in-Time Recovery</h2>
            <div class="code-box">
              <div class="code-header"><span>pitr_recovery.sh</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># Restore cluster to 1 second prior to accidental data deletion</span>
pgbackrest --stanza=production_stanza --delta \\
  --type=time "--target=2026-10-28 14:29:59+00" \\
  --target-action=promote restore</div>
            </div>
            """
        },
        # PAGE 16: Statistics & pg_stat_statements
        {
            "badge": "Chapter 14",
            "h1": "Statistics & pg_stat_statements Profiling",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">OBSERVABILITY</span>
              <code>pg_stat_statements</code> records execution statistics for all SQL queries executed against the cluster. It is the single most valuable extension for identifying query plan regressions and performance bottlenecks.
            </div>

            <h2>Enabling pg_stat_statements</h2>
            <p>Add to <code>postgresql.conf</code>: <code>shared_preload_libraries = 'pg_stat_statements'</code> and run <code>CREATE EXTENSION pg_stat_statements;</code>.</p>

            <div class="code-box">
              <div class="code-header"><span>top_cumulative_queries.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Find the top 5 queries consuming the most total cluster execution time</span>
<span class="code-keyword">SELECT</span>
    queryid,
    <span class="code-func">SUBSTRING</span>(query, 1, 60) <span class="code-keyword">AS</span> short_query,
    calls,
    <span class="code-func">ROUND</span>(total_exec_time::numeric, 2) <span class="code-keyword">AS</span> total_time_ms,
    <span class="code-func">ROUND</span>(mean_exec_time::numeric, 2) <span class="code-keyword">AS</span> mean_time_ms,
    <span class="code-func">ROUND</span>((100.0 * total_exec_time / <span class="code-func">SUM</span>(total_exec_time) <span class="code-keyword">OVER</span>())::numeric, 2) <span class="code-keyword">AS</span> pct_cluster_time,
    rows <span class="code-keyword">AS</span> total_rows
<span class="code-keyword">FROM</span> pg_stat_statements
<span class="code-keyword">ORDER BY</span> total_exec_time <span class="code-keyword">DESC</span>
<span class="code-keyword">LIMIT</span> 5;</div>
            </div>

            <h2>Planner Statistics & default_statistics_target</h2>
            <p>The query planner builds histograms and most common values (MCV) lists during <code>ANALYZE</code>. The default target (100) is often too coarse for skewed data. Increase it on critical columns:</p>
            <div class="code-box">
              <div class="code-header"><span>column_statistics_boost.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">ALTER TABLE</span> orders <span class="code-keyword">ALTER COLUMN</span> customer_id <span class="code-keyword">SET STATISTICS</span> 1000;
<span class="code-keyword">ANALYZE</span> orders(customer_id);</div>
            </div>
            """
        },
        # PAGE 17: Security Hardening & RLS
        {
            "badge": "Chapter 15",
            "h1": "Security Hardening: pg_hba.conf & Row Security",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DEFENSE-IN-DEPTH</span>
              Hardening PostgreSQL against intrusion demands strict host-based authentication (pg_hba.conf), mandatory SSL/TLS encryption, SCRAM-SHA-256 password hashing, and granular Row-Level Security (RLS).
            </div>

            <h2>Production pg_hba.conf Lockdown</h2>
            <p>Never permit <code>trust</code> or plaintext <code>md5</code> authentication in production. Enforce SCRAM-SHA-256 over TLS:</p>
            <div class="code-box">
              <div class="code-header"><span>pg_hba.conf</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># TYPE  DATABASE        USER            ADDRESS                 METHOD</span>
local   all             postgres                                peer
hostssl all             all             10.0.0.0/16             scram-sha-256
hostssl replication     rep_user        10.0.1.0/24             scram-sha-256
host    all             all             all                     reject</div>
            </div>

            <h2>Implementing Row-Level Security (RLS)</h2>
            <p>RLS enforces tenant isolation at the database engine layer, guaranteeing that multi-tenant applications cannot accidentally leak cross-organization customer records even if application code is compromised.</p>
            <div class="code-box">
              <div class="code-header"><span>tenant_rls_policy.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">ALTER TABLE</span> accounts.invoices <span class="code-keyword">ENABLE ROW LEVEL SECURITY</span>;

<span class="code-keyword">CREATE POLICY</span> tenant_isolation_policy <span class="code-keyword">ON</span> accounts.invoices
    <span class="code-keyword">FOR ALL</span>
    <span class="code-keyword">USING</span> (tenant_id = <span class="code-func">current_setting</span>(<span class="code-str">'app.current_tenant_id'</span>)::<span class="code-keyword">INT</span>);</div>
            </div>
            <div class="callout callout-tip">
              <span class="callout-title">LEAST PRIVILEGE</span>
              Revoke <code>PUBLIC</code> permissions on the <code>public</code> schema: <code>REVOKE ALL ON SCHEMA public FROM PUBLIC;</code> to prevent unprivileged users from creating rogue tables.
            </div>
            """
        },
        # PAGE 18: Linux Kernel sysctl Sizing
        {
            "badge": "Chapter 16",
            "h1": "Hardware Sizing & Linux OS Kernel sysctl Tuning",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">OS & HARDWARE OPTIMIZATION</span>
              PostgreSQL runs directly on the Linux operating system kernel. Suboptimal kernel parameters (overcommit behavior, swapiness, and huge pages) can cripple database performance despite powerful hardware.
            </div>

            <h2>Production sysctl.conf Configuration</h2>
            <div class="code-box">
              <div class="code-header"><span>/etc/sysctl.d/99-postgresql.conf</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># Disable aggressive swapping (keep dirty pages in RAM longer)</span>
vm.swappiness = 1

<span class="code-comment"># Prevent Linux OOM killer from panicking during burst allocations</span>
vm.overcommit_memory = 2
vm.overcommit_ratio = 80

<span class="code-comment"># File descriptor and socket connection bounds</span>
fs.file-max = 2097152
net.core.somaxconn = 4096
net.ipv4.tcp_max_syn_backlog = 4096</div>
            </div>

            <h2>Huge Pages: Squeezing 15% Free Performance</h2>
            <p>On servers with &gt; 32GB of RAM, default 4KB memory pages create enormous Translation Lookaside Buffer (TLB) page table overhead. Allocating <strong>Transparent Huge Pages (disabled)</strong> and configuring <strong>Static Huge Pages (2MB)</strong> eliminates TLB cache misses.</p>
            <div class="code-box">
              <div class="code-header"><span>huge_pages_setup.sh</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># In postgresql.conf</span>
huge_pages = on

<span class="code-comment"># In Linux sysctl</span>
vm.nr_hugepages = 8200 <span class="code-comment"># (shared_buffers 16GB / 2MB per page = 8192 pages)</span></div>
            </div>
            """
        },
        # PAGE 19: Disaster Recovery Case Study
        {
            "badge": "Chapter 17",
            "h1": "Disaster Recovery Case Study: Index Corruption",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRODUCTION EMERGENCY</span>
              A financial payment platform experienced an unexpected storage controller hardware failure, causing B-Tree index page corruption on the primary transactions table and halting payment processing.
            </div>

            <h2>Incident Symptoms & Diagnosis</h2>
            <p>Application logs threw: <code>ERROR: right sibling's left-link doesn't match: block 14201 in index "idx_trans_pk"</code>. Queries querying rows via the index failed while sequential scans succeeded.</p>

            <h2>Step-by-Step Production Resolution</h2>
            <ol>
              <li><strong>Isolate Traffic:</strong> Instructed PgBouncer to pause the connection pool: <code>PAUSE transactions_db;</code>.</li>
              <li><strong>Verify Physical Heap Integrity:</strong> Executed <code>amcheck</code> extension to confirm heap data was uncorrupted:
                <div class="code-box">
                  <div class="code-header"><span>amcheck_verification.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
                  <div class="code-body"><span class="code-keyword">CREATE EXTENSION</span> amcheck;
<span class="code-keyword">SELECT</span> bt_index_check(<span class="code-str">'idx_trans_pk'</span>, <span class="code-keyword">true</span>);</div>
                </div>
              </li>
              <li><strong>Rebuild Damaged Index Without Locking:</strong>
                <div class="code-box">
                  <div class="code-header"><span>reindex_recovery.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
                  <div class="code-body"><span class="code-comment">-- Rebuild corrupted primary key concurrently without blocking concurrent reads</span>
<span class="code-keyword">REINDEX INDEX CONCURRENTLY</span> idx_trans_pk;</div>
                </div>
              </li>
              <li><strong>Resume Application Traffic:</strong> Unpaused PgBouncer: <code>RESUME transactions_db;</code>. Total downtime: 4 minutes.</li>
            </ol>
            """
        },
        # PAGE 20: Anti-Patterns & Common Traps
        {
            "badge": "Chapter 18",
            "h1": "PostgreSQL Anti-Patterns & Performance Traps",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PITFALL PREVENTION</span>
              Common developer coding habits and ORM abstractions inadvertently bypass PostgreSQL optimizations, triggering severe CPU spikes and lock serialization.
            </div>

            <table class="table-box">
              <tr>
                <th>Anti-Pattern</th>
                <th>Underlying Failure Mechanism</th>
                <th>Remediation Architecture</th>
              </tr>
              <tr>
                <td><strong>N+1 ORM Queries</strong></td>
                <td>ORM executes 1 query for parent, then 1,000 individual queries for each child row</td>
                <td>Use <code>JOIN FETCH</code> or eager loading to retrieve child sets in a single query</td>
              </tr>
              <tr>
                <td><strong>Unindexed Foreign Keys</strong></td>
                <td>PostgreSQL does NOT auto-index foreign keys. Deleting a parent row triggers a full sequential scan on the child table!</td>
                <td>Create B-Tree indexes on every foreign key column immediately</td>
              </tr>
              <tr>
                <td><strong>Offset Pagination</strong></td>
                <td><code>OFFSET 1000000 LIMIT 20</code> reads 1,000,020 rows from disk and discards the first million!</td>
                <td>Use Keyset Pagination: <code>WHERE id &gt; :last_seen_id ORDER BY id ASC LIMIT 20</code></td>
              </tr>
              <tr>
                <td><strong>SELECT * Everything</strong></td>
                <td>Forces heap fetches, disabling Index-Only Scans and saturating network I/O</td>
                <td>Explicitly project only required columns in SELECT statements</td>
              </tr>
            </table>

            <h2>The Sequence Exhaustion Bug</h2>
            <p>Creating tables with <code>INT</code> (32-bit integer) primary keys caps at 2,147,483,647 rows. When the sequence reaches this ceiling, all subsequent INSERTs fail. <strong>Always use <code>BIGINT</code> for primary keys.</strong></p>
            """
        },
        # PAGE 21: Emergency DBA Troubleshooting Runbook
        {
            "badge": "Chapter 19",
            "h1": "Emergency DBA Troubleshooting Runbook",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CRITICAL INCIDENT RUNBOOK</span>
              When CPU reaches 100% or connection pools saturate, follow these emergency triage commands to restore service immediately.
            </div>

            <div class="code-box">
              <div class="code-header"><span>emergency_triage_commands.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- 1. Identify long-running rogue queries (> 60 seconds)</span>
<span class="code-keyword">SELECT</span> pid, now() - pg_stat_activity.query_start <span class="code-keyword">AS</span> duration, query, state
<span class="code-keyword">FROM</span> pg_stat_activity
<span class="code-keyword">WHERE</span> (now() - pg_stat_activity.query_start) > <span class="code-keyword">interval</span> <span class="code-str">'60 seconds'</span>
<span class="code-keyword">AND</span> state != <span class="code-str">'idle'</span>;

<span class="code-comment">-- 2. Gracefully cancel a runaway query (sends SIGINT)</span>
<span class="code-keyword">SELECT</span> pg_cancel_backend(14205);

<span class="code-comment">-- 3. Forcefully terminate an un-cancelable zombie backend (sends SIGTERM)</span>
<span class="code-keyword">SELECT</span> pg_terminate_backend(14205);

<span class="code-comment">-- 4. Check for disk space saturation on WAL directory</span>
<span class="code-keyword">SELECT</span> <span class="code-func">pg_size_pretty</span>(<span class="code-func">sum</span>(size)) <span class="code-keyword">FROM</span> pg_ls_waldir();

<span class="code-comment">-- 5. Detect severe table bloat</span>
<span class="code-keyword">SELECT</span> relname, n_dead_tup, n_live_tup, 
       <span class="code-func">ROUND</span>(n_dead_tup * 100.0 / <span class="code-func">NULLIF</span>(n_live_tup + n_dead_tup, 0), 2) <span class="code-keyword">AS</span> dead_tuple_ratio
<span class="code-keyword">FROM</span> pg_stat_user_tables
<span class="code-keyword">WHERE</span> n_dead_tup > 10000
<span class="code-keyword">ORDER BY</span> dead_tuple_ratio <span class="code-keyword">DESC</span>;</div>
            </div>

            <div class="callout callout-tip">
              <span class="callout-title">SAFETY PARAMETER</span>
              Configure <code>statement_timeout = '30s'</code> globally or per user to prevent runaway Cartesian queries from locking up database worker processes.
            </div>
            """
        },
        # PAGE 22: Production Health Checklist
        {
            "badge": "Chapter 20",
            "h1": "Enterprise PostgreSQL Production Health Audit",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRE-FLIGHT ASSESSMENT</span>
              Before certifying any production PostgreSQL deployment, verify compliance against every standard in this enterprise DBA audit checklist.
            </div>

            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Memory Baseline:</strong> <code>shared_buffers</code> set to 25% RAM; <code>work_mem</code> sized conservatively against connection limits; Huge Pages configured.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Checkpoint Tuning:</strong> <code>max_wal_size</code> &ge; 32GB; <code>checkpoint_completion_target = 0.9</code>; checkpoints triggered by timeout, not capacity.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Autovacuum Health:</strong> Scale factor lowered to 0.05; cost limits increased to 2000; zero tables approaching 2-billion transaction freeze horizon.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Connection Pooling:</strong> PgBouncer active in transaction mode; application microservices connect via pooler rather than direct backends.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Disaster Recovery:</strong> pgBackRest physical backups executing daily; WAL archiving streaming continuously to cloud object storage; PITR tested quarterly.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>High Availability:</strong> Patroni cluster deployed across 3 availability zones with etcd consensus; split-brain failover validated under chaos testing.</div>
            </div>

            <div class="callout callout-tip" style="margin-top: 14px;">
              <span class="callout-title">AUTHOR CLOSING STATEMENT</span>
              PostgreSQL is one of the most reliable engineering feats in modern software. By configuring deliberate memory limits, tuning autovacuum aggressively, and backing your architecture with automated pooling and HA failover, your database will withstand millions of queries with rock-solid durability.<br><br>
              <strong>Datta Sable</strong> · Enterprise Analytics & Data Architect · <em>dattasable.com</em>
            </div>
            """
        }
    ]
}
