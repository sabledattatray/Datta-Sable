
---

## Section 17 — Common Microsoft Fabric Governance Mistakes

Even with a solid architecture, organizations frequently stumble during execution. Here are the most common Fabric governance mistakes and how to avoid them.

**1. Giving everyone Workspace Admin access**
* **Problem:** Developers demand Admin access because "things are breaking."
* **Why it happens:** Misunderstanding of Fabric roles; the Contributor role is usually sufficient for development.
* **Consequence:** Privilege creep and accidental deletion of assets.
* **Better approach:** Enforce the Contributor role via groups for developers.

**2. Treating OneLake as automatically governed**
* **Problem:** Assuming that because data is in OneLake, it is secure.
* **Why it happens:** Confusion between storage unification and security unification.
* **Consequence:** Unauthorized access to sensitive raw files.
* **Better approach:** Use workspaces as security boundaries and implement OneLake data access roles.

**3. Ignoring Lineage**
* **Problem:** Changing a source table without checking dependencies.
* **Why it happens:** Rushing deployments.
* **Consequence:** Broken executive dashboards and loss of trust.
* **Better approach:** Mandate impact analysis using Fabric’s lineage view before any schema changes.

**4. No Production Separation**
* **Problem:** Building and reporting out of a single workspace.
* **Why it happens:** It’s faster in the short term.
* **Consequence:** Users see incomplete data, and developers accidentally break reports.
* **Better approach:** Strict Dev/Test/Prod separation using deployment pipelines.

**5. Treating Purview as a Magic Governance Button**
* **Problem:** Buying Purview and assuming governance is "done."
* **Why it happens:** Viewing governance as a software problem rather than a process problem.
* **Consequence:** An expensive tool that catalogs garbage data.
* **Better approach:** Establish ownership and classification policies *before* configuring Purview.

**6. Over-engineering governance for small teams**
* **Problem:** Creating a 10-layer approval process for a 3-person BI team.
* **Why it happens:** Copying enterprise frameworks without context.
* **Consequence:** The team bypasses the process completely.
* **Better approach:** Scale governance controls to match organizational risk and size.

---

## Section 18 — Centralized vs Federated vs Hybrid Governance

How should your organization manage Fabric? Provide a decision framework based on your organizational structure.

### Centralized Governance
The central IT team manages everything.
* **Best for:** Highly regulated industries (banking, defense), small organizations, or teams with low data maturity.
* **The Trade-off:** Maximum security, minimal agility.

### Federated Governance
Business units (Finance, HR) operate autonomously.
* **Best for:** Massive enterprises with highly capable decentralized engineering teams.
* **The Trade-off:** Maximum agility, high risk of inconsistent architecture and data silos.

### Hybrid Governance
Central IT manages the platform, capacities, and standards. Domains manage the data products.
* **Best for:** Most modern enterprises. It allows the Finance team to build Finance reports quickly, provided they follow the central naming, security, and Git-integration standards.
* **The Trade-off:** Requires a strong Data Governance council to maintain alignment between IT and the business domains.

I strongly recommend the Hybrid model for Microsoft Fabric. It leverages Fabric's Domain feature perfectly, allowing central oversight with distributed execution.

---

## Section 19 — Real-World Enterprise Scenario

*Note: The following is a fictional reference architecture designed to illustrate governance concepts.*

**The Scenario:** A global financial services organization is adopting Fabric. They have five major units: Finance, Sales, Operations, Risk, and Customer Analytics.

**The Implementation:**
1. **Domains:** The Platform Team creates five Fabric Domains corresponding to the business units. 
2. **Workspaces:** Within the "Risk" Domain, they create three workspaces: `Risk-DEV`, `Risk-TEST`, and `Risk-PRD`. 
3. **Ownership:** The Chief Risk Officer is designated as the Data Owner. The Risk Data Engineering lead is the Workspace Admin (via an Entra Group).
4. **Access:** Business analysts in the Risk department are added to an Entra group `SG_Risk_Analysts`. This group is granted Viewer access to the `Risk-PRD` workspace and Read access to the specific SQL endpoint.
5. **Purview Integration:** The Governance Team configures Purview to automatically scan the `Risk-PRD` workspaces. Any table containing customer credit scores is tagged "Highly Confidential," which triggers a DLP policy preventing the data from being exported to unmanaged devices.
6. **OneLake:** The Customer Analytics team needs credit risk scores. Instead of copying the data, the Risk team provisions a OneLake shortcut for Customer Analytics, ensuring that Risk maintains absolute control over the single source of truth.

---

## Section 20 — Microsoft Fabric Governance Implementation Roadmap

Do not attempt to implement every governance control on day one. A phased approach ensures adoption without halting business velocity.

### Phase 1 — Foundation
* Establish Microsoft Entra ID security groups.
* Define workspace naming conventions.
* Assign workspace creation rights to a central team.
* Define initial Domains.

### Phase 2 — Security
* Implement Dev/Test/Prod workspace separation.
* Design standard RBAC matrices (Admin, Contributor, Viewer).
* Conduct initial access reviews.

