
---

## Section 5 — Fabric Workspace Governance

Workspaces are the fundamental organizational units within Microsoft Fabric. An enterprise workspace strategy dictates how these boundaries are drawn. If every data engineer and BI developer can spin up workspaces at will, you end up with hundreds of untracked assets, orphaned data, and a chaotic permissions model.

### Workspace Ownership and Creation Policies

A common enterprise mistake is allowing all users to create workspaces. Instead, workspace creation should be restricted to a centralized Fabric Platform Team or designated Domain Administrators via the Fabric Admin portal. 

When a workspace is provisioned, it must have clear ownership. Every workspace must have at least two Workspace Admins (preferably a Security Group) to ensure continuity if a team member leaves. Workspaces without active owners—often referred to as "orphaned workspaces"—become significant security risks and capacity drains over time.

### Organizing Workspaces

Workspaces should be organized around business domains and workloads, strictly separating environments. 

**Development vs. Production:**
Never mix development assets and production assets in the same workspace. Fabric workspaces should be mapped to specific environments in your deployment pipeline.
* **Dev Workspace:** Where engineers build pipelines and models. Permissions are relaxed.
* **Test Workspace:** Where business users validate data. Permissions are restricted to testers.
* **Prod Workspace:** Where the final data products live. Strictly governed, with no direct developer access.

**A Practical Naming Convention:**
A standard naming policy makes auditing and capacity management dramatically easier. Consider a format like:
`<Domain>-<Environment>-<Workload>`

*Example:* `Finance-PRD-Analytics`

Organizations should adapt this naming convention to their own operating model rather than blindly copying the example. If your organization is heavily divided by region, a convention like `<Region>-<Domain>-<Environment>` (e.g., `EMEA-Finance-PRD`) may be more appropriate.

### Workspace Sprawl and Lifecycle Management

Workspace sprawl happens when short-term projects leave behind permanent, unused workspaces. Implement a workspace lifecycle policy that requires regular access reviews. The Fabric Platform Team should actively monitor for inactive workspaces (e.g., no queries or pipeline runs in 90 days) and archive or delete them to free up OneLake storage and reduce audit scope.

---

## Section 6 — Domains and Organizational Governance

While workspaces organize individual projects, **Domains** organize workspaces at the enterprise level. Domains allow you to group multiple workspaces under a single business unit or functional area. 

Examples of practical domains include:
* Finance
* Sales
* Operations
* HR
* Risk
* Customer Analytics

Domains are the linchpin of **federated governance**. By assigning a Domain Administrator to the "Finance" domain, the central IT team delegates the day-to-day management of Finance workspaces to the Finance data team, while still enforcing global tenant settings.

### Governance Operating Models

When designing your domain architecture, you must choose a governance model. 

#### Centralized Governance
In a fully centralized model, a single central IT or Data Platform team builds, deploys, and manages all workspaces and data assets across the enterprise.
* **Advantages:** High consistency, strong control, and easier policy management.
* **Disadvantages:** Slower delivery times, business bottlenecks, and a disconnect from the actual business domain context.

#### Federated Governance (Data Mesh Approach)
In a federated model, individual business units (domains) own their end-to-end data products. The Finance team manages its own ingestion, Lakehouses, and reports.
* **Advantages:** Domain ownership, faster delivery, and tight business alignment.
* **Disadvantages:** Requires strict standards and strong platform governance to prevent data silos and inconsistent architectures.

#### The Pragmatic Hybrid Model
For most enterprise Microsoft Fabric deployments, a hybrid model is recommended. The central Fabric Platform Team provisions capacities, manages the tenant settings, establishes security standards, and creates domains. The Domain teams operate within those domains, building data products and managing workspace access according to the central standards. This approach balances agility with security.

---

## Section 7 — Microsoft Fabric RBAC and Access Control

Access control in Microsoft Fabric is a layered security model. Unlike traditional SQL Server deployments where a DBA managed permissions locally, Fabric access is entirely tied to **Microsoft Entra ID**.

### The Permission Hierarchy

1. **Fabric Roles (Tenant Level):** Fabric Administrator (manages tenant settings) and Capacity Administrator (manages compute resources).
2. **Workspace Roles:** The primary RBAC mechanism for data developers. 
   * **Admin:** Can manage the workspace, users, and all items.
   * **Member:** Can add/remove items and share items.
   * **Contributor:** Can create and edit items (the standard role for developers).
   * **Viewer:** Can view items but cannot modify them.
3. **Item Permissions:** Sharing specific reports or semantic models with end-users without giving them access to the entire workspace.
4. **Data-Level Security:** Row-Level Security (RLS) and Object-Level Security (OLS) applied within the SQL Analytics endpoint or the Semantic Model.

