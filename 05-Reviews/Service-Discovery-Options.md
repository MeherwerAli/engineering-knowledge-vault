---
type: review
status: example
reviewed: 2026-08-14
tags: [architecture, service-discovery, platform]
---
# Service Discovery Options

## Question

Which discovery model should a service platform use when instances are created and replaced dynamically?

## Constraints

- The caller must resolve healthy instances without static host lists.
- The model must fit the deployment control plane already in use.
- Failure and staleness behavior must be observable.
- The team should not operate a second control plane without a concrete need.

## Comparison

| Model | Best fit | Strength | Cost or risk |
| --- | --- | --- | --- |
| Client-side registry | Application-managed or mixed-host platforms | Rich client-side selection and explicit registration | Registry availability, client libraries, and cache behavior become application concerns |
| Platform DNS or native service | Orchestrated workloads | Uses the platform's existing lifecycle and health model | Less application-level selection control; semantics depend on the platform |
| Service-mesh data plane | Platforms already operating a mesh | Central traffic policy without embedding it in every service | Adds operational and debugging complexity |
| Static configuration | Small, stable topologies | Minimal moving parts | Manual updates and poor fit for elastic replacement |

## Example verdict

Use the deployment platform's native discovery unless a verified requirement needs application-level registration or client-side selection. A Eureka-style registry is a good educational and mixed-platform reference because the registration and lookup mechanics are visible. It should not be introduced beside an existing orchestrator merely to duplicate native discovery.

## Evidence to collect before a real decision

- Deployment and scaling model
- Cross-region and hybrid-network requirements
- Instance churn and acceptable propagation delay
- Health semantics and stale-instance behavior
- Team ownership and existing operational control planes

## Review triggers

- Workloads move to a different orchestrator.
- Cross-region routing becomes a requirement.
- Discovery propagation or registry availability causes a measured incident.

## Related

- [[Architecture Map]]
- [[ADR-0001-Explicit-Gateway-Routes]]
