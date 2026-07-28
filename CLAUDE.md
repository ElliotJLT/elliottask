@AGENTS.md

# Radiant — Persona Chat v2

Rebuild of the persona chat for the Radiant platform. Clients run simulated surveys; every respondent is an AI persona they can interview 1:1. This repo is the chat experience only. The survey graph and results view exist as mocked entry context.

## Product rules

- Every feature answers one of the five client complaints mapped in README.md. If a change doesn't serve one, question it.
- Provenance is the headline feature: persona replies separate data-grounded claims from simulated extrapolation, with citations back to the survey response or profile attributes.
- The chat is mocked, no LLM calls. Mock content is a design surface: canned replies must demonstrate the citation system, not fill space.

## Engineering

- Domain types in `src/lib/types.ts` are shaped the way the production schema would be: one type per table, references as foreign keys, normalised.
- Mock data lives in `src/lib/fixtures/`. Deterministic and typed, no faker.
- Small components over clever ones. No abstractions before the second use. No error handling for states a mocked app can't reach.

## Design

- Match Radiant's existing language: warm neutrals, clean cards, italic serif for verbatim persona quotes, purple/orange/gold data accents. Exact tokens go in `globals.css` once pinned from reference designs.
- Never default to generic AI aesthetics: no Inter-on-white sameness, no purple gradients, no cookie-cutter card grids. Micro-interactions only where they earn their place.
- Design every state: empty, loading, and long-content overflow.

## Verify

- Run the flow in the browser before calling anything done.
- `npm run build` and `npm run lint` pass before every commit.
