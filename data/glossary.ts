export interface GlossaryTerm {
  id: string;
  slug: string;
  term: string;
  definition: string;
  category: 'AI' | 'Data' | 'Workflow' | 'SEO';
  operatorsPerspective: string;
  founderNote: string;
  technicalApplication: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'g-semantic-compression',
    slug: 'semantic-compression',
    term: 'Semantic Compression',
    definition: 'The technical process of reducing prompt token count while preserving core logical meaning. Critical for optimizing Large Language Model (LLM) context windows.',
    category: 'AI',
    operatorsPerspective: 'In high-throughput agentic workflows, every token represents direct computational cost and latency. Semantic compression is the practice of stripping natural language redundancy down to symbolic, structural instructions. An operator must design prompts that instruct the LLM using key concepts and abbreviation mapping. When done right, it results in cleaner, faster reasoning passes without losing context.',
    founderNote: 'Preserve the original prompt and compare a compressed version against the same labelled examples. Record token usage and missed constraints before drawing conclusions about cost or quality.',
    technicalApplication: 'Utilize symbol shorthand (e.g., using \'fn\' for function, \'args\' for arguments) and eliminate grammatical filler words (articles, auxiliary verbs) in system messages. Map a data structure key-value schema rather than writing conversational explanations.'
  },
  {
    id: 'g-operator-intent',
    slug: 'operator-intent-mapping',
    term: 'Operator Intent Mapping',
    definition: 'A framework for aligning AI system outputs with professional technical personas to ensure execution fidelity and brand consistency.',
    category: 'Workflow',
    operatorsPerspective: 'Intent mapping bridges the gap between raw LLM capacity and specific business requirements. Without precise intent alignment, models default to generic, conversational text. By mapping the exact constraints, inputs, and desired tone to a concrete technical persona, developers can control the output variance and ensure consistent integration into automated downstream tools.',
    founderNote: 'A consistent role description can clarify the task, but it does not replace verification. Check outputs against the actual requirements and retain human review where needed.',
    technicalApplication: 'Define a schema of strict rules, banned phrases, and formatting rules. Inject this schema as a context boundary at the top of the LLM configuration, and use system variables to dynamically select the active persona.'
  },
  {
    id: 'g-token-density',
    slug: 'token-density-optimization',
    term: 'Token Density',
    definition: 'The measurement of information per token in a system prompt. High density reduces costs and increases reasoning accuracy.',
    category: 'AI',
    operatorsPerspective: 'A shorter prompt can remove repetition, but compression can also erase constraints. Token counts depend on the model tokenizer. Compare request usage and task results rather than assuming a dense prompt improves recall or accuracy.',
    founderNote: 'Think of token density as writing code. You wouldn\'t write a 100-line function when a 10-line function is cleaner and faster. Treat your system instructions with the same discipline.',
    technicalApplication: 'Perform a prompt cleanup pass: replace wordy descriptions with bulleted lists, use structured JSON configurations for dynamic inputs, and leverage mathematical notation for logical rules.'
  },
  {
    id: 'g-prompt-chaining',
    slug: 'prompt-chaining-architecture',
    term: 'Prompt Chaining',
    definition: 'A surgical workflow technique where the output of one AI model call is used as the input for the next to solve complex, multi-step tasks.',
    category: 'Workflow',
    operatorsPerspective: 'Trying to make an LLM solve a complex, multi-stage task in a single prompt is a recipe for hallucinations. Prompt chaining decomposes a complex task into discrete, manageable steps. The first prompt generates an outline, the second fills in details, and the third performs quality checks. This modular architecture makes debugging and updates significantly easier.',
    founderNote: 'Try separating generation and verification when the task benefits from distinct checks. Measure failures at each stage; adding another model call does not itself establish reliability.',
    technicalApplication: 'Use orchestration tools like n8n or LangChain to design pipeline paths. Each node in the pipeline takes the output of the preceding node, parses it, and feeds it into the next LLM call with a specialized system prompt.'
  },
  {
    id: 'g-agentic-workflow',
    slug: 'agentic-workflow-engineering',
    term: 'Agentic Workflow',
    definition: 'A system architecture where AI models act as autonomous agents with specific roles, communication protocols, and tool-use capabilities.',
    category: 'AI',
    operatorsPerspective: 'Agentic workflows move beyond simple chat interfaces. By assigning a model a role (e.g., Researcher, Editor, Programmer) and giving it access to external tools (APIs, databases, web search), the system can autonomously execute complex loops of research, code generation, and testing until a final goal is achieved.',
    founderNote: 'Agentic workflows are the future of software development. Our team uses specialized subagents to handle routine testing and code inspection, letting human developers focus on architecture.',
    technicalApplication: 'Implement an agent loop that runs recursively. Define tools as JSON schemas that the model can request to execute, and use a router node to parse the model\'s tool requests, run the tools, and return results.'
  },
  {
    id: 'g-surgical-spacing',
    slug: 'surgical-spacing-method',
    term: 'Surgical Spacing',
    definition: 'The formatting technique of using double line breaks and minimalist characters to ensure high mobile readability for technical LinkedIn content.',
    category: 'Workflow',
    operatorsPerspective: 'Most technical writing on professional networks is ignored because it is presented in walls of text. Surgical spacing formats technical breakdowns to optimize readability on mobile screens. By inserting double line breaks, short punchy sentences, and precise bullet points, you structure the reading experience for high engagement and scanability.',
    founderNote: 'Preview paragraph breaks on a small screen and keep the explanation readable. Formatting changes presentation; audience growth depends on many factors and is not guaranteed.',
    technicalApplication: 'Limit paragraphs to a maximum of two sentences. Use a double line break between blocks, and utilize simple characters (e.g., *, -, or →) instead of heavy emojis to maintain a professional design aesthetic.'
  },
  {
    id: 'g-context-window',
    slug: 'llm-context-window-limits',
    term: 'Context Window',
    definition: 'The maximum amount of information (tokens) an AI model can process at one time before losing logical continuity or history.',
    category: 'AI',
    operatorsPerspective: 'The context window dictates the size of the operational environment for an LLM. While newer models feature massive context windows (up to millions of tokens), performance can degrade toward the center of the window (the "needle in a haystack" problem). Managing and minimizing context window usage is critical for latency and accuracy.',
    founderNote: 'Do not rely on huge context windows to cover lazy prompt design. Keep your context clean, and always prioritize the most relevant data closest to the end of your prompt structure.',
    technicalApplication: 'Implement sliding window buffers in your chat histories. Only pass the most recent N messages, and summarize older conversation history into a single dense context block before injecting it.'
  },
  {
    id: 'g-zero-shot-prompting',
    slug: 'zero-shot-prompting-execution',
    term: 'Zero-Shot Prompting',
    definition: 'Providing an AI model with a task description without any previous examples. Requires high-fidelity instruction mapping.',
    category: 'AI',
    operatorsPerspective: 'Zero-shot prompting tests the baseline understanding of an LLM. It is fast and cost-effective but requires extremely clear instruction design. If the task is complex, zero-shot prompts often produce inconsistent outputs, making them best suited for simple classification, summarization, or formatting tasks.',
    founderNote: 'If a zero-shot prompt fails in production, don\'t immediately jump to fine-tuning. Often, simply clarifying the logical steps or constraints within the prompt is enough to fix the issue.',
    technicalApplication: 'Write explicit instructions using Markdown headers (e.g., # System Rules, # Input Data). Specify the exact output schema format and add strict constraints to prevent the model from guessing.'
  },
  {
    id: 'g-few-shot-prompting',
    slug: 'few-shot-prompting-strategies',
    term: 'Few-Shot Prompting',
    definition: 'A method of providing a small set of examples to a model to guide its output style and logical constraints.',
    category: 'AI',
    operatorsPerspective: 'Few-shot prompting is one of the most reliable ways to control model output structure and tone. By showing the model 3 to 5 examples of ideal input-output pairs, you align its reasoning process with your expectations without having to run expensive training or fine-tuning workflows.',
    founderNote: 'We use few-shot prompting to teach our formatting tools the difference between casual writing and our specific technical voice. Showing works ten times better than explaining.',
    technicalApplication: 'Structure the prompt with alternating <example-input> and <example-output> tags. Ensure the examples represent diverse scenarios to avoid overfitting the model\'s output to a single template.'
  },
  {
    id: 'g-technical-authority',
    slug: 'technical-authority-signals',
    term: 'Technical Authority',
    definition: 'The collection of EEAT signals (Expertise, Experience, Authoritativeness, Trustworthiness) that establish professional domain dominance on LinkedIn and Search.',
    category: 'SEO',
    operatorsPerspective: 'Search engines and social platforms favor content written by domain experts. Building technical authority requires sharing real-world engineering experiences, showing detailed case-studies, and backing up assertions with data. It represents the transition from generic content generation to authentic technical knowledge sharing.',
    founderNote: 'Google\'s AdSense policies and search algorithms are designed to filter out generic content. True technical authority is your shield against these filters and your route to organic traffic.',
    technicalApplication: 'Write in-depth, experience-driven case studies. Link outbound to verified documentation, maintain clean schema markup (JSON-LD), and showcase author profile pages with professional credentials.'
  },
  {
    id: 'g-ai-hallucination',
    slug: 'ai-hallucination-risks',
    term: 'AI Hallucination',
    definition: 'The phenomenon where a Large Language Model generates information that is factually incorrect or logically inconsistent while maintaining a confident tone. Solved via Surgical Architecture.',
    category: 'AI',
    operatorsPerspective: 'Hallucination is a natural byproduct of how LLMs work—they predict the next most likely token based on probability, not verification. To eliminate hallucinations in production, you must build guardrails around the model: feeding it validated source documents (RAG), checking outputs with code compilers, or using multiple agents to review each other\'s work.',
    founderNote: 'Never trust an LLM to remember facts. Always retrieve the facts from a database or search engine first, and then instruct the LLM to write the response *only* using that retrieved context.',
    technicalApplication: 'Implement Retrieval-Augmented Generation (RAG). Add a system constraint: "If the provided context does not contain the answer, reply with \'I do not know\'. Do not make up information."'
  },
  {
    id: 'g-data-fidelity',
    slug: 'data-fidelity-benchmarks',
    term: 'Data Fidelity',
    definition: 'The degree of accuracy and consistency in a data set or AI output. High fidelity ensures that automated systems can be trusted for enterprise decision-making.',
    category: 'Data',
    operatorsPerspective: 'High data fidelity is critical when using AI outputs for databases or business analytics. If your pipeline outputs corrupted JSON, missing columns, or invalid data types, the downstream integration breaks. Maintaining high fidelity requires strict schema enforcement, data validation checks, and automatic retry loops.',
    founderNote: 'We built automated schema validation into our workflow pipelines. Any LLM response that fails to match the expected database structure is rejected and retried with a corrective error message.',
    technicalApplication: 'Leverage Zod schemas in TypeScript to validate JSON outputs returned by LLMs. Configure the API calls to use structured outputs or JSON Mode, and catch validation exceptions to trigger error-corrective loops.'
  },
  {
    id: 'g-n8n-workflow-automation',
    slug: 'n8n-workflow-orchestration',
    term: 'n8n',
    definition: 'A powerful, source-available workflow automation tool that allows for complex, multi-node technical orchestrations. Used for building the "Auto-Operator" infrastructure.',
    category: 'Workflow',
    operatorsPerspective: 'n8n is an exceptional platform for routing data between AI nodes, databases, and third-party APIs. Its node-based architecture allows you to write custom JavaScript, run conditional logic branches, and connect webhooks, making it the perfect orchestrator for executing autonomous agent systems.',
    founderNote: 'We migrated our entire marketing automation pipeline to n8n. It gave us the flexibility to inspect prompt steps and inject database variables at any stage of execution.',
    technicalApplication: 'Build custom workflows using the n8n visual editor. Set up cron triggers or webhook events, use the HTTP Request node to call LLM APIs, and use the Code node to parse and structure data payloads.'
  },
  {
    id: 'g-workflow-orchestration',
    slug: 'workflow-orchestration-logic',
    term: 'Workflow Orchestration',
    definition: 'The coordination of multiple automated tasks and AI agents into a single, cohesive system that executes professional-grade business logic without human intervention.',
    category: 'Workflow',
    operatorsPerspective: 'Orchestration manages the lifecycle of automated workflows. It handles scheduling, error recovery, data passing between tasks, and state management. Without proper orchestration, complex workflows are fragile and difficult to monitor, especially when dealing with rate-limited APIs or transient network errors.',
    founderNote: 'A workflow is only as strong as its orchestration layer. By implementing robust retry policies and real-time error logging, we turned fragile scripts into a reliable production engine.',
    technicalApplication: 'Set up logging and monitoring dashboards. Configure automatic retries with exponential backoff on all external API requests, and use state-saving databases to allow paused workflows to resume successfully.'
  }
];
