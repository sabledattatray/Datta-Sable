import { editorialRevisions } from '../content/editorial/revisions';

console.log(`Loaded ${editorialRevisions.length} revisions:`);
editorialRevisions.forEach((r, i) => {
  console.log(`${i + 1}. [${r.wordCount}w] ${r.slug}: "${r.title}"`);
});

