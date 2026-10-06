import * as T from './vendor/three.module.min.js';
// A rounded, irregular edge at the foot of distant hills, not an axis-aligned play box.
export function meadowRadius(angle){return 92+7*Math.sin(angle*3+.5)+5*Math.cos(angle*5);}
export function insideMeadow(x,z){return Math.hypot(x,z)<meadowRadius(Math.atan2(z,x));}
export class TerrainCollisions{
 constructor(){this.cells=new Map();this.entries=[];}
 rebuild(roots){this.cells.clear();this.entries=[];const matrix=new T.Matrix4(),bounds=new T.Box3();
  const add=(node,m)=>{node.geometry.computeBoundingBox();bounds.copy(node.geometry.boundingBox).applyMatrix4(m);if(bounds.max.y<.18||bounds.min.y>1.9)return;const b={minX:bounds.min.x,maxX:bounds.max.x,minZ:bounds.min.z,maxZ:bounds.max.z,node};this.entries.push(b);for(let x=Math.floor((b.minX-.32)/8);x<=Math.floor((b.maxX+.32)/8);x++)for(let z=Math.floor((b.minZ-.32)/8);z<=Math.floor((b.maxZ+.32)/8);z++){const key=x+','+z;if(!this.cells.has(key))this.cells.set(key,[]);this.cells.get(key).push(b);}};
  const visit=node=>{if(!node.visible||node.userData.movingBody)return;if(node.userData.solid&&node.geometry){if(node.isInstancedMesh){for(let i=0;i<node.count;i++){node.getMatrixAt(i,matrix);matrix.premultiply(node.matrixWorld);add(node,matrix);}}else add(node,node.matrixWorld);}for(const child of node.children)visit(child);};
  for(const root of roots){root.updateWorldMatrix(true,true);visit(root);}
 }
 blocked(x,z,r=.3){return (this.cells.get(Math.floor(x/8)+','+Math.floor(z/8))||[]).some(b=>{if(!b.node.visible)return false;const dx=x-Math.max(b.minX,Math.min(x,b.maxX)),dz=z-Math.max(b.minZ,Math.min(z,b.maxZ));return dx*dx+dz*dz<r*r;});}
}
export function addMeadow(api,parent){
 const {mesh,ball,cyl,mat}=api;const temp=new T.Object3D();
 // Trees are grouped into groves, leaving broad clearings around the main route.
 const trunks=new T.InstancedMesh(new T.CylinderGeometry(.2,.38,3.8,6),mat(0x795f40),110),crowns=new T.InstancedMesh(new T.IcosahedronGeometry(1,1),mat(0x43794b),110);trunks.userData.solid=true;
 const groves=[[-49,30],[-58,-32],[51,49],[64,-43],[-16,69]];
 for(let i=0;i<110;i++){const [cx,cz]=groves[i%groves.length],a=i*2.3999,r=4+(i%17)*.6,k=.8+(i%5)*.13,x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;temp.position.set(x,1.9*k,z);temp.rotation.set(0,a,0);temp.scale.set(k,k,k);temp.updateMatrix();trunks.setMatrixAt(i,temp.matrix);temp.position.y=5*k;temp.scale.set(2*k,2.5*k,2*k);temp.updateMatrix();crowns.setMatrixAt(i,temp.matrix);}parent.add(trunks,crowns);
 // Instanced flowers and grass keep the broad meadow light enough for the browser.
 const grass=new T.InstancedMesh(new T.ConeGeometry(.15,.45,3),mat(0x81a855),1400);const flowers=[0xf4ce6c,0xeee7d5,0xcb9ec9].map(c=>new T.InstancedMesh(new T.IcosahedronGeometry(.14,0),mat(c),260));
 for(let i=0;i<1400;i++){const a=i*2.399963,r=12+Math.sqrt(i/1400)*74,x=Math.cos(a)*r,z=Math.sin(a)*r;temp.position.set(x,.17,z);temp.rotation.set(0,a,.16*Math.sin(i));temp.scale.set(1,.7+(i%5)*.13,1);temp.updateMatrix();grass.setMatrixAt(i,temp.matrix);}
 for(let k=0;k<3;k++)for(let i=0;i<260;i++){const a=i*2.399963+k,r=4+Math.sqrt(i/260)*11,cx=[-31,17,-42][k],cz=[17,57,-54][k];temp.position.set(cx+Math.cos(a)*r,.35,cz+Math.sin(a)*r);temp.rotation.set(0,a,0);temp.scale.set(1.1,.5,1.1);temp.updateMatrix();flowers[k].setMatrixAt(i,temp.matrix);}parent.add(grass,...flowers);
 // Sparse boulders are landmarks, never a wall around the route.
 for(const [x,z,s] of [[-29,42,1.5],[-40,-18,1.8],[48,12,2],[-22,-57,1.4],[31,65,1.6]]){const rock=ball(parent,0x929c87,x,.55,z,s,.9,s*.8);rock.userData.solid=true;}
 for(let i=0;i<28;i++){const a=i/28*Math.PI*2,r=meadowRadius(a)+19,h=8+(i%5)*3;const hill=ball(parent,i%2?0x789b80:0x8cac8d,Math.cos(a)*r,1,Math.sin(a)*r,15,h,18);hill.userData.solid=true;hill.castShadow=false;}
 for(let i=0;i<18;i++){const a=i/18*Math.PI*2,h=16+(i%5)*4,r=155+(i%3)*10;const peak=mesh(new T.ConeGeometry(23,h,6),i%2?0x8da8a7:0x799b9c,parent,Math.cos(a)*r,h/2-1,Math.sin(a)*r);peak.castShadow=false;}
}
