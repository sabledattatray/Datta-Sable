const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../fabric#1_Flagship_article.md');
const destPath = path.join(__dirname, '../app/blog/posts/microsoft-fabric-architecture-explained-2026.ts');

const md = fs.readFileSync(srcPath, 'utf8');

// Parse metadata
const metaLines = md.split('\n').slice(0, 11);
const title = "Microsoft Fabric Architecture Explained: The Complete 2026 Guide";
const excerpt = "A complete technical guide to Microsoft Fabric architecture: OneLake, Lakehouse, Warehouse, Direct Lake, governance, security, and certification paths.";

// Split metadata from content - starts at ## Introduction to keep the introduction text!
const contentStartIndex = md.indexOf('## Introduction');
let rawBody = md.substring(contentStartIndex).trim();

// Custom substitutions for diagrams and tables
const substitutions = {
  "📌 *Enterprise Reference Architecture Diagram — Fabric tenant, capacities, workspaces, and OneLake*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      subgraph Tenant [Microsoft Fabric Tenant]
        subgraph Capacities [Capacity Allocation]
          Cap1[Production Capacity: F64+]
          Cap2[Dev/Test Capacity: F2-F32]
        end
        
        subgraph OneLake [OneLake Shared SaaS Storage]
          direction TB
          Storage1[Workspace A Folder]
          Storage2[Workspace B Folder]
        end
        
        subgraph Workloads [Multi-Engine Workloads]
          df[Data Factory]
          lh[Lakehouse Spark]
          wh[Warehouse T-SQL]
          pbi[Power BI Direct Lake]
        end
      end
      
      Cap1 --> Storage1
      Cap2 --> Storage2
      Storage1 & Storage2 <--> Workloads
  </pre>
</div>`,

  "📌 *OneLake Data Flow Diagram — capacities, workspaces, items, and Shortcut pointers*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart LR
      subgraph OneLake [OneLake Storage Boundary]
          direction TB
          subgraph WS_Sales [Workspace: Sales]
              LH_Sales[Lakehouse: Sales_LH]
              WH_Sales[Warehouse: Sales_WH]
          end
          subgraph WS_Finance [Workspace: Finance]
              LH_Finance[Lakehouse: Fin_LH]
              ShortcutToSales[Shortcut: sales_gold_table]
          end
      end
      
      LH_Sales -->|Gold Table| ShortcutToSales
      
      subgraph External [External Cloud Storage]
          ADLS[Azure Data Lake Gen2]
          S3[Amazon S3]
      end
      
      ADLS -. Shortcut Pointer .-> LH_Sales
      S3 -. Shortcut Pointer .-> LH_Sales
  </pre>
</div>`,

  "📌 *Process Flow Diagram — data moving from source systems through Data Factory into Lakehouse/Warehouse, then into Power BI*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      Sources[On-Prem SQL / SaaS APIs / IoT] -->|Data Factory Ingestion| Bronze[Bronze Lakehouse: Raw Files & Tables]
      Bronze -->|Spark Notebook Transform| Silver[Silver Lakehouse: Cleaned & Enriched Tables]
      Silver -->|Spark SQL / PySpark| Gold[Gold Lakehouse: Star Schema Delta Tables]
      
      subgraph Serving [Serving Layer]
          Gold -->|Direct Lake Mode| Semantic[Power BI Semantic Model]
          Gold -. SQL Analytics Endpoint .-> ReadOnlyTQL[Read-Only T-SQL Queries]
          Warehouse[Fabric Data Warehouse] -->|T-SQL DML/ACID| GoldWH[Gold Warehouse Tables]
          GoldWH -->|Direct Lake Mode| Semantic
      end
      
      Semantic --> Reports[Power BI Reports & Dashboards]
  </pre>
</div>`,

  "📌 *Architecture Diagram — Data Factory pipeline activities feeding a metadata-driven ingestion framework*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      Trigger[Scheduled / Event Trigger] --> LookupMetadata[Lookup Activity: Fetch Table List]
      LookupMetadata --> ForEachTable[ForEach Activity: Iterate Tables]
      
      subgraph ForEachTable [ForEach Loop]
          CheckActive{Table Active?} -->|Yes| CopyData[Copy Data Activity: Source to Bronze OneLake]
          CopyData -->|Success| LogSuccess[Log Run Status: Success]
          CopyData -->|Failure| RetryBlock[Retry Logic: Exponential Backoff]
          RetryBlock -->|Exceeded Retries| AlertAdmin[Alert Admin / Slack Notification]
      end
  </pre>
</div>`,

  "📌 *Medallion Diagram — Bronze, Silver, Gold layers inside a Fabric Lakehouse*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart LR
      subgraph Medallion [Medallion Architecture in Fabric]
          Bronze[Bronze Layer: Raw Landing\n- Append-only\n- Parquet/CSV/JSON\n- Historical log]
          Silver[Silver Layer: Conformed\n- Schema enforced\n- Deduplicated\n- Delta format]
          Gold[Gold Layer: Business-Ready\n- Star schema\n- Dimensions & Facts\n- V-Order optimized]
          
          Bronze -->|Cleanse & Align| Silver
          Silver -->|Aggregate & Model| Gold
      end
  </pre>
</div>`,

  "📌 *Comparison Table — Fabric Warehouse vs. traditional SQL Server data warehouse*": `
<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border);">Feature</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border);">Fabric SQL Data Warehouse</th>
        <th style="padding: 12px; text-align: left;">Traditional SQL Server Data Warehouse</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Storage Format</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Open Delta Parquet (stored in OneLake)</td>
        <td style="padding: 12px;">Proprietary MDF/LDF files (local storage)</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Compute Scaling</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Fully serverless, automatic capacity scaling (F-SKUs)</td>
        <td style="padding: 12px;">Fixed provisioning, manual VM resizing</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Integration</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Cross-querying Lakehouses via T-SQL natively</td>
        <td style="padding: 12px;">Linked servers, complex ETL/ELT pipelines</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Maintenance</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Zero index maintenance (automatic statistics)</td>
        <td style="padding: 12px;">Manual index rebuilds, statistics updates, backups</td>
      </tr>
    </tbody>
  </table>
