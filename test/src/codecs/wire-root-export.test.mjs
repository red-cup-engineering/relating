import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { WIRE_CODEC_NAMES, senCodec, wireByMediaType, wireCodec, wireOf } from "../../../src/operating/wire.mjs";

describe("the wire codecs relating's operations are carried by", () => {
  it("keeps the open projector adapter without inherited media-type metadata", () => {
    for (const type of ["constructor", "toString", "__proto__", "custom-projector"]) {
      const projector = { type, corner: "data", rung: "strict", recognize: () => true, read: text => [text], write: value => String(value) };
      assert.equal(wireOf(projector).mediaType, "application/octet-stream");
      assert.equal(wireOf(projector, { mediaType: "application/custom" }).mediaType, "application/custom");
    }
  });
  it("refuses prototype names outside the finite vocabulary", () => {
    for (const name of ["constructor", "toString", "__proto__", "hasOwnProperty", "not-a-wire"])
      assert.throws(() => wireCodec(name), {
        name: "TypeError",
        message: `unknown wire codec ${JSON.stringify(name)}; known: ${WIRE_CODEC_NAMES.join(", ")}`,
      });
  });
  it("owns the finite wire vocabulary at the boundary/wire leaf", () => {
    assert.deepEqual(WIRE_CODEC_NAMES, ["eavt", "form", "json", "mermaid", "plantuml", "sen", "string", "svg", "xmi"]);
    assert.equal(wireCodec("json").mediaType.split(";")[0], "application/json");
    assert.equal(wireCodec("sen").mediaType.split(";")[0], "application/sen+json");
    assert.equal(wireByMediaType("application/sen+json"), senCodec);
  });

  it("round-trips admitted JSON and SEN wires canonically", () => {
    const json = wireCodec("json");
    assert.equal(json.encode(json.decode('{"b":2,"a":1}')).trim(), '{"a":1,"b":2}');
    const term = ["pair", ["star"], ["star"]];
    assert.deepEqual(senCodec.decode(senCodec.encode(term)), term);
  });

  it("refuses to turn undecidable projection readings into wires", () => {
    const projector = {
      type: "bad",
      corner: "data",
      rung: "aperiodic",
      recognize: () => true,
      read: () => [],
      write: () => "",
    };
    assert.throws(() => wireOf(projector), /not decidable/);
  });
});
