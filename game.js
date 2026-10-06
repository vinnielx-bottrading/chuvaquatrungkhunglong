import { setupGameShell } from './game-shell.js';
import { discoveryArt, discoveryMarkup, discoveryPicture, setDiscoveryPicture } from './discovery.js';
import {TerrainCollisions,insideMeadow,addMeadow} from './terrain.js';
import {adventures,implementedIds} from './adventures.js';
import {buildAdventureWorld} from './adventure-world.js';
import { mountCover, catalog, available, currentAudio } from './catalog.js';
import { setupCloud, supabase } from './cloud-save.js';
import { setupDonation } from './donate.js';
import * as T from './vendor/three.module.min.js';
import { createSoundscape } from './audio.js';
const $=id=>document.getElementById(id);
let renderer;
try{renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch(e){$('error').hidden=false;throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0xa9c9a7);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;$('view').appendChild(renderer.domElement);
const scene=new T.Scene();scene.fog=new T.Fog(0xb3cba8,90,240);
const camera=new T.PerspectiveCamera(55,innerWidth/innerHeight,.1,450);const look=new T.Vector3();
scene.add(new T.HemisphereLight(0xfdf2cd,0x365e48,2.3));const sun=new T.DirectionalLight(0xffe1a0,3);sun.position.set(-16,30,12);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);Object.assign(sun.shadow.camera,{left:-32,right:32,top:32,bottom:-32,near:1,far:80});sun.shadow.bias=-.0004;scene.add(sun);
const materials=new Map();function mat(c){if(!materials.has(c))materials.set(c,new T.MeshStandardMaterial({color:c,roughness:.95,flatShading:true}));return materials.get(c);}
function mesh(geo,color,parent=scene,x=0,y=0,z=0){const m=new T.Mesh(geo,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function ball(parent,c,x,y,z,sx,sy=sx,sz=sx){const m=mesh(new T.IcosahedronGeometry(1,1),c,parent,x,y,z);m.scale.set(sx,sy,sz);if((parent===scene||parent.userData.terrainRoot)&&sy>=.35&&sx>=.65)m.userData.solid=true;return m;}
function box(parent,c,x,y,z,w,h,d){const m=mesh(new T.BoxGeometry(w,h,d),c,parent,x,y,z);if(h>=.3||(y>.55&&Math.max(w,d)>.7&&h>.08)||(y>.75&&Math.max(w,d)>2))m.userData.solid=true;return m;}
function cyl(parent,c,x,y,z,r1,r2,h,n=7){const m=mesh(new T.CylinderGeometry(r1,r2,h,n),c,parent,x,y,z);if(h>=1&&Math.max(r1,r2)>=.06)m.userData.solid=true;return m;}
// Ground continues far beyond the playable trail; no exposed rectangular slab.
function landscape(parent,color,woodland=false){
 const ground=mesh(new T.CircleGeometry(245,96),color,parent,0,-.035,0);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;ground.castShadow=false;
 const temp=new T.Object3D();const palette=woodland?[0x51724c,0x6e895d,0x829772]:[0x788979,0x8d9c88,0xa0aa91];
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2,r=132+12*Math.sin(i*2.31),h=4+4*(.5+.5*Math.sin(i*1.73));const hill=ball(parent,palette[i%3],Math.cos(a)*r,h*.12,Math.sin(a)*r,9+(i%4)*2,h,9+(i%3)*3);hill.castShadow=false;}
 if(woodland){
  const trunks=new T.InstancedMesh(new T.CylinderGeometry(.16,.32,3.2,5),mat(0x735e41),100);const crowns=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),mat(0x3e714a),100);
  for(let i=0;i<100;i++){const a=i*2.399963,r=135+(i%9)*4.8,x=Math.cos(a)*r,z=Math.sin(a)*r,k=.8+(i%5)*.17;
   temp.position.set(x,1.6*k,z);temp.scale.set(k,k,k);temp.rotation.set(0,a,0);temp.updateMatrix();trunks.setMatrixAt(i,temp.matrix);
   temp.position.y=4.2*k;temp.scale.set(1.65*k,2.5*k,1.6*k);temp.updateMatrix();crowns.setMatrixAt(i,temp.matrix);
  }parent.add(trunks,crowns);trunks.castShadow=false;crowns.castShadow=false;
 }
 return ground;
}
const floor=landscape(scene,0x527e47,true);
// A winding, walkable ribbon through the trees.
const points=[new T.Vector3(0,.035,21),new T.Vector3(-1,.035,13),new T.Vector3(-3,.035,10),new T.Vector3(2,.035,5),new T.Vector3(0,.035,0),new T.Vector3(1,.035,-4),new T.Vector3(-2,.035,-8),new T.Vector3(1,.035,-15),new T.Vector3(0,.035,-20)];
const curve=new T.CatmullRomCurve3(points);const verts=[],idx=[];for(let i=0;i<=180;i++){const p=curve.getPoint(i/180),d=curve.getTangent(i/180),side=new T.Vector3(-d.z,0,d.x).normalize().multiplyScalar(2.1);verts.push(p.x+side.x,p.y,p.z+side.z,p.x-side.x,p.y,p.z-side.z);if(i<180){const a=i*2;idx.push(a,a+2,a+1,a+1,a+2,a+3);}}
const pg=new T.BufferGeometry();pg.setAttribute('position',new T.Float32BufferAttribute(verts,3));pg.setIndex(idx);pg.computeVertexNormals();const path=mesh(pg,0xc5ad73);path.material=new T.MeshStandardMaterial({color:0xc5ad73,roughness:1,side:T.DoubleSide});path.receiveShadow=true;
const riverGeo=new T.BufferGeometry(),rv=[],ri=[];for(let i=0;i<=100;i++){const x=-150+i*3,center=Math.abs(x)<12?0:Math.sin((Math.abs(x)-12)*.045)*5;rv.push(x,.055,center-1.7,x,.055,center+1.7);if(i<100){const k=i*2;ri.push(k,k+1,k+2,k+1,k+3,k+2);}}riverGeo.setAttribute('position',new T.Float32BufferAttribute(rv,3));riverGeo.setIndex(ri);riverGeo.computeVertexNormals();const river=mesh(riverGeo,0x68acb4);river.material=new T.MeshStandardMaterial({color:0x73c0c9,roughness:.35,metalness:.15,transparent:true,opacity:.86});river.castShadow=false;
const ripples=[];for(let i=0;i<25;i++){const w=box(scene,0xa4e0d8,-23+i*1.9,.11,Math.sin(i*4)*1.25,.75,.018,.025);w.castShadow=false;ripples.push(w);}
let seed=38;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
const blockers=[],trees=[];function tree(x,z,s=1){const g=new T.Group();g.position.set(x,0,z);scene.add(g);cyl(g,0x785b39,0,2.1*s,0,.22*s,.45*s,4.2*s);const crown=new T.Group();g.add(crown);ball(crown,0x2e6943,0,5*s,0,1.8*s,2.2*s,1.65*s);ball(crown,0x43814e,.9*s,4.8*s,.3*s,1.25*s,1.5*s,1.3*s);ball(crown,0x63934f,-.8*s,5.2*s,-.4*s,1.15*s,1.65*s,1.15*s);trees.push({g:crown,phase:rand()*6});blockers.push({x,z,r:.7*s});}
for(let i=0;i<115;i++){const x=(rand()-.5)*46,z=(rand()-.5)*53;if(Math.abs(x)<5.6||Math.abs(z)<2.2||Math.hypot(x+8,z+10)<4)continue;tree(x,z,.65+rand()*.6);}
for(let i=0;i<85;i++){const x=(rand()-.5)*44,z=(rand()-.5)*51;if(Math.abs(x)<3.8||Math.abs(z)<2)continue;const g=new T.Group();g.position.set(x,0,z);scene.add(g);ball(g,0x568945,0,.35,0,.6,.48,.7);ball(g,0x75a64b,.35,.28,.1,.42,.35,.4);if(i%5===0){for(let j=0;j<3;j++)ball(g,[0xffd184,0xe5a0a4,0xe7deb2][i%3],(j-1)*.22,.73,.05,.1);}}
for(let i=0;i<32;i++){const x=(rand()-.5)*44,z=(rand()-.5)*52;if(Math.abs(x)<4||Math.abs(z)<2.2)continue;ball(scene,0x91947c,x,.35,z,.8+rand()*.7,.55,.75);blockers.push({x,z,r:.9});}
// Chu: articulated low-poly character with backpack, shoes and comic book.
const chu=new T.Group();scene.add(chu);chu.position.set(0,0,16);const body=new T.Group();chu.add(body);ball(body,0xeab447,0,1.1,0,.36,.45,.27);box(body,0x466e7c,0,1.15,-.31,.53,.6,.24);box(body,0xdbc197,.19,1.31,-.46,.12,.34,.1);cyl(body,0xb57445,0,.98,-.48,.08,.08,.4);
const head=new T.Group();head.position.y=1.72;body.add(head);ball(head,0xe8b583,0,0,0,.37,.39,.34);ball(head,0x332d29,0,.22,-.045,.39,.25,.35);ball(head,0x332d29,-.23,.14,.2,.12,.17,.13);ball(head,0xe8b583,-.36,-.01,0,.085);ball(head,0xe8b583,.36,-.01,0,.085);ball(head,0x292f26,-.13,.015,.309,.042,.058,.022);ball(head,0x292f26,.13,.015,.309,.042,.058,.022);ball(head,0xe2a479,0,-.07,.34,.07,.06,.055);
const legs=[],arms=[];for(const s of [-1,1]){const leg=new T.Group();leg.position.set(s*.18,.79,0);body.add(leg);box(leg,0x3c6573,0,-.18,0,.23,.4,.26);cyl(leg,0xe8b583,0,-.43,0,.083,.09,.24);ball(leg,0xe9e0b5,0,-.65,.085,.15,.1,.22);legs.push(leg);const arm=new T.Group();arm.position.set(s*.38,1.35,0);body.add(arm);ball(arm,0xd19a3a,0,-.12,0,.13,.2,.14);cyl(arm,0xe8b583,0,-.35,0,.075,.07,.28);ball(arm,0xe8b583,0,-.51,0,.09);arms.push(arm);}
// Friendly long-necked dinosaur, moving gently behind the trail.
const dino=new T.Group();dino.position.set(-8,0,-10);dino.rotation.y=.8;scene.add(dino);ball(dino,0x789a65,0,1.55,0,1.5,1.15,2.25);ball(dino,0x9bb978,0,1.1,.9,1.1,.7,1.4);for(const x of [-.8,.8])for(const z of [-1.15,1.15]){cyl(dino,0x6b8c5d,x,.68,z,.3,.4,1.25);ball(dino,0x637e56,x,.15,z,.42,.17,.43);}const neck=ball(dino,0x86a76c,0,3.1,1.6,.6,2.1,.7);neck.rotation.x=.25;ball(dino,0x90ae73,0,4.85,2.15,.65,.58,.86);ball(dino,0xc8cc8d,0,4.64,2.45,.47,.25,.55);ball(dino,0x293b31,-.54,4.98,2.4,.08);ball(dino,0x293b31,.54,4.98,2.4,.08);const tail=mesh(new T.ConeGeometry(.6,3.8,7),0x789a65,dino,0,1.65,-3);tail.rotation.x=-1.9;for(let i=0;i<6;i++)ball(dino,0x607e57,0,2.65-i*.12,-.2-i*.45,.17,.2,.21);
const eggGroup=new T.Group();eggGroup.position.set(0,0,-16.5);scene.add(eggGroup);for(let i=0;i<15;i++){const a=i/15*Math.PI*2;const twig=box(eggGroup,0x876746,Math.cos(a)*1.1,.18,Math.sin(a)*.95,1.05,.1,.12);twig.rotation.y=-a;}ball(eggGroup,0x796849,0,.12,0,1.3,.15,1.1);const egg=ball(eggGroup,0xf0e1bb,0,.75,0,.57,.8,.55);for(const p of [[.33,.9,.42],[-.3,.6,.44],[.1,1.25,.38],[-.4,1.04,.27]])ball(eggGroup,0x89a477,...p,.13,.16,.065);
const markers=[];function marker(x,z){const g=new T.Group();g.position.set(x,1.4,z);scene.add(g);const m=mesh(new T.OctahedronGeometry(.16),0xffd889,g);m.material=new T.MeshStandardMaterial({color:0xffd889,emissive:0xc6a239,emissiveIntensity:.55});markers.push({g,base:1.4});return g;}
const clues=[{x:-3,z:10,title:'Dấu chân ba ngón',text:'Dấu chân to quá! Khủng long trong truyện cũng có ba ngón như thế này.',found:false},{x:2.7,z:4.4,title:'Chiếc lá bị gặm',text:'Lá bị gặm ở tận trên cao… Có lẽ một chú khủng long cổ dài đã đi qua!',found:false},{x:-2,z:-7,title:'Mảnh vỏ trứng',text:'Hoa văn này giống quả trứng trong truyện! Chắc chiếc tổ ở quanh đây.',found:false}];
for(const [i,c] of clues.entries()){c.marker=marker(c.x,c.z);c.visual=new T.Group();c.visual.position.set(c.x,0,c.z);scene.add(c.visual);c.visual.scale.setScalar(1.5);if(i===0){for(let j=0;j<4;j++){const g=new T.Group();g.position.set((j%2)*.65,.075,-j*.5);g.rotation.y=-.4;c.visual.add(g);ball(g,0x766945,0,0,0,.18,.025,.22);for(let k=0;k<3;k++)ball(g,0x766945,(k-1)*.14,0,-.2,.065,.02,.14);}}else if(i===1){const leaf=ball(c.visual,0x85b649,0,.13,0,.72,.08,.33);leaf.rotation.y=.5;}else{const shard=mesh(new T.SphereGeometry(.3,8,5,0,Math.PI,0,1.8),0xf0e1bb,c.visual,0,.18,0);shard.rotation.z=.8;shard.material=new T.MeshStandardMaterial({color:0xf0e1bb,side:T.DoubleSide,roughness:.8});ball(c.visual,0x89a477,.12,.32,.06,.075,.025,.06);}}
// Existing marked footbridge: Chu waits for his father before entering.
const footbridge=new T.Group();scene.add(footbridge);
for(let i=0;i<14;i++)box(footbridge,0xb89561,0,.43,-2.6+i*.4,2.15,.18,.35);
for(const x of [-1.13,1.13]){for(const z of [-2.6,-1.3,0,1.3,2.6])box(footbridge,0x715d3f,x,1.05,z,.12,1.5,.12);box(footbridge,0x94784e,x,1.63,0,.13,.12,5.45);box(footbridge,0x94784e,x,1.08,0,.1,.1,5.45);}
const gate=box(scene,0xc68e5b,0,1.12,2.7,2.2,.13,.13);
const sign=new T.Group();sign.position.set(1.8,0,3.25);scene.add(sign);box(sign,0x715d3f,0,.7,0,.12,1.4,.12);box(sign,0xf0da9e,0,1.3,0,.85,.52,.08);
const logMarker=marker(0,3.1),eggMarker=marker(0,-16.5);eggMarker.position.y=2;markers[markers.length-1].base=2;
// A trusted adult accompanies Chu from the beginning.
const adultRigs=new WeakMap();
function createAdult(shirtColor=0x477f9c){
 const g=new T.Group(),torso=new T.Group();g.userData.movingBody=true;g.add(torso);torso.name='adult-torso';
 ball(torso,shirtColor,0,1.55,0,.45,.55,.3);box(torso,0x324e60,0,1.12,0,.62,.16,.34);
 const headRig=new T.Group();headRig.position.y=2.25;torso.add(headRig);
 ball(headRig,0xe5b68b,0,0,0,.33,.39,.31);ball(headRig,0x363330,0,.25,-.04,.35,.19,.32);
 ball(headRig,0xe5b68b,-.33,-.02,0,.07);ball(headRig,0xe5b68b,.33,-.02,0,.07);ball(headRig,0xdba779,0,-.06,.31,.065,.07,.06);
 for(const x of [-.12,.12])ball(headRig,0x26362e,x,.025,.295,.035,.045,.022);
 const legs=[],knees=[],shoulders=[],elbows=[];
 for(const side of [-1,1]){
  const hip=new T.Group();hip.name=side<0?'left-hip':'right-hip';hip.position.set(side*.2,1.12,0);g.add(hip);
  box(hip,0x354f61,0,-.25,0,.25,.51,.29);const knee=new T.Group();knee.position.y=-.49;hip.add(knee);box(knee,0x354f61,0,-.24,0,.23,.48,.25);ball(knee,0x453f34,0,-.5,.09,.17,.12,.26);legs.push(hip);knees.push(knee);
  const shoulder=new T.Group();shoulder.name=side<0?'left-shoulder':'right-shoulder';shoulder.position.set(side*.45,1.85,0);torso.add(shoulder);ball(shoulder,shirtColor,0,-.17,0,.14,.26,.16);cyl(shoulder,0xe5b68b,0,-.34,0,.09,.1,.25);const elbow=new T.Group();elbow.position.y=-.43;shoulder.add(elbow);cyl(elbow,0xe5b68b,0,-.16,0,.075,.085,.3);ball(elbow,0xe5b68b,0,-.33,0,.095);shoulders.push(shoulder);elbows.push(elbow);
 }
 adultRigs.set(g,{torso,headRig,legs,knees,shoulders,elbows,phase:0,blend:0,previous:new T.Vector3()});return g;
}
function animateAdult(g,dt,time,pushing=false){
 const r=adultRigs.get(g);if(!r)return;const distance=Math.hypot(g.position.x-r.previous.x,g.position.z-r.previous.z),speed=Math.min(distance/Math.max(dt,.001),4);r.previous.copy(g.position);r.phase+=Math.min(distance,.2)*5.4;r.blend=T.MathUtils.lerp(r.blend,speed>.08?Math.min(speed/2.1,1):0,1-Math.exp(-dt*10));
 r.legs.forEach((leg,i)=>{const swing=Math.sin(r.phase+i*Math.PI);leg.rotation.x=swing*.48*r.blend;r.knees[i].rotation.x=Math.max(0,-swing)*.48*r.blend;r.shoulders[i].rotation.x=pushing?-.65:-swing*.38*r.blend;r.elbows[i].rotation.x=-.16-Math.max(0,swing)*.18*r.blend;});
 r.torso.position.y=Math.abs(Math.sin(r.phase))*.035*r.blend+Math.sin(time*1.8)*.008*(1-r.blend);r.torso.rotation.z=Math.sin(r.phase)*.025*r.blend;r.headRig.rotation.y=Math.sin(time*.65)*.055*(1-r.blend);
}
const father=createAdult();scene.add(father);father.position.set(1.4,0,17.5);adultRigs.get(father).previous.copy(father.position);
const fireflies=[];for(let i=0;i<22;i++){const m=ball(scene,0xf5dc8f,(rand()-.5)*22,1+rand()*3,(rand()-.5)*40,.035);m.castShadow=false;m.material=new T.MeshBasicMaterial({color:0xfbe3a0});fireflies.push({m,x:m.position.x,y:m.position.y,z:m.position.z,p:rand()*6});}
// Four chapters share the character and renderer; only the active world is visible.
const forestNodes=scene.children.filter(n=>n!==chu&&n!==father&&!n.isLight);
const forestBlockers=blockers.map(b=>({...b}));
const baseGeometries=new Set(),baseMaterials=new Set();scene.traverse(n=>{if(n.geometry)baseGeometries.add(n.geometry);if(n.material)baseMaterials.add(n.material);});
const world=new T.Group();world.userData.terrainRoot=true;scene.add(world);const terrainCollisions=new TerrainCollisions();let followTrail=[];
const hemi=scene.children.find(n=>n.isHemisphereLight);
const chapters=[
 {name:'Khu rừng thì thầm',subtitle:'Bắt đầu bằng những điều nhỏ bé.',badge:'Biết quan sát',color:0xa9c9a7},
 {name:'Hang ánh sáng',subtitle:'Bình tĩnh, quan sát và đi cùng nhau.',badge:'Biết bình tĩnh',color:0x273642},
 {name:'Thung lũng bị lãng quên',subtitle:'Khám phá bằng đôi mắt, giữ khoảng cách bằng đôi chân.',badge:'Biết tôn trọng',color:0xb7d6c1},
 {name:'Đường về tổ ấm',subtitle:'Một chuyến đi đẹp là khi tất cả trở về an toàn.',badge:'Biết hợp tác',color:0xc7bfac}
];
let adventureId='chapter-1',previewMode=false;const birds=[];let du=null;
const stageInfo=()=>adventures[adventureId]?.stages[chapter]||chapters[chapter];
const canPlay=id=>implementedIds.includes(id)&&(previewMode||available(catalog.chapters.find(c=>c.id===id)));
let state='intro',chapter=0,bridge=false,target=null,elapsed=0,noticeUntil=0,steps=0,totalPlay=0,soundOn=true,audio=null;
let completed=new Set(),notes=[],badges=[],items=[],puzzleStep=0,escort=false,raining=false,flashlightOn=false,lastSafeToast=0;
const keys=new Set(),joy={x:0,y:0};let primaryAction=null,secondaryAction=null,choiceActions=[],restored=null,stickId=null;
let cloud=null,started=false,finishedRun=false,shell=null;
try{localStorage.removeItem('chu-adventure-v1-checkpoint');}catch{}
const chapterMarkers=[];const movingCreatures=[];const activeDecor=[];
let ranger=null,cart=null,baby=null,finalEgg=null,rainMesh=null,guideBeam=null;
const lightTarget=new T.Object3D();scene.add(lightTarget);const torch=new T.SpotLight(0xffe2a1,0,15,.65,.65,1);torch.target=lightTarget;scene.add(torch);
function soundButton(){const b=$('sound');b.style.background=soundOn?'#796936':'#123c35cc';b.setAttribute('aria-label',soundOn?'Tắt nhạc và âm thanh':'Bật nhạc và âm thanh');b.setAttribute('aria-pressed',String(soundOn));b.title=soundOn?'Nhạc và âm thanh đang bật':'Nhạc và âm thanh đang tắt';}
function initAudio(){if(!soundOn)return;if(!audio){try{audio=createSoundscape();}catch{audio=null;}}if(audio)audio.unlock();}
function tone(freq,dur=.2,vol=.025){if(soundOn)audio?.effect(freq,dur,vol);}
function toast(text,dur=5){$('notice').textContent=text;$('notice').classList.add('visible');noticeUntil=elapsed+dur;}
function release(){joy.x=joy.y=0;stickId=null;$('knob').style.transform='';}
function resume(){state='play';$('modal').classList.add('hidden');keys.clear();release();$('pause').innerHTML='Ⅱ <span>Tạm dừng</span>';$('pause').setAttribute('aria-label','Tạm dừng');}
function dialog(label,title,html,options=[{label:'Tiếp tục khám phá',run:resume}],hint=''){
 state='dialog';shell?.close();keys.clear();release();$('context').style.display='none';$('modalLabel').textContent=label;$('modalTitle').innerHTML=title;$('modalText').innerHTML=html;$('modalHint').textContent=hint;$('choices').replaceChildren();$('secondary').hidden=true;secondaryAction=null;choiceActions=options.map(o=>o.run);
 if(options.length===1){$('start').hidden=false;$('start').textContent=options[0].label;primaryAction=options[0].run;}else{$('start').hidden=true;primaryAction=null;options.forEach(o=>{const b=document.createElement('button');b.textContent=o.label;b.onclick=()=>{initAudio();o.run();};$('choices').appendChild(b);});}
 $('modal').classList.remove('hidden');queueMicrotask(()=>($('choices').querySelector('button')||$('start')).focus());
}
function remember(title,text){if(!notes.some(n=>n.title===title))notes.push({title,text,chapter});}
function done(id,title,text){completed.add(id);queueMicrotask(checkpoint);if(title){remember(title,text);const note=notes.find(n=>n.title===title);if(note&&discoveryArt(id))note.discoveryId=id;}const item=items.find(i=>i.id===id);if(item?.marker)item.marker.visible=false;tone(660);quest();}
function captureDiscovery(id){
 if(discoveryPicture(id)||!discoveryArt(id))return;
 let subject=null,temporary=false;
 const clueIndex=['foot','leaf','shell'].indexOf(id);
 if(clueIndex>=0)subject=clues[clueIndex].visual;
 else if(['egg','nest'].includes(id))subject=eggGroup;
 else if(/^glyph[123]$/.test(id)){subject=plaque(0,0,Number(id.slice(-1))-1);temporary=true;}
 else {const species={lookout:'Diplodocus',diplodocus:'Diplodocus',longneck:'Diplodocus',horns:'Triceratops',plates:'Stegosaurus',club:'Ankylosaurus',iguanodon:'Iguanodon'}[id];if(species)subject=species==='Diplodocus'?dino:movingCreatures.find(c=>c.g.userData.species===species)?.g;
 if(id==='fossil'){subject=new T.Group();for(const obj of world.children)if(Math.abs(obj.position.x-7)<1.1&&Math.abs(obj.position.z-8)<.8&&obj.position.y>.8)subject.add(obj.clone());temporary=true;}}
 if(!subject)return;
 const preview=new T.Scene(),model=subject.clone(true);model.position.set(0,0,0);model.rotation.set(0,0,0);model.visible=true;preview.add(model);preview.add(new T.HemisphereLight(0xfff7df,0x345448,3));const light=new T.DirectionalLight(0xffe6b3,3);light.position.set(-3,6,8);preview.add(light);
 const bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());model.position.sub(center);const extent=Math.max(size.x,size.y,size.z,.5),cam=new T.PerspectiveCamera(35,4/3,.01,1000);cam.position.set(extent*1.25,extent*1.5,extent*2.15);cam.lookAt(0,0,0);
 const target=new T.WebGLRenderTarget(640,480),previous=renderer.getRenderTarget(),oldColor=renderer.getClearColor(new T.Color()),oldAlpha=renderer.getClearAlpha();
 try{renderer.setRenderTarget(target);renderer.setClearColor(0x244c3c,1);renderer.render(preview,cam);const pixels=new Uint8Array(640*480*4);renderer.readRenderTargetPixels(target,0,0,640,480,pixels);const canvas=document.createElement('canvas');canvas.width=640;canvas.height=480;const ctx=canvas.getContext('2d'),image=ctx.createImageData(640,480);for(let y=0;y<480;y++)image.data.set(pixels.subarray((479-y)*640*4,(480-y)*640*4),y*640*4);ctx.putImageData(image,0,0);setDiscoveryPicture(id,canvas.toDataURL('image/webp',.88));}
 catch(error){console.warn('Discovery preview unavailable',error);}
 finally{renderer.setRenderTarget(previous);renderer.setClearColor(oldColor,oldAlpha);target.dispose();if(temporary)world.remove(subject);}
}
function acknowledge(item,text){captureDiscovery(item.id);const art=discoveryPicture(item.id);if(art){tone(880,.3);setTimeout(()=>tone(1100,.2),130);}dialog(art?'KHÁM PHÁ MỚI!':'NHẬT KÝ CỦA CHU',item.title,discoveryMarkup(item.id,text),[{label:'Ghi vào nhật ký',run:()=>{done(item.id,item.title,item.note||text.replace(/<[^>]*>/g,''));resume();}}]);}
function choose(id,title,text,options,correct,lesson,after){
 const show=()=>dialog('DỪNG LẠI VÀ SUY NGHĨ',title,text,options.map((label,i)=>({label,run:()=>{
  if(i!==correct){dialog('MÌNH THỬ NGHĨ THÊM NHÉ',title,lesson.wrong,[{label:'Chọn lại',run:show}]);return;}
  done(id,lesson.title,lesson.text);captureDiscovery(id);dialog('MỘT LỰA CHỌN CẨN THẬN',lesson.title,discoveryMarkup(id,lesson.text),[{label:lesson.button||'Tiếp tục cùng bố',run:()=>{if(after)after();resume();quest();}}]);
 }})),'Chọn điều Chu nên làm. Chọn lại được, không mất điểm.');show();
}
function item(id,title,x,z,run,{markerObject=null,required=true,note='',range=2.3,action='Quan sát'}={}){
 let m=markerObject;if(m)m.scale.setScalar(1.8);if(!m){m=new T.Group();m.position.set(x,1.65,z);world.add(m);const gem=mesh(new T.OctahedronGeometry(.32),0xffd889,m);gem.material=new T.MeshStandardMaterial({color:0xffd889,emissive:0xc6a239,emissiveIntensity:.7});chapterMarkers.push(m);}
 if(id!=='exit'){const halo=mesh(new T.RingGeometry(.52,.65,32),0xffdf8b,m);halo.rotation.x=-Math.PI/2;halo.material=new T.MeshBasicMaterial({color:0xffdf8b,side:T.DoubleSide,transparent:true,opacity:.8,depthWrite:false});}
 const it={id,title,x,z,run,marker:m,required,note,range,action};items.push(it);return it;
}
function allDone(){return items.filter(i=>i.required&&i.id!=='exit').every(i=>completed.has(i.id));}
function quest(){$('currentAdventureTitle').textContent=`Chương ${adventureId.split('-')[1]} · ${catalog.chapters.find(c=>c.id===adventureId)?.title||'Quả trứng thất lạc'}`;const req=items.filter(i=>i.required&&i.id!=='exit');const n=req.filter(i=>completed.has(i.id)).length;const next=req.find(i=>!completed.has(i.id));$('chapterTag').textContent=`CHẶNG ${chapter+1} / 4`;$('locationTag').textContent=`CHƯƠNG ${adventureId.split('-')[1]} · CHẶNG ${chapter+1}`;$('place').textContent=catalog.chapters.find(c=>c.id===adventureId)?.stages[chapter]||stageInfo().name;$('objective').textContent=next?.title||'Sẵn sàng đi tiếp';$('goal').textContent=next?taskHint(next.id):adventureId==='chapter-1'&&chapter===3?'Đến điểm quan sát để tiễn quả trứng về tổ.':'Theo đường mòn đến điểm sáng cuối chặng.';$('count').textContent=`${n} / ${req.length} khám phá`;$('progressFill').style.width=`${req.length?n/req.length*100:0}%`;}
function taskHint(id){if(adventureId!=='chapter-1'){const t=stageInfo().tasks.find(t=>t.id===id);return t?`Tìm điểm sáng: ${t.title}.`:'Đến cổng cuối đường để sang chặng tiếp theo.';}return ({berry:'Quan sát bụi quả tím bên trái đường.',foot:'Tìm dấu chân ba ngón ở đầu đường.',leaf:'Quan sát chiếc lá gần cầu.',river:'Dừng ở đầu cầu và nhờ bố đi cùng.',shell:'Tìm mảnh vỏ trứng bên kia suối.',pack:'Cùng bố kiểm tra trước khi vào hang.',lamp:'Đến điểm đèn vàng trên đường tham quan.',glyph1:'Quan sát tấm bia có một lá cây.',glyph2:'Tìm tấm bia có hai dấu chân.',glyph3:'Tìm tấm bia có ba tia nắng.',door:'Dùng ba biểu tượng trong nhật ký mở cửa.',lookout:'Quan sát khủng long từ hàng rào.',water:'Quan sát hồ từ đường đi.',trail:'Đối chiếu biển chỉ đường với bản đồ.',egg:'Báo cô kiểm lâm về quả trứng.',rest:'Cùng bố nghỉ và chuẩn bị đường về.',weather:'Quan sát mây và chọn nơi trú phù hợp.',shelter:'Đến nhà nghỉ có mái và chờ cùng bố.',nest:'So sánh hoa văn để tìm đúng tổ.',exit:'Đến điểm sáng cuối đường.'})[id]||'Theo đường đi và tìm điểm sáng vàng.';}
function hint(){const n=items.find(i=>i.required&&!completed.has(i.id)&&i.id!=='exit')||items.find(i=>i.id==='exit');if(!n)return;const dx=n.x-chu.position.x,dz=n.z-chu.position.z;toast(`${taskHint(n.id)} Còn khoảng ${Math.ceil(Math.hypot(dx,dz))} bước. Đi theo cột sáng vàng.`,7);if(guideBeam)world.remove(guideBeam);guideBeam=cyl(world,0xffd778,n.x,3,n.z,.08,.5,6,8);guideBeam.material=new T.MeshBasicMaterial({color:0xffd778,transparent:true,opacity:.32,depthWrite:false});}
function progressSnapshot(){return {version:2,chapterId:adventureId,stage:chapter,notes:structuredClone(notes),badges:[...badges],totalPlay,finished:finishedRun,completed:[...completed],position:{x:chu.position.x,z:chu.position.z},puzzleStep};}
function checkpoint(){if(!previewMode)cloud?.changed();}
function restoreProgress(s){if(!s||!canPlay(s.chapterId))return false;
 const allowed=s.chapterId==='chapter-1'?[['berry','foot','leaf','river','shell'],['pack','lamp','glyph1','glyph2','glyph3','door'],['lookout','water','trail','egg'],['rest','weather','shelter','nest']]:adventures[s.chapterId].stages.map(s=>s.tasks.map(t=>t.id));
 if(!s||s.version!==2||!implementedIds.includes(s.chapterId)||!Number.isInteger(s.stage)||s.stage<0||s.stage>3||!Array.isArray(s.completed)||s.completed.length>6||!s.completed.every(id=>allowed[s.stage].includes(id))||!Array.isArray(s.notes)||s.notes.length>40||!s.notes.every(n=>n&&Number.isInteger(n.chapter)&&n.chapter>=0&&n.chapter<=3&&typeof n.title==='string'&&typeof n.text==='string'&&n.title.length<200&&n.text.length<2000&&!/[<>]/.test(n.title+n.text))||!Array.isArray(s.badges)||s.badges.length>4||!s.badges.every(b=>(adventures[s.chapterId]?.stages||chapters).some(c=>c.badge===b))||!Number.isFinite(s.totalPlay)||s.totalPlay<0||s.totalPlay>1e9||typeof s.finished!=='boolean'||!Number.isInteger(s.puzzleStep)||s.puzzleStep<0||s.puzzleStep>3||!s.position||!Number.isFinite(s.position.x)||!Number.isFinite(s.position.z))return false;
 $('cover').hidden=true;document.body.classList.remove('coverMode');adventureId=s.chapterId;chapter=s.stage;notes=structuredClone(s.notes);badges=[...s.badges];totalPlay=s.totalPlay;started=true;finishedRun=s.finished;buildChapter();completed=new Set(s.completed);puzzleStep=s.puzzleStep;
 for(const it of items)if(completed.has(it.id)&&it.marker)it.marker.visible=false;
 bridge=adventureId==='chapter-1'&&chapter===0&&completed.has('river');if(bridge){gate.visible=false;logMarker.visible=false;}
 flashlightOn=adventureId==='chapter-1'&&chapter===1&&completed.has('lamp');
 raining=adventureId==='chapter-1'&&chapter===3&&completed.has('weather')&&!completed.has('shelter');if(rainMesh)rainMesh.visible=raining;if(raining){sun.intensity=.65;renderer.setClearColor(0x8a9ca4);}
 if(legal(s.position.x,s.position.z))chu.position.set(s.position.x,0,s.position.z);father.position.set(chu.position.x+1,0,chu.position.z+1);adultRigs.get(father).previous.copy(father.position);for(const note of notes)if(note.discoveryId)captureDiscovery(note.discoveryId);look.copy(chu.position);followTrail=[{x:chu.position.x,z:chu.position.z}];quest();resume();if(finishedRun){if(finalEgg)finalEgg.visible=true;if(baby)baby.visible=true;if(cart)cart.visible=false;state='epilogue';}return true;
}
function showWelcome(){shell?.close();state='cover';$('modal').classList.add('hidden');$('cover').hidden=false;document.body.classList.add('coverMode');keys.clear();release();}
function resetRun(){started=false;finishedRun=false;chapter=0;notes=[];badges=[];totalPlay=0;buildChapter();showWelcome();}
function finishChapter(){if(adventureId!=='chapter-1'){finishAdventureStage();return;}if(!allDone()){toast('Mình còn vài điều cần khám phá. Mở nhật ký hoặc bấm Gợi ý nhé.',5);hint();return;}const badge=chapters[chapter].badge;if(!badges.includes(badge))badges.push(badge);if(chapter===3){ending();return;}dialog('MỘT TRANG NHẬT KÝ MỚI',`Chu đã ${['biết quan sát','biết bình tĩnh','biết tôn trọng'][chapter]}.`,`<div class="badgeLine"><span>✦ ${badge}</span></div>${['Dấu vết dẫn đến một hang tham quan có lối đi được đánh dấu. Bố kiểm tra biển mở cửa rồi cùng Chu đi tiếp.','Cánh cửa biểu tượng mở ra một thung lũng xanh. Tiếng khủng long vọng lại từ xa.','Cô kiểm lâm đặt quả trứng lên xe chuyên dụng. Chu và bố sẽ theo đường được hướng dẫn, giúp cô nhận ra chiếc tổ.'][chapter]}`,[{label:`Đến ${chapters[chapter+1].name.toLowerCase()}`,run:()=>{chapter++;buildChapter();checkpoint();resume();toast(cloud?.signedIn?'Đang đồng bộ chặng mới…':'Chơi khách: đăng nhập để lưu hành trình.',4);}}]);}
function ending(){if(finalEgg)finalEgg.visible=true;if(cart)cart.visible=false;if(baby)baby.visible=true;finishedRun=true;checkpoint();dialog('CHUYẾN PHIÊU LƯU ĐẦU TIÊN ĐÃ HOÀN THÀNH','Một mái ấm.<br>Một người bạn mới.',`Từ điểm quan sát, Chu thấy cô kiểm lâm đưa quả trứng về tổ. Vỏ trứng khẽ nứt, một chú khủng long con ló đầu ra.<br><br>Chu mở cuốn truyện và vẽ thêm một trang: <strong>“Mình đã tìm thấy khủng long — và học cách khám phá thật cẩn thận.”</strong><div class="badgeLine">${badges.map(b=>`<span>✦ ${b}</span>`).join('')}</div>`,[{label:'Ngắm gia đình khủng long',run:()=>{state='epilogue';$('modal').classList.add('hidden');toast('Mở Nhật ký để xem hành trình hoặc chơi lại.',8);}},{label:'Xem nhật ký chuyến đi',run:()=>journal(true)}],'Cảm ơn bạn đã đồng hành cùng Chu.');}
function journal(finished=false){if(!['play','paused','epilogue'].includes(state)&&!finished)return;const back=state==='epilogue'||finished?'epilogue':'play';dialog('CUỐN TRUYỆN ĐÃ THÀNH NHẬT KÝ','Những điều Chu học được',`<div class="badgeLine">${badges.map(b=>`<span>✦ ${b}</span>`).join('')}</div>${notes.length?notes.map(n=>`<div class="journalEntry"><small>CHẶNG ${n.chapter+1}</small><strong> · ${n.title}</strong><p>${n.text}</p>${discoveryPicture(n.discoveryId||'')?`<button class="reviewDiscovery" data-note="${notes.indexOf(n)}">Xem hình khám phá</button>`:''}</div>`).join(''):'Nhật ký còn trống. Hãy đến gần điểm sáng và quan sát điều đầu tiên.'}`,[{label:finished?'Trở lại điểm quan sát':'Đóng nhật ký',run:()=>{resume();state=back;}},{label:'Chơi lại từ đầu',run:confirmRestart}]);}
function confirmRestart(){dialog('MỘT CHUYẾN ĐI MỚI','Chơi lại từ đầu?','Hành trình hiện tại sẽ bắt đầu lại. Nếu đã đăng nhập và chọn đồng bộ, bản lưu trên tài khoản sẽ được thay thế.',[{label:'Giữ hành trình hiện tại',run:resume},{label:'Bắt đầu lại',run:newGame}]);}
function newGame(id=adventureId){if(typeof id!=='string')id=adventureId;if(!canPlay(id)){showWelcome();return;}adventureId=id;$('cover').hidden=true;document.body.classList.remove('coverMode');initAudio();started=true;finishedRun=false;chapter=0;notes=[];badges=[];totalPlay=0;buildChapter();checkpoint();introStory();}
function introStory(){if(adventureId!=='chapter-1'){dialog('CHƯƠNG '+adventureId.split('-')[1],adventures[adventureId].title,adventures[adventureId].intro,[{label:'Cùng nhau lên đường',run:resume}]);return;}dialog('01 · CUỐN TRUYỆN CŨ','Một ngọn núi rất quen…','Chu đang đọc truyện khủng long thì nhận ra ngọn núi trong tranh giống hệt ngọn núi sau làng.<br><br><strong>“Bố ơi, mình cùng đi tìm dấu vết được không?”</strong>',[{label:'Mở trang tiếp theo',run:()=>dialog('02 · CHUẨN BỊ LÊN ĐƯỜNG','Một ba lô nhỏ,<br>một người bạn lớn.','Bố chuẩn bị nước uống, đèn và bản đồ. Hai bố con hẹn nhau: luôn đi trên đường cho phép, ở gần nhau và dừng lại khi chưa chắc chắn.<br><br>Chu bỏ cuốn truyện vào ba lô. Chuyến khám phá bắt đầu!',[{label:'Cùng bố vào khu rừng',run:resume}],'WASD / phím mũi tên hoặc cần cảm ứng để di chuyển. E để tương tác.')}]);}
function smallSign(parent,x,z){const g=new T.Group();g.position.set(x,0,z);parent.add(g);box(g,0x6b5741,0,.6,0,.12,1.2,.12);box(g,0xdfc892,0,1.15,0,.75,.5,.1);return g;}
function rope(parent,x,z,length){for(let n=0;n<=length;n+=2.5)cyl(parent,0x927659,x,.65,z-n,.065,.09,1.3,5);box(parent,0xc6b587,x,1.05,z-length/2,.045,.045,length);}
function cloneDino(x,z,scale=1,options={}){
 const g=new T.Group();g.userData.movingBody=true;g.position.set(x,0,z);g.scale.setScalar(scale);world.add(g);
 const colors=options.colors||[0x7f9d6b,0xaac283];const trunk=new T.Group();g.add(trunk);ball(trunk,colors[0],0,1.65,0,1.25,1,1.9);ball(trunk,colors[1],0,1.24,.5,.93,.64,1.45);
 const legs=[];for(const lx of [-.8,.8])for(const lz of [-1.05,1.05]){const leg=new T.Group();leg.position.set(lx,1.3,lz);g.add(leg);cyl(leg,colors[0],0,-.55,0,.25,.33,1.1);ball(leg,0x647b55,0,-1.15,.06,.37,.16,.43);legs.push(leg);}
 const neckRig=new T.Group();neckRig.position.set(0,1.95,1.3);trunk.add(neckRig);const n=ball(neckRig,colors[0],0,1.15,.2,.48,1.55,.55);n.rotation.x=.12;
 const headRig=new T.Group();headRig.position.set(0,2.65,.75);neckRig.add(headRig);ball(headRig,colors[0],0,0,0,.55,.48,.69);ball(headRig,colors[1],0,-.22,.32,.43,.22,.49);
 for(const xx of [-.47,.47]){ball(headRig,0x263d31,xx,.12,.27,.066);ball(headRig,0xf6ecc6,xx*.98,.135,.315,.018);}
 const jaw=new T.Group();jaw.position.set(0,-.26,.23);headRig.add(jaw);ball(jaw,colors[1],0,0,.16,.4,.09,.42);
 const tailRig=new T.Group();tailRig.position.set(0,1.55,-1.65);trunk.add(tailRig);const tailPart=mesh(new T.ConeGeometry(.48,3.3,7),colors[0],tailRig,0,0,-1.4);tailPart.rotation.x=-Math.PI/2;
 for(let i=0;i<5;i++)ball(trunk,colors[1],0,2.55-i*.045,.65-i*.5,.16,.14,.23);
 const data={g,scale,trunk,legs,neckRig,headRig,jaw,tailRig,x,z,rx:options.rx??.7,rz:options.rz??1.65,offset:options.offset??movingCreatures.length*4.7,walk:options.walk!==false,phase:0,blend:0,previous:g.position.clone()};movingCreatures.push(data);
 // Grass tufts stay inside the animal enclosure, where each animal pauses to graze.
 if(data.walk)for(const side of [-1,1])for(let i=0;i<9;i++){const a=i*2.4;const blade=mesh(new T.ConeGeometry(.14,.55,4),i%2?0x93ae58:0x658e48,world,x+Math.cos(a)*.9,.2,z+side*data.rz+Math.sin(a)*.8);blade.rotation.z=Math.sin(i)*.3;}
 return g;
}
function animateDinosaur(d,dt,time){
 const t=time+d.offset,cycle=Math.floor(t/26),p=t%26,progress=Math.min(p/10,1),direction=cycle%2?1:-1;
 if(d.walk){d.g.position.x=d.x+Math.sin(progress*Math.PI)*d.rx;d.g.position.z=d.z+direction*(progress*2-1)*d.rz;}
 const dx=d.g.position.x-d.previous.x,dz=d.g.position.z-d.previous.z,distance=Math.hypot(dx,dz);d.previous.copy(d.g.position);const walking=d.walk&&p<10;d.phase+=Math.min(distance,.12)*5;d.blend=T.MathUtils.lerp(d.blend,walking?1:0,1-Math.exp(-dt*7));
 if(distance>.0001&&walking){const heading=Math.atan2(dx,dz);d.g.rotation.y+=(T.MathUtils.euclideanModulo(heading-d.g.rotation.y+Math.PI,Math.PI*2)-Math.PI)*Math.min(dt*2,1);}
 d.legs.forEach((leg,i)=>{leg.rotation.x=Math.sin(d.phase+(i===0||i===3?0:Math.PI))*.3*d.blend;});
 const grazing=d.walk&&p>11&&p<23;d.neckRig.rotation.x=T.MathUtils.lerp(d.neckRig.rotation.x,grazing?(d.grazeAngle??1.73):0,1-Math.exp(-dt*1.7));d.headRig.rotation.y=grazing?Math.sin(time*1.8+d.offset)*.09:Math.sin(time*.45+d.offset)*.12;d.jaw.rotation.x=grazing?Math.max(0,Math.sin(time*5))*.16:0;d.tailRig.rotation.y=Math.sin(time*.8+d.offset)*.15;d.trunk.position.y=Math.sin(time*1.2+d.offset)*.015+Math.sin(d.phase*2)*.025*d.blend;
}
function adventurePortal(z,cave=false){
 const g=new T.Group();g.position.z=z;world.add(g);const rockColors=cave?[0x687981,0x7a8787,0x89958e]:[0x7d8671,0x94957a,0x67785e];
 const mouth=new T.Shape();mouth.moveTo(-3,0);mouth.lineTo(-3,1.15);mouth.bezierCurveTo(-3.2,5,2.8,5.4,3,1.2);mouth.lineTo(3,0);mouth.closePath();const opening=mesh(new T.ShapeGeometry(mouth),0x213c3c,g,0,0,-.8);opening.material=new T.MeshBasicMaterial({color:cave?0x47666a:0x1c3330,side:T.DoubleSide});
 for(let i=0;i<13;i++){const a=i/12*Math.PI;const r=3.4+Math.sin(i*2.1)*.2;const rock=ball(g,rockColors[i%3],Math.cos(a)*r,.35+Math.sin(a)*3.7,-.1+Math.sin(i)*.25,.7+(i%3)*.1,.85,1.05);rock.rotation.z=a*.35;}
 for(const side of [-1,1]){ball(g,rockColors[0],side*4.1,.6,.2,1.5,.95,1.4);ball(g,0x5b7952,side*3.2,1.1,.65,.7,.23,.6);}
 for(let i=0;i<5;i++){const xx=-2.1+i*1.02,yy=3.7-Math.abs(xx)*.18,len=.7+(i%3)*.35;const vine=new T.CatmullRomCurve3([new T.Vector3(xx,yy,.7),new T.Vector3(xx+.15,yy-len*.5,.85),new T.Vector3(xx-.12,yy-len,1)]);mesh(new T.TubeGeometry(vine,8,.04,4,false),0x476e45,g);for(let k=0;k<3;k++){const leaf=ball(g,0x63864b,xx+(k%2?.12:-.13),yy-k*len/3,.92,.18,.085,.12);leaf.rotation.z=k%2?.5:-.5;}}
 for(const side of [-1,1]){cyl(g,0x796443,side*2.45,.7,1.1,.08,.1,1.4);const lantern=ball(g,0xffd690,side*2.45,1.5,1.1,.18,.27,.18);lantern.material=new T.MeshStandardMaterial({color:0xffd690,emissive:0xe9ac50,emissiveIntensity:1.2});}
 const glow=new T.PointLight(cave?0xb0d4b4:0xffd08d,5,8,1.5);glow.position.set(0,2.2,1);g.add(glow);activeDecor.push({glow,phase:z});
 if(cave)for(let i=0;i<3;i++){const rune=mesh(new T.OctahedronGeometry(.2),[0xa9cc83,0xd7c294,0xf2d681][i],g,(i-1)*.68,3.55,1);rune.rotation.z=i*.3;}
 return g;
}
function makeEgg(x,z){const g=eggGroup.clone(true);g.visible=true;g.position.set(x,0,z);world.add(g);return g;}
function plaque(x,z,kind){const g=new T.Group();g.position.set(x,0,z);world.add(g);box(g,0x6b7880,0,.5,0,1.3,1,.7);if(kind===0){const leaf=ball(g,0x9ac977,0,1.1,0,.4,.1,.2);leaf.rotation.y=.6;}if(kind===1){for(const x of [-.2,.2]){ball(g,0xd6c090,x,1.1,0,.12,.05,.2);for(let j=-1;j<=1;j++)ball(g,0xd6c090,x+j*.085,1.1,-.16,.035,.04,.09);}}if(kind===2){ball(g,0xf3ce75,0,1.2,0,.25);for(let i=0;i<8;i++){const ray=box(g,0xf3ce75,Math.cos(i*Math.PI/4)*.36,1.2,Math.sin(i*Math.PI/4)*.36,.16,.05,.04);ray.rotation.y=-i*Math.PI/4;}}return g;}
function commonGround(color,pathColor=0xbca988){landscape(world,color,chapter===2);const v=[],ind=[];for(let i=0;i<=60;i++){const z=28-i,center=Math.sin(z*.16)*.65,width=2.8+.25*Math.sin(z*.43);v.push(center-width,.018,z,center+width,.018,z);if(i<60){const k=i*2;ind.push(k,k+2,k+1,k+1,k+2,k+3);}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(ind);g.computeVertexNormals();const pathMesh=mesh(g,pathColor,world);pathMesh.material.side=T.DoubleSide;}
function buildCave(){
 commonGround(0x414c55,0x788481);hemi.intensity=1.25;sun.intensity=.8;
 for(let i=0;i<32;i++){const side=i%2?-1:1;const z=-24+Math.floor(i/2)*3.2;ball(world,[0x53616b,0x46535e,0x64717a][i%3],side*(8+rand()*3),1.5,z,2+rand(),2+rand()*2,2);}
 rope(world,-6.4,23,46);rope(world,6.4,23,46);
 for(let i=0;i<18;i++){const x=(i%2?-1:1)*(4.3+rand()*1.2),z=22-i*2.6;const cap=ball(world,i%2?0x82c9b5:0x96afe0,x,.65,z,.45,.18,.45);cyl(world,0xb5c2bd,x,.3,z,.07,.1,.6);cap.material=new T.MeshStandardMaterial({color:i%2?0x82c9b5:0x96afe0,emissive:i%2?0x3a9889:0x6473b1,emissiveIntensity:.8});}
 for(const z of [16,4,-8,-19]){cyl(world,0x88724d,-5,1.1,z,.07,.1,2.2);const bulb=ball(world,0xffd284,-5,2.2,z,.2);bulb.material=new T.MeshBasicMaterial({color:0xffd284});}
 for(const z of [3,-14]){const l=new T.PointLight(0x90b9d3,7,13,1.2);l.position.set(0,4,z);world.add(l);}
 plaque(-4,12,0);plaque(4,-1,1);plaque(-4,-12,2);
 adventurePortal(-21,true);
 smallSign(world,1.6,18);flashlightOn=true;
}
function buildValley(){
 commonGround(0x86a85f,0xd1bd83);hemi.intensity=2.3;sun.intensity=2.8;
 const lake=ball(world,0x63b6c4,9,.02,1,5.5,.03,8);lake.castShadow=false;
 for(let i=0;i<35;i++){const x=(rand()-.5)*40,z=(rand()-.5)*48;if(Math.abs(x)<6||Math.hypot(x-9,z-1)<9)continue;ball(world,0x799355,x,.4,z,.7,.65,.8);if(i%3===0)ball(world,0xb9bd87,x,.2,z,1.2,.5,1.2);}
 for(let i=0;i<9;i++)ball(world,0x90a78a,-20+i*5,3,-26,4,4+rand()*4,4);
 cloneDino(-10.8,7,.86,{offset:0,rx:.45,rz:1.5});cloneDino(-15.8,12,1.02,{offset:6,colors:[0x8e9a69,0xc0c48b]});cloneDino(-17,2,.67,{offset:13,colors:[0x78968a,0xb2c8a0]});cloneDino(-11.5,-5,.8,{offset:19,rx:.4});cloneDino(-17,-10,1.1,{offset:9,colors:[0x939774,0xc8c699]});cloneDino(-11.8,-15,.55,{offset:3});cloneDino(-20,19,.7,{offset:16,colors:[0x8e9675,0xc1c7a3]});rope(world,-5.4,24,46);rope(world,-24,24,46);box(world,0xc6b587,-14.7,1.05,24,18.6,.08,.08);box(world,0xc6b587,-14.7,1.05,-22,18.6,.08,.08);rope(world,3.9,8,15);
 smallSign(world,0,-5);box(world,0x4d7e62,.15,1.2,-5,.9,.14,.09);box(world,0xb37f59,-.25,.95,-5,.8,.13,.09);
 makeEgg(3,-13);ranger=createAdult(0x778365);ranger.position.set(5,0,-13);world.add(ranger);cyl(ranger,0xb8a774,0,2.55,0,.52,.52,.06,10);cyl(ranger,0xb8a774,0,2.67,0,.32,.36,.22,10);
 smallSign(world,-3,10);smallSign(world,3,3);smallSign(world,0,-21);
}
function buildMountain(){
 commonGround(0x8f9879,0xc3b187);hemi.intensity=2;sun.intensity=2.1;

 for(let i=0;i<12;i++){const x=(i%2?-1:1)*(28+rand()*25),z=(rand()-.5)*105;ball(world,0x7d877a,x,1,z,2+rand()*2,2+rand()*4,2);}
 const hut=new T.Group();hut.position.set(-2,0,-1);world.add(hut);box(hut,0x826a4b,0,1.2,-1.35,4.4,2.4,.2);box(hut,0xa08c63,-2.1,1.2,0,.2,2.4,2.7);box(hut,0xa08c63,2.1,1.2,0,.2,2.4,2.7);const roof=mesh(new T.ConeGeometry(3.5,1.2,4),0x506b62,hut,0,2.9,0);roof.rotation.y=Math.PI/4;box(hut,0xc2a879,0,.35,-.7,2.8,.25,.6);
 finalEgg=makeEgg(0,-23);finalEgg.visible=false;cloneDino(-4,-25,.9,{walk:false});baby=cloneDino(1.2,-22.7,.19,{walk:false});baby.visible=false;
 rope(world,-5.7,-17,0);box(world,0x9c8257,0,1.1,-18,11.4,.1,.1);
 for(let i=0;i<20;i++){const a=i/20*Math.PI*2;const twig=box(world,0x806845,Math.cos(a)*2,.12,-23+Math.sin(a)*1.5,1.4,.12,.15);twig.rotation.y=-a;}
 cart=new T.Group();cart.userData.movingBody=true;world.add(cart);box(cart,0xa68d66,0,.5,0,1,.15,1.6);const e=eggGroup.clone(true);e.position.set(0,.45,0);e.scale.setScalar(.55);cart.add(e);for(const x of [-.55,.55])for(const z of [-.55,.55]){const wheel=cyl(cart,0x45463d,x,.25,z,.23,.23,.12,9);wheel.rotation.z=Math.PI/2;}
 ranger=createAdult(0x778365);world.add(ranger);cyl(ranger,0xb8a774,0,2.55,0,.5,.5,.06,10);escort=true;
 const rp=[];for(let i=0;i<320;i++)rp.push((rand()-.5)*26,rand()*14,(rand()-.5)*42);const rg=new T.BufferGeometry();rg.setAttribute('position',new T.Float32BufferAttribute(rp,3));rainMesh=new T.Points(rg,new T.PointsMaterial({color:0xc1d5db,size:.045,transparent:true,opacity:.75}));rainMesh.visible=false;world.add(rainMesh);
 smallSign(world,1.5,18);smallSign(world,1,7);smallSign(world,1,-10);
}
function buildChapter(){
 completed=new Set();items=[];puzzleStep=0;bridge=false;escort=false;raining=false;flashlightOn=false;guideBeam=null;du=null;birds.length=0;ranger=null;cart=null;baby=null;finalEgg=null;rainMesh=null;chapterMarkers.length=0;movingCreatures.length=0;activeDecor.length=0;
 const removeGeo=new Set(),removeMat=new Set();world.traverse(n=>{if(n.geometry&&!baseGeometries.has(n.geometry))removeGeo.add(n.geometry);if(n.material&&!baseMaterials.has(n.material)&&![...materials.values()].includes(n.material))removeMat.add(n.material);});removeGeo.forEach(g=>g.dispose());removeMat.forEach(m=>m.dispose());world.clear();forestNodes.forEach(n=>n.visible=adventureId==='chapter-1'&&chapter===0);dino.visible=false;eggGroup.visible=false;eggMarker.visible=false;forestBlockers.forEach((b,i)=>blockers[i]=b);blockers.length=forestBlockers.length;
 for(const c of clues){c.found=false;c.marker.visible=adventureId==='chapter-1'&&chapter===0;}logMarker.visible=adventureId==='chapter-1'&&chapter===0;gate.visible=adventureId==='chapter-1'&&chapter===0;
 chu.position.set(0,0,adventureId==='chapter-1'?(chapter===0?19:21):45);father.position.set(1.2,0,chu.position.z+1.1);chu.rotation.y=Math.PI;father.rotation.y=Math.PI;adultRigs.get(father).previous.copy(father.position);adultRigs.get(father).blend=0;look.copy(chu.position);renderer.setClearColor(stageInfo().color||0xa4ccd2);scene.fog.color.setHex(stageInfo().color||0xa4ccd2);hemi.intensity=2.3;sun.intensity=3;
 if(adventureId!=='chapter-1'){const built=buildAdventureWorld({world,landscape,ball,box,cyl,mesh,mat,createAdult,cloneDino,movingCreatures,birds},adventureId,stageInfo());ranger=built.ranger;du=createAdult(0xb7758f);du.scale.setScalar(.75);du.position.set(-1,0,46);world.add(du);box(du,0x6c5482,0,1.6,-.4,.58,.6,.22);setupAdventureTasks();prepareTerrain();quest();$('notice').classList.remove('visible');return;}
 if(chapter===0)setupForest();if(chapter===1){buildCave();setupCave();}if(chapter===2){buildValley();setupValley();}if(chapter===3){buildMountain();setupMountain();}
 prepareTerrain();quest();$('notice').classList.remove('visible');
}
function setupForest(){
 const berryGroup=new T.Group();berryGroup.position.set(-3.3,0,15.5);world.add(berryGroup);ball(berryGroup,0x668b48,0,.5,0,.8,.7,.6);for(let i=0;i<6;i++)ball(berryGroup,0x915a92,Math.sin(i*2)*.5,.7+(i%2)*.2,Math.cos(i*2)*.4,.12);
 item('berry','Bụi quả lạ',-3.3,15.5,()=>choose('berry','Những quả tím trông thật đẹp!','Chu thấy một bụi quả lạ cạnh đường. Cậu chưa biết đây là quả gì.', ['Hái một quả để nếm thử','Chỉ ngắm, không hái và hỏi bố','Cho vào ba lô để ăn sau'],1,{title:'Không ăn cây, quả lạ',text:'Đẹp mắt không có nghĩa là ăn được. Chu quan sát, không hái, không nếm và hỏi người lớn đi cùng.',wrong:'Quả lạ có thể gây hại dù trông đẹp. Mình chưa biết loại quả này, nên không hái hoặc nếm thử nhé.'}));
 clues.forEach((c,i)=>{const id=['foot','leaf','shell'][i];item(id,c.title,c.x,c.z,()=>acknowledge(items.find(it=>it.id===id),`Chu: “${i===2?'Vỏ trứng có đốm xanh! Đường mòn dẫn đến khu hang tham quan phía trước.':c.text}”`),{markerObject:c.marker});});
 item('river','Một lối qua suối',0,3.1,()=>choose('river','Tò mò là điều tốt.<br>An toàn là điều đầu tiên.','Có cây cầu trên đường tham quan. Chu muốn sang bờ bên kia tìm dấu vết.', ['Tự lội qua đoạn nước trông có vẻ nông','Đẩy cây làm một chiếc cầu mới','Dừng lại, nhờ bố đi cùng qua cầu'],2,{title:'Qua suối cùng người lớn',text:'Không tự xuống nước, đẩy cây hay dùng cây làm cầu. Chu nhờ bố tìm lối phù hợp và đi cùng. Nếu đường không an toàn, hai bố con sẽ quay lại.',wrong:'Nhìn bằng mắt không biết hết độ sâu và sức nước. Chu hãy dừng lại và nhờ bố đi cùng nhé.',button:'Đi trên cầu cùng bố'},()=>{bridge=true;gate.visible=false;logMarker.visible=false;}),{markerObject:logMarker,action:'Nhờ bố giúp'});
 const order=['berry','foot','leaf','river','shell'];items.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
 adventurePortal(-20);smallSign(world,3.4,-17.5);
 item('exit','Lối đến hang ánh sáng',0,-18,finishChapter,{required:false,action:'Đi tiếp'});
}
function setupCave(){
 item('pack','Chuẩn bị vào hang',0,18,()=>choose('pack','Bên trong tối hơn rồi.','Đây là hang tham quan có đường đi được đánh dấu. Trước khi vào, Chu nên làm gì?', ['Chạy vào trước để khám phá','Ở cạnh bố, kiểm tra đèn và đường tham quan','Rẽ vào một khe tối không có biển'],1,{title:'Vào hang có chuẩn bị',text:'Chu đi cùng bố trên lối tham quan được phép, kiểm tra đèn và luôn giữ liên lạc. Hang lạ hoặc đường bị đóng thì không tự vào.',wrong:'Trong hang rất dễ lạc nếu tách khỏi người lớn hoặc rời đường đánh dấu. Mình kiểm tra cùng bố trước nhé.'}));
 item('glyph1','Bia đá: chiếc lá',-4,12,()=>acknowledge(items.find(i=>i.id==='glyph1'),'<strong>Biểu tượng thứ nhất: LÁ CÂY.</strong><br>Trang truyện viết: “Sự sống bắt đầu từ một chiếc lá.”'),{note:'Thứ tự mở cửa: 1. LÁ CÂY.'});
 item('lamp','Khi đèn chập chờn',0,5,()=>choose('lamp','Đèn bỗng chập chờn.','Chu hơi lo lắng. Bố vẫn ở ngay bên cạnh.', ['Đứng lại cạnh bố và báo đèn có vấn đề','Chạy nhanh vào phía tối','Tách khỏi bố để tìm đường khác'],0,{title:'Bình tĩnh khi chưa rõ đường',text:'Chu dừng ở vị trí an toàn, báo cho bố và chờ bố kiểm tra đèn dự phòng. Nếu không đủ ánh sáng, hai bố con quay lại theo lối đã đi.',wrong:'Chạy hoặc đi riêng khi thiếu ánh sáng làm mình khó định hướng hơn. Hãy đứng ở vị trí an toàn và báo người lớn đi cùng.'},()=>{flashlightOn=true;}));
 item('glyph2','Bia đá: dấu chân',4,-1,()=>acknowledge(items.find(i=>i.id==='glyph2'),'<strong>Biểu tượng thứ hai: DẤU CHÂN.</strong><br>“Rồi những bước chân tìm đến khu rừng.”'),{note:'Thứ tự mở cửa: 2. DẤU CHÂN.'});
 item('glyph3','Bia đá: mặt trời',-4,-12,()=>acknowledge(items.find(i=>i.id==='glyph3'),'<strong>Biểu tượng thứ ba: MẶT TRỜI.</strong><br>“Ánh nắng mở ra một ngày mới.”'),{note:'Thứ tự mở cửa: 3. MẶT TRỜI.'});
 item('door','Cánh cửa ba biểu tượng',0,-18,()=>{if(!['glyph1','glyph2','glyph3'].every(id=>completed.has(id))){toast('Hãy đọc đủ ba bia đá trước. Nhật ký sẽ ghi lại thứ tự.',6);return;}symbolPuzzle();},{action:'Giải biểu tượng'});
 item('exit','Ánh sáng cuối hang',0,-20,finishChapter,{required:false,action:'Ra thung lũng'});
}
function symbolPuzzle(){const symbols=['Lá cây','Dấu chân','Mặt trời'];dialog('CÂU ĐỐ QUAN SÁT',`Biểu tượng ${puzzleStep+1} / 3`,`Hãy chọn theo thứ tự trên ba bia đá.<br><br><strong>${puzzleStep?symbols.slice(0,puzzleStep).join(' · ')+' · …':'Lá cây bắt đầu câu chuyện.'}</strong>`,symbols.map((label,index)=>({label,run:()=>{if(index!==puzzleStep){dialog('THỬ LẠI NHÉ','Câu chuyện có thứ tự.','Hãy nhớ: chiếc lá, những bước chân, rồi ánh mặt trời. Những lựa chọn đúng trước đó vẫn được giữ.',[{label:'Thử lại biểu tượng này',run:symbolPuzzle}]);return;}puzzleStep++;tone(500+puzzleStep*120);if(puzzleStep<3){symbolPuzzle();return;}done('door','Câu chuyện ba biểu tượng','Lá cây → Dấu chân → Mặt trời. Chu đã dùng quan sát và trí nhớ để mở cửa.');dialog('CÁNH CỬA ĐÃ MỞ','Ánh sáng ở phía trước.','Ba biểu tượng sáng lên. Bố và Chu cùng bước ra thung lũng.',[{label:'Đến thung lũng',run:()=>{resume();finishChapter();}}]);}})),'Gợi nhớ: Lá cây · Dấu chân · Mặt trời.');}
function setupValley(){
 item('lookout','Người bạn khổng lồ',-3.5,11,()=>choose('lookout','Khủng long ở ngay trước mắt!','Một chú khủng long cổ dài đang ăn lá phía sau hàng rào.', ['Chạy tới gần để vuốt ve','Ném thức ăn cho bạn ấy','Đứng ở điểm quan sát cùng bố'],2,{title:'Tôn trọng khoảng cách',text:'Chu quan sát từ nơi được phép, không đến gần, chạm vào hay cho động vật ăn. Bố nhắc: ngoài đời, động vật trông hiền vẫn có thể phản ứng bất ngờ.',wrong:'Đến gần hoặc cho ăn có thể làm động vật giật mình và gây nguy hiểm. Mình ngắm từ điểm quan sát nhé.'}));
 item('water','Mặt hồ trong veo',2.8,3,()=>choose('water','Chu bắt đầu thấy khát.','Nước hồ nhìn rất trong. Trong ba lô của bố có bình nước đã chuẩn bị.', ['Uống nước hồ vì nhìn rất sạch','Xin nước uống trong bình của bố','Xuống hồ rửa mặt rồi uống thử'],1,{title:'Dùng nước uống đã chuẩn bị',text:'Nước nhìn trong vẫn có thể không phù hợp để uống. Chu uống nước trong bình đã mang theo và ở trên đường đi.',wrong:'Nhìn trong không có nghĩa là nước uống được. Mình xin bình nước đã chuẩn bị của bố nhé.'}));
 item('trail','Ngã rẽ trên bản đồ',0,-5,()=>choose('trail','Đường tắt hay đường có biển?','Trang truyện vẽ một đường màu xanh đến trạm kiểm lâm. Một lối khác chui qua bụi rậm nhưng không có biển.', ['Đi đường tắt qua bụi rậm','Đối chiếu bản đồ, theo biển xanh cùng bố','Tách nhau ra để thử cả hai đường'],1,{title:'Ở cùng nhau, theo đường có biển',text:'Chu và bố đối chiếu bản đồ, đi theo biển hướng dẫn và không tách nhau. Nếu chưa biết đường, cả hai dừng ở nơi an toàn để hỏi người phụ trách.',wrong:'Đường không có biển có thể dẫn vào nơi nguy hiểm. Tách nhau còn dễ bị lạc. Hãy đối chiếu bản đồ cùng bố.'}));
 item('egg','Quả trứng bên đường',3,-13,()=>{
  if(!['lookout','water','trail'].every(id=>completed.has(id))){toast('Trước hết, hãy hoàn thành các điểm quan sát trên đường. Bấm Gợi ý để tìm điểm còn lại.',6);return;}
  choose('egg','Quả trứng có đốm xanh!','Một quả trứng nằm gần trạm kiểm lâm. Chu nhận ra hoa văn trong cuốn truyện.', ['Mang trứng về nhà để chăm sóc','Tự bế trứng chạy đi tìm mẹ','Giữ khoảng cách, báo cô kiểm lâm cùng bố'],2,{title:'Nhờ người phụ trách giúp động vật',text:'Chu không tự nhặt trứng hoặc chạm vào tổ. Cậu báo cô kiểm lâm cùng bố. Trong khu bảo tồn tưởng tượng này, cô có nhiệm vụ đưa quả trứng về đúng tổ.',wrong:'Tự mang trứng đi có thể làm hỏng trứng hoặc khiến động vật mẹ phản ứng. Hãy báo người lớn và nhân viên phụ trách.'});
 },{action:'Báo cô kiểm lâm'});
 item('exit','Cùng đưa trứng về tổ',0,-21,finishChapter,{required:false,action:'Đi cùng đoàn'});
}
function setupMountain(){
 item('rest','Nghỉ chân trước khi đi tiếp',0,18,()=>acknowledge(items.find(i=>i.id==='rest'),'Cô kiểm lâm phụ trách xe chở trứng. Chu và bố uống nước, kiểm tra giày và nhìn lại bản đồ.<br><br><strong>Mệt thì nói với người lớn và nghỉ ở điểm dừng; không cố chạy theo đoàn.</strong>'),{note:'Biết nói khi mệt, uống nước đã chuẩn bị và nghỉ tại điểm dừng cùng người lớn.'});
 item('weather','Mây đen kéo đến',0,8,()=>{raining=true;rainMesh.visible=true;sun.intensity=.65;renderer.setClearColor(0x8a9ca4);choose('weather','Có tiếng sấm ở xa.','Cô kiểm lâm chỉ nhà nghỉ có mái kín trên đường tham quan. Đoàn cần dừng lại.', ['Chạy đến chiếc tổ cho kịp','Theo người lớn đến nhà nghỉ được chỉ dẫn','Núp dưới một cây cao đứng riêng lẻ'],1,{title:'Theo người lớn đến nơi trú phù hợp',text:'Chu ở cùng bố, theo hướng dẫn của cô kiểm lâm đến nhà nghỉ. Không đứng ở chỗ trống, gần mép nước hay dưới một cây cao riêng lẻ.',wrong:'Cố chạy tiếp hoặc trú dưới cây cao riêng lẻ không phải lựa chọn phù hợp khi có giông. Hãy theo người phụ trách đến nơi trú.'});});
 item('shelter','Điểm nghỉ trong cơn mưa',-2,1,()=>{
  if(!completed.has('weather')){toast('Hãy quan sát thời tiết cùng bố trước khi đi tiếp.',5);return;}
  dialog('Ở CÙNG NHAU','Cơn mưa rồi sẽ qua.','Cả đoàn đã đến nhà nghỉ. Chu nghe tiếng mưa trên mái và vẽ quả trứng vào nhật ký.<br><br><strong>Một lúc sau…</strong> cô kiểm lâm kiểm tra điều kiện và hướng dẫn mọi người đi tiếp. Chu không tự rời nơi trú.',[{label:'Đi tiếp khi người lớn cho phép',run:()=>{done('shelter','Chờ cùng người lớn','Ở lại nơi trú cùng đoàn và chỉ đi tiếp khi người phụ trách hướng dẫn.');raining=false;rainMesh.visible=false;sun.intensity=2.3;renderer.setClearColor(0xd8c4a4);resume();}}]);
 },{action:'Vào điểm nghỉ'});
 plaque(2.7,-10,0);ball(world,0x89a477,2.7,1.2,-10,.18);
 item('nest','Hoa văn dẫn về tổ',2.7,-10,()=>{
  if(!completed.has('shelter')){toast('Cả đoàn cần dừng ở nhà nghỉ trước rồi mới tiếp tục.',5);return;}
  choose('nest','Chiếc tổ nào trong trang truyện?','Chu so sánh hình vẽ với quả trứng cô kiểm lâm đang chăm sóc. Vỏ trứng màu kem có những đốm xanh.', ['Tổ được ghi chú: trứng đốm xanh','Tổ được ghi chú: trứng sọc đỏ','Tổ được ghi chú: trứng không có hoa văn'],0,{title:'Quan sát để giúp đúng cách',text:'Chu nhận ra hoa văn đốm xanh và báo cô kiểm lâm. Cô sẽ kiểm tra, đưa trứng về tổ; Chu và bố chờ ở điểm quan sát, không đến gần tổ.',wrong:'Hãy nhìn lại ghi chú: vỏ màu kem, có đốm xanh. Chu có thể giúp bằng quan sát mà không cần chạm vào trứng.'});
 },{action:'Đối chiếu hình vẽ'});
 item('exit','Điểm quan sát tổ ấm',0,-16,finishChapter,{required:false,action:'Tiễn trứng về tổ'});
}
function setupAdventureTasks(){
 const coords=[[-6,32],[6,10],[-6,-18]];
 stageInfo().tasks.forEach((t,i)=>{const [x,z]=coords[i];item(t.id,t.title,x,z,()=>{
  if(t.requires?.some(id=>!completed.has(id))){toast('Hãy quan sát bảng thông tin trước; ghi chú nằm trong Nhật ký.',5);return;}
  if(t.sequence){adventurePuzzle(t,0);return;}
  if(t.options){choose(t.id,t.title,t.text,t.options,t.correct,{title:t.title,text:t.lesson,wrong:'Mình thử nghĩ thêm nhé. '+t.lesson,button:'Tiếp tục cùng Du'});return;}
  acknowledge(items.find(i=>i.id===t.id),t.text);
 },{action:t.sequence?'Ghép biểu tượng':t.options?'Cùng suy nghĩ':'Đọc và ghi chép'});});
 adventurePortal(-46);item('exit',chapter===3?'Hoàn thành chuyến đi':'Lối đến chặng tiếp theo',0,-42,finishChapter,{required:false,action:chapter===3?'Hoàn thành':'Đi tiếp'});
}
function adventurePuzzle(t,step){const options=[...t.sequence].reverse();dialog('CÂU ĐỐ QUAN SÁT',t.title,`${t.text}<br><br>Bước ${step+1} / ${t.sequence.length}${step?'<br>Đã ghép: '+t.sequence.slice(0,step).join(' · '):''}`,options.map(label=>({label,run:()=>{if(label!==t.sequence[step]){dialog('THỬ LẠI NHÉ','Cùng Du xem lại ghi chú','Các bước đúng trước đó vẫn được giữ. Bạn có thể đối chiếu gợi ý rồi chọn lại.',[{label:'Thử lại',run:()=>adventurePuzzle(t,step)}]);return;}if(step+1<t.sequence.length){adventurePuzzle(t,step+1);return;}done(t.id,t.title,t.sequence.join(' → '));dialog('GHÉP THÀNH CÔNG','Hai bạn đã tìm ra lời giải',t.sequence.join(' → '),[{label:'Tiếp tục khám phá',run:resume}]);}})));}
function finishAdventureStage(){if(!allDone()){toast('Còn những điểm sáng chờ hai bạn khám phá.',5);hint();return;}const stage=stageInfo();if(!badges.includes(stage.badge))badges.push(stage.badge);if(chapter<3){dialog('THÊM MỘT TRANG NHẬT KÝ',stage.badge,`Chu và Du đã hoàn thành ${stage.name.toLowerCase()}. Cùng bố đi tiếp đến ${adventures[adventureId].stages[chapter+1].name.toLowerCase()}.`,[{label:'Sang chặng tiếp theo',run:()=>{chapter++;buildChapter();checkpoint();resume();}}]);return;}finishedRun=true;checkpoint();dialog('HOÀN THÀNH CHƯƠNG '+adventureId.split('-')[1],adventures[adventureId].title,adventures[adventureId].ending+'<div class="badgeLine">'+badges.map(b=>`<span>✦ ${b}</span>`).join('')+'</div>',[{label:'Ngắm cảnh cùng Du',run:()=>{resume();state='epilogue';}},{label:'Xem nhật ký',run:()=>journal(true)},{label:'Về trang hành trình',run:()=>cloud.exit()}]);}
function nearest(){return items.filter(i=>!completed.has(i.id)&&Math.hypot(chu.position.x-i.x,chu.position.z-i.z)<i.range).sort((a,b)=>Math.hypot(chu.position.x-a.x,chu.position.z-a.z)-Math.hypot(chu.position.x-b.x,chu.position.z-b.z))[0]||null;}
function act(){if(state!=='play')return;target=nearest();if(target)target.run();}
function legal(x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z)||terrainCollisions.blocked(x,z))return false;
 if(adventureId!=='chapter-1'){
  if(!insideMeadow(x,z))return false;
  const theme=stageInfo().theme,riverSide=['river','bridge'].includes(theme),center=riverSide?23+Math.sin(z*.055)*5:39+Math.sin(z*.05)*8;
  if(Math.abs(z)<=80&&Math.abs(x-center)<3.6)return false;
  if(theme==='bridge'&&Math.abs(z)<4.5&&(Math.abs(x)>3||!completed.has('cross')))return false;
  // Enclosures are local islands with a wide route around them.
  if(['sauropod','horned','armored','museum'].includes(theme)&&Math.abs(z)<45&&((x>15&&x<34)||(x<-13&&x>-33)))return false;
  if(theme==='fossil'&&Math.hypot(x+22,z)<8)return false;
  return true;
 }
 if(chapter===1){if(Math.abs(x)>5.9||z<-19.5||z>24)return false;if(z<14&&!completed.has('pack'))return false;if(z<2.5&&!completed.has('lamp'))return false;return true;}
 if(!insideMeadow(x,z))return false;
 if(chapter===0){const riverZ=Math.abs(x)<12?0:Math.sin((Math.abs(x)-12)*.045)*5;if(Math.abs(z-riverZ)<2.1&&(!bridge||Math.abs(x)>.9))return false;return true;}
 if(chapter===2){if(x>-24&&x<-5&&z>-22&&z<24)return false;if(Math.hypot((x-9)/6,(z-1)/8.5)<1)return false;return true;}
 if(chapter===3){if(z<-18)return false;if(z<12&&!completed.has('rest'))return false;if(z<5.5&&!completed.has('weather'))return false;if(z<-3&&!completed.has('shelter'))return false;return true;}
 return true;
}
function prepareTerrain(){
 if(adventureId==='chapter-1'&&chapter!==1)addMeadow({mesh,ball,cyl,mat},world);
 terrainCollisions.rebuild(adventureId==='chapter-1'&&chapter===0?[...forestNodes,world]:[world]);
 followTrail=[{x:chu.position.x,z:chu.position.z}];scene.fog.near=chapter===1&&adventureId==='chapter-1'?35:90;scene.fog.far=chapter===1&&adventureId==='chapter-1'?95:240;
}
function trailPoint(distance){let left=distance;for(let i=followTrail.length-1;i>0;i--){const a=followTrail[i],b=followTrail[i-1],d=Math.hypot(a.x-b.x,a.z-b.z);if(d>=left&&d>0){const t=left/d;return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t};}left-=d;}return followTrail[0];}
function followFootsteps(character,distance,dt,time){const p=trailPoint(distance);if(!p)return;const dx=p.x-character.position.x,dz=p.z-character.position.z;if(Math.hypot(dx,dz)>.001)character.rotation.y=Math.atan2(dx,dz);character.position.set(p.x,chu.position.y,p.z);animateAdult(character,dt,time);}