### Phase 3 — Data Governance
* Integrate Microsoft Purview.
* Define the data classification taxonomy.
* Apply sensitivity labels to critical semantic models.

### Phase 4 — Operational Governance
* Establish the Fabric Governance Council.
* Implement Deployment Pipelines and Git integration.
* Setup automated monitoring for orphaned workspaces and inactive users.

### Phase 5 — Optimization
* Define governance KPIs.
* Automate access provisioning via ServiceNow or similar tools.
* Implement cross-domain data contracts for OneLake sharing.

---

## Section 21 — Fabric Governance Maturity Model

How mature is your organization's Fabric governance? Use this framework to assess your current state.

### Level 1 — Ad Hoc
* Everyone can create workspaces.
* Individual permissions are used everywhere.
* No separation of Dev and Prod.
* **Risk:** High. **Next Step:** Centralize workspace creation and enforce Entra groups.

### Level 2 — Defined
* Naming conventions exist.
* Workspaces have designated owners.
* Basic Dev/Prod separation exists, but deployments are manual.
* **Risk:** Moderate. **Next Step:** Implement Deployment pipelines and RBAC standards.

### Level 3 — Managed
* Entra Groups control all access.
* Domains are established.
* Microsoft Purview scans are active.
* **Risk:** Low. **Next Step:** Enforce sensitivity labels and implement active monitoring.

### Level 4 — Optimized
* CI/CD pipelines handle all production deployments.
* Data lineage is actively used for impact analysis.
* Automated alerts trigger on suspicious activity or inactive workspaces.
* **Risk:** Very Low. **Next Step:** Move towards automated compliance and capacity chargebacks.

### Level 5 — Enterprise
* Fully federated hybrid governance.
* Zero Trust architecture enforced via Private Endpoints.
* Data Contracts govern all cross-domain OneLake sharing.

*(Placeholder for Diagram 5: Fabric Governance Maturity Model)*
* **Title:** Fabric Governance Maturity Model
* **Alt text:** A five-level maturity model from Ad Hoc to Enterprise, showing the progression of Microsoft Fabric governance capabilities.
* **Recommended filename:** `fabric-governance-maturity-model.webp`

---

## Section 22 — Microsoft Fabric Governance Checklist

Use this actionable checklist when provisioning new environments.

**Identity & Access**
- [ ] No individual users granted direct workspace access.
- [ ] Entra ID Security Groups mapped to Workspace Roles.
- [ ] Multi-Factor Authentication enforced for all Fabric users.

**Workspace & Domains**
- [ ] Workspace creation restricted to Admins.
- [ ] Workspace naming convention applied.
- [ ] Workspace assigned to correct Domain.
- [ ] Minimum two Admins assigned via Group.

**Architecture & Deployment**
- [ ] Dev, Test, and Prod workspaces separated.
- [ ] Git integration configured for Dev workspace.
- [ ] Deployment Pipelines configured for Test to Prod promotion.

**Data & Purview**
- [ ] Data owner explicitly identified.
- [ ] Purview sensitivity labels applied to PII/financial data.
- [ ] Row-Level Security (RLS) configured in Semantic Model.

**Operations**
- [ ] Audit logs ingested into monitoring solution.
- [ ] Inactive workspace alert configured.

---

## Section 23 — FAQ

**What is Microsoft Fabric governance?**
It is the framework of policies, architecture, and processes that dictate how users securely interact with data, compute, and workspaces in Fabric, ensuring trust and compliance.

**Does Microsoft Fabric include data governance?**
Fabric includes platform-level controls (workspace roles, lineage, endorsement), but it relies on Microsoft Purview for enterprise-wide data governance, cataloging, and compliance.

**How does Microsoft Purview work with Fabric?**
Purview sits above Fabric, automatically cataloging its assets, defining enterprise sensitivity labels, and enforcing Information Protection and Data Loss Prevention policies across the Fabric tenant.

**Is Microsoft Purview required for Fabric?**
No, it is not strictly required to run workloads. However, for enterprise deployments handling sensitive data, Purview is highly recommended to achieve regulatory compliance and centralized cataloging.

**How do you secure Microsoft Fabric?**
Security requires defense in depth: Entra ID for identity, workspace roles for collaboration boundaries, OneLake roles and SQL permissions for data access, and Private Endpoints for network isolation.

**How does RBAC work in Fabric?**
Fabric uses Workspace Roles (Admin, Member, Contributor, Viewer) mapped to Microsoft Entra ID groups, combined with item-level sharing and Row-Level Security in semantic models.

**How do you govern OneLake?**
OneLake is governed through workspaces (which act as security boundaries) and OneLake data access roles. Data is shared across boundaries using Shortcuts rather than copying files.

**How should development and production environments be separated?**
They must be placed in entirely separate workspaces. Developers build in the Dev workspace, and code is promoted to the Prod workspace via Deployment Pipelines or Git CI/CD, with no direct developer access to production data.

**What are the most common Fabric governance mistakes?**
Granting everyone workspace Admin rights, failing to separate Dev and Prod, using individual user permissions instead of groups, and assuming that centralization automatically creates governance.
