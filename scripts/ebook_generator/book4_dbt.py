# scripts/ebook_generator/book4_dbt.py

BOOK_DBT = {
    "slug": "dbt-analytics-engineering-mastery-2026",
    "sku": "DS-EBOOK-DBT-MTR-2026",
    "title": "dbt & Modern Analytics Engineering: Modular Data Transformation",
    "cover_title_formatted": "dbt & <span>Modern Analytics</span> Engineering",
    "subtitle": "The definitive production manual for modular SQL data transformations, dbt Mesh multi-project architectures, automated Slim CI pipelines, and MetricFlow semantic layers.",
    "category_name": "Analytics Engineering",
    "category_slug": "analytics-engineering",
    "all_category_slugs": ["analytics-engineering", "sql-databases", "devops-dataops"],
    "features": ["22-page PDF", "2026 Edition", "Production dbt 1.8+ & dbt Mesh Architecture"],
    "included_resources": ["22-page PDF handbook"],
    "seo_title": "dbt & Modern Analytics Engineering | 2026 Edition",
    "seo_desc": "22-page dbt and modern analytics engineering handbook by Datta Sable. In-depth dbt Mesh, incremental models, Slim CI, and MetricFlow semantic modeling.",
    "pages": [
        # PAGE 2: Table of Contents & Pipeline Topology
        {
            "badge": "Architecture Blueprint",
            "h1": "Table of Contents & Modern Analytics Blueprint",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">EXECUTIVE OVERVIEW</span>
              Analytics engineering brings software engineering rigor—version control, automated testing, modularity, and CI/CD—to data transformation. dbt compiles modular Jinja-SQL into raw data warehouse execution, managing DAG dependencies and data quality gates.
            </div>

            <div class="diagram-box">
+------------------+     +-------------------+     +-------------------+
|  RAW SOURCES     | --> |   STAGING (stg_)  | --> | INTERMEDIATE(int_)|
| (Airbyte/Fivetran|     | Cleanse, Rename,  |     | Multi-source joins|
|  Snowflake/Fabric|     | Cast & Deduplicate|     | Complex business  |
+------------------+     +-------------------+     +-------------------+
                                                             |
                                                             v
+------------------+     +-------------------+     +-------------------+
| SEMANTIC METRICS | <--- | EXPOSURES (BI)    | <--- |   MARTS (fct/dim) |
| MetricFlow / ARR |     | Power BI, Tableau |     | Dimensional Star  |
| Customer LTV     |     | Looker Dashboards |     | Schemas for Teams |
+------------------+     +-------------------+     +-------------------+
            </div>

            <h2>Comprehensive Chapter Guide</h2>
            <div class="grid-2">
              <div class="grid-card">
                <h3>Part I: Project Architecture</h3>
                <p>• Ch 3: dbt Core vs Cloud Topology<br>
                • Ch 4: Staging, Int & Mart Layers<br>
                • Ch 5: Materialization Strategies<br>
                • Ch 6: Incremental Models & Merges<br>
                • Ch 7: Jinja & Reusable Macros</p>
              </div>
              <div class="grid-card">
                <h3>Part II: Testing & Governance</h3>
                <p>• Ch 8: Schema & Singular Testing<br>
                • Ch 9: Sources & Freshness SLAs<br>
                • Ch 10: Snapshots & Type 2 SCDs<br>
                • Ch 11: Seeds & BI Exposures<br>
                • Ch 12: Packages (dbt-utils, codegen)</p>
              </div>
            </div>
            <p><strong>Part III: Enterprise Scale:</strong> Ch 13 Semantic Layer & MetricFlow, Ch 14 dbt Mesh & Contracts, Ch 15 Slim CI & GitHub Actions, Ch 16 Automated Lineage Docs, Ch 17 Concurrency & Threads Tuning, Ch 18 RBAC & Environment Grants, Ch 19 SaaS ARR Mart Case Study, Ch 20 Anti-Patterns, Ch 21 CLI Cheat Sheet, Ch 22 Analytics Engineer Readiness Checklist.</p>
            """
        },
        # PAGE 3: dbt Core vs Cloud Architecture
        {
            "badge": "Chapter 01",
            "h1": "dbt Core vs. dbt Cloud: Enterprise Architecture",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PLATFORM FOUNDATIONS</span>
              Understanding the boundary between the open-source dbt Core compiler and the managed dbt Cloud enterprise platform is critical for designing compliant infrastructure.
            </div>

            <table class="table-box">
              <tr>
                <th>Capability</th>
                <th>dbt Core (Open Source)</th>
                <th>dbt Cloud (Enterprise SaaS)</th>
              </tr>
              <tr>
                <td>Compiler Execution</td>
                <td>Local CLI or self-hosted container (K8s/Airflow)</td>
                <td>Managed cloud runners</td>
              </tr>
              <tr>
                <td>Semantic Layer</td>
                <td>Requires manual MetricFlow self-hosting</td>
                <td>Turnkey hosted Semantic Layer proxy</td>
              </tr>
              <tr>
                <td>dbt Mesh (Cross-Project)</td>
                <td>Limited (Requires custom package imports)</td>
                <td>Native Cross-Project Ref & Lineage Graph</td>
              </tr>
              <tr>
                <td>Slim CI Runners</td>
                <td>Requires custom manifest.json S3 sync scripts</td>
                <td>Automated out-of-the-box GitHub/GitLab integration</td>
              </tr>
            </table>

            <h2>Standard Enterprise Directory Structure</h2>
            <div class="code-box">
              <div class="code-header"><span>directory_layout.txt</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">├── dbt_project.yml          # Core project manifest and configs
├── macros/                  # Custom reusable Jinja macros
├── models/
│   ├── staging/             # 1:1 with source tables (stg_source_entity.sql)
│   ├── intermediate/        # Internal modular logic (int_orders__joined.sql)
│   └── marts/               # Dimensional reporting (fct_orders, dim_customers)
├── snapshots/               # Type 2 SCD tracking tables
├── tests/                   # Singular custom SQL data tests
└── seeds/                   # Static CSV lookup references (country_codes.csv)</div>
            </div>
            """
        },
        # PAGE 4: Staging, Intermediate, and Mart Layers
        {
            "badge": "Chapter 02",
            "h1": "The Three-Tier Model Architecture",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">LAYERED DATA MODULARITY</span>
              Never build reporting tables directly on raw source dumps. The three-tier model architecture establishes strict separation between source ingestion, business logic composition, and presentation marts.
            </div>

            <h2>1. Staging Layer (<code>models/staging/</code>)</h2>
            <p>1:1 mapping with raw source tables. Actions permitted: renaming columns to snake_case standards, casting datatypes, standardizing date formats, and unpacking simple JSON fields. <em>Zero joins or aggregations permitted.</em></p>

            <h2>2. Intermediate Layer (<code>models/intermediate/</code>)</h2>
            <p>Combines multiple staging models to execute complex business transformations (e.g. aggregating customer order history, calculating rolling payment windows). Isolated from end-user BI tools to prevent breaking external dependencies.</p>

            <h2>3. Marts Layer (<code>models/marts/</code>)</h2>
            <p>Final Kimball-style Star Schemas exposed to business users and BI dashboards. Divided into Facts (<code>fct_revenue.sql</code>) and Dimensions (<code>dim_customer.sql</code>).</p>

            <div class="code-box">
              <div class="code-header"><span>models/staging/stripe/stg_stripe__payments.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">WITH</span> source <span class="code-keyword">AS</span> (
    <span class="code-keyword">SELECT</span> * <span class="code-keyword">FROM</span> {{ <span class="code-func">source</span>(<span class="code-str">'stripe'</span>, <span class="code-str">'charges'</span>) }}
),
renamed <span class="code-keyword">AS</span> (
    <span class="code-keyword">SELECT</span>
        id <span class="code-keyword">AS</span> payment_id,
        customer_id,
        amount / 100.0 <span class="code-keyword">AS</span> amount_usd,
        status <span class="code-keyword">AS</span> payment_status,
        created <span class="code-keyword">AS</span> created_at
    <span class="code-keyword">FROM</span> source
)
<span class="code-keyword">SELECT</span> * <span class="code-keyword">FROM</span> renamed;</div>
            </div>
            """
        },
        # PAGE 5: Materialization Strategies
        {
            "badge": "Chapter 03",
            "h1": "Materializations: View, Table, Ephemeral & Incremental",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PHYSICAL COMPILATION</span>
              Materializations determine how dbt persists compiled SQL in the data warehouse. Selecting the appropriate strategy balances compute cost, storage volume, and query latency.
            </div>

            <table class="table-box">
              <tr>
                <th>Materialization</th>
                <th>Physical Persistence</th>
                <th>Rebuild Cost</th>
                <th>Standard Production Recommendation</th>
              </tr>
              <tr>
                <td><strong>view</strong></td>
                <td>Virtual SQL query in warehouse</td>
                <td>Zero storage; cost paid on read</td>
                <td>All Staging models (<code>stg_</code>)</td>
              </tr>
              <tr>
                <td><strong>table</strong></td>
                <td>Physical table dropped and recreated</td>
                <td>High on rebuild; blazing fast on read</td>
                <td>Small/medium Dimension tables (&lt; 5M rows)</td>
              </tr>
              <tr>
                <td><strong>ephemeral</strong></td>
                <td>Compiled as an inlined CTE in child models</td>
                <td>Zero storage; zero schema footprint</td>
                <td>Reusable lightweight intermediate logic</td>
              </tr>
              <tr>
                <td><strong>incremental</strong></td>
                <td>Inserts/updates only newly arrived rows</td>
                <td>Minimal (Transforms only delta batch)</td>
                <td>High-volume Fact tables (&gt; 10M rows)</td>
              </tr>
            </table>

            <h2>Configuring Materializations in dbt_project.yml</h2>
            <div class="code-box">
              <div class="code-header"><span>dbt_project.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">models</span>:
  <span class="code-keyword">enterprise_analytics</span>:
    <span class="code-keyword">staging</span>:
      +<span class="code-keyword">materialized</span>: view
    <span class="code-keyword">intermediate</span>:
      +<span class="code-keyword">materialized</span>: ephemeral
    <span class="code-keyword">marts</span>:
      <span class="code-keyword">core</span>:
        +<span class="code-keyword">materialized</span>: table
      <span class="code-keyword">marketing</span>:
        +<span class="code-keyword">materialized</span>: incremental</div>
            </div>
            """
        },
        # PAGE 6: Mastering Incremental Models
        {
            "badge": "Chapter 04",
            "h1": "Mastering Incremental Models: Merge Strategies",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">HIGH-SCALE TRANSFORMATION</span>
              Rebuilding a 500-million row fact table every night is financially reckless and risks SLA breaches. Incremental models transform only rows that changed since the last dbt execution.
            </div>

            <h2>The Anatomy of an Incremental Model</h2>
            <div class="code-box">
              <div class="code-header"><span>models/marts/fct_orders.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">{{
  <span class="code-func">config</span>(
    materialized = <span class="code-str">'incremental'</span>,
    unique_key = <span class="code-str">'order_id'</span>,
    incremental_strategy = <span class="code-str">'merge'</span>,
    on_schema_change = <span class="code-str">'append_new_columns'</span>
  )
}}

<span class="code-keyword">SELECT</span>
    order_id,
    customer_id,
    order_status,
    order_amount,
    updated_at
<span class="code-keyword">FROM</span> {{ <span class="code-func">ref</span>(<span class="code-str">'stg_orders'</span>) }}

{% <span class="code-keyword">if</span> <span class="code-func">is_incremental</span>() %}
  <span class="code-comment">-- Only process records modified within the lookback window</span>
  <span class="code-keyword">WHERE</span> updated_at >= (
      <span class="code-keyword">SELECT</span> <span class="code-func">COALESCE</span>(<span class="code-func">MAX</span>(updated_at), <span class="code-str">'1900-01-01'</span>) - <span class="code-keyword">INTERVAL</span> <span class="code-str">'3 DAY'</span> 
      <span class="code-keyword">FROM</span> {{ <span class="code-keyword">this</span> }}
  )
{% <span class="code-keyword">endif</span> %}</div>
            </div>

            <h2>The Critical Lookback Window</h2>
            <p>Operational data is rarely delivered in perfect sequential order. Late-arriving web events or delayed accounting adjustments arrive days after occurrence. A 3-day lookback window (<code>INTERVAL '3 DAY'</code>) captures retrospective updates while the <code>unique_key</code> merge prevents duplicates.</p>
            <div class="callout callout-tip">
              <span class="callout-title">FULL-REFRESH FLAG</span>
              To force a complete table rebuild after major schema changes or logic refactors, execute: <code>dbt run --select fct_orders --full-refresh</code>.
            </div>
            """
        },
        # PAGE 7: Jinja & Reusable Macros
        {
            "badge": "Chapter 05",
            "h1": "Jinja Templating & Enterprise Macros",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DON'T REPEAT YOURSELF</span>
              Jinja empowers SQL with programming constructs: variables, loops, conditional branching, and reusable parameterized macros. It eliminates thousands of lines of copy-pasted SQL boilerplate.
            </div>

            <h2>Macro Example: Dynamic Pivot Table Generation</h2>
            <div class="code-box">
              <div class="code-header"><span>macros/pivot_payments.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">{% <span class="code-keyword">macro</span> <span class="code-func">pivot_payment_methods</span>(column_name, methods_list) -%}
  {%- <span class="code-keyword">for</span> method <span class="code-keyword">in</span> methods_list -%}
    <span class="code-func">SUM</span>(<span class="code-keyword">CASE WHEN</span> {{ column_name }} = <span class="code-str">'{{ method }}'</span> <span class="code-keyword">THEN</span> amount_usd <span class="code-keyword">ELSE</span> 0 <span class="code-keyword">END</span>) <span class="code-keyword">AS</span> {{ method }}_amount
    {%- <span class="code-keyword">if not</span> loop.last %},{% endif -%}
  {%- <span class="code-keyword">endfor</span> -%}
{%- <span class="code-keyword">endmacro</span> %}</div>
            </div>

            <h2>Consuming the Macro in a Model</h2>
            <div class="code-box">
              <div class="code-header"><span>models/marts/fct_daily_payments.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">SELECT</span>
    payment_date,
    {{ <span class="code-func">pivot_payment_methods</span>(<span class="code-str">'payment_method'</span>, [<span class="code-str">'credit_card'</span>, <span class="code-str">'bank_transfer'</span>, <span class="code-str">'paypal'</span>, <span class="code-str">'crypto'</span>]) }}
<span class="code-keyword">FROM</span> {{ <span class="code-func">ref</span>(<span class="code-str">'stg_payments'</span>) }}
<span class="code-keyword">GROUP BY</span> payment_date;</div>
            </div>

            <p><strong>Result:</strong> If the business adds a new payment method (e.g. <code>'apple_pay'</code>), adding one string to the array updates the compiled SQL cleanly across all models.</p>
            """
        },
        # PAGE 8: Schema & Singular Testing
        {
            "badge": "Chapter 06",
            "h1": "Testing Framework: Schema vs. Singular Tests",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DATA QUALITY GATES</span>
              dbt treats data quality as a non-negotiable compilation phase. Tests are automated assertions that query models; any returned rows indicate a test failure.
            </div>

            <h2>1. Generic Schema Tests (YAML)</h2>
            <div class="code-box">
              <div class="code-header"><span>models/marts/schema.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">version</span>: 2
<span class="code-keyword">models</span>:
  - <span class="code-keyword">name</span>: fct_orders
    <span class="code-keyword">columns</span>:
      - <span class="code-keyword">name</span>: order_id
        <span class="code-keyword">tests</span>:
          - <span class="code-keyword">unique</span>
          - <span class="code-keyword">not_null</span>
      - <span class="code-keyword">name</span>: order_status
        <span class="code-keyword">tests</span>:
          - <span class="code-keyword">accepted_values</span>:
              <span class="code-keyword">values</span>: [<span class="code-str">'placed'</span>, <span class="code-str">'shipped'</span>, <span class="code-str">'delivered'</span>, <span class="code-str">'returned'</span>]
      - <span class="code-keyword">name</span>: customer_id
        <span class="code-keyword">tests</span>:
          - <span class="code-keyword">relationships</span>:
              <span class="code-keyword">to</span>: <span class="code-func">ref</span>(<span class="code-str">'dim_customers'</span>)
              <span class="code-keyword">field</span>: customer_id</div>
            </div>

            <h2>2. Custom Singular Tests (SQL)</h2>
            <p>Singular tests assert complex business rules (e.g. Total discount amount cannot exceed gross sales revenue):</p>
            <div class="code-box">
              <div class="code-header"><span>tests/assert_discount_never_exceeds_revenue.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">SELECT</span> order_id, gross_amount, discount_amount
<span class="code-keyword">FROM</span> {{ <span class="code-func">ref</span>(<span class="code-str">'fct_orders'</span>) }}
<span class="code-keyword">WHERE</span> discount_amount > gross_amount;</div>
            </div>
            """
        },
        # PAGE 9: Sources & Freshness SLAs
        {
            "badge": "Chapter 07",
            "h1": "Sources & Freshness SLAs: Upstream Defense",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">UPSTREAM CONTRACTS</span>
              Hardcoding raw table names (e.g. <code>raw_db.raw_schema.orders</code>) creates fragile pipelines. Declaring Sources establishes clear lineage and enables automated freshness monitoring.
            </div>

            <h2>Declaring Sources with Freshness SLAs</h2>
            <div class="code-box">
              <div class="code-header"><span>models/staging/stripe/src_stripe.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">version</span>: 2
<span class="code-keyword">sources</span>:
  - <span class="code-keyword">name</span>: stripe
    <span class="code-keyword">database</span>: raw_payment_db
    <span class="code-keyword">schema</span>: stripe
    <span class="code-keyword">freshness</span>:
      <span class="code-keyword">warn_after</span>: {<span class="code-keyword">count</span>: 6, <span class="code-keyword">period</span>: hour}
      <span class="code-keyword">error_after</span>: {<span class="code-keyword">count</span>: 24, <span class="code-keyword">period</span>: hour}
    <span class="code-keyword">loaded_at_field</span>: _fivetran_synced
    <span class="code-keyword">tables</span>:
      - <span class="code-keyword">name</span>: charges
      - <span class="code-keyword">name</span>: customers</div>
            </div>

            <h2>Automated Freshness Inspection</h2>
            <p>Execute <code>dbt source freshness</code> before running downstream models. If upstream replication halted 18 hours ago, dbt halts the pipeline immediately and triggers an alert, preventing the generation of stale executive reports.</p>
            <div class="callout callout-tip">
              <span class="callout-title">LINEAGE DISCOVERY</span>
              In dbt Docs, Sources appear in bright green, providing clear visual separation between raw ingested data and internally curated dbt models.
            </div>
            """
        },
        # PAGE 10: Snapshots (Type 2 SCDs)
        {
            "badge": "Chapter 08",
            "h1": "Snapshots: Automating Type 2 SCDs in SQL",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">HISTORICAL TRACKING</span>
              Operational databases frequently overwrite records in place (SCD Type 1). dbt Snapshots observe mutable source tables over time, generating Type 2 SCD historical records automatically.
            </div>

            <h2>Check Strategy vs. Timestamp Strategy</h2>
            <ul>
              <li><strong>Timestamp Strategy:</strong> Relies on a reliable <code>updated_at</code> column in the source. Blazing fast because dbt queries only modified timestamps.</li>
              <li><strong>Check Strategy:</strong> Compares column values across every row. Ideal when upstream systems do not maintain accurate modification dates.</li>
            </ul>

            <div class="code-box">
              <div class="code-header"><span>snapshots/snap_customers.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">{% <span class="code-keyword">snapshot</span> snap_customers %}

{{
  <span class="code-func">config</span>(
    target_schema = <span class="code-str">'snapshots'</span>,
    unique_key = <span class="code-str">'customer_id'</span>,
    strategy = <span class="code-str">'timestamp'</span>,
    updated_at = <span class="code-str">'updated_at'</span>
  )
}}

<span class="code-keyword">SELECT</span> customer_id, customer_name, subscription_tier, billing_state, updated_at
<span class="code-keyword">FROM</span> {{ <span class="code-func">source</span>(<span class="code-str">'saas_app'</span>, <span class="code-str">'customers'</span>) }}

{% <span class="code-keyword">endsnapshot</span> %}</div>
            </div>

            <h2>Metadata Columns Injected by dbt</h2>
            <p>dbt automatically manages four historical columns: <code>dbt_scd_id</code> (surrogate hash), <code>dbt_updated_at</code>, <code>dbt_valid_from</code>, and <code>dbt_valid_to</code> (NULL indicates the active current record).</p>
            """
        },
        # PAGE 11: Seeds & BI Exposures
        {
            "badge": "Chapter 09",
            "h1": "Seeds & Exposures: Bridging the BI Boundary",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">BOUNDARIES & CONTEXT</span>
              Data projects require small static reference maps (country codes, marketing channel mappings) and end-to-end lineage tracing to downstream BI reports.
            </div>

            <h2>1. dbt Seeds: Version-Controlled CSVs</h2>
            <p>Save static reference files in <code>seeds/country_region_map.csv</code> and run <code>dbt seed</code>. dbt creates a managed warehouse table with zero pipeline code. <em>Do not use seeds for data &gt; 1,000 rows.</em></p>

            <h2>2. Exposures: Downstream Lineage Awareness</h2>
            <p>Exposures declare downstream consumers (Power BI, Tableau, ML models). If a schema change alters <code>fct_orders</code>, dbt lineage identifies which executive dashboards will break.</p>

            <div class="code-box">
              <div class="code-header"><span>models/exposures.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">version</span>: 2
<span class="code-keyword">exposures</span>:
  - <span class="code-keyword">name</span>: executive_arr_dashboard
    <span class="code-keyword">type</span>: dashboard
    <span class="code-keyword">maturity</span>: high
    <span class="code-keyword">url</span>: https://app.powerbi.com/groups/me/reports/arr-001
    <span class="code-keyword">owner</span>:
      <span class="code-keyword">name</span>: Datta Sable
      <span class="code-keyword">email</span>: bi-lead@enterprise.com
    <span class="code-keyword">depends_on</span>:
      - <span class="code-func">ref</span>(<span class="code-str">'fct_monthly_arr'</span>)
      - <span class="code-func">ref</span>(<span class="code-str">'dim_customers'</span>)</div>
            </div>
            """
        },
        # PAGE 12: Packages & Dependencies
        {
            "badge": "Chapter 10",
            "h1": "Packages & Dependencies: dbt-utils & Codegen",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ECOSYSTEM PRODUCTIVITY</span>
              The dbt package ecosystem accelerates development by providing pre-built macros for complex SQL operations, automated schema generation, and extended testing.
            </div>

            <h2>Essential packages.yml Manifest</h2>
            <div class="code-box">
              <div class="code-header"><span>packages.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">packages</span>:
  - <span class="code-keyword">package</span>: dbt-labs/dbt_utils
    <span class="code-keyword">version</span>: 1.2.0
  - <span class="code-keyword">package</span>: dbt-labs/codegen
    <span class="code-keyword">version</span>: 0.12.1
  - <span class="code-keyword">package</span>: calogica/dbt_expectations
    <span class="code-keyword">version</span>: 0.10.1</div>
            </div>

            <h2>Using Codegen to Generate 50-Column Staging SQL</h2>
            <p>Never type 50 column names manually. Run codegen macros in dbt CLI to output pre-formatted staging SQL:</p>
            <div class="code-box">
              <div class="code-header"><span>terminal</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">dbt run-operation generate_base_model --args '{"source_name": "stripe", "table_name": "charges"}'</div>
            </div>

            <h2>dbt-utils Power Macros</h2>
            <ul>
              <li><code>{{ dbt_utils.generate_surrogate_key(['customer_id', 'order_date']) }}</code>: Deterministic MD5 hash.</li>
              <li><code>{{ dbt_utils.star(from=ref('stg_orders'), except=['_fivetran_synced']) }}</code>: Dynamic star projection.</li>
            </ul>
            """
        },
        # PAGE 13: dbt Semantic Layer & MetricFlow
        {
            "badge": "Chapter 11",
            "h1": "dbt Semantic Layer & MetricFlow",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">GOVERNED BUSINESS LOGIC</span>
              The dbt Semantic Layer powered by MetricFlow allows analytics engineers to define business metrics (e.g. ARR, Gross Margin, Net Churn) once in YAML. Downstream applications query metrics with guaranteed consistency.
            </div>

            <div class="code-box">
              <div class="code-header"><span>models/semantic/semantic_orders.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">semantic_models</span>:
  - <span class="code-keyword">name</span>: orders
    <span class="code-keyword">model</span>: <span class="code-func">ref</span>(<span class="code-str">'fct_orders'</span>)
    <span class="code-keyword">dimensions</span>:
      - <span class="code-keyword">name</span>: order_date
        <span class="code-keyword">type</span>: time
        <span class="code-keyword">type_params</span>:
          <span class="code-keyword">time_granularity</span>: day
    <span class="code-keyword">measures</span>:
      - <span class="code-keyword">name</span>: total_revenue
        <span class="code-keyword">agg</span>: sum
        <span class="code-keyword">expr</span>: net_amount_usd

<span class="code-keyword">metrics</span>:
  - <span class="code-keyword">name</span>: gross_monthly_arr
    <span class="code-keyword">type</span>: simple
    <span class="code-keyword">type_params</span>:
      <span class="code-keyword">measure</span>: total_revenue</div>
            </div>

            <h2>How Downstream BI Connects</h2>
            <p>Power BI and Google Sheets connect to the dbt Semantic Layer via standard JDBC/ODBC proxies. The business user selects 'Metric: gross_monthly_arr' grouped by 'Dimension: Customer Region'. MetricFlow dynamically constructs the optimal SQL query at execution time.</p>
            """
        },
        # PAGE 14: dbt Mesh & Multi-Project Architectures
        {
            "badge": "Chapter 12",
            "h1": "dbt Mesh & Multi-Project Architecture",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ENTERPRISE SCALE</span>
              Monolithic dbt projects containing 2,000 models grind CI/CD builds to a halt. dbt Mesh decentralizes data transformation across independent departmental projects while enforcing cross-project contracts.
            </div>

            <div class="diagram-box">
+-------------------------+         +-------------------------+
|  FINANCE DBT PROJECT    |         |  MARKETING DBT PROJECT  |
|  (fct_revenue - Public) |         |  (fct_campaign_spend)   |
+-------------------------+         +-------------------------+
             |                                   |
             +-----------------+-----------------+
                               |
                               v
               +-------------------------------+
               |    EXECUTIVE CORE PROJECT     |
               | Cross-Project Ref:            |
               | {{ ref('finance', 'revenue') }}|
               +-------------------------------+
            </div>

            <h2>Model Access & Strict Contracts</h2>
            <p>Upstream teams declare models as <code>public</code> and enforce a <code>contract</code>. dbt prevents upstream developers from renaming or altering column datatypes without releasing a breaking major version.</p>
            <div class="code-box">
              <div class="code-header"><span>models/marts/fct_revenue.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">{{ <span class="code-func">config</span>(access = <span class="code-str">'public'</span>, contract = {<span class="code-str">'enforced'</span>: <span class="code-keyword">true</span>}) }}</div>
            </div>
            """
        },
        # PAGE 15: Slim CI with GitHub Actions
        {
            "badge": "Chapter 13",
            "h1": "Slim CI with GitHub Actions & State Comparison",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CI/CD VELOCITY</span>
              Executing <code>dbt run</code> on a 500-model project in every Pull Request consumes thousands of warehouse credits. Slim CI compares git branches against the production <code>manifest.json</code> to build only modified models and their direct downstream children.
            </div>

            <h2>The Slim CI Selector: <code>state:modified+</code></h2>
            <div class="code-box">
              <div class="code-header"><span>.github/workflows/dbt_slim_ci.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">name</span>: dbt Slim CI
<span class="code-keyword">on</span>: [pull_request]

<span class="code-keyword">jobs</span>:
  <span class="code-keyword">build</span>:
    <span class="code-keyword">runs-on</span>: ubuntu-latest
    <span class="code-keyword">steps</span>:
      - <span class="code-keyword">uses</span>: actions/checkout@v4
      - <span class="code-keyword">name</span>: Download Production Manifest
        <span class="code-keyword">run</span>: aws s3 cp s3://dbt-prod-artifacts/manifest.json ./prod-run-artifacts/manifest.json

      - <span class="code-keyword">name</span>: Run Modified Models Only
        <span class="code-keyword">run</span>: |
          dbt run --select state:modified+ --defer --state ./prod-run-artifacts --target pr_env
          dbt test --select state:modified+ --defer --state ./prod-run-artifacts --target pr_env</div>
            </div>

            <h2>Why <code>--defer</code> is Magic</h2>
            <p><code>--defer</code> allows un-modified upstream dependencies (e.g. <code>stg_orders</code>) to be referenced directly from production tables rather than rebuilding them inside the PR sandbox schema. PR build times drop from 45 minutes to 90 seconds!</p>
            """
        },
        # PAGE 16: Documentation & Lineage Deployment
        {
            "badge": "Chapter 14",
            "h1": "Documentation & Interactive Lineage Deployment",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">LIVING DOCUMENTATION</span>
              Documentation detached from code is always out of date. dbt auto-generates interactive, searchable documentation catalogs and dependency lineage DAGs directly from compiled models and Markdown doc blocks.
            </div>

            <h2>Using Doc Blocks for Reusable Explanations</h2>
            <div class="code-box">
              <div class="code-header"><span>models/docs/customer_docs.md</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">{% <span class="code-keyword">docs</span> customer_lifetime_value %}
**Customer Lifetime Value (LTV):**
Total net revenue earned from the customer across all historical subscription billing cycles, minus gross refund deductions.
{% <span class="code-keyword">enddocs</span> %}</div>
            </div>

            <h2>Referencing Doc Blocks in YAML</h2>
            <div class="code-box">
              <div class="code-header"><span>models/marts/dim_customers.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">columns</span>:
  - <span class="code-keyword">name</span>: lifetime_value_usd
    <span class="code-keyword">description</span>: <span class="code-str">"{{ doc('customer_lifetime_value') }}"</span></div>
            </div>

            <h2>Automated Doc Hosting Pipeline</h2>
            <p>Running <code>dbt docs generate</code> produces <code>index.html</code>, <code>manifest.json</code>, and <code>catalog.json</code>. Host these static assets on an internal AWS S3 website or Azure Blob container behind enterprise SSO to give business analysts self-service lineage discovery.</p>
            """
        },
        # PAGE 17: Performance Tuning & Threads
        {
            "badge": "Chapter 15",
            "h1": "Performance Tuning: Threads & Concurrency",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">WAREHOUSE OPTIMIZATION</span>
              dbt models that have zero shared dependencies can execute simultaneously. Tuning parallel thread counts maximizes warehouse compute capacity while preventing lock serialization.
            </div>

            <h2>Configuring Thread Concurrency in profiles.yml</h2>
            <div class="code-box">
              <div class="code-header"><span>profiles.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">production</span>:
  <span class="code-keyword">target</span>: prod
  <span class="code-keyword">outputs</span>:
    <span class="code-keyword">prod</span>:
      <span class="code-keyword">type</span>: snowflake
      <span class="code-keyword">threads</span>: 16               <span class="code-comment"># Up to 16 models executed simultaneously</span>
      <span class="code-keyword">warehouse</span>: TRANSFORM_WH_L
      <span class="code-keyword">database</span>: ANALYTICS</div>
            </div>

            <h2>The Thread Sizing Heuristic</h2>
            <table class="table-box">
              <tr>
                <th>Target Warehouse Size</th>
                <th>Recommended Thread Count</th>
                <th>Warning Indicator</th>
              </tr>
              <tr>
                <td>Small (X-Small / Small)</td>
                <td>4 – 8 threads</td>
                <td>Queueing in warehouse query history</td>
              </tr>
              <tr>
                <td>Medium / Large</td>
                <td>8 – 16 threads</td>
                <td>Optimal multi-DAG parallelism</td>
              </tr>
              <tr>
                <td>Multi-Cluster Auto-Scaling</td>
                <td>16 – 32 threads</td>
                <td>Warehouse spins up 2nd cluster cleanly</td>
              </tr>
            </table>

            <div class="callout callout-warn">
              <span class="callout-title">THREAD THROTTLING ALERT</span>
              If thread count is set to 32 on a single-node PostgreSQL or standard Snowflake X-Small warehouse, 30 queries will block waiting in queue, wasting client runner compute without accelerating wall-clock time.
            </div>
            """
        },
        # PAGE 18: Security & Environment Grants
        {
            "badge": "Chapter 16",
            "h1": "Security & RBAC: Environment Grants in dbt",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">LEAST PRIVILEGE</span>
              Hardcoding <code>GRANT SELECT ON TABLE</code> statements in custom post-hook scripts is error-prone. Modern dbt features declarative grant management directly in YAML manifests.
            </div>

            <h2>Declarative Grants in dbt_project.yml</h2>
            <div class="code-box">
              <div class="code-header"><span>dbt_project.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">models</span>:
  <span class="code-keyword">enterprise_analytics</span>:
    <span class="code-keyword">marts</span>:
      +<span class="code-keyword">grants</span>:
        <span class="code-keyword">select</span>: [<span class="code-str">'reporting_analysts'</span>, <span class="code-str">'bi_engine_role'</span>]
      <span class="code-keyword">finance</span>:
        +<span class="code-keyword">grants</span>:
          <span class="code-keyword">select</span>: [<span class="code-str">'finance_restricted_role'</span>] <span class="code-comment"># Only finance team can read</span></div>
            </div>

            <h2>Strict Environment Isolation</h2>
            <p>Ensure developers run against their isolated personal sandboxes (<code>target.schema = 'dbt_dsable'</code>) while automated CI runners target staging schemas. Under no circumstances should individual engineers possess <code>WRITE</code> credentials to the production schema.</p>
            """
        },
        # PAGE 19: Enterprise Scenario: SaaS ARR Mart
        {
            "badge": "Chapter 17",
            "h1": "Enterprise Scenario: SaaS ARR & Churn Mart",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRODUCTION IMPLEMENTATION</span>
              A high-growth B2B SaaS enterprise with 40,000 corporate clients models Annual Recurring Revenue (ARR), identifying New Business, Expansion, Contraction, and Churn on a monthly accounting grain.
            </div>

            <div class="code-box">
              <div class="code-header"><span>models/marts/fct_mrr_movements.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">WITH</span> monthly_subscriptions <span class="code-keyword">AS</span> (
    <span class="code-keyword">SELECT</span> * <span class="code-keyword">FROM</span> {{ <span class="code-func">ref</span>(<span class="code-str">'int_subscription_months'</span>) }}
),
mrr_with_lag <span class="code-keyword">AS</span> (
    <span class="code-keyword">SELECT</span>
        account_id,
        date_month,
        current_mrr,
        <span class="code-func">LAG</span>(current_mrr, 1, 0) <span class="code-keyword">OVER</span> (
            <span class="code-keyword">PARTITION BY</span> account_id <span class="code-keyword">ORDER BY</span> date_month
        ) <span class="code-keyword">AS</span> previous_mrr
    <span class="code-keyword">FROM</span> monthly_subscriptions
)
<span class="code-keyword">SELECT</span>
    account_id,
    date_month,
    current_mrr,
    previous_mrr,
    <span class="code-keyword">CASE</span>
        <span class="code-keyword">WHEN</span> previous_mrr = 0 <span class="code-keyword">AND</span> current_mrr > 0 <span class="code-keyword">THEN</span> <span class="code-str">'NEW_BUSINESS'</span>
        <span class="code-keyword">WHEN</span> current_mrr > previous_mrr <span class="code-keyword">THEN</span> <span class="code-str">'EXPANSION'</span>
        <span class="code-keyword">WHEN</span> current_mrr < previous_mrr <span class="code-keyword">AND</span> current_mrr > 0 <span class="code-keyword">THEN</span> <span class="code-str">'CONTRACTION'</span>
        <span class="code-keyword">WHEN</span> current_mrr = 0 <span class="code-keyword">AND</span> previous_mrr > 0 <span class="code-keyword">THEN</span> <span class="code-str">'CHURN'</span>
        <span class="code-keyword">ELSE</span> <span class="code-str">'RETAINED'</span>
    <span class="code-keyword">END AS</span> mrr_movement_type,
    current_mrr - previous_mrr <span class="code-keyword">AS</span> net_mrr_change
<span class="code-keyword">FROM</span> mrr_with_lag;</div>
            </div>
            """
        },
        # PAGE 20: Anti-Patterns in Analytics Engineering
        {
            "badge": "Chapter 18",
            "h1": "Analytics Engineering Anti-Patterns & Pitfalls",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PITFALL PREVENTION</span>
              As dbt projects expand to thousands of models, common engineering mistakes degrade compile times, create circular graph deadlocks, and pollute data marts.
            </div>

            <table class="table-box">
              <tr>
                <th>Anti-Pattern</th>
                <th>Failure Impact</th>
                <th>Engineering Correction</th>
              </tr>
              <tr>
                <td><strong>Bypassing Staging Layer</strong></td>
                <td>Marts query raw sources directly; changes in upstream source schemas break 30 marts simultaneously</td>
                <td>Enforce rule: Sources can ONLY be queried by staging models (<code>stg_</code>)</td>
              </tr>
              <tr>
                <td><strong>Circular Dependencies</strong></td>
                <td>Model A references Model B while Model B references Model A; compiler crashes with graph loop</td>
                <td>Refactor shared logic into a common upstream Intermediate model</td>
              </tr>
              <tr>
                <td><strong>Giant Monolithic CTEs</strong></td>
                <td>A single 1,200-line model with 20 nested CTEs; impossible to debug or unit-test</td>
                <td>Break into modular, intermediate ephemeral models</td>
              </tr>
              <tr>
                <td><strong>Zero Primary Key Tests</strong></td>
                <td>Duplicates in source feeds pass unnoticed, causing financial reports to double-count metrics</td>
                <td>Mandate <code>unique</code> and <code>not_null</code> tests on every single mart primary key</td>
              </tr>
            </table>

            <h2>The Re-Inventing Business Logic Bug</h2>
            <p>If three different models compute 'Active Paid Users' using slightly different WHERE clauses, executive confidence in the data warehouse evaporates. Consolidate business definitions into a single, canonical intermediate model.</p>
            """
        },
        # PAGE 21: dbt CLI Cheat Sheet
        {
            "badge": "Chapter 19",
            "h1": "dbt CLI Command Matrix & Essential Snippets",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DEVELOPER PRODUCTIVITY</span>
              Mastering dbt model selection syntax allows engineers to execute, compile, and test targeted portions of the DAG with laser precision.
            </div>

            <table class="table-box">
              <tr>
                <th>CLI Command</th>
                <th>Exact Operational Behavior</th>
              </tr>
              <tr>
                <td><code>dbt run --select fct_orders</code></td>
                <td>Executes only the specified model</td>
              </tr>
              <tr>
                <td><code>dbt run --select fct_orders+</code></td>
                <td>Executes <code>fct_orders</code> and all models downstream of it</td>
              </tr>
              <tr>
                <td><code>dbt run --select +fct_orders</code></td>
                <td>Executes <code>fct_orders</code> and all models upstream of it</td>
              </tr>
              <tr>
                <td><code>dbt run --select tag:finance</code></td>
                <td>Executes all models tagged with <code>finance</code> in their config</td>
              </tr>
              <tr>
                <td><code>dbt test --select path:models/marts</code></td>
                <td>Runs tests exclusively for models in the marts folder</td>
              </tr>
              <tr>
                <td><code>dbt build --select state:modified+</code></td>
                <td>Runs models, tests, snapshots, and seeds modified in git</td>
              </tr>
            </table>

            <h2>Inspecting Compiled SQL Instantly</h2>
            <div class="code-box">
              <div class="code-header"><span>terminal</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># Compile model to view raw SQL generated by Jinja macros</span>
dbt compile --select fct_monthly_arr
cat target/compiled/enterprise_analytics/models/marts/fct_monthly_arr.sql</div>
            </div>
            """
        },
        # PAGE 22: Analytics Engineer Readiness Checklist
        {
            "badge": "Chapter 20",
            "h1": "Senior Analytics Engineer Production Audit Checklist",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRE-FLIGHT ASSESSMENT</span>
              Verify every architectural standard across this checklist before releasing models to production or deploying to production CI/CD branches.
            </div>

            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Lineage Integrity:</strong> Raw sources referenced only in Staging models; zero raw tables called directly from marts or intermediate models.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Primary Key Testing:</strong> Every Staging and Mart table contains verified <code>unique</code> and <code>not_null</code> schema assertions on primary keys.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Incremental Logic Bounds:</strong> High-volume fact tables implement incremental materialization with a 3-day lookback window and <code>merge</code> unique keys.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Source Freshness SLAs:</strong> <code>src_*.yml</code> manifests define explicit <code>warn_after</code> and <code>error_after</code> thresholds on loaded timestamp fields.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Slim CI Automation:</strong> Pull Request GitHub Actions workflows execute <code>--select state:modified+ --defer</code> against production manifests.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Documentation & Exposures:</strong> Markdown doc blocks explain all primary financial metrics; downstream BI dashboards cataloged as exposures.</div>
            </div>

            <div class="callout callout-tip" style="margin-top: 14px;">
              <span class="callout-title">AUTHOR CLOSING STATEMENT</span>
              Analytics engineering transforms messy, unreliable SQL scripts into robust, version-controlled software systems. By enforcing strict 3-tier layering, declarative testing, and automated Slim CI, your data team delivers trusted insights at enterprise velocity.<br><br>
              <strong>Datta Sable</strong> · Enterprise Analytics & Data Architect · <em>dattasable.com</em>
            </div>
            """
        }
    ]
}
