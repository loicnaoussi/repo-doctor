# Contributing

## Setup

```bash
pnpm install
```

## Before opening a PR

```bash
pnpm test          # type-checks and runs the test suite
pnpm lint           # eslint
pnpm format:check   # prettier, check-only
```

`pnpm format` will fix formatting issues in place.

## Adding a check

Every check lives in `src/checks/` and implements the `Check` interface
from `src/checks/types.ts`. Look at `src/checks/license.ts` or
`src/checks/readme.ts` for the shape: a name-variant lookup via
`findEntry` in `src/fs-helpers.ts`, plus a clear pass/fail message written
for a human, not a log.

A check that cannot fail is not a check — each one ships with a test file
in `test/checks/` covering the pass case, the failure case, and at least
one negative control (a repo missing the file entirely). Once the check
is written and tested, add it to `allChecks` in `src/checks/index.ts`.
