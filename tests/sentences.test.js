import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sentenceOptions} from '../dist/logic.js';
import {PICTURE_BUNDLE} from '../dist/picture-config.js';
const scenes=JSON.parse(fs.readFileSync(new URL('../dist/sentences.json',import.meta.url)));
test('50 distinct sentences have bundled scene assets and balanced actors',()=>{
 const bundle=JSON.parse(fs.readFileSync(new URL('../dist/'+PICTURE_BUNDLE,import.meta.url)));
 assert.equal(scenes.length,50);assert.equal(new Set(scenes.map(s=>s.id)).size,50);assert.equal(new Set(scenes.map(s=>s.word)).size,50);
 for(const s of scenes){assert.ok(bundle[s.image]?.includes('<svg'));assert.equal(s.license,'MIT');}
 assert.equal(scenes.filter(s=>s.person==='girl').length,25);assert.equal(scenes.filter(s=>s.person==='boy').length,25);
});
test('sentence choices have exactly one match and require understanding the action',()=>{
 for(const s of scenes)for(const n of [2,4,6,8]){
 const options=sentenceOptions(scenes,s,n);assert.equal(options.length,n);assert.equal(new Set(options.map(x=>x.id)).size,n);assert.equal(options.filter(x=>x.id===s.id).length,1);assert.ok(options.every(x=>x.person===s.person));assert.equal(new Set(options.map(x=>x.action)).size,n);
 }
});
test('five completed ten-question sessions cover all sentences without gaps',()=>{
 const ids=[];for(let session=0;session<5;session++)for(let round=0;round<10;round++)ids.push(scenes[(session*10+round)%scenes.length].id);assert.equal(new Set(ids).size,50);
});
