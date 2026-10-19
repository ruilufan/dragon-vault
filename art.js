'use strict';
// Procedural, fully volumetric interpretation of the supplied spirit and treasure references.
window.VaultArt=(()=>{
const T=THREE;
const material=(color,metalness=0,roughness=.6,emissive=0)=>new T.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:.7});
function mesh(g,m,p,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;}
function box(p,m,x,y,z,w,h,d){return mesh(new T.BoxGeometry(w,h,d),m,p,x,y,z);}
function ellipsoid(p,m,x,y,z,a,b,c){const o=mesh(new T.SphereGeometry(1,20,14),m,p,x,y,z);o.scale.set(a,b,c);return o;}
function tube(p,m,points,r=.08,end=.01){const curve=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v)));const steps=40,sides=8,frames=curve.computeFrenetFrames(steps,false),pos=[],indices=[];for(let i=0;i<=steps;i++){const pt=curve.getPointAt(i/steps),rad=r+(end-r)*i/steps;for(let j=0;j<sides;j++){const angle=j/sides*Math.PI*2,q=pt.clone().addScaledVector(frames.normals[i],Math.cos(angle)*rad).addScaledVector(frames.binormals[i],Math.sin(angle)*rad);pos.push(q.x,q.y,q.z);if(i<steps){const a=i*sides+j,b=i*sides+(j+1)%sides;indices.push(a,b,a+sides,b,b+sides,a+sides);}}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(indices);g.computeVertexNormals();return mesh(g,m,p);}
function spiral(p,m,x,y,z,r=.2,side=1){const points=[];for(let i=0;i<45;i++){const t=i/44*6.5,rad=r*(1-i/55);points.push([x+Math.cos(t)*rad,y+Math.sin(t)*rad,z+side*.015*i/45]);}tube(p,m,points,.025,.008);}
function spirit(scene){const navy=material('#17465e',.15,.5),blue=material('#286884',.12,.5),bone=material('#fff0ba',.12,.4),horn=material('#101d29',.25,.4),steel=material('#668c9c',.65,.35),edge=material('#b6dbdd',.55,.3),fire=material('#68f7e7',.1,.3,'#24b4ab'),core=material('#dbfff1',0,.3,'#9fffe7');
const dragon=new T.Group();dragon.position.set(8,.4,-5);scene.add(dragon);const rig=new T.Group();dragon.add(rig);
const body=ellipsoid(rig,blue,.25,1.25,0,1.4,.8,.68);ellipsoid(rig,navy,-.85,1.8,0,.72,1.22,.72);ellipsoid(rig,navy,-1.13,2.7,0,.62,.65,.55);
// Continuous serpent tail and its turquoise crest.
tube(rig,blue,[[.8,1.3,0],[1.7,.8,0],[2.4,.55,.1],[3.1,1.1,.1],[3.8,1.65,0],[4.5,1.85,-.3]],.58,.035);
tube(rig,fire,[[.9,1.85,0],[1.8,1.3,0],[2.5,.95,.1],[3.2,1.5,.1],[3.9,1.95,0],[4.6,2.2,-.3]],.2,.012);
// Bone face: a narrow birdlike mask with sculpted brow and dark eye slits.
ellipsoid(rig,bone,-1.68,2.73,0,.22,.58,.4);
const shape=new T.Shape();shape.moveTo(-.38,.22);shape.lineTo(-.25,.58);shape.lineTo(0,.74);shape.lineTo(.25,.58);shape.lineTo(.38,.22);shape.lineTo(.18,-.36);shape.lineTo(0,-.73);shape.lineTo(-.18,-.36);shape.closePath();const mask=mesh(new T.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.07,bevelThickness:.06}),bone,rig,-1.9,2.65,0);mask.rotation.y=-Math.PI/2;
tube(rig,horn,[[-2.17,3.12,0],[-2.19,2.75,0],[-2.17,2.1,0]],.018,.006);const eyes=[];for(const side of [-1,1]){const e=ellipsoid(rig,horn,-2.18,2.83,side*.22,.04,.075,.14);e.rotation.x=side*.4;eyes.push(e);tube(rig,horn,[[-2.18,2.9,side*.36],[-2.19,2.85,side*.23],[-2.19,2.8,side*.1]],.035,.012);tube(rig,bone,[[-1.85,3.06,side*.19],[-1.75,3.5,side*.26],[-1.55,3.7,side*.22]],.12,.005);
// Branching antlers sweep outwards, then hook skyward.
tube(rig,horn,[[-1,3.05,side*.35],[-.85,3.46,side*.75],[-1.05,3.5,side*1.3],[-1.15,3.7,side*1.7],[-1,4.32,side*1.8]],.18,.012);
tube(rig,horn,[[-.9,3.45,side*.8],[-.55,3.7,side*1.1],[-.4,4.03,side*1.1]],.11,.008);
// Dangling paws, dark talons and silver shoulder plates.
tube(rig,blue,[[-.7,1.7,side*.6],[-1,1,side*.8],[-1.35,.65,side*.7]],.25,.2);ellipsoid(rig,navy,-1.4,.56,side*.7,.35,.23,.27);for(let k=0;k<3;k++)tube(rig,horn,[[-1.5,.58,side*.7+(k-1)*.17],[-1.7,.45,side*.7+(k-1)*.17],[-1.65,.3,side*.7+(k-1)*.17]],.075,.005);
const plate=ellipsoid(rig,steel,-.55,1.65,side*.77,.42,.68,.12);plate.rotation.z=.4;const trim=mesh(new T.TorusGeometry(.35,.035,6,32),edge,rig,-.55,1.7,side*.9);trim.scale.y=1.5;spiral(rig,core,-.55,1.7,side*.92,.24,side);
for(let j=0;j<3;j++)tube(rig,fire,[[-1.45,2.3-j*.27,side*.48],[-1.3,2.18-j*.27,side*.65],[-1.06,1.93-j*.27,side*.65]],.06,.005);
}
tube(rig,edge,[[-1.22,1.45,-.65],[-1.48,1.1,0],[-1.22,1.45,.65]],.065,.065);
const flames=[];for(let j=0;j<18;j++){const g=new T.Group();rig.add(g);const t=j/17;g.position.set(-1.05+t*4.8,3.15-t*1.4,Math.sin(j*1.7)*.2);const size=j<8?.8:.45;tube(g,fire,[[0,0,0],[.14,size*.45,.05],[.08,size*.85,0],[.5,size*1.15,.04]],.24*(1-t*.5),.006);spiral(g,core,.1,size*.4,.16,.13);flames.push(g);}
const orbs=[];for(let j=0;j<3;j++){const g=new T.Group();rig.add(g);ellipsoid(g,fire,0,0,0,.3,.35,.3);ellipsoid(g,core,-.03,.02,.15,.23,.24,.16);spiral(g,navy,-.03,.02,.32,.13);tube(g,fire,[[.06,.25,0],[.22,.52,0],[.02,.65,0],[.08,.86,0]],.12,.005);orbs.push(g);}
const light=new T.PointLight('#5fffe0',12,8);light.position.set(0,2.8,0);dragon.add(light);
function animate(t,awake){rig.position.y=Math.sin(t*1.4)*.1;rig.rotation.z=awake?Math.sin(t*3)*.035:0;flames.forEach((f,i)=>{f.scale.y=1+Math.sin(t*3.2+i)*.13;f.rotation.x=Math.sin(t*2+i)*.1;});orbs.forEach((o,i)=>{const a=t*(awake?.65:.25)+i*2.094;o.position.set(Math.cos(a)*2.7-.2,2.6+Math.sin(a*1.5)*.6,Math.sin(a)*1.8);});light.intensity=12+Math.sin(t*3)*2;}
return {dragon,body,eyes,animate};}
const wood=material('#654027',0,.9),plank=material('#895637',0,.8),iron=material('#334b85',.7,.34),rim=material('#6382bb',.6,.3),coin=material('#efb844',.78,.24);
function chest(parent,x,z,scale=1,open=true){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(scale);parent.add(g);
for(let row=0;row<4;row++){const y=.15+row*.17;box(g,row%2?wood:plank,0,y,.48,1.5,.16,.12);box(g,row%2?wood:plank,0,y,-.48,1.5,.16,.12);box(g,wood,-.72,y,0,.12,.16,.9);box(g,wood,.72,y,0,.12,.16,.9);}box(g,wood,0,.1,0,1.4,.12,.9);
for(const side of [-1,1]){box(g,iron,side*.62,.4,.56,.12,.77,.08);box(g,iron,side*.62,.4,-.56,.12,.77,.08);box(g,rim,0,.77,side*.53,1.62,.09,.09);box(g,rim,side*.77,.77,0,.09,.09,1.1);for(let j=0;j<3;j++)ellipsoid(g,rim,side*.62,.2+j*.23,.615,.045,.045,.025);const h=mesh(new T.TorusGeometry(.16,.035,6,18),iron,g,side*.81,.45,0);h.rotation.y=Math.PI/2;}
box(g,iron,0,.57,.59,.2,.3,.08);box(g,coin,0,.56,.64,.055,.1,.02);
const lid=new T.Group();lid.position.set(0,.85,-.52);g.add(lid);for(let j=0;j<6;j++)box(lid,j%2?wood:plank,0,.04,j*.18+.03,1.5,.12,.17);for(const side of [-1,1]){box(lid,iron,side*.65,.08,.5,.13,.18,1.16);box(lid,rim,0,.08,side===1?1.08:-.05,1.6,.18,.08);}lid.rotation.x=open?-1.5:0;return{group:g,lid};}
function treasure(scene,obstacles){let seed=1234;const rnd=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};const transforms=[];const dummy=new T.Object3D();
function add(x,y,z,r=.13){dummy.position.set(x,y,z);dummy.rotation.set((rnd()-.5)*.7,rnd()*6.28,(rnd()-.5)*.7);dummy.scale.set(r,.025,r);dummy.updateMatrix();transforms.push(dummy.matrix.clone());}
const piles=[[-11,-7,1.4],[-7,-8,1.5],[3,-8,1.5],[11,-6,1.6],[11,-1,1.2],[11,6,1.3],[5,8,1.4],[-6,8,1.1]];
for(const [x,z,r] of piles){for(let k=0;k<180;k++){const a=rnd()*6.28,d=Math.sqrt(rnd())*r;add(x+Math.cos(a)*d,.12+Math.pow(1-d/r,1.3)*.9+rnd()*.13,z+Math.sin(a)*d,.11+rnd()*.06);}for(let j=0;j<5;j++){const sx=x+(rnd()-.5)*r*2,sz=z+(rnd()-.5)*r*2;for(let k=0;k<5+j;k++)add(sx,.12+k*.045,sz,.14);}}
for(const [x,z,rot] of [[-11,-5,.4],[-7,-8,-.2],[4,-8,.1],[11,1,-.8],[10,7,-.4],[-5,8,.3]]){const c=chest(scene,x,z,1.25,true);c.group.rotation.y=rot;obstacles.push({x,z,r:1.05});for(let k=0;k<95;k++){const lx=(rnd()-.5)*1.4,lz=(rnd()-.5)*.85;add(x+Math.cos(rot)*lx+Math.sin(rot)*lz,.8+rnd()*.35,z-Math.sin(rot)*lx+Math.cos(rot)*lz,.12+rnd()*.04);}}
const coins=new T.InstancedMesh(new T.CylinderGeometry(1,1,1,12),coin,transforms.length);transforms.forEach((m,i)=>coins.setMatrixAt(i,m));coins.castShadow=false;coins.receiveShadow=true;scene.add(coins);
const rings=new T.InstancedMesh(new T.TorusGeometry(.79,.065,4,12),material('#ffe299',.7,.28),transforms.length);transforms.forEach((m,i)=>{const p=new T.Vector3(),q=new T.Quaternion(),s=new T.Vector3();m.decompose(p,q,s);const up=new T.Vector3(0,.017,0).applyQuaternion(q);dummy.position.copy(p).add(up);dummy.quaternion.copy(q).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),Math.PI/2));dummy.scale.setScalar(s.x);dummy.updateMatrix();rings.setMatrixAt(i,dummy.matrix);});scene.add(rings);return transforms.length;}
return{spirit,chest,treasure};
})();
