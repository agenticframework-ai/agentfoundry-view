export const ragPlaybookSections=[
  {
    id:'stages',label:'Stages',title:'RAG pipeline at a glance',summary:'Choose one stage to inspect its job, common implementation choices, and an evaluation signal.',
    tables:[{title:'Stage, job, choices, and owner metric',columns:['Stage','Job','Typical choices','Owner metric'],rows:[
      ['Parse','Turn files into clean text and structure','PyMuPDF · Docling · Unstructured · OCR','Parse error rate'],
      ['Chunk','Split content into retrievable units','Recursive · heading-aware · semantic','Chunk recall'],
      ['Embed','Map text into vectors','OpenAI · Cohere · Voyage · BGE · E5','Recall@k'],
      ['Index','Store and search vectors and keywords','pgvector · Qdrant · OpenSearch','p95 latency'],
      ['Retrieve','Find candidate evidence with hybrid search','Dense + BM25 + metadata filters','Recall@50'],
      ['Rerank','Order candidates for the query','Cross-encoder · Cohere/Voyage rerank','nDCG@5'],
      ['Generate','Answer from evidence and cite sources','Claude · GPT · Llama · Qwen','Faithfulness']
    ]}],
    tips:[['Measure each stage','Track stage-specific failures so retrieval quality is not blamed for parsing or source-quality problems.']]
  },
  {
    id:'chunking',label:'Chunking',title:'Chunking strategy',summary:'Chunking is a retrieval-quality trade-off. Start with document structure and tune using representative questions.',
    tables:[
      {title:'Strategy choices',columns:['Strategy','How it works','Use when','Watch out'],rows:[
        ['Fixed size','Split every N tokens with overlap','Uniform text and a quick baseline','Can split sentences, tables, or clauses'],
        ['Recursive','Try paragraph, line, sentence, then word boundaries','A practical prose default','May ignore document hierarchy'],
        ['Structure-aware','Split on headings and preserve section path','Docs, wikis, manuals, and legal text','Long sections may need a second split'],
        ['Semantic','Embed sentences and split where similarity drops','Mixed-topic transcripts and notes','Slower to index; tune thresholds'],
        ['Agentic / LLM','Model proposes boundaries and titles','High-value, low-volume collections','Costly and non-deterministic; validate output']
      ]},
      {title:'Illustrative starting points by content',columns:['Content type','Start size','Overlap','Split on'],rows:[
        ['FAQ / support macros','100-250 tokens','0','One question and answer per chunk'],
        ['Product docs / wikis','300-500 tokens','10-15%','Headings, then paragraphs'],
        ['Legal / policy / contracts','400-800 tokens','10-20%','Clause or section numbers'],
        ['Research papers','400-600 tokens','10%','Sections; preserve figure captions'],
        ['Code','Function or class','Signature + docstring','AST nodes, not arbitrary lines'],
        ['Chat / transcripts','One turn; 200-400 tokens','One turn','Speaker turn and topic shift']
      ]}
    ],
    cards:[['Small · ~128 tokens','More precise matches, but may lose context.'],['Medium · ~400 tokens','A balanced starting point; validate on your corpus.'],['Large · ~1,200 tokens','More context, but matches can become less specific.']],
    tips:[['Tune with recall and faithfulness','These sizes are starting heuristics, not universal defaults. Compare chunk recall, answer quality, and latency on your own evaluation set.']]
  },
  {
    id:'embeddings',label:'Embeddings',title:'Embedding techniques and model choice',summary:'The embedding model, preprocessing, and index settings must be evaluated as one retrieval system.',
    tables:[{title:'Model selection checklist',columns:['Decision','Practical check'],rows:[
      ['Benchmark','Measure retrieval on representative queries and labeled relevance; a public benchmark rank is a hint, not a verdict.'],
      ['Language coverage','Confirm the model handles the languages and domain vocabulary in the corpus.'],
      ['Input length','Maximum input length must exceed the chunk plus title, metadata, and contextual prefix.'],
      ['Dimensions','Dimensions affect storage and latency; if the model supports Matryoshka Representation Learning, validate any shortened vector before use.'],
      ['Hosting','Compare hosted APIs with self-hosted models such as BGE-M3, E5, or GTE for privacy, operations, and cost.'],
      ['Compatibility','Use a compatible embedding space for query and document vectors; re-embed when changing models.']
    ]}],
    tips:[['Evaluate the whole retrieval path','Compare recall@k, latency, storage, and access constraints using the same corpus and query set.']]
  },
  {
    id:'indexes',label:'ANN indexes',title:'Vector index choices',summary:'Approximate nearest-neighbor indexes trade memory, build time, search speed, and recall.',
    tables:[{title:'Index selection',columns:['Index','Idea','Memory / speed','Best fit'],rows:[
      ['Flat','Brute-force exact search','Highest memory; slower at scale','Small collections and ground-truth evaluation'],
      ['HNSW','Layered proximity graph','About 1.5-2x memory; very fast','Common default for collections up to roughly 100M vectors; benchmark first'],
      ['IVF','Cluster vectors and probe nearby lists','About 1x memory; fast','Large sets where index training and probe tuning are acceptable'],
      ['IVF-PQ','IVF with product-quantized codes','Potentially 0.05-0.1x memory; fast','Very large vector sets with tight RAM budgets'],
      ['DiskANN','Graph search backed by SSD','Lower RAM; fast','Large corpora where SSD-backed search fits operational needs']
    ]}],
    tips:[['Keep an exact baseline','Compare ANN recall against exact nearest neighbors before optimizing index parameters.']]
  },
  {
    id:'stores',label:'Vector stores',title:'Vector database options',summary:'Choose based on your existing stack, filtering needs, hybrid search, scale, and operational model.',
    tables:[{title:'Illustrative options',columns:['Option','Type','Hybrid search','Filtering','Good fit when'],rows:[
      ['pgvector','Postgres extension','tsvector / pg_search options','Full SQL','Already on Postgres; modest scale and operational simplicity matter'],
      ['Qdrant','Open-source / cloud','Sparse + dense','Rich payload filters','Filtering, self-hosting, and vector features are priorities'],
      ['Weaviate','Open-source / cloud','Built-in BM25F','Good','Integrated search modules fit your platform needs'],
      ['Milvus / Zilliz','Open-source / managed','Sparse + dense','Good','Very large scale and GPU-backed indexes are justified'],
      ['Pinecone','Managed','Sparse + dense','Metadata filters','Managed operations and a service-based model fit'],
      ['OpenSearch / Elastic','Search engine','BM25 with vector search','Excellent','An existing search stack can serve both lexical and vector retrieval'],
      ['Chroma / LanceDB','Embedded / local','Basic','Basic','Prototypes, local development, or edge applications']
    ]}],
    tips:[['Validate operational fit','Confirm backup, deletion, tenant isolation, index rebuild, filter semantics, and cost at expected scale.']]
  },
  {
    id:'retrieval',label:'Retrieval',title:'Retrieval knobs and hybrid patterns',summary:'Retrieve candidates broadly enough for recall, then refine them with filters and evaluation.',
    tables:[{title:'Tune retrieval deliberately',columns:['Knob','What it does','Starting guidance'],rows:[
      ['k (candidates)','Controls how many chunks are fetched','Fetch roughly 20-50 for reranking; send only about 3-8 to generation as a starting point'],
      ['Similarity metric','Cosine, dot product, or L2 distance','Match the metric and normalization expected by the embedding model'],
      ['Score threshold','Drops weak matches','Calibrate on evaluation data; a threshold can trigger an “I do not know” response'],
      ['MMR lambda','Balances relevance with diversity','A value around 0.5-0.7 is a tuning range, not a universal setting'],
      ['Metadata filters','Restricts candidate evidence','Apply tenant, ACL, language, and recency constraints before retrieval']
    ]}],
    tips:[['Hybrid retrieval','Combine dense semantic search with lexical BM25 when exact names, identifiers, or domain terms matter. Evaluate recall@k and latency.']]
  },
  {
    id:'reranking',label:'Re-ranking',title:'Re-ranking candidates',summary:'A reranker spends extra compute to improve ordering after retrieval has produced a manageable candidate set.',
    tables:[
      {title:'Implementation options',columns:['Option','Notes'],rows:[
        ['Hosted APIs','Cohere Rerank · Voyage rerank · Jina; assess language coverage, latency, privacy, and per-call cost'],
        ['Open models','bge-reranker-v2 · mxbai-rerank · MS MARCO MiniLM; self-hosting requires capacity and lifecycle management'],
        ['LLM as reranker','Listwise ranking with a small LLM can be strong, but is generally slower and more expensive']
      ]},
      {title:'Operating rule of thumb',columns:['Pattern','Guidance'],rows:[
        ['Candidate count','Rerank about 20-50 candidates and keep about 3-8 for generation as an initial experiment'],
        ['Abstain signal','Calibrate the best rerank score; if evidence is weak, say so instead of guessing'],
        ['Validation metric','Use nDCG@k and answer faithfulness alongside latency and cost']
      ]}
    ],
    tips:[['Avoid oversized candidate sets','Reranking hundreds of candidates often adds latency without a measured quality gain. Benchmark the smallest set that meets recall needs.']]
  },
  {
    id:'query',label:'Query transforms',title:'Query transformation',summary:'Rewrite, expand, or route a question only when it addresses a measured retrieval problem.',
    tables:[{title:'Techniques and cost',columns:['Technique','Solves','Cost / watch out'],rows:[
      ['Condense (history-aware)','Follow-ups that depend on prior turns','One small model call'],
      ['Multi-query','Vocabulary mismatch between user and documents','One call plus multiple searches'],
      ['HyDE','Short query versus a long passage','One call; generated hypothetical text can mislead factual retrieval'],
      ['Decomposition','Multi-hop questions needing sub-questions','One call plus per-sub-question searches'],
      ['Step-back','Over-specific questions needing background','One call plus an extra search'],
      ['Routing','Select index, tool, or SQL by intent','Classifier or model call; validate route and fallback']
    ]}],
    tips:[['Control query expansion','Deduplicate results, preserve the original question, and measure added recall against the extra latency and spend.']]
  },
  {
    id:'access',label:'Filters & access',title:'Filtering, routing, and access control',summary:'Apply source permissions and validated metadata filters during retrieval, not after untrusted results have been selected.',
    tables:[
      {title:'Filter and routing fields',columns:['Field','Why it matters','Index guidance'],rows:[
        ['tenant_id','Isolation between customers','Always filter before retrieval'],
        ['ACL / groups','Per-document source permissions','Always enforce'],
        ['language / region','Correct language and legal scope','Index when relevant'],
        ['updated_at / version','Recency and product-version questions','Use for time-range filtering'],
        ['doc_type / source','Routing and ranking boosts','Index when useful']
      ]},
      {title:'Multi-tenancy options',columns:['Approach','Trade-off'],rows:[
        ['Shared index + tenant filter','Simpler operations; validate strict filter enforcement and side channels'],
        ['Partition / namespace per tenant','Stronger separation; more namespaces to operate'],
        ['Index per tenant','Strong isolation; higher operational and storage cost']
      ]}
    ],
    tips:[
      ['Prefilter, do not postfilter','Postfiltering after top-k can return too few results and may expose counts or timing. Filter within the authorized search path.'],
      ['Validate self-query filters','A model may extract structured filters, but validate them against a schema, allowed fields, and the caller’s permissions. Never rely on a prompt as an access control.']
    ]
  },
  {
    id:'generation',label:'Generation & citations',title:'Grounded generation and citations',summary:'A production answer is a claim plus its evidence. Require source-grounded claims, verify citations, and allow abstention.',
    tables:[
      {title:'Context assembly rules',columns:['Rule','Implementation guidance'],rows:[
        ['Order evidence','Place strong evidence near the beginning and end of context; test long-context behavior'],
        ['Deduplicate','Merge adjacent chunks from the same source section'],
        ['Preserve provenance','Give each chunk an ID, title, source, and updated date'],
        ['Budget tokens','Drop the lowest-ranked chunks before truncating; do not cut a chunk mid-sentence'],
        ['Separate instructions','Put stable instructions first, evidence next, and the user question last; delimit untrusted source text']
      ]},
      {title:'Prompt contract and citation UX',columns:['Control','Expected behavior'],rows:[
        ['Grounding','Answer only from provided sources; report disagreement between sources'],
        ['Citations','Cite the exact section or page for each material claim and make citations navigable'],
        ['Abstention','If evidence is absent or weak, say “I do not know” and suggest where to look'],
        ['Citation verification','A citation marker alone proves nothing; check that the cited passage supports the claim'],
        ['Prompt caching','Place long, stable instructions and examples before variable context and the question when the provider supports caching']
      ]}
    ],
    tips:[['Measure faithfulness','Evaluate claim support and citation validity; low retrieval or rerank confidence should be a reason to abstain.']]
  },
  {
    id:'advanced',label:'Advanced patterns',title:'Small-to-big and contextual retrieval',summary:'Decouple the chunk used for matching from the context returned to the model.',
    tables:[
      {title:'Advanced retrieval patterns',columns:['Pattern','Index / search unit','Return to model','Use when'],rows:[
        ['Parent-child','Small child chunks','Parent section','Long structured documents'],
        ['Sentence window','Single sentences','Sentence plus neighboring sentences','Dense factual text'],
        ['Contextual retrieval','Chunk plus generated context','Original chunk','Chunks that need surrounding document meaning'],
        ['Summary index','Document or section summaries','Full section','Broad “what does this cover?” questions'],
        ['Late chunking','Embed full document, pool vectors per chunk','Relevant chunk','Long-context embedding models are available']
      ]}
    ],
    tips:[
      ['Small match, rich answer','Search over smaller children for precision, then return the parent section for enough context.'],
      ['Contextual retrieval cost','Generating context for every chunk adds indexing work. Benchmark quality and cost; reported improvements are corpus-specific, not guaranteed.']
    ]
  }
];

