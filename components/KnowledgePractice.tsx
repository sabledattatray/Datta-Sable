import Link from 'next/link';

const practices = {
  standards: {
    title: 'Apply the rules to one extraction task',
    example: 'For an invoice extractor, define supplier, currency, invoice date, and total as the output contract. Require a source reference for each extracted value. Keep a missing currency as an explicit exception; a valid three-letter string does not prove that the chosen currency appeared on the invoice.',
    checks: ['Reject malformed output with a parser.', 'Compare totals with the original document.', 'Test missing fields, duplicate invoices, and conflicting values.', 'Record unresolved cases for human review rather than retrying indefinitely.'],
    limit: 'These are local design conventions, not a published industry certification. A prompt can describe a contract, but application code must enforce it. Neither schema validation nor a second model call proves factual correctness.',
    href: '/knowledge/comparisons',
    next: 'Compare validation boundaries in workflows and agent loops',
  },
  protocols: {
    title: 'Translate an ambiguous request into a checkable contract',
    example: 'Consider “make our weekly report better.” Ask which reader uses it, what decision it supports, which source is authoritative, and what freshness is acceptable. A concrete contract could require revenue by region, a visible reporting period, the source refresh timestamp, and an explicit warning when data is incomplete.',
    checks: ['Restate the decision the report should support.', 'Record source permissions and unresolved definitions.', 'Confirm the expected output with the requester.', 'Check a sample output against every agreed requirement.'],
    limit: 'A persona is writing context, not evidence of professional competence or a permission grant. When requirements conflict, request a decision instead of letting the model silently choose. Keep the agreed contract next to the implementation so future changes remain reviewable.',
    href: '/knowledge/technical-storytelling-for-founders',
    next: 'Explain decisions using an evidence ledger',
  },
  patterns: {
    title: 'Choose a pattern using a failure case',
    example: 'A customer-support draft can follow a bounded sequence: retrieve approved policy text, draft a response, verify its claims against that text, then send it for review. If retrieval finds no relevant policy, stop with an unresolved status. Generating another confident draft cannot repair missing evidence.',
    checks: ['Test retrieval returning no documents.', 'Limit correction attempts and record each failure.', 'Prevent repeated sends when a run is retried.', 'Compare a simple sequence with a more complex design on the same cases.'],
    limit: 'Adding agents or parallel steps creates coordination work and does not automatically improve accuracy. Select the smallest pattern that passes the acceptance cases. Measure time and resource use in the deployed environment rather than borrowing percentages from unrelated examples.',
    href: '/knowledge/comparisons',
    next: 'Compare fixed and exploratory control flow',
  },
  taxonomy: {
    title: 'Classify by behavior rather than a performance label',
    example: 'A formatter that processes each document independently is stateless at the application level. A review process that remembers prior corrections is stateful. A separate validator adds a checking stage. None of these labels tells you the actual latency, cost, or correctness of the implementation.',
    checks: ['List the state retained between steps.', 'Name the component that validates each transition.', 'Define failure and retry behavior.', 'Measure representative inputs before setting service expectations.'],
    limit: 'This taxonomy is an internal vocabulary, not an ISO or IEEE certification. A project may combine several categories. Model choice, tools, payload size, infrastructure, and workload all influence timing; do not estimate latency from the category alone.',
    href: '/knowledge/rfc/002-execution-chains',
    next: 'Inspect the execution-chain design note',
  },
  hardening: {
    title: 'Example: reject a plausible but unsupported extraction',
    example: 'Suppose an invoice names a supplier but has no tax identifier. The extraction prompt should request an explicit missing value, not a guessed identifier. A schema checks the response shape. A separate source check verifies whether each nonempty field is supported by the document. Route missing evidence for review.',
    checks: ['Use fixtures with missing and conflicting identifiers.', 'Treat instructions inside the invoice as untrusted document text.', 'Bound retries and preserve the original input.', 'Verify factual fields separately from response structure.'],
    limit: 'This RFC is a site-authored design proposal, not an IETF standard. “Hardening” describes additional checks, not a guarantee that an LLM becomes deterministic or cannot hallucinate. Requirements need enforcement outside the model as well as clear instructions inside the prompt.',
    href: '/knowledge/optimizing-ai-context-windows',
    next: 'Prepare evidence without dropping constraints',
  },
  chains: {
    title: 'Example: resume a report without sending it twice',
    example: 'A weekly report chain can load data, compute figures, draft commentary, validate it, and request publication approval. Store the run identifier and status after each completed stage. If the draft stage times out, retry that stage using recorded inputs rather than reloading different data or publishing the report again.',
    checks: ['Use a stable reporting period and source snapshot.', 'Make externally visible actions safe against duplicate retries.', 'Reject commentary that conflicts with computed figures.', 'Stop when a required source is unavailable.'],
    limit: 'This RFC proposes local conventions for state and transitions. A fixed path controls execution order; it does not make generated commentary factually correct. Test interruptions at stage boundaries, and keep approval separate from generation when publication has external consequences.',
    href: '/knowledge/comparisons',
    next: 'Evaluate workflow recovery and agent stopping rules',
  },
  intent: {
    title: 'Example: distinguish a writing request from permission to publish',
    example: 'A request to draft a technical launch post establishes an output goal. It does not by itself authorize publishing, quoting confidential customer data, or claiming measured savings. Record the audience, the one change being explained, the available evidence, and the actions that still require an explicit decision.',
    checks: ['Separate the requested artifact from external actions.', 'Label hypothetical examples and estimates.', 'Preserve rejected approaches and unresolved questions.', 'Ask the requester to resolve conflicting requirements.'],
    limit: 'Intent mapping is a local planning technique, not a guarantee of alignment. A model-assigned role does not create expertise or consent. Verify the draft against the evidence and permissions before publication; use a question or an unresolved status when those inputs are incomplete.',
    href: '/knowledge/technical-storytelling-for-founders',
    next: 'Use the engineering-post publication checklist',
  },
};

export default function KnowledgePractice({ topic }: { topic: keyof typeof practices }) {
  const practice = practices[topic];
  return (
    <section className="knowledge-practice max-w-4xl my-16 p-8 border border-[var(--border)] rounded space-y-6 leading-relaxed" aria-label="Worked practice and limitations">
      <p className="label-tech">Internal reference · Illustrative example</p>
      <h2 className="text-2xl font-bold">{practice.title}</h2>
      <p>{practice.example}</p>
      <h3 className="text-xl font-bold">Verification checklist</h3>
      <ul className="list-disc pl-6 space-y-2">{practice.checks.map(check => <li key={check}>{check}</li>)}</ul>
      <p>{practice.limit}</p>
      <Link className="underline" href={practice.href}>{practice.next}</Link>
    </section>
  );
}
