import {
  claim, conflicts, judge, openSession, sessionRegime, sessionWork, settle,
} from "./running/session.mjs";
import {
  intentOfExtentTerm, extentOfIntentTerm, closeExtentTerm, isConceptPairTerm, formalConceptTerm,
} from "@red-cup-engineering/signcraft/evaluating/connecting";
import {
  classifyRegimeTerm, cohomologyVanishesInRegimeTerm, measureIsValuationTerm,
  conditionalViaFiberAdjointTerm, markovStationaryIsClosureFixpointTerm,
  stochasticIsValueSettlingTerm, expectationLawsTerm, detailedBalanceImpliesStationaryTerm,
  rankVanishingTerm, rankIdentityTerm, rankComparisonTerm, cohomologyCarrierTerm,
  cohomologyLaplacianTerm, bigradedCohomologyTerm, settlingFirstCohomologyTerm,
} from "@red-cup-engineering/signcraft/evaluating/measuring";

export * from "./running/session.mjs";
export * from "@red-cup-engineering/signcraft/relation-terms";
export * from "@red-cup-engineering/signcraft/evaluating/counting";
export * from "@red-cup-engineering/signcraft/evaluating/connecting";
export * from "@red-cup-engineering/signcraft/evaluating/measuring";

export const running = Object.freeze({
  claim, conflicts, judge, openSession, sessionRegime, sessionWork, settle,
});

export const measurement = Object.freeze({
  classifyRegime: classifyRegimeTerm,
  cohomologyVanishesInRegime: cohomologyVanishesInRegimeTerm,
});

export const probability = Object.freeze({
  measureIsValuation: measureIsValuationTerm,
  conditionalViaFiberAdjoint: conditionalViaFiberAdjointTerm,
  markovStationaryIsClosureFixpoint: markovStationaryIsClosureFixpointTerm,
  stochasticIsValueSettling: stochasticIsValueSettlingTerm,
  expectationLaws: expectationLawsTerm,
  detailedBalanceImpliesStationary: detailedBalanceImpliesStationaryTerm,
});

export const cohomologyTerms = Object.freeze({
  rankVanishing: rankVanishingTerm,
  rankIdentity: rankIdentityTerm,
  rankComparison: rankComparisonTerm,
  carrier: cohomologyCarrierTerm,
  laplacian: cohomologyLaplacianTerm,
  bigraded: bigradedCohomologyTerm,
  settlingFirst: settlingFirstCohomologyTerm,
});

export const fca = Object.freeze({
  intentOfExtent: intentOfExtentTerm,
  extentOfIntent: extentOfIntentTerm,
  closeExtent: closeExtentTerm,
  isConceptPair: isConceptPairTerm,
  formalConcept: formalConceptTerm,
});
