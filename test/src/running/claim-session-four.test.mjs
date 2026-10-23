import assert from "node:assert/strict";
import test from "node:test";
import {
  openSession, claim, judge, conflicts, settle, glueClaimSessions,
} from "../../../src/running/session.mjs";

test("even a first Claim is an actual SignChain FOUR value, not an uninterpreted string",()=>{
  const empty=openSession();
  assert.throws(()=>claim(empty,"source:cell","probably true"),
    /reading|FOUR|family|value|unknown|invalid/i);
  assert.deepEqual(empty.claims,[],"rejected input must not mutate original session");
  assert.throws(()=>openSession("local-house-style"),
    /reading|family|invalid|knowledge|unknown/i);
});

test("Relating normalizes the first and every later claim to its original session family",()=>{
  const empty=openSession("knowledge");
  const one=claim(empty,"original:claim","held");
  assert.equal(one.claims[0].reading,"potential");
  assert.equal(judge(one).get("original:claim"),"potential");
  const both=claim(one,"original:claim","denied");
  assert.equal(both.claims[1].reading,"active");
  assert.equal(judge(both).get("original:claim"),"stable");
  assert.deepEqual(conflicts(both),["original:claim"]);
  assert.deepEqual(one.claims,[{cell:"original:claim",reading:"potential"}],
    "later opposed testimony never rewrites original Claim history");
  const closed=settle(both);
  assert.equal(claim(closed,"another","potential"),closed,
    "closed original sessions remain inert");
});

test("original notation/extremal claims preserve source FOUR semantics across family boundaries",()=>{
  const one=claim(openSession("extremal"),"source:cell","potential");
  assert.equal(one.claims[0].reading,"held");
  const contra=claim(one,"source:cell","denied");
  assert.equal(judge(contra).get("source:cell"),"contested");
  assert.deepEqual(conflicts(contra),["source:cell"]);
});

test("historical singleton Claims are re-admitted rather than escaping FOUR by avoiding a join",()=>{
  const external={
    family:"knowledge", closed:true, claims:[{cell:"original:work",reading:"outside-the-algebra"}],
  };
  assert.throws(()=>judge(external),/reading|FOUR|family|invalid|unknown/i);
  const valid={...external,claims:[{cell:"original:work",reading:"held"}]};
  assert.equal(judge(valid).get("original:work"),"potential");
});

test("a cross-session gluing source cannot smuggle an invalid first reading",()=>{
  const bundle={source:"original:actor",observations:[{
    claim:{reading:"unqualified-high-confidence"},
    boundary:{role:"work",text:"perform an original Work gesture"},
  }]};
  assert.throws(()=>glueClaimSessions([bundle]),/reading|FOUR|family|invalid|unknown/i);
});
