import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ignoredDirectories = new Set(['.git', '.obsidian', 'node_modules']);
const ignoredMarkdownFiles = new Set(['README.md', 'CONTRIBUTING.md']);
const requiredFields = ['type', 'status', 'reviewed', 'tags'];

function toPosix(filePath) {
  return filePath.split(sep).join('/');
}
function markdownFiles(rootDirectory, currentDirectory = rootDirectory) {
  const files = [];

  for (const entry of readdirSync(currentDirectory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const absolutePath = join(currentDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...markdownFiles(rootDirectory, absolutePath));
    } else if (entry.isFile() && extname(entry.name).toLowerCase() === '.md') {
      const relativePath = toPosix(relative(rootDirectory, absolutePath));
      if (!ignoredMarkdownFiles.has(relativePath)) {
        files.push({ absolutePath, relativePath });
      }
    }
  }

  return files.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

function parseNote(file) {
  const content = readFileSync(file.absolutePath, 'utf8');
  const lines = content.replaceAll('\r\n', '\n').split('\n');
  const errors = [];
  const metadata = new Map();

  if (lines[0] !== '---') {
    errors.push('missing opening YAML frontmatter delimiter');
    return { ...file, content, errors, metadata, links: [], title: null };
  }

  const closingDelimiter = lines.indexOf('---', 1);
  if (closingDelimiter === -1) {
    errors.push('missing closing YAML frontmatter delimiter');
    return { ...file, content, errors, metadata, links: [], title: null };
  }

  for (const line of lines.slice(1, closingDelimiter)) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex > 0) {
      metadata.set(line.slice(0, separatorIndex).trim(), line.slice(separatorIndex + 1).trim());
    }
  }

  for (const field of requiredFields) {
    if (!metadata.get(field)) {
      errors.push(`missing required frontmatter field: ${field}`);
    }
  }

  if (metadata.get('type') !== 'template'
      && !/^\d{4}-\d{2}-\d{2}$/.test(metadata.get('reviewed') ?? '')) {
    errors.push('reviewed must use YYYY-MM-DD for non-template notes');
  }

  const headings = lines
    .slice(closingDelimiter + 1)
    .filter((line) => /^#\s+\S/.test(line));
  if (headings.length !== 1) {
    errors.push(`expected exactly one H1 heading, found ${headings.length}`);
  }

  const links = [];
  const linkPattern = /!?\[\[([^\]]+)\]\]/g;
  for (const match of content.matchAll(linkPattern)) {
    const target = match[1].split('|', 1)[0].split('#', 1)[0].trim();
    if (target) {
      links.push(target.replace(/\.md$/i, ''));
    }
  }

  return {
    ...file,
    content,
    errors,
    metadata,
    links,
    title: headings.length === 1 ? headings[0].replace(/^#\s+/, '') : null,
  };
}

function pathWithoutExtension(relativePath) {
  return relativePath.slice(0, -extname(relativePath).length);
}

function resolveLink(source, target, byPath, byBasename) {
  const normalizedTarget = toPosix(target).replace(/^\//, '');
  const relativeTarget = toPosix(join(dirname(pathWithoutExtension(source.relativePath)), normalizedTarget));

  if (byPath.has(normalizedTarget)) {
    return byPath.get(normalizedTarget);
  }
  if (byPath.has(relativeTarget)) {
    return byPath.get(relativeTarget);
  }

  const basenameMatches = byBasename.get(basename(normalizedTarget)) ?? [];
  return basenameMatches.length === 1 ? basenameMatches[0] : null;
}

export function validateVault(rootDirectory) {
  const resolvedRoot = resolve(rootDirectory);
  if (!statSync(resolvedRoot).isDirectory()) {
    throw new Error(`Vault root is not a directory: ${resolvedRoot}`);
  }

  const notes = markdownFiles(resolvedRoot).map(parseNote);
  const errors = [];
  const byPath = new Map();
  const byBasename = new Map();

  for (const note of notes) {
    const key = pathWithoutExtension(note.relativePath);
    byPath.set(key, note);
    const name = basename(key);
    byBasename.set(name, [...(byBasename.get(name) ?? []), note]);

    for (const error of note.errors) {
      errors.push(`${note.relativePath}: ${error}`);
    }
  }

  for (const [name, matches] of byBasename) {
    if (matches.length > 1) {
      errors.push(`duplicate note filename "${name}": ${matches.map((note) => note.relativePath).join(', ')}`);
    }
  }

  const inboundLinks = new Map(notes.map((note) => [note.relativePath, 0]));
  let linkCount = 0;
  for (const note of notes) {
    for (const target of note.links) {
      linkCount += 1;
      const resolvedTarget = resolveLink(note, target, byPath, byBasename);
      if (!resolvedTarget) {
        errors.push(`${note.relativePath}: unresolved wikilink [[${target}]]`);
      } else {
        inboundLinks.set(resolvedTarget.relativePath, inboundLinks.get(resolvedTarget.relativePath) + 1);
      }
    }
  }

  for (const note of notes) {
    const type = note.metadata.get('type');
    if (!['home', 'map', 'template'].includes(type) && inboundLinks.get(note.relativePath) === 0) {
      errors.push(`${note.relativePath}: orphan note is not linked from another vault note`);
    }
  }

  return {
    root: resolvedRoot,
    noteCount: notes.length,
    linkCount,
    errors,
  };
}

function main() {
  const rootDirectory = process.argv[2] ?? '.';
  const result = validateVault(rootDirectory);

  if (result.errors.length > 0) {
    console.error(`Vault validation failed with ${result.errors.length} error(s):`);
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Vault validation passed: ${result.noteCount} notes, ${result.linkCount} wikilinks, 0 errors`);
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  main();
}
