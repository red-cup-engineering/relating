# `streamWitnessLog` Documentation Cycle

Generated through `@emsenn/organizing-with-jsnode`'s cultivate cycle from the current `@emsenn/relating` package surface.

- office: `organizing.modules.content.cultivate.documentSymbol`
- assignment: document `streamWitnessLog` for Node engineers using the witness ledger transport surface
- model: `meta/llama-3.3-70b-instruct` through NVIDIA NIM
- attempts: 2
- shipped: true

## Gates

- `no-hallucinated-api`: pass - every API reference is vouched for by the surface
- `mentions-symbol`: pass - names `streamWitnessLog`
- `summary-length`: pass - summary 12 words
- `details-length`: pass - details 73 words
- `example-fidelity`: pass - the example uses the symbol and shadows nothing
- `prose`: pass - no prose-lint errors
- `example-typescript`: pass - the example type-checks against the package surface

## Entry

### `streamWitnessLog`

```ts
export function streamWitnessLog(log: readonly EAVTRecord[], lastEventId?: string): string
```

streamWitnessLog projects an EAVT witness log into SSE frames for network transport.

streamWitnessLog is used when a developer needs to transport the witness ledger over a network connection, providing a way to resume the stream after a disconnection by projecting an append-only EAVT witness log into SSE frames, allowing a client to resume from a specific point in the log.
Each row in the log becomes a single datom event, with its id set to the row's content identity, maintaining the Scott/CALM property of monotonicity.

**Example**

```ts
const log: readonly EAVTRecord[] = [{ e: 1, a: 2, v: 3, t: 4 }];
const result = streamWitnessLog(log);
```
