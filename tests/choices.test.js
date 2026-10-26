import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {optionsFor} from '../dist/logic.js';
const words=JSON.parse(fs.readFileSync(new URL('../dist/words.json',import.meta.url)));
test('all objects have categories and unique choices at every grid size',()=>{for(const target of words){assert.ok(target.category);for(const count of [2,4,6,8]){const choices=optionsFor(words,target,count);assert.equal(choices.length,count);assert.equal(new Set(choices.map(w=>w.id)).size,count);assert.equal(choices.filter(w=>w.id===target.id).length,1);}}});
test('animals, fruit and vehicles use same-category alternatives',()=>{for(const word of ['monkey','apple','car']){const target=words.find(w=>w.word===word);for(const count of [2,4,6,8])assert.ok(optionsFor(words,target,count).every(w=>w.category===target.category));}});
test('small animal categories fill with animals before unrelated items',()=>{const target=words.find(w=>w.category==='animal-amphibian');assert.ok(optionsFor(words,target,8).every(w=>w.category.startsWith('animal')));});
test('alternatives and answer positions vary',()=>{const target=words.find(w=>w.word==='monkey');const a=optionsFor(words,target,4,0,()=>0);const b=optionsFor(words,target,4,0,()=>.999);assert.notDeepEqual(a.map(w=>w.id),b.map(w=>w.id));assert.notEqual(a.findIndex(w=>w.id===target.id),b.findIndex(w=>w.id===target.id));});