</div>`,

  "📌 *Decision Tree — Lakehouse vs. Warehouse selection criteria*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      Start[Choose Engine Type] --> Skills{What is the team's primary skill?}
      Skills -->|Python / Spark| Lakehouse[Select Lakehouse]
      Skills -->|SQL / T-SQL| DMLReq{Is full T-SQL DML required?}
      
      DMLReq -->|Yes| Warehouse[Select Data Warehouse]
      DMLReq -->|No| SemiStruct{Is data semi-structured or multi-format?}
      
      SemiStruct -->|Yes| Lakehouse
      SemiStruct -->|No| LegacyMig{Migrating legacy stored-procedures?}
      
      LegacyMig -->|Yes| Warehouse
      LegacyMig -->|No| Lakehouse
  </pre>
</div>`,

  "📌 *Architecture Diagram — VertiPaq engine reading Delta Parquet directly from OneLake in Direct Lake mode*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      UserQuery[User opens Power BI Report] --> VertiPaq[VertiPaq Engine in Memory]
      VertiPaq -->|Check Column Metadata| OneLakeMetadata[OneLake Delta Parquet Metadata]
      
      OneLakeMetadata --> IsCached{Column in memory cache?}
      IsCached -->|Yes| FetchCache[Fetch from cache]
      FetchCache --> ReturnData[Return Results Instantly]
      
      IsCached -->|No| FramePage[Frame & Transcode Page]
      FramePage --> OneLake[Read Delta Parquet from OneLake]
      OneLake -->|Load columns on-demand| VertiPaq
      
      VertiPaq --> CheckGuardrails{Exceeds Guardrails or Unsupported DAX?}
      CheckGuardrails -->|Yes| Fallback[Silent Fallback]
      Fallback --> DirectQuery[DirectQuery Mode]
      DirectQuery -->|SQL Analytics Endpoint| SQLQuery[Run T-SQL against SQL Endpoint]
      SQLQuery --> ReturnData
  </pre>
