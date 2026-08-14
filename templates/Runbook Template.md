---
type: template
status: active
reviewed: YYYY-MM-DD
tags: [template, runbook]
---
# Runbook Title

## Trigger

What observable condition starts this runbook?

## Authority and stop conditions

What may the responder do, and when must they stop or escalate?

## Inputs

- Environment, service, and time range
- Relevant change identifiers
- Evidence sources

## Diagnostic sequence

1. Confirm the user-visible symptom.
2. Identify the first failing boundary.
3. Preserve evidence before changing state.

## Recovery action

Describe only an explicitly authorized, reversible recovery action.

## Recovery verification

- Direct observation
- End-to-end observation
- Regression or side-effect check

## Rollback

How is the recovery action reversed?

## Escalation package

What evidence and authority request should be handed to the next owner?
