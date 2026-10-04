# Professional Storytelling

How a professional story earns its place and stays public-safe. Referenced by CAP-4, CAP-5, CAP-6 and the public-safe-boundary constraint. Sources: `PRD.md` §6, §7.7.

Governing principle:

> **Show the thinking, not the secrets.** (D-14)

## Story evidence model

A professional story provides enough evidence for a visitor to understand **how Alisha operated**, not merely what she worked on. Where applicable, a deep story addresses:

1. Problem and business context
2. Ambiguity or complexity
3. Constraints
4. Alisha's personal ownership
5. Decision made
6. Decision rationale
7. Tradeoffs or consequences
8. Collaboration and team impact
9. Outcome
10. Hindsight or reflection

The story should make room for statements such as: why this decision was appropriate at the time; what information influenced it; what changed because of it; what Alisha would do differently in hindsight; and why she would make the same decision again, when appropriate.

An ADR-like reasoning model may be used where useful, but ADR terminology is not a visitor-facing requirement. The product requirement is the **evidence of reasoning**, not the format. Generic adjectives must not substitute for evidence (FR-16).

## Public-safe boundary

### May include (FR-20)

- Generalized problem classes
- Generalized business context
- Alisha's role
- Public-safe technologies
- Generalized architecture patterns
- Decisions
- Tradeoffs
- Collaboration patterns
- Generalized outcomes
- Lessons learned

### Must not expose (FR-21)

- Proprietary architecture
- Customer information
- Internal system names
- Sensitive metrics
- Credentials or secrets
- Sensitive operational details
- Company-confidential implementation specifics

The need to protect confidential information must not become an excuse to make professional contribution invisible; maximize evidentiary value while minimizing disclosure risk (C-3).