</div>`,

  "📌 *Data Flow Diagram — Eventstream ingesting into Eventhouse with Data Activator triggering alerts*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      Sources[IoT Sensors / Application Logs / Event Hubs] --> Eventstream[Eventstream Ingestion]
      Eventstream -->|Lightweight Filter/Transform| Eventhouse[Eventhouse KQL Database]
      Eventstream -. Archival Copy .-> OneLake[Lakehouse Delta Table]
      
      Eventhouse -->|Kusto Query Language| RTDashboards[Real-Time Dashboards]
      Eventhouse --> DataActivator[Data Activator Trigger]
      
      DataActivator -->|Condition met| SendAlerts[Send Teams/Slack Alerts or Webhook Actions]
  </pre>
</div>`,

  "📌 *Architecture Diagram — MLflow experiment tracking against Lakehouse training data*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      Lakehouse[OneLake Training Data] --> Notebook[Spark ML Notebook]
      Notebook -->|Train Model & Log parameters| MLflow[MLflow Server]
      MLflow -->|Track metrics, parameters & artifacts| ModelRegistry[Model Registry]
      ModelRegistry -->|Batch Scoring Job| ScoreNew[Write Predictions back to OneLake]
  </pre>
</div>`,

  "📌 *Capacity Planning Diagram — F-SKU tiers, CU/s allocation, and the F64 license threshold*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      subgraph SKUs [Fabric SKU Tiers]
          F2[F2 / F4 / F8\nLight pilot / Embedded]
          F16[F16 / F32\nMid-size team workloads]
          F64[F64\nStandard Enterprise Entry]
          F128[F128 - F2048\nLarge production & multi-tenant]
      end
      
      F2 & F16 -->|Viewers need| ProPPU[Pro or PPU License per Viewer]
      F64 & F128 -->|Viewers need| FreeLicense[Free Microsoft Fabric Viewer License]
  </pre>
</div>`,

  "📌 *Security Model Diagram — Entra ID, workspace roles, item permissions, and OneLake data security*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      User[User Access Request] --> EntraID[Entra ID: Authentication]
      EntraID --> WSRole[Workspace Role: Admin, Member, Contributor, Viewer]
      
      subgraph Authorization [Data-Level Authorization]
          WSRole --> ItemPerm[Item-Level Share Permissions]
          ItemPerm --> OneLakeSec[OneLake Security: Folder/Table-Level Controls]
          ItemPerm --> SQLSec[SQL Security: RLS, OLS, and SQL permissions]
      end
  </pre>
</div>`,

  "📌 *Security Model Diagram — RLS, OLS, and RBAC layered with Purview lineage and sensitivity labeling*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
        RBAC[Workspace RBAC\n- Admin\n- Member\n- Contributor\n- Viewer] --> ItemPermissions[Item Permissions\n- Read\n- Write\n- Reshare\n- Build]
        ItemPermissions --> DataSecurity[Data-Level Security\n- Row-Level Security RLS\n- Object-Level Security OLS]
        DataSecurity --> Purview[Microsoft Purview Integration\n- Data lineage tracing\n- Sensitivity labels\n- Audit logs]
  </pre>
</div>`,

  "📌 *Process Flow Diagram — Git-backed Dev/Test/Prod deployment pipeline for a Fabric workspace*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart LR
      Git[Git Repo / Branch] --> DevWS[Development Workspace]
      DevWS -->|Review & PR| TestWS[Test Workspace]
      TestWS -->|User Acceptance Testing| ProdWS[Production Workspace]
      
      subgraph PipelineRules [Deployment Pipeline Rules]
          StageDev[Dev Params: Dev ADLS / Dev SQL DB]
          StageTest[Test Params: Test ADLS / Test SQL DB]
          StageProd[Prod Params: Prod ADLS / Prod SQL DB]
      end
      
      DevWS -.-> StageDev
      TestWS -.-> StageTest
      ProdWS -.-> StageProd
  </pre>
</div>`,

  "📌 *Performance Comparison Table — Import vs. DirectQuery vs. Direct Lake under varying data volumes*": `
<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border);">Data Volume</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border);">Import Mode</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border);">DirectQuery Mode</th>
        <th style="padding: 12px; text-align: left;">Direct Lake Mode</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Small (&lt; 10M rows)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: #00ff66;">Fastest (sub-second memory query)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Moderate (depends on source DB speed)</td>
        <td style="padding: 12px; color: #00ff66;">Fastest (loaded into memory on-demand)</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Medium (10M - 100M rows)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Fast (limited by refresh timeout)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: #ff3333;">Slow (high SQL query overhead)</td>
        <td style="padding: 12px; color: #00ff66;">Fast (efficient memory column paging)</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Large (&gt; 100M rows)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: #ff3333;">Improbable (hits size limits or fails)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border); color: #ff3333;">Unusable (unacceptable latency)</td>
        <td style="padding: 12px; color: #00ff66;">Highly Performant (reads Delta natively)</td>
      </tr>
    </tbody>
  </table>
