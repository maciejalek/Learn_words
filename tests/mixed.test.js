import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mixedPlan} from '../dist/logic.js';
const words=JSON.parse(fs.readFileSync(new URL('../dist/words.json',import.meta.url)));
const scenes=JSON.parse(fs.readFileSync(new URL('../dist/sentences.json',import.meta.url)));
test('mixed sessions include five distinct objects and five distinct scenes, including wraparound',()=>{for(const offset of [0,49,320]){const plan=mixedPlan(words,scenes,offset);assert.equal(plan.length,10);assert.equal(new Set(plan.map(w=>w.id)).size,10);assert.equal(plan.filter(w=>w.person).length,5);assert.equal(plan.filter(w=>!w.person).length,5);}});
