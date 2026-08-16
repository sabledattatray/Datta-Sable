
---

## Section 11 — Microsoft Fabric Security Architecture

To govern effectively, you must treat security as defense in depth. If one layer fails or is misconfigured, the underlying layers should still protect the data. A robust Microsoft Fabric security architecture consists of eight distinct layers.

### Layer 1: Identity (Microsoft Entra ID)
The foundation. This layer verifies *who* is attempting to access the platform. Controls include Multi-Factor Authentication (MFA), Conditional Access policies (e.g., blocking logins from risky IP addresses), and Identity Protection.

### Layer 2: Tenant (Fabric Admin Portal)
The global perimeter. This layer controls *what capabilities* are allowed. For example, disabling the ability for users to share reports with external guest accounts or restricting who can export data to Excel.

### Layer 3: Capacity
The compute boundary. Securing capacity involves ensuring that only authorized Domain Admins can attach workspaces to premium capacities, preventing unauthorized workloads from consuming expensive compute resources.

### Layer 4: Workspace
The collaboration boundary. This layer determines *who can build and view* assets. By strictly managing Workspace Admins, Members, Contributors, and Viewers via Entra Groups, you protect the items inside.

### Layer 5: Data (Workloads & Semantic Models)
The data boundary. This includes OneLake data access roles, SQL endpoint permissions (GRANT SELECT), and Row-Level Security (RLS) inside semantic models. This layer ensures that even if a user has access to a workspace, they only see the specific rows of data they are authorized to view.

### Layer 6: Network
The network boundary. By default, Fabric is a multi-tenant SaaS service accessible over the public internet. For high-security environments, you can implement Private Endpoints and Private Links to ensure that traffic between your on-premises network (or Azure VNet) and Fabric never traverses the public internet.

### Layer 7: Monitoring
The audit layer. Continuous monitoring of the Fabric Audit Log, Microsoft 365 Defender, and Log Analytics ensures that security teams can detect anomalous behavior.

### Layer 8: Governance (Microsoft Purview)
The oversight layer. Applying sensitivity labels and Data Loss Prevention (DLP) policies to ensure that even if a user legitimately accesses data, they cannot improperly exfiltrate it.

---

## Section 12 — Zero Trust and Microsoft Fabric

Zero Trust is a security framework based on three principles: Verify explicitly, Use least privilege access, and Assume breach. 

A common enterprise misconception is that adopting a Microsoft SaaS product automatically makes your architecture "Zero Trust." **Fabric is not automatically Zero Trust.** It provides the tools to *build* a Zero Trust architecture, but the organization must configure the controls.

* **Verify Explicitly:** Entra ID Conditional Access must be configured to verify the user's identity, device health, and location before granting access to Fabric.
* **Least Privilege:** Workspace roles and Row-Level Security must be actively designed to limit access, as discussed in Section 8.
* **Assume Breach:** If an attacker compromises a BI Developer's account, how far can they go? Network isolation (Private Endpoints), strict workspace boundaries, and active monitoring limit the blast radius of a breach.

For a deeper dive into securing the network layer of Fabric, review our architectural guidance on configuring Private Endpoints.

---

## Section 13 — Development, Test and Production Governance

Governance breaks down when organizations treat Microsoft Fabric like a personal Excel file, editing production data directly. A governed enterprise environment strictly separates environments:

`Development → Test → Production`

### Implementing the Governance Flow

1. **Development:** This is the sandbox. Data Engineers and Analytics Engineers connect their Dev workspace to a Git repository (Azure DevOps or GitHub). Changes to Notebooks, Lakehouses, and Semantic Models are committed to source control.
2. **Test/UAT:** Code is promoted from Dev to Test using Fabric Deployment Pipelines. Here, changes are validated against a copy of production data (or a masked subset). Business users perform User Acceptance Testing (UAT).
3. **Production:** Once approved, the Fabric Deployment Pipeline promotes the changes to the Production workspace. 

### The Governance Gates

