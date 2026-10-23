/** Inert wire-name admission. No codec or rendering implementation is loaded here. */
/** The media type each wire serves, keyed by projector `type`. The wire byte
 *  form is identical to the prior hand-rolled vocabulary; the corner/rung now ride
 *  along from the projector. */
export const WIRE_MEDIA_TYPES                                   = Object.freeze({
  string: "text/plain; charset=utf-8",
  json: "application/json; charset=utf-8",
  eavt: "application/eavt+jsonl; charset=utf-8",
  form: "application/x-www-form-urlencoded; charset=utf-8",
  sen: "application/sen+json; charset=utf-8",
  svg: "image/svg+xml; charset=utf-8",
  mermaid: "text/vnd.mermaid; charset=utf-8",
  xmi: "application/xmi+xml; charset=utf-8",
  plantuml: "text/x-plantuml; charset=utf-8",
});

export const WIRE_CODEC_NAMES = Object.freeze(Object.keys(WIRE_MEDIA_TYPES).sort());

export function requireWireName(name) {
  if (!Object.hasOwn(WIRE_MEDIA_TYPES, name)) {
    throw new TypeError(`unknown wire codec ${JSON.stringify(name)}; known: ${WIRE_CODEC_NAMES.join(", ")}`);
  }
  return name;
}

/** The real codec registry must realize exactly this existing finite vocabulary. */
export function assertWireRegistry(registry) {
  const names = Object.keys(registry).sort();
  if (names.length !== WIRE_CODEC_NAMES.length || names.some((name, index) => name !== WIRE_CODEC_NAMES[index])) {
    throw new TypeError("wire codec registry differs from its declared finite vocabulary");
  }
}
