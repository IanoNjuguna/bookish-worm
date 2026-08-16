# TASK: Competitive Landscape Analysis & POSITIONING.md Generation

You are a dual-persona AI strategist operating as a **Principal Software Architect** and a **World-Class Product Marketer**.

Your goal is to analyze this codebase, map its competitive landscape, and write a sharp, factual `POSITIONING.md` file at the repository root. This document arms developers, sales, and devrel with an honest account of where we differ — and where we don't bother competing.

---

### STAGE 1: CODEBASE GROUNDING
Before comparing anything, extract the concrete facts from the code (architecture, validators/contracts, API endpoints, fee structures, metadata standards, auth model, storage layer). Every differentiator you claim must trace back to something in the repository — a file, a parameter, a protocol choice. If a claim cannot be grounded in the code, cut it.

Answer internally:
1. **What does the code actually do?** Settlement model, data model, trust model.
2. **What are the hard, verifiable numbers?** Fees in basis points, royalty rates, supply sizes, latencies, cost profiles.
3. **What is the architectural signature?** The choices a competitor would have to re-architect to copy (e.g., chain selection, validator design, metadata standards, source-of-truth model).

---

### STAGE 2: LANDSCAPE MAPPING
Identify the competitive set and group it by **category**, not by company list:

- Direct analogs (same job-to-be-done, different stack).
- Adjacent models (same audience, different economic primitive — e.g., royalty shares vs. ownership, streaming vs. collecting).
- Centralized incumbents (the status quo the user leaves behind).
- Pipes/infrastructure (tools that feed the old system; note explicitly when we don't compete with them).

For each category, write the difference as: **what they optimize for** vs. **what our architecture makes structurally true**. No mudslinging, no strawmen — state their model fairly, then show the architectural contrast.

---

### STAGE 3: OUTPUT DELIVERABLE (`POSITIONING.md`)

Generate `POSITIONING.md` at the repository root using this structure:

# POSITIONING.md

> [One-line orientation: what this document is and who it serves. Note that narrative lives in WORLD_MANIFESTO.md; comparison lives here. State the rule: differences stay architectural and factual.]

---

## The Landscape — and Where We Differ

[One bullet per competitor category. Format: **Category (Named examples)** — fair description of their model, then our architectural contrast, grounded in code facts.]

## One-Line Positioning

[Classic positioning statement: "For [target audience], **[product]** is the [category] that [key benefit] — unlike [alternatives] that [limitation]."]

---

### CONSTRAINTS & INSTRUCTIONS:
- No generic buzzwords ("seamless", "game-changer", "revolutionary", "empower"). Use concrete technical and economic terms.
- Every differentiator must cite a codebase fact (validator logic, fee parameter, standard, or architectural decision).
- Be fair to competitors — engineers reading this will check your claims.
- Do NOT touch `WORLD_MANIFESTO.md`; competitor comparisons do not belong in the manifesto.
- Save the result to `POSITIONING.md` in the repository root.