</div>`,

  "📌 *Cost Comparison Table — Separate Azure services vs. consolidated Fabric capacity, by workload*": `
<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border);">Workload Experience</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border);">Legacy Standalone Cost Pattern</th>
        <th style="padding: 12px; text-align: left;">Microsoft Fabric Consolidated Pattern</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Ingestion (Data Factory)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Per pipeline-run and DIU execution hour</td>
        <td style="padding: 12px;">Shared CU pool consumption</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Data Warehousing (Synapse)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Dedicated SQL Pool DWUs provisioned 24/7</td>
        <td style="padding: 12px;">Shared CUs; automatically paused when idle</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">Analytics & BI (Power BI)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Premium P1 capacity or per-user Pro licenses</td>
        <td style="padding: 12px;">F-SKU capacity; free viewers at F64+</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid var(--border); font-weight: bold;">AI & ML (Azure ML)</td>
        <td style="padding: 12px; border-right: 1px solid var(--border);">Dedicated VM instances and GPU workspace costs</td>
        <td style="padding: 12px;">Shared CUs for Spark ML notebooks</td>
      </tr>
    </tbody>
  </table>
</div>`,

  "📌 *Enterprise Reference Architecture Diagram — multi-region replication pattern for critical Fabric workloads*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      subgraph PrimaryRegion [Primary Region: East US]
          LH_Primary[Primary Lakehouse]
          Capacity_Primary[Primary Capacity F64]
      end
      
      subgraph SecondaryRegion [Secondary Region: West US]
          LH_Secondary[Replicated Lakehouse]
          Capacity_Secondary[DR Capacity F64 / Paused]
      end
      
      LH_Primary -->|Incremental Copy / Pipeline Replication| LH_Secondary
      LH_Secondary -. Shortcut pointer .-> DRVerify[UAT / DR Verification]
  </pre>
</div>`,

  "📌 *Enterprise Reference Architecture Diagram — phased Synapse-to-Fabric migration timeline*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      Phase1[Phase 1: Storage decoupling\n- Create OneLake Shortcuts to ADLS Gen2\n- No data migration yet] --> Phase2[Phase 2: Ingestion & Spark\n- Port ADF pipelines to Fabric pipelines\n- Port PySpark notebooks to Fabric Lakehouse]
      Phase2 --> Phase3[Phase 3: Warehousing\n- Migrate T-SQL dedicated schemas to Fabric Warehouse\n- Re-point Power BI to Direct Lake]
  </pre>
</div>`,

  "📌 *Decision Tree — diagnosing the root cause behind common Fabric performance and governance complaints*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      Complaint[Performance / Governance Complaint] --> CheckDirectLake{Is it a Direct Lake report?}
      
      CheckDirectLake -->|Yes| CheckFallback{Is the report falling back to DirectQuery?}
      CheckFallback -->|Yes| ReasonFallback[Check DAX expressions and Table Size SKU limits]
      CheckFallback -->|No| CheckVOrder[Is V-Order optimized on Gold tables?]
      
      CheckDirectLake -->|No| CheckWarehouse{Is it a Warehouse query?}
      CheckWarehouse -->|Yes| CheckStats[Check SQL query plan and stale statistics]
      CheckWarehouse -->|No| CheckSpark[Check Spark pool sizes and file count fragmentation]
  </pre>
</div>`,

  "📌 *Enterprise Reference Architecture Diagram — full retail analytics platform on Microsoft Fabric*": `
<div style="background: var(--surface2); padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; margin: 2rem 0; overflow-x: auto;">
  <pre class="mermaid" style="background: transparent; border: none; padding: 0; font-size: 0.85rem; line-height: 1.4; white-space: pre;">
    flowchart TD
      subgraph Ingestion [Ingestion Layer]
          POS[Real-Time POS Telemetry] --> Eventstream[Eventstream]
          ERP[E-Commerce ERP Batch] --> Pipeline[Data Factory Pipelines]
      end
      
      subgraph Storage [OneLake Medallion Storage]
          Eventstream -->|Ingest Stream| Bronze[Bronze Lakehouse Tables]
          Pipeline -->|Bulk Load| Bronze
          
          Bronze -->|Spark Notebook Transform| Silver[Silver Lakehouse Tables]
          Silver -->|Gold Aggregate & V-Order| Gold[Gold Lakehouse Tables]
      end
      
      subgraph Serving [Serving Layer]
          Gold -->|Direct Lake Mode| PowerBI[Power BI Semantic Model]
          Gold -->|Shortcut| FinWH[Finance SQL Warehouse]
          FinWH -->|Stored Procedures| PowerBI
      end
      
      PowerBI --> Dashboards[Store Manager Dashboards]
  </pre>
</div>`
};

