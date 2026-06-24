import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlinkitSalesDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Exo_2'] flex flex-col">
      <Navbar />
      
      <div className="boxed-wrapper !max-w-[1440px] !mt-24 !mx-auto !min-h-screen border-none shadow-none bg-transparent flex flex-col w-full p-4 md:p-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent2)] to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">🛒</div>
              <div>
                <div className="font-['Rajdhani'] text-3xl font-bold tracking-[2px] text-[var(--text)] uppercase">Blinkit <span className="text-[var(--accent2)]">Intelligence</span></div>
                <div className="text-[11px] text-[var(--muted)] tracking-[2px] -mt-1 uppercase font-medium">Technical Case Study: Quick Commerce Analytics</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full text-[#00ff88] font-medium text-xs">
                 <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse shadow-[0_0_6px_#00ff88]"></div>
                 LIVE PREVIEW
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
              <p>
                In the quick-commerce (q-commerce) landscape, delivery latency, stock availability, and regional demand shifts drive profitability. This dashboard parses simulated and historical sales records from a Blinkit-inspired mock dataset to monitor transaction velocity, channel distribution, and outlet performance. By isolating regional bottlenecks, category demand, and discount trends, it provides operational teams with real-time insight to manage delivery loops and optimize shelf stock.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">2. Data Modeling & Database Pipeline</h3>
              <p>
                The underlying data pipeline utilizes a star schema optimized for fast, analytical aggregate queries. Raw transaction logs, inventory tallies, and customer feedback are cleaned and structured into a central Fact Table joined with four Dimension Tables: Outlets (location, type, size), Items (category, price, brand tier), Time (date, shift, day-of-week), and Delivery (distance, duration, status). This normalized layout minimizes join latency and allows the Power BI desktop workspace to execute swift calculations.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">3. Visual Hierarchy & Business Intelligence UX</h3>
              <p>
                The visual layout adheres to strict corporate dashboard design guidelines, prioritizing high-priority KPIs at the top (Total Sales, Average Ticket Value, Customer Satisfaction Ratings, and Item Count). The middle section details sales performance segmented by outlet type (e.g., Tier 1 vs Tier 3 locations, Supermarkets vs Grocery stores) and brand tier. Finally, the bottom section visualizes delivery metrics and item category breakdowns, allowing analysts to drill down into specific product performance across regional dark stores.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">4. Core Analytical Metrics & DAX Formulas</h3>
              <p>
                Key metrics visualized include Sales Growth Year-over-Year (YoY), Average Sales per Transaction (AOV), and Out-of-Stock (OOS) percentages. Complex time-intelligence measures are calculated using native DAX queries, comparing Year-to-Date (YTD) performance with Previous Year-to-Date (PYTD) metrics. This ensures that executive stakeholders can track moving targets and make informed decisions on inventory distribution and supply-chain logistics.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
