import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("no compatibility ownership shims", () => {
  it("does not keep moved source files as facade surfaces", () => {
    const oldPaths = [
      "src/actions.mts",
      "src/carriers.mts",
      "src/running/codecs.mts",
      "scripts/cli.mts",
      "scripts/serve.mts",
      "src/writing/eavt.mts",
      "src/writing/datom.mts",
      "src/writing/triple.mts",
      "src/writing/json.mts",
      "src/writing/html.mts",
      "src/writing/exact-number.mts",
      "src/writing/lean/index.mts",
      "src/writing/xml/index.mts",
      "src/writing/xml/svg/index.mts",
      "src/writing/xml/svg/radial/index.mts",
      "src/codecs/eavt.mts",
      "src/codecs/datom.mts",
      "src/codecs/triple.mts",
      "src/codecs/wire.mts",
    ];
    assert.deepEqual(oldPaths.filter((path) => existsSync(resolve(root, path))), []);
  });

  it("publishes the nested codec tree without flat package shims", () => {
    const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
    for (const subpath of [
      "./carriers",
      "./actions",
    ]) {
      assert.ok(pkg.exports[subpath], `${subpath} must be an explicit export`);
    }
    // "./codecs", "./codecs/text", "./codecs/text/json/jsonl", and
    // "./codecs/text/json/jsonl/eavt/datom" were pure re-export barrels: condensed away, their
    // consumers now import the concrete modules by subpath instead of through an aggregate.
    // The JSON, JSONL and EAVT codecs left relating for the substrate (json, jsonl, eavt sections).
    for (const subpath of ["./codecs", "./codecs/text", "./codecs/text/json", "./codecs/text/json/jsonl", "./codecs/text/json/jsonl/eavt", "./codecs/text/json/jsonl/eavt/datom", "./codecs/text/xml/html", "./codecs/text/xml/svg", "./codecs/boundary/wire"]) {
      assert.equal(pkg.exports[subpath], undefined, `${subpath} was a barrel and should stay condensed away`);
    }
    assert.equal(pkg.exports["./running/codecs"], undefined);
    assert.equal(pkg.exports["./codecs/wire"], undefined);
    assert.equal(pkg.exports["./codecs/eavt"], undefined);
    assert.equal(pkg.exports["./writing/lean"], undefined);
  });
});
