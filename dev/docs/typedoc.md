# TypeDoc

TypeDoc is the closest generated documentation to the package's public machine contract.
The package-local config is `typedoc.json`; the command is:

```sh
pnpm run docs:api
```

It documents the package through the source entrypoints that back the public `exports` map and emits HTML to `.tmp/typedoc`.
TypeDoc's package strategy is not used here because `lib/relating` is itself a package nested inside the larger workspace; direct source entrypoints fit this repo shape better.

## Validation Policy

The package config disables `notExported`, `invalidLink`, and `notDocumented` validation warnings for now.
This is intentional for this stage:

- the root export deliberately rolls up a large mathematical surface
- many referenced witness/obstruction helper types are internal components of exported judgment unions
- the next useful signal is whether TypeDoc can render the package surface at all

This does not mean those warnings are unimportant.
It means they are a doc coverage frontier, not a CI blocker yet.

## Future Tightening

Tighten in this order:

1. Export or intentionally hide helper types that appear in public judgment unions.
2. Add module-level `@packageDocumentation` to important subpaths.
3. Turn `invalidLink` validation back on once cross-subpath links are stable.
4. Turn `notExported` validation back on once judgment helper visibility is deliberate.
5. Only then consider `treatValidationWarningsAsErrors`.
