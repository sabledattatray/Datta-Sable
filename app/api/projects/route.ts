import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    const imageMap: Record<string, string> = {
      'Supply Chain Intelligence': '/images/portfolio/supply_chain.webp',
      'Workforce Retention Engine': '/images/portfolio/hr.webp',
      'Financial Close Automation': '/images/portfolio/finance.webp',
      'Omnichannel Marketing ROI': '/images/portfolio/marketing.webp',
      'Warehouse IoT Monitoring': '/images/portfolio/iot.webp',
      'Retail Demand Forecaster': '/images/portfolio/retail.webp',
      'Legal Document Classifier': '/images/portfolio/legal.webp',
      'Healthcare Patient Flow': '/images/portfolio/healthcare.webp',
      'SaaS Churn Analytics': '/images/portfolio/saas.webp',
      'Energy Grid Load Forecast': '/images/portfolio/energy.webp',
    };

    const liveMap: Record<string, string> = {
      'Surgical AI-BI Forge': '/dashboards/surgical-ai',
      'Flagship Enterprise BI Engine (MTD/LMTD)': 'https://app.powerbi.com/reportEmbed?reportId=31b010f4-3f62-4cbe-8524-9238cc2ebaca&autoAuth=true&embeddedDemo=true',
      'Production Performance Engine (Sept 2025)': 'https://app.powerbi.com/view?r=eyJrIjoiOWJlMjkwZTUtMTBiZS00ZDVmLTkxNTItMThhZTY0MTE1N2ViIiwidCI6ImE4MDkzYjljLTFiYWUtNGExNS1hNTRjLTY4NDc5ZDFmMjVkZiJ9',
      'Sales Performance Ecosystem (Feb 2026)': '/dashboards/sales-pipeline',
      'Telecom Collection Intelligence (Vodafone)': '/dashboards/collection-intelligence',
      'Q-Commerce Performance Engine (Beta)': '/dashboards/blinkit-sales',
      'Supply Chain Intelligence': 'https://public.tableau.com/views/SupplychainDashboard/1KPIDashboard?:embed=y&:showVizHome=no',
      'Workforce Retention Engine': 'https://public.tableau.com/views/WorkforceAnalytics-Attrition/AttritionDashboard?:embed=y&:showVizHome=no',
      'Financial Close Automation': 'https://public.tableau.com/views/EmployeeExpenseAnalysis/EmployeeExpenseAnalysis?:embed=y&:showVizHome=no',
      'Omnichannel Marketing ROI': 'https://public.tableau.com/views/SalesFunnelDashboard_16570254084520/SalesPipelineDashboard?:embed=y&:showVizHome=no',
      'Market Expansion Scraper': '/dashboards/global-sales-intelligence',
      'Warehouse IoT Monitoring': 'https://public.tableau.com/views/LogisticsDashboard_16820931460080/Overview?:embed=y&:showVizHome=no',
      'Retail Demand Forecaster': '/dashboards/blinkit-sales',
      'Legal Document Classifier': '/dashboards/surgical-ai',
      'Healthcare Patient Flow': '/dashboards/interactive',
      'SaaS Churn Analytics': 'https://lookerstudio.google.com/embed/reporting/1rBC8woDruwE-f_gsheY7kwlx0BPtgzEn/page/c2P1',
      'Energy Grid Load Forecast': '/dashboards/interactive',
    };

    // Map database properties (imageUrl, description) back to the keys expected by the frontend (image, desc)
    const mapped = projects.map(p => {
      let resolvedImage = p.imageUrl;
      if (!resolvedImage || resolvedImage === '/images/portfolio/.webp' || resolvedImage.endsWith('/.webp')) {
        resolvedImage = imageMap[p.title] || '/images/portfolio/surgical_forge.webp';
      }

      let resolvedLive = p.live;
      if (!resolvedLive || resolvedLive === 'https://dattasable.com/dashboards' || resolvedLive === 'https://dattasable.com/blog' || resolvedLive === '#' || resolvedLive === '') {
        resolvedLive = liveMap[p.title] || resolvedLive || '';
      }

      return {
        id: isNaN(Number(p.id)) ? p.id : Number(p.id),
        title: p.title,
        category: p.category,
        image: resolvedImage,
        color: p.color || 'var(--accent)',
        tools: p.tools,
        client: p.client || '',
        desc: p.description,
        problem: p.problem || '',
        solution: p.solution || '',
        impact: p.impact || '',
        github: p.github || '',
        live: resolvedLive,
      };
    });

    return NextResponse.json(mapped, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch public projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
