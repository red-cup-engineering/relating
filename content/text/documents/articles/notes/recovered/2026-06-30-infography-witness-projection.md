# Witness Projection

The witness-material surface is the package's smallest practical settling substrate:

```text
observation -> EAVT witnesses -> current state -> record/content projections
```

It is deliberately boring at the boundary.
A feed turns one observation into EAVT cells.
The store appends new cells to a JSONL witness log.
Projection folds that log into the current state view, and optional content projections cut the state into term-addressed documents.

That gives downstream code a substrate-oriented coordination pattern: write typed observations, merge by witness identity and knowledge accumulation, and derive the views needed by CLIs, sites, agents, or content tools.

The four tiers are intentionally different and are now carried as the RWIL information chain:

- `log`: the source, asserted EAVT witness rows with `E/A/V/T` row identity.
- `state`: the sufficient statistic for current-value query classes.
- `record`: a rate-distortion code of settled Datom invariants plus kept rows.
- `content`: a lossy per-entity document cut of projected state.

`@emsenn/infography/persistence` exposes this as `rwilInformationChain()`.
It also exposes `witnessLogInformation(log)`, which reads canonical witness-row identity: repeated append attempts add zero surprisal, so source entropy is counted by unique row identities rather than raw attempts.

The contract-calculus surface for these tiers lives in `@emsenn/infography/registries`.
`witnessInstruments` exposes infocosm ingress, invocation exposure, the RWIL information chain, stateless data-dir persistence, state/content/record projection, Memento TimeGate/TimeMap reads, and SSE streaming as relational instruments with phase, lens, witness policy, carrier presentations, and derived obligations.

## The Smallest Feed

```js
import {
  listContentEntries,
  projectFeedContent,
  projectFeedState,
  readContentResource,
  readContentTree,
  witnessObservation,
} from "@emsenn/infography/services/filesystem-store";

const feed = {
  name: "claims",
  functional: ["status"],
  cellize(observation, at) {
    return [
      [observation.claim, "status", observation.status, at],
    ];
  },
};

const store = {
  logDir: ".infography/log",
  stateDir: ".infography/state",
  recordDir: ".infography/record",
  contentDir: ".infography/content",
};

const append = witnessObservation(store, feed, { claim: "c1", status: "supported" }, "run:1");
const state = projectFeedState(store, feed);
const content = projectFeedContent(store, feed, { view: state.view });
const entries = listContentEntries(store.contentDir, "");
const resource = readContentResource(store.contentDir, "c1/c1.md");
const tree = readContentTree(store.contentDir);
```

The log is append-only.
`appendWitnesses` deduplicates by normalized EAVT row identity, so repeating the same observation does not grow the log.
Functional attributes use latest-witness-wins when projected into state.
The return values are not just counts, views, or paths: each carries the data-dir operation's `RelationalContract`, `ContractExposure`, and `ContractExposureReport`.
For example, `append.appended` is the growth signal, while `append.path` is the durable `data/logs` artifact to pass to the next move; `readWitnessLogPath(append.path)` can read that artifact without retaining the original in-process store object.
Likewise, `projectLogPathState(append.path, functionalAttributes)` projects a `data/state` artifact from the path itself.
`state.view` is the projected state, while `state.path` is the `data/state` artifact written by the projection.
Those same paths are exposed inside the contract boundary so callers can check that the path they pass downstream is the path the witness policy accounted for.
The content reader functions follow the same rule: `entries.entries`, `resource.resource`, and `tree.resources` are ordinary payloads carried beside `data/content` contract exposures.

## Records And Compaction

`commitRecord` is the small settlement move in this surface.
It appends Datoms to the record tier and rewrites the live log to the kept rows supplied by the caller.
The package does not decide which rows are settled, obsolete, or worth keeping; it only provides the carrier and store operation for recording that judgment.
Like append/read/state/content projection, `commitRecord` returns a report-bearing observation of the `data/record` move.

