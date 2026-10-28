# scripts/ebook_generator/book9_devops.py

BOOK_DEVOPS = {
    "slug": "devops-data-engineers-cicd-2026",
    "sku": "DS-EBOOK-DEVOPS-DE-2026",
    "title": "DevOps & CI/CD for Data Engineers: Modern DataOps Mastery",
    "cover_title_formatted": "DevOps & CI/CD for <span>Data Engineers</span>",
    "subtitle": "The definitive engineering manual for building robust DataOps pipelines: multi-stage Docker builds, Spark on Kubernetes, Terraform IaC, GitHub Actions CI/CD, and zero-downtime Blue-Green deployments.",
    "category_name": "DevOps & DataOps",
    "category_slug": "devops-dataops",
    "all_category_slugs": ["devops-dataops", "python-automation"],
    "features": ["22-page PDF", "2026 Edition", "Production Docker, K8s, Terraform & CI/CD Blueprints"],
    "included_resources": ["22-page PDF handbook"],
    "seo_title": "DevOps & CI/CD for Data Engineers | 2026 Edition",
    "seo_desc": "22-page DevOps and CI/CD for Data Engineers handbook by Datta Sable. In-depth DataOps, Docker, Kubernetes Spark, Terraform, and automated GitHub Actions pipelines.",
    "pages": [
        # PAGE 2: Table of Contents & DataOps Pipeline Blueprint
        {
            "badge": "Architecture Blueprint",
            "h1": "Table of Contents & DataOps Pipeline Blueprint",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">EXECUTIVE OVERVIEW</span>
              DataOps applies agile software engineering methodologies—continuous integration, automated unit testing, containerized runtimes, and declarative infrastructure—to data platforms, eliminating brittle manual scripts and midnight deployment emergencies.
            </div>

            <div class="diagram-box">
+---------------------+     +-------------------------------------------------+
|  GIT COMMIT (PR)    | --> |           GITHUB ACTIONS CI RUNNER              |
| Feature Branch Code |     | Linting (Ruff/Flake8) -> PyTest Unit & Mocks    |
+---------------------+     | Trivy Container Vulnerability Scan              |
                            +-------------------------------------------------+
                                                     |
                                                     v
+---------------------+     +-------------------------------------------------+
| EPHEMERAL PREVIEW   | <-- |             TERRAFORM IaC & SANDBOX             |
| Isolated PR Schema  |     | Provisions disposable schema & builds dbt models|
+---------------------+     +-------------------------------------------------+
                                                     |
                                                     v (Merged to Main)
+---------------------+     +-------------------------------------------------+
| ARTIFACT REGISTRY   | --> |            PRODUCTION CD PIPELINE               |
| Signed Docker Image |     | Blue-Green Deployment to Kubernetes (EKS / AKS) |
| & Python Wheel Pkg  |     | Data Quality Gate Validation (Great Expectations|
+---------------------+     +-------------------------------------------------+
            </div>

            <h2>Comprehensive Chapter Guide</h2>
            <div class="grid-2">
              <div class="grid-card">
                <h3>Part I: Infrastructure & Containers</h3>
                <p>• Ch 3: Git Branching Strategies<br>
                • Ch 4: Multi-Stage Docker Builds<br>
                • Ch 5: Spark on Kubernetes (K8s)<br>
                • Ch 6: Terraform Infrastructure as Code<br>
                • Ch 7: CI/CD Pipeline Architecture</p>
              </div>
              <div class="grid-card">
                <h3>Part II: Testing & Quality Gates</h3>
                <p>• Ch 8: PyTest Unit Testing & Mocks<br>
                • Ch 9: Great Expectations Quality Gates<br>
                • Ch 10: Ephemeral Preview Sandboxes<br>
                • Ch 11: Flyway & Schema Migrations<br>
                • Ch 12: Semantic Versioning & Wheels</p>
              </div>
            </div>
            <p><strong>Part III: Enterprise Operations:</strong> Ch 13 Secret Injection, Ch 14 Blue-Green Deployments, Ch 15 Prometheus & OpenLineage, Ch 16 CI/CD Cost Controls, Ch 17 Chaos Engineering for Data, Ch 18 Airflow on Helm, Ch 19 10TB/Day Streaming Case Study, Ch 20 DataOps Pitfalls, Ch 21 GitHub Actions Boilerplate, Ch 22 DataOps Maturity Audit Checklist.</p>
            """
        },
        # PAGE 3: Git Branching Strategies
        {
            "badge": "Chapter 01",
            "h1": "Git Branching Strategies for Data Engineering",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">VERSION CONTROL HYGIENE</span>
              Applying heavy, multi-month GitFlow branching models creates devastating merge conflicts when upstream schemas evolve. Trunk-Based Development with ephemeral feature branches is the modern DataOps standard.
            </div>

            <h2>Trunk-Based Development Rules for Data</h2>
            <ul>
              <li><strong>Short-Lived Branches:</strong> Feature branches exist for less than 48 hours, scoped to a single pipeline or model modification.</li>
              <li><strong>Linear Git History:</strong> Enforce fast-forward or squash-and-merge policies to maintain a clean, bisect-able Git log.</li>
              <li><strong>Feature Flags:</strong> Incomplete pipeline logic deploys to production behind runtime configuration toggles rather than lingering in unmerged stale branches.</li>
            </ul>
            """
        },
        # PAGE 4: Multi-Stage Docker Builds
        {
            "badge": "Chapter 02",
            "h1": "Containerization: Multi-Stage Docker Builds",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CONTAINER HYGIENE</span>
              Bloated Docker images containing compilers, build tools, and cache files waste network bandwidth and introduce security vulnerabilities. Multi-stage builds produce ultra-lean, production-ready images.
            </div>

            <div class="code-box">
              <div class="code-header"><span>Dockerfile.multistage</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># Stage 1: Build & Dependency Resolution</span>
<span class="code-keyword">FROM</span> python:3.11-slim <span class="code-keyword">AS</span> builder
<span class="code-keyword">WORKDIR</span> /app
<span class="code-keyword">RUN</span> apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev
<span class="code-keyword">COPY</span> requirements.txt .
<span class="code-keyword">RUN</span> pip install --user --no-cache-dir -r requirements.txt

<span class="code-comment"># Stage 2: Final Minimal Runtime Image (Zero Build Tools!)</span>
<span class="code-keyword">FROM</span> python:3.11-slim <span class="code-keyword">AS</span> runner
<span class="code-keyword">WORKDIR</span> /app
<span class="code-keyword">RUN</span> apt-get update && apt-get install -y --no-install-recommends libpq5 && rm -rf /var/lib/apt/lists/*
<span class="code-keyword">COPY</span> --from=builder /root/.local /root/.local
<span class="code-keyword">COPY</span> src/ /app/src/
<span class="code-keyword">ENV</span> PATH=/root/.local/bin:$PATH
<span class="code-keyword">USER</span> 10001 <span class="code-comment"># Non-root security enforcement</span>
<span class="code-keyword">ENTRYPOINT</span> ["python", "-m", "src.main_pipeline"]</div>
            </div>
            """
        },
        # PAGE 5: Spark on Kubernetes (K8s)
        {
            "badge": "Chapter 03",
            "h1": "Kubernetes for Data Pipelines: Spark on K8s",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CLOUD-NATIVE COMPUTE</span>
              Kubernetes has superseded legacy Hadoop YARN clusters for big data workloads. Deploying Apache Spark natively on Kubernetes enables elastic pod auto-scaling and multi-tenant resource quotas.
            </div>

            <h2>Spark Operator Manifest Architecture</h2>
            <div class="code-box">
              <div class="code-header"><span>spark-app.yaml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">apiVersion</span>: sparkoperator.k8s.io/v1beta2
<span class="code-keyword">kind</span>: SparkApplication
<span class="code-keyword">metadata</span>:
  <span class="code-keyword">name</span>: daily-etl-processor
  <span class="code-keyword">namespace</span>: data-workloads
<span class="code-keyword">spec</span>:
  <span class="code-keyword">type</span>: Python
  <span class="code-keyword">mode</span>: cluster
  <span class="code-keyword">image</span>: enterprise-registry.azurecr.io/spark-etl:1.4.0
  <span class="code-keyword">mainApplicationFile</span>: local:///app/src/etl_main.py
  <span class="code-keyword">sparkVersion</span>: "3.5.0"
  <span class="code-keyword">driver</span>:
    <span class="code-keyword">cores</span>: 2
    <span class="code-keyword">memory</span>: "4g"
  <span class="code-keyword">executor</span>:
    <span class="code-keyword">cores</span>: 4
    <span class="code-keyword">instances</span>: 8
    <span class="code-keyword">memory</span>: "16g"</div>
            </div>
            """
        },
        # PAGE 6: Terraform Infrastructure as Code
        {
            "badge": "Chapter 04",
            "h1": "Infrastructure as Code: Terraform for Data",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DECLARATIVE INFRASTRUCTURE</span>
              Creating storage accounts, IAM roles, and Snowflake warehouses via point-and-click cloud consoles guarantees un-reproducible environments. Terraform codifies the entire data estate.
            </div>

            <h2>Terraform State Management for Data Estates</h2>
            <ul>
              <li><strong>Remote State Locking:</strong> Store Terraform state in Azure Blob / S3 with DynamoDB state locking to prevent concurrent overwrite corruption.</li>
              <li><strong>Modular Workspaces:</strong> Separate state files for Networking, Compute, and Databases to bound blast radius.</li>
            </ul>
            """
        },
        # PAGE 7: CI/CD Pipeline Architecture
        {
            "badge": "Chapter 05",
            "h1": "CI/CD Pipeline Architecture: GitHub Actions",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PIPELINE AUTOMATION</span>
              A production CI/CD pipeline acts as an automated quality gatekeeper, enforcing linting, unit tests, security scans, and deployment staging on every commit.
            </div>

            <h2>The Four CI/CD Pipeline Stages</h2>
            <ol>
              <li><strong>Lint & Static Analysis:</strong> <code>ruff check .</code>, <code>sqlfluff lint models/</code> (Fails in &lt; 20 seconds).</li>
              <li><strong>Unit Testing & Coverage:</strong> <code>pytest tests/unit/</code> with mocked data sources.</li>
              <li><strong>Ephemeral Integration Run:</strong> Build models against an isolated PR database schema.</li>
              <li><strong>Promotion to Production:</strong> Zero-downtime blue-green swap upon PR merge.</li>
            </ol>
            """
        },
        # PAGE 8: Automated Data Testing: PyTest & Mocks
        {
            "badge": "Chapter 06",
            "h1": "Automated Testing: PyTest & Unit Test Mocks",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DETERMINISTIC VALIDATION</span>
              Never run unit tests against production databases. Mocking allows data engineers to test complex PySpark transformations locally in memory within milliseconds.
            </div>

            <div class="code-box">
              <div class="code-header"><span>tests/test_currency_transform.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">import</span> pytest
<span class="code-keyword">from</span> chispa.dataframe_comparer <span class="code-keyword">import</span> assert_df_equality
<span class="code-keyword">from</span> src.transforms <span class="code-keyword">import</span> normalize_currency

<span class="code-keyword">def</span> <span class="code-func">test_normalize_currency_converts_cents_to_dollars</span>(spark):
    input_data = [(<span class="code-str">"tx_1"</span>, <span class="code-keyword">1000</span>), (<span class="code-str">"tx_2"</span>, <span class="code-keyword">2550</span>)]
    input_df = spark.createDataFrame(input_data, [<span class="code-str">"id"</span>, <span class="code-str">"cents"</span>])
    
    expected_data = [(<span class="code-str">"tx_1"</span>, <span class="code-keyword">10.0</span>), (<span class="code-str">"tx_2"</span>, <span class="code-keyword">25.5</span>)]
    expected_df = spark.createDataFrame(expected_data, [<span class="code-str">"id"</span>, <span class="code-str">"dollars"</span>])
    
    result_df = normalize_currency(input_df)
    assert_df_equality(result_df, expected_df)</div>
            </div>
            """
        },
        # PAGE 9: Data Quality Gates: Great Expectations
        {
            "badge": "Chapter 07",
            "h1": "Data Quality Gates: Great Expectations & Soda",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRE-LOAD ASSERTIONS</span>
              Code tests verify that software logic compiles; Data Quality tests verify that incoming raw data adheres to contractual assumptions before populating production tables.
            </div>

            <h2>Declarative Assertions in Great Expectations</h2>
            <div class="code-box">
              <div class="code-header"><span>expectations_suite.json</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">{
  "expectation_type": "expect_column_values_to_be_between",
  "kwargs": {
    "column": "customer_age",
    "min_value": 18,
    "max_value": 120
  }
}</div>
            </div>
            <p>If upstream data violates expectations, the pipeline halts immediately, preventing bad records from polluting executive dashboards.</p>
            """
        },
        # PAGE 10: Ephemeral Preview Sandboxes
        {
            "badge": "Chapter 08",
            "h1": "Environment Strategy: Ephemeral Preview Sandboxes",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">SANDBOX ISOLATION</span>
              Sharing a single dirty 'Dev' database causes developers to overwrite each other's test data. Ephemeral sandboxes spin up a dedicated schema per Pull Request and destroy it upon merge.
            </div>

            <h2>Automated Ephemeral Lifecycle</h2>
            <div class="diagram-box">
1. DEVELOPER OPENS PR #84 ---> GitHub Actions triggers: CREATE SCHEMA pr_84;
2. DBT COMPILES & RUNS    ---> Models populate pr_84 using Zero-Copy Clone
3. CODE REVIEWED & MERGED ---> GitHub Actions triggers: DROP SCHEMA pr_84;
            </div>
            """
        },
        # PAGE 11: Schema Migrations: Flyway & Alembic
        {
            "badge": "Chapter 09",
            "h1": "Database Versioning: Flyway & Alembic",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">SCHEMA EVOLUTION</span>
              Altering production database schemas with manual ad-hoc SQL commands is a recipe for disaster. Flyway and Alembic treat database DDL as immutable, versioned migration scripts.
            </div>

            <h2>Ordered Migration Naming Conventions</h2>
            <p><code>V1.0__create_orders_table.sql</code> &rarr; <code>V1.1__add_loyalty_column.sql</code>. Migration tools record applied checksums in a metadata table (<code>flyway_schema_history</code>), ensuring migrations execute in strict sequential order across all environments.</p>
            """
        },
        # PAGE 12: Artifact Management & Wheel Packages
        {
            "badge": "Chapter 10",
            "h1": "Artifact Management: Container Registries & Wheels",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">BUILD ONCE, DEPLOY EVERYWHERE</span>
              Never rebuild code from raw source inside production environments. Package shared Python transformation logic into version-controlled Wheel packages published to private registries.
            </div>

            <h2>Semantic Versioning Standard (SemVer)</h2>
            <p>Follow strict <code>MAJOR.MINOR.PATCH</code> rules. Breaking schema alterations increment MAJOR; backward-compatible transformations increment MINOR; hotfixes increment PATCH.</p>
            """
        },
        # PAGE 13: Secret Injection in CI/CD Runners
        {
            "badge": "Chapter 11",
            "h1": "Configuration Management & Secret Injection",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ZERO TRUST RUNNERS</span>
              Storing long-lived cloud credentials in GitHub repository secrets exposes pipelines to credential theft. Modern CI/CD utilizes OpenID Connect (OIDC) token exchange.
            </div>

            <h2>OIDC Passwordless Authentication</h2>
            <p>GitHub Actions runners exchange a cryptographic JSON Web Token (JWT) directly with Azure/AWS, receiving a short-lived 1-hour access token without storing static passwords.</p>
            """
        },
        # PAGE 14: Blue-Green Deployments for Pipelines
        {
            "badge": "Chapter 12",
            "h1": "Blue-Green & Canary Deployments for Data",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ZERO-DOWNTIME RELEASES</span>
              Upgrading a high-throughput production pipeline while live data is streaming requires Blue-Green deployment architecture to eliminate downtime and ensure instantaneous rollback capability.
            </div>

            <div class="diagram-box">
[ INCOMING DATA STREAM ] ---> [ ROUTER / LOAD BALANCER ]
                                           |
                    +----------------------+----------------------+
                    v (Active 100% Traffic)                       v (Idle / Staging)
        [ BLUE ENVIRONMENT (v1.2) ]                   [ GREEN ENVIRONMENT (v1.3) ]
                    |                                             |
            (Verified Stable)                           (Awaiting Final Verification)
            
* ON SWAP: Router atomically redirects traffic to GREEN (v1.3). Rollback is instant!
            </div>
            """
        },
        # PAGE 15: Observability: Prometheus & OpenLineage
        {
            "badge": "Chapter 13",
            "h1": "Observability & Monitoring: Prometheus & OpenLineage",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CONTINUOUS TELEMETRY</span>
              Pipeline observability monitors the 5 Pillars of Data Health: Freshness, Distribution, Volume, Schema, and Lineage. OpenLineage provides a vendor-neutral standard for tracking data flow metadata.
            </div>

            <h2>Prometheus Alerting Rules for Pipeline SLAs</h2>
            <p>Export pipeline execution duration metrics to Prometheus. Trigger automated PagerDuty incidents when: <code>pipeline_execution_time_seconds &gt; 3600</code>.</p>
            """
        },
        # PAGE 16: CI/CD Cost Controls & Layer Caching
        {
            "badge": "Chapter 14",
            "h1": "Cost Optimization in CI/CD Runners",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">FINANCIAL GOVERNANCE</span>
              Re-downloading 2GB of Python packages on every git push inflates cloud build invoices and slows developer velocity. Docker layer caching and GitHub action caches slash build times.
            </div>

            <h2>Docker BuildKit Layer Caching</h2>
            <div class="code-box">
              <div class="code-header"><span>github_actions_caching.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">- <span class="code-keyword">name</span>: Build Docker Image with GitHub Cache
  <span class="code-keyword">uses</span>: docker/build-push-action@v5
  <span class="code-keyword">with</span>:
    <span class="code-keyword">cache-from</span>: type=gha
    <span class="code-keyword">cache-to</span>: type=gha,mode=max</div>
            </div>
            """
        },
        # PAGE 17: Chaos Engineering for Data
        {
            "badge": "Chapter 15",
            "h1": "Chaos Engineering: Simulating Pipeline Failures",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">RESILIENCE TESTING</span>
              Do not wait for production to discover how your streaming pipeline handles upstream network disconnects or corrupt JSON schema drift. Test failure modes proactively using Chaos Engineering.
            </div>

            <h2>Three Chaos Scenarios to Automate in Staging</h2>
            <ol>
              <li><strong>Upstream Schema Drift:</strong> Inject unannounced columns and modified date formats into the raw streaming queue.</li>
              <li><strong>Worker Node Termination:</strong> Kill 50% of Spark worker pods mid-shuffle to verify task re-computation recovery.</li>
              <li><strong>Network Latency Spikes:</strong> Inject 500ms artificial network latency on database connections to test retry backoffs.</li>
            </ol>
            """
        },
        # PAGE 18: Orchestration Deployment: Airflow on Helm
        {
            "badge": "Chapter 16",
            "h1": "Orchestration Deployment: Airflow on Helm",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRODUCTION SCHEDULING</span>
              Running Apache Airflow as a pet virtual machine is an operational anti-pattern. Deploying Airflow on Kubernetes via official Helm charts enables horizontal Celery and KubernetesExecutor scaling.
            </div>

            <h2>Git-Sync DAG Synchronization</h2>
            <p>Configure the <code>git-sync</code> sidecar container inside Airflow scheduler pods. When developers merge DAG Python scripts to Git, the sidecar pulls updates in 10 seconds without restarting the scheduler.</p>
            """
        },
        # PAGE 19: Case Study: 10TB/Day Streaming Pipeline
        {
            "badge": "Chapter 17",
            "h1": "Case Study: Zero-Downtime 10TB/Day Deployment",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">HIGH-SCALE CASE STUDY</span>
              A global media streaming platform processes 10TB of telemetry logs daily. Migrating from manual SSH deployments to automated GitOps with ArgoCD eliminated pipeline outages.
            </div>

            <h2>Production Architecture & Metrics</h2>
            <ul>
              <li><strong>Deployment Cadence:</strong> Accelerated from once every 2 weeks to 8 zero-downtime releases daily.</li>
              <li><strong>Failure Rate:</strong> Production pipeline rollback rate dropped from 22% to 0.4%.</li>
              <li><strong>Recovery MTTR:</strong> Mean Time to Recovery from unexpected schema anomalies reduced from 6 hours to 8 minutes.</li>
            </ul>
            """
        },
        # PAGE 20: Top DataOps Pitfalls
        {
            "badge": "Chapter 18",
            "h1": "Top 10 DataOps Pitfalls & Failure Patterns",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PITFALL PREVENTION</span>
              Common operational failures that undermine engineering agility in data teams.
            </div>

            <table class="table-box">
              <tr>
                <th>DataOps Pitfall</th>
                <th>Failure Consequence</th>
                <th>Enforced Standard</th>
              </tr>
              <tr>
                <td>Shared Mutable Dev Environments</td>
                <td>Developers overwrite each other's test records; irreproducible bugs</td>
                <td>Mandate automated ephemeral PR schemas</td>
              </tr>
              <tr>
                <td>Manual Production Hotfixes via SSH</td>
                <td>Code in production diverges from Git; next automated deploy overwrites fix</td>
                <td>Zero manual production edits; all changes route through Git PRs</td>
              </tr>
              <tr>
                <td>Unpinned Dependency Versions</td>
                <td>A 3rd-party library releases a breaking patch, breaking all CI builds</td>
                <td>Pin all dependencies with explicit hashes (<code>poetry.lock</code>)</td>
              </tr>
              <tr>
                <td>Missing Rollback Procedures</td>
                <td>A failed migration halts production for 4 hours while engineers debug SQL</td>
                <td>Every DDL migration must include an automated, tested downgrade script</td>
              </tr>
            </table>
            """
        },
        # PAGE 21: GitHub Actions CI Boilerplate
        {
            "badge": "Chapter 19",
            "h1": "Production GitHub Actions DataOps Pipeline Boilerplate",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">STARTER TEMPLATE</span>
              Production GitHub Actions workflow executing code linting, unit tests, and security scanning on every Pull Request.
            </div>

            <div class="code-box">
              <div class="code-header"><span>.github/workflows/data_ci.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">name</span>: DataOps Automated CI
<span class="code-keyword">on</span>: [pull_request]

<span class="code-keyword">jobs</span>:
  <span class="code-keyword">validate</span>:
    <span class="code-keyword">runs-on</span>: ubuntu-latest
    <span class="code-keyword">steps</span>:
      - <span class="code-keyword">uses</span>: actions/checkout@v4
      - <span class="code-keyword">uses</span>: actions/setup-python@v5
        <span class="code-keyword">with</span>:
          <span class="code-keyword">python-version</span>: "3.11"
      - <span class="code-keyword">name</span>: Install Dependencies
        <span class="code-keyword">run</span>: pip install ruff pytest chispa
      - <span class="code-keyword">name</span>: Fast Linting Check
        <span class="code-keyword">run</span>: ruff check src/ tests/
      - <span class="code-keyword">name</span>: Execute Unit Tests with PyTest
        <span class="code-keyword">run</span>: pytest tests/unit/ --maxfail=1</div>
            </div>
            """
        },
        # PAGE 22: DataOps Maturity Audit Checklist
        {
            "badge": "Chapter 20",
            "h1": "Enterprise DataOps Maturity Audit Checklist",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRE-FLIGHT ASSESSMENT</span>
              Verify every operational standard across this checklist before certifying your data engineering deployment pipeline as enterprise-grade.
            </div>

            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Version Control Discipline:</strong> 100% of pipeline code, SQL models, and DAGs version-controlled in Git; trunk-based PR workflow.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Containerized Runtimes:</strong> Pipelines execute in lean, multi-stage Docker containers with pinned dependencies and non-root users.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Infrastructure as Code:</strong> Cloud storage, network endpoints, and compute clusters managed declaratively in Terraform.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Automated Quality Gates:</strong> CI/CD validates code with unit tests and evaluates raw data with Great Expectations before loading.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Zero-Downtime Deployments:</strong> Production pipelines support Blue-Green or rolling upgrades with instantaneous rollback mechanisms.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Full Observability:</strong> OpenLineage tracking records data provenance; automated alerts fire on SLA duration breaches.</div>
            </div>

            <div class="callout callout-tip" style="margin-top: 14px;">
              <span class="callout-title">AUTHOR CLOSING STATEMENT</span>
              Data engineering is software engineering applied to information systems. By embracing automated testing, containerized immutability, and disciplined CI/CD, your data platform delivers rapid business innovation with uncompromising operational stability.<br><br>
              <strong>Datta Sable</strong> · Enterprise Analytics & Data Architect · <em>dattasable.com</em>
            </div>
            """
        }
    ]
}
