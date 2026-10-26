import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {loadPictureBundle} from '../dist/pictures.js';
const base='https://example.org/my-learning-app/';
const bundle={'assets/apple.svg':'<svg></svg>'};
function cacheHarness(cached=null){let saved=null;return {cacheStorage:{open:async()=>({match:async()=>cached?new Response(JSON.stringify(cached)):null,put:async(url,response)=>{saved=await response.json();},keys:async()=>[],delete:async()=>true})},get saved(){return saved;}};}
test('a warm image cache serves pictures without a network request',async()=>{const h=cacheHarness(bundle);const data=await loadPictureBundle({base,cacheStorage:h.cacheStorage,fetcher:()=>{throw Error('Network should not be needed');}});assert.deepEqual(data,bundle);});
test('a cold cache downloads one bundle and stores it, with project-subdirectory-safe URLs',async()=>{const h=cacheHarness();let calls=0;const data=await loadPictureBundle({base,cacheStorage:h.cacheStorage,fetcher:async url=>{calls++;assert.ok(url.startsWith(base+'assets/pictures.'));return new Response(JSON.stringify(bundle));}});assert.equal(calls,1);assert.deepEqual(data,bundle);assert.deepEqual(h.saved,bundle);});
test('blocked cache storage does not prevent pictures loading',async()=>{const data=await loadPictureBundle({base,cacheStorage:{open:async()=>{throw Error('Blocked');}},fetcher:async()=>new Response(JSON.stringify(bundle))});assert.deepEqual(data,bundle);});
test('every audited vocabulary entry has a bundled SVG and stable original vocabulary ID',()=>{const words=JSON.parse(fs.readFileSync(new URL('../dist/words.json',import.meta.url)));const config=fs.readFileSync(new URL('../dist/picture-config.js',import.meta.url),'utf8');const path=config.match(/PICTURE_BUNDLE="([^"]+)"/)[1];const data=JSON.parse(fs.readFileSync(new URL('../dist/'+path,import.meta.url)));assert.equal(words.length,32);assert.equal(new Set(words.map(w=>w.id)).size,32);for(const w of words){assert.match(w.id,/^en_\d{4}$/);assert.ok(data[w.image].includes('<svg'));assert.equal(w.audit.status,'matches_word');}});
