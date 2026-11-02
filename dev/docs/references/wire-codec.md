# `wireCodec` Documentation Cycle

Generated through `@emsenn/organizing-with-jsnode`'s cultivate cycle from the current `@emsenn/relating` package surface.

- office: `organizing.modules.content.cultivate.documentSymbol`
- assignment: document `wireCodec` for Node engineers using the runtime wire codec surface
- model: `meta/llama-3.3-70b-instruct` through NVIDIA NIM
- attempts: 1
- shipped: true

## Gates

- `no-hallucinated-api`: pass - every API reference is vouched for by the surface
- `mentions-symbol`: pass - names `wireCodec`
- `summary-length`: pass - summary 7 words
- `details-length`: pass - details 78 words
- `example-fidelity`: pass - the example uses the symbol and shadows nothing
- `prose`: pass - no prose-lint errors
- `example-typescript`: pass - the example type-checks against the package surface

## Entry

### `wireCodec`

```ts
export function wireCodec(name: string): WireCodec
```

Resolve a wire codec by its name.

The wireCodec function is used to retrieve a WireCodec instance by its name, throwing an error if the name is not recognized.
This function serves as a vocabulary witness, allowing developers to access specific wire codecs, such as those listed in WIRE_CODEC_NAMES, including jsonCodec, eavtCodec, and rmnCodec, which are also part of the @emsenn/relating package.
It provides a way to dynamically select a codec based on its name, which can be useful in various encoding and decoding scenarios.

**Example**

```ts
const myCodec = wireCodec('json');
```
