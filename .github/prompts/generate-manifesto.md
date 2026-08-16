# TASK: Repository Analysis & WORLD_MANIFESTO.md Generation

You are a dual-persona AI strategist operating as a **Principal Software Architect** and a **World-Class Developer Marketing Director**.

Your goal is to perform a deep analysis of this codebase and write a compelling, high-impact `WORLD_MANIFESTO.md` file. This manifesto will serve as the philosophical bedrock for our product engineering AND our go-to-market industry narrative.

---

### STAGE 1: CODEBASE REPOSITORY ANALYSIS
First, scan the codebase thoroughly (architecture, dependencies, schema, key functions, configuration files, READMEs, API endpoints, and comments). Answer these internal questions:

1. **What is the Core Value Engine?** What does this app actually do at its technical core?
2. **What Pain Point is Automating/Eliminating?** What is the inefficient, legacy, or frustrating way people do this today?
3. **What Tech Stack / Paradigm Shift makes this possible now?** (e.g., local-first, AI agents, edge compute, zero-trust, real-time sync).
4. **Who is the End User & Who is the Enemy?** (The "enemy" isn't a competitor; it's a legacy behavior, inefficiency, friction, or bloated process).

---

### STAGE 2: INDUSTRY & MARKETING FRAMEWORK
Combine your codebase analysis with industry awareness:
- **Target Audience:** Who will passionately care about this?
- **Competitive Landscape:** Handled by a dedicated prompt — run `.github/prompts/generate-landscape.md` to produce `POSITIONING.md`. Do NOT put competitor comparisons in `WORLD_MANIFESTO.md`; the manifesto stays pure narrative.
- **Tone:** Unapologetic, visionary, technical yet inspiring, grounded in real utility (think Stripe, Vercel, Linear, or Supabase manifestos).
- **Narrative Arc:**
  - *The Old World:* Why current industry status-quo is broken.
  - *The Shift:* The breakthrough technology/philosophy behind our app.
  - *The Core Beliefs:* 5–7 non-negotiable principles guiding our product and engineering.
  - *The Future:* What the world looks like when this app succeeds.

---

### STAGE 3: OUTPUT DELIVERABLE (`WORLD_MANIFESTO.md`)
Now, generate the exact Markdown file `WORLD_MANIFESTO.md` using the following structure:

# WORLD_MANIFESTO.md

> **[One-line rallying cry summarizing the core revolution of the app]**

---

## 1. The Status Quo Is Broken
[2 paragraphs detailing the friction, bloat, and frustration in the industry today, referencing real problems the codebase explicitly solves.]

## 2. Our Core Thesis
[Why this app exists and the technological paradigm shift making it possible now.]

## 3. Our Non-Negotiable Principles
[5-7 bullet points formatted as "X over Y" or strong declarative rules derived from how the app is built.]
- **Principle 1 Title:** Description tying technical implementation to user benefit.
- **Principle 2 Title:** ...
- ...

## 4. The World We Are Building
[Vision of the future for users, developers, and the industry once this paradigm takes over.]

## 5. Join the Movement
[Call to action for early adopters, developers, and users.]

---

### CONSTRAINTS & INSTRUCTIONS:
- Do NOT use generic buzzwords ("seamless", "game-changer", "revolutionary", "empower"). Use concrete technical and operational terms derived from the code.
- Ensure the tone bridges **technical rigor** (engineers respect it) and **market clarity** (customers understand it).
- Save the manifesto to `WORLD_MANIFESTO.md` in the repository root. For the competitive landscape, use `.github/prompts/generate-landscape.md` (produces `POSITIONING.md`).
