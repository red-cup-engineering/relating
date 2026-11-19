# ProblemResponseOptions

This reference entry was cultivated through the jsnode documentation cycle, not written directly in place.

## Cultivation Witness

- Package surface: `@emsenn/relating`, narrowed to `ProblemResponseOptions`, `App`, `SecurityHeaders`, `CacheControl`, `ReprOptions`, and `jsonRepr`.
- Assignment: source-grounded symbol reference for senior Node maintainers.
- Model route: local Ollama, `phi4-mini:latest`.
- Attempts: 2.
- Gates: 5 passed, 0 failed.
- Remote endpoint note: `NVIDIA_API_KEY` was present, but a trivial NVIDIA/NIM chat-completion probe timed out after 30 seconds, so this run used the local model endpoint.

## Generated Entry

### `ProblemResponseOptions`

```ts
export type ProblemResponseOptions = Readonly<{ headers?: Readonly<Record<string, string>>; cacheControl?: CacheControl | string; security?: SecurityHeaders | true; includeErrorDetail?: boolean; includeStack?: boolean; instance?: string | ((ctx: Context) => string | undefined); }>
```

Defines options for customizing the response of a problem encountered during an operation.

The `ProblemResponseOptions` type specifies headers, cache control, security headers, and additional details to include in the response when a problem occurs, such as error details and stack traces.
It is used to configure the response behavior for error handling in a system that supports multiple transport protocols and formats.

## Operator Note

This passed the current symbol-documentation gates, but the prose is still a small-model reference draft.
It is useful as machine-checked substrate, not as the final conceptual explanation of the HTTP boundary.
