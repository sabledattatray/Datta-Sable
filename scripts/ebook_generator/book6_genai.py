# scripts/ebook_generator/book6_genai.py

BOOK_GENAI = {
    "slug": "production-genai-agents-rag-2026",
    "sku": "DS-EBOOK-AI-RAG-2026",
    "title": "Production GenAI & Multi-Agent Architecture: RAG & LLM Systems",
    "cover_title_formatted": "Production GenAI & <span>Multi-Agent Architecture</span>",
    "subtitle": "The definitive engineering handbook for building enterprise RAG pipelines, autonomous agentic state graphs, vector search retrieval, and production LLM observability.",
    "category_name": "AI & Productivity",
    "category_slug": "ai-productivity",
    "all_category_slugs": ["ai-productivity", "python-automation"],
    "features": ["22-page PDF", "2026 Edition", "Production LangGraph, RAG & Multi-Agent Systems"],
    "included_resources": ["22-page PDF handbook"],
    "seo_title": "Production GenAI & Multi-Agent Architecture | 2026 Edition",
    "seo_desc": "22-page Production GenAI and Multi-Agent Architecture handbook by Datta Sable. In-depth Advanced RAG, LangGraph state machines, pgvector, and LLM evaluation.",
    "pages": [
        # PAGE 2: Table of Contents & Production Architecture Blueprint
        {
            "badge": "Architecture Blueprint",
            "h1": "Table of Contents & GenAI System Blueprint",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">EXECUTIVE OVERVIEW</span>
              Transitioning generative AI from brittle chatbot prototypes to resilient enterprise production systems requires rigorous architecture. This manual establishes standards for hybrid RAG retrieval, multi-agent state machines, deterministic tool calling, and automated LLM guardrails.
            </div>

            <div class="diagram-box">
+--------------------+     +-------------------------------------------------+
| USER PROMPT & QUERY| --> |               SEMANTIC GUARDRAIL                |
+--------------------+     | (NeMo Guardrails / PII Redaction / Canary Check)|
                           +-------------------------------------------------+
                                                     |
                                                     v
+--------------------+     +-------------------------------------------------+
| KNOWLEDGE BASE     |     |            HYBRID RETRIEVAL (RAG)               |
| Enterprise Docs,   | --> | Dense Embeddings (Qdrant) + Sparse BM25         |
| PDFs, SQL Catalogs |     | Reciprocal Rank Fusion (RRF) & Cross-Encoder    |
+--------------------+     +-------------------------------------------------+
                                                     |
                                                     v
                           +-------------------------------------------------+
                           |            MULTI-AGENT STATE GRAPH              |
                           | Supervisor Router -> Specialized Worker Agents  |
                           | Tool Calling & Sandboxed Code Execution Engine  |
                           +-------------------------------------------------+
                                                     |
                                                     v
                           +-------------------------------------------------+
                           |       EVALUATION, OBSERVABILITY & OUTPUT        |
                           |   Ragas Faithfulness / LangSmith Tracing / Response
                           +-------------------------------------------------+
            </div>

            <h2>Comprehensive Chapter Guide</h2>
            <div class="grid-2">
              <div class="grid-card">
                <h3>Part I: Retrieval & Storage</h3>
                <p>• Ch 3: Foundation Model Trade-offs<br>
                • Ch 4: Advanced Hybrid RAG<br>
                • Ch 5: Document Chunking Tactics<br>
                • Ch 6: Vector Databases Compared<br>
                • Ch 7: Re-Ranking & RRF Fusion</p>
              </div>
              <div class="grid-card">
                <h3>Part II: Agentic Systems</h3>
                <p>• Ch 8: GraphRAG Knowledge Graphs<br>
                • Ch 9: Multi-Agent Topologies<br>
                • Ch 10: Sandboxed Tool Calling<br>
                • Ch 11: LangGraph vs Semantic Kernel<br>
                • Ch 12: Guardrails & Prompt Defense</p>
              </div>
            </div>
            <p><strong>Part III: Enterprise Operations:</strong> Ch 13 Ragas & Trulens Evaluation, Ch 14 Long-Term Memory Systems, Ch 15 Prompt & Semantic Caching, Ch 16 OpenTelemetry & Tracing, Ch 17 Fine-Tuning vs RAG, Ch 18 vLLM Serving Infrastructure, Ch 19 Regulatory Research Case Study, Ch 20 Hallucination Failure Modes, Ch 21 Python Boilerplate, Ch 22 Production AI Readiness Checklist.</p>
            """
        },
        # PAGE 3: Foundation Models & Quantization
        {
            "badge": "Chapter 01",
            "h1": "Foundation Model Architectures & Quantization",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">MODEL SELECTION</span>
              Selecting the appropriate foundation model requires evaluating parameter scale, context window saturation, inference latency, and hardware quantization trade-offs.
            </div>

            <h2>Context Window Saturation: The 'Lost-in-the-Middle' Trap</h2>
            <p>Modern models boast 1M+ token context windows. However, empirical benchmarks demonstrate that retrieval accuracy degrades by up to 40% when critical factual needles are positioned in the middle third of extensive context prompts. Context stuffing is no substitute for high-precision retrieval.</p>

            <table class="table-box">
              <tr>
                <th>Model Scale Tier</th>
                <th>VRAM Footprint (FP16)</th>
                <th>Quantized (4-bit AWQ)</th>
                <th>Optimal Production Role</th>
              </tr>
              <tr>
                <td>7B – 8B (Llama 3.1, Mistral)</td>
                <td>16 GB VRAM</td>
                <td>~5.5 GB VRAM</td>
                <td>Fast worker agents, classification, query rewriting</td>
              </tr>
              <tr>
                <td>14B – 32B (Qwen 2.5)</td>
                <td>64 GB VRAM</td>
                <td>~18 GB VRAM</td>
                <td>Complex SQL generation, multi-step logic synthesis</td>
              </tr>
              <tr>
                <td>70B (Llama 3.1 70B)</td>
                <td>140 GB VRAM</td>
                <td>~40 GB VRAM</td>
                <td>Supervisor agents, deep technical reasoning</td>
              </tr>
              <tr>
                <td>Frontier APIs (Claude 3.5, GPT-4o)</td>
                <td>Hosted Managed API</td>
                <td>Managed</td>
                <td>Complex architectural design, legal synthesis</td>
              </tr>
            </table>

            <div class="callout callout-tip">
              <span class="callout-title">QUANTIZATION STANDARD</span>
              Use 4-bit AWQ or GPTQ quantization for local GPU inference. They preserve 99% of FP16 accuracy while quadrupling inference throughput (tokens/sec) per GPU node.
            </div>
            """
        },
        # PAGE 4: Advanced Hybrid RAG Architecture
        {
            "badge": "Chapter 02",
            "h1": "Advanced Hybrid RAG: Dense & Sparse Retrieval",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">HYBRID RETRIEVAL</span>
              Pure vector semantic search struggles with exact keyword matches (e.g. part numbers: <code>SN-9821-X</code>, customer IDs, acronyms). Hybrid RAG combines dense semantic vector search with sparse keyword indexing (BM25).
            </div>

            <div class="diagram-box">
                                USER QUERY
                                    |
                    +---------------+---------------+
                    v                               v
         [ Dense Vector Search ]         [ Sparse BM25 Search ]
         (Embeddings via text-emb-3)     (Exact Keyword Matching)
                    |                               |
                    +---------------+---------------+
                                    v
                     [ Reciprocal Rank Fusion (RRF) ]
                                    v
                       [ Cross-Encoder Re-Ranker ]
                                    v
                        TOP-K RELEVANT CHUNKS
            </div>

            <h2>Reciprocal Rank Fusion (RRF) Algorithm</h2>
            <p>RRF merges ranked result lists without requiring normalization across divergent score scales:</p>
            <div class="code-box">
              <div class="code-header"><span>rrf_ranking.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">def</span> <span class="code-func">reciprocal_rank_fusion</span>(dense_results, sparse_results, k=<span class="code-keyword">60</span>):
    scores = {}
    <span class="code-keyword">for</span> rank, doc_id <span class="code-keyword">in</span> <span class="code-func">enumerate</span>(dense_results):
        scores[doc_id] = scores.<span class="code-func">get</span>(doc_id, <span class="code-keyword">0</span>) + <span class="code-keyword">1</span> / (k + rank + <span class="code-keyword">1</span>)
    <span class="code-keyword">for</span> rank, doc_id <span class="code-keyword">in</span> <span class="code-func">enumerate</span>(sparse_results):
        scores[doc_id] = scores.<span class="code-func">get</span>(doc_id, <span class="code-keyword">0</span>) + <span class="code-keyword">1</span> / (k + rank + <span class="code-keyword">1</span>)
    <span class="code-keyword">return</span> <span class="code-func">sorted</span>(scores.items(), key=<span class="code-keyword">lambda</span> x: x[<span class="code-keyword">1</span>], reverse=<span class="code-keyword">True</span>)</div>
            </div>
            """
        },
        # PAGE 5: Document Ingestion & Chunking
        {
            "badge": "Chapter 03",
            "h1": "Document Ingestion & Chunking Strategies",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">INGESTION QUALITY</span>
              The single biggest factor dictating RAG performance is chunking quality. Naive fixed-character chunking (e.g. 500 characters) splits sentences, severs tables, and strips semantic context.
            </div>

            <table class="table-box">
              <tr>
                <th>Chunking Strategy</th>
                <th>Chunk Boundary Heuristic</th>
                <th>Best Document Type</th>
              </tr>
              <tr>
                <td><strong>Recursive Character</strong></td>
                <td>Splits by double newline, then newline, then sentence periods</td>
                <td>Standard narrative articles, plain text essays</td>
              </tr>
              <tr>
                <td><strong>Hierarchical / Parent-Child</strong></td>
                <td>Indexes small chunks (200 tokens) for search; retrieves parent chunk (1000 tokens) for LLM context</td>
                <td>Complex technical documentation, manuals</td>
              </tr>
              <tr>
                <td><strong>Semantic Chunking</strong></td>
                <td>Calculates embedding distance between consecutive sentences; splits when distance surges</td>
                <td>Multi-topic transcripts, meeting notes, stream logs</td>
              </tr>
              <tr>
                <td><strong>Markdown Table Aware</strong></td>
                <td>Preserves Markdown table headers across every row chunk</td>
                <td>Financial reports, tabular specs, catalogs</td>
              </tr>
            </table>

            <h2>Parent-Child Document Indexing Pattern</h2>
            <div class="code-box">
              <div class="code-header"><span>parent_child_chunker.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-comment"># Ingest small search vectors linked to wide context blocks</span>
chunk_metadata = {
    <span class="code-str">"chunk_id"</span>: <span class="code-str">"chunk-892"</span>,
    <span class="code-str">"parent_id"</span>: <span class="code-str">"parent-doc-12"</span>,
    <span class="code-str">"parent_text"</span>: full_parent_section_text,  <span class="code-comment"># Delivered to LLM</span>
    <span class="code-str">"search_summary"</span>: concise_sentence_vector <span class="code-comment"># Stored in Vector DB</span>
}</div>
            </div>
            """
        },
        # PAGE 6: Vector Databases Compared
        {
            "badge": "Chapter 04",
            "h1": "Vector Databases: Qdrant, Pinecone & pgvector",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">VECTOR STORAGE</span>
              Vector databases index high-dimensional embeddings using Approximate Nearest Neighbor (ANN) algorithms (HNSW, IVFFlat). Choosing a database requires balancing operational simplicity against filtering performance.
            </div>

            <table class="table-box">
              <tr>
                <th>Vector Engine</th>
                <th>Index Architecture</th>
                <th>Payload Filtering</th>
                <th>Production Architecture Fit</th>
              </tr>
              <tr>
                <td><strong>Qdrant</strong></td>
                <td>Custom HNSW written in Rust</td>
                <td>Single-stage pre-filtering (Zero overhead)</td>
                <td>High-scale dedicated vector services, on-prem/cloud</td>
              </tr>
              <tr>
                <td><strong>pgvector</strong></td>
                <td>HNSW / IVFFlat inside PostgreSQL</td>
                <td>Native relational SQL joins & ACID</td>
                <td><strong>Optimal</strong> if PostgreSQL already exists in your stack</td>
              </tr>
              <tr>
                <td><strong>Pinecone</strong></td>
                <td>Proprietary managed cloud index</td>
                <td>Serverless metadata filtering</td>
                <td>Turnkey managed SaaS, zero DevOps overhead</td>
              </tr>
              <tr>
                <td><strong>Milvus</strong></td>
                <td>Distributed cloud-native cluster</td>
                <td>Segmented scalar filtering</td>
                <td>Billion-scale enterprise vector clusters</td>
              </tr>
            </table>

            <h2>Configuring High-Performance HNSW in pgvector</h2>
            <div class="code-box">
              <div class="code-header"><span>pgvector_hnsw.sql</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">CREATE EXTENSION IF NOT EXISTS</span> vector;

<span class="code-keyword">CREATE TABLE</span> knowledge_base.doc_embeddings (
    id <span class="code-keyword">BIGSERIAL PRIMARY KEY</span>,
    document_id <span class="code-keyword">VARCHAR(50)</span>,
    content_text <span class="code-keyword">TEXT</span>,
    embedding <span class="code-keyword">VECTOR(1536)</span> <span class="code-comment">-- OpenAI text-embedding-3-small</span>
);

<span class="code-comment">-- Build HNSW index with cosine distance metric</span>
<span class="code-keyword">CREATE INDEX</span> idx_doc_embeddings_hnsw 
<span class="code-keyword">ON</span> knowledge_base.doc_embeddings 
<span class="code-keyword">USING HNSW</span> (embedding vector_cosine_ops) 
<span class="code-keyword">WITH</span> (m = 16, ef_construction = 64);</div>
            </div>
            """
        },
        # PAGE 7: Re-Ranking Strategies
        {
            "badge": "Chapter 05",
            "h1": "Re-Ranking Strategies: Cross-Encoders & Cohere",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRECISION RETRIEVAL</span>
              Bi-encoder embeddings compare query and document vectors independently, missing nuanced semantic interactions. Cross-Encoder re-rankers evaluate query and document text simultaneously, re-ordering chunks with pinpoint accuracy.
            </div>

            <h2>The Two-Stage Retrieval Funnel</h2>
            <ol>
              <li><strong>Stage 1 (ANN Search):</strong> Fetch candidate top-50 chunks via fast vector search (&lt; 15ms).</li>
              <li><strong>Stage 2 (Cross-Encoder):</strong> Re-score top-50 candidates using a Cross-Encoder model (e.g. <code>bge-reranker-large</code>, Cohere Rerank v3); select the top-5 highest-scoring chunks for the LLM prompt (&lt; 40ms).</li>
            </ol>

            <div class="code-box">
              <div class="code-header"><span>cross_encoder_rerank.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">from</span> sentence_transformers <span class="code-keyword">import</span> CrossEncoder

reranker = CrossEncoder(<span class="code-str">'BAAI/bge-reranker-large'</span>)

<span class="code-comment"># Pairs of [user_query, candidate_document]</span>
query_chunk_pairs = [[user_query, doc[<span class="code-str">'text'</span>]] <span class="code-keyword">for</span> doc <span class="code-keyword">in</span> candidate_docs]
scores = reranker.<span class="code-func">predict</span>(query_chunk_pairs)

<span class="code-comment"># Re-rank and retain top 5 chunks exceeding 0.70 relevance threshold</span>
ranked_docs = [
    doc <span class="code-keyword">for</span> score, doc <span class="code-keyword">in</span> <span class="code-func">sorted</span>(<span class="code-func">zip</span>(scores, candidate_docs), reverse=<span class="code-keyword">True</span>) 
    <span class="code-keyword">if</span> score > <span class="code-keyword">0.70</span>
][:5]</div>
            </div>
            <div class="callout callout-tip">
              <span class="callout-title">BENCHMARK IMPACT</span>
              Adding a Cross-Encoder re-ranker stage increases RAG Hit Rate from 68% to 92% across domain-specific enterprise documentation benchmarks.
            </div>
            """
        },
        # PAGE 8: GraphRAG & Knowledge Graphs
        {
            "badge": "Chapter 06",
            "h1": "GraphRAG: Knowledge Graphs & Relational Grounding",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">RELATIONAL GROUNDING</span>
              Standard vector RAG fails on global holistic questions (e.g. "What are the primary operational risks across all 40 subsidiary contracts?"). GraphRAG extracts entities and relationships into a Knowledge Graph to reason across document boundaries.
            </div>

            <div class="diagram-box">
[ Raw Document Corpus ] ---> [ Entity & Relationship Extraction (LLM) ]
                                            |
                                            v
                                 [ Neo4j / NetworkX Graph ]
                                (Nodes: Entities | Edges: Relations)
                                            |
                                            v
                               [ Hierarchical Leiden Communities ]
                                            |
                                            v
                               [ Pre-Generated Community Summaries ]
                                            |
                                            v
                               GLOBAL QUERY REASONING
            </div>

            <h2>Local vs. Global Search in GraphRAG</h2>
            <ul>
              <li><strong>Local Graph Search:</strong> Explores entity subgraphs (e.g. "Who reports to Director of Security and what projects do they lead?").</li>
              <li><strong>Global Graph Search:</strong> Synthesizes pre-computed community summaries to answer thematic questions spanning thousands of documents without exceeding context limits.</li>
            </ul>
            """
        },
        # PAGE 9: Multi-Agent Architectures
        {
            "badge": "Chapter 07",
            "h1": "Multi-Agent Architectures: Router & Supervisor",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">AGENTIC ORCHESTRATION</span>
              A single monolithic prompt quickly collapses under complex enterprise tasks. Multi-agent systems decompose complex goals across specialized, narrow-scope agents coordinated by a centralized supervisor.
            </div>

            <table class="table-box">
              <tr>
                <th>Agent Architecture Pattern</th>
                <th>Coordination Topology</th>
                <th>Primary Strength</th>
              </tr>
              <tr>
                <td><strong>Router Pattern</strong></td>
                <td>Classifier categorizes intent and routes to 1 of N specialized agents</td>
                <td>Low latency; minimizes unnecessary tool invocation</td>
              </tr>
              <tr>
                <td><strong>Supervisor / Orchestrator</strong></td>
                <td>Supervisor delegates sub-tasks to workers, reviews outputs, and synthesizes final response</td>
                <td>Optimal for multi-step workflows (Research -> Draft -> FactCheck)</td>
              </tr>
              <tr>
                <td><strong>Plan-and-Solve</strong></td>
                <td>Planner generates explicit multi-step execution plan; Executor iterates steps</td>
                <td>Complex multi-step mathematical or code refactoring tasks</td>
              </tr>
              <tr>
                <td><strong>Reflection / Critic</strong></td>
                <td>Generator agent produces draft; Critic agent audits for bugs/hallucinations</td>
                <td>Guarantees high-precision code and schema generation</td>
              </tr>
            </table>

            <div class="callout callout-tip">
              <span class="callout-title">COMMUNICATION STANDARD</span>
              Agents must communicate via typed Pydantic state schemas, not free-form natural language strings, to prevent conversational drift and parsing errors.
            </div>
            """
        },
        # PAGE 10: Tool Use & Function Calling
        {
            "badge": "Chapter 08",
            "h1": "Tool Use, Function Calling & Sandboxed Execution",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">AGENT CAPABILITIES</span>
              LLMs cannot interact with the physical world without tools. Structured function calling binds natural language intents to strictly validated JSON schemas executed against external APIs and databases.
            </div>

            <h2>Declaring Validated Tools with Pydantic</h2>
            <div class="code-box">
              <div class="code-header"><span>tool_definition.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">from</span> pydantic <span class="code-keyword">import</span> BaseModel, Field
<span class="code-keyword">from</span> langchain_core.tools <span class="code-keyword">import</span> tool

<span class="code-keyword">class</span> <span class="code-func">DatabaseLookupSchema</span>(BaseModel):
    customer_id: <span class="code-keyword">str</span> = Field(..., description=<span class="code-str">"Unique customer identifier, e.g. CUST-4091"</span>)
    include_historical_orders: <span class="code-keyword">bool</span> = Field(<span class="code-keyword">False</span>, description=<span class="code-str">"Set true to fetch prior order history"</span>)

<span class="code-keyword">@tool</span>(args_schema=DatabaseLookupSchema)
<span class="code-keyword">def</span> <span class="code-func">lookup_customer_account</span>(customer_id: <span class="code-keyword">str</span>, include_historical_orders: <span class="code-keyword">bool</span>) -> <span class="code-keyword">dict</span>:
    <span class="code-str">\"\"\"Query PostgreSQL production read-replica for verified customer billing status.\"\"\"</span>
    <span class="code-keyword">return</span> db_client.<span class="code-func">execute_query</span>(customer_id, include_historical_orders)</div>
            </div>

            <h2>Sandboxed Code Execution Guardrails</h2>
            <p>Never execute LLM-generated Python or SQL code directly in your application server process. Route dynamic code execution through ephemeral, network-isolated Docker containers or WebAssembly (Wasm) runtimes with strict CPU/memory limits.</p>
            """
        },
        # PAGE 11: Frameworks: LangGraph vs Semantic Kernel
        {
            "badge": "Chapter 09",
            "h1": "Frameworks: LangGraph State Graphs vs. Semantic Kernel",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">FRAMEWORK COMPARISON</span>
              Building reliable agentic systems requires cyclic state management. LangGraph (Python/JS) and Microsoft Semantic Kernel (C#/Python) provide distinct architectural abstractions for enterprise agents.
            </div>

            <table class="table-box">
              <tr>
                <th>Evaluation Dimension</th>
                <th>LangGraph (State Graphs)</th>
                <th>Semantic Kernel (Microsoft)</th>
              </tr>
              <tr>
                <td>Core Abstraction</td>
                <td>Cyclic Directed Graphs with explicit Nodes, Edges, and Reducers</td>
                <td>Kernel Plugins, Semantic Functions & Native Planner Pipeline</td>
              </tr>
              <tr>
                <td>State Persistence</td>
                <td>Built-in checkpointing (Postgres/Redis) for human-in-the-loop pause/resume</td>
                <td>Context variables and custom memory connectors</td>
              </tr>
              <tr>
                <td>Ecosystem Synergy</td>
                <td>Native LangChain / LangSmith tracing ecosystem</td>
                <td>Azure OpenAI, Copilot Studio, and Microsoft Fabric native integration</td>
              </tr>
              <tr>
                <td>Language Focus</td>
                <td>Python & TypeScript</td>
                <td>C# .NET Enterprise & Python</td>
              </tr>
            </table>

            <h2>LangGraph State Machine Definition</h2>
            <div class="code-box">
              <div class="code-header"><span>langgraph_state_machine.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">from</span> langgraph.graph <span class="code-keyword">import</span> StateGraph, END
<span class="code-keyword">from</span> typing <span class="code-keyword">import</span> TypedDict, Annotated
<span class="code-keyword">import</span> operator

<span class="code-keyword">class</span> <span class="code-func">AgentState</span>(TypedDict):
    messages: Annotated[list, operator.add]
    next_step: <span class="code-keyword">str</span>

workflow = StateGraph(AgentState)
workflow.<span class="code-func">add_node</span>(<span class="code-str">"supervisor"</span>, supervisor_node)
workflow.<span class="code-func">add_node</span>(<span class="code-str">"sql_researcher"</span>, sql_node)
workflow.<span class="code-func">add_edge</span>(<span class="code-str">"sql_researcher"</span>, <span class="code-str">"supervisor"</span>)
app = workflow.<span class="code-func">compile</span>()</div>
            </div>
            """
        },
        # PAGE 12: Guardrails & Prompt Injection Defense
        {
            "badge": "Chapter 10",
            "h1": "Guardrails & Prompt Injection Defense",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">SECURITY HARDENING</span>
              Prompt injection, jailbreaks, and sensitive data leakage represent the top OWASP vulnerabilities in LLM systems. Production applications require automated pre-execution and post-generation guardrails.
            </div>

            <h2>Multi-Layered Guardrail Defense Stack</h2>
            <div class="diagram-box">
USER INPUT --> [ Regex & Tokenizer Filters ] (Credit Cards, SSN, API Keys)
                      |
                      v
               [ Canary Token Detection ] (Checks if system prompt leaked)
                      |
                      v
               [ Semantic Classifier (Llama Guard 3) ] (Jailbreaks, Toxicity)
                      |
                      v
               FOUNDATION MODEL INFERENCE
                      |
                      v
               [ Hallucination & Factuality Guard ] (Verifies citations)
                      |
                      v
                 CLEAN OUTPUT
            </div>

            <h2>Implementing Canary Tokens to Detect Exfiltration</h2>
            <p>Inject an ephemeral GUID canary string into system instructions: <code>CANARY=f89a2-9901</code>. If any model completion contains this string, the system immediately drops the payload and alerts security operations—proving an injection attack attempted to extract internal instructions.</p>
            """
        },
        # PAGE 13: Evaluation & Benchmarking: Ragas
        {
            "badge": "Chapter 11",
            "h1": "Evaluation & Benchmarking: The RAG Triad",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">QUANTITATIVE QUALITY</span>
              "Vibe checking" prompts by eye is the ultimate anti-pattern. Production GenAI systems establish automated evaluation metrics (Ragas, Trulens) executed across continuous regression test suites.
            </div>

            <h2>The RAG Triad Metrics Decoded</h2>
            <table class="table-box">
              <tr>
                <th>RAG Triad Metric</th>
                <th>What It Measures</th>
                <th>Underlying Failure Mode</th>
              </tr>
              <tr>
                <td><strong>Context Relevance</strong></td>
                <td>Are retrieved chunks relevant to the user query?</td>
                <td>Retriever returning noisy, irrelevant document fragments</td>
              </tr>
              <tr>
                <td><strong>Groundedness / Faithfulness</strong></td>
                <td>Is every claim in the response supported by the retrieved context?</td>
                <td><strong>Hallucination:</strong> LLM making up facts not present in source documents</td>
              </tr>
              <tr>
                <td><strong>Answer Relevance</strong></td>
                <td>Does the generated response actually address the user's core question?</td>
                <td>Model rambling off-topic or evading user constraints</td>
              </tr>
            </table>

            <h2>Automated Evaluation via Ragas in Python</h2>
            <div class="code-box">
              <div class="code-header"><span>evaluate_rag_pipeline.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">from</span> ragas <span class="code-keyword">import</span> evaluate
<span class="code-keyword">from</span> ragas.metrics <span class="code-keyword">import</span> faithfulness, answer_relevancy, context_precision

results = evaluate(
    dataset=eval_dataset,
    metrics=[faithfulness, answer_relevancy, context_precision]
)
<span class="code-func">print</span>(results) <span class="code-comment"># Outputs numerical scores between 0.0 and 1.0</span></div>
            </div>
            """
        },
        # PAGE 14: Long-Term Memory Systems
        {
            "badge": "Chapter 12",
            "h1": "Agent Memory: Short-Term, Sliding & Long-Term",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">STATE PERSISTENCE</span>
              Conversational agents must maintain continuity across multi-turn interactions. Designing memory requires balancing immediate dialogue context with long-term cross-session knowledge storage.
            </div>

            <h2>The Three Memory Tiers</h2>
            <ul>
              <li><strong>Short-Term Buffer:</strong> Exact raw conversational turns retained within the current active session prompt window.</li>
              <li><strong>Summarized Sliding Window:</strong> Once message history exceeds 10 turns, an asynchronous background task summarizes older turns into a concise executive recap paragraph.</li>
              <li><strong>Long-Term Episodic Memory:</strong> Key factual preferences (e.g. "Customer uses Azure West Europe and prefers Python") extracted into a persistent vector or relational store retrieved dynamically in future sessions.</li>
            </ul>

            <div class="code-box">
              <div class="code-header"><span>sliding_window_memory.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">from</span> langchain.memory <span class="code-keyword">import</span> ConversationSummaryBufferMemory

memory = ConversationSummaryBufferMemory(
    llm=summary_llm,
    max_token_limit=<span class="code-keyword">1500</span>, <span class="code-comment"># Retains recent turns, summarizes older history</span>
    return_messages=<span class="code-keyword">True</span>
)</div>
            </div>
            """
        },
        # PAGE 15: Cost & Token Optimization
        {
            "badge": "Chapter 13",
            "h1": "Cost Optimization: Prompt & Semantic Caching",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">FINANCIAL GOVERNANCE</span>
              Foundation model API invoices can spiral rapidly. Implementing prompt caching and vector semantic caching cuts operational API costs by up to 80% while accelerating response latencies.
            </div>

            <h2>1. Provider Prompt Caching (Anthropic / OpenAI)</h2>
            <p>Structure prompts so that large static context blocks (system guidelines, RAG documentation catalogs) appear at the very beginning of the prompt. Providers cache prefix KV-pairs in GPU memory, discounting cached input tokens by 90% and slashing Time-to-First-Token (TTFT).</p>

            <h2>2. Vector Semantic Caching (GPTCache / Redis)</h2>
            <p>When User B asks "How do I reset my corporate password?", their prompt vector is semantically identical (cosine distance &gt; 0.96) to User A's question from 10 minutes ago. A Semantic Cache returns the prior verified answer from Redis in 5ms, paying zero LLM tokens.</p>

            <table class="table-box">
              <tr>
                <th>Caching Strategy</th>
                <th>Cache Hit Latency</th>
                <th>Cost Reduction</th>
                <th>Implementation Complexity</th>
              </tr>
              <tr>
                <td>Exact String Hash Cache</td>
                <td>&lt; 2 milliseconds</td>
                <td>100% on identical queries</td>
                <td>Trivial (Redis key/value)</td>
              </tr>
              <tr>
                <td>Vector Semantic Cache</td>
                <td>5 – 15 milliseconds</td>
                <td>100% on paraphrased queries</td>
                <td>Medium (Redis Vector / Qdrant)</td>
              </tr>
              <tr>
                <td>Prompt Prefix KV-Caching</td>
                <td>Normal TTFT speedup</td>
                <td>90% discount on cached inputs</td>
                <td>Low (Structural prompt re-ordering)</td>
              </tr>
            </table>
            """
        },
        # PAGE 16: Observability & OpenTelemetry Tracing
        {
            "badge": "Chapter 14",
            "h1": "Observability: OpenTelemetry & LangSmith Tracing",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRODUCTION TELEMETRY</span>
              Debugging multi-agent systems without distributed tracing is impossible. When an agent fails on Step 6 of an 8-step pipeline, OpenTelemetry tracing pinpoints the exact prompt, token count, and latency bottleneck.
            </div>

            <h2>What Production LLM Traces Must Record</h2>
            <ul>
              <li><strong>Exact Prompt Input & Model Completion:</strong> Exact parameters, temperature, and system instructions.</li>
              <li><strong>Token Consumption:</strong> Prompt tokens, completion tokens, cached tokens, and estimated financial cost in USD.</li>
              <li><strong>Tool Call Latencies:</strong> Milliseconds spent waiting for external SQL databases vs model generation.</li>
              <li><strong>Inter-Agent Routing Decisions:</strong> Why the Supervisor routed to the SQL agent instead of the Documentation agent.</li>
            </ul>

            <div class="code-box">
              <div class="code-header"><span>opentelemetry_instrumentation.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">import</span> os
os.environ[<span class="code-str">"LANGCHAIN_TRACING_V2"</span>] = <span class="code-str">"true"</span>
os.environ[<span class="code-str">"LANGCHAIN_PROJECT"</span>] = <span class="code-str">"enterprise-production-agents"</span>
os.environ[<span class="code-str">"LANGCHAIN_API_KEY"</span>] = <span class="code-str">"lsv2_pt_..."</span>

<span class="code-comment"># All agent invocations, tool runs, and LLM calls stream automatically to LangSmith</span></div>
            </div>
            """
        },
        # PAGE 17: Fine-Tuning vs. RAG
        {
            "badge": "Chapter 15",
            "h1": "Fine-Tuning vs. RAG: Strategic Decision Guide",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ARCHITECTURAL SELECTION</span>
              One of the most persistent enterprise misconceptions is that fine-tuning is used to teach an LLM new knowledge. <strong>Fine-tuning teaches style, format, and behavior; RAG provides knowledge.</strong>
            </div>

            <table class="table-box">
              <tr>
                <th>Requirement Dimension</th>
                <th>Retrieval-Augmented Generation (RAG)</th>
                <th>Parameter Fine-Tuning (LoRA / QLoRA)</th>
              </tr>
              <tr>
                <td>Updating Facts / Knowledge</td>
                <td><strong>Superior</strong> (Instant update via Vector DB)</td>
                <td>Poor (Requires expensive retraining cycle)</td>
              </tr>
              <tr>
                <td>Strict Structured Output / Syntax</td>
                <td>Moderate (Relies on prompt few-shots)</td>
                <td><strong>Superior</strong> (Internalizes domain-specific DSL)</td>
              </tr>
              <tr>
                <td>Auditability & Citations</td>
                <td><strong>Superior</strong> (Direct link to source document chunk)</td>
                <td>Zero (Weights cannot provide verifiable citations)</td>
              </tr>
              <tr>
                <td>Hallucination Mitigation</td>
                <td>Strong (Grounded by retrieved context)</td>
                <td>Low (Model can still hallucinate confidently)</td>
              </tr>
              <tr>
                <td>Upfront Financial Cost</td>
                <td>Low (Standard database & embedding costs)</td>
                <td>High (Curating datasets, GPU cluster compute)</td>
              </tr>
            </table>

            <div class="callout callout-tip">
              <span class="callout-title">THE WINNING RECIPE</span>
              Start with RAG. Only fine-tune a smaller open-source model (e.g. Llama-3 8B via LoRA) when you need to enforce strict structured JSON output or reduce latency while retaining high performance.
            </div>
            """
        },
        # PAGE 18: Serving Infrastructure: vLLM
        {
            "badge": "Chapter 16",
            "h1": "Serving Infrastructure: vLLM & Kubernetes",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">LOCAL INFERENCE SCALING</span>
              Hosting open-source models privately requires high-throughput inference engines. vLLM utilizes PagedAttention to eliminate GPU memory fragmentation, delivering 5x to 10x higher serving throughput than standard Hugging Face pipelines.
            </div>

            <h2>Deploying a vLLM Cluster with Docker</h2>
            <div class="code-box">
              <div class="code-header"><span>docker-compose.yml</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">services</span>:
  <span class="code-keyword">vllm-inference</span>:
    <span class="code-keyword">image</span>: vllm/vllm-openai:latest
    <span class="code-keyword">deploy</span>:
      <span class="code-keyword">resources</span>:
        <span class="code-keyword">reservations</span>:
          <span class="code-keyword">devices</span>:
            - <span class="code-keyword">driver</span>: nvidia
              <span class="code-keyword">count</span>: all
              <span class="code-keyword">capabilities</span>: [gpu]
    <span class="code-keyword">ports</span>:
      - "8000:8000"
    <span class="code-keyword">command</span>: >
      --model meta-llama/Meta-Llama-3.1-8B-Instruct
      --tensor-parallel-size 1
      --gpu-memory-utilization 0.90
      --max-model-len 8192</div>
            </div>

            <h2>OpenAI-Compatible REST Interface</h2>
            <p>vLLM exposes standard <code>/v1/chat/completions</code> endpoints. Downstream applications connect using existing OpenAI Python SDKs simply by altering the <code>base_url="http://vllm-host:8000/v1"</code>.</p>
            """
        },
        # PAGE 19: Enterprise Case Study: Regulatory Research
        {
            "badge": "Chapter 17",
            "h1": "Case Study: Multi-Agent Regulatory Compliance",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">ENTERPRISE CASE STUDY</span>
              A multinational financial institution operating across 14 jurisdictions deployed a Multi-Agent RAG research assistant to parse 80,000 pages of statutory banking regulations and internal policy documents.
            </div>

            <h2>Agentic Graph Topology</h2>
            <ol>
              <li><strong>Supervisor Agent:</strong> Deconstructs regulatory inquiries into country-specific research questions.</li>
              <li><strong>Jurisdiction RAG Agents:</strong> Query regional pgvector collections using hybrid BM25 + dense search.</li>
              <li><strong>Synthesis Agent:</strong> Compiles comparative compliance matrix comparing local statutory rules.</li>
              <li><strong>Audit Critic Agent:</strong> Verifies every claim against primary source document citations, failing the build if faithfulness drops below 0.95.</li>
            </ol>

            <h2>Production Performance Metrics</h2>
            <ul>
              <li><strong>Latency:</strong> 4.8 seconds average end-to-end multi-agent execution time.</li>
              <li><strong>Accuracy:</strong> 96.4% faithfulness verified across 1,000 expert benchmark questions.</li>
              <li><strong>Business Impact:</strong> Compliance legal review turnaround accelerated from 4 days to 15 minutes.</li>
            </ul>
            """
        },
        # PAGE 20: Production Failure Modes
        {
            "badge": "Chapter 18",
            "h1": "Production Failure Modes & Hallucination Cascades",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">FAILURE POST-MORTEM</span>
              Understanding how agentic systems fail in the wild is essential for engineering resilient fallback boundaries.
            </div>

            <table class="table-box">
              <tr>
                <th>Failure Manifestation</th>
                <th>Root Cause Architecture Fault</th>
                <th>Engineering Mitigation</th>
              </tr>
              <tr>
                <td><strong>Hallucination Cascade</strong></td>
                <td>Agent A hallucinates an assumption; Agent B takes it as factual truth, compounding error</td>
                <td>Require Critic verification at each state transition boundary</td>
              </tr>
              <tr>
                <td><strong>Infinite Tool Loop</strong></td>
                <td>Agent encounters API error, retries with identical parameters indefinitely</td>
                <td>Enforce hard recursion limits in LangGraph: <code>recursion_limit=10</code></td>
              </tr>
              <tr>
                <td><strong>Context Pollution</strong></td>
                <td>Irrelevant tool outputs fill context window, degrading reasoning quality</td>
                <td>Filter and summarize raw JSON payloads before returning to LLM context</td>
              </tr>
              <tr>
                <td><strong>Tool Schema Hallucination</strong></td>
                <td>Model invokes non-existent function arguments</td>
                <td>Use strict Pydantic schemas with native JSON-schema tool enforcement</td>
              </tr>
            </table>

            <div class="callout callout-warn">
              <span class="callout-title">RECURSION LIMIT DEFENSE</span>
              Always configure maximum iteration bounds on autonomous agent graphs to prevent runaway API spend during unexpected tool errors.
            </div>
            """
        },
        # PAGE 21: Python Starter Boilerplate
        {
            "badge": "Chapter 19",
            "h1": "Production GenAI Python Starter Template",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">STARTER BLUEPRINT</span>
              Production boilerplate implementing LangChain, OpenAI function calling, and structured Pydantic output validation.
            </div>

            <div class="code-box">
              <div class="code-header"><span>production_agent_runner.py</span><div class="code-dots"><div class="code-dot red"></div><div class="code-dot yellow"></div><div class="code-dot green"></div></div></div>
              <div class="code-body"><span class="code-keyword">from</span> langchain_openai <span class="code-keyword">import</span> ChatOpenAI
<span class="code-keyword">from</span> pydantic <span class="code-keyword">import</span> BaseModel, Field

<span class="code-comment"># Structured output schema</span>
<span class="code-keyword">class</span> <span class="code-func">ExecutiveBriefing</span>(BaseModel):
    summary: <span class="code-keyword">str</span> = Field(..., description=<span class="code-str">"Concise 2-sentence executive summary"</span>)
    key_findings: list[<span class="code-keyword">str</span>] = Field(..., description=<span class="code-str">"Bullet points of core findings"</span>)
    confidence_score: <span class="code-keyword">float</span> = Field(..., description=<span class="code-str">"Confidence score between 0.0 and 1.0"</span>)
    citations: list[<span class="code-keyword">str</span>] = Field(..., description=<span class="code-str">"Source document IDs referenced"</span>)

llm = ChatOpenAI(model=<span class="code-str">"gpt-4o"</span>, temperature=<span class="code-keyword">0.0</span>)
structured_llm = llm.<span class="code-func">with_structured_output</span>(ExecutiveBriefing)

<span class="code-comment"># Guaranteed type-safe execution</span>
briefing = structured_llm.<span class="code-func">invoke</span>(<span class="code-str">"Synthesize Q3 regional compliance report based on context."</span>)
print(f<span class="code-str">"Confidence: {briefing.confidence_score} | Citations: {briefing.citations}"</span>)</div>
            </div>
            """
        },
        # PAGE 22: Enterprise AI Engineer Audit Checklist
        {
            "badge": "Chapter 20",
            "h1": "Enterprise AI Engineer Production Readiness Audit",
            "content_html": """
            <div class="callout callout-summary">
              <span class="callout-title">PRE-FLIGHT ASSESSMENT</span>
              Before deploying any generative AI agent or RAG system to enterprise production, verify compliance against every standard in this operational checklist.
            </div>

            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Retrieval Quality:</strong> Hybrid RAG implemented (dense vectors + sparse BM25); Cross-Encoder re-ranker filtering top candidates.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Structured Tool Calling:</strong> All external tools enforce strict Pydantic schemas; code execution isolated in sandboxed containers.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Security Guardrails:</strong> Pre-execution input validation filters prompt injections; canary token detection active on system instructions.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Quantitative Benchmarking:</strong> Automated Ragas evaluation pipeline active in CI/CD; Faithfulness & Answer Relevance &ge; 0.90.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>FinOps & Token Controls:</strong> Prompt caching configured for static contexts; maximum token and recursion limits enforced on all agent loops.</div>
            </div>
            <div class="checklist-item">
              <div class="checkbox-box"><div class="checkbox-inner"></div></div>
              <div><strong>Full Tracing:</strong> Distributed OpenTelemetry or LangSmith tracing records 100% of production prompt inputs, completions, and latencies.</div>
            </div>

            <div class="callout callout-tip" style="margin-top: 14px;">
              <span class="callout-title">AUTHOR CLOSING STATEMENT</span>
              Generative AI transforms software when treated with classical engineering discipline. By combining hybrid retrieval, deterministic tool calling, and automated evaluation guardrails, your team builds autonomous systems that deliver undeniable enterprise value with bulletproof reliability.<br><br>
              <strong>Datta Sable</strong> · Enterprise Analytics & Data Architect · <em>dattasable.com</em>
            </div>
            """
        }
    ]
}
