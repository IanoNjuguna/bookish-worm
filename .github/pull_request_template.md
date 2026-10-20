Closes #

## What changed

<!-- In the user's terms, not file by file. What can someone do or see now that they could not before? -->

## How it was verified

<!-- The command and its actual result. Name anything you did not verify. -->

```
```

- [ ] `bunx tsc --noEmit` clean in `frontend/app`
- [ ] `bunx tsc --noEmit` clean in `frontend/studio`
- [ ] `bunx tsc --noEmit` clean in `frontend/app/backend/core-api`
- [ ] `aiken check` clean in `frontend/app/contracts` (if validators changed)
- [ ] `bun run lint:design` clean in `frontend/app` (if classes or components changed)

CI only builds `frontend/app` and `frontend/home`, so a green check here is not
the gate. The list above is.

## Decisions and tradeoffs

<!-- What else was possible, and why was it rejected? -->

## Risk and rollback

<!-- Anything on-chain, anything touching money, anything that migrates data. How is it undone? -->
