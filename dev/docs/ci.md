# CI

The package workflow `.github/workflows/ci.yml` is the first GitHub Actions gate for this package's standalone repository.

It runs on `push` to `main` and on pull requests.
The job:

1. Checks out the package repository.
2. Sets up Node 22.
3. Enables pnpm through Corepack.
4. Installs dependencies.
5. Runs `pnpm run verify`.
6. Runs `pnpm run docs:api`.

This is intentionally narrow.
It proves the package compiles, builds, tests, and has a TypeDoc-readable public surface without taking responsibility for the super-repo fanout.

`verify` includes the runnable examples, so examples cannot silently drift away from the built public API.

Future CI expansions should consider:

- downstream smoke checks for the core faculty packages
- a Lean fixture regeneration check when the Lean submodule changes
- an IR audit check that fails only once the migration policy requires all carrier morphisms to have `runTerm`
- publishing dry-runs when the package stops being private
