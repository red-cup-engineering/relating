// running/transport-work — each transport's work determination.
//
// A transport is a unit of work; its kind fixes whether its operation (the output
// type) and its inputs and path are settled. A request/response serve names its
// codomain but dispatches (operation settled? no, it opens; path settled); an SSE
// feed is settled in both; a settled claim session derives a judgement without
// branching; an open or conflicted session leaves both open. These are
// determination coordinates, not evidence values: animating's classifyWork names
// the four kinds (inquiry, derivation, procedure, process).

import { conflicts } from "./session.mjs";
import { cell } from "@red-cup-engineering/signcell/cell";
import { classify, filtration } from "@red-cup-engineering/signcraft/settle";
import { phaseSignature } from "@red-cup-engineering/signchain/contracts/phase";

/** Each transport kind's work determination. */
export const TRANSPORT_WORK = Object.freeze({
  "request-response": Object.freeze({ operation: "open", inputsAndPath: "settled" }),
  "event-stream": Object.freeze({ operation: "settled", inputsAndPath: "settled" }),
  "claim-session": Object.freeze({ operation: "settled", inputsAndPath: "open" }),
  "open-session": Object.freeze({ operation: "open", inputsAndPath: "open" }),
});

/** The live determination of a claim session: a derivation (operation settled,
 *  inputs and path open) while no cell conflicts; a conflict is a branch in the
 *  determination, so the session drops to an inquiry (both open). */
export function sessionWork(session) {
  return Object.freeze({ operation: conflicts(session).length === 0 ? "settled" : "open", inputsAndPath: "open" });
}

/**
 * Agent-action settlement signatures and transport choices belong to the
 * Relating runtime, not to pure SignCraft settlement. The original SignCraft
 * source below is received here without changing its semantics: SignCraft
 * classifies a filtration, SignChain reads its phase, and Relating selects the
 * operational transport and continuation for an action's codomain.
 */
const WITNESS_KEY = "x-settlement-filtration";
const SETTLEMENT_FILTRATION_ID = "relating/articulating/predicating/positing/settling/filtration";


function schemaRef(schema) {
  const ref = schema?.["$ref"];
  return typeof ref === "string" ? ref : undefined;
}

function isCodomainSettlementWitness(value) {
  if (typeof value !== "object" || value === null) return false;
  const record = value;
  return record["kind"] === "relating.codomain.settlement-filtration";
}

export function codomainSettlementWitness(
  schema,
) {
  const authored = schema?.[WITNESS_KEY];
  if (isCodomainSettlementWitness(authored)) return authored;
  if (schemaRef(schema) === SETTLEMENT_FILTRATION_ID || schema?.["$id"] === SETTLEMENT_FILTRATION_ID) {
    return { kind: "relating.codomain.settlement-filtration", limitStage: true, nonScottLimitFiring: false, cofinality: "countable" };
  }
  return { kind: "relating.codomain.settlement-filtration", limitStage: false, nonScottLimitFiring: false, cofinality: "countable" };
}

/** The cell a codomain witness's non-Scott firing designates. */
const witnessCell = (label) => cell(["codomain", label], "settles-as", ["codomain", label]);

/** The classification of a codomain witness: a presented filtration — an initial stage, then a limit stage
 *  (at ω) when the witness has one, designating the witness cell when that firing is non-Scott — read by
 *  SignCraft's classify. */
export function classificationOfWitness(witness, label) {
  const stages = [{ ordinal: 0, shape: "initial", designated: [] }];
  if (witness.limitStage === true) {
    stages.push({ ordinal: "ω", shape: "limit", designated: witness.nonScottLimitFiring === true ? [witnessCell(label)] : [] });
  }
  return classify(filtration(stages, witness.cofinality === "uncountable" ? "uncountable" : "countable"));
}

/** The transport a settlement phase's finality admits. */
const transports = Object.freeze({
  "normal-form": Object.freeze({ transport: "request-response", continuation: "none" }),
  approximation: Object.freeze({ transport: "event-stream", continuation: "last-event-id" }),
  stage: Object.freeze({ transport: "event-stream", continuation: "last-event-id" }),
  unattained: Object.freeze({ transport: "websocket-session", continuation: "websocket" }),
});

/** The settlement signature a codomain witness reads: the settlement phase of its classification's
 *  closure data and the transport that phase admits. */
export function settlementSignature(witness, label, kind) {
  const classification = classificationOfWitness(witness, label);
  const phase = phaseSignature({ id: `settlement:${label}`, closure: classification.closure });
  return Object.freeze({
    kind,
    regime: phase.regime,
    finality: phase.finality,
    coordinationCost: phase.coordinationCost,
    ...transports[phase.finality],
    phase,
    classification: Object.freeze({
      kind: classification.kind,
      cofinality: classification.cofinality,
      limitStages: classification.limitStages,
      nonScottFirings: classification.nonScottFirings,
    }),
  });
}

/** An action's settlement signature, read off its codomain schema's witness. */
export const actionSettlementSignature = (action) =>
  settlementSignature(codomainSettlementWitness(action.codomain?.schema), action.verb, "relating.action.settlement-signature");

export const codomainSettlementWitnessKey = WITNESS_KEY;