function pause(){if(state==='play'){state='paused';dialog('NGHỈ CHÂN MỘT CHÚT','Rừng vẫn chờ Chu.','Đăng nhập Google để lưu hành trình. Nếu chơi khách, đóng hoặc tải lại trang sẽ mất tiến trình.',[{label:'Tiếp tục hành trình',run:resume},{label:'Mở nhật ký',run:()=>{state='paused';journal();}},{label:'Chơi lại từ đầu',run:confirmRestart}]);$('pause').innerHTML='▶ <span>Tiếp tục</span>';}}
$('questToggle').onclick=()=>{const open=$('questToggle').getAttribute('aria-expanded')!=='true';$('questToggle').setAttribute('aria-expanded',String(open));$('quest').classList.toggle('expanded',open);};
shell=setupGameShell({stopMovement:()=>{keys.clear();release();},goHome:()=>cloud?.exit(),giveHint:()=>{if(state==='play')hint();},notify:toast});
$('modalText').addEventListener('click',e=>{const button=e.target.closest?.('[data-note]');if(!button)return;const note=notes[Number(button.dataset.note)];if(!note)return;dialog('BỘ SƯU TẬP KHÁM PHÁ',note.title,discoveryMarkup(note.discoveryId,note.text),[{label:'Về nhật ký',run:()=>{state=finishedRun?'epilogue':'play';journal(finishedRun);}}]);});
$('start').onclick=()=>{initAudio();primaryAction?.();};$('secondary').onclick=()=>secondaryAction?.();$('pause').onclick=pause;$('journal').onclick=()=>journal();$('hint').onclick=()=>{if(state==='play')hint();};$('interact').onclick=act;$('touchAction').onclick=act;
$('sound').onclick=()=>{soundOn=!soundOn;if(soundOn)initAudio();audio?.setEnabled(soundOn);soundButton();};soundButton();
window.addEventListener('focus',()=>{audio?.setFocused(true);});
window.addEventListener('pagehide',()=>{audio?.setFocused(false);});
window.addEventListener('pageshow',()=>{if(!document.hidden)audio?.setFocused(true);});
window.addEventListener('keydown',e=>{if(shell?.isOpen)return;if($('donation').open||$('accountPanel').open||state==='cover')return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)&&state==='play')e.preventDefault();if(e.key==='Escape'){if(state==='play')pause();return;}if(e.key.toLowerCase()==='j'&&!e.repeat){journal();return;}if(e.key.toLowerCase()==='e'&&!e.repeat){act();return;}if(state==='play')keys.add(e.key.toLowerCase());
 if(e.key==='Tab'&&state==='dialog'){const buttons=[...$('modal').querySelectorAll('button:not([hidden])')];const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();release();pause();audio?.setFocused(false);});document.addEventListener('visibilitychange',()=>{audio?.setFocused(!document.hidden);if(document.hidden){keys.clear();release();pause();}});
