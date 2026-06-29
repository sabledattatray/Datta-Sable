import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING MENTORSHIP SYSTEM METADATA ---');

  // 1. Seed Cohorts
  const cohorts = [
    { name: 'Batch 1 - July 2026', status: 'ACTIVE' },
    { name: 'Batch 2 - August 2026', status: 'UPCOMING' },
    { name: 'Weekend Cohort', status: 'ACTIVE' },
    { name: 'Career Comeback Cohort', status: 'ACTIVE' },
  ];

  console.log('Seeding Cohorts...');
  for (const c of cohorts) {
    await prisma.cohort.upsert({
      where: { name: c.name },
      update: { status: c.status },
      create: { name: c.name, status: c.status },
    });
  }

  // 2. Seed Career Tracks
  const tracks = [
    { name: 'Azure Data Engineer', description: 'Master Azure Data Factory, Databricks, Synapse Analytics, Delta Lake, PySpark, and enterprise ETL pipelines.' },
    { name: 'Microsoft Fabric Engineer', description: 'Become an expert in Microsoft Fabric Lakehouse, Warehouse, OneLake, Dataflow Gen2, Direct Lake Semantic Models, and end-to-end data analytics orchestration.' },
    { name: 'Data Analyst', description: 'Master SQL querying, Python scripting, Excel calculations, and storytelling with business metrics.' },
    { name: 'Power BI Developer', description: 'Learn advanced DAX formulas, data modeling, performance optimization, incremental loading, and executive dashboards.' },
  ];

  console.log('Seeding Career Tracks...');
  for (const t of tracks) {
    await prisma.careerTrack.upsert({
      where: { name: t.name },
      update: { description: t.description },
      create: { name: t.name, description: t.description },
    });
  }

  // 3. Seed Initial Resources
  const resources = [
    {
      title: 'Azure Data Engineer Learning Roadmap',
      category: 'Roadmap',
      description: 'The definitive 9-week roadmap detailing topics from SQL fundamentals to Spark and Azure Databricks production configurations.',
      downloadUrl: '/uploads/resources/Azure_Data_Engineer_Roadmap.pdf',
      featured: true,
    },
    {
      title: 'Microsoft Fabric Learning Roadmap',
      category: 'Roadmap',
      description: 'Step-by-step path to master Synapse Lakehouse, Dataflow Gen2, Direct Lake Semantic Models, and DP-600 / DP-700 exams.',
      downloadUrl: '/uploads/resources/Microsoft_Fabric_Roadmap.pdf',
      featured: true,
    },
    {
      title: 'Professional ATS Resume Template',
      category: 'Template',
      description: 'Sleek, recruiter-tested markdown & docx resume templates engineered to bypass ATS filters for Data Engineers.',
      downloadUrl: '/uploads/resources/Data_Engineer_ATS_Resume_Template.docx',
      featured: true,
    },
    {
      title: 'Azure & Fabric Technical Interview Guide',
      category: 'Guide',
      description: 'Top 100 scenario-based and coding interview questions with model answers for Data Platform professionals.',
      downloadUrl: '/uploads/resources/Data_Engineer_Interview_Guide.pdf',
      featured: false,
    },
    {
      title: 'Data Engineering GitHub Portfolio Checklist',
      category: 'Checklist',
      description: 'Complete checklist of README structures, architectural layouts, and code style requirements to impress recruiters.',
      downloadUrl: '/uploads/resources/DE_GitHub_Portfolio_Checklist.pdf',
      featured: false,
    },
  ];

  console.log('Seeding Resources...');
  for (const r of resources) {
    await prisma.mentorshipResource.upsert({
      // We will search by title and upsert
      where: { id: r.title.replace(/\s+/g, '-').toLowerCase() },
      update: {
        title: r.title,
        category: r.category,
        description: r.description,
        downloadUrl: r.downloadUrl,
        featured: r.featured,
      },
      create: {
        id: r.title.replace(/\s+/g, '-').toLowerCase(),
        title: r.title,
        category: r.category,
        description: r.description,
        downloadUrl: r.downloadUrl,
        featured: r.featured,
      },
    });
  }

  console.log('--- SEEDING COMPLETED SUCCESSFULY ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
