export function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function learnPlan(words,offset=0){const picked=Array.from({length:5},(_,i)=>words[(offset+i)%words.length]);return Array.from({length:3},()=>picked).flat();}
function wordFamily(word){
 const category=word.category||'';
 if(category.startsWith('animal'))return 'animals';
 if(category.startsWith('food'))return 'food';
 if(category.startsWith('transport'))return 'transport';
 if(category.startsWith('plant'))return 'plants';
 if(['computer','phone','technology'].includes(category))return 'technology';
 if(['office','writing'].includes(category))return 'school';
 if(['household','tableware','tool','gardening'].includes(category))return 'home';
 return category;
}
export function optionsFor(words,target,count,round=0,random=Math.random){
 const others=words.filter(w=>w.id!==target.id);
 const same=others.filter(w=>target.category&&w.category===target.category);
 const family=wordFamily(target);
 const related=others.filter(w=>!same.includes(w)&&family&&wordFamily(w)===family);
 const rest=others.filter(w=>!same.includes(w)&&!related.includes(w));
 const picked=[...shuffle(same,random),...shuffle(related,random),...shuffle(rest,random)].slice(0,count-1);
 return shuffle([target,...picked],random);
}
export function checkReport(events){const first=events.filter(e=>e.mode==='check'&&e.type==='answer'&&e.attempt===1);return {remembered:first.filter(e=>e.correct),practice:first.filter(e=>!e.correct),total:first.length};}
export function summarize(events){const perWord={};for(const e of [...events].sort((a,b)=>(a.at||'').localeCompare(b.at||''))){if(!e.wordId)continue;const p=perWord[e.wordId]??={seen:0,answers:0,firstCorrect:0,firstWrong:0,lastSeen:null,lastCheck:null};if(e.type==='exposure')p.seen++;if(e.type==='answer'){p.answers++;if(e.attempt===1){if(e.correct)p.firstCorrect++;else p.firstWrong++;if(e.mode==='check')p.lastCheck={correct:e.correct,at:e.at};}}p.lastSeen=e.at;}return perWord;}

// Mix actors in every scene question while retaining exactly one sentence match.
export function sentenceOptions(scenes,target,count,round=0){
 const opposite=shuffle(scenes.filter(s=>s.person!==target.person));
 const anchor=opposite[0];
 const others=shuffle(scenes.filter(s=>s.id!==target.id&&s.id!==anchor.id));
 return shuffle([target,anchor,...others.slice(0,count-2)]);
}

export function mixedPlan(words,sentences,offset=0,random=Math.random){return shuffle(Array.from({length:5},(_,i)=>[words[(offset+i)%words.length],sentences[(offset+i)%sentences.length]]).flat(),random);}

export function memoWords(words,previousIds=[],random=Math.random){const previous=new Set(previousIds);const fresh=words.filter(w=>!previous.has(w.id));const pool=fresh.length>=8?fresh:words;return shuffle(pool,random).slice(0,8);}