export const ragStageGuidance=[
  {
    probable:'Authoritative APIs or repositories with stable IDs, owners, and version history.',
    nonProbable:'Unowned exports, scraped copies, or duplicate “latest” files with no lineage.'
  },
  {
    probable:'Incremental, idempotent sync with checkpoints, retries, and deletion handling.',
    nonProbable:'One-time bulk loads that silently miss updates, retries, or deleted documents.'
  },
  {
    probable:'Validate file structure, classify sensitive content, and attach source ACLs before indexing.',
    nonProbable:'Trust file extensions or index sensitive content before applying its access labels.'
  },
  {
    probable:'Preserve headings, clause boundaries, source IDs, and chunk-to-document lineage.',
    nonProbable:'Split every document at the same arbitrary boundary, losing tables or legal clauses.'
  },
  {
    probable:'Benchmark a compatible query/document model on representative, labeled questions.',
    nonProbable:'Choose from a leaderboard alone or mix incompatible embedding spaces.'
  },
  {
    probable:'Benchmark exact search, ANN, and dense-plus-BM25 with metadata filters.',
    nonProbable:'Choose an index by vector count alone or omit lexical search for exact identifiers.'
  },
  {
    probable:'Apply tenant and document ACL filters before retrieval, then rerank authorized candidates.',
    nonProbable:'Retrieve broadly and remove unauthorized results only after top-k selection.'
  },
  {
    probable:'Cite supporting passages, verify each claim, and abstain when evidence is weak.',
    nonProbable:'Generate uncited answers, invent source details, or automate a high-impact decision.'
  }
];

