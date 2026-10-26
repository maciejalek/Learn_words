import {PICTURE_BUNDLE,PICTURE_VERSION} from './picture-config.js?v=20261026-3';
const CACHE_NAME='little-objects-pictures-v1';
// Cache public illustrations only. No app pages, sessions, profiles or recordings.
export async function loadPictureBundle({cacheStorage=globalThis.caches,fetcher=globalThis.fetch,base=globalThis.location?.href}={}){
 const url=new URL(PICTURE_BUNDLE,base).href;let cache;
 try{if(cacheStorage)cache=await cacheStorage.open(CACHE_NAME);}catch{/* Storage may be disabled; fall back to the network. */}
 try{const cached=await cache?.match(url);if(cached){const data=await cached.json();if(data&&typeof data==='object'&&!Array.isArray(data))return data;}}catch{/* Damaged cache must not block a fresh download. */}
 const response=await fetcher(url,{cache:'force-cache'});if(!response.ok)throw new Error('Pictures could not be downloaded.');
 const data=await response.clone().json();
 if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Invalid picture bundle.');
 try{await cache?.put(url,response);if(cache){const keys=await cache.keys();await Promise.all(keys.filter(k=>k.url!==url).map(k=>cache.delete(k)));}}catch{/* Best-effort persistent storage; play still works in memory. */}
 return data;
}
export async function preparePictures(words,onProgress=()=>{}){
 const bundle=await loadPictureBundle();const retained=[];let completed=0;
 // Keep decoded image objects alive throughout play. Every card uses the same data URL.
 await Promise.all(words.map(async w=>{const svg=bundle[w.image];if(typeof svg!=='string'||!svg.includes('<svg'))throw new Error(`Missing picture: ${w.word}`);const source=w.image;w.image='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);w.imageAsset=source;const image=new Image();const loaded=new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error(`Cannot load picture: ${w.word}`));});image.src=w.image;await loaded;if(image.decode)await image.decode();retained.push(image);onProgress(++completed,words.length);}));
 return {version:PICTURE_VERSION,retained};
}
