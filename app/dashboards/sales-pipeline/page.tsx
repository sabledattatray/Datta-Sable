import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Sales Pipeline Velocity Dashboard — B2B Revenue Analytics Case Study | Datta Sable',
  description:
    'Explore a browser-based sales pipeline interface with generated demonstration data, validation questions, and an illustrative weighted-pipeline calculation.',
  keywords: ['sales pipeline dashboard', 'B2B revenue analytics', 'Power BI sales dashboard', 'pipeline velocity', 'CRM analytics', 'sales performance BI'],
  alternates: { canonical: 'https://dattasable.com/dashboards/sales-pipeline' },
  openGraph: {
    title: 'Sales Pipeline Velocity Dashboard — B2B Revenue Analytics Case Study',
    description: 'Sales pipeline interface demonstration with simulated values and a practical validation checklist.',
    url: 'https://dattasable.com/dashboards/sales-pipeline',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function SalesPipelineDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Exo_2'] flex flex-col">
      <Navbar />
      
      <div className="boxed-wrapper !max-w-[1440px] !mt-24 !mx-auto !min-h-screen border-none shadow-none bg-transparent flex flex-col w-full p-4 md:p-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--surface2)] rounded-xl flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(201,243,29,0.2)]">📈</div>
              <div>
                <h1 className="font-['Rajdhani'] text-3xl font-bold tracking-[2px] text-[var(--text)] uppercase">Pipeline <span className="text-[var(--accent)]">Velocity</span></h1>
                <div className="text-[11px] text-[var(--muted)] tracking-[2px] -mt-1 uppercase font-medium">Technical Showcase: B2B Revenue Analytics</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-full text-[var(--accent)] font-medium text-xs">
                 <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse shadow-[0_0_6px_var(--accent)]"></div>
                 SIMULATED DEMO
               </div>
            </div>
          </div>
        </header>

        {/* The Dashboard iframe cleanly embedded as a content block */}
        <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-[var(--surface)]">
          <iframe
            src="/Dashboard/sales_pipeline_dashboard.html"
            className="w-full"
            style={{ height: '1100px', border: 'none', display: 'block' }}
            title="Sales Pipeline Dashboard"
            allowFullScreen
          />
        </div>

        {/* Case Study Technical Breakdown */}
        <section className="mt-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 max-w-5xl" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h2 className="text-2xl font-bold font-['Rajdhani'] mb-6 tracking-wider text-[var(--text)] uppercase">Technical Case Study: Sales Pipeline Velocity</h2>
          
          <div className="space-y-6 text-sm text-[var(--muted)] leading-relaxed">
            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">1. Executive Summary & Objective</h3>
              <p>This is a browser-based sales analytics demonstration with generated sample values. It illustrates how a team might arrange pipeline summaries, stage comparisons, and deal-level detail. The displayed figures are not a live CRM feed, a customer engagement result, or a validated revenue forecast.</p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">2. Demo implementation and production requirements</h3>
              <p>The page embeds a local HTML dashboard. Its JavaScript generates demonstration values for the interface. The showcase does not establish a PostgreSQL or Prisma reporting pipeline. A production integration would need authenticated data access, a documented source model, refresh monitoring, and reconciliation against the CRM before its numbers could support business decisions.</p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">3. Visual Interface & User Experience (UX)</h3>
              <p>When reviewing the interface, start with the reporting period and currency. Then inspect whether a selected region or stage is reflected consistently in the summary and detail views. Generated values can change during interaction, so this demo is suitable for layout exploration rather than financial reconciliation. Record the expected filter behavior before implementing a real version.</p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">4. Pipeline Calculations & Forecasting Logic</h3>
              <p>For a separate illustrative weighted-pipeline calculation, a 10,000 deal at 30% and a 20,000 deal at 60% contribute 3,000 and 12,000, totaling 15,000. Those probabilities are assumptions, not promises. In a real model, test missing amounts, duplicate deals, closed stages, and the historical calibration of probabilities before using the result.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
