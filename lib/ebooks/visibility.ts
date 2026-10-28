import type { Prisma } from '@prisma/client';

// Explicitly selected for public discovery. Other drafts remain private.
// Visibility does not approve content or enable sales.
export const publicBookWhere: Prisma.CommerceProductWhereInput = {
  OR: [
    { status: 'PUBLISHED' },
    {
      status: 'DRAFT',
      slug: {
        in: [
          'power-bi-real-world-projects-2026',
          'power-bi-mastery-2026',
          'digital-marketing-playbook-2026',
          'sql-business-analytics-2026',
          'advanced-excel-mis-reporting-2026',
          'python-automation-analysts-2026',
          'microsoft-fabric-foundations-2026',
          'ai-productivity-professionals-2026',
          'azure-databricks-pyspark-lakehouse-2026',
          'enterprise-data-modeling-vault-2026',
          'postgresql-performance-tuning-dba-2026',
          'dbt-analytics-engineering-mastery-2026',
          'snowflake-architecture-finops-2026',
          'production-genai-agents-rag-2026',
          'executive-bi-metrics-okrs-2026',
          'cloud-security-zero-trust-data-2026',
          'devops-data-engineers-cicd-2026',
          'data-governance-mdm-purview-2026',
        ],
      },
    },
  ],
};