### The Golden Rule of Fabric Permissions

**Never assign permissions to individual users.** 

If you assign John, Sarah, and Mike direct Viewer access to a workspace, and Sarah moves to a new department, someone must manually remove her access. At enterprise scale, this leads to privilege creep.

Instead, map Fabric Workspace roles to Microsoft Entra ID Security Groups.
* Create a group: `SG_Fabric_Finance_PRD_Viewers`
* Assign this group the Viewer role in the `Finance-PRD-Analytics` workspace.
* Manage group membership via Entra ID lifecycle management or IT service requests.

When applicable, use Service Principals or Managed Identities to execute automated pipelines or REST API calls, ensuring that automated processes do not rely on individual user credentials that might expire or be revoked.

---

## Section 8 — One Person, One Role? No: Designing Least-Privilege Access

A critical governance concept is the principle of least privilege: users and service principals should have the absolute minimum access necessary to perform their jobs.

In a Fabric environment, least privilege requires separation of duties. 

* **Administrator Access:** Fabric Admins should not automatically have access to all data in all workspaces. They manage the platform configuration, not the business data.
* **Developer Access:** Data Engineers and BI Developers should have Contributor access to Development workspaces. They should *not* have Contributor access to Production workspaces.
* **Analyst Access:** Business analysts who need to query Lakehouses or Warehouses using SQL should be granted Read access to specific items, or Viewer access to the workspace, combined with SQL permissions.
* **Business User Access:** End consumers who only look at Power BI reports should be granted access via Fabric Apps, entirely insulating them from the workspace environment.

### Managing Production Restrictions

A common mistake is allowing developers to manually deploy changes to production workspaces. This violates least privilege and breaks auditability. Production deployments should be executed by deployment pipelines or CI/CD processes (via Service Principals), removing the need for developers to have write access to production data. 

For emergency fixes ("break-glass" scenarios), implement temporary, time-bound elevated access (e.g., using Entra Privileged Identity Management) rather than leaving permanent admin rights active.

---

## Section 9 — Data Lineage and Impact Analysis

When data is centralized, understanding how it flows becomes critical for compliance, incident response, and change management. Data lineage provides a map of your data's journey.

*Example Lineage Flow:*
Source (On-Premises SQL) → Data Pipeline → Lakehouse (Bronze) → Spark Notebook → Lakehouse (Silver) → Warehouse (Gold) → Semantic Model → Power BI Report → Executive Dashboard.

### Why Lineage Matters

If a Data Engineer needs to drop a column in the Silver Lakehouse, how do they know which downstream executive dashboards will break? Fabric’s built-in lineage view allows teams to perform impact analysis before making changes. 

From a governance perspective, lineage is essential for:
* **Incident Response:** When a report shows incorrect numbers, lineage helps trace the error back to the specific pipeline or source system.
* **Audits:** Demonstrating to auditors exactly how sensitive financial data moves through the architecture.
* **Documentation:** Automatically mapping dependencies without relying on static architecture diagrams.

While Fabric provides excellent workload-level lineage (showing how a Lakehouse connects to a Semantic Model), **Microsoft Purview** expands this capability. Purview can trace lineage all the way back to the operational source systems (like SAP or Salesforce) outside of Fabric, providing true enterprise-to-end data lineage.

---

## Section 10 — Data Classification and Sensitivity

Not all data is equal. A table containing public website traffic requires different governance than a table containing employee social security numbers. 

### Establishing a Classification Model

Before implementing technical controls, the Data Governance team must establish a classification taxonomy. A standard enterprise model includes:
* **Public:** Data approved for external release.
* **Internal:** Standard business data; unauthorized disclosure causes minimal risk.
* **Confidential:** Sensitive business data (e.g., financial forecasts); unauthorized disclosure causes moderate risk.
* **Highly Confidential:** Strictly regulated data (e.g., PII, PHI, PCI); unauthorized disclosure causes severe financial or legal damage.

### Applying Classification in Fabric

This is where Microsoft Purview’s integration shines. In Fabric, you can apply Sensitivity Labels (managed by Purview Information Protection) to workspaces, lakehouses, semantic models, and reports. 

When a BI Developer exports data from a "Highly Confidential" Power BI report to Excel, that sensitivity label travels with the Excel file. If your Purview policies restrict highly confidential files from being emailed outside the organization, the user will be blocked from sending that Excel file. This ensures that Fabric governance extends beyond the boundaries of the SaaS platform and protects the data wherever it goes.
