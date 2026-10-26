import test from 'node:test';
import assert from 'node:assert/strict';
import {pairMessages,pairCelebration} from '../dist/celebrations.js';
test('50 distinct celebrations name the matching object',()=>{for(const word of ['banana','pears','roll of paper']){const lines=pairMessages(word);assert.equal(lines.length,50);assert.equal(new Set(lines).size,50);assert.ok(lines.every(line=>line.includes(word)));}});
test('random celebration stays in range and never immediately repeats',()=>{for(let previous=-1;previous<50;previous++)for(const random of [()=>0,()=>0.5,()=>0.999999]){const choice=pairCelebration('carrot',previous,random);assert.ok(choice.index>=0&&choice.index<50);assert.notEqual(choice.index,previous);assert.equal(choice.text,pairMessages('carrot')[choice.index]);}});
