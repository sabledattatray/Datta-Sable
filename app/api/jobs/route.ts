import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const defaultJobs = [
  {
    title: "Senior Power BI Developer",
    department: "Data Analytics",
    location: "Mumbai, India (Hybrid)",
    salary: "₹12,00,000 - ₹20,00,000 / year",
    experience: "5+ Years",
    description: "We are seeking a Senior Power BI Developer to lead the design and execution of enterprise-grade Business Intelligence solutions, semantic modeling, and high-fidelity analytical reporting.",
    requirements: "Mastery of DAX, dimensional modeling, and Power BI service administration. Proven experience with Direct Lake mode, Delta Parquet structures, and performance optimization is highly preferred.",
    responsibilities: "Design optimized star schemas, author complex performant measures, establish row-level security (RLS), align semantic models with enterprise data pipelines, and conduct design reviews with business stakeholders.",
    skillsRequired: "Power BI, DAX, SQL, Data Modeling, Star Schema, Git",
    benefits: "Flexible hybrid work structure, high-end developer hardware allowance, performance bonuses, training budgets, and comprehensive family health coverage.",
    status: "OPEN"
  },
  {
    title: "Data Analyst",
    department: "Data Analytics",
    location: "Remote (India)",
    salary: "₹6,00,000 - ₹12,00,000 / year",
    experience: "2-4 Years",
    description: "We are looking for a Data Analyst with a passion for data storytelling to build operational dashboards, conduct deep-dive analyses, and help business leaders make data-driven decisions.",
    requirements: "Strong SQL proficiency, intermediate experience with Power BI or Tableau, and the ability to translate ambiguous business requests into structured metrics.",
    responsibilities: "Maintain corporate reporting suites, perform exploratory data analysis, write automated ETL pipeline steps, and present weekly metrics to leadership teams.",
    skillsRequired: "SQL, Excel, Power BI, Python, Data Storytelling",
    benefits: "100% remote-first culture, flexible working hours, home office setup allowance, and mental health wellness benefits.",
    status: "OPEN"
  },
  {
    title: "SQL AI Developer",
    department: "AI & Software",
    location: "Mumbai, India (Hybrid)",
    salary: "₹16,00,000 - ₹28,00,000 / year",
    experience: "4+ Years",
    description: "Join us at the intersection of relational databases and generative AI. We are building intelligent database agents, vector search indices, and RAG architectures that run directly at the database layer.",
    requirements: "Advanced T-SQL coding, experience with vector distance functions (Cosine, Euclidean), Python scripting, and integration with OpenAI / Azure Cognitive Services.",
    responsibilities: "Design and implement vector database indexes, write LLM-integrated database procedures, configure real-time Eventhouses, and secure corporate data feeds inside LLM contexts.",
    skillsRequired: "SQL, Python, AI, Machine Learning, Next.js, Node.js, Azure, AWS",
    benefits: "Sponsorship for AI research/certifications, flexible hybrid work hours, competitive equity options, and dedicated research days.",
    status: "OPEN"
  }
];

export async function GET() {
  try {
    let jobs = await prisma.job.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' }
    });

    // If no jobs exist in database, seed them for immediate visibility
    if (jobs.length === 0) {
      console.log("No jobs found. Seeding default positions...");
      await prisma.job.createMany({
        data: defaultJobs
      });
      jobs = await prisma.job.findMany({
        where: { status: 'OPEN' },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(jobs, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch jobs:", error);
    // Return mock data in development if db connection fails
    return NextResponse.json(defaultJobs, { status: 200 });
  }
}
