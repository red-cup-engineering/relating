/**
 * schema is the contract kernel for schema literals, validators, static shape reading, drift checks, and explicit schema incidence.
 * It may import values and contract declarations, but it must not import records, logic, fixpoint, math, codecs, capability, rendering, or search.
 */

export { SchemaContractSchema, schemaFrom } from "@red-cup-engineering/json-schema-engineering-services-section/contracts";
export {
  schemaConformanceVerdictSchema,
  schemaConformanceVerdict,
  conformanceOf,

} from "./conformance.mjs";
export {

  unknownType,
  neverType,
  primitive,
  literal,
  array,
  tuple,
  ref,
  objectType,
  union,
  intersection,
} from "@red-cup-engineering/json-schema-engineering-services-section/structural-type";

import { schemaFrom } from "@red-cup-engineering/json-schema-engineering-services-section/contracts";
import { cellSchema } from "@red-cup-engineering/signcell/cell";
import { utteranceSchema, articulationCellSchema } from "@red-cup-engineering/signcell/utterance";

/** The base admission schema: an utterance, a token and a claim (SignCell). */
export const utteranceSchemaContract = schemaFrom(utteranceSchema);

/** An articulated utterance: its reflexive cell, told for by its token (a SignCell). */
export const articulationCellSchemaContract = schemaFrom(articulationCellSchema);
