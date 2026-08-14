---
type: decision
status: accepted
reviewed: 2026-08-14
tags: [architecture, gateway, api]
---
# ADR-0001: Use Explicit Gateway Routes

## Context

A service registry can make every service discoverable to infrastructure. That does not mean every registered service belongs on the public API. Automatic edge routes couple external access to internal service names and can expose a new service before its authentication, rate limits, and contract are ready.

## Decision

Define public gateway routes explicitly. Each route must name its path, destination service, path transformation, failure behavior, and owner. Service discovery supplies healthy instances after a route has been approved; it does not grant exposure.

## Consequences

**Positive**

- The public API is reviewable in one place.
- Internal services can register without becoming internet-facing.
- Route-specific circuit breakers and policy can be tested.

**Negative**

- A new public endpoint requires a gateway change.
- Route configuration must be kept aligned with service contracts.

## Alternatives considered

| Alternative | Why not selected |
| --- | --- |
| Automatic discovery locator | Convenient for local exploration, but too broad as a default public boundary |
| Direct service exposure | Duplicates edge controls and leaks internal topology |
| One gateway per service | Strong isolation, but unnecessary operational overhead for the reference scale |

## Review triggers

- The platform adopts a service mesh or ingress control plane that owns equivalent policy.
- Route ownership becomes a delivery bottleneck.
- External APIs require independent lifecycle or regional boundaries.

## Related

- [[Circuit-Breaker-at-the-Edge]]
- [[Service-Discovery-Options]]
