import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SalesPipelineDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Exo_2'] flex flex-col">
      <Navbar />
      
      <div className="boxed-wrapper !max-w-[1440px] !mt-24 !mx-auto !min-h-screen border-none shadow-none bg-transparent flex flex-col w-full p-4 md:p-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-green-600 rounded-xl flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(201,243,29,0.2)]">📈</div>
              <div>
                <div className="font-['Rajdhani'] text-3xl font-bold tracking-[2px] text-[var(--text)] uppercase">Pipeline <span className="text-[var(--accent)]">Velocity</span></div>
                <div className="text-[11px] text-[var(--muted)] tracking-[2px] -mt-1 uppercase font-medium">Technical Showcase: B2B Revenue Analytics</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-full text-[var(--accent)] font-medium text-xs">
                 <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse shadow-[0_0_6px_var(--accent)]"></div>
                 LIVE DATA
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
              <p>
                In enterprise B2B sales operations, understanding funnel leakage and pipeline velocity is crucial to hitting quarterly revenue forecasts. This dashboard tracks simulated deal flows, deal sizes, historical win rates, and pipeline aging buckets. By identifying sales bottlenecks and predicting closure probabilities, the platform allows sales leadership to allocate resources efficiently and adjust sales targets dynamically.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">2. Analytical Pipeline & Data Architecture</h3>
              <p>
                The backend utilizes PostgreSQL database queries mapped via Prisma ORM to retrieve transaction and sales progression histories. Raw CRM exports are cleaned, normalized, and loaded into an optimized database instance. The client-side dashboard consumes these records to calculate velocity metrics (e.g. stage-to-stage transition duration, overall deal cycle duration, and conversion ratios) across regional divisions and sales representatives.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">3. Visual Interface & User Experience (UX)</h3>
              <p>
                Designed for C-suite decision making, the dashboard features a dark, modern theme that highlights critical performance metrics. High-level summaries (Total Pipeline Value, Weighted Target Achievement, Funnel Velocity, and Win Ratios) sit at the top. The middle grid uses interactive charts to break down deal distribution across regional stages (Prospecting, Qualification, Proposal, Negotiation, Closed-Won/Lost). A detailed, drilldown list at the bottom allows managers to review individual high-value accounts.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">4. Pipeline Calculations & Forecasting Logic</h3>
              <p>
                The forecasting engine calculates both Unweighted Pipeline (total contract value of all open deals) and Weighted Pipeline (contract value multiplied by the historical win-probability of the active sales stage). Average sales cycle duration is calculated programmatically by measuring the date differential between opportunity creation and final closure, giving teams an objective view of their actual pipeline velocity.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
