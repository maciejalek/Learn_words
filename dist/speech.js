// Browser speech adapter. Keep utterances alive and make cancellation settle
// pending callers before native cancellation events arrive.
export class SpeechPlayer {
 constructor({synth=globalThis.speechSynthesis,Utterance=globalThis.SpeechSynthesisUtterance,onError=()=>{},onSuccess=()=>{},startTimeout=8000}={}){Object.assign(this,{synth,Utterance,onError,onSuccess,startTimeout});this.run=0;this.active=null;this.pending=null;this.ready=false;this.lastError=null;}
 voices(){try{return this.synth?.getVoices()||[];}catch{return [];}}
 voice(preferred){const english=this.voices().filter(v=>/^en(?:[-_]|$)/i.test(v.lang));return english.find(v=>v.voiceURI===preferred)||english.find(v=>v.localService&&/^en[-_]US$/i.test(v.lang))||english.find(v=>v.localService)||english.find(v=>/^en[-_]US$/i.test(v.lang))||english[0];}
 cancel(){this.run++;this.pending?.({ok:false,error:'cancelled'});this.pending=null;this.active=null;try{this.synth?.cancel();}catch{}}
 async say(text,count=1,{voice='',rate=.8}={}){
  this.cancel();const token=this.run;
  if(!this.synth||!this.Utterance)return this.fail('unsupported');
  for(let i=0;i<count;i++){
   if(token!==this.run)return false;
   let result=await this.once(text,{voice,rate},token,false);
   // A saved or network voice can disappear. Retry with the platform's English
   // default, without forcing that voice. Never retry a blocked gesture in a loop.
   if(!result.ok&&['voice-unavailable','language-unavailable','network','synthesis-failed'].includes(result.error)&&token===this.run){result=await this.once(text,{voice,rate},token,true);}
   if(token!==this.run||result.error==='cancelled')return false;
   if(!result.ok)return this.fail(result.error);
  }
  this.ready=true;this.lastError=null;this.onSuccess();return true;
 }
 fail(error){this.ready=false;this.lastError=error||'unknown';this.onError(this.lastError);return false;}
 once(text,settings,token,useDefault){return new Promise(resolve=>{
  let settled=false,timer,u;
  const finish=result=>{if(settled)return;settled=true;clearTimeout(timer);if(u){u.onstart=null;u.onend=null;u.onerror=null;}if(this.active===u)this.active=null;if(this.pending===finish)this.pending=null;resolve(result);};
  this.pending=finish;
  try{
   u=new this.Utterance(text);this.active=u;u.lang='en-US';u.rate=settings.rate;u.volume=1;
   const chosen=useDefault?null:this.voice(settings.voice);if(chosen){u.voice=chosen;u.lang=chosen.lang;}
   const timeout=()=>{finish({ok:false,error:'timeout'});try{this.synth.cancel();}catch{}};
   u.onstart=()=>{clearTimeout(timer);timer=setTimeout(timeout,Math.max(20000,text.length*250));};
   u.onend=()=>finish({ok:true});u.onerror=e=>finish({ok:false,error:e.error||'synthesis-failed'});
   timer=setTimeout(timeout,this.startTimeout);
   // speak() is called synchronously by this method, before the first await.
   // The initial sound test therefore runs inside the learner's click handler.
   if(this.synth.paused)this.synth.resume();
   if(token===this.run)this.synth.speak(u);else finish({ok:false,error:'cancelled'});
  }catch{finish({ok:false,error:'synthesis-failed'});}
 });}
}
export function speechErrorMessage(code){
 if(code==='unsupported')return 'This browser does not provide speech. Open this page in Chrome, Safari or Edge.';
 if(code==='not-allowed')return 'Your browser blocked speech. Tap Enable sound to try again.';
 if(['voice-unavailable','language-unavailable','synthesis-unavailable'].includes(code))return 'An English speech voice is unavailable. Check the English text-to-speech voices installed on this device, then retry.';
 if(code==='network')return 'The voice could not connect. Check your connection or choose an installed English voice in Settings.';
 if(['audio-busy','audio-hardware'].includes(code))return 'The device could not open its audio output. Check your speaker or headphones, then retry.';
 return 'Speech did not finish. Tap Enable sound to retry. If needed, open this page directly in Chrome or Safari.';
}
