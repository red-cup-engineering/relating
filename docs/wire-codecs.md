# Graded Wire Codecs

The wire codec vocabulary is the package's argv/stdin/stdout boundary for actions.
It is also the point where the representation projector lattice becomes operational: each wire inherits a content corner and completion rung from the `@red-cup-engineering/computer-content-engineering-services-section` projector it adapts.

Public handles:

- subpath: `@red-cup-engineering/relating/wire`
- `WIRE_CODEC_NAMES`
- `wireCodec(name)`
- `wireByMediaType(mediaType)`
- `wireOf(projector)`
- built-in codecs: `stringCodec`, `jsonCodec`, `eavtCodec`, `formCodec`, `senCodec`, `svgCodec`, `mermaidCodec`, `xmiCodec`, `plantUmlCodec`

The current finite vocabulary is:

- `string`: `text/plain`, corner `bottom`, rung `strict`
- `json`: `application/json`, corner `data`, rung `strict`
- `eavt`: `application/eavt+jsonl`, corner `assertion`, rung `strict`
- `form`: `application/x-www-form-urlencoded`, corner `data`, rung `strict`
- `sen`: `application/sen+json`
- `svg`: `image/svg+xml`
- `mermaid`: `text/vnd.mermaid`
- `xmi`: `application/xmi+xml`
- `plantuml`: `text/x-plantuml`

## Product Reading

Most Node command surfaces treat formats as a bag of parser flags.
Here, a wire is a small projection theorem:

```text
boundary document -> writing projector -> carried JSON value -> action morphism
```

`wireOf(projector)` enforces the important invariant.
If the projector reads at an undecidable rung, it cannot become an action wire.
Read-capable projectors must satisfy the upstream finite-decidability law through
`readIsDecidable`; write-only projectors are exempt. The grade describes reading
the represented syntax, not executing the programme it carries.

That is why SEN can be a wire without letting JavaScript become one.
The SEN wire inherits the `senProjector` gate: a closed, well-typed SEN term can travel as `application/sen+json`; arbitrary host code cannot.

## Serving Negotiation

The HTTP serving path uses the same vocabulary.
An explicit `output-format` query parameter selects a wire by name.
Without that explicit selection, the `Accept` header is negotiated against the offered wire media types, but only along the content-corner order.

The practical rule:

- a `data` value may be served as JSON or text
- a `data` value is not silently upgraded to Turtle, EAVT, or SEN assertion
- an `assertion` value may be settled down to JSON when requested
- an explicit `output-format` is treated as a caller-selected wire name

This is the boring, brutal Node-engineering part that makes the wild part usable: the same carrier morphism can cross CLI, HTTP, forms, MCP, and tests without each transport inventing a slightly different parser story.

## Example

```js
import { wireCodec, WIRE_CODEC_NAMES } from "@red-cup-engineering/relating/wire";

for (const name of WIRE_CODEC_NAMES) {
  const codec = wireCodec(name);
  console.log(name, codec.mediaType, codec.corner, codec.rung);
}
```

See [`examples/action-apex.mjs`](../examples/action-apex.mjs) for the runnable probe that prints the live wire vocabulary beside the action-face counts.

## Declaration admission versus codec execution

The existing media-type table lives in the inert internal wire vocabulary leaf.
Operation declarations validate their input/output names there without loading
format projectors. This does not provide a codec or grant execution authority.
The full synchronous wire registry still owns all nine real codecs and checks
that its own key set exactly matches the same metadata. Both boundaries refuse
unknown and inherited prototype names. The tuple EAVT compatibility export and
all SVG/XML behavior are retained; rendering consumers still need their actual
XML suppliers. No codec is replaced by a deferred or placeholder implementation.

The open `wireOf` adapter still accepts custom projector types. Unregistered
types, including prototype-shaped names, use application/octet-stream unless
an explicit mediaType override is supplied; only own metadata supplies defaults.
