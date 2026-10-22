import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);

function load(file) {
  const mod = { exports: {} };
  const result = ts.transpileModule(fs.readFileSync(file, 'utf8'), { reportDiagnostics: true, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  assert.equal(result.diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  vm.runInNewContext(result.outputText, { module: mod, exports: mod.exports, require });
  return mod.exports;
}
const { prepareArticleNavigation: prepare } = load('lib/article-navigation.ts');
const { articleHeadingLabel, groupArticleHeadings, filterArticleHeadings } = load('lib/article-toc.ts');

test('replaces legacy TOCs without deleting article sections, diagrams, examples or existing anchors', () => {
  const content = '<p>Introduction remains.</p><div class="blog-toc"><h4>Table of Contents</h4><ol><li><a href="#architecture">Architecture</a></li></ol></div><h2 id="architecture">Architecture &amp; design</h2><p>Useful original explanation.</p>[[diagram:architecture]]<h3 id="example">Worked example</h3><pre><code>&lt;h2&gt;Literal code&lt;/h2&gt;</code></pre><h2>Next steps</h2>';
  const original = { content };
  const result = prepare(original);
  assert.equal(original.content, content);
  assert.doesNotMatch(result.content, /blog-toc|Table of Contents/);
  for (const value of ['Introduction remains.', 'Useful original explanation.', '[[diagram:architecture]]', 'id="architecture"', 'id="example"', 'Literal code']) assert.ok(result.content.includes(value));
  assert.equal(result.headings.length, 3);
  assert.equal(result.headings[0].text, 'Architecture & design');
  assert.equal(result.headings[1].level, 3);
});

test('standalone TOC heading/list and empty container are removed while neighboring prose remains', () => {
  const result = prepare({ content: '<p>Before.</p><div class="old"><h2 id="toc">Table of Contents</h2><ul><li><a href="#a">A</a></li></ul></div><p>After.</p><h2 id="a">Actual article section</h2>' });
  assert.doesNotMatch(result.content, /class="old"|Table of Contents/);
  assert.match(result.content, /Before\./); assert.match(result.content, /After\./);
  assert.equal(result.headings.length, 1); assert.equal(result.headings[0].id, 'a');
});

test('TOC instructions are replaced but a similarly named article container is preserved', () => {
  const result = prepare({ content: '<div class="blog-toc"><p>Select a section.</p><h4>Contents</h4><ol><li><a href="#real">Real</a></li></ol></div><div class="table-of-contents"><h2 id="real">Actual article heading</h2><p>Preserve substantive text.</p><a href="#real">Section link</a></div>' });
  assert.doesNotMatch(result.content, /Select a section/);
  assert.match(result.content, /Preserve substantive text/);
  assert.equal(result.headings[0].id, 'real');
});

test('stable generated IDs do not collide with authored IDs or duplicate headings', () => {
  const content = '<div id="reserved"></div><h2>Overview</h2><h2 id="overview">Authored section</h2><h3 id="overview">Duplicate id</h3><h2 id="overview-2">Keep this anchor</h2><h2>Overview</h2><h2>Reserved</h2><h2>प्रस्तावना</h2>';
  const result = prepare({ content });
  const ids = Array.from(result.headings, h => h.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(result.headings[1].id, 'overview');
  assert.equal(result.headings[3].id, 'overview-2');
  assert.equal(result.headings[5].id, 'reserved-2');
  assert.equal(result.headings[6].text, 'प्रस्तावना');
  assert.equal(JSON.stringify(prepare({ content }).headings), JSON.stringify(result.headings));
});

test('block editor articles use their rendered block headings and do not index unused HTML or embeds', () => {
  const post = { content: '<h2>Unused legacy HTML</h2>', blocks: [
    { id: 'a', type: 'heading', content: '<h2>Architecture</h2>', metadata: {} },
    { id: 'b', type: 'paragraph', content: '<h3>Details</h3><p>Keep this text.</p>', metadata: {} },
    { id: 'c', type: 'embed', content: '<h2>Not rendered as a heading</h2>', metadata: { url: 'https://example.test' } },
    { id: 'd', type: 'code', content: '<pre><code>&lt;h2&gt;A code example&lt;/h2&gt;</code></pre>', metadata: {} },
  ] };
  const result = prepare(post);
  assert.equal(result.headings.length, 2);
  assert.match(result.blocks[0].content, /id="architecture"/);
  assert.match(result.blocks[1].content, /id="details"/);
  assert.equal(result.blocks[2], post.blocks[2]);
  assert.equal(result.content, post.content);
  assert.doesNotMatch(post.blocks[0].content, /id=/);
});

test('code examples and deliberately excluded headings do not appear in navigation', () => {
  const result = prepare({ content: '<pre><h2>Example only</h2></pre><div data-toc-ignore><h2>Not an article section</h2></div><h2>Real heading</h2><h3 data-toc-ignore>Ignore this too</h3>' });
  assert.equal(result.headings.length, 1); assert.equal(result.headings[0].text, 'Real heading');
  assert.match(result.content, /Example only/);
});

test('long articles remain complete and searchable with subsections grouped beneath their parent', () => {
  const content = Array.from({ length: 70 }, (_, i) => `<h2>Section ${i + 1}</h2><p>Content ${i + 1}</p><h3>Detail ${i + 1}</h3>`).join('');
  const { headings } = prepare({ content });
  assert.equal(headings.length, 140);
  const groups = groupArticleHeadings(headings);
  assert.equal(groups.length, 70);
  assert.equal(groups[0].children.length, 1);
  const found = filterArticleHeadings(groups, 'detail 67');
  assert.equal(found.length, 1); assert.equal(found[0].heading.text, 'Section 67'); assert.equal(found[0].children[0].text, 'Detail 67');
  assert.equal(filterArticleHeadings(groups, 'missing').length, 0);
  assert.equal(filterArticleHeadings(groups, '  ').length, 70);
});

test('leading H3 headings and accented searches still work', () => {
  const groups = groupArticleHeadings([{ id: 'a', text: 'Résumé', level: 3 }, { id: 'b', text: 'Next', level: 2 }]);
  assert.equal(groups.length, 2); assert.equal(filterArticleHeadings(groups, 'resume')[0].heading.id, 'a');
  assert.equal(groupArticleHeadings([]).length, 0);
});

test('navigation labels avoid duplicate numbering while preserving meaningful numbers', () => {
  assert.equal(articleHeadingLabel('16. OneLake Security'), 'OneLake Security');
  assert.equal(articleHeadingLabel('3.1 Internal architecture'), 'Internal architecture');
  assert.equal(articleHeadingLabel('2026 Architecture Guide'), '2026 Architecture Guide');
});

test('removes Master Table of Contents and id="toc" without leaving residual horizontal rules or indexing in sidebar', () => {
  const content = '<div class="snippet"><p>Intro snippet</p></div><h2 id="toc">Master Table of Contents</h2><ul><li><a href="#section-1">1. The 2026 Enterprise Context</a></li></ul><hr /><h2 id="section-1">1. The 2026 Enterprise Context</h2><p>Article body.</p>';
  const result = prepare({ content });
  assert.doesNotMatch(result.content, /Master Table of Contents/);
  assert.doesNotMatch(result.content, /<hr\s*\/?>/);
  assert.match(result.content, /Intro snippet/);
  assert.match(result.content, /Article body\./);
  assert.equal(result.headings.length, 1);
  assert.equal(result.headings[0].id, 'section-1');
  assert.equal(result.headings[0].text, '1. The 2026 Enterprise Context');
});

test('automatically parses raw markdown posts into semantic HTML and generates TOC headings', () => {
  const markdown = `## Introduction

In enterprise data platforms, deployment automation is essential.

### Key Takeaways
* Automated testing is non-negotiable
* Git integration ensures single source of truth

## Architecture & Implementation

Here is the implementation details.

\`\`\`sql
SELECT * FROM pipelines;
\`\`\`

## Frequently Asked Questions

### How to configure service principals?
Use Azure Entra ID app registrations.`;

  const result = prepare({ content: markdown });

  // 1. Verifies TOC headings were automatically discovered and structured
  assert.equal(result.headings.length, 5);
  assert.equal(result.headings[0].id, 'introduction');
  assert.equal(result.headings[0].text, 'Introduction');
  assert.equal(result.headings[0].level, 2);
  assert.equal(result.headings[1].id, 'key-takeaways');
  assert.equal(result.headings[1].level, 3);
  assert.equal(result.headings[2].id, 'architecture-implementation');
  assert.equal(result.headings[2].level, 2);

  // 2. Verifies HTML conversion
  assert.match(result.content, /<h2 id="introduction">Introduction<\/h2>/);
  assert.match(result.content, /<ul>/);
  assert.match(result.content, /<li>Automated testing is non-negotiable<\/li>/);
  assert.match(result.content, /<pre><code class="language-sql">/);
});


