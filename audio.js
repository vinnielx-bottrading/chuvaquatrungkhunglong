// Original procedural soundscape. No recordings, downloads or external audio services.
export function createSoundscape(Context=globalThis.AudioContext||globalThis.webkitAudioContext){
 if(!Context)return null;
 const ctx=new Context(),master=ctx.createGain(),limiter=ctx.createDynamicsCompressor();
 master.gain.value=0;limiter.threshold.value=-16;limiter.knee.value=18;limiter.ratio.value=3;limiter.attack.value=.015;limiter.release.value=.3;master.connect(limiter);limiter.connect(ctx.destination);
 const music=ctx.createGain(),nature=ctx.createGain(),water=ctx.createGain();music.gain.value=.65;nature.gain.value=.65;water.gain.value=0;music.connect(master);nature.connect(master);water.connect(master);
 const delay=ctx.createDelay(2),echo=ctx.createGain();delay.delayTime.value=.34;echo.gain.value=.13;music.connect(delay);delay.connect(echo);echo.connect(master);
 const active=new Set();let enabled=true,focused=true,chapter=0,nearWater=0,rain=false,nextBeat=0,beat=0,nextBird=0,nextBubble=0,disposed=false;
 let mix={music:.65,nature:.65,water:.7,url:''},track=null,trackReady=false,trackFailed=false;
 function startTrack(){if(track&&enabled&&focused&&!trackFailed){const current=track;current.play().then(()=>{if(current===track)trackReady=true;}).catch(()=>{if(current===track){trackReady=false;trackFailed=true;}});}}
 function configure(value){mix={...mix,...value};if((track?.getAttribute('src')||'')!==mix.url){if(track){track.pause();track.removeAttribute('src');track.load();}track=null;trackReady=false;trackFailed=false;if(mix.url&&globalThis.Audio){track=new Audio(mix.url);track.loop=true;track.volume=0;track.preload='auto';track.onerror=()=>{trackReady=false;trackFailed=true;};startTrack();}}}
 let rng=3481;const random=()=>{rng=(rng*1664525+1013904223)>>>0;return rng/4294967296;};
 const pan=(dest,value=0)=>{if(!ctx.createStereoPanner)return dest;const p=ctx.createStereoPanner();p.pan.value=value;p.connect(dest);return p;};
 const ramp=(param,value,time=.35)=>{const t=ctx.currentTime;param.cancelScheduledValues(t);param.setTargetAtTime(value,t,time);};
 function note(hz,t,duration,volume,dest=music,type='sine',panValue=0){
  const o=ctx.createOscillator(),g=ctx.createGain(),p=pan(dest,panValue);o.type=type;o.frequency.setValueAtTime(hz,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.035);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(p);o.start(t);o.stop(t+duration+.04);active.add(o);o.onended=()=>{active.delete(o);o.disconnect();g.disconnect();if(p!==dest)p.disconnect();};return o;
 }
 // Continuous, loop-safe filtered noise forms the river bed and soft outdoor air.
 function noiseLayer(freq,q,gain,dest,type='lowpass'){
  const length=Math.round(ctx.sampleRate*6),buffer=ctx.createBuffer(1,length,ctx.sampleRate),data=buffer.getChannelData(0);let smooth=0;
  for(let i=0;i<length;i++){smooth=.985*smooth+.015*(random()*2-1);data[i]=smooth*4+(random()*2-1)*.13;}
  // Smooth both ends to equal zero so the loop cannot click.
  const fade=Math.round(ctx.sampleRate*.06);for(let i=0;i<fade;i++){const k=i/fade;data[i]*=k;data[length-1-i]*=k;}
  const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),amp=ctx.createGain();source.buffer=buffer;source.loop=true;filter.type=type;filter.frequency.value=freq;filter.Q.value=q;amp.gain.value=gain;source.connect(filter);filter.connect(amp);amp.connect(dest);source.start();return {source,filter,amp};
 }
 const riverLow=noiseLayer(850,.5,1.05,water),riverHigh=noiseLayer(2400,.9,.48,water,'bandpass');
 const air=noiseLayer(430,.5,.07,nature),rainLayer=noiseLayer(3200,.3,0,nature,'lowpass');
 function bird(t){const x=random()*1.5-.75,base=1900+random()*1400;for(let i=0;i<3;i++){const start=t+i*.16,o=note(base,start,.13,.045*(1-i*.14),nature,'sine',x);o.frequency.exponentialRampToValueAtTime(base*(i===1?1.5:1.22),start+.035);o.frequency.exponentialRampToValueAtTime(base*.88,start+.125);}}
 function bubble(t){const f=350+random()*900,o=note(f,t,.07+random()*.06,.016+random()*.016,water,'sine',random()*1.6-.8);o.frequency.exponentialRampToValueAtTime(f*.55,t+.08);}
 const chords=[[48,55,60,64,67,74],[45,52,57,60,64,71],[41,48,53,57,60,67],[43,50,55,57,62,69]];
 const melody=[72,76,79,76,74,72,69,72,76,79,81,79,76,74,72,69,69,72,76,72,67,69,72,74,71,74,79,74,72,71,69,67];
 const hz=midi=>440*Math.pow(2,(midi-69)/12);
 function scheduleBeat(t){
  const chord=chords[Math.floor(beat/8)%chords.length];
  if(beat%4===0){for(let j=0;j<3;j++)note(hz(chord[j+1]),t+j*.045,3.3,.018,music,'sine',(j-1)*.3);note(hz(chord[0]),t,3,.028,music);}
  if(beat%2===0){const m=melody[Math.floor(beat/2)%melody.length];note(hz(m+(chapter===1?-12:0)),t,1.9,.055,music,'sine',-.13);note(hz(m)*2,t,1.05,.008,music,'sine',.13);}
  beat++;
 }
 function mute(){ramp(master.gain,enabled&&focused?.72:0,.08);}
 function unlock(){trackFailed=false;startTrack();if(disposed)return Promise.resolve(false);return Promise.resolve(ctx.resume()).then(()=>{nextBeat=Math.max(nextBeat,ctx.currentTime+.06);mute();return ctx.state==='running';}).catch(()=>false);}
 function setEnabled(value){enabled=!!value;if(!enabled)track?.pause();else startTrack();mute();if(enabled&&focused)return unlock();return Promise.resolve(false);}
 function setFocused(value){focused=!!value;if(!focused)track?.pause();else startTrack();if(!focused){master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(0,ctx.currentTime);return Promise.resolve(ctx.suspend()).catch(()=>{});}return enabled?unlock():Promise.resolve(false);}
 function update({chapter:area=0,x=0,z=20,raining=false,paused=false}={}){
  if(disposed||ctx.state!=='running'||!enabled||!focused)return;
  chapter=area;rain=raining;const t=ctx.currentTime;
  nearWater=area===0?Math.exp(-Math.abs(z)/7):area===2?Math.exp(-Math.hypot(x-9,z-1)/9)*.7:0;
  ramp(water.gain,nearWater*mix.water,.5);ramp(nature.gain,mix.nature,.5);const musicVolume=mix.music*(paused?.55:area===1?.65:1);ramp(music.gain,trackReady?0:musicVolume,.5);if(track&&trackReady)track.volume+=(musicVolume-track.volume)*.08;ramp(rainLayer.amp.gain,rain?.24:0,.7);ramp(air.amp.gain,area===1?.012:.07,.7);
  if(nextBeat<t-.3)nextBeat=t+.03;
  while(nextBeat<t+.18){scheduleBeat(nextBeat);nextBeat+=.9375;}
  if((area===0||area===2||area===3&&!rain)&&t>nextBird){bird(t+.02);nextBird=t+3.4+random()*4.5;}
  if(nearWater>.06&&t>nextBubble){bubble(t+.01);nextBubble=t+.08+random()*.25;}
 }
 function effect(freq,duration=.2,volume=.025){if(enabled&&focused&&ctx.state==='running')note(freq,ctx.currentTime+.005,duration,volume,nature);}
 function dispose(){track?.pause();if(disposed)return;disposed=true;for(const node of active)try{node.stop();}catch{}for(const l of [riverLow,riverHigh,air,rainLayer])l.source.stop();return ctx.close();}
 return {configure,unlock,setEnabled,setFocused,update,effect,dispose,get context(){return ctx;},get enabled(){return enabled;}};
}
