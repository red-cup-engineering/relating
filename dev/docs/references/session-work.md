# `sessionWork` Documentation Cycle

Generated through `@emsenn/organizing-with-jsnode`'s cultivate cycle from the current `@emsenn/relating` package surface.

- office: `organizing.modules.content.cultivate.documentSymbol`
- assignment: document `sessionWork` for Node engineers using the runtime transport/session surface
- model: `meta/llama-3.3-70b-instruct` through NVIDIA NIM
- attempts: 1
- shipped: true

## Gates

- `no-hallucinated-api`: pass - every API reference is vouched for by the surface
- `mentions-symbol`: pass - names `sessionWork`
- `summary-length`: pass - summary 9 words
- `details-length`: pass - details 65 words
- `example-fidelity`: pass - the example uses the symbol and shadows nothing
- `prose`: pass - no prose-lint errors
- `example-typescript`: pass - the example type-checks against the package surface

## Entry

### `sessionWork`

```ts
export function sessionWork(session: Session): WorkNuclei
```

Returns the live work nuclei of a given session.

The sessionWork function derives a judgement and is execution-closed only while no cell conflicts occur, making it useful when a developer needs to assess the state of a claim session.
It drops from derivation to inquiry when a for- and against-claim meet, indicating a conflict.
This function is typically used after opening a session with openSession to obtain the work nuclei associated with that session.

**Example**

```ts
const session = openSession();
const workNuclei = sessionWork(session);
```
