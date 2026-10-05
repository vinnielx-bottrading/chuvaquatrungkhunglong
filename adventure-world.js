import * as T from './vendor/three.module.min.js';
export function buildAdventureWorld(api,chapterId,stage){
 const {world,landscape,ball,box,cyl,mesh,mat,createAdult,cloneDino,movingCreatures,birds}=api;
 const theme=stage.theme,riverSide=['river','bridge'].includes(theme),park=['sauropod','horned','armored','museum'].includes(theme);
 landscape(world,riverSide?0x60945c:park?0x83a95c:0x629159,true);
 const points=[];for(let i=0;i<17;i++)points.push(new T.Vector3(Math.sin(i*.8)*3,.045,50-i*6.25));
 const curve=new T.CatmullRomCurve3(points),v=[],ix=[];
 for(let i=0;i<=160;i++){const p=curve.getPoint(i/160),d=curve.getTangent(i/160),s=new T.Vector3(-d.z,0,d.x).normalize().multiplyScalar(3.4);v.push(p.x+s.x,p.y,p.z+s.z,p.x-s.x,p.y,p.z-s.z);if(i<160){let k=i*2;ix.push(k,k+2,k+1,k+1,k+2,k+3);}}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setIndex(ix);geo.computeVertexNormals();const path=mesh(geo,0xc7b67f,world);path.material.side=T.DoubleSide;
 for(let i=0;i<22;i++){const a=i/22*Math.PI*2,r=65+i%4*8,h=8+i%5*3;const mountain=mesh(new T.ConeGeometry(12+i%3*4,h,5),i%2?0x718d8c:0x8aa7a0,world,Math.cos(a)*r,h/2-2,Math.sin(a)*r);mountain.rotation.y=a;}
 // Winding river remains beyond the guarded walking area.
 const rv=[],ri=[];for(let i=0;i<=100;i++){const z=80-i*1.6,x=riverSide?23+Math.sin(z*.055)*5:39+Math.sin(z*.05)*8;rv.push(x-3,.04,z,x+3,.04,z);if(i<100){const k=i*2;ri.push(k,k+2,k+1,k+1,k+2,k+3);}}
 const rg=new T.BufferGeometry();rg.setAttribute('position',new T.Float32BufferAttribute(rv,3));rg.setIndex(ri);rg.computeVertexNormals();const water=mesh(rg,0x58b4c2,world);water.material.side=T.DoubleSide;water.castShadow=false;
 // Continuous fences express the safe exploration boundary, without a rectangular terrain slab.
 for(const side of [-1,1])for(let z=-47;z<=49;z+=4){cyl(world,0x867148,side*14,.6,z,.09,.12,1.2);box(world,0xb6a073,side*14,1,z-2,.06,.06,4);}
 const temp=new T.Object3D(),grass=new T.InstancedMesh(new T.ConeGeometry(.16,.6,3),mat(0x83af54),240);
 for(let i=0;i<240;i++){const side=i%2?-1:1,x=side*(8+(i*1.79%28)),z=(i*3.73%108)-54;temp.position.set(x,.22,z);temp.scale.set(1,1+i%3*.3,1);temp.rotation.set(0,i,Math.sin(i)*.12);temp.updateMatrix();grass.setMatrixAt(i,temp.matrix);}world.add(grass);
 for(let i=0;i<44;i++){const side=i%2?-1:1,x=side*(18+(i*2.13%18)),z=(i*4.67%108)-54;if(riverSide&&side===1)continue;const tree=new T.Group();tree.position.set(x,0,z);world.add(tree);cyl(tree,0x735d3d,0,1.5,0,.2,.36,3);ball(tree,i%2?0x38774b:0x4b8750,0,4,0,1.8,2.7,1.7);}
 for(let i=0;i<8;i++){const g=new T.Group();world.add(g);ball(g,0x374d50,0,0,0,.14,.1,.3);const wings=[box(g,0x435a5d,-.32,0,0,.6,.05,.2),box(g,0x435a5d,.32,0,0,.6,.05,.2)];birds.push({g,wings,phase:i*1.4});}
 const ranger=createAdult(0x738759);ranger.position.set(-6,0,32);world.add(ranger);cyl(ranger,0xc7ac71,0,2.6,0,.48,.48,.08);cyl(ranger,0xc7ac71,0,2.72,0,.3,.34,.2);
 for(const [x,z] of [[-6,32],[6,10],[-6,-18]]){cyl(world,0x7b684b,x,.7,z,.09,.12,1.4);box(world,0xe8d5a2,x,1.35,z,1.2,.6,.12);}
 if(theme==='camp'||theme==='museum'){const hut=new T.Group();hut.position.set(-8,0,37);world.add(hut);for(const x of [-2,2])for(const z of [-1.6,1.6])cyl(hut,0x836347,x,1.6,z,.12,.15,3.2);const roof=mesh(new T.ConeGeometry(3.6,1.2,4),0x507b70,hut,0,3.5,0);roof.rotation.y=Math.PI/4;box(hut,0xb79964,0,.7,0,3,.2,1.3);}
 if(theme==='bridge'){for(let i=0;i<16;i++)box(world,0xb59462,0,.25,4-i*.5,7,.14,.46);for(const side of [-1,1]){for(let z=-4;z<=4;z+=2)cyl(world,0x766143,side*3.5,.8,z,.1,.1,1.6);box(world,0x987e53,side*3.5,1.5,0,.12,.1,8);}const stream=box(world,0x65bcc7,0,.025,0,30,.04,6);stream.castShadow=false;}
 if(theme==='fossil'||theme==='museum'){for(const [x,z] of [[-7,29],[7,8],[-7,-20]]){box(world,0x7e8d84,x,.45,z,2,.9,1.4);for(let i=0;i<5;i++)ball(world,0xded3ad,x+(i-2)*.26,1,z,.15,.11,.35);}}
 function herbivore(kind,x,z,scale=1){
  if(kind==='Diplodocus'){const g=cloneDino(x,z,scale,{rz:3,rx:.5});g.userData.species=kind;return g;}
  const color={Triceratops:0xb59d6c,Stegosaurus:0x659688,Ankylosaurus:0x8d9270,Iguanodon:0xc09164}[kind];const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(scale);g.userData.species=kind;world.add(g);const trunk=new T.Group();g.add(trunk);ball(trunk,color,0,1.15,0,1.1,.8,1.8);const legs=[];
  for(const lx of [-.72,.72])for(const lz of [-1,1]){const leg=new T.Group();leg.position.set(lx,1,lz);g.add(leg);cyl(leg,color,0,-.4,0,.2,.3,.8);ball(leg,0x746c52,0,-.88,.05,.3,.12,.36);legs.push(leg);}
  const neckRig=new T.Group();neckRig.position.set(0,1.15,1.5);trunk.add(neckRig);ball(neckRig,color,0,.1,.2,.55,.5,.6);const headRig=new T.Group();headRig.position.set(0,.1,.65);neckRig.add(headRig);ball(headRig,color,0,0,0,.56,.46,.7);const jaw=new T.Group();jaw.position.y=-.25;headRig.add(jaw);ball(jaw,0xc9bd8a,0,0,.25,.4,.14,.42);for(const side of [-1,1])ball(headRig,0x283b31,side*.46,.12,.24,.06);
  const tailRig=new T.Group();tailRig.position.set(0,1,-1.5);trunk.add(tailRig);const tail=mesh(new T.ConeGeometry(.4,2.7,6),color,tailRig,0,0,-1.1);tail.rotation.x=-Math.PI/2;
  if(kind==='Triceratops'){const frill=cyl(headRig,0xbaac7d,0,.3,-.45,1,1,.14,9);frill.rotation.x=Math.PI/2;for(const side of [-1,1]){const horn=mesh(new T.ConeGeometry(.13,.9,6),0xf0dfb7,headRig,side*.34,.57,.2);horn.rotation.x=.6;}const nose=mesh(new T.ConeGeometry(.12,.45,6),0xf0dfb7,headRig,0,.3,.65);nose.rotation.x=.3;}
  if(kind==='Stegosaurus'){for(let i=0;i<9;i++){const plate=mesh(new T.ConeGeometry(.45,.85+Math.sin(i/8*Math.PI)*.6,4),0xd0a276,trunk,i%2?.22:-.22,2,-1.4+i*.35);plate.scale.z=.4;}for(const side of [-1,1])for(const zz of [-1.8,-2.3]){const spike=mesh(new T.ConeGeometry(.12,.75,5),0xd3c297,tailRig,side*.25,0,zz);spike.rotation.z=-side*.85;}}
  if(kind==='Ankylosaurus'){for(let i=0;i<15;i++)ball(trunk,0xb2b593,(i%3-1)*.6,1.85,-1.1+Math.floor(i/3)*.5,.28,.22,.3);ball(tailRig,0xb4ac86,0,0,-2.35,.65,.32,.42);}
  if(kind==='Iguanodon'){trunk.scale.y=1.2;headRig.scale.z=1.25;for(const side of [-1,1]){const spike=mesh(new T.ConeGeometry(.1,.45,5),0xe7d5a6,legs[side<0?1:3],side*.2,-.45,.15);spike.rotation.z=-side*.9;}}
  movingCreatures.push({g,scale,trunk,legs,neckRig,headRig,jaw,tailRig,x,z,rx:.4,rz:2.8,offset:movingCreatures.length*4.7,walk:true,phase:0,blend:0,previous:g.position.clone(),grazeAngle:.4});return g;
 }
 const species=theme==='horned'?['Triceratops','Triceratops']:theme==='armored'?['Stegosaurus','Ankylosaurus']:theme==='museum'?['Iguanodon','Triceratops','Ankylosaurus','Stegosaurus']:['Diplodocus'];
 if(park)for(let i=0;i<8;i++)herbivore(species[i%species.length],i%2?24:-22,35-Math.floor(i/2)*23,.65+(i%3)*.12);
 else if(theme==='fossil')herbivore(chapterId==='chapter-2'?'Iguanodon':'Diplodocus',-22,0,.9);
 return {ranger};
}