The key governance control here is **approval routing**. Developers should not have the ability to click "Deploy to Production." Instead, promoting code from Test to Production should require a pull request review by a senior architect, and the actual deployment should ideally be handled by a Service Principal running an automated CI/CD pipeline. 

This process ensures that no unreviewed, unapproved code runs against production data, and if a pipeline fails, there is a documented rollback plan via Git history.

---

## Section 14 — Fabric Governance Monitoring and Auditing

A governance policy is useless if you cannot verify that people are following it. Continuous monitoring is the engine of operational governance.

Fabric generates extensive audit logs that are recorded in the Microsoft 365 Unified Audit Log. These logs capture almost every activity: who created a workspace, who viewed a report, who exported data, and who changed a tenant setting.

### Key Governance KPIs to Monitor

The Data Governance team should actively monitor specific Key Performance Indicators (KPIs) to identify risks before they become incidents:

* **Orphaned Workspaces:** Workspaces where all Admins have left the company.
* **Inactive Users:** Users with Fabric licenses who haven't logged in for 90 days (reclaim the license).
* **Excessive Permissions:** Users who have been granted direct Admin access instead of group-based access.
* **Stale Reports and Unused Semantic Models:** Assets that consume capacity memory but have zero views in the last 60 days. (Archive them).
* **Failed Refreshes:** Pipelines or models that consistently fail, indicating technical debt or broken data contracts.
* **Unclassified Data:** Sensitive workspaces or models lacking a Purview sensitivity label.

Monitoring these KPIs requires extracting the Fabric Admin APIs and Audit Logs into a central monitoring Lakehouse to build a "Governance Dashboard."

---

## Section 15 — Fabric Governance Operating Model

To operationalize governance, you must define who does what. This is where a highly practical RACI (Responsible, Accountable, Consulted, Informed) model is essential. 

### Enterprise Governance RACI

| Task / Responsibility | Fabric Platform Team | Data Governance Team | Security Team | Domain Admins | Data Engineers / BI Devs |
| --- | --- | --- | --- | --- | --- |
| **Manage Tenant Settings** | R, A | C | C | I | I |
| **Define Classification Taxonomy** | I | R, A | C | I | I |
| **Create Workspaces** | R | I | I | R | I |
| **Assign Workspace Access (via Groups)** | I | I | I | R, A | I |
| **Develop Data Pipelines & Reports** | I | I | I | A | R |
| **Approve Prod Deployments** | C | I | I | R, A | I |
| **Monitor Audit Logs for Anomalies** | R | I | R, A | I | I |
| **Archive Inactive Workspaces** | R, A | C | I | C | I |

*Note: R = Responsible (does the work), A = Accountable (owns the result), C = Consulted (provides input), I = Informed (kept in the loop).*

This operating model ensures that the Platform Team handles the infrastructure, the Governance Team handles the policies, and the Domains handle the actual data products.

---

## Section 16 — Enterprise Fabric Governance Policy

Instead of writing a 100-page governance manual that no one reads, enterprises should establish a concise, practical policy framework. 

A practical Fabric Governance Policy should dictate:

1. **Workspace Policy:** All workspaces must be assigned to a Domain and have a minimum of two active Admins.
2. **Naming Policy:** All assets and workspaces must follow the standard naming convention (e.g., `Domain-Environment-Workload`).
3. **Access Policy:** Individual user permissions are strictly prohibited. All access must be managed via Entra ID Security Groups.
4. **Data Classification Policy:** All semantic models and lakehouses containing PII must be labeled in Purview as "Highly Confidential."
5. **Production Deployment Policy:** Direct edits to Production workspaces are prohibited. All changes must flow through Git and Fabric Deployment Pipelines.
6. **Retention Policy:** Data in raw zones is retained for 30 days. Aggregated gold data is retained for 7 years.
7. **Access Review Policy:** Domain Admins must review workspace access groups quarterly.
8. **Incident Response Policy:** Any unauthorized export of Highly Confidential data triggers an immediate alert to the Security Operations Center (SOC).

Make these recommendations practical. A policy that developers can easily follow is infinitely more secure than a perfect policy that developers actively bypass.
