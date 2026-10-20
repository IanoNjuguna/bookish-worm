---
name: check-compiler-errors
description: Run this repo's compile and type-check gates (four TypeScript projects plus the Aiken contracts) and report failures by file and cause. Use before claiming a change is done, when a gate fails, or when a rename or schema change touches code you did not open.
type: prompt
whenToUse: Before reporting any code change as finished, and whenever a type-check or contract build fails in this repository
---

# Check compiler errors

There are five gates here, not one. Run all of them that your change can reach, and never report a
change as finished on a subset.

## The gates

| Scope | Command | Notes |
| --- | --- | --- |
| Fan app | `cd frontend/app && bunx tsc --noEmit` | AGENTS.md gate. Must stay clean |
| Artist app | `cd frontend/studio && bunx tsc --noEmit` | Own tsconfig, own `node_modules` |
| API | no type gate yet | `core-api` has no `tsconfig.json`, so `tsc` from that directory resolves the fan app's config upward and compiles **zero** backend files (verified: 2,483 files listed, 0 from `src/`). Gate on a boot smoke until the tsconfig lands |
| Marketing site | `cd frontend/home && bunx tsc -b` | Vite plus two tsconfigs (app and node); `-b` builds both. This project is **not** Next.js |
| Contracts | `cd frontend/app/contracts && aiken build` and `aiken check` | `check` runs the Aiken tests |

Also run `cd frontend/app && bun run lint:design` when the change touches classes or components:
`scripts/design-lint.sh` greps for patterns DESIGN.md bans.

`bun run lint` is broken repo-wide (no ESLint config), so type-check plus the contract build are
the gates until that is fixed. `bun run build` is not automatic: ask before starting a Next build.

## The Aiken trap

`aiken build` and `aiken check` print diagnostics **only when stdout is a TTY**. Piped or
captured, a failing build exits 1 and prints nothing but the compile banner, which reads exactly
like a silent crash. Run them through a pty:

```python
import pty, os
out = []
status = pty.spawn(["aiken", "check"], lambda fd: (out.append(os.read(fd, 4096)), out[-1])[1])
print("EXIT", status >> 8)
print(b"".join(out).decode())
```

A summary line at the end (`Summary N checks, 0 errors`) is the proof it ran. Absence of that line
means you learned nothing, not that it passed.

## Workflow

1. **Baseline first** if the change is large or the gate was already dirty: run the gate on the
   untouched tree so pre-existing failures are not credited to you, and so you do not go fixing
   files you never opened.
2. Run the gates your change can reach. A change to a shared file reaches every project that
   imports it; `lib/contractHelper.ts` and the hooks exist in both apps.
3. Summarise failures by project, then by file, then by cause. Distinguish "my change broke this"
   from "this was already broken" explicitly.
4. Fix the highest-confidence failures first, re-running the same command until it is clean.
5. Report the exact commands run and their final state, per project.

## Output

- One line per gate: project, command, pass or fail.
- Failures grouped by file with the error code and a one-line cause.
- What you fixed, what you left, and why.
- Anything you could not run, stated plainly instead of assumed passing.

## Stop conditions

- One file with three failed fix attempts: stop and report rather than churn.
- A gate that fails for reasons outside the diff (missing install, dead network, a peer project's
  own type error): say so, and do not "fix" it by loosening types or excluding files.
