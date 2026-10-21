export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'AI Workflow' | 'LinkedIn Authority' | 'SEO Infrastructure';
  /** Source-managed HTML, never user input. */
  content: string;
  associatedBlueprint?: string;
  associatedTool: string;
  readingTime: string;
  operatorNote?: string;
}

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'ai-context-opt-guide',
    slug: 'optimizing-ai-context-windows',
    title: 'Optimizing AI Context Windows: A Testable Workflow',
    description: 'Build a focused context packet for a code change, preserve critical constraints, and test compressed prompts against an acceptance checklist.',
    category: 'AI Workflow',
    associatedBlueprint: 'token-saving-system-prompt',
    associatedTool: '/tools/context-optimizer',
    readingTime: '5 min',
    content: `
      <p>A coding assistant needs the information that changes its next decision. Sending an entire repository can bury that information; removing too much can make the task impossible. This guide builds a context packet for one task: adding an optional purchase-order reference to an invoice API without breaking existing clients. The example is illustrative, not a report of measured model performance.</p>
      <h2>Define the protected constraints</h2>
      <p>Before shortening the input, write the acceptance criteria. For the invoice example, the new field accepts at most 40 characters, remains nullable in storage, and follows the existing response serialization contract. Existing requests without the field must still succeed. A migration must follow the repository's conventions. These are protected constraints: preserve their exact meaning through every revision.</p>
      <p>A compact prompt that drops backward compatibility is worse than a longer one that preserves it. Record unresolved behavior as a question to investigate. Do not replace an unknown with a plausible guess merely to shorten the conversation.</p>
      <h2>Gather a traceable evidence packet</h2>
      <p>Start with the request validator, invoice model, response serializer, and nearest relevant test. Include file paths and function names so the assistant can request more context precisely. Include the complete relevant function when a fragment would hide control flow or error handling. Add local repository instructions and the installed framework version.</p>
      <ul><li><strong>Task:</strong> the desired change and its reason.</li><li><strong>Contract:</strong> old and new request examples.</li><li><strong>Evidence:</strong> selected source excerpts with their paths.</li><li><strong>Constraints:</strong> compatibility, security, naming, and migration rules.</li><li><strong>Verification:</strong> observable outcomes that establish success.</li></ul>
      <p>Exclude unrelated generated files, dependency lockfiles, and old logs that do not concern the request. Remove credentials before sending source to an external service. If the change crosses an authorization boundary, retain that boundary even when it makes the packet larger.</p>
      <h2>Compress repetition before meaning</h2>
      <p>Replace repeated instructions with one clear rule. Summarize the investigation as a decision log: what was tried, what failed, and what remains unresolved. Preserve error messages verbatim when exact wording matters. Keep identifiers unchanged so references remain searchable.</p>
      <p>For example: “Add optional purchaseOrderRef to invoice creation. Preserve requests that omit it. Inspect the validator, model, serializer, and creation tests. Verify null, valid string, and overlength input. Follow existing migration conventions.” This replaces a rambling request while retaining its important checks. It does not substitute for the source files.</p>
      <p>Avoid mechanically abbreviating every word. Tokenization depends on the model; fewer characters do not always mean fewer tokens. Dense shorthand can introduce ambiguity. Measure size with the provider's tokenizer or actual request usage, and retain readable domain terms unless a shared abbreviation already exists.</p>
      <h2>Reserve room for tool results and the answer</h2>
      <p>A context window is a capacity limit, not a guarantee that every included fact will be used correctly. Input, output, and other token budgets vary by model and API. Check the documentation for the model you actually call. Leave room for retrieved files, tool responses, and the planned answer instead of filling the entire window with source material.</p>
      <p>If the task still exceeds that capacity, divide it by responsibility: inspect the API contract, plan storage changes, then implement and verify. Carry forward a decision record and exact constraints between stages. Do not assume an earlier conversation will remain available indefinitely.</p>
      <h2>Compare against a baseline</h2>
      <p>Run the original and compact packets against the same representative tasks with the same model settings. Record input tokens, output tokens, latency, missed constraints, and whether the proposed changes pass relevant tests. Repeat the comparison when results vary. One successful response does not establish reliability.</p>
      <p>For this example, check that an old client can omit the field, a valid reference round-trips, an overlength value is rejected, and the migration follows project conventions. If compression causes a missed requirement, restore the relevant evidence before removing more text. Do not claim cost savings or improved accuracy without measurements.</p>
      <h2>Recover from missing context</h2>
      <p>If the assistant invents a helper, provide its real interface. If it changes unrelated behavior, restate the boundary and include the affected test. If it repeats a failed approach, add the failure to the decision log. If essential details keep disappearing, use a larger evidence packet or a smaller task. Compression is an engineering tradeoff, not a guarantee of reasoning quality.</p>
      <p>Next, use the context optimizer as an editing aid and compare its result against your protected constraints. Verify tokens and behavior in the actual integration; shorter text alone does not prove preserved meaning.</p>
    `,
  },
  {
    id: 'li-authority-storytelling',
    slug: 'technical-storytelling-for-founders',
    title: 'Technical Storytelling: Explain an Engineering Decision',
    description: 'Use an evidence ledger, a worked migration example, and a publication checklist to explain an engineering decision without inventing results.',
    category: 'LinkedIn Authority',
    associatedBlueprint: 'founder-authority-system',
    associatedTool: '/tools/linkedin-formatter',
    readingTime: '4 min',
    content: `
      <p>An engineering update helps another builder understand a problem, assess a decision, and recognize when the same approach would fail. A dramatic hook or an unsupported percentage cannot supply that explanation. This workflow turns an invoice migration into a professional post. All project details below are illustrative; they must not be presented as a real client engagement.</p>
      <h2>Choose one reader and one decision</h2>
      <p>Choose a reader, such as a backend engineer introducing a field into an existing API. Then choose the decision: deploy a nullable schema change first, or require every client to upgrade together. A narrow decision gives the post a useful boundary. Covering databases, hiring, leadership, and product strategy in one update usually removes the detail that makes any of them useful.</p>
      <p>Write the intended takeaway before drafting the opening: “An additive field can preserve existing requests, but the rollout still needs validation and rollback planning.” Check every paragraph against that takeaway. Remove details that neither explain the mechanism nor help a reader assess its limits.</p>
      <h2>Build an evidence ledger</h2>
      <p>Separate observations, inferences, and aspirations. An observation might be a passing compatibility test or a migration diff. An inference might be that fewer client changes reduce coordination work. Lower incident risk may be an aspiration until the rollout has been observed. Use wording that reflects the strength of the evidence.</p>
      <ul><li><strong>Claim:</strong> old requests remain accepted.</li><li><strong>Evidence:</strong> the old request fixture passes against the new handler.</li><li><strong>Scope:</strong> the fixture covers creation, not every downstream export.</li><li><strong>Permission:</strong> the schema and fixture are approved for public sharing.</li></ul>
      <p>For each metric, retain its definition, comparison period, sample size, and source. A speed claim needs a workload and measurement method. If reliable measurements do not exist, describe the implementation and label expected benefits as expectations. Do not create a percentage to make the story sound more impressive.</p>
      <h2>A worked before-and-after draft</h2>
      <p><strong>Weak draft:</strong> “We transformed our invoice platform with a revolutionary migration that made everything faster.” A reader cannot identify the change, the constraint, or what was measured.</p>
      <p><strong>Useful illustrative draft:</strong> “Adding a purchase-order reference looked like a small API change. The constraint was older clients: they still send invoices without that field. The proposed rollout adds a nullable column, accepts an optional reference, and retains the old request fixture in the compatibility tests. Before release, we still need to check downstream exports and rollback behavior. The lesson is to test the old contract alongside the new feature.”</p>
      <p>This version explains a mechanism and a limitation. For a real post, replace hypothetical wording only with facts supported by the actual change. If the work belongs to a client, obtain permission or keep the example synthetic and clearly labelled.</p>
      <h2>Explain a credible alternative</h2>
      <p>Requiring the field immediately simplifies validation but breaks callers that have not upgraded. Making it optional preserves those callers but requires downstream code to handle missing values. The right choice depends on the contract and rollout constraints. Showing this tradeoff lets readers adapt the lesson instead of copying a conclusion without its context.</p>
      <p>For an AI-related story, distinguish output validation from factual correctness. A schema can reject malformed output while allowing an incorrect value. Explain what tests and people checked rather than describing generated results as automatically reliable.</p>
      <h2>Edit the presentation</h2>
      <p>Use short paragraphs and a small number of concrete details. Keep identifiers only when they help explain the mechanism. Explain a specialist term on first use. A diagram can show deployment order, but the main conclusion should also be available as text.</p>
      <p>Preview line breaks, links, image descriptions, and code in the publishing interface. A formatting tool changes presentation; it cannot establish originality, technical accuracy, or likely reach. No spacing pattern guarantees engagement.</p>
      <h2>Check before publishing</h2>
      <ul><li>Can the reader identify the original problem and the change?</li><li>Does every factual result have evidence and a defined scope?</li><li>Are examples, estimates, and measurements labelled accurately?</li><li>Have credentials, personal information, and confidential diagrams been removed?</li><li>Does the post explain one limitation or rejected alternative?</li><li>Does its resource link work and expand the explanation?</li></ul>
      <p>After publishing, correct errors openly and update longer references when implementation details change. Evaluate whether readers understood the decision, as well as engagement. Questions about omitted constraints are useful feedback for the next revision.</p>
      <p>Further practice: the <a href="https://developers.google.com/tech-writing/one">Google Technical Writing One course</a> covers audience, terminology, paragraphs, and clarity. Use it to review the explanation itself; it does not establish social-platform ranking rules.</p>
    `,
  },
];
