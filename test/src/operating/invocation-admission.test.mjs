import test from 'node:test';
import assert from 'node:assert/strict';
import { schemaFrom } from '@red-cup-engineering/json-schema-engineering-services-section/contracts';
import { operation } from '../../../src/operating/operation.mjs';
import { operationHandlerResult } from '../../../src/operating/execution-context.mjs';
const integer = schemaFrom({ $id: 'relating/test/invocation/integer', type: 'integer' });

test('schema admission surrounds synchronous execution and preserves host arguments', () => {
  const args = { option: 'held' }, context = { witness: 'host' };
  let calls = 0;
  const op = operation({ verb: 'counted', domain: integer, codomain: integer,
    run(input, actualArgs, actualContext) { calls++; assert.equal(actualArgs, args); assert.equal(actualContext, context); return input + 1; } });
  assert.throws(() => op.execute('3', args, context), /operation counted input/);
  assert.equal(calls, 0);
  assert.equal(op.execute(3, args, context), 4);
  assert.equal(calls, 1);
  assert.throws(() => operation({ verb: 'bad-output', codomain: integer, run: () => '4' }).execute(0), /operation bad-output output/);
});

test('asynchronous completion preserves handler evidence and validates its actual value', async () => {
  const artifact = { uri: 'test:artifact' };
  const op = operation({ verb: 'async', domain: integer, codomain: integer,
    run: async input => operationHandlerResult(input + 2, ['source:a'], [artifact]) });
  const result = await op.execute(3);
  assert.equal(result.value, 5); assert.deepEqual(result.evidence, ['source:a']);
  assert.equal(result.artifacts[0], artifact); assert.ok(Object.isFrozen(result));
  const bad = operation({ verb: 'bad-async', codomain: integer,
    run: async () => operationHandlerResult('not an integer', ['source:a']) });
  await assert.rejects(bad.execute(0), /operation bad-async output/);
  const error = new Error('actual handler failure');
  const failed = operation({ verb: 'failed', run: async () => { throw error; } });
  await assert.rejects(failed.execute(0), failure => failure === error);
});


test('invocation uses the admitted declaration rather than later spec mutation', () => {
  const spec = { verb: 'retained', domain: integer, codomain: integer, run: value => value };
  const op = operation(spec);
  spec.domain = undefined; spec.codomain = undefined; spec.verb = 'changed'; spec.run = () => 'changed';
  assert.throws(() => op.execute('not an integer'), /operation retained input/);
  assert.equal(op.execute(7), 7);
});