let body = rawBody;

// Rewrite absolute dattasable.com links to relative ones for Next.js routing and fix power-bi-fabric-integration-2026 to power-bi-direct-lake-performance-tuning-fabric
body = body.replace(/https:\/\/dattasable\.com\/blog\//g, '/blog/');
body = body.replace(/\/blog\/power-bi-fabric-integration-2026/g, '/blog/power-bi-direct-lake-performance-tuning-fabric');

// Wrap with the featured snippet and custom TOC
const featuredSnippet = `
<div class="featured-snippet" style="background: rgba(201, 243, 29, 0.05); padding: 1.5rem; border-left: 4px solid var(--accent); border-radius: 0 8px 8px 0; margin-bottom: 2rem; font-size: 1.1rem; line-height: 1.8; color: var(--text);">
  <p><strong>Microsoft Fabric Architecture</strong> is built on a single logical data lake called OneLake, powered by shared capacity unit compute pools. This comprehensive, production-grade guide explores how OneLake, Lakehouse engines, SQL Warehouses, Direct Lake modeling, governance layers, and security frameworks integrate to form an enterprise analytics fabric.</p>
</div>
`;

const tocHtml = `
<div class="blog-toc" style="padding: 1.5rem 2rem !important;">
  <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 1.25rem !important; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text);">Table of Contents</h4>
  <ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.25rem 1.5rem; list-style-type: none !important; padding: 0 !important; margin: 0 !important; font-size: 0.85rem; line-height: 1.6; color: var(--muted);">
    <li><a href="#what-is-microsoft-fabric" style="color: var(--muted); text-decoration: none;">1. What Is Microsoft Fabric?</a></li>
    <li><a href="#core-architectural-principles" style="color: var(--muted); text-decoration: none;">2. Core Architectural Principles</a></li>
    <li><a href="#onelake-the-single-logical-data-lake" style="color: var(--muted); text-decoration: none;">3. OneLake: The Single Logical Data Lake</a></li>
    <li><a href="#the-seven-fabric-workloads" style="color: var(--muted); text-decoration: none;">4. The Seven Fabric Workloads</a></li>
    <li><a href="#data-factory-ingestion-and-orchestration" style="color: var(--muted); text-decoration: none;">5. Data Factory: Ingestion and Orchestration</a></li>
    <li><a href="#lakehouse-architecture" style="color: var(--muted); text-decoration: none;">6. Lakehouse Architecture</a></li>
    <li><a href="#data-warehouse-architecture" style="color: var(--muted); text-decoration: none;">7. Data Warehouse Architecture</a></li>
    <li><a href="#lakehouse-vs-warehouse-choosing-the-right-engine" style="color: var(--muted); text-decoration: none;">8. Lakehouse vs. Warehouse: Choosing the Right Engine</a></li>
    <li><a href="#power-bi-semantic-models-and-direct-lake" style="color: var(--muted); text-decoration: none;">9. Power BI, Semantic Models, and Direct Lake</a></li>
    <li><a href="#real-time-intelligence-eventstream-eventhouse-kql" style="color: var(--muted); text-decoration: none;">10. Real-Time Intelligence: Eventstream, Eventhouse, KQL</a></li>
    <li><a href="#data-science-and-ai-workloads" style="color: var(--muted); text-decoration: none;">11. Data Science and AI Workloads</a></li>
    <li><a href="#capacity-units-f-skus-and-capacity-planning" style="color: var(--muted); text-decoration: none;">12. Capacity Units, F-SKUs, and Capacity Planning</a></li>
    <li><a href="#security-architecture" style="color: var(--muted); text-decoration: none;">13. Security Architecture</a></li>
    <li><a href="#governance-rbac-rls-ols-and-purview" style="color: var(--muted); text-decoration: none;">14. Governance: RBAC, RLS, OLS, and Purview</a></li>
    <li><a href="#enterprise-best-practices-cicd-and-git-integration" style="color: var(--muted); text-decoration: none;">15. Enterprise Best Practices, CI/CD, and Git Integration</a></li>
    <li><a href="#performance-optimization" style="color: var(--muted); text-decoration: none;">16. Performance Optimization</a></li>
    <li><a href="#cost-optimization" style="color: var(--muted); text-decoration: none;">17. Cost Optimization</a></li>
    <li><a href="#disaster-recovery-high-availability-and-scalability" style="color: var(--muted); text-decoration: none;">18. Disaster Recovery, High Availability, and Scalability</a></li>
    <li><a href="#migration-strategy-moving-off-synapse-and-legacy-stacks" style="color: var(--muted); text-decoration: none;">19. Migration Strategy: Moving Off Synapse and Legacy Stacks</a></li>
    <li><a href="#common-mistakes-in-fabric-architecture" style="color: var(--muted); text-decoration: none;">20. Common Mistakes in Fabric Architecture</a></li>
    <li><a href="#real-world-architecture-example" style="color: var(--muted); text-decoration: none;">21. Real-World Architecture Example</a></li>
    <li><a href="#decision-frameworks" style="color: var(--muted); text-decoration: none;">22. Decision Frameworks</a></li>
    <li><a href="#certification-paths-dp-600-dp-700-dp-800-pl-300" style="color: var(--muted); text-decoration: none;">23. Certification Paths: DP-600, DP-700, DP-800, PL-300</a></li>
    <li><a href="#career-roadmap" style="color: var(--muted); text-decoration: none;">24. Career Roadmap</a></li>
    <li><a href="#interview-questions-20" style="color: var(--muted); text-decoration: none;">25. Interview Questions (20+)</a></li>
    <li><a href="#frequently-asked-questions-20" style="color: var(--muted); text-decoration: none;">26. Frequently Asked Questions (20+)</a></li>
    <li><a href="#summary-key-takeaways-and-next-steps" style="color: var(--muted); text-decoration: none;">27. Summary, Key Takeaways, and Next Steps</a></li>
  </ul>
</div>
`;

// Extract Table of Contents links and replace the entire TOC markdown section
const markdownTocMarker = "## Table of Contents";
const tocStartIndex = body.indexOf(markdownTocMarker);
const tocEndIndex = body.indexOf('---', tocStartIndex) + 3;

body = body.substring(0, tocStartIndex).trim() + '\n\n' + 
       featuredSnippet + '\n\n' + 
       tocHtml + '\n\n' + 
       body.substring(tocEndIndex).trim();

// Apply diagram and table substitutions on the raw body
Object.keys(substitutions).forEach((placeholder) => {
  body = body.replace(placeholder, substitutions[placeholder]);
});

// Convert markdown tables in the body to HTML tables before paragraph mapping
const mdTableRegex = /\|(.+)\|(?:\r?\n)\|[-:| ]+\|(?:\r?\n)((?:\|.+\|(?:\r?\n)?)+)/g;
body = body.replace(mdTableRegex, (match, headers, rows) => {
  const headerCols = headers.split('|').map(c => c.trim()).filter(Boolean);
  const rowLines = rows.trim().split('\n');
  
  let tableHtml = `
<div class="overflow-x-auto my-8">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border); font-size: 0.9rem;">
    <thead>
      <tr style="background: var(--surface2); border-bottom: 1px solid var(--border);">`;
  
  headerCols.forEach(col => {
    tableHtml += `\n        <th style="padding: 12px; text-align: left; border-right: 1px solid var(--border); color: var(--text); font-weight: 600;">${parseInlineMarkdown(col)}</th>`;
  });
  
  tableHtml += `\n      </tr>\n    </thead>\n    <tbody>`;
  
  rowLines.forEach(line => {
    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length === 0) return;
    tableHtml += `\n      <tr style="border-bottom: 1px solid var(--border);">`;
    cols.forEach(col => {
      tableHtml += `\n        <td style="padding: 12px; border-right: 1px solid var(--border); color: var(--muted);">${parseInlineMarkdown(col)}</td>`;
    });
    tableHtml += `\n      </tr>`;
  });
  
  tableHtml += `\n    </tbody>\n  </table>\n</div>`;
  return tableHtml;
});

