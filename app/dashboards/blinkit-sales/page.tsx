import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Blinkit Sales Intelligence Dashboard — Quick Commerce Analytics Case Study | Datta Sable',
  description:
    'Explore a quick-commerce dashboard interface with sample values, clear demonstration limits, and a worked sales-reconciliation example.',
  keywords: ['Blinkit dashboard', 'quick commerce analytics', 'Power BI case study', 'q-commerce sales intelligence', 'DAX dashboard', 'Blinkit sales data'],
  alternates: { canonical: 'https://dattasable.com/dashboards/blinkit-sales' },
  openGraph: {
    title: 'Blinkit Sales Intelligence Dashboard — Quick Commerce Analytics Case Study',
    description: 'Quick-commerce interface demonstration using sample values, without a live Blinkit data connection.',
    url: 'https://dattasable.com/dashboards/blinkit-sales',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function BlinkitSalesDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Exo_2'] flex flex-col">
      <Navbar />
      
      <div className="boxed-wrapper !max-w-[1440px] !mt-24 !mx-auto !min-h-screen border-none shadow-none bg-transparent flex flex-col w-full p-4 md:p-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--surface2)] rounded-xl flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">🛒</div>
              <div>
                <h1 className="font-['Rajdhani'] text-3xl font-bold tracking-[2px] text-[var(--text)] uppercase">Blinkit <span className="text-[var(--accent2)]">Intelligence</span></h1>
                <div className="text-[length:var(--text-small)] text-[var(--muted)] tracking-[2px] -mt-1 uppercase font-medium">Technical Case Study: Quick Commerce Analytics</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full text-[#00ff88] font-medium text-xs">
                 <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse shadow-[0_0_6px_#00ff88]"></div>
                 SIMULATED DEMO
               </div>
            </div>
          </div>
        </header>

        {/* The Dashboard iframe cleanly embedded as a content block */}
        <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-[var(--surface)]">
          <iframe
            src="/Dashboard/blinkit-dashboard.html"
            className="w-full"
            style={{ height: '1200px', border: 'none', display: 'block' }}
            title="Blinkit Sales Dashboard"
            allowFullScreen
          />
        </div>

        {/* Case Study Technical Breakdown */}
        <section className="mt-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 max-w-5xl" style={{ borderLeft: '4px solid var(--accent2)' }}>
          <h2 className="text-2xl font-bold font-['Rajdhani'] mb-6 tracking-wider text-[var(--text)] uppercase">Technical Case Study: Quick Commerce Sales Intelligence</h2>
          
          <div className="space-y-6 text-sm text-[var(--muted)] leading-relaxed">
            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">1. Executive Summary & Objective</h3>
              <p>This is a quick-commerce dashboard design demonstration inspired by retail reporting. It uses sample and simulated values rather than a verified live Blinkit dataset. The brand reference describes the design scenario; it does not imply an affiliation, customer relationship, or measured operational improvement.</p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">2. Demo scope and data requirements</h3>
              <p>The page embeds a local HTML and JavaScript dashboard. It is not an embedded Power BI report, and the page does not demonstrate a working DAX or production warehouse integration. Before adapting this design, define the actual transaction grain, currency, outlet identifiers, returns policy, and refresh schedule. Use only data you have permission to process.</p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">3. Visual Hierarchy & Business Intelligence UX</h3>
              <p>Review the page as an interface exercise: can a reader identify the reporting period, distinguish totals from averages, and understand the selected category or outlet? Test that filters behave consistently and that empty results are visible. These checks should be repeated with a real, fixed dataset before treating the design as an analytical application.</p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">4. An illustrative reconciliation check</h3>
              <p>As a separate illustrative validation example, three orders worth 100, 200, and 300 have gross sales of 600 and an average order value of 200. A return of 100 changes net sales to 500 if the reporting policy deducts returns. State that policy explicitly. Reconcile totals with source rows and test missing outlet keys and duplicate transactions before publication.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
