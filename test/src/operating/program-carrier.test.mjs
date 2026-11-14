import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { executeJavascriptProgram, javascriptProgram } from "@red-cup-engineering/javascript-module-closure-service";
import { operation } from "../../../src/operating/operation.mjs";

test("the execution-only port retains Node's admitted source and all invocation arguments", async () => {
  const selected = await import("@red-cup-engineering/javascript-module-closure-service/execute-javascript-program");
  assert.equal(selected.executeJavascriptProgram, executeJavascriptProgram);
  const root = await mkdtemp(join(tmpdir(), "relating-program-carrier-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "relating-program-fixture", version: "1.0.0", type: "module" }));
    const entry = join(root, "program.mjs");
    await writeFile(entry, "export const run = (input, args, context) => ({ input, args, context });\n");
    const program = javascriptProgram(pathToFileURL(entry), "run");
    const declared = operation({ verb: "captured-program", program });
    await writeFile(entry, "throw new Error('changed origin must not execute');\n");
    assert.deepEqual(await declared.execute({ kept: 1 }, { option: 2 }, { witness: 3 }), {
      input: { kept: 1 }, args: { option: 2 }, context: { witness: 3 },
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("workerd retains host and SEN operations and refuses only the unavailable JSNode carrier", () => {
  const operationUrl = new URL("../../../src/operating/operation.mjs", import.meta.url).href;
  const source = `
    import assert from 'node:assert/strict';
    import { operation } from ${JSON.stringify(operationUrl)};
    import { tm } from '@red-cup-engineering/computer-code-engine/semiotic-expression-notation';
    assert.equal(operation({ verb: 'host', run: input => input + 1 }).execute(4, {}), 5);
    assert.deepEqual(operation({ verb: 'sen', runTerm: tm.lam(tm.var(0)) }).execute({ kept: true }, {}), { kept: true });
    const program = { kind: 'jsnode', closure: 'ni:///sha-256;' + 'a'.repeat(43), module: 'fixture/program.mjs', export: 'run' };
    const declared = operation({ verb: 'requires-node', program });
    await assert.rejects(declared.execute(null, {}), error => {
      assert.ok(error instanceof TypeError);
      assert.equal(error.code, 'programme-carrier-unavailable');
      assert.deepEqual(error.programme, program);
      return true;
    });
  `;
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ["--conditions=workerd", "--input-type=module", "--eval", source], {
    cwd: new URL("../../../", import.meta.url), env, encoding: "utf8", timeout: 30_000,
  });
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
