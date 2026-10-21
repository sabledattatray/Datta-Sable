export interface Architecture {
  id: string;
  title: string;
  description: string;
  category: 'Automation' | 'BI' | 'AI' | 'Data';
  diagram: string;
  template: string;
  promptChain: string[];
  outcomes: string[];
  caseStudySlug: string;
}

export const ARCHITECTURES: Architecture[] = [
  {
    id: 'surgical-content-engine',
    title: 'Surgical Content Engine',
    description: 'A multi-agent system for transforming raw data into high-fidelity technical articles and LinkedIn assets.',
    category: 'AI',
    diagram: `graph TD
    A[Raw Data Source] --> B[Surgical Parser]
    B --> C{Logic Gate}
    C -->|Technical| D[Deep Research Agent]
    C -->|Creative| E[Style Transfer Agent]
    D --> F[Content Assembly]
    E --> F
    F --> G[Multi-Platform Output]`,
    template: JSON.stringify({
      version: "1.0",
      type: "n8n-workflow",
      nodes: ["Webhook", "OpenAI-Agent", "Notion-Export"],
      trigger: "HTTP Request"
    }, null, 2),
    promptChain: [
      "Analyze the following technical input for core logic...",
      "Synthesize the logic into a surgical-style narrative...",
      "Generate platform-specific distribution assets..."
    ],
    outcomes: [
      "Check each generated claim against the supplied source material.",
      "Validate output structure and route unsupported claims for review.",
      "Review platform-specific formatting before publication."
    ],
    caseStudySlug: 'case-study-n8n-automated-authority-scaling'
  },
  {
    id: 'bi-data-orchestrator',
    title: 'BI Data Orchestrator',
    description: 'An illustrative flow from source data through a warehouse to a Power BI reporting layer. Adapt schemas, refresh behavior, and permissions to the actual environment.',
    category: 'BI',
    diagram: `graph LR
    A[Stripe/SQL] --> B[ETL Pipeline]
    B --> C[Data Warehouse]
    C --> D[Power BI Semantic Layer]
    D --> E[Interactive Dashboard]`,
    template: "-- SQL Schema for Revenue Intelligence\nCREATE TABLE revenue_metrics (\n  id SERIAL PRIMARY KEY,\n  source VARCHAR(50),\n  amount DECIMAL(10,2),\n  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);",
    promptChain: [
      "Write a SQL query to calculate MoM revenue growth...",
      "Optimize the query for indexing and performance..."
    ],
    outcomes: [
      "Verify source row counts and transformation rules on a sample.",
      "Compare automated figures with an independently calculated baseline.",
      "Display the latest successful refresh timestamp.",
      "Investigate reconciliation differences before publishing a report."
    ],
    caseStudySlug: 'case-study-workflow-automation-roi'
  }
];
