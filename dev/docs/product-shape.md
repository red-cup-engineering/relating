# Product Shape

This note is for maintainers trying to describe `@emsenn/relating` without flattening it into either marketing language or private mathematical shorthand.
It is not a promise of future features.
It names the product-shaped surfaces that already exist in code, tests, examples, and downstream usage.

## The Burned-Out Node Reading

Most serious TypeScript systems end up authoring the same intention several times:

- static types
- runtime validators
- JSON Schema or OpenAPI documents
- route handlers
- CLI wrappers
- tool descriptors
- docs
- logs and audit trails

Those copies drift.
The common ecosystem answer is another generator, decorator layer, or framework convention.
`@emsenn/relating` is trying a different shape: author the carrier and the operation once, then project the needed faces from that one object.

That is the ordinary software reason this package matters.

## The Actual Product Core

The core product is not "relations."
The more accurate engineering phrase is typed settling substrate.

In this package:

- a carrier is an admitted object with a TypeBox schema, static type, validator, and JSON Schema identity
- an action is a named boundary operation with declared wire codecs and, when it is a true morphism, carrier domain and codomain
- a `runTerm` is an operation body carried as Relation Model Notation, a JSON s-expression language with a typed CHL core and total structural primitives
- `induceBins` projects one action family to discovery, CLI, HTTP, OpenAPI, MCP, browser form, and dispatch faces
- invocation witnessing records boundary calls as EAVT rows
- holography projects append-only witness material into state, records, content, and resource cuts

The action system is the first good user-facing grip on that substrate: it lets package authors define a carrier morphism once and get the ordinary Node-facing surfaces from it.
The deeper product is the shared field underneath those surfaces: sparse predications, FOUR-valued charge, append-only witnesses, pure projections, and finite read models.

The unusual step is `runTerm`: behavior can be data.
A pure package operation is not necessarily an opaque TypeScript callback.
It can be a closed, inspectable, serializable term which the dispatcher evaluates and the docs/tests/examples can read.

## Already Visible Downstream

This is not only an internal theory of `lib/relating`.

Current repository usage shows several layers:

- the faculty and site package manifests broadly depend on `@emsenn/relating`
- `communicating`, `knowing`, `computing`, `playing`, and `animating` contain non-trivial `runTerm` actions
- the organizing and agent-facing packages contain many identity `runTerm` actions, showing the carrier/action idiom spreading even where richer terms are not yet authored
- downstream packages import the root algebra for `mark`, `utterance`, FOUR charge carriers, evidence, and settlement readings
- downstream package CLIs and servers commonly use `induceBins`, `dispatch`, and `serve`
- content and computing packages import codecs and holography projection helpers

So the package already operates as a contract layer, an algebra layer, a transport layer, and an emerging behavior-as-data layer.

## What To Say Carefully

Good descriptions:

- "Relating turns package APIs from opaque handlers into typed, inspectable morphisms where the operation is pure enough to be carried as RMN."
- "Relating is a schema-first action runtime whose transports, tool surfaces, witness logs, and docs are projections of one action registry."
- "Relating gives Node packages a carrier/action discipline: objects compose by schema identity, and true morphism bodies can be represented as total terms."
- "Relating is the Node reach layer for a sparse FOUR-valued predication and settling substrate: one trace field, many lawful projections."

Descriptions that are too weak:

- "a relations library"
- "a validation helper"
- "an HTTP framework"
- "a workflow engine"

Descriptions that are too strong today:

- "a fully verified runtime"
- "a complete Lean extraction target"
- "a general theorem prover for package APIs"
- "a replacement for every JavaScript callback"
- "a finished replacement for graph databases, CRDTs, workflow engines, or audit systems"

The current truth is narrower and more interesting: the package has a Lean-grounded term kernel and conformance fixtures for core mathematics, but carrier-specific morphisms are still checked differentially against real package behavior.
That is good engineering.
Do not blur it.

## Internal Products To Keep Separating

The package contains several products in one codebase:

- **Carrier Kernel**: TypeBox carriers, schema registry, validator, composition by `$id`, and serializable morphism faces.
- **RMN Runtime**: term grammar, evaluator, type checker, carrier bridge, term catalogs.
- **Action Apex**: action registration, dispatch, CLI/HTTP/OpenAPI/MCP/web projection.
- **Witness Projector**: invocation log and holographic projection to state, records, and content.
- **FOUR Algebra**: paraconsistent charge and evidence calculus.
- **Formal Concept Analysis Terms**: executable RMN derivation operators for intents, extents, closure, and concept construction over predication cells.
- **Chu Space Terms**: finite FOUR-valued matrix duality, lookup, and double-dual witness as executable RMN terms.
- **Settlement Analysis Bench**: exact naturals/rationals/matrices, Laplacian and spectral reads, evidence distributions, conservation, and differential findings over settled relation material.
- **Representation Codecs**: canonical JSON, schema/markdown/EAVT projections, Turtle/HTML/XML/SVG boundaries, and radial relation diagrams as projector surfaces.
- **Relational Descent Engine**: utterance -> articulation -> predication -> positing -> settlement, with settlement readers.
- **Carrier Manifold**: carrier-node mounting for composing package apices at the object they consume.
- **Lean Conformance Bridge**: committed Lean-emitted golden vectors replayed through TypeScript and RMN for the finite algebra/calculus surfaces.

Those names may change, but the separation matters.
Each is real enough to document and demonstrate.
None should be oversold as standalone until its public surface, examples, and verification story are clear.

## The Useful Product Sentence

Working sentence:

> `@emsenn/relating` is a schema-first settling substrate for TypeScript packages: carriers define the objects, actions define typed morphisms, RMN can carry pure behavior as total inspectable data, witnesses record boundary facts, and the package projects one registry and trace field to CLI, HTTP, OpenAPI, MCP, web forms, state, content, and docs.

That sentence is still dense, but it is not decorative.
Every clause names something implemented in the package today.
