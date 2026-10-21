import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AI Workflows and Agent Loops: A Decision Guide | Datta Sable',
  description: 'Compare fixed workflows and model-directed agent loops using task boundaries, failure recovery, cost controls, and a worked invoice example.',
  alternates: { canonical: 'https://dattasable.com/knowledge/comparisons' },
  robots: { index: false, follow: true },
};

const comparisons = [
  ['Control flow', 'Application code chooses the next step.', 'The model chooses its next action within tool and policy boundaries.'],
  ['Good starting task', 'A repeatable process with known inputs and checks.', 'An investigation where the next useful step depends on new evidence.'],
  ['Failure recovery', 'Retry or resume a named step with recorded state.', 'Record actions, limit retries, and detect repeated or unproductive actions.'],
  ['Budget control', 'Set limits per stage and across the complete run.', 'Set tool-call, token, time, and spending limits across the loop.'],
  ['Important limitation', 'A fixed path can miss an unexpected case.', 'Flexible exploration can increase variability and operational cost.'],
];

export default function ComparisonsPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="boxed-wrapper pt-32 pb-24">
        <article className="container max-w-4xl space-y-8 leading-relaxed">
          <div className="label-tech">Engineering decision guide</div>
          <h1 className="text-4xl font-bold">Fixed AI workflows or agent loops?</h1>
          <p>A workflow follows a path chosen by application code. An agent loop lets a model choose actions based on the current state. Both can use the same language model and tools. Neither architecture guarantees correct results. Choose the amount of flexibility the task requires, then validate the system against representative inputs.</p>
          <h2 className="text-2xl font-bold">Compare the operational tradeoffs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <caption className="text-left mb-4">Design considerations, not measured performance benchmarks.</caption>
              <thead><tr>{['Criterion', 'Fixed workflow', 'Agent loop'].map(label => <th key={label} scope="col" className="p-4 border border-[var(--border)]">{label}</th>)}</tr></thead>
              <tbody>{comparisons.map(([label, workflow, agent]) => <tr key={label}><th scope="row" className="p-4 border border-[var(--border)]">{label}</th><td className="p-4 border border-[var(--border)]">{workflow}</td><td className="p-4 border border-[var(--border)]">{agent}</td></tr>)}</tbody>
            </table>
          </div>
          <h2 className="text-2xl font-bold">Worked example: invoice extraction</h2>
          <p>Suppose a system receives an invoice and must extract supplier, currency, date, and total. A fixed workflow can parse the file, request structured extraction, validate field types, compare totals, and route exceptions to a person. If the currency is missing, the system should record an exception instead of silently guessing it from the supplier name. This example describes a proposed design, not a deployed client result.</p>
          <p>Now suppose the task is investigating why a supplier's totals changed over several months. The next action may depend on previous findings: inspect line items, check a contract, or compare exchange-rate assumptions. A bounded agent loop may fit this investigation better. It should cite the evidence used for each conclusion, stop when evidence is insufficient, and request approval before sending messages or modifying financial records.</p>
          <h2 className="text-2xl font-bold">Use a hybrid when the boundaries differ</h2>
          <p>The outer workflow can enforce permissions, budgets, and final validation while an inner agent investigates one exception. For example, the agent may inspect an approved set of read-only documents and propose a reason for the discrepancy. Application code still decides whether required evidence exists and routes the proposal for review. Tool access should match the task; exploration does not require unrestricted write access.</p>
          <p>Record intermediate state in either design. Keep the original input, tool results, validation errors, and final decision linked to the same run. Retries must not create duplicate invoices or repeat a paid action. Use an idempotency strategy at the application boundary instead of relying on a model to remember whether an action has already occurred.</p>
          <h2 className="text-2xl font-bold">Test the choice before expanding it</h2>
          <p>Build a small evaluation set with normal invoices, missing fields, conflicting totals, duplicate submissions, and text that attempts to override the extraction instructions. Define the expected behavior for each case before running either design. Compare task completion, unsupported conclusions, human-review frequency, latency, and total resource use. Inspect failures individually; an average score can hide a serious permission error.</p>
          <p>Set an explicit stopping rule for the loop, such as a maximum number of actions and a requirement to return an unresolved status when evidence remains missing. For the fixed workflow, define what happens when a stage fails. Both systems need tests for timeouts, unavailable tools, malformed responses, and recovery after interruption.</p>
          <h2 className="text-2xl font-bold">What validation does and does not establish</h2>
          <p>A valid JSON response establishes structure, not truth. A supplier total can have the correct numeric type and still be wrong. Likewise, a fixed sequence does not make model output deterministic. Use source checks, calculations, and human review where the consequences require them. Claims that one architecture is always faster or more reliable need a defined workload and reproducible measurements.</p>
          <p>Start with the smallest design that handles the task. Add model-directed exploration only where the evaluation shows a useful gain. Keep a record of the tradeoff so future maintainers understand why that flexibility exists.</p>
          <p>Further reading: <a className="underline" href="https://www.anthropic.com/research/building-effective-agents">Anthropic's explanation of workflows and agents</a> gives the architectural distinction and discusses when additional complexity is useful. The invoice scenario and its verification checklist above are illustrative applications of that distinction.</p>
          <p>Continue with the <Link href="/knowledge/optimizing-ai-context-windows" className="underline">context-packet workflow</Link> to prepare task evidence, or the <Link href="/knowledge/rfc/002-execution-chains" className="underline">execution-chain reference</Link> for the site's internal design notes.</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
