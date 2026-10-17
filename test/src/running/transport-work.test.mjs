import assert from "node:assert/strict";
import test from "node:test";
import {
  TRANSPORT_WORK, codomainSettlementWitness, classificationOfWitness,
  settlementSignature, actionSettlementSignature, codomainSettlementWitnessKey,
} from "../../../src/running/transport-work.mjs";

test("Relating turns a source-qualified ordinary codomain into request-response", () => {
  const action = { verb: "read", codomain: { schema: { type: "object" } } };
  const signature = actionSettlementSignature(action);
  assert.equal(signature.kind, "relating.action.settlement-signature");
  assert.equal(signature.finality, "normal-form");
  assert.equal(signature.transport, "request-response");
  assert.equal(signature.continuation, "none");
  assert.equal(TRANSPORT_WORK[signature.transport].inputsAndPath, "settled");
});

test("Relating selects resumable transport from an explicit Scott filtration", () => {
  const witness = { kind: "relating.codomain.settlement-filtration",
    limitStage: true, nonScottLimitFiring: false, cofinality: "countable" };
  const action = { verb: "scan", codomain: { schema: { [codomainSettlementWitnessKey]: witness } } };
  assert.deepEqual(codomainSettlementWitness(action.codomain.schema), witness);
  const result = actionSettlementSignature(action);
  assert.equal(result.regime, "scott");
  assert.equal(result.finality, "approximation");
  assert.equal(result.transport, "event-stream");
  assert.equal(result.continuation, "last-event-id");
  assert.equal(result.classification.nonScottFirings.length, 0);
  assert.equal(TRANSPORT_WORK[result.transport].operation, "settled");
});

test("Relating's original codomain schema identity receives the same generated witness", () => {
  const id = "relating/articulating/predicating/positing/settling/filtration";
  const byId = codomainSettlementWitness({ $id: id });
  const byRef = codomainSettlementWitness({ $ref: id });
  assert.deepEqual(byId, byRef);
  const direct = settlementSignature(byId, "observe", "relating.action.settlement-signature");
  assert.equal(direct.finality, "approximation");
  assert.deepEqual(classificationOfWitness(byId, "observe").closure, direct.phase.closure);
});

test("Malformed settlement witness is refused; no host session or authority is fabricated", () => {
  assert.throws(() => classificationOfWitness(null, "anything"), TypeError);
  const noExtension = actionSettlementSignature({ verb: "read", codomain: { schema: {
    [codomainSettlementWitnessKey]: { kind: "unrecognized", limitStage: true },
  } } });
  assert.equal(noExtension.transport, "request-response");
  assert.equal(noExtension.phase.coordinationCost, "none");
});