function parseInlineMarkdown(text) {
  return text
    // Escape standard HTML chars first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Restore raw HTML tags that we intentionally want to keep (like <a href="...">text</a>, <strong>, etc.)
    .replace(/&lt;a\s+(.*?)&gt;(.*?)&lt;\/a&gt;/gi, '<a $1>$2</a>')
    .replace(/&lt;strong&gt;(.*?)&lt;\/strong&gt;/gi, '<strong>$1</strong>')
    .replace(/&lt;em&gt;(.*?)&lt;\/em&gt;/gi, '<em>$1</em>')
    .replace(/&lt;code&gt;(.*?)&lt;\/code&gt;/gi, '<code>$1</code>')
    .replace(/&lt;span(.*?)&gt;(.*?)&lt;\/span&gt;/gi, '<span$1>$2</span>')
    .replace(/&lt;br\s*\/?&gt;/gi, '<br />')
    // Markdown images: ![Alt Text](URL) -> <img src="URL" alt="Alt Text" style="max-width: 100%; border-radius: 8px; border: 1px solid var(--border); margin: 1.5rem 0;" />
    .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; border: 1px solid var(--border); margin: 1.5rem 0;" />')
    // Markdown links: [Text](URL) -> <a href="URL" class="text-[var(--accent)] hover:underline transition-colors">${text}</a>
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      const isExternal = url.startsWith('http');
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${url}" class="text-[var(--accent)] hover:underline transition-colors"${target}>${text}</a>`;
    })
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text*
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code: `code`
    .replace(/`(.*?)`/g, `<code style="font-family: 'JetBrains Mono', monospace; font-size: 0.9em; background: var(--surface2); padding: 0.2rem 0.4rem; border-radius: 4px; color: var(--accent);">$1</code>`);
}

