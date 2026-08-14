---
type: map
status: active
reviewed: 2026-08-14
tags: [knowledge-system, governance]
---
# Vault Guide

## Artifact choice

| Question | Artifact |
| --- | --- |
| Why did we choose this? | Decision record |
| How should this design behave? | Pattern |
| How do we diagnose and recover it? | Runbook |
| Which option fits these constraints? | Technology review |

## Evidence rules

- Date claims that can drift.
- Link observations to a decision without copying private raw data.
- Distinguish a test result from production behavior.
- Record alternatives and review triggers, not just the winning choice.
- Mark uncertainty instead of converting it into a confident recommendation.

## Link rules

- Use globally unique filenames.
- Link every durable note from at least one map.
- Prefer descriptive wikilinks over folder-based navigation.
- Run `npm run verify` before sharing changes.
