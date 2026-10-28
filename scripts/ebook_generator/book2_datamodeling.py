# scripts/ebook_generator/book2_datamodeling.py

BOOK_DATAMODELING = {
    "slug": "enterprise-data-modeling-vault-2026",
    "sku": "DS-EBOOK-MOD-EDM-2026",
    "title": "Enterprise Data Modeling: Star Schema, Snowflake & Data Vault 2.0",
    "cover_title_formatted": "Enterprise Data Modeling: <span>Star Schema & Data Vault 2.0</span>",
    "subtitle": "The definitive architecture handbook for designing resilient analytical databases, dimensional star schemas, high-audit Data Vault 2.0 layers, and modern cloud semantic models.",
    "category_name": "Data Modeling & Architecture",
    "category_slug": "data-modeling-architecture",
    "all_category_slugs": ["data-modeling-architecture", "sql-databases", "data-analytics-bi"],
    "features": ["22-page PDF", "2026 Edition", "Kimball Star Schema & Data Vault 2.0 Blueprints"],
    "included_resources": ["22-page PDF handbook"],
    "seo_title": "Enterprise Data Modeling: Star Schema & Data Vault 2.0 | 2026 Edition",
    "seo_desc": "22-page Enterprise Data Modeling handbook by Datta Sable. In-depth Kimball star schema, SCD Type 2, and Data Vault 2.0 Hub/Link/Sat architectures.",
    "pages": [
        # PAGE 2: Table of Contents & Evolution
        {
            "badge": "Architecture Blueprint",
            "h1": "Table of Contents & Dimensional Evolution",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">EXECUTIVE OVERVIEW</span>
              Enterprise data modeling has evolved from rigid 3NF relational schemas into agile, dual-tier paradigms: an agile, audit-compliant Raw Data Vault 2.0 back-end coupled with business-facing Kimball Star Schemas for high-performance self-service analytics.
            </div>

            <div class="diagram-box">
+------------------+     +----------------------------------+     +------------------+
| Heterogeneous    | --> |       RAW DATA VAULT 2.0         | --> | INFORMATION MARTS|
| Source Systems   |     |  Hubs (Core Business Concepts)   |     | Dimensional Star |
| (ERP, CRM, Web)  |     |  Links (Business Relationships)  |     | Schemas for BI & |
+------------------+     |  Satellites (Context & History)  |     | Semantic Models  |
                         +----------------------------------+     +------------------+
            </div>

            <h2>Comprehensive Chapter Guide</h2>
            <div class="grid-2">
              <div class="grid-card">
                <h3>Part I: Dimensional Modeling</h3>
                <p>• Ch 3: Kimball Star Schema Core<br>
                • Ch 4: Fact Table Typologies<br>
                • Ch 5: Conformed Dimensions<br>
                • Ch 6: SCD Types 1 through 6<br>
                • Ch 7: Degenerate & Junk Dimensions</p>
              </div>
              <div class="grid-card">
                <h3>Part II: Data Vault 2.0</h3>
                <p>• Ch 8: Inmon CIF vs Kimball<br>
                • Ch 9: Data Vault 2.0 Philosophy<br>
                • Ch 10: Hubs, Links & Satellites<br>
                • Ch 11: Hash Keys & Hash Diffs<br>
                • Ch 12: Business Vault & PIT Tables</p>
              </div>
            </div>
            <p><strong>Part III: Modern Analytical Patterns:</strong> Ch 13 Mart Bridging, Ch 14 Semi-Structured JSON Modeling, Ch 15 Many-to-Many Relationships, Ch 16 Bi-Temporal Modeling, Ch 17 Normalization in MPP, Ch 18 Metric Stores, Ch 19 Healthcare Claims Case Study, Ch 20 Modeling Anti-Patterns, Ch 21 Decision Matrix, Ch 22 Architect Audit Checklist.</p>
            """
        },
        # PAGE 3: Kimball Dimensional Fundamentals
        {
            "badge": "Chapter 01",
            "h1": "Core Principles of Kimball Star Schemas",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DIMENSIONAL FOUNDATIONS</span>
              Ralph Kimball's dimensional modeling methodology organizes analytical data into single-subject Star Schemas comprising central Fact tables surrounded by denormalized Dimension tables.
            </div>
            <p>A Star Schema prioritizes human understandability and lightning-fast query execution over transactional 3NF normalization. Business users easily navigate single-hop joins between facts and dimensions without traversing multi-table relational mazes.</p>

            <h2>The Four-Step Dimensional Design Process</h2>
            <ol>
              <li><strong>Select the Business Process:</strong> Identify the operational activity to model (e.g. Retail Checkout, Claims Ingestion, Loan Approvals).</li>
              <li><strong>Declare the Grain:</strong> Explicitly state what a single physical row in the fact table represents (e.g. One individual line-item on a register receipt).</li>
              <li><strong>Identify the Dimensions:</strong> Determine the 'who, what, where, when, why' context describing the grain (Customer, Store, Product, Date, Promotion).</li>
              <li><strong>Identify the Numeric Facts:</strong> Quantify the event with additive numerical metrics (Quantity Sold, Extended Cost, Net Dollar Amount).</li>
            </ol>

            <div class="callout callout-tip">
              <span class="callout-title">THE GRAIN GOLDEN RULE</span>
              Never mix grains in a single fact table. Mixing a transaction line-item with an aggregated daily invoice total leads to double-counting and catastrophic financial reporting errors.
            </div>
            """
        },
        # PAGE 4: Fact Table Typologies
        {
            "badge": "Chapter 02",
            "h1": "Fact Table Engineering: 3 Fundamental Types",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">FACT TABLE ARCHITECTURE</span>
              Not all business events behave identically. Kimball establishes three distinct fact table typologies to capture continuous business events, periodic balance states, and multi-stage workflows.
            </div>

            <table class="table-box">
              <tr>
                <th>Fact Typology</th>
                <th>Grain & Timing</th>
                <th>Additivity</th>
                <th>Primary Use Case</th>
              </tr>
              <tr>
                <td><strong>Transaction Fact</strong></td>
                <td>Point in time; 1 row per atomic event occurrence</td>
                <td>Fully Additive across all dimensions</td>
                <td>Retail POS sales, ATM cash withdrawals, web clicks</td>
              </tr>
              <tr>
                <td><strong>Periodic Snapshot</strong></td>
                <td>Regular intervals; 1 row per entity per period (day/mo)</td>
                <td>Semi-Additive (sum across items, not time)</td>
                <td>Bank account end-of-day balances, warehouse stock levels</td>
              </tr>
              <tr>
                <td><strong>Accumulating Snapshot</strong></td>
                <td>Finite lifecycle; 1 row per process instance with date milestones</td>
                <td>Fully Additive metrics; updated as stages complete</td>
                <td>Order fulfillment (Ordered -> Packed -> Shipped -> Delivered)</td>
              </tr>
            </table>

            <h2>Accumulating Snapshot Milestone Schema</h2>
            <div class="code-box">
              <div class="code-header"><span>fact_order_fulfillment.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">CREATE TABLE</span> gold.logistics.fact_order_fulfillment (
    order_id_dd <span class="code-keyword">VARCHAR(50)</span>, <span class="code-comment">-- Degenerate Dimension</span>
    customer_key <span class="code-keyword">INT REFERENCES</span> dim_customer(customer_key),
    order_date_key <span class="code-keyword">INT REFERENCES</span> dim_date(date_key),
    packing_date_key <span class="code-keyword">INT REFERENCES</span> dim_date(date_key),
    ship_date_key <span class="code-keyword">INT REFERENCES</span> dim_date(date_key),
    delivery_date_key <span class="code-keyword">INT REFERENCES</span> dim_date(date_key),
    days_to_pack <span class="code-keyword">INT</span>,
    days_in_transit <span class="code-keyword">INT</span>,
    order_amount_usd <span class="code-keyword">DECIMAL(18,2)</span>
);</div>
            </div>
            """
        },
        # PAGE 5: Dimension Table Engineering
        {
            "badge": "Chapter 03",
            "h1": "Dimension Table Engineering & Conformed Keys",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CONTEXTUAL MASTERY</span>
              Dimensions supply the filtering, grouping, and labeling attributes in analytical reports. Designing robust dimensions requires enforcing surrogate keys and enterprise conformed standards.
            </div>
            <p><strong>Natural vs. Surrogate Keys:</strong> Never join fact tables to source operational natural keys (e.g. <code>customer_id = 'CUST-9821'</code>). Operational keys can change, recycle, or collision-merge across acquisitions. Surrogate keys (synthetic integers: <code>100421</code>) provide complete isolation from operational churn.</p>

            <h2>Conformed Dimensions</h2>
            <p>A conformed dimension represents an identical entity definition shared across multiple fact tables in an enterprise data warehouse. For example, <code>dim_date</code>, <code>dim_customer</code>, and <code>dim_product</code> must mean the exact same thing whether querying Marketing Facts, Sales Facts, or Logistics Facts.</p>

            <h2>Role-Playing Dimensions</h2>
            <p>When a single physical dimension appears multiple times in the same fact table under different business contexts, it 'plays multiple roles'. The Date dimension is the classic example:</p>
            <ul>
              <li><code>Order_Date_Key</code> -> Order Date</li>
              <li><code>Shipping_Date_Key</code> -> Shipping Date</li>
              <li><code>Due_Date_Key</code> -> Payment Due Date</li>
            </ul>
            <div class="callout callout-tip">
              <span class="callout-title">MODELING TIP</span>
              In Power BI or SQL, instantiate role-playing dimensions using SQL views or active/inactive relationships with DAX <code>USERELATIONSHIP()</code> to preserve single physical storage.
            </div>
            """
        },
        # PAGE 6: Slowly Changing Dimensions (SCD 0 - 6)
        {
            "badge": "Chapter 04",
            "h1": "Slowly Changing Dimensions (SCD Types 0 - 6)",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">TEMPORAL INTEGRITY</span>
              Dimension attributes change over time. When a customer relocates from London to New York, how the data warehouse handles this modification dictates historical reporting accuracy.
            </div>

            <table class="table-box">
              <tr>
                <th>SCD Type</th>
                <th>Mechanism</th>
                <th>Historical Preservation</th>
                <th>Standard Production Use Case</th>
              </tr>
              <tr>
                <td><strong>Type 0</strong></td>
                <td>Retain original value; never update</td>
                <td>Preserves original state only</td>
                <td>Original birth date, original application credit score</td>
              </tr>
              <tr>
                <td><strong>Type 1</strong></td>
                <td>Overwrite in-place</td>
                <td>Zero history (Old value overwritten)</td>
                <td>Fixing typos in customer name or spelling errors</td>
              </tr>
              <tr>
                <td><strong>Type 2</strong></td>
                <td>Insert new row with effective timestamps</td>
                <td>Complete, infinite history</td>
                <td>Sales territory realignments, customer address relocation</td>
              </tr>
              <tr>
                <td><strong>Type 3</strong></td>
                <td>Add 'Previous' column to same row</td>
                <td>1 previous state only</td>
                <td>Tracking immediate prior department or title</td>
              </tr>
              <tr>
                <td><strong>Type 6</strong></td>
                <td>Hybrid (Type 1 + 2 + 3): 1 + 2 + 3 = 6</td>
                <td>Full history + current attribute column</td>
                <td>Historical slicing with instant current-state rollups</td>
              </tr>
            </table>

            <h2>Standard Type 2 SCD Table Structure</h2>
            <div class="code-box">
              <div class="code-header"><span>scd_type2_ddl.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">CREATE TABLE</span> gold.dimensions.dim_customer (
    customer_sk <span class="code-keyword">BIGINT IDENTITY</span>(1,1), <span class="code-comment">-- Surrogate Key</span>
    customer_id <span class="code-keyword">VARCHAR(50)</span>,            <span class="code-comment">-- Natural Business Key</span>
    customer_name <span class="code-keyword">VARCHAR(100)</span>,
    region <span class="code-keyword">VARCHAR(50)</span>,
    effective_start_date <span class="code-keyword">TIMESTAMP</span>,
    effective_end_date <span class="code-keyword">TIMESTAMP</span>,
    is_current <span class="code-keyword">BOOLEAN</span>
);</div>
            </div>
            """
        },
        # PAGE 7: Degenerate, Junk & Outrigger Dimensions
        {
            "badge": "Chapter 05",
            "h1": "Degenerate, Junk & Outrigger Dimensions",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">SPECIALTY PATTERNS</span>
              Real-world operational systems contain transactional codes, low-cardinality status flags, and secondary hierarchies that do not fit standard flat dimension designs.
            </div>

            <div class="grid-2">
              <div class="grid-card">
                <h3>Degenerate Dimensions (DD)</h3>
                <p>An operational identifier (e.g. <code>Invoice_Number</code>, <code>Order_ID</code>, <code>Bill_of_Lading</code>) stored directly in the fact table without a foreign key join to a dimension table. It groups fact rows belonging to a common operational transaction without wasteful dimension overhead.</p>
              </div>
              <div class="grid-card">
                <h3>Junk Dimensions</h3>
                <p>Combining dozens of disparate, low-cardinality indicator flags (e.g. <code>Payment_Received</code>, <code>Free_Shipping</code>, <code>Gift_Wrapped</code>, <code>Tax_Exempt</code>) into a single unified lookup dimension table to prevent fact tables from ballooning with 30 separate foreign key columns.</p>
              </div>
            </div>

            <h2>Outrigger Dimensions</h2>
            <p>An outrigger is a dimension joined to another dimension rather than directly to a fact table. While strict Kimball rules advise denormalizing attributes into the parent dimension, outriggers are justified when a secondary dimension operates at a distinct grain or is shared across multiple independent dimensions (e.g., a shared County Demographic table joined to both Customer and Store dimensions).</p>

            <div class="code-box">
              <div class="code-header"><span>dim_order_flags_junk.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Junk Dimension containing cross-product of boolean flags</span>
<span class="code-keyword">CREATE TABLE</span> gold.dimensions.dim_order_flags (
    flag_key <span class="code-keyword">INT PRIMARY KEY</span>,
    is_gift <span class="code-keyword">BOOLEAN</span>,
    is_international <span class="code-keyword">BOOLEAN</span>,
    is_discounted <span class="code-keyword">BOOLEAN</span>,
    shipping_priority <span class="code-keyword">VARCHAR(20)</span>
);</div>
            </div>
            """
        },
        # PAGE 8: Inmon CIF vs. Kimball Dimensional
        {
            "badge": "Chapter 06",
            "h1": "Inmon CIF vs. Kimball Dimensional Paradigm",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ARCHITECTURAL DEBATE</span>
              The two foundational data warehousing philosophies—Bill Inmon's Corporate Information Factory (CIF) and Ralph Kimball's Dimensional Architecture—represent fundamentally different trade-offs between centralized normalization and departmental speed.
            </div>

            <table class="table-box">
              <tr>
                <th>Evaluation Dimension</th>
                <th>Inmon Corporate Information Factory (CIF)</th>
                <th>Kimball Dimensional Architecture</th>
              </tr>
              <tr>
                <td>Core Repository</td>
                <td>Central 3NF Relational Enterprise Warehouse (EDW)</td>
                <td>Decentralized Dimensional Data Marts linked by Bus Matrix</td>
              </tr>
              <tr>
                <td>Data Philosophy</td>
                <td>Top-Down: Single physical source of corporate truth</td>
                <td>Bottom-Up: Subject-oriented analytical business processes</td>
              </tr>
              <tr>
                <td>Time-to-Value</td>
                <td>Slow; requires enterprise-wide consensus upfront</td>
                <td>Rapid; delivers immediate value per business unit</td>
              </tr>
              <tr>
                <td>Query Performance</td>
                <td>Poor for BI (requires 12-table 3NF SQL joins)</td>
                <td>Blazing (Single-hop Star Schema star joins)</td>
              </tr>
              <tr>
                <td>Maintenance Burden</td>
                <td>High upstream schema rigidity; low redundancy</td>
                <td>Moderate redundancy; requires conformed dimension governance</td>
              </tr>
            </table>

            <h2>The Modern Consensus: Hybrid Architecture</h2>
            <p>Modern cloud architectures do not force a binary choice. Enterprise data teams adopt Inmon or Data Vault 2.0 principles for raw historical ingestion and integration, while deploying Kimball Star Schemas in the Gold consumption layer for Power BI, Tableau, and ad-hoc SQL users.</p>
            """
        },
        # PAGE 9: Introduction to Data Vault 2.0
        {
            "badge": "Chapter 07",
            "h1": "Introduction to Data Vault 2.0: Core Philosophy",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ENTERPRISE AGILITY</span>
              Invented by Dan Linstedt, Data Vault 2.0 is a detail-oriented, historical tracking, and uniquely linked hybrid modeling methodology designed specifically for enterprise scale, parallel loading, and continuous auditability.
            </div>
            <p>Data Vault isolates business keys, relational associations, and descriptive contextual attributes into three distinct physical primitives: <strong>Hubs</strong>, <strong>Links</strong>, and <strong>Satellites</strong>.</p>

            <h2>Why Data Vault Succeeds Where 3NF Fails</h2>
            <ul>
              <li><strong>Zero Re-engineering on Schema Evolution:</strong> When source systems add columns or introduce new ERP entities, existing Hubs and Links remain completely untouched. New fields simply attach as new Satellites.</li>
              <li><strong>100% Auditability & Traceability:</strong> Every row records the exact ingestion timestamp and source system identifier. No data is ever overwritten or deleted.</li>
              <li><strong>Asynchronous Parallel Ingestion:</strong> By replacing sequence-based auto-increment surrogate keys with deterministic cryptographic hash keys, Hubs, Links, and Satellites load simultaneously across distributed MPP clusters.</li>
            </ul>

            <div class="callout callout-tip">
              <span class="callout-title">CORE PRINCIPLE</span>
              A Raw Data Vault should never contain business transformations or cleansing logic. Store source data exactly as received, warts and all, to preserve legal auditability.
            </div>
            """
        },
        # PAGE 10: Hubs, Links & Satellites Anatomy
        {
            "badge": "Chapter 08",
            "h1": "Hubs, Links & Satellites: The Core Primitives",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRIMITIVE DEEP DIVE</span>
              The structural foundation of Data Vault 2.0 relies on strictly enforcing separation of concerns across identity (Hubs), relationships (Links), and descriptive attributes (Satellites).
            </div>

            <div class="diagram-box">
       +-----------------------+              +-----------------------+
       |   HUB_CUSTOMER        |              |      HUB_ACCOUNT      |
       |  H_Customer_HashKey   |              |   H_Account_HashKey   |
       +-----------------------+              +-----------------------+
                   |                                      |
                   +------------------+-------------------+
                                      |
                                      v
                        +---------------------------+
                        |   LINK_CUSTOMER_ACCOUNT   |
                        |   L_Cust_Acct_HashKey     |
                        +---------------------------+
                                      |
                                      v
                        +---------------------------+
                        |  SAT_CUSTOMER_DEMO        |
                        |  (Address, DOB, Income)   |
                        +---------------------------+
            </div>

            <h2>Anatomy of the Three Tables</h2>
            <ol>
              <li><strong>Hub Table:</strong> Contains unique list of business keys. Consists of: Hash Key (PK), Business Key (Natural Key), Load Date Timestamp, and Record Source.</li>
              <li><strong>Link Table:</strong> Represents physical associations or transactions between 2 or more Hubs. Consists of: Link Hash Key (PK), Foreign Hash Keys to associated Hubs, Load Date Timestamp, and Record Source.</li>
              <li><strong>Satellite Table:</strong> Contains all descriptive, changing attributes. Consists of: Parent Hash Key (FK), Load Date Timestamp, Hash Diff, Descriptive Attributes, and Record Source.</li>
            </ol>
            """
        },
        # PAGE 11: Hash Keys & Hash Diffs
        {
            "badge": "Chapter 09",
            "h1": "Hash Keys, Hash Diffs & Collision Algorithms",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DETERMINISTIC CRYPTOGRAPHY</span>
              Data Vault 2.0 utilizes cryptographic hashes (MD5 or SHA-256) to eliminate inter-table loading dependencies, enabling massive parallelization across distributed data warehouses.
            </div>

            <h2>Hash Key Construction Rules</h2>
            <p>Hash keys must be computed identically across all pipelines by applying standard formatting: uppercase trimming, null value substitution, and string concatenation.</p>

            <div class="code-box">
              <div class="code-header"><span>hash_key_derivation.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Standard DV2.0 Hash Key generation in Snowflake / Databricks</span>
<span class="code-keyword">SELECT</span>
    <span class="code-comment">-- Business Hash Key</span>
    <span class="code-func">SHA2</span>(<span class="code-func">UPPER</span>(<span class="code-func">TRIM</span>(<span class="code-func">COALESCE</span>(customer_id, <span class="code-str">'-1'</span>))), 256) <span class="code-keyword">AS</span> hk_customer_h,

    <span class="code-comment">-- Hash Diff for Satellite change detection</span>
    <span class="code-func">SHA2</span>(<span class="code-func">CONCAT_WS</span>(<span class="code-str">'||'</span>,
        <span class="code-func">UPPER</span>(<span class="code-func">TRIM</span>(<span class="code-func">COALESCE</span>(customer_name, <span class="code-str">'^^'</span>))),
        <span class="code-func">UPPER</span>(<span class="code-func">TRIM</span>(<span class="code-func">COALESCE</span>(email_address, <span class="code-str">'^^'</span>))),
        <span class="code-func">UPPER</span>(<span class="code-func">TRIM</span>(<span class="code-func">COALESCE</span>(postal_code, <span class="code-str">'^^'</span>)))
    ), 256) <span class="code-keyword">AS</span> hd_customer_s
<span class="code-keyword">FROM</span> staging.crm.stg_customers;</div>
            </div>

            <h2>Why Hash Diffs Accelerate Ingestion</h2>
            <p>Instead of comparing 40 individual descriptive columns during CDC ingest to detect changes, the pipeline compares a single 32-byte <code>hash_diff</code> column. If the incoming <code>hash_diff</code> matches the most recent Satellite record, no write occurs.</p>
            <div class="callout callout-tip">
              <span class="callout-title">COLLISION PROBABILITY</span>
              With SHA-256, the mathematical probability of a hash collision across 100 billion records is less than 1 in 10^50—statistically zero for enterprise systems.
            </div>
            """
        },
        # PAGE 12: Business Vault & PIT Tables
        {
            "badge": "Chapter 10",
            "h1": "Business Vault: PIT & Bridge Tables",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">QUERY ACCELERATION</span>
              Querying Raw Data Vault directly requires joining dozens of Hubs, Links, and Satellites. Business Vault provides Point-in-Time (PIT) and Bridge tables to collapse complex joins into lightning-fast lookups.
            </div>

            <h2>Point-in-Time (PIT) Tables</h2>
            <p>A PIT table tracks snapshot timestamps alongside the foreign key pointers to the exact active Satellite records across multiple Satellites tied to a single Hub. It eliminates slow correlated subqueries when reconstructing point-in-time states.</p>

            <div class="code-box">
              <div class="code-header"><span>pit_customer_query.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Querying dimensional view backed by a PIT table</span>
<span class="code-keyword">SELECT</span>
    pit.snapshot_date,
    h.customer_id,
    s_core.customer_name,
    s_addr.street_address,
    s_addr.city
<span class="code-keyword">FROM</span> business_vault.pit_customer pit
<span class="code-keyword">INNER JOIN</span> raw_vault.hub_customer h <span class="code-keyword">ON</span> pit.hk_customer_h = h.hk_customer_h
<span class="code-keyword">INNER JOIN</span> raw_vault.sat_customer_core s_core 
    <span class="code-keyword">ON</span> pit.hk_customer_h = s_core.hk_customer_h 
    <span class="code-keyword">AND</span> pit.sat_core_load_date = s_core.load_date
<span class="code-keyword">INNER JOIN</span> raw_vault.sat_customer_address s_addr 
    <span class="code-keyword">ON</span> pit.hk_customer_h = s_addr.hk_customer_h 
    <span class="code-keyword">AND</span> pit.sat_addr_load_date = s_addr.load_date;</div>
            </div>

            <h2>Bridge Tables</h2>
            <p>Bridge tables pre-join complex Link relationships across multiple hops (e.g. Order -> OrderLine -> Product -> Supplier), storing all associated Hub and Link Hash Keys in a single flattened lookup structure.</p>
            """
        },
        # PAGE 13: Bridging Data Vault to Information Marts
        {
            "badge": "Chapter 11",
            "h1": "Bridging Data Vault to Information Marts",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CONSUMPTION PATTERNS</span>
              Data Vault is designed for ingestion agility and auditing; it is NOT designed for direct end-user reporting. Information Marts translate Data Vault models into dimensional Star Schemas for business tools.
            </div>

            <table class="table-box">
              <tr>
                <th>Data Vault Primitive</th>
                <th>Maps To in Information Mart</th>
                <th>Transformation Complexity</th>
              </tr>
              <tr>
                <td>Hub + Attached Satellites</td>
                <td>Dimension Table (SCD Type 1 or Type 2)</td>
                <td>Low (Flattening attributes via PIT)</td>
              </tr>
              <tr>
                <td>Link + Transactional Satellite</td>
                <td>Transaction Fact Table</td>
                <td>Medium (Joining foreign keys to Dim SKs)</td>
              </tr>
              <tr>
                <td>Multi-Hop Links + Bridge Tables</td>
                <td>Accumulating Snapshot Fact Table</td>
                <td>Medium-High (Tracking milestone timestamps)</td>
              </tr>
            </table>

            <h2>Virtual vs. Physical Marts</h2>
            <p>In modern columnar engines (Snowflake, Databricks, BigQuery), Information Marts can frequently be deployed as <strong>100% Virtual SQL Views</strong> over Business Vault PIT tables. This eliminates data replication and ensures BI dashboards immediately reflect newly committed data without nightly batch delays.</p>
            <div class="callout callout-tip">
              <span class="callout-title">MATERIALIZATION CRITERIA</span>
              Materialize Information Mart views into physical Delta or Snowflake tables only when query profiles indicate complex multi-table joins exceed a 3-second interactive dashboard SLA.
            </div>
            """
        },
        # PAGE 14: Semi-Structured & JSON Modeling
        {
            "badge": "Chapter 12",
            "h1": "Semi-Structured & JSON Modeling Patterns",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">MODERN POLYMORPHISM</span>
              Modern applications transmit data in flexible, nested JSON payloads. Modeling semi-structured data in cloud warehouses requires balancing schema-on-read flexibility with columnar query speed.
            </div>

            <h2>The Hybrid Variant Pattern</h2>
            <p>Instead of creating 50 separate tables for volatile JSON attributes or normalizing nested arrays into deep 3NF joins, cloud warehouses (Snowflake <code>VARIANT</code>, BigQuery <code>JSON</code>, Databricks <code>STRUCT/MAP</code>) allow storing raw payloads alongside typed relational columns.</p>

            <div class="code-box">
              <div class="code-header"><span>semi_structured_extraction.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Extracting nested JSON attributes in modern analytical queries</span>
<span class="code-keyword">CREATE OR REPLACE VIEW</span> gold.analytics.vw_web_events <span class="code-keyword">AS</span>
<span class="code-keyword">SELECT</span>
    event_id,
    event_timestamp,
    user_id,
    <span class="code-comment">-- Direct dot-notation extraction from VARIANT column</span>
    event_payload:device.os::<span class="code-keyword">VARCHAR</span> <span class="code-keyword">AS</span> operating_system,
    event_payload:device.browser::<span class="code-keyword">VARCHAR</span> <span class="code-keyword">AS</span> browser_name,
    event_payload:cart.items[0].product_id::<span class="code-keyword">INT</span> <span class="code-keyword">AS</span> primary_item_id,
    event_payload <span class="code-keyword">AS</span> raw_unparsed_json
<span class="code-keyword">FROM</span> silver.events.raw_telemetry;</div>
            </div>

            <h2>When to Explode vs. When to Retain JSON</h2>
            <ul>
              <li><strong>Extract to Top-Level Columns:</strong> Any attribute queried regularly in <code>WHERE</code> clauses, join predicates, or <code>GROUP BY</code> aggregations to leverage physical micro-partition pruning.</li>
              <li><strong>Retain as JSON/Variant:</strong> Rarely accessed operational debug flags, rapidly evolving external payloads, and sparse attributes present in &lt; 5% of records.</li>
            </ul>
            """
        },
        # PAGE 15: Many-to-Many Relationships
        {
            "badge": "Chapter 13",
            "h1": "Many-to-Many Relationships & Multi-Valued Dimensions",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ADVANCED RELATIONSHIPS</span>
              Real-world business entities frequently exhibit many-to-many relationships (e.g. Multiple bank accounts owned by multiple joint customers, or patient visits diagnosed with multiple medical conditions).
            </div>

            <div class="diagram-box">
+---------------------+     +-----------------------+     +--------------------+
|     FACT TABLE      | --> |     BRIDGE TABLE      | --> |  DIMENSION TABLE   |
|   Fact_Bank_Trans   |     |  Bridge_Account_Cust  |     |    Dim_Customer    |
|   Account_Key (FK)  |     |  Account_Key          |     |    Customer_Key    |
+---------------------+     |  Customer_Key         |     +--------------------+
                            |  Weighting_Factor     |
                            +-----------------------+
            </div>

            <h2>Weighting Factors in Bridge Tables</h2>
            <p>When multiple dimension members share a fact row, simply joining through a bridge table causes row explosion and duplicates financial amounts. Incorporating a <strong>Weighting Factor</strong> (e.g. 0.5 for a 50/50 joint account) allows reports to allocate proportional revenue accurately.</p>

            <div class="code-box">
              <div class="code-header"><span>bridge_allocation_query.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">SELECT</span>
    c.customer_name,
    <span class="code-func">SUM</span>(f.transaction_amount * b.weighting_factor) <span class="code-keyword">AS</span> allocated_balance
<span class="code-keyword">FROM</span> fact_account_balance f
<span class="code-keyword">INNER JOIN</span> bridge_account_customer b <span class="code-keyword">ON</span> f.account_key = b.account_key
<span class="code-keyword">INNER JOIN</span> dim_customer c <span class="code-keyword">ON</span> b.customer_key = c.customer_key
<span class="code-keyword">GROUP BY</span> c.customer_name;</div>
            </div>
            """
        },
        # PAGE 16: Bi-Temporal Modeling & Effective Dating
        {
            "badge": "Chapter 14",
            "h1": "Bi-Temporal Modeling: Assertion vs. State",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">REGULATORY COMPLIANCE</span>
              In financial and insurance domains, historical data models must distinguish between when an event actually occurred in the physical world (Valid Time) versus when the data warehouse learned about it (Transaction Time).
            </div>

            <h2>The Two Time Dimensions</h2>
            <ul>
              <li><strong>Valid Time (Business Time):</strong> The interval during which a fact or assertion was true in reality (e.g. An insurance policy effective from March 1 to September 1).</li>
              <li><strong>Transaction Time (System Time):</strong> The interval during which the record was stored and active in the analytical database (e.g. The system learned of a retroactive cancellation on April 15).</li>
            </ul>

            <table class="table-box">
              <tr>
                <th>Scenario Question</th>
                <th>Time Dimension Required</th>
                <th>Query Mechanism</th>
              </tr>
              <tr>
                <td>"What was our active policy count on March 15th as we believed it then?"</td>
                <td>System Transaction Time</td>
                <td><code>WHERE recorded_date &lt;= '2026-03-15'</code> (Reproduces historic audit)</td>
              </tr>
              <tr>
                <td>"What was our active policy count on March 15th based on what we know today?"</td>
                <td>Valid Business Time</td>
                <td><code>WHERE effective_start &lt;= '2026-03-15' AND effective_end &gt; '2026-03-15'</code></td>
              </tr>
            </table>

            <div class="callout callout-tip">
              <span class="callout-title">LEGAL DEFENSE</span>
              Bi-temporal modeling is the only architectural defense against regulatory audits requiring organizations to recreate financial statements as published on an exact prior historical date.
            </div>
            """
        },
        # PAGE 17: Normalization vs. Denormalization in MPP
        {
            "badge": "Chapter 15",
            "h1": "Normalization vs. Denormalization in Cloud MPP",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ENGINE CO-DESIGN</span>
              Classical 3NF normalization rules were formulated in the 1970s when disk storage was astronomically expensive and relational databases processed rows sequentially. Modern columnar cloud engines operate on inverted principles.
            </div>

            <h2>Why Columnar Engines Love Wide Tables (OBT)</h2>
            <p>Modern cloud data warehouses (Snowflake, BigQuery, Databricks, Redshift) store data by column, not by row. A wide One Big Table (OBT) with 200 columns incurs zero I/O read penalty when a query requests only 4 columns; the engine reads only those 4 columnar files from storage.</p>

            <table class="table-box">
              <tr>
                <th>Architecture Pattern</th>
                <th>Join Overhead</th>
                <th>Storage Footprint</th>
                <th>BI Performance</th>
              </tr>
              <tr>
                <td>3NF Relational Model</td>
                <td>Extreme (10+ multi-table joins)</td>
                <td>Minimal (Zero redundancy)</td>
                <td>Slowest; prone to join memory spills</td>
              </tr>
              <tr>
                <td>Kimball Star Schema</td>
                <td>Low (Single-hop foreign key joins)</td>
                <td>Low-Medium (Denormalized dims)</td>
                <td>Fast; ideal for semantic models</td>
              </tr>
              <tr>
                <td>One Big Table (OBT)</td>
                <td>Zero (Fully pre-joined flat table)</td>
                <td>High (Substantial redundancy)</td>
                <td>Blazing for ad-hoc aggregation queries</td>
              </tr>
            </table>

            <div class="callout callout-tip">
              <span class="callout-title">RECOMMENDATION</span>
              Use Star Schemas as the governed semantic core. Deploy OBT structures for high-concurrency external customer-facing APIs or specialized analytics where join latencies must be eliminated.
            </div>
            """
        },
        # PAGE 18: Metric Stores & Semantic Layer Modeling
        {
            "badge": "Chapter 16",
            "h1": "Metric Stores & Semantic Layer Modeling",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">GOVERNED METRICS</span>
              When three analysts query the data warehouse for 'Active Customers', they frequently produce three conflicting numbers due to divergent SQL filters. Metric Stores decouple metric definitions from downstream visualization tools.
            </div>

            <div class="diagram-box">
                       +-----------------------------+
                       |    DOWNSTREAM CONSUMPTION   |
                       |  Power BI / Looker / Excel  |
                       +-----------------------------+
                                      ^
                                      | (Unified SQL / API)
                       +-----------------------------+
                       |   GOVERNED SEMANTIC LAYER   |
                       | (dbt Semantic / Cube / Tab) |
                       | Metric: Gross ARR, CAC, LTV |
                       +-----------------------------+
                                      ^
                                      |
                       +-----------------------------+
                       |    STAR SCHEMAS / MARTS     |
                       | Fact Tables & Conformed Dims|
                       +-----------------------------+
            </div>

            <h2>Core Principles of the Modern Semantic Layer</h2>
            <ul>
              <li><strong>Define Metrics in Code:</strong> Business calculations (e.g. <code>Net Retention Rate</code>) are version-controlled in Git repositories rather than hardcoded in isolated Power BI PBIX files.</li>
              <li><strong>Dynamic Join Traversal:</strong> The semantic engine translates dimension requests into optimal SQL joins at query runtime based on declared data graph relationships.</li>
              <li><strong>Universal Consumption:</strong> Python data scientists, Excel financial analysts, and BI developers consume the identical metric logic via standard SQL/REST interfaces.</li>
            </ul>
            """
        },
        # PAGE 19: Case Study: Healthcare Patient & Claims Vault
        {
            "badge": "Chapter 17",
            "h1": "Production Case Study: Healthcare Claims Vault",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ENTERPRISE CASE STUDY</span>
              A national healthcare provider with 18 million members migrated from a brittle 3NF relational warehouse to an agile Data Vault 2.0 back-end feeding Kimball Star Schemas for clinical and financial analytics.
            </div>

            <h2>Architecture Overview & Scale</h2>
            <ul>
              <li><strong>Source Complexity:</strong> 12 independent hospital EHR systems, 4 billing platforms, and pharmacy claims feeds.</li>
              <li><strong>Raw Vault Core:</strong> <code>Hub_Patient</code>, <code>Hub_Provider</code>, <code>Hub_Encounter</code>, <code>Link_Encounter_Claim</code>, and 16 Satellites capturing clinical diagnoses and lab measurements.</li>
              <li><strong>Information Marts:</strong> Star schemas tracking Readmission Risk Facts and Claims Adjudication Facts.</li>
            </ul>

            <div class="code-box">
              <div class="code-header"><span>claims_star_schema.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment">-- Gold Mart Fact Table generated from Raw Vault</span>
<span class="code-keyword">CREATE TABLE</span> gold.claims.fact_adjudication <span class="code-keyword">AS</span>
<span class="code-keyword">SELECT</span>
    l.hk_encounter_claim_l,
    p.patient_sk,
    pr.provider_sk,
    d.date_key <span class="code-keyword">AS</span> service_date_key,
    s_claim.billed_amount_usd,
    s_claim.allowed_amount_usd,
    s_claim.paid_amount_usd,
    s_claim.denial_reason_code
<span class="code-keyword">FROM</span> raw_vault.link_encounter_claim l
<span class="code-keyword">INNER JOIN</span> business_vault.pit_claim pit <span class="code-keyword">ON</span> l.hk_encounter_claim_l = pit.hk_claim_l
<span class="code-keyword">INNER JOIN</span> raw_vault.sat_claim_financials s_claim 
    <span class="code-keyword">ON</span> pit.hk_claim_l = s_claim.hk_claim_l 
    <span class="code-keyword">AND</span> pit.sat_claim_load_date = s_claim.load_date
<span class="code-keyword">INNER JOIN</span> gold.dimensions.dim_patient p <span class="code-keyword">ON</span> l.hk_patient_h = p.hk_patient_h
<span class="code-keyword">INNER JOIN</span> gold.dimensions.dim_provider pr <span class="code-keyword">ON</span> l.hk_provider_h = pr.hk_provider_h;</div>
            </div>
            <p><strong>Business Impact:</strong> Data onboarding cycles for newly acquired hospital networks dropped from 9 months to 3 weeks. Full HIPAA audit history was preserved with zero data loss.</p>
            """
        },
        # PAGE 20: Modeling Anti-Patterns & Traps
        {
            "badge": "Chapter 18",
            "h1": "Data Modeling Anti-Patterns & Common Traps",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PITFALL PREVENTION</span>
              Flawed dimensional modeling choices made during early architecture phases create compounding technical debt that degrades query performance and distorts business metrics.
            </div>

            <table class="table-box">
              <tr>
                <th>Anti-Pattern</th>
                <th>Why It Occurs</th>
                <th>Architectural Remediation</th>
              </tr>
              <tr>
                <td><strong>Snowflaking</strong></td>
                <td>Developers normalize dimensions (e.g. Product -> Category -> SubCategory) out of 3NF habits</td>
                <td>Denormalize hierarchies into a single flat dimension table. Columnar compression renders repeated strings virtually free.</td>
              </tr>
              <tr>
                <td><strong>Fact-to-Fact Joins</strong></td>
                <td>Attempting to correlate two business processes directly in a single query</td>
                <td>Never join facts directly. Use Conformed Dimensions to drill-across separate star schemas.</td>
              </tr>
              <tr>
                <td><strong>Centipede Fact</strong></td>
                <td>Fact tables with 40 foreign key joins to micro-dimensions</td>
                <td>Consolidate low-cardinality flags into Junk Dimensions. Restrict foreign keys to primary business entities.</td>
              </tr>
              <tr>
                <td><strong>Natural Key Leakage</strong></td>
                <td>Using operational strings as primary keys across fact tables</td>
                <td>Always enforce surrogate keys or deterministic hash keys to protect against source key mutation.</td>
              </tr>
            </table>

            <h2>The Danger of Over-Partitioning Facts</h2>
            <p>Partitioning a fact table by both Country, Year, Month, and Department splits data into tiny, fragmented files. Cloud MPP engines spend more time negotiating file metadata than scanning rows. Limit physical partitioning to 1 or 2 high-cardinality date keys.</p>
            """
        },
        # PAGE 21: Architecture Decision Matrix
        {
            "badge": "Chapter 19",
            "h1": "Data Modeling Architecture Decision Matrix",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">METHODOLOGY SELECTION</span>
              Selecting the appropriate data modeling methodology depends strictly on organizational complexity, regulatory audit constraints, and data warehouse usage patterns.
            </div>

            <table class="table-box">
              <tr>
                <th>Business Constraint</th>
                <th>Kimball Star Schema</th>
                <th>Data Vault 2.0</th>
                <th>One Big Table (OBT)</th>
              </tr>
              <tr>
                <td>Frequent Source Schema Changes</td>
                <td>Requires Mart Schema Alters</td>
                <td><strong>Superior</strong> (Zero-touch Hubs/Links)</td>
                <td>Poor (Full table rebuild)</td>
              </tr>
              <tr>
                <td>Regulatory Legal Auditability</td>
                <td>Medium (Requires complex SCDs)</td>
                <td><strong>Superior</strong> (100% Raw Lineage)</td>
                <td>Poor (Loss of granularity)</td>
              </tr>
              <tr>
                <td>Direct Power BI / BI Tool Query</td>
                <td><strong>Superior</strong> (Single-hop joins)</td>
                <td>Poor (Excessive joins required)</td>
                <td>Excellent (Zero joins)</td>
              </tr>
              <tr>
                <td>Multi-Source Master Key Integration</td>
                <td>Difficult to reconcile</td>
                <td><strong>Superior</strong> (Hub Business Keys)</td>
                <td>Difficult to manage</td>
              </tr>
              <tr>
                <td>Implementation Speed</td>
                <td>Rapid (Weeks)</td>
                <td>Medium (Requires DV automation)</td>
                <td>Fastest (Hours)</td>
              </tr>
            </table>

            <h2>Architectural Decision Flowchart</h2>
            <ul>
              <li><strong>Do you require strict legal auditing & have 5+ heterogeneous source systems?</strong><br>
              &rarr; Deploy <strong>Data Vault 2.0</strong> in the Core Storage Layer.</li>
              <li><strong>Are you serving self-service semantic models and executive reporting?</strong><br>
              &rarr; Expose <strong>Kimball Star Schemas</strong> in the Consumption Layer.</li>
              <li><strong>Are you powering sub-second external customer analytics?</strong><br>
              &rarr; Materialize specialized <strong>OBT Flattened Tables</strong>.</li>
            </ul>
            """
        },
        # PAGE 22: Senior Architect Readiness Checklist
        {
            "badge": "Chapter 20",
            "h1": "Enterprise Data Architect Master Audit Checklist",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRE-FLIGHT ASSESSMENT</span>
              Verify every architectural standard across this master checklist before declaring any enterprise analytical data model production-ready.
            </div>

            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Grain Formalization:</strong> The grain of every fact table is explicitly documented in data dictionaries; no mixed-grain facts exist.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Conformed Standards:</strong> Enterprise conformed dimensions (Date, Customer, Product, Org) share identical surrogate keys across all departmental marts.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Surrogate Key Integrity:</strong> All star schema joins execute over synthetic integer surrogate keys; zero operational natural keys exist in join predicates.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>SCD Strategy:</strong> Temporal attributes correctly assigned Type 1 (overwrite), Type 2 (effective dating), or Type 6 (hybrid) policies with verified load scripts.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Data Vault Hash Governance:</strong> Cryptographic hash keys formatted with deterministic uppercase trimming and null character handling; zero collision exposure.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Semantic Layer Decoupling:</strong> Business KPIs (ARR, LTV, Churn) defined once in a governed semantic layer rather than hardcoded in front-end dashboards.</div>
            </div>

            <div class="callout callout-tip" style="margin-top: 14px;">
              <span class="callout-title">AUTHOR CLOSING STATEMENT</span>
              Exceptional data architecture survives decades of operational turnover. By anchoring your raw data in the resilient auditability of Data Vault 2.0 and serving business units through intuitive Kimball Star Schemas, your enterprise achieves the perfect equilibrium of agility and analytical precision.<br><br>
              <strong>Datta Sable</strong> · Enterprise Analytics & Data Architect · <em>dattasable.com</em>
            </div>
            """
        }
    ]
}
