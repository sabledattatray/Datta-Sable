# scripts/ebook_generator/book8_security.py

BOOK_SECURITY = {
    "slug": "cloud-security-zero-trust-data-2026",
    "sku": "DS-EBOOK-SEC-ZT-2026",
    "title": "Cloud Security & Zero-Trust Architecture for Modern Data Platforms",
    "cover_title_formatted": "Cloud Security & <span>Zero-Trust Architecture</span>",
    "subtitle": "The definitive security manual for protecting enterprise data estates: private endpoints, envelope encryption, IAM least privilege, automated PII tokenization, and SIEM threat monitoring.",
    "category_name": "Cloud Security & Governance",
    "category_slug": "cloud-security-governance",
    "all_category_slugs": ["cloud-security-governance", "career-certifications"],
    "features": ["22-page PDF", "2026 Edition", "Production Zero-Trust Security & SOC2 Blueprints"],
    "included_resources": ["22-page PDF handbook"],
    "seo_title": "Cloud Security & Zero-Trust Architecture for Data Platforms | 2026 Edition",
    "seo_desc": "22-page Cloud Data Security and Zero-Trust architecture handbook by Datta Sable. In-depth private networking, KMS encryption, PII tokenization, and SOC2 compliance.",
    "pages": [
        # PAGE 2: Table of Contents & Zero-Trust Architecture Blueprint
        {
            "badge": "Architecture Blueprint",
            "h1": "Table of Contents & Zero-Trust Security Blueprint",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">EXECUTIVE OVERVIEW</span>
              Traditional perimeter-based security ("castle-and-moat") is obsolete in cloud data architectures. A Zero-Trust posture enforces continuous cryptographic verification, least-privilege IAM, micro-segmented private networking, and automated DLP across all analytical engines.
            </div>

            <div class="diagram-box">
+----------------------------------------------------------------------------+
|                    IDENTITY PROVIDER (Azure Entra ID / Okta)               |
|            MFA Enforced, Context-Aware Device Signals, JIT Access          |
+----------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
|                     ISOLATED PRIVATE NETWORKING (VNet)                     |
|           Zero Public IPs, Private Endpoints, Egress Firewall Inspection    |
+----------------------------------------------------------------------------+
                     |                                     |
       +-------------+-------------+         +-------------+-------------+
       v                           v         v                           v
+---------------+           +---------------+       +---------------+
| ANALYTICAL WH |           | SPARK CLUSTERS|       | DATA STORAGE  |
| Dynamic Mask  |           | User Isolation|       | Customer-Key  |
| Row Security  |           | Ephemeral VM  |       | Envelope Enc. |
+---------------+           +---------------+       +---------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
|                      CONTINUOUS SIEM & THREAT DETECTION                    |
|      Microsoft Sentinel / AWS GuardDuty / Splunk Audit Stream Integration  |
+----------------------------------------------------------------------------+
            </div>

            <h2>Comprehensive Chapter Guide</h2>
            <div class="grid-2">
              <div class="grid-card">
                <h3>Part I: Identity & Cryptography</h3>
                <p>• Ch 3: Zero-Trust Core Pillars<br>
                • Ch 4: IAM, ABAC & JIT Access<br>
                • Ch 5: Multi-Cloud Federation & SCIM<br>
                • Ch 6: KMS Envelope Encryption<br>
                • Ch 7: Private Link & Endpoints</p>
              </div>
              <div class="grid-card">
                <h3>Part II: Data Protection</h3>
                <p>• Ch 8: Micro-Segmentation<br>
                • Ch 9: Automated PII/PHI Tokenization<br>
                • Ch 10: Differential Privacy<br>
                • Ch 11: Dynamic Masking & Hashes<br>
                • Ch 12: CSPM & CIEM Governance</p>
              </div>
            </div>
            <p><strong>Part III: Operations & Compliance:</strong> Ch 13 Secrets Management, Ch 14 SIEM Audit Ingestion, Ch 15 Securing Data CI/CD, Ch 16 SOC2 / HIPAA Frameworks, Ch 17 Incident Response Runbook, Ch 18 Unity & Ranger Security, Ch 19 Exfiltration Simulation Case Study, Ch 20 Top 10 Vulnerabilities, Ch 21 Terraform Templates, Ch 22 CISO Audit Checklist.</p>
            """
        },
        # PAGE 3: Zero-Trust Fundamentals
        {
            "badge": "Chapter 01",
            "h1": "Zero-Trust Fundamentals: The Three Immutable Tenets",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">SECURITY PARADIGM</span>
              Zero-Trust replaces implicit network trust with continuous explicit verification. Being inside the corporate VPN grants zero default permissions to data assets.
            </div>

            <h2>The Three Foundational Tenets</h2>
            <ol>
              <li><strong>Verify Explicitly:</strong> Always authenticate and authorize based on all available data points—including user identity, device health, location, workload identity, and data sensitivity classification.</li>
              <li><strong>Use Least Privilege Access:</strong> Limit user access with Just-In-Time (JIT) and Just-Enough-Access (JEA), risk-based adaptive policies, and data protection mechanisms.</li>
              <li><strong>Assume Breach:</strong> Minimize blast radius by micro-segmenting network access and encrypting all communications end-to-end. Utilize analytics to gain visibility, drive threat detection, and continuously improve defenses.</li>
            </ol>
            """
        },
        # PAGE 4: IAM & Least Privilege
        {
            "badge": "Chapter 02",
            "h1": "Identity & Access Management: RBAC, ABAC & JIT",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">IDENTITY GOVERNANCE</span>
              Assigning broad, permanent administrative privileges to human engineers is the leading cause of enterprise compromise. Modern IAM leverages Attribute-Based Access Control (ABAC) and Just-In-Time (JIT) elevation.
            </div>

            <h2>RBAC vs. ABAC in Analytical Engines</h2>
            <table class="table-box">
              <tr>
                <th>Model</th>
                <th>Access Determination Logic</th>
                <th>Scalability Profile</th>
              </tr>
              <tr>
                <td><strong>Role-Based (RBAC)</strong></td>
                <td>User is assigned a static role (e.g. <code>MarketingAnalyst</code>)</td>
                <td>Prone to role explosion (hundreds of bespoke roles)</td>
              </tr>
              <tr>
                <td><strong>Attribute-Based (ABAC)</strong></td>
                <td>Policy evaluates User Attributes (Department, Clearance) vs. Data Tags (Confidential)</td>
                <td>Highly scalable; 1 policy governs thousands of tables dynamically</td>
              </tr>
            </table>

            <h2>Just-In-Time (JIT) Access Elevation via Azure PIM</h2>
            <p>Engineers possess zero production access by default. When an on-call incident occurs, the engineer requests a 2-hour elevated session requiring peer approval and multi-factor authentication. Access automatically expires after 120 minutes.</p>
            """
        },
        # PAGE 5: Multi-Cloud Identity Federation
        {
            "badge": "Chapter 03",
            "h1": "Multi-Cloud Identity Federation & SCIM Provisioning",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CENTRALIZED IDENTITY</span>
              Maintaining local usernames and passwords across Snowflake, Databricks, AWS, and Azure creates security blind spots. Centralizing identity in an Enterprise IdP (Entra ID, Okta) enables instantaneous revocation.
            </div>

            <h2>Automated Deprovisioning via SCIM</h2>
            <p>When an employee departs the organization, disabling their account in Okta/Entra ID immediately propagates via SCIM (System for Cross-domain Identity Management) to revoke active sessions and disable user records in Snowflake and Databricks within seconds.</p>
            """
        },
        # PAGE 6: Encryption at Rest & BYOK
        {
            "badge": "Chapter 04",
            "h1": "Data Encryption: KMS & Envelope Encryption",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CRYPTOGRAPHIC PROTECTION</span>
              Encrypting multi-terabyte data lakes requires Envelope Encryption: separating the keys that encrypt the data from the keys that encrypt the keys.
            </div>

            <div class="diagram-box">
[ Customer Master Key (CMK) ] ---> Encrypts ---> [ Data Encryption Key (DEK) ]
(Protected in Azure Key Vault / AWS KMS)                |
                                                        v
                                                 [ Encrypts Raw Parquet / Delta File ]
            </div>

            <h2>Bring Your Own Key (BYOK)</h2>
            <p>BYOK guarantees that even if a cloud provider or SaaS vendor is subpoenaed, they cannot decrypt underlying customer data without access to the customer's Hardware Security Module (HSM) master key.</p>
            """
        },
        # PAGE 7: Network Security: Private Endpoints
        {
            "badge": "Chapter 05",
            "h1": "Network Security: Private Endpoints & Egress Controls",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PERIMETER ISOLATION</span>
              Analytical clusters and data lakes must never route over the public internet. Azure Private Link and AWS PrivateLink route all data traffic over private cloud backbone infrastructure.
            </div>

            <h2>Storage Account Firewall Lockdown</h2>
            <p>Production ADLS Gen2 or S3 storage accounts must explicitly configure: <code>Public network access: Disabled</code>. All incoming traffic must originate from designated Private Endpoints within dedicated subnets.</p>
            """
        },
        # PAGE 8: Micro-Segmentation
        {
            "badge": "Chapter 06",
            "h1": "Micro-Segmentation: Isolating Analytical Workloads",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">BLAST RADIUS CONTAINMENT</span>
              Micro-segmentation prevents lateral movement. If an external attacker compromises an ad-hoc data science notebook, network controls prevent lateral access to production financial databases.
            </div>

            <h2>Network Security Groups (NSGs) Topology</h2>
            <ul>
              <li><strong>Ingestion Subnet:</strong> Inbound allowed only from trusted API gateways; outbound restricted to Raw Bronze storage.</li>
              <li><strong>Transformation Subnet:</strong> Internal cluster communication only; internet egress blocked by Azure Firewall.</li>
              <li><strong>Serving Subnet:</strong> Connects only to Power BI gateway endpoints over port 443.</li>
            </ul>
            """
        },
        # PAGE 9: Automated PII Detection & Tokenization
        {
            "badge": "Chapter 07",
            "h1": "Data Loss Prevention: Automated PII Tokenization",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRIVACY BY DESIGN</span>
              Storing plaintext Personally Identifiable Information (PII) or Protected Health Information (PHI) in raw lakes exposes enterprises to massive GDPR/HIPAA fines. Automated DLP tokenizes sensitive data at ingestion.
            </div>

            <h2>Format-Preserving Encryption (FPE)</h2>
            <p>Tokenization replaces sensitive numbers (Credit Card: <code>4111-2222-3333-4444</code>) with synthetic tokens that preserve format and length (<code>4999-8888-7777-4444</code>). Analysts execute demographic queries and test models without viewing real card numbers.</p>
            """
        },
        # PAGE 10: Differential Privacy
        {
            "badge": "Chapter 08",
            "h1": "Differential Privacy in Collaborative Analytics",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ADVANCED PRIVACY</span>
              Even anonymized datasets can be re-identified by cross-referencing auxiliary public voter registries. Differential Privacy injects calibrated mathematical noise (Laplace / Gaussian) to guarantee individual plausible deniability.
            </div>

            <h2>The Epsilon Privacy Budget (&epsilon;)</h2>
            <p>Epsilon (&epsilon;) bounds the maximum privacy leakage permitted per query. Every analyst query consumes a portion of the privacy budget; once the budget is exhausted, the system blocks further queries to prevent reconstruction attacks.</p>
            """
        },
        # PAGE 11: Dynamic Masking & Hashes
        {
            "badge": "Chapter 09",
            "h1": "Data Masking Strategies: Dynamic vs. Static",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">MASKING ARCHITECTURE</span>
              Data masking transforms sensitive values into unreadable representations. Choosing between static and dynamic masking depends on the environment lifecycle.
            </div>

            <table class="table-box">
              <tr>
                <th>Masking Type</th>
                <th>Execution Time</th>
                <th>Production Suitability</th>
              </tr>
              <tr>
                <td><strong>Static Masking</strong></td>
                <td>Permanent transformation during data copy into Dev/Staging</td>
                <td>Mandatory for non-production environments</td>
              </tr>
              <tr>
                <td><strong>Dynamic Masking</strong></td>
                <td>On-the-fly masking during query execution based on role</td>
                <td>Optimal for production multi-tenant environments</td>
              </tr>
            </table>
            """
        },
        # PAGE 12: Continuous Security Posture: CSPM
        {
            "badge": "Chapter 10",
            "h1": "Continuous Posture: CSPM & CIEM Governance",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">AUTOMATED AUDIT</span>
              Cloud configurations drift over time. A junior developer opening an S3 bucket or enabling public IP access creates immediate zero-day vulnerabilities. Cloud Security Posture Management (CSPM) continuously scans for drift.
            </div>

            <h2>Automated Drift Remediation</h2>
            <p>CSPM tools (Microsoft Defender for Cloud, Wiz, Prisma Cloud) monitor cloud control plane events. If a storage account firewall is disabled, automated EventBridge/Logic Apps re-enable the firewall within 60 seconds.</p>
            """
        },
        # PAGE 13: Secrets Management
        {
            "badge": "Chapter 11",
            "h1": "Secrets Management: Zero Hardcoded Credentials",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">CREDENTIAL HYGIENE</span>
              Hardcoded API keys, database passwords, and connection strings committed to Git repositories account for 60% of enterprise credential leaks.
            </div>

            <h2>Enterprise Secrets Architecture</h2>
            <ul>
              <li><strong>HashiCorp Vault / Azure Key Vault:</strong> Centralized cryptographic store. Applications authenticate via Workload Identity (Managed Identities) without storing passwords.</li>
              <li><strong>Automated Secret Rotation:</strong> Database service credentials automatically rotate every 30 days without application downtime.</li>
            </ul>
            """
        },
        # PAGE 14: SIEM Integration & Threat Detection
        {
            "badge": "Chapter 12",
            "h1": "Audit Logging & SIEM Threat Detection",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">THREAT INTELLIGENCE</span>
              When a malicious insider or compromised credential executes an unauthorized data exfiltration, real-time audit streaming is the only mechanism that catches the breach in progress.
            </div>

            <h2>High-Risk Behavioral Alerts</h2>
            <p>Stream audit logs (Snowflake Query History, Databricks Audit Logs, Azure Storage Logs) directly into Microsoft Sentinel. Configure automated detections for: <code>SELECT *</code> on 50 tables within 10 minutes, or bulk exports originating from anomalous IP geographical locations.</p>
            """
        },
        # PAGE 15: Securing CI/CD for Data
        {
            "badge": "Chapter 13",
            "h1": "Securing CI/CD Pipelines for Data Platforms",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">SUPPLY CHAIN SECURITY</span>
              Data pipelines rely on open-source packages (Python Wheels, Docker containers, dbt plugins). Securing CI/CD prevents malicious dependency injection into production analytical pipelines.
            </div>

            <h2>CI/CD Security Verification Steps</h2>
            <ol>
              <li><strong>Static Analysis (SAST):</strong> Scan SQL and Python code for hardcoded secrets and SQL injection vulnerabilities.</li>
              <li><strong>Container Scanning:</strong> Scan Docker images (Trivy, Snyk) for known CVEs before deployment to production Kubernetes clusters.</li>
              <li><strong>Cryptographic Commit Signing:</strong> Enforce GPG-signed Git commits to guarantee code provenance.</li>
            </ol>
            """
        },
        # PAGE 16: Regulatory Compliance: SOC 2 & HIPAA
        {
            "badge": "Chapter 14",
            "h1": "Regulatory Compliance: SOC 2 Type II, HIPAA & GDPR",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">STATUTORY COMPLIANCE</span>
              Enterprise customers require independent verification of data security controls. Aligning data architectures to formal regulatory frameworks is a prerequisite for enterprise sales.
            </div>

            <table class="table-box">
              <tr>
                <th>Compliance Standard</th>
                <th>Primary Architectural Mandate</th>
                <th>Data Platform Requirement</th>
              </tr>
              <tr>
                <td><strong>SOC 2 Type II</strong></td>
                <td>Audit trails, change management, operational security over 6-month window</td>
                <td>Immutable audit logging, PR approval gates on all schema changes</td>
              </tr>
              <tr>
                <td><strong>HIPAA</strong></td>
                <td>Protection of electronic Protected Health Information (ePHI)</td>
                <td>Mandatory BAA with cloud vendors, encryption at rest, field-level access control</td>
              </tr>
              <tr>
                <td><strong>GDPR Article 17</strong></td>
                <td>Right to be Forgotten (Erase personal data upon request)</td>
                <td>Automated tombstoning and deletion pipelines in Delta/Snowflake tables</td>
              </tr>
            </table>
            """
        },
        # PAGE 17: Incident Response Runbook
        {
            "badge": "Chapter 15",
            "h1": "Incident Response Runbook for Data Breaches",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">INCIDENT MANAGEMENT</span>
              When an alert fires indicating potential data exfiltration, the incident response team must execute structured containment within minutes to limit liability.
            </div>

            <h2>Four-Phase Incident Response Procedure</h2>
            <ol>
              <li><strong>Triage & Verification (0 – 15m):</strong> Confirm alert fidelity; identify compromised user principal or compromised access token.</li>
              <li><strong>Containment (15 – 30m):</strong> Revoke compromised user sessions via IdP; apply immediate IP deny rules on firewall; freeze affected service principals.</li>
              <li><strong>Forensic Analysis (30m – 2h):</strong> Reconstruct exact query history from immutable SIEM logs to determine precisely which tables and rows were accessed.</li>
              <li><strong>Remediation & Legal Notice:</strong> Patch vulnerability; notify legal counsel and affected stakeholders within statutory windows (e.g. GDPR 72-hour notification).</li>
            </ol>
            """
        },
        # PAGE 18: Zero-Trust Lakehouse: Unity & Ranger
        {
            "badge": "Chapter 16",
            "h1": "Zero-Trust Lakehouse: Unity Catalog & Apache Ranger",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">LAKEHOUSE GOVERNANCE</span>
              Managing access across distributed files in ADLS/S3 is error-prone. Modern lakehouses utilize centralized governance engines (Unity Catalog, Apache Ranger) to enforce SQL-style permissions directly above raw storage.
            </div>

            <h2>Centralized Security Policy Enforcement</h2>
            <p>Unity Catalog abstracts physical storage paths. Users and clusters never receive direct IAM read permissions on underlying ADLS Gen2 storage containers. Instead, compute engines authenticate through Unity Catalog, which evaluates grants, applies row filters, and delivers data in-memory.</p>
            """
        },
        # PAGE 19: Exfiltration Simulation Case Study
        {
            "badge": "Chapter 17",
            "h1": "Case Study: Red Team Exfiltration Simulation",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">RED TEAM POST-MORTEM</span>
              A financial enterprise commissioned an external Red Team penetration test to simulate an insider attack attempting to exfiltrate 5 million customer financial records.
            </div>

            <h2>Attack Vector & Detection Timeline</h2>
            <ul>
              <li><strong>Minute 0:</strong> Red Team compromised developer credentials lacking MFA on a legacy staging endpoint.</li>
              <li><strong>Minute 4:</strong> Attempted to download database dump via public internet; blocked immediately by storage firewall private endpoint rules.</li>
              <li><strong>Minute 8:</strong> Attempted to export data to external AWS S3 bucket; halted by Azure Firewall egress restriction policies.</li>
              <li><strong>Minute 11:</strong> Sentinel SIEM flagged anomalous cross-regional query volume; automated logic app revoked session and notified CISO.</li>
            </ul>
            <p><strong>Result:</strong> Zero data exfiltrated. Defense-in-depth validated.</p>
            """
        },
        # PAGE 20: Top 10 Security Vulnerabilities
        {
            "badge": "Chapter 18",
            "h1": "Top 10 Data Platform Security Vulnerabilities",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">VULNERABILITY MATRIX</span>
              Common architecture mistakes that expose data platforms to compromise.
            </div>

            <table class="table-box">
              <tr>
                <th>Vulnerability</th>
                <th>Severity</th>
                <th>Mandatory Countermeasure</th>
              </tr>
              <tr>
                <td>Storage Accounts with Public Access Enabled</td>
                <td>Critical</td>
                <td>Enforce Azure Policy / AWS SCP blocking all public storage creation</td>
              </tr>
              <tr>
                <td>Shared Service Account Passwords in Team Chats</td>
                <td>High</td>
                <td>Mandate Managed Identities and OIDC federated authentication</td>
              </tr>
              <tr>
                <td>Unmasked Production Data Cloned to Dev Sandboxes</td>
                <td>High</td>
                <td>Apply automated static masking before populating non-prod</td>
              </tr>
              <tr>
                <td>Missing MFA on Cloud Console Access</td>
                <td>Critical</td>
                <td>Enforce Conditional Access requiring hardware FIDO2 keys</td>
              </tr>
              <tr>
                <td>Over-Permissive Wildcard IAM (<code>s3:*</code>)</td>
                <td>High</td>
                <td>Restrict policies to exact ARN paths and specific actions</td>
              </tr>
            </table>
            """
        },
        # PAGE 21: Terraform Security Templates
        {
            "badge": "Chapter 19",
            "h1": "Terraform Infrastructure as Code Security Scaffolding",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">DECLARATIVE HARDENING</span>
              Deploying cloud security manually via web consoles guarantees configuration drift. Production infrastructure must be defined declaratively in version-controlled Terraform.
            </div>

            <div class="code-box">
              <div class="code-header"><span>security_storage.tf</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">resource</span> <span class="code-str">"azurerm_storage_account"</span> <span class="code-str">"secure_datalake"</span> {
  <span class="code-keyword">name</span>                     = <span class="code-str">"enterpriseprodlake01"</span>
  <span class="code-keyword">resource_group_name</span>      = azurerm_resource_group.rg.name
  <span class="code-keyword">location</span>                 = azurerm_resource_group.rg.location
  <span class="code-keyword">account_tier</span>             = <span class="code-str">"Standard"</span>
  <span class="code-keyword">account_replication_type</span> = <span class="code-str">"ZRS"</span>
  <span class="code-keyword">is_hns_enabled</span>           = <span class="code-keyword">true</span> <span class="code-comment"># ADLS Gen2 Hierarchical Namespace</span>

  <span class="code-comment"># Enforce strict network isolation</span>
  <span class="code-keyword">public_network_access_enabled</span> = <span class="code-keyword">false</span>
  <span class="code-keyword">min_tls_version</span>               = <span class="code-str">"TLS1_2"</span>
  <span class="code-keyword">allow_nested_items_to_be_public</span> = <span class="code-keyword">false</span>

  <span class="code-keyword">network_rules</span> {
    <span class="code-keyword">default_action</span> = <span class="code-str">"Deny"</span>
    <span class="code-keyword">bypass</span>         = [<span class="code-str">"AzureServices"</span>]
  }
}</div>
            </div>
            """
        },
        # PAGE 22: CISO Compliance Audit Checklist
        {
            "badge": "Chapter 20",
            "h1": "Chief Information Security Officer (CISO) Data Audit",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRE-FLIGHT ASSESSMENT</span>
              Before certifying any cloud data platform as production-ready, verify every operational control in this enterprise security audit checklist.
            </div>

            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Network Isolation:</strong> All data lakes and warehouses reside behind Private Endpoints; zero public IPs enabled on worker clusters.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>IAM Least Privilege:</strong> Access granted via Azure Entra ID / Okta groups; MFA enforced; JIT access active for emergency operations.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Cryptographic Security:</strong> Customer-Managed Keys (CMK) protect all data at rest; TLS 1.2+ enforced for all data in transit.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Data Masking & DLP:</strong> PII and PHI columns protected with dynamic masking or tokenization; dev sandboxes populated only with sanitized data.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>SIEM & Audit Logging:</strong> 100% of analytical queries and administrative events stream continuously to centralized SIEM; exfiltration alerts configured.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Supply Chain Security:</strong> Docker containers scanned for CVEs in CI/CD; automated SAST scans block code with hardcoded credentials.</div>
            </div>

            <div class="callout callout-tip" style="margin-top: 14px;">
              <span class="callout-title">AUTHOR CLOSING STATEMENT</span>
              Data security is not a project with a finish line; it is an operational standard. By enforcing Zero-Trust at the identity, network, and storage layers, your enterprise protects its most valuable digital assets against modern cyber threats with absolute confidence.<br><br>
              <strong>Datta Sable</strong> · Enterprise Analytics & Data Architect · <em>dattasable.com</em>
            </div>
            """
        }
    ]
}
