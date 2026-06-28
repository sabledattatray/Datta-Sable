import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const systemPages = [
  {
    slug: 'about',
    title: 'About Datta Sable',
    excerpt: 'Senior BI Developer & Data Architect specialized in Tableau, Power BI, SQL, and Python.',
    content: `<h2>About Datta Sable</h2><p>Welcome to my professional profile. I am a Principal Business Intelligence Consultant and Data Strategist. My expertise lies at the intersection of data engineering, interactive dashboard design, and strategic technical automation.</p><h3>Technical Arsenal</h3><ul><li><strong>Visualization:</strong> Tableau, Power BI, Microsoft Fabric, custom React/D3 charts</li><li><strong>Data & Querying:</strong> SQL Server, PostgreSQL, Snowflake, DuckDB</li><li><strong>Programming:</strong> Python, TypeScript, Node.js, Shell automation</li></ul>`
  },
  {
    slug: 'services',
    title: 'Professional BI & Data Analytics Services',
    excerpt: 'Enterprise-grade Dashboard Development, SQL Automation, Python Data Engineering, and SEO Optimization.',
    content: `<h2>Services Offered</h2><p>I provide high-fidelity analytics, technical automation, and scalable dashboard structures built for enterprise-grade growth.</p><h3>Key Service Areas</h3><ul><li><strong>Interactive Dashboard Design:</strong> Delivering surgical-precision executive dashboards.</li><li><strong>Data Pipeline Automation:</strong> Engineering ETL/ELT workflows using Python and modern orchestrators.</li><li><strong>SQL Performance Optimization:</strong> Tuning complex queries and indexing strategies.</li></ul>`
  },
  {
    slug: 'careers',
    title: 'Careers with Datta Sable',
    excerpt: 'Join our team to build the future of Business Intelligence and Data Engineering.',
    content: `<h2>Careers & Opportunities</h2><p>Explore current career opportunities and open roles in Business Intelligence, Analytics Engineering, and Data Science.</p>`
  },
  {
    slug: 'contact',
    title: 'Contact Datta Sable',
    excerpt: 'Get in touch for consultations, project estimates, or speaking engagements.',
    content: `<h2>Get in Touch</h2><p>If you have any questions or would like to discuss a project, feel free to contact me through the contact form or directly via email.</p>`
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    excerpt: 'Learn how we collect, use, and protect your personal information.',
    content: `<h2>Privacy Policy</h2><p>Your privacy is of extreme importance to us. This Privacy Policy document outlines the types of personal information received and collected and how it is utilized.</p>`
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    excerpt: 'Terms and conditions governing the use of this website.',
    content: `<h2>Terms of Service</h2><p>By accessing this website, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>`
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    excerpt: 'Information about how we use cookies on this site.',
    content: `<h2>Cookie Policy</h2><p>We use cookies to help improve your experience on our website. This Cookie Policy explains how cookies are used and how you can manage your preferences.</p>`
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    excerpt: 'Legal disclaimer regarding the content and information on this site.',
    content: `<h2>Legal Disclaimer</h2><p>The information contained on this website is for general information purposes only. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind.</p>`
  },
  {
    slug: 'editorial-policy',
    title: 'Editorial Policy',
    excerpt: 'Guidelines and standards for our content publishing.',
    content: `<h2>Editorial Policy</h2><p>We are committed to delivering accurate, objective, and high-quality educational content. All articles undergo thorough technical verification before publishing.</p>`
  },
  {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    excerpt: 'Find answers to common questions about services, tools, and processes.',
    content: `<h2>Frequently Asked Questions</h2><p>Have questions? Find answers to the most common queries regarding our BI services, tool integrations, and engagement models.</p>`
  },
  {
    slug: 'portfolio',
    title: 'Portfolio & Case Studies',
    excerpt: 'Explore successful BI projects, engineering frameworks, and technical case studies.',
    content: `<h2>Project Portfolio</h2><p>A showcase of enterprise dashboard solutions, custom analytics pipelines, and advanced automation workflows.</p>`
  },
  {
    slug: 'infrastructure',
    title: 'Infrastructure & Tech Stack',
    excerpt: 'The technical setup, hosting architecture, and frameworks powering this platform.',
    content: `<h2>Infrastructure Overview</h2><p>Learn more about the zero-dollar production stack, Cloudflare configuration, and database infrastructure that keeps this site fast and resilient.</p>`
  },
  {
    slug: 'start-here',
    title: 'Start Here',
    excerpt: 'The definitive starting point for learning BI, data analytics, and dashboard design.',
    content: `<h2>Getting Started</h2><p>New to Business Intelligence? Access the curated path of articles, frameworks, and tutorials to accelerate your learning curve.</p>`
  }
];

async function main() {
  console.log('Seeding system pages into the database...');
  
  for (const page of systemPages) {
    const existing = await prisma.page.findUnique({
      where: { slug: page.slug }
    });
    
    if (!existing) {
      await prisma.page.create({
        data: {
          slug: page.slug,
          title: page.title,
          excerpt: page.excerpt,
          content: page.content,
          published: true
        }
      });
      console.log(`Created page: ${page.slug}`);
    } else {
      console.log(`Page already exists: ${page.slug}`);
    }
  }
  
  console.log('Seeding completed successfully.');
}

main()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
