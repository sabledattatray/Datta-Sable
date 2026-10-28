# scripts/ebook_generator/book10_governance.py

BOOK_GOVERNANCE = {
    "slug": "data-governance-mdm-purview-2026",
    "sku": "DS-EBOOK-GOV-MDM-2026",
    "title": "Data Governance, Master Data Management & Microsoft Purview",
    "cover_title_formatted": "Data Governance, <span>MDM & Microsoft Purview</span>",
    "subtitle": "The authoritative blueprint for enterprise data cataloging, automated lineage extraction, Master Data Management golden records, and unified Microsoft Purview governance.",
    "category_name": "Data Governance & MDM",
    "category_slug": "data-governance-mdm",
    "all_category_slugs": ["data-governance-mdm", "career-certifications", "data-analytics-bi"],
    "features": ["22-page PDF", "2026 Edition", "Microsoft Purview & Master Data Management Blueprints"],
    "included_resources": ["22-page PDF handbook"],
    "seo_title": "Data Governance, MDM & Microsoft Purview | 2026 Edition",
    "seo_desc": "22-page Data Governance and Microsoft Purview handbook by Datta Sable. In-depth MDM golden record architectures, Purview automated classification, and data contracts.",
    "pages": [
        # PAGE 2: Table of Contents & Enterprise Governance Blueprint
        {
            "badge": "Architecture Blueprint",
            "h1": "Table of Contents & Enterprise Governance Blueprint",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">EXECUTIVE OVERVIEW</span>
              Data governance is the operating system of the modern data estate. Without automated classification, trustworthy master data resolution, and end-to-end lineage, data platforms devolve into ungoverned data swamps.
            </div>

            <div class="diagram-box">
+----------------------------------------------------------------------------+
|                         DATA GOVERNANCE STEERING COMMITTEE                 |
|              Executive Policies, Regulatory SLAs, Data Contracts           |
+----------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
|                       MICROSOFT PURVIEW DATA MAP                           |
|      Automated Scanning, Metadata Harvesting & ML Classification           |
+----------------------------------------------------------------------------+
                     |                                     |
       +-------------+-------------+         +-------------+-------------+
       v                           v         v                           v
+---------------+           +---------------+       +---------------+
| DATA CATALOG  |           | END-TO-END    |       | MASTER DATA   |
| Business Term |           | LINEAGE GRAPH |       | MANAGEMENT    |
| Glossary      |           | Impact Analysis       | Golden Record |
+---------------+           +---------------+       +---------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
|                      CONSUMPTION & ACCESS WORKFLOWS                        |
|        Self-Service Data Access Approval & Dynamic Sensitivity Masking     |
+----------------------------------------------------------------------------+
            </div>

            <h2>Comprehensive Chapter Guide</h2>
            <div class="grid-2">
              <div class="grid-card">
                <h3>Part I: Governance Foundations</h3>
                <p>• Ch 3: Governance Operating Model<br>
                • Ch 4: Cataloging & Glossaries<br>
                • Ch 5: End-to-End Automated Lineage<br>
                • Ch 6: Microsoft Purview Architecture<br>
                • Ch 7: Scanning & Classification</p>
              </div>
              <div class="grid-card">
                <h3>Part II: Master Data Management</h3>
                <p>• Ch 8: Sensitivity Labels & DLP<br>
                • Ch 9: Self-Service Data Access<br>
                • Ch 10: MDM Golden Record Logic<br>
                • Ch 11: MDM Architectural Styles<br>
                • Ch 12: Entity Resolution & AI Matching</p>
              </div>
            </div>
            <p><strong>Part III: Enterprise Excellence:</strong> Ch 13 Data Quality Dimensions, Ch 14 Data Contracts, Ch 15 Regulatory Compliance Automation, Ch 16 Federated Data Mesh Governance, Ch 17 Stewardship Workflows, Ch 18 Governance ROI, Ch 19 Master Patient Index Case Study, Ch 20 Bureaucracy Traps, Ch 21 Purview API Automation, Ch 22 Governance Maturity Audit Checklist.</p>
            """
        },
        # PAGE 3: Governance Operating Model
        {
            "badge": "Chapter 01",
            "h1": "The Data Governance Operating Model",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ORGANIZATIONAL STRUCTURE</span>
              Governance fails when treated as a part-time chore. A successful operating model defines clear separation of responsibilities between business ownership and technical stewardship.
            </div>

            <table class="table-box">
              <tr>
                <th>Governance Role</th>
                <th>Organizational Placement</th>
                <th>Primary Accountability</th>
              </tr>
              <tr>
                <td><strong>Data Owner</strong></td>
                <td>Senior Business Executive (e.g. VP of Sales)</td>
                <td>Defines data access policies, signs off on metric definitions</td>
              </tr>
              <tr>
                <td><strong>Business Data Steward</strong></td>
                <td>Operational Subject Matter Expert (SME)</td>
                <td>Curates business glossary terms, resolves data quality anomalies</td>
              </tr>
              <tr>
                <td><strong>Technical Data Custodian</strong></td>
                <td>Lead Data Engineer / DBA</td>
                <td>Maintains database uptime, encryption, backup schedules, and pipeline SLAs</td>
              </tr>
              <tr>
                <td><strong>Steering Committee</strong></td>
                <td>Cross-Functional Executive Body</td>
                <td>Resolves inter-departmental metric disputes, approves capital investments</td>
              </tr>
            </table>
            """
        },
        # PAGE 4: Modern Data Cataloging
        {
            "badge": "Chapter 02",
            "h1": "Modern Data Cataloging: Metadata & Glossaries",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DISCOVERABILITY</span>
              A modern data catalog serves as the search engine for enterprise data assets. It bridges physical technical tables with human-understandable business definitions.
            </div>

            <h2>Business Glossary vs. Data Dictionary</h2>
            <ul>
              <li><strong>Business Glossary:</strong> High-level business terms and calculation formulas (e.g. <code>Annual Recurring Revenue</code>). Independent of any physical software implementation.</li>
              <li><strong>Data Dictionary:</strong> Technical column definitions, data types, constraints, and nullable flags (e.g. <code>fct_orders.gross_amount_usd (DECIMAL(18,2))</code>).</li>
            </ul>
            """
        },
        # PAGE 5: End-to-End Data Lineage
        {
            "badge": "Chapter 03",
            "h1": "End-to-End Data Lineage: Impact & Root Cause",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DEPENDENCY INTELLIGENCE</span>
              Data lineage visualizes the complete lifecycle of data from upstream ERP sources, through transformation pipelines, to downstream Power BI reports.
            </div>

            <div class="diagram-box">
[ Salesforce CRM ] ---> [ Azure Data Factory ] ---> [ Bronze ADLS Gen2 ]
                                                             |
                                                             v
[ Power BI Executive App ] <--- [ Gold Star Schema ] <--- [ Databricks Silver ]
            </div>

            <h2>Impact Analysis vs. Root Cause Analysis</h2>
            <ul>
              <li><strong>Impact Analysis (Forward Lineage):</strong> "If I alter column <code>tax_code</code> in the orders table, which 14 downstream dashboards and machine learning models will fail?"</li>
              <li><strong>Root Cause Analysis (Backward Lineage):</strong> "A revenue figure in the CFO's morning report looks corrupt. Which upstream pipeline step injected the bad record?"</li>
            </ul>
            """
        },
        # PAGE 6: Microsoft Purview Architecture
        {
            "badge": "Chapter 04",
            "h1": "Microsoft Purview Architecture: The Unified Map",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">MICROSOFT PLATFORM</span>
              Microsoft Purview provides a unified governance portal spanning on-premises, multi-cloud (AWS, GCP), and SaaS data estates (Fabric, Power BI, Snowflake).
            </div>

            <h2>Core Purview Architectural Components</h2>
            <ol>
              <li><strong>Purview Data Map:</strong> The underlying metadata graph engine storing asset hierarchies, schemas, and classifications.</li>
              <li><strong>Purview Data Catalog:</strong> Search portal empowering business analysts to locate and evaluate certified data assets.</li>
              <li><strong>Data Estate Insights:</strong> Executive scorecards measuring catalog coverage, sensitive data exposure, and governance maturity.</li>
            </ol>
            """
        },
        # PAGE 7: Scanning & Automated Classification
        {
            "badge": "Chapter 05",
            "h1": "Purview Scanning & Automated ML Classification",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">AUTOMATED CLASSIFICATION</span>
              Manually inspecting billions of database columns to find sensitive data is impossible. Purview automated scanners analyze column names and data patterns to tag assets with standard classifications.
            </div>

            <h2>Custom Regex Classification Rule Example</h2>
            <div class="code-box">
              <div class="code-header"><span>purview_classification_rule.json</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body">{
  "classification_name": "Enterprise_Employee_Badge_ID",
  "data_pattern": "^EMP-[0-9]{6}-[A-Z]{2}$",
  "column_pattern": "(?i).*(badge|employee_num|emp_id).*",
  "minimum_match_threshold": 60
}</div>
            </div>
            """
        },
        # PAGE 8: Sensitivity Labels & DLP
        {
            "badge": "Chapter 06",
            "h1": "Sensitivity Labels & Information Protection",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">UNIFIED LABELS</span>
              Microsoft Purview integrates natively with Microsoft Entra ID and Information Protection, propagating sensitivity labels (Public, General, Confidential, Highly Confidential) across files, databases, and Power BI.
            </div>

            <h2>Downstream Label Inheritance</h2>
            <p>When an analyst exports data from a Power BI report flagged as <code>Highly Confidential</code> into an Excel file, Purview immediately encrypts the Excel file, restricting opening permissions strictly to authorized finance personnel.</p>
            """
        },
        # PAGE 9: Self-Service Access Governance
        {
            "badge": "Chapter 07",
            "h1": "Self-Service Access Policies via Purview",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ACCESS WORKFLOWS</span>
              Instead of submitting manual IT helpdesk tickets that sit in queues for weeks, analysts request data access directly within the Purview catalog. Purview routes requests to the designated Data Owner for 1-click approval.
            </div>

            <h2>Automated Access Provisioning</h2>
            <p>Upon Data Owner approval, Purview publishes a dynamic access policy directly to the underlying engine (Azure Storage, Fabric Lakehouse, SQL Warehouse) granting read access without manual DBA intervention.</p>
            """
        },
        # PAGE 10: MDM: Golden Records & Match/Merge
        {
            "badge": "Chapter 08",
            "h1": "Master Data Management: Golden Records & Matching",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">MASTER ENTITY TRUTH</span>
              When a customer exists in CRM as "Robert Smith", in Billing as "Bob Smith", and in Support as "R. Smith", Master Data Management (MDM) resolves these records into a single, authoritative <strong>Golden Record</strong>.
            </div>

            <div class="diagram-box">
[ CRM: Robert Smith, 12 Main St ]      \
[ Billing: Bob Smith, Apt 4B, Main St ]  ---> [ MDM MATCH ENGINE ] ---> [ GOLDEN RECORD ]
[ Web: rsmith@corp.com ]               /      (Fuzzy + Survivorship)     (Robert Smith, ID: 1001)
            </div>

            <h2>Survivorship Rules Matrix</h2>
            <p>Survivorship rules dictate which source system wins when attributes conflict (e.g. CRM wins for Customer Name; ERP wins for Billing Address; Web Portal wins for Email).</p>
            """
        },
        # PAGE 11: MDM Architectural Styles
        {
            "badge": "Chapter 09",
            "h1": "MDM Architectural Styles: Registry vs. Centralized",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">TOPOLOGY SELECTION</span>
              MDM architectures range from lightweight analytical index registries to centralized operational master authoring platforms.
            </div>

            <table class="table-box">
              <tr>
                <th>MDM Architectural Style</th>
                <th>Authoring Location</th>
                <th>Implementation Complexity</th>
              </tr>
              <tr>
                <td><strong>Registry Style</strong></td>
                <td>Source systems author data; MDM maintains cross-reference index</td>
                <td>Low (Read-only analytical federation)</td>
              </tr>
              <tr>
                <td><strong>Consolidation Style</strong></td>
                <td>Sources replicate into central MDM; golden records generated for BI</td>
                <td>Medium (Standard for enterprise data warehouses)</td>
              </tr>
              <tr>
                <td><strong>Co-Existence Style</strong></td>
                <td>Golden records published back to source operational applications</td>
                <td>High (Requires two-way integration synchronization)</td>
              </tr>
              <tr>
                <td><strong>Centralized (Transaction)</strong></td>
                <td>Data authored exclusively inside MDM before propagating to apps</td>
                <td>Highest (Requires complete operational workflow redesign)</td>
              </tr>
            </table>
            """
        },
        # PAGE 12: Entity Resolution & AI Matching
        {
            "badge": "Chapter 10",
            "h1": "Entity Resolution: Deterministic & Fuzzy Matching",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">FUZZY LOGIC</span>
              Matching records across dirty source data requires combining deterministic rule matching with probabilistic string distance algorithms.
            </div>

            <h2>String Distance Algorithms</h2>
            <ul>
              <li><strong>Levenshtein Distance:</strong> Counts single-character edits (insertions, deletions, substitutions) required to transform one string into another.</li>
              <li><strong>Jaro-Winkler:</strong> Favors strings that match from the beginning (ideal for human personal names).</li>
              <li><strong>Soundex / Metaphone:</strong> Phonetic algorithms that index words by their English pronunciation (e.g. "Smith" and "Smythe" resolve to identical phonetic codes).</li>
            </ul>
            """
        },
        # PAGE 13: Data Quality Frameworks
        {
            "badge": "Chapter 11",
            "h1": "The Six Core Dimensions of Data Quality",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">QUALITY FRAMEWORK</span>
              Measuring data quality requires quantitative metrics. The DAMA International standard establishes six foundational quality dimensions evaluated across data pipelines.
            </div>

            <table class="table-box">
              <tr>
                <th>Quality Dimension</th>
                <th>Core Definition</th>
                <th>Automated Test Metric</th>
              </tr>
              <tr>
                <td><strong>Completeness</strong></td>
                <td>Proportion of data stored against total potential capacity</td>
                <td>Null rate &lt; 0.1% on mandatory fields</td>
              </tr>
              <tr>
                <td><strong>Uniqueness</strong></td>
                <td>Zero duplicate records representing the same real-world entity</td>
                <td>Distinct primary key counts</td>
              </tr>
              <tr>
                <td><strong>Timeliness</strong></td>
                <td>Data is available within agreed business SLA windows</td>
                <td>Pipeline latency &lt; 30 minutes from source creation</td>
              </tr>
              <tr>
                <td><strong>Accuracy</strong></td>
                <td>Data correctly reflects the real-world event or object</td>
                <td>Reconciliation matches against physical bank statements</td>
              </tr>
              <tr>
                <td><strong>Consistency</strong></td>
                <td>Data values across multiple systems do not conflict</td>
                <td>Cross-system ledger reconciliation checks</td>
              </tr>
              <tr>
                <td><strong>Validity</strong></td>
                <td>Data conforms to syntax, format, and range constraints</td>
                <td>Regex checks on Postal Codes, Emails, and IBANs</td>
              </tr>
            </table>
            """
        },
        # PAGE 14: Data Contracts
        {
            "badge": "Chapter 12",
            "h1": "Data Contracts: Enforcing Producer-Consumer SLAs",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">SOFTWARE ENGINEERING RIGOR</span>
              Application engineers frequently alter database columns without notifying downstream data teams, breaking analytics pipelines. Data Contracts establish formal, binding agreements.
            </div>

            <h2>Anatomy of a YAML Data Contract</h2>
            <div class="code-box">
              <div class="code-header"><span>orders_contract.yaml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">dataset</span>: checkout_completed_orders
<span class="code-keyword">owner</span>: checkout-service-team@enterprise.com
<span class="code-keyword">sla</span>:
  <span class="code-keyword">freshness</span>: 15m
  <span class="code-keyword">availability</span>: 99.9%
<span class="code-keyword">schema</span>:
  - <span class="code-keyword">column</span>: order_id
    <span class="code-keyword">type</span>: string
    <span class="code-keyword">constraints</span>: [not_null, unique]
  - <span class="code-keyword">column</span>: gross_amount_usd
    <span class="code-keyword">type</span>: decimal(12,2)
    <span class="code-keyword">constraints</span>: [greater_than_zero]</div>
            </div>
            """
        },
        # PAGE 15: Regulatory Compliance Automation
        {
            "badge": "Chapter 13",
            "h1": "Regulatory Compliance: GDPR & CCPA Automation",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">LEGAL COMPLIANCE</span>
              Fulfilling GDPR Article 17 "Right to be Forgotten" requests manually across 40 disparate data warehouses and lakes costs thousands of engineering hours. Automated governance pipelines orchestrate deletion workflows.
            </div>

            <h2>Automated Erasure Pipelines</h2>
            <p>When a privacy request is logged, an automated orchestrator queries the Purview Data Map to identify all tables containing the target <code>customer_id</code>. It dispatches idempotent <code>DELETE / MERGE</code> statements across Delta Lake and Snowflake tables, generating a cryptographically signed audit certificate.</p>
            """
        },
        # PAGE 16: Federated Data Mesh Governance
        {
            "badge": "Chapter 14",
            "h1": "Federated Governance in a Data Mesh Topology",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DECENTRALIZED SCALE</span>
              Centralized governance teams become operational bottlenecks in large multi-national organizations. Data Mesh distributes data ownership to domain teams while enforcing <strong>Federated Computational Governance</strong>.
            </div>

            <h2>Computational Governance Standards</h2>
            <p>Domain teams (Checkout, Logistics, Marketing) build and own their Data Products independently. However, all domain products must adhere to platform-wide computational standards: publishing standardized OpenLineage events, exposing standardized Purview metadata APIs, and adopting enterprise identity.</p>
            """
        },
        # PAGE 17: Stewardship Workflows & Approvals
        {
            "badge": "Chapter 15",
            "h1": "Data Stewardship Workflows & Approval Gates",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">HUMAN-IN-THE-LOOP</span>
              While AI algorithms identify candidate master matches, automated workflows route uncertain matches (confidence 70% – 85%) to human Business Data Stewards for manual review.
            </div>

            <h2>Stewardship Portal SLAs</h2>
            <p>Deploy structured stewardship queues with SLA metrics: candidate duplicate matches must be resolved within 48 hours to prevent inaccurate customer marketing communications.</p>
            """
        },
        # PAGE 18: Quantifying Governance ROI
        {
            "badge": "Chapter 16",
            "h1": "Quantifying Data Governance ROI & Business Impact",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">VALUE JUSTIFICATION</span>
              Executive sponsors often perceive data governance as an overhead tax. Quantifying ROI requires measuring time saved in data discovery, reduced data duplication, and avoided regulatory penalties.
            </div>

            <h2>Three Quantifiable Governance Value Streams</h2>
            <ul>
              <li><strong>Analyst Productivity:</strong> Analysts spend 80% of their time finding and cleaning data. A certified catalog cuts search time in half, returning 10 hours per week per analyst.</li>
              <li><strong>Duplicate Entity Prevention:</strong> Merging duplicate vendor master records eliminates accidental duplicate invoice payments ($400K+ annual enterprise savings).</li>
              <li><strong>Regulatory Risk Mitigation:</strong> Avoidance of GDPR statutory fines (up to 4% of global corporate turnover).</li>
            </ul>
            """
        },
        # PAGE 19: Case Study: Master Patient Index
        {
            "badge": "Chapter 17",
            "h1": "Case Study: Healthcare Master Patient Index Rollout",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">HEALTHCARE CASE STUDY</span>
              A regional healthcare provider network spanning 8 hospitals and 45 outpatient clinics suffered from duplicated medical records, creating patient safety risks and billing denials.
            </div>

            <h2>Implementation & Clinical Outcomes</h2>
            <ol>
              <li>Deployed Microsoft Purview to catalog 14 EHR database schemas and establish automated lineage.</li>
              <li>Implemented an MDM Master Patient Index (MPI) combining Jaro-Winkler phonetic matching with insurance policy validation.</li>
              <li>Merged 1.2 million duplicate patient records into verified Golden Patient Records.</li>
            </ol>
            <p><strong>Impact:</strong> Medical billing rejection rates dropped by 34%; cross-clinic patient record availability accelerated to real-time.</p>
            """
        },
        # PAGE 20: Governance Pitfalls & Anti-Patterns
        {
            "badge": "Chapter 18",
            "h1": "Data Governance Pitfalls & Failure Modes",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PITFALL PREVENTION</span>
              Avoid these common mistakes that lead to abandoned governance portals and organizational cynicism.
            </div>

            <table class="table-box">
              <tr>
                <th>Governance Pitfall</th>
                <th>Failure Consequence</th>
                <th>Remediation Standard</th>
              </tr>
              <tr>
                <td><strong>Tool-First Syndrome</strong></td>
                <td>Buying an expensive software license without defining owners or processes; portal becomes an empty ghost town</td>
                <td>Establish governance charter, owners, and manual processes before software rollout</td>
              </tr>
              <tr>
                <td><strong>Bureaucracy Gridlock</strong></td>
                <td>Requiring 5 layers of executive committee approval to alter a single column; development stalls</td>
                <td>Empower domain stewards with delegated autonomous authority</td>
              </tr>
              <tr>
                <td><strong>Boiling the Ocean</strong></td>
                <td>Attempting to catalog all 50,000 corporate tables simultaneously</td>
                <td>Prioritize the Top 20 critical business assets and core financial facts first</td>
              </tr>
            </table>
            """
        },
        # PAGE 21: Purview REST API & Automation
        {
            "badge": "Chapter 19",
            "h1": "Microsoft Purview REST API & Python Automation",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">AUTOMATION BLUEPRINT</span>
              Automating governance registration in CI/CD pipelines ensures that newly deployed tables are cataloged immediately without manual UI entry.
            </div>

            <div class="code-box">
              <div class="code-header"><span>register_purview_entity.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">import</span> requests

<span class="code-comment"># Authenticate via Azure Entra ID Service Principal</span>
headers = {<span class="code-str">"Authorization"</span>: f<span class="code-str">"Bearer {access_token}"</span>, <span class="code-str">"Content-Type"</span>: <span class="code-str">"application/json"</span>}
endpoint = <span class="code-str">"https://enterprise-purview.purview.azure.com/datamap/api/atlas/v2/entity"</span>

entity_payload = {
    <span class="code-str">"entity"</span>: {
        <span class="code-str">"typeName"</span>: <span class="code-str">"azure_datalake_gen2_resource_set"</span>,
        <span class="code-str">"attributes"</span>: {
            <span class="code-str">"name"</span>: <span class="code-str">"gold_fact_orders"</span>,
            <span class="code-str">"qualifiedName"</span>: <span class="code-str">"https://datalake.dfs.core.windows.net/gold/orders"</span>,
            <span class="code-str">"description"</span>: <span class="code-str">"Certified Gold Fact Table for Revenue Analytics"</span>
        }
    }
}
resp = requests.<span class="code-func">post</span>(endpoint, json=entity_payload, headers=headers)
print(f<span class="code-str">"Registered asset with status: {resp.status_code}"</span>)</div>
            </div>
            """
        },
        # PAGE 22: Enterprise Governance Audit Checklist
        {
            "badge": "Chapter 20",
            "h1": "Enterprise Data Governance Maturity Audit Checklist",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRE-FLIGHT ASSESSMENT</span>
              Verify every operational standard across this checklist before certifying your enterprise data governance program as mature and compliant.
            </div>

            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Operating Charter:</strong> Named Data Owners and Business Stewards assigned to every certified data domain; monthly steering committee cadence.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Catalog Coverage:</strong> 100% of Gold analytical marts and Bronze raw feeds registered in Microsoft Purview Data Map.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Automated Lineage:</strong> End-to-end lineage links operational sources through ETL pipelines to downstream Power BI reports.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Master Data Resolution:</strong> Core entities (Customer, Product, Vendor) managed through governed Golden Record match/merge rules.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Data Contracts:</strong> Upstream application producers adhere to formal YAML data contracts with breaking change notification policies.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Compliance Readiness:</strong> Automated erasure pipelines satisfy GDPR Right to be Forgotten requests within statutory timeframes.</div>
            </div>

            <div class="callout callout-tip" style="margin-top: 14px;">
              <span class="callout-title">AUTHOR CLOSING STATEMENT</span>
              Data governance is the foundation upon which artificial intelligence and analytics stand. By aligning organizational stewardship, automated metadata scanning, and trustworthy master data, your enterprise turns information into an enduring competitive advantage.<br><br>
              <strong>Datta Sable</strong> · Enterprise Analytics & Data Architect · <em>dattasable.com</em>
            </div>
            """
        }
    ]
}
