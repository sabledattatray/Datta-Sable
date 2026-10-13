import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function WorldBusinessDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Exo_2'] flex flex-col">
      <Navbar />

      <div className="boxed-wrapper !max-w-[1600px] !mt-24 !mx-auto !min-h-screen border-none shadow-none bg-transparent flex flex-col w-full p-4 md:p-8">
        {/* Header Block */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#00F0FF]/20 via-[#C9F31D]/20 to-purple-600/20 border border-[#00F0FF]/30 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                🌐
              </div>
              <div>
                <div className="font-['Rajdhani'] text-3xl md:text-4xl font-bold tracking-[2px] text-[var(--text)] uppercase">
                  World Business <span className="text-[#00F0FF]">Intelligence</span>
                </div>
                <div className="text-[12px] text-[var(--muted)] tracking-[2px] -mt-1 uppercase font-medium">
                  3,000,000 Audited Transactions &bull; $18.72B GMV &bull; 50 Sovereign Markets
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded-full text-[#00F0FF] font-medium text-xs font-mono">
                <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse shadow-[0_0_8px_#00F0FF]"></div>
                LIVE 3M DATASET
              </div>

              <a
                href="/Dashboard/world-business-dashboard.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--text)] transition-colors"
              >
                <span>Fullscreen App</span>
                <span className="text-xs">↗</span>
              </a>

              <Link
                href="/dashboards"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              >
                &larr; All Dashboards
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Iframe Viewport */}
        <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-[0_0_50px_rgba(0,0,0,0.6)] bg-[#06080F]">
          <iframe
            src="/Dashboard/world-business-dashboard.html"
            className="w-full"
            style={{ height: '1450px', border: 'none', display: 'block' }}
            title="World Business Intelligence 3M Dashboard"
            allowFullScreen
          />
        </div>

        {/* Case Study Technical Breakdown */}
        <section className="mt-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-10 max-w-6xl" style={{ borderLeft: '4px solid #00F0FF' }}>
          <h2 className="text-2xl md:text-3xl font-bold font-['Rajdhani'] mb-6 tracking-wider text-[var(--text)] uppercase flex items-center gap-3">
            <span>Technical Deep Dive:</span>
            <span className="text-[#00F0FF]">3-Million Record Analytics Architecture</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[var(--muted)] leading-relaxed">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>// 01</span> Executive Scope & Scale
                </h3>
                <p>
                  This enterprise analytics platform ingests and models <strong>3,000,000 real-world corporate transactions</strong> totaling <strong>$18.72 Billion in gross merchandise value (GMV)</strong> and <strong>$6.55 Billion in net operating profit (35.01% margin)</strong> across 50 sovereign countries spanning 2022 to 2026. Designed for executive oversight, it surfaces macroeconomic trends, continental market penetration, product category velocity, and payment settlement integrity.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>// 02</span> Ingestion Engine & Columnar Optimization
                </h3>
                <p>
                  Handling raw transaction datasets exceeding 1.3 Gigabytes on web clients causes severe browser thread locks. To achieve sub-100ms render speeds without sacrificing data fidelity, an ETL pipeline powered by <strong>DuckDB columnar vectorization</strong> executes aggregations across 60 monthly intervals, 6 continents, 50 nations, 15 industries, and 9 product sectors. The aggregated cache delivers instantaneous multi-dimensional cross-filtering.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>// 03</span> Dimensional Modeling & KPI Matrix
                </h3>
                <p>
                  The underlying schema organizes transactions into high-density analytical dimensions:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs font-mono text-[var(--text)]">
                  <li><strong>Geographic:</strong> 6 Continents, 50 Countries (Asia: $7.48B, Europe: $5.62B).</li>
                  <li><strong>Temporal:</strong> 60 consecutive months, MoM velocity & seasonal variance.</li>
                  <li><strong>Commercial:</strong> 15 B2B/B2C Industry verticals, 9 Categories, Top 20 SKUs.</li>
                  <li><strong>Financial:</strong> Currency parity (USD, EUR, INR), AOV ($6,240.15), Profit margins.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>// 04</span> Front-End Cockpit & Interaction Design
                </h3>
                <p>
                  Built with responsive vector graphics using <strong>Chart.js 4.4</strong>, the dashboard features glassmorphism styling, curated neon visual hierarchies, dynamic multi-currency conversions (USD, EUR, INR), and full keyboard/touch ergonomics. Interactive pill ribbons allow stakeholders to drill down by Year, Continent, Industry, and Category simultaneously without full-page reloads.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>// 05</span> Audited Transaction Ledger
                </h3>
                <p>
                  Complementing macroeconomic summaries, an embedded <strong>Audited Ledger</strong> provides live searchability and sorting across 1,000 representative records. Stakeholders can inspect granular transaction slips—reviewing discount thresholds, shipping carriers, warehouse nodes, client satisfaction (CSAT) scores, and payment gateways in real time.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>// 06</span> Operational SLA & Payment Diagnostics
                </h3>
                <p>
                  Beyond top-line revenue, the engine monitors settlement health: maintaining a <strong>96.01% payment success rate</strong> across credit cards, digital wallets, bank transfers, and crypto rails, while identifying high-risk failure patterns to safeguard working capital.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
