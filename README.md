# Relating

Relating provides claim sessions and relational terms over SignCraft. Sessions
keep an append-only claim history, read judgement in one FOUR family, and retain
opposed claims as a contested judgement. The relational terms cover predication,
settlement, formal concepts, and the mathematical readings used by those
operations. SignCraft supplies their implementations and is Relating's only
dependency.

```js
import { claim, conflicts, openSession } from "@red-cup-engineering/relating";

const one = claim(openSession("extremal"), "claim:one", "held");
const two = claim(one, "claim:one", "denied");
console.log(conflicts(two)); // ["claim:one"]
```

## Updating from 0.11

The 0.12 line keeps the claim-session calculus, relational terms, and
`./evaluating/*` entries. The boundary APIs are available from the following
owners.

| Former Relating API | Import from |
| --- | --- |
| Operations, declarations, execution contexts | Computer Engine `./rpc/operation`, `./rpc/operation-declaration`, `./rpc/execution-context` |
| Operation catalog for inducing, positing, realizing, and inspecting relations | Computer Engine `./rpc/signcraft-operations` and its `./inducing`, `./positing`, and `./realization` entries |
| Wire formats and operation settlement signatures | Computer Engine `./wire`, `./wire-eavt-tuple`, `./rpc/settlement-signature` |
| Claim-session observations, continuations, and EAVT feeds | Communicating `./claim-session` and `./claim-session/schema` |
| Schema construction, structural types, conformance, and TypeScript projection | JSON Schema `./contracts`, `./structural-type`, `./conformance`, and `./typescript` |
| Diagram admission and sequence readout | Graph Serialization `./presented-category` and `./diagram-sequence` |
| Diagram formats | Mermaid `./presented-category`, Graph Serialization `./plantuml`, and XML Document Rendering `./xmi` and `./svg/presented-category` |

Term and type schemas come from Computer Code Engine
`./semiotic-expression-notation`. Cell, utterance, and evidence schemas come
from SignCell and SignChain. EAVT ledger schemas remain available on the EAVT
ledger entries. An application can pass these schemas to JSON Schema's
`schemaFrom` when it needs a contract.
