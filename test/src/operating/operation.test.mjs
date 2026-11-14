import assert from "node:assert/strict";
import test from "node:test";
import { tm } from "@red-cup-engineering/computer-code-engine/semiotic-expression-notation";
import { lazyOperation, operation, operationAs, operationDescriptor, operationFromDescriptor, programObject, programSchemaContract, withOperationArguments } from "../../../src/operating/operation.mjs";
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


test("effect evidence distinguishes author declarations without changing the operation address", () => {
  const spec = { verb: "observed-effect", run: input => input };
  const inferred = operation(spec);
  const declared = operation({ ...spec, effects: inferred.effects });
  assert.equal(inferred.ref, declared.ref);
  assert.deepEqual(inferred.executionEvidence, { effects: "inferred", body: "host-handler" });
  assert.deepEqual(declared.executionEvidence, { effects: "declared", body: "host-handler" });
  const program = programObject(declared);
  assert.equal(programSchemaContract.validate(program), true);
  assert.equal(Object.hasOwn(program, "executionEvidence"), false, "the existing wire schema stays compatible");
  assert.equal(programSchemaContract.validate(programObject(operation({
    verb: "term-effect", runTerm: tm.lam(tm.var(0)),
  }))), true);
  for (const entry of [inferred, declared]) {
    assert.strictEqual(operationAs(entry, "alias").executionEvidence, entry.executionEvidence);
    assert.strictEqual(withOperationArguments(entry, {}).executionEvidence, entry.executionEvidence);
  }
});

test("persisted or reconstructed operations cannot infer author evidence from effective defaults", async () => {
  const original = operation({ verb: "deferred", run: input => input });
  const descriptor = operationDescriptor(original);
  const lazy = lazyOperation(descriptor, () => [original]);
  assert.equal(Object.hasOwn(descriptor, "executionEvidence"), false);
  assert.equal(Object.hasOwn(lazy, "executionEvidence"), false);
  assert.equal(Object.hasOwn(operationAs(lazy, "deferred-alias"), "executionEvidence"), false);
  assert.equal(await lazy.execute(42, {}), 42);

  const addressed = operation({
    verb: "addressed-effect",
    program: { kind: "jsnode", closure: "ni:///sha-256;" + "A".repeat(43), module: "./source.mjs", export: "read" },
  });
  assert.equal(addressed.executionEvidence.body, "jsnode");
  assert.equal(Object.hasOwn(operationFromDescriptor(operationDescriptor(addressed)), "executionEvidence"), false);
});
