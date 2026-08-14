---
type: runbook
status: active
reviewed: 2026-08-14
tags: [operations, incident-response, health]
---
# Service Health Triage

## Trigger

Use this runbook when health checks fail, the gateway reports no available instances, or a previously healthy route returns elevated `5xx` responses.

## Authority and stop conditions

This procedure authorizes read-only diagnosis. Do not restart, scale, roll back, edit configuration, or fail over traffic without the incident owner approving that action. Stop and escalate if the target environment, service owner, or recent change cannot be identified.

## Inputs

- Affected route and service name
- Environment and region
- Incident start time in UTC
- Recent deployment or configuration-change identifiers
- Links to metrics, logs, and traces available to the responder

## Diagnostic sequence

1. **Confirm the symptom at the edge.** Record status code, latency, timestamp, and correlation identifier from a synthetic request.
2. **Check process health.** Compare liveness, readiness, restart count, and last transition time. A running process is not proof of readiness.
3. **Check discovery.** Confirm whether the expected instance count and status are visible to the gateway or control plane.
4. **Check the dependency path.** Inspect timeouts and errors for the first failing downstream hop rather than assuming the edge is the cause.
5. **Correlate with change.** Compare the incident start time with deployments, configuration updates, certificate changes, and infrastructure events.
6. **Classify the failure.** Choose process, readiness, discovery, routing, dependency, capacity, or unknown. Preserve competing hypotheses when evidence is incomplete.

## Decision table

| Observation | Likely boundary | Next safe action |
| --- | --- | --- |
| Process absent or repeatedly restarting | Runtime or startup | Preserve termination reason and startup logs; escalate to service owner |
| Process healthy but not registered | Discovery configuration or connectivity | Compare registry URL, identity, and registration errors |
| Registered but gateway has no instance | Gateway registry cache or service-ID mismatch | Compare exact service IDs and last registry refresh |
| Route reaches service but dependency times out | Downstream dependency | Trace the first failing hop and apply its runbook |
| All checks green but user path fails | Contract, data, or partial-path issue | Reproduce with the same request shape and correlation context |

## Recovery verification

After an approved recovery action, verify all of the following:

- readiness is stable across multiple probe intervals;
- the expected instance count is visible to the caller;
- a representative request succeeds through the real edge path;
- error rate and latency return to the agreed operating band;
- no new restart, saturation, or dependency alerts appear.

Record which evidence established recovery. Do not use “the restart completed” as the recovery criterion.

## Escalation package

Provide the timeline, environment, affected surface, recent changes, observations, hypothesis states, actions already taken, preserved logs or trace IDs, and the exact authority needed next.

## Related

- [[Operations Map]]
- [[Circuit-Breaker-at-the-Edge]]
