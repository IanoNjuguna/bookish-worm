---
name: feature-process
description: Bind every change in this repo to issue, then branch, then a pull request that carries the reasoning. Use before writing the first line of code, before creating a branch, before committing, and before opening or merging a pull request.
type: prompt
whenToUse: When starting any change to this repository (feature, fix, refactor, dependency bump, skill or docs edit) and when shipping one
---

# Feature process

Every change here follows one path:

```
issue  →  branch  →  small commits  →  gates  →  pull request  →  merge
```

One exception: production is down and the fix cannot wait. Even then the issue gets
written afterwards, in the same session, and the PR links it.

`main` is not a scratchpad. CI runs on every push to it (`Design & Build`: design
lint plus `frontend/app` build, and `frontend/home` build), so a broken `main` is
a broken build for everyone. Nothing reaches `main` except through a pull request.

## 1. The issue comes first

`gh issue create` before any code. If these five fields cannot be filled in, the
work is not understood yet, and finding that out costs one paragraph instead of a
branch:

- **Problem.** What is wrong or missing today, and for whom.
- **Scope and non-goals.** What this touches, and what it deliberately does not.
  Non-goals are what stop a fix growing a second head.
- **Acceptance criteria.** Testable statements, not adjectives. "Capped releases
  show `0 / N` and uncapped show `0`" is a criterion. "Supply display improved"
  is not.
- **Risk and rollback.** What breaks if this is wrong and how it is undone. Name
  anything on-chain, anything touching money, and anything that migrates data.
- **Evidence of the gate.** Which check covers this, or which one gets written.

Record the number. The branch and the PR both carry it.

## 2. Branch from current main, named for the issue

```bash
git switch main && git pull
git switch -c feat/15-supply-cap-on-chain
```

The prefix is the kind of change: `feat`, `fix`, `chore`, `docs`, `refactor`,
`test`, `skill`. The number is the issue. Never work on `main`.

## 3. Small commits that stand alone

Conventional commits, and the body explains why, referencing the issue:

```
feat(contracts): cap each release with a one-shot minting policy

The mint validator only checked amounts inside a single transaction, so the
same release could be minted again later (#15).
```

If the shape of the work changes mid-flight, edit the issue in the same session.
An issue that describes a different branch than the one that exists is worse than
no issue.

## 4. Gates, before the PR exists

Run the checks your change can reach. See `check-compiler-errors` for the detail:

```bash
cd frontend/app && bunx tsc --noEmit
cd frontend/studio && bunx tsc --noEmit
# core-api has no tsconfig: tsc from there checks the fan app, not src/
cd frontend/home && bunx tsc -b
cd frontend/app/contracts && aiken check     # needs a PTY, see check-compiler-errors
cd frontend/app && bun run lint:design
```

`bun run lint` is broken repo-wide, so it is not a gate. `bun run build` is not
started automatically: ask first.

**CI is not the gate.** The workflow builds `frontend/app` and `frontend/home`
only. Studio, core-api and the validators get no CI coverage at all, so a green
PR check proves the least interesting half.

Contract changes get one extra step: mint or spend on **preprod** before mainnet,
with the transaction id recorded on the issue. A passing Aiken suite is not a
chain run.

## 5. The pull request carries the reasoning

`gh pr create`, shaped by `.github/pull_request_template.md`:

- `Closes #15`, with a real number.
- **What changed**, in the user's terms, not file by file.
- **How it was verified**: the command and the actual result, including what was
  not verified.
- **Decisions and tradeoffs**: what else was possible and why it was rejected.
- Anything on-chain or money-touching gets its own risk line, and the rollback.

Then merge, delete the branch, and check the issue is closed by the merge rather
than assumed closed.

## What a reviewer is owed

Every claim in the PR is one they could re-run. "Tested" is not evidence; the
command and its output are. If something was skipped, name it in the PR instead
of letting it be discovered later.
