---
type: map
status: active
reviewed: 2026-08-14
tags: [architecture, decisions]
---
# Architecture Map

## Decisions

- [[ADR-0001-Explicit-Gateway-Routes]] — constrain the public API surface at the edge

## Patterns

- [[Circuit-Breaker-at-the-Edge]] — bound failure propagation for synchronous downstream calls

## Evaluations

- [[Service-Discovery-Options]] — choose discovery according to the deployment control plane

## Operating connection

Architecture is not finished when a component diagram exists. Every critical dependency should connect to diagnosis and recovery guidance in [[Operations Map]].
