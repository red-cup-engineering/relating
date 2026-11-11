import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { operationDeclaration, operationDescriptor } from '../../../src/operating/operation-declaration.mjs';
import { WIRE_MEDIA_TYPES, WIRE_CODEC_NAMES, requireWireName, assertWireRegistry } from '../../../src/operating/wire-vocabulary.mjs';
import { artifactId } from '@red-cup-engineering/semiotic-eavt-engineering-services-section/identity';

test('inert vocabulary derives every original name from the existing media metadata', () => {
  assert.deepEqual(WIRE_CODEC_NAMES, ['eavt','form','json','mermaid','plantuml','sen','string','svg','xmi']);
  assert.deepEqual(WIRE_CODEC_NAMES, Object.keys(WIRE_MEDIA_TYPES).sort());
  for (const name of WIRE_CODEC_NAMES) {
    assert.equal(requireWireName(name), name);
    const result = operationDeclaration({verb:'declared-'+name,inputFormat:name,outputFormat:name,run(){throw Error('must not run');}});
    assert.equal(result.inputFormat,name); assert.equal(result.outputFormat,name);
    assert.equal(Object.hasOwn(result,'execute'),false);
  }
  assert.equal(operationDeclaration({verb:'default-json',run(){}}).inputFormat,'json');
});

test('declaration and name admission refuse inherited and unknown wire names', () => {
  for (const name of ['constructor','toString','__proto__','hasOwnProperty','not-a-wire','']) {
    const expected = `unknown wire codec ${JSON.stringify(name)}; known: ${WIRE_CODEC_NAMES.join(', ')}`;
    assert.throws(()=>requireWireName(name), {name:'TypeError',message:expected});
    for (const field of ['inputFormat','outputFormat']) assert.throws(()=>operationDeclaration({verb:'invalid',run(){},[field]:name}), {name:'TypeError',message:expected});
  }
});

test('registry conformance checks exact own keys without manufacturing codec providers', () => {
  // Structural fixtures for the key-set law, never installed as runtime codecs.
  const namesOnly = Object.fromEntries(WIRE_CODEC_NAMES.map(name=>[name, null]));
  assert.doesNotThrow(()=>assertWireRegistry(namesOnly));
  const missing = {...namesOnly}; delete missing.svg;
  assert.throws(()=>assertWireRegistry(missing), /differs from its declared finite vocabulary/);
  assert.throws(()=>assertWireRegistry({...namesOnly,extra:null}), /differs from its declared finite vocabulary/);
  assert.throws(()=>assertWireRegistry(Object.create(namesOnly)), /differs from its declared finite vocabulary/);
});

test('declarations retain exact independent record identities for host, SEN and JSNode bodies', () => {
  let calls=0;
  const programme={kind:'jsnode',closure:'ni:///sha-256;AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',module:'entry.mjs',export:'run'};
  const cases=[
    [{verb:'host-law',run(){calls++;}}, {kind:'host',declaration:'host-law'}, 'host-read'],
    [{verb:'sen-law',runTerm:['lam',['var',0]]}, {kind:'sen',term:['lam',['var',0]]}, 'pure'],
    [{verb:'programme-law',program:programme}, programme, 'host-read'],
  ];
  for(const [spec,body,effectClass] of cases) {
    const effects={class:effectClass,replay:'safe',coordination:'coordination-free',deterministic:effectClass==='pure'?true:'unmeasured',totality:effectClass==='pure'?'partial':'unmeasured'};
    const declaration={kind:'metroplat.rpc.operation-declaration',verb:spec.verb,inputFormat:'json',outputFormat:'json',reads:[],writes:[],options:[],effects,body};
    const actual=operationDeclaration(spec);
    assert.equal(actual.ref, artifactId(declaration), 'unchanged original artifact owner names the independent declaration fixture');
    assert.deepEqual(operationDescriptor(actual), {ref:artifactId(declaration),body,verb:spec.verb,inputFormat:'json',outputFormat:'json',reads:[],writes:[],options:[],effects});
    assert.ok(Object.isFrozen(actual)); assert.ok(Object.isFrozen(actual.body));
  }
  assert.equal(calls,0);
});

test('actual broad and declaration consumers use the same admission while tuple code remains broad', () => {
  const wire=readFileSync(new URL('../../../src/operating/wire.mjs',import.meta.url),'utf8');
  const declaration=readFileSync(new URL('../../../src/operating/operation-declaration.mjs',import.meta.url),'utf8');
  const tuple=readFileSync(new URL('../../../src/operating/wire-eavt-tuple.mjs',import.meta.url),'utf8');
  assert.match(wire,/assertWireRegistry\(REGISTRY\)/); assert.match(wire,/requireWireName\(name\)/);
  assert.match(declaration,/requireWireName\(inName\)/); assert.match(declaration,/requireWireName\(outName\)/);
  assert.doesNotMatch(declaration,/from ["']\.\/wire(?:-eavt-tuple)?\.mjs/);
  assert.match(tuple,/export \* from "\.\/wire\.mjs"/);
});