export const ragDemoKnowledge=[
  {
    stage:0,question:'What makes a source authoritative?',triggers:['authoritative','source of truth','system of record','source identity'],
    source:'Data Governance Standard §2.1',evidence:'Each connected source must have a named owner, stable source ID, and a documented system-of-record designation.',
    answer:'Use the named system of record, preserving its owner and stable source ID. Treat copies as non-authoritative unless a source owner validates them.'
  },
  {
    stage:1,question:'How should ingestion handle changed or deleted documents?',triggers:['ingestion','changed documents','deleted documents','change capture','incremental sync'],
    source:'Connector Runbook §4.3',evidence:'Incremental connector runs use checkpoints and idempotent updates; source deletions are propagated as tombstones.',
    answer:'Use checkpointed incremental sync, make updates idempotent, and propagate deletions so stale content is not retrieved.'
  },
  {
    stage:2,question:'How are sensitive documents classified?',triggers:['sensitive','classif','pii','access label','validate file'],
    source:'Information Handling Policy §3.2',evidence:'Validate document structure and sensitivity labels before indexing; carry source permissions into the retrieval metadata.',
    answer:'Validate the document, classify sensitive content, and attach its permissions before indexing or making it searchable.'
  },
  {
    stage:3,question:'How should documents be chunked?',triggers:['chunk','split','chunking','clause'],
    source:'Knowledge Indexing Guide §2.4',evidence:'Preserve heading and clause paths. Product documentation may start around 300–500 tokens; tune against recall and answer quality.',
    answer:'Start with structure-aware chunks that retain heading or clause context. Treat 300–500 tokens for product docs as a benchmark starting point, not a universal rule.'
  },
  {
    stage:4,question:'How do we choose an embedding model?',triggers:['embedding','vector dimensions','model choice'],
    source:'Model Evaluation Note §5.1',evidence:'Evaluate query and document vectors in the same model space using representative labeled questions, language coverage, latency, and cost.',
    answer:'Benchmark a compatible query/document embedding model on your own labeled questions, languages, latency, and cost before selecting it.'
  },
  {
    stage:5,question:'When should hybrid search be used?',triggers:['hnsw','bm25','hybrid','index','vector store'],
    source:'Search Benchmark §3.1',evidence:'Dense retrieval captures semantic similarity; BM25 helps with exact names and identifiers. Compare recall and latency against an exact-search baseline.',
    answer:'Use dense-plus-BM25 when semantic meaning and exact terms both matter. Compare it with an exact-search baseline and validate recall and latency.'
  },
  {
    stage:6,question:'How do we ensure retrieval respects permissions?',triggers:['permission','acl','access control','rerank','retrieval','tenant'],
    source:'Access Control Standard §7.2',evidence:'Tenant and document ACL filters are applied within the authorized search path before results are returned or reranked.',
    answer:'Apply tenant and document ACL filters before returning candidates; rerank only evidence the requesting user is authorized to see.'
  },
  {
    stage:7,question:'When should an answer cite or abstain?',triggers:['citation','cite','grounded','abstain','unsupported','evidence'],
    source:'Answer Contract §2.3',evidence:'Material claims must cite supporting source passages. If evidence is absent or weak, the response must abstain rather than guess.',
    answer:'Cite the passage supporting each material claim. If no reliable passage supports the answer, say the evidence is insufficient instead of guessing.'
  },
  {
    stage:0,question:'What is the supplier agreement renewal notice period?',triggers:['renewal','notice period','supplier agreement','term end'],
    source:'Supplier Agreement §8.2',evidence:'Either party may elect not to renew by providing written notice no fewer than 60 days before the end of the current term.',
    answer:'The notice period is 60 days before the current term ends.'
  }
];

export const ragStagePlaybooks=['stages','stages','stages','chunking','embeddings','indexes','retrieval','generation'];
export const ragPlaybookStages={stages:0,chunking:3,embeddings:4,indexes:5,stores:5,retrieval:6,reranking:6,query:6,access:6,generation:7,advanced:7};
