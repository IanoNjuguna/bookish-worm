---
name: skill-gardening
description: Keep this repo's agent skills accurate and modular — update a skill when a mistake, correction, discovery, or standards change reveals it was wrong or incomplete, without duplicating rules across skills
type: prompt
whenToUse: When the user corrects you, a verification gate catches a mistake a skill should have prevented, you discover a project convention or pitfall not covered by any skill, or project standards/dependencies/frameworks change
---

# Skill Gardening

The skills in `.agents/skills/` are living documents. When reality disagrees with a skill, the skill is wrong — fix it in the same session, while the context is fresh. Do not work around a stale skill silently.

## When to update a skill

- **You made a mistake** that a clearer rule would have prevented (e.g. applied Next.js rules to the Vite app, broke a public import path, restyled during a refactor).
- **The user corrected you** — user corrections are the highest-value signal; encode them so they never need repeating.
- **You discovered something new**: an undocumented convention, a load-bearing ID/storage key/provider-order dependency, a verification quirk (e.g. "lint is broken, use tsc + build").
- **Standards changed**: dependency upgrades, framework version bumps, design-token changes in `DESIGN.md`, new verification gates.

## How to update

1. **Find the one skill that owns the concern** (see the ownership table in `AGENTS.md`). Edit that skill only. If no skill owns it, either extend the closest one or — only for a genuinely new concern — propose a new skill to the user.
2. **Make the minimal edit**: add or tighten the specific rule that would have prevented the mistake. Match the skill's existing format (frontmatter, section style, bullet density). No rewrites, no reformatting.
3. **Keep rules general**: encode the lesson, not the incident. "Preserve storage keys verbatim" — not "that time `doba_session_seed` broke". One concrete example in parentheses is fine.
4. **Never duplicate a rule across skills.** If two skills seem to need the same rule, it lives in the skill that owns the concern; the other gets a cross-reference line (e.g. "follow `design-enforcement` for styling").
5. **Update `AGENTS.md`** if the routing/ownership changes (new skill, renamed skill, moved concern).

## What NOT to do

- Don't log session-specific trivia, one-off task details, or things derivable from reading the code.
- Don't grow a skill past its stated concern — a skill that covers everything guides nothing. Splitting an overgrown skill is good gardening; do it with the user's awareness.
- Don't soften or remove rules you merely found inconvenient — only the user retires rules.
- Don't create skills for concerns already covered. Check `.agents/skills/` first.

## Changelog discipline

No separate changelog files. The git history of `.agents/skills/` is the changelog — mention skill updates in your session summary so the user can review the diff.