function convertMarkdownToHtml(markdownText) {
  let html = '';
  const lines = markdownText.split('\n');
  let inList = false;
  let listType = null; // 'ul' or 'ol'
  let inCodeBlock = false;
  let codeLang = '';
  let codeContent = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        inCodeBlock = false;
        const codeText = codeContent.join('\n')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        html += `<pre style="background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; overflow-x: auto; margin: 2rem 0;"><code class="language-${codeLang}" style="font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--accent); line-height: 1.5;">${codeText}</code></pre>\n`;
        codeContent = [];
      } else {
        // Start of code block
        inCodeBlock = true;
        codeLang = line.trim().substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    const trimmedLine = line.trim();

    // Handle block-level images: ![Alt Text](URL)
    if (trimmedLine.startsWith('![') && trimmedLine.endsWith(')')) {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
        listType = null;
      }
      const imgMatch = trimmedLine.match(/^!\[([^\]]+)\]\(([^)]+)\)$/);
      if (imgMatch) {
        const alt = imgMatch[1];
        const url = imgMatch[2];
        html += `\n<div style="display: flex; flex-direction: column; align-items: center; margin: 2.5rem 0; width: 100%;">\n  <img src="${url}" alt="${alt}" style="max-width: 100%; border-radius: 8px; border: 1px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.25);" />\n  <span style="font-size: 0.85rem; color: var(--muted); margin-top: 0.75rem; text-align: center; font-style: italic;">${alt}</span>\n</div>\n`;
        continue;
      }
    }

    // Skip horizontal rules
    if (trimmedLine === '---') {
      html += `<hr style="border: 0; border-top: 1px solid var(--border); margin: 3rem 0;" />\n`;
      continue;
    }

    // Handle HTML block placeholders that we substituted earlier
    if (trimmedLine.startsWith('<div') || trimmedLine.startsWith('<table') || trimmedLine.startsWith('<pre class="mermaid"')) {
      // Close list if open
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
        listType = null;
      }
      // Gather until closing div/table tag
      let htmlBlock = line + '\n';
      let depth = 0;
      if (trimmedLine.startsWith('<div')) depth = 1;
      else if (trimmedLine.startsWith('<table')) depth = 1;

      while (depth > 0 && i + 1 < lines.length) {
        i++;
        const nextLine = lines[i];
        htmlBlock += nextLine + '\n';
        if (nextLine.includes('<div') || nextLine.includes('<table')) depth++;
        if (nextLine.includes('</div>') || nextLine.includes('</table>')) depth--;
      }
      html += htmlBlock;
      continue;
    }

    // Handle Headings
    if (trimmedLine.startsWith('## ')) {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
        listType = null;
      }
      const titleText = trimmedLine.substring(3).trim();
      const cleanTitleForId = titleText.replace(/^\d+\.\s+/, '');
      const id = cleanTitleForId.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      html += `<h2 id="${id}" style="color: var(--text); font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; font-family: Syne, sans-serif;">${titleText}</h2>\n`;
      continue;
    }

    if (trimmedLine.startsWith('### ')) {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
        listType = null;
      }
      const titleText = trimmedLine.substring(4).trim();
      const cleanTitleForId = titleText.replace(/^\d+\.\s+/, '');
      const id = cleanTitleForId.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      html += `<h3 id="${id}" style="color: var(--text); font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem; font-family: Syne, sans-serif;">${titleText}</h3>\n`;
      continue;
    }

    if (trimmedLine.startsWith('#### ')) {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
        listType = null;
      }
      const titleText = trimmedLine.substring(5).trim();
      html += `<h4 style="font-size: 1.1rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--text);">${titleText}</h4>\n`;
      continue;
    }

    // Handle blockquotes
    if (trimmedLine.startsWith('> ')) {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
        listType = null;
      }
      const quoteText = trimmedLine.substring(2).trim();
      html += `<blockquote style="border-left: 4px solid var(--accent); padding-left: 1.5rem; margin: 1.5rem 0; color: var(--muted); font-style: italic;">${parseInlineMarkdown(quoteText)}</blockquote>\n`;
      continue;
    }

    // Handle lists
    const ulMatch = line.match(/^(\s*)([-*])\s+(.*)/);
    const olMatch = line.match(/^(\s*)(\d+)\.\s+(.*)/);

    if (ulMatch) {
      const content = ulMatch[3];
      if (!inList || listType !== 'ul') {
        if (inList) html += `</${listType}>\n`;
        html += `<ul style="list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; color: var(--muted); line-height: 1.7;">\n`;
        inList = true;
        listType = 'ul';
      }
      html += `  <li style="margin-bottom: 0.5rem;">${parseInlineMarkdown(content)}</li>\n`;
      continue;
    }

    if (olMatch) {
      const content = olMatch[3];
      if (!inList || listType !== 'ol') {
        if (inList) html += `</${listType}>\n`;
        html += `<ol style="list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; color: var(--muted); line-height: 1.7;">\n`;
        inList = true;
        listType = 'ol';
      }
      html += `  <li style="margin-bottom: 0.5rem;">${parseInlineMarkdown(content)}</li>\n`;
      continue;
    }

    // Empty line closes list or ends paragraph
    if (trimmedLine === '') {
      if (inList) {
        html += `</${listType}>\n`;
        inList = false;
        listType = null;
      }
      continue;
    }

    // Regular paragraph
    if (inList) {
      html += `</${listType}>\n`;
      inList = false;
      listType = null;
    }

    html += `<p style="margin-bottom: 1.25rem; line-height: 1.7; color: var(--muted);">${parseInlineMarkdown(line)}</p>\n`;
  }

  if (inList) {
    html += `</${listType}>\n`;
  }

  return html;
}

const finalHtml = convertMarkdownToHtml(body);

// Wrap everything in TS export
const tsContent = `export const microsoftFabricArchitectureExplained2026Post = {
  id: "microsoft-fabric-architecture-explained-2026",
  slug: "microsoft-fabric-architecture-explained-2026",
  title: "Microsoft Fabric Architecture Explained: The Complete 2026 Guide",
  category: "Architecture & BI",
  excerpt: "A complete technical guide to Microsoft Fabric architecture: OneLake, Lakehouse, Warehouse, Direct Lake, governance, security, and certification paths.",
  date: "June 27, 2026",
  icon: "🏗️",
  image: "/images/blog/microsoft-fabric-architecture-explained-2026.webp",
  tags: ["Microsoft Fabric", "OneLake", "Direct Lake", "Data Warehouse", "Lakehouse", "Capacity Units", "DP-600", "DP-700", "DP-800"],
  content: \`${finalHtml.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`,
  readTime: 25,
  color: "#0078d4"
};
`;

fs.writeFileSync(destPath, tsContent, 'utf8');
console.log('✅ Flagship article successfully converted and written to app/blog/posts/microsoft-fabric-architecture-explained-2026.ts');
