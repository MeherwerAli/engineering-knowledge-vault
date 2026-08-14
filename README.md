# Engineering Knowledge Vault

A privacy-safe Obsidian starter for turning engineering experience into reusable decisions, runbooks, patterns, and technology evaluations. It is intentionally small enough to understand in minutes and strict enough to stay useful as it grows.

## What this demonstrates

- Information architecture built around maps of content rather than a folder dump
- Architecture Decision Records with status, context, trade-offs, and review triggers
- Operational runbooks with verification, stop conditions, escalation, and rollback
- Evidence-dated technology evaluations instead of timeless recommendation claims
- Automated checks for metadata, headings, duplicate note names, and broken wikilinks
- A public-safe Obsidian configuration with local workspace state excluded

## Start here

Requirements: Obsidian for the editing experience and Node.js 20+ for validation.

```bash
npm run verify
```

Open this directory as an Obsidian vault, then begin at [[00-Home]]. New notes should start from one of the files in `templates/` and be linked from a map in `01-Maps/`.

## Structure

```text
00-Home.md              Entry point and active review queue
01-Maps/                Navigational maps and vault conventions
02-Decisions/           Architecture Decision Records
03-Runbooks/            Repeatable diagnosis and recovery procedures
04-Patterns/            Reusable implementation and operating patterns
05-Reviews/             Evidence-dated technology evaluations
06-Inbox/               Temporary capture before classification
templates/              Obsidian-ready note templates
scripts/                Zero-dependency validator and tests
```

## Metadata contract

Every vault note has YAML frontmatter with:

| Field | Meaning |
| --- | --- |
| `type` | `home`, `map`, `decision`, `runbook`, `pattern`, `review`, or `template` |
| `status` | Lifecycle state such as `active`, `accepted`, `draft`, or `superseded` |
| `reviewed` | Date on which factual claims were last checked |
| `tags` | Small controlled vocabulary for discovery |

The validator intentionally rejects duplicate note filenames. Obsidian can resolve duplicates using paths, but globally unique names keep wikilinks unambiguous in GitHub, search tools, and static-site exports.

## Privacy boundary

This repository contains only synthetic examples and newly authored templates. It excludes personal notes, customer or employer material, credentials, production endpoints, raw incident records, hidden application state, and community-plugin configuration. The `.gitignore` keeps Obsidian workspace state local.

## Design decisions

- **One vault, multiple artifact types.** Decisions and runbooks reinforce each other; splitting them into small repositories would weaken navigation and maintenance.
- **No required community plugins.** The baseline works with Obsidian core features and plain Markdown.
- **Dates over “latest.”** Technology claims include a review date and a trigger for re-evaluation.
- **Validation without dependencies.** The checks use only Node.js standard-library modules, reducing setup and supply-chain surface.

## License

[MIT](LICENSE)
