---
type: map
status: active
reviewed: 2026-08-14
tags: [operations, reliability]
---
# Operations Map

## Triage

- [[Service-Health-Triage]] — distinguish process health, dependency failure, and routing failure

## Reliability patterns

- [[Circuit-Breaker-at-the-Edge]] — prevent repeated calls to a failing dependency

## Runbook quality bar

An operational procedure should name its trigger, authority boundary, stop conditions, evidence to preserve, safe diagnostic steps, recovery verification, rollback, and escalation owner. A process restart is an action, not proof that service was restored.
