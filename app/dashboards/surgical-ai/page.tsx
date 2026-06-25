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
              <div className="w-12 h-12 bg-gradient-to-br from-[#6ee7ff] to-[#7c5cff] rounded-xl flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(110,231,255,0.2)]">⚡</div>
              <div>
                <h1 className="font-['Rajdhani'] text-3xl font-bold tracking-[2px] text-[var(--text)] uppercase">Surgical <span className="text-[#6ee7ff]">AI</span></h1>
                <div className="text-[11px] text-[var(--muted)] tracking-[2px] -mt-1 uppercase font-medium">Interactive Prototype: Enterprise Workflow Intelligence</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-[#3df7b8]/10 border border-[#3df7b8]/20 rounded-full text-[#3df7b8] font-medium text-xs">
                 <div className="w-1.5 h-1.5 bg-[#3df7b8] rounded-full animate-pulse shadow-[0_0_6px_#3df7b8]"></div>
                 SYSTEM STABLE
               </div>
            </div>
          </div>
        </header>

        {/* The Dashboard iframe cleanly embedded as a content block */}
        <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-[var(--surface)]">
          <iframe
            src="/Dashboard/surgical-ai-workspace.html"
            className="w-full"
            style={{ height: '1100px', border: 'none', display: 'block' }}
            title="Surgical AI Workspace Dashboard"
            allowFullScreen
          />
        </div>

        {/* Case Study Technical Breakdown */}
        <section className="mt-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 max-w-5xl" style={{ borderLeft: '4px solid #6ee7ff' }}>
          <h2 className="text-2xl font-bold font-['Rajdhani'] mb-6 tracking-wider text-[var(--text)] uppercase">Technical Case Study: Surgical AI Workspace Telemetry</h2>
          
          <div className="space-y-6 text-sm text-[var(--muted)] leading-relaxed">
            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">1. Executive Summary & Objective</h3>
              <p>
                As corporate agentic workflows scale, managing token overhead, request latencies, and execution costs becomes a central engineering challenge. This dashboard acts as a live monitoring console for the Surgical AI orchestration engine, tracking execution success rates, active context usage, and direct token consumption curves. By organizing these telemetry metrics in a single interface, operations managers can identify pipeline inefficiencies and refine system prompt profiles.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">2. Architecture & Multi-Node Orchestration</h3>
              <p>
                The underlying architecture is built around decoupled LLM execution blocks (Intent Mapping, Prompt Hardening, Node Execution, output Validation). The telemetry dashboard queries live logs stored in PostgreSQL via a Redis caching layer to avoid querying transaction logs directly. This separation keeps dashboard latency under 80ms while rendering live streaming updates from regional execution nodes.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">3. Visual Interface & Telemetry UX</h3>
              <p>
                The interface features real-time statistics (such as overall run success rate, total tokens processed, current cost margins, and active session counts). Underneath these cards, interactive time-series charts track CPU and memory load of the AI host server, while the bottom section renders active execution step states. This visual hierarchy guides developers straight to failing nodes or runaway processes.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-[var(--text)] uppercase tracking-wider mb-2">4. Context Optimization & Cost Control</h3>
              <p>
                A core feature tracked by the dashboard is Context Compression efficiency. Large prompts are programmatically pruned to remove conversational padding and repetitive logs before reaching LLM API endpoints. By visualizing compressed vs raw token counts, developers can verify that their prompt schemas are optimal, leading to direct savings in operational API bills.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
