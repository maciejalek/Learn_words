import test from 'node:test';import assert from 'node:assert/strict';import {memoWords} from '../dist/logic.js';
const words=Array.from({length:323},(_,i)=>({id:'w'+i}));
test('new Memo games have eight unique pictures and avoid the previous set',()=>{const first=memoWords(words);const next=memoWords(words,first.map(w=>w.id));assert.equal(next.length,8);assert.equal(new Set(next.map(w=>w.id)).size,8);assert.ok(next.every(w=>!first.some(p=>p.id===w.id)));});
test('Memo can still play a small eight-word collection',()=>{assert.equal(memoWords(words.slice(0,8),words.slice(0,8).map(w=>w.id)).length,8);});