const stick=$('stick');function stickMove(e){const r=stick.getBoundingClientRect();let x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;const len=Math.hypot(x,y);if(len>38){x*=38/len;y*=38/len;}joy.x=x/38;joy.y=y/38;$('knob').style.transform=`translate(${x}px,${y}px)`;}
stick.addEventListener('pointerdown',e=>{if(state!=='play'||shell?.isOpen)return;stickId=e.pointerId;stick.setPointerCapture(e.pointerId);stickMove(e);});stick.addEventListener('pointermove',e=>{if(e.pointerId===stickId)stickMove(e);});stick.addEventListener('pointerup',release);stick.addEventListener('pointercancel',release);
function resize(){const w=innerWidth,h=innerHeight;camera.aspect=w/h;camera.fov=w<700?65:55;camera.updateProjectionMatrix();renderer.setSize(w,h);}window.addEventListener('resize',resize);resize();
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('errorText').textContent='Khu rừng cần tải lại. Phần chưa đồng bộ có thể bị mất.';$('error').hidden=false;});
let beforeDonation;
setupDonation({onOpen:()=>{beforeDonation=state;state='donate';keys.clear();release();},onClose:()=>{state=beforeDonation;keys.clear();release();}});
const clock=new T.Clock();function frame(){
 const dt=Math.min(clock.getDelta(),.045),time=clock.elapsedTime;elapsed+=dt;let moving=false;audio?.configure?.(currentAudio(chapter,adventureId));audio?.update({chapter:adventureId==='chapter-1'?chapter:(adventureId==='chapter-3'?2:0),x:chu.position.x,z:chu.position.z,raining,paused:state!=='play'});
 if(state==='donate'||state==='account'){renderer.render(scene,camera);requestAnimationFrame(frame);return;}
 if(state==='play'&&!shell?.isOpen){
  totalPlay+=dt;let sx=joy.x+(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),sy=joy.y+(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);const n=Math.hypot(sx,sy);
  if(n>.08){if(n>1){sx/=n;sy/=n;}const vx=sx*.819+sy*.573,vz=-sx*.573+sy*.819;const nx=chu.position.x+vx*dt*3,nz=chu.position.z+vz*dt*3;let moved=false;if(legal(nx,chu.position.z)){chu.position.x=nx;moved=true;}if(legal(chu.position.x,nz)){chu.position.z=nz;moved=true;}const angle=Math.atan2(vx,vz),delta=T.MathUtils.euclideanModulo(angle-chu.rotation.y+Math.PI,Math.PI*2)-Math.PI;chu.rotation.y+=delta*Math.min(dt*12,1);moving=moved;steps+=dt*10;if(!legal(nx,nz)&&elapsed-lastSafeToast>7){toast('Phía trước có vật cản hoặc khu vực không được vào. Mình đi vòng cùng bố nhé.',4);lastSafeToast=elapsed;}}
  target=nearest();$('context').style.display=target?'flex':'none';if(target){$('contextText').textContent=target.title;$('interact').textContent=`E · ${target.action}`;$('touchAction').textContent=target.action;}else $('touchAction').textContent='Quan sát';$('touchAction').classList.toggle('ready',!!target);

 }
 if(elapsed>noticeUntil)$('notice').classList.remove('visible');
 chu.position.y=T.MathUtils.lerp(chu.position.y,adventureId==='chapter-1'&&chapter===0&&bridge&&Math.abs(chu.position.z)<2.8&&Math.abs(chu.position.x)<1.1?.53:0,Math.min(dt*10,1));body.position.y=moving?Math.sin(steps*2)*.045:Math.sin(time*2)*.02;legs.forEach((l,i)=>l.rotation.x=moving?Math.sin(steps+i*Math.PI)*.6:0);arms.forEach((a,i)=>a.rotation.x=moving?-Math.sin(steps+i*Math.PI)*.48:Math.sin(time*2)*.03);head.rotation.y=moving?0:Math.sin(time*.7)*.08;
 const last=followTrail[followTrail.length-1];if(!last||Math.hypot(chu.position.x-last.x,chu.position.z-last.z)>.08){followTrail.push({x:chu.position.x,z:chu.position.z});if(followTrail.length>1800)followTrail.shift();}
 followFootsteps(father,1.6,dt,time);

 if(escort&&cart&&ranger){const p=trailPoint(4);cart.position.set(p.x,0,p.z);cart.rotation.y=chu.rotation.y;followFootsteps(ranger,5.4,dt,time);}else if(ranger)animateAdult(ranger,dt,time,escort);
 if(du)followFootsteps(du,3,dt,time);
 for(const b of birds){b.g.position.set(Math.sin(time*.1+b.phase)*35,13+Math.sin(time*.3+b.phase)*2,Math.cos(time*.1+b.phase)*40);b.g.rotation.y=time*.1+b.phase;for(let i=0;i<2;i++)b.wings[i].rotation.z=Math.sin(time*7+b.phase)*(i?1:-1)*.45;}
 if(chapter===0){trees.forEach(t=>t.g.rotation.z=Math.sin(time*.7+t.phase)*.013);ripples.forEach((r,i)=>r.position.x=-23+i*1.9+Math.sin(time*.8+i)*.4);for(const {g,base} of markers){g.position.y=base+Math.sin(time*2+g.position.z)*.15;g.rotation.y=time*.7;}}
 for(const m of chapterMarkers){m.position.y=1.65+Math.sin(time*2+m.position.z)*.16;m.rotation.y=time*.7;}for(const d of movingCreatures)animateDinosaur(d,dt,time);for(const a of activeDecor)a.glow.intensity=4.8+Math.sin(time*1.7+a.phase)*.25;
 fireflies.forEach(f=>{f.m.position.set(f.x+Math.sin(time*.35+f.p),f.y+Math.sin(time+f.p)*.2,f.z+Math.cos(time*.3+f.p)*.5);});
 if(rainMesh?.visible){const p=rainMesh.geometry.attributes.position;for(let i=0;i<p.count;i++){let y=p.getY(i)-dt*9;if(y<0)y=14;p.setY(i,y);}p.needsUpdate=true;}
 torch.intensity=adventureId==='chapter-1'&&chapter===1&&flashlightOn?7:0;torch.position.set(chu.position.x,1.5,chu.position.z);lightTarget.position.set(chu.position.x+Math.sin(chu.rotation.y)*5,.2,chu.position.z+Math.cos(chu.rotation.y)*5);
 look.lerp(chu.position,1-Math.exp(-dt*4));const cave=adventureId==='chapter-1'&&chapter===1;camera.position.set(look.x+16,cave?24:15,look.z+24);camera.lookAt(look.x,cave?0:1.2,look.z);renderer.render(scene,camera);requestAnimationFrame(frame);
}
buildChapter();showWelcome();
let beforeAccount;
cloud=setupCloud({snapshot:progressSnapshot,restore:restoreProgress,reset:resetRun,hasStarted:()=>started&&!previewMode,hold:()=>{beforeAccount=state;state='account';keys.clear();release();},release:()=>{if(state==='account')state=beforeAccount;keys.clear();release();}});
mountCover({play:async id=>{if(!canPlay(id))return;if(await cloud.selectChapter(id))newGame(id);},account:()=>cloud.open()});
const previewId=new URLSearchParams(location.search).get('preview');if(implementedIds.includes(previewId)){supabase.auth.getUser().then(async({data})=>{if(!data.user)return;const access=await supabase.rpc('chu_admin_access');if(access.error||!access.data)return;previewMode=true;const banner=document.createElement('div');banner.className='previewBanner';banner.textContent='CHƠI THỬ · Không lưu tiến trình · ';const back=document.createElement('a');back.href='admin.html';back.textContent='Về quản trị';banner.append(back);document.body.append(banner);newGame(previewId);}).catch(()=>{});}
frame();
try{document.modelContext?.registerTool({name:'read_chu_adventure_progress',description:'Read the current chapter, completed discoveries and next objective in Chu’s adventure.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(input){if(!input||typeof input!=='object'||Object.keys(input).length)throw new Error('Expected an empty object');return {state,chapter:Number(adventureId.split('-')[1]),stage:chapter+1,chapterName:stageInfo().name,completed:[...completed],badges:[...badges],nextObjective:items.find(i=>i.required&&!completed.has(i.id))?.title||'Điểm cuối chặng',checkpoint:cloud?.signedIn?'Cloud sync':'Guest session only'};}});}catch(e){console.warn('Progress integration unavailable',e);}
