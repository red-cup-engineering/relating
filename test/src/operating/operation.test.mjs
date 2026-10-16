import assert from "node:assert/strict";
import test from "node:test";
import { tm } from "@red-cup-engineering/computer-data-engineering-services-section/semiotic-expression-notation";
import { operation } from "../../../src/operating/operation.mjs";

test("an operation has one body: a host function, a SEN term or a program, never two", () => {
  assert.throws(() => operation({ verb: "two-bodies", run: (input) => input, runTerm: tm.lam(tm.var(0)) }), /run and runTerm are mutually exclusive/u);
  assert.equal(operation({ verb: "host-body", run: (input) => input }).execute(7, {}), 7);
  assert.deepEqual(operation({ verb: "nullish-host", run: null, runTerm: tm.lam(tm.var(0)) }).execute(3, {}), 3, "a nullish run is no body");
  assert.deepEqual(operation({ verb: "term-body", runTerm: tm.lam(tm.var(0)) }).execute({ kept: true }, {}), { kept: true });
});