That makes the witness store useful before there is a database, queue, or distributed consensus layer.
A package can keep a monotone witness log during live work, project a state view for tools, write content cuts for humans, and compact settled rows only when some caller has computed an explicit reading.

## Store Interface And Effects

`@emsenn/infography/sites/infocosm` is the package root site.
It presents the package as one site with `lib`, `src`, and `apps` access faces, admits source/media/body/time material as opaque boundary material at root ingress, exposes that ingress under a relational contract, and emits exact EAVT tuples that can be appended through the RWIL store interface.
The same capability is registered as `infography.instrument.sites.infocosm-ingress`, whose carrier presentations admit `infography/sites/infocosm`, `infography/sites/infocosm/surface`, `infography/sites/infocosm/ingress`, and `infography/witness/eavt-log`; its refinements are the site surface, admission, EAVT projection, exposure, and RWIL append functions in `sites/infocosm`.
The running apex exposes `GET /` as the infocosm surface and `POST /` as root ingress: callers post JSON ingress material, the route appends exact EAVT rows through `ServeOptions.infocosmStore`, and the response carries both the infocosm exposure and the ordinary route exposure.
The live `infograph-serve` binding supplies a filesystem RWIL store for root ingress when `INFOGRAPHY_DATA` is set, so HTTP ingress writes durable `data/logs/YYYY/MM/DD/...jsonl` artifacts.

`@emsenn/infography/stores` owns the package-phase RWIL store interface.
It derives `data/` artifact addresses, recovers store/feed handles from log paths, and provides `memoryWitnessStore(...)` as a host-neutral implementation.
That layer has no filesystem authority: it states that RWIL moves pass artifact paths, not process-local store objects.

## What Owns Effects

The effectful boundary is `@emsenn/infography/services/filesystem-store`.
It imports `node:fs`, consumes the store/path law from `@emsenn/infography/stores`, and performs append, path-read, path-projection, atomic write, and confined content-tree read operations as the filesystem refinement of that store interface.

The projection logic is otherwise ordinary data transformation:

- `Feed.cellize` maps observations to EAVT cells.
- `projectStateView` folds cells into the current entity view.
- `projectContentDocuments` renders accepted entities into documents.
- `ContentProjection.accept` is the explicit cut over the current view.

This split matters because the package wants one canonical trace field with many cheap shadows: current state, content files, audits, action witnesses, and later settled records.
The witness instruments make that split inspectable: the log is the source material, the data directory is a boundary carrier, and each projection states what it preserves and hides.
The content-store contracts make the inverse content read accountable too: listing a directory, reading one resource, or walking a bounded subtree exposes `data/content` through an observational lens rather than returning an unlensed filesystem value.
The stream projection follows the same rule: `streamWitnessLog` is the pure frame projection, while `feedResponse` returns the `text/event-stream` response beside its stream contract exposure and exposure report.
Memento is the time-web face of the same material: `infography.instrument.witness.memento-timegate` reads `state@T` from the witness-log prefix selected by `Accept-Datetime`, and `infography.instrument.witness.memento-timemap` lists the available snapshot datetimes and prefix witness counts.

## What This Is Not Yet

This is not a distributed database, queue, or consensus system.
The current Node surface is a filesystem binding plus pure projections.
It is enough to make the coordination pattern concrete: persist traces, keep contradictions visible in the substrate, and project finite views for tools that need ordinary files or JSON.

Use this surface when a downstream package needs append-only observations and derived read models.
Use [scripted invocation witnesses](scripted-invocation-witnesses.md) when the observation is an invocation of a registered carrier morphism.

For the pure RWIL information-chain read, see [`examples/package/rwil-information-chain.mjs`](../examples/package/rwil-information-chain.mjs).
For package-apex resource readback of the witness instruments, see [`examples/package/relational-instrument.mjs`](../examples/package/relational-instrument.mjs).
