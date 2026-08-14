import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { validateVault } from './validate-vault.mjs';

function note({ type, title, body = '', reviewed = '2026-08-14' }) {
  return `---
type: ${type}
status: active
reviewed: ${reviewed}
tags: [test]
---
# ${title}

${body}
`;
}

test('accepts a linked vault with valid metadata', () => {
  const root = mkdtempSync(join(tmpdir(), 'vault-valid-'));
  mkdirSync(join(root, 'Notes'));
  writeFileSync(join(root, '00-Home.md'), note({
    type: 'home',
    title: 'Home',
    body: 'Read [[Decision One]].',
  }));
  writeFileSync(join(root, 'Notes', 'Decision One.md'), note({
    type: 'decision',
    title: 'Decision One',
  }));

  const result = validateVault(root);

  assert.equal(result.noteCount, 2);
  assert.equal(result.linkCount, 1);
  assert.deepEqual(result.errors, []);
});

test('reports broken links, missing fields, and orphan notes', () => {
  const root = mkdtempSync(join(tmpdir(), 'vault-invalid-'));
  writeFileSync(join(root, '00-Home.md'), note({
    type: 'home',
    title: 'Home',
    body: 'Read [[Missing Note]].',
  }));
  writeFileSync(join(root, 'Orphan.md'), `---
type: decision
status: draft
reviewed: not-a-date
---
# Orphan
`);

  const result = validateVault(root);

  assert.ok(result.errors.some((error) => error.includes('unresolved wikilink')));
  assert.ok(result.errors.some((error) => error.includes('missing required frontmatter field: tags')));
  assert.ok(result.errors.some((error) => error.includes('reviewed must use YYYY-MM-DD')));
  assert.ok(result.errors.some((error) => error.includes('orphan note')));
});
