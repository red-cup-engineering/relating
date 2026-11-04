import assert from "node:assert/strict";
import test from "node:test";
import { tm } from "@red-cup-engineering/computer-data-engineering-services-section/semiotic-expression-notation";
import { operation, operationAs } from "../../../src/operating/operation.mjs";
import { schemaContractFromDescriptor } from "../../../src/operating/operation-declaration.mjs";

test("an operation has one body: a host function, a SEN term or a program, never two", () => {
  assert.throws(() => operation({ verb: "two-bodies", run: (input) => input, runTerm: tm.lam(tm.var(0)) }), /run and runTerm are mutually exclusive/u);
  assert.equal(operation({ verb: "host-body", run: (input) => input }).execute(7, {}), 7);
  assert.deepEqual(operation({ verb: "nullish-host", run: null, runTerm: tm.lam(tm.var(0)) }).execute(3, {}), 3, "a nullish run is no body");
  assert.deepEqual(operation({ verb: "term-body", runTerm: tm.lam(tm.var(0)) }).execute({ kept: true }, {}), { kept: true });
});

test("an alias carries its source's one body and executes as the source does", () => {
  const term = operation({ verb: "term-source", runTerm: tm.lam(tm.var(0)) });
  const aliasedTerm = operationAs(term, "term-alias");
  assert.equal(aliasedTerm.verb, "term-alias");
  assert.deepEqual(aliasedTerm.runTerm, term.runTerm);
  assert.deepEqual(aliasedTerm.execute({ kept: 1 }, {}), { kept: 1 });
  const host = operation({ verb: "host-source", run: (input) => input * 2 });
  assert.equal(operationAs(host, "host-alias").execute(4, {}), 8);
});

test("closed descriptors preserve strict instance admission without changing legacy contracts", () => {
  const id = "relating/test/descriptor/strict";
  const schema = { $id: id, type: "object", required: ["value"], properties: { value: { type: "string" } } };
  const legacy = schemaContractFromDescriptor({ id, schema, references: [] });
  const strict = schemaContractFromDescriptor({
    id,
    schema: { ...schema, "x-561-instance-profile": "json-resource-v1" },
    references: [],
  });
  let reads = 0;
  const candidate = Object.defineProperty({}, "value", {
    enumerable: true, get() { reads += 1; return "value"; },
  });
  assert.equal(strict.validate(candidate), false);
  assert.match(strict.errors(candidate)[0], /invalid-json-value/u);
  assert.throws(() => strict.assert(candidate, "input"), /^TypeError: input:.*invalid-json-value/u);
  assert.equal(reads, 0);
  const data = { value: "value" };
  assert.equal(strict.assert(data), data);
  assert.equal(legacy.validate(candidate), true);
  assert.ok(reads > 0);
});
