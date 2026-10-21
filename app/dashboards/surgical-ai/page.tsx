import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Surgical AI Dashboard — Enterprise Workflow Intelligence Prototype | Datta Sable',
  description:
    'Interactive enterprise AI workflow intelligence dashboard. Explore AI-powered process automation, operational metrics, real-time system monitoring, and intelligent workflow orchestration in this live prototype.',
  keywords: ['AI workflow dashboard', 'enterprise AI analytics', 'workflow intelligence', 'AI operations dashboard', 'process automation BI', 'enterprise AI prototype'],
  alternates: { canonical: 'https://dattasable.com/dashboards/surgical-ai' },
  openGraph: {
    title: 'Surgical AI Dashboard — Enterprise Workflow Intelligence Prototype',
    description: 'Live interactive prototype: AI-powered enterprise workflow intelligence with real-time operational metrics and automation tracking.',
    url: 'https://dattasable.com/dashboards/surgical-ai',
    siteName: 'Datta Sable',
    type: 'website',
  },
};

export default function SurgicalAIDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-['Exo_2'] flex flex-col">
      <Navbar />
      
      <div className="boxed-wrapper !max-w-[1440px] !mt-24 !mx-auto !min-h-screen border-none shadow-none bg-transparent flex flex-col w-full p-4 md:p-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--surface2)] rounded-xl flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(110,231,255,0.2)]">⚡</div>
              <div>
                <h1 className="font-['Rajdhani'] text-3xl font-bold tracking-[2px] text-[var(--text)] uppercase">Surgical <span className="text-[var(--accent)]">AI</span></h1>
                <div className="text-[11px] text-[var(--muted)] tracking-[2px] -mt-1 uppercase font-medium">Interactive Prototype: Enterprise Workflow Intelligence</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-[#3df7b8]/10 border border-[#3df7b8]/20 rounded-full text-[#3df7b8] font-medium text-xs font-mono">
                 <div className="w-1.5 h-1.5 bg-[#3df7b8] rounded-full animate-pulse shadow-[0_0_6px_#3df7b8]"></div>
                 SIMULATED DEMO
               </div>
               <a
                 href="/Dashboard/surgical-ai-workspace.html"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 px-3.5 py-1.5 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-full text-xs font-semibold text-[var(--text)] transition-colors"
               >
                 <span>Fullscreen App</span>
                 <span className="text-xs">↗</span>
               </a>
            </div>
          </div>
        </header>

        {/* The Dashboard iframe cleanly embedded as a content block */}
        <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-[var(--surface)]">
          <iframe
            src="/Dashboard/surgical-ai-workspace.html"
            className="w-full"
            style={{ height: '1250px', border: 'none', display: 'block' }}
            title="Surgical AI Workspace Dashboard"
            allowFullScreen
          />
        </div>

        {/* Case Study Technical Breakdown */}
        <section className="mt-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 max-w-5xl" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h2 className="text-2xl font-bold font-['Rajdhani'] mb-6 tracking-wider text-[var(--text)] uppercase">Technical Case Study: Surgical AI Workspace Telemetry</h2>
          
          <div className="space-y-6 text-sm text-[var(--muted)] leading-relaxed">
            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">1. Executive Summary & Objective</h3>
              <p>This is an interface prototype for discussing AI workflow monitoring. Values and activity are simulated in the browser. The screen is not evidence of live model execution, production uptime, factual accuracy, or customer cost savings. Use it to examine information hierarchy and monitoring requirements.</p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">2. Architecture & Multi-Node Orchestration</h3>
              <p>The embedded local HTML file generates demonstration metrics. It does not establish a live PostgreSQL and Redis telemetry service or a measured latency target. A production monitoring system would need durable run identifiers, actual tool and model usage records, error classification, access controls, and a clear retention policy.</p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">3. Visual Interface & Telemetry UX</h3>
              <p>When evaluating a monitoring interface, distinguish a successful request from a correct answer. A completed model call can still contain an unsupported claim. Show unresolved runs and validation failures separately from transport errors. Make timestamps and the measurement window visible so a reader can tell whether a chart is current.</p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">4. Context Optimization & Cost Control</h3>
              <p>For an illustrative cost review, retain input and output usage from the provider and apply the actual model price for the relevant billing period. Compare a compressed prompt with a baseline on the same tasks. Lower token use is useful only if the required behavior survives; this prototype does not measure that tradeoff.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
