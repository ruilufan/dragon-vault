'use strict';
// Faceted jade grotto: all rock, crystal and mist geometry is generated locally.
window.buildCrystalCave=function(scene,shell,obstacles){
const T=THREE;let seed=801;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const rock=new T.MeshStandardMaterial({color:'#254d4e',roughness:.88,vertexColors:true});
const ice=new T.MeshStandardMaterial({color:'#72d9c6',roughness:.25,metalness:.25,emissive:'#164d48',emissiveIntensity:.6,flatShading:true});
const pale=new T.MeshStandardMaterial({color:'#b7ffe0',roughness:.3,metalness:.12,emissive:'#368773',emissiveIntensity:.6,flatShading:true});
function add(geo,mat,parent,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function rugged(radius,detail=1){const g=new T.IcosahedronGeometry(radius,detail),p=g.attributes.position,colors=[];for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const d=1+.12*Math.sin(x*8+y*3)+.07*Math.cos(y*7+z*5);p.setXYZ(i,x*d,y*d,z*d);const shade=.42+.28*(Math.sin(y*13+x*2)*.5+.5)+random()*.13;colors.push(shade*.65,shade,shade*.95);}g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.computeVertexNormals();return g;}
// Continuous, dark enclosing walls with towering inward-sloping rock ribs.
for(let side of [-1,1])for(let j=0;j<12;j++){const z=-11+j*2;const m=add(rugged(1.5),rock,shell,side*(15+random()),5,z);m.scale.set(1.8,4.5+random()*2,1.4);m.rotation.z=side*.18;}
for(let j=0;j<16;j++){const x=-15+j*2;const m=add(rugged(1.5),rock,shell,x,5,-12-random());m.scale.set(1.2,5+random()*2,1.5);const back=add(rugged(1.5),rock,shell,x,4.5,12);back.scale.set(1.3,5,1.5);}
for(let j=0;j<12;j++){const m=add(rugged(2),rock,shell,-13+j*2.4,13+random()*2,-1);m.scale.set(1.3,1.7,6);}
// Broad, uneven slabs instead of a regular tiled floor. Surface remains walkable.
const floor=new T.PlaneGeometry(28,20,42,30);floor.rotateX(-Math.PI/2);const p=floor.attributes.position,colors=[];for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,.018+Math.sin(x*2.4+z*.8)*.012+random()*.008);const shade=.4+random()*.25+.1*Math.cos(x+z);colors.push(shade*.65,shade,shade*.96);}floor.setAttribute('color',new T.Float32BufferAttribute(colors,3));floor.computeVertexNormals();add(floor,new T.MeshStandardMaterial({color:'#548a81',vertexColors:true,metalness:.15,roughness:.62}),scene);
function shard(parent,x,y,z,h,r,tilt=0,lit=false){const g=new T.CylinderGeometry(r*.55,r,h,5,1,false);const pos=g.attributes.position;for(let i=0;i<pos.count;i++){if(pos.getY(i)>0)pos.setY(i,pos.getY(i)+(pos.getX(i)/r)*h*.17);}g.computeVertexNormals();const m=add(g,lit?pale:ice,parent,x,y+h*.5,z);m.rotation.z=tilt;m.rotation.y=random()*6;const tip=add(new T.ConeGeometry(r*.55,h*.32,5),lit?pale:ice,m,0,h*.62,0);return m;}
// The luminous far end is the visual destination, echoing the reference's tall jade ravine.
for(let i=0;i<28;i++){const x=-5+random()*17,z=-10.7-random()*1.2,h=3+random()*10;shard(shell,x,.1,z,h,.3+random()*.65,(random()-.5)*.4,i%3===0);}
for(const side of [-1,1])for(let i=0;i<14;i++){const z=-9+random()*18;shard(shell,side*(13.7+random()*.7),.1,z,2+random()*7,.25+random()*.65,-side*(.12+random()*.2),i%4===0);}
for(let i=0;i<42;i++){const x=-13+random()*26,z=-9+random()*18;const crystal=shard(shell,x,9+random()*3,z,1.5+random()*3,.2+random()*.5,(random()-.5)*.45,i%5===0);crystal.rotation.x=Math.PI;}
// Two mossy rock-column silhouettes, scaled to the existing cover footprints.
for(const [j,o] of obstacles.slice(0,3).entries())SleepingDragon.rock(scene,o.x,o.z,2.8+j*.35,j%2);
for(const [j,v] of [[-12,2],[-10,-8],[11,5],[6,-9],[-3,9],[-12,-3],[12,-7],[1,9]].entries())SleepingDragon.rock(scene,v[0],v[1],1.2+(j%4)*.65,j%2);
for(const [x,z] of [[-9,5],[-6,-5],[6,5],[9,-7]]){const l=new T.PointLight('#ffe0ac',9,10);l.position.set(x,2.8,z);scene.add(l);const base=add(new T.CylinderGeometry(.13,.18,.8,8),new T.MeshStandardMaterial({color:'#766343',metalness:.5}),scene,x,.5,z);add(new T.SphereGeometry(.12,10,8),new T.MeshBasicMaterial({color:'#ffe1a1'}),scene,x,1,z);}
const treasureFill=new T.PointLight('#ffe0af',8,12);treasureFill.position.set(7,3,-3);scene.add(treasureFill);
const glow=new T.PointLight('#7dffcf',34,24,1.6);glow.position.set(5,7,-9);scene.add(glow);const blue=new T.PointLight('#60c4d6',14,19,1.6);blue.position.set(-11,4,-5);scene.add(blue);
// Soft translucent light shafts, with no full-screen blur.
const shafts=new T.Group();shell.add(shafts);for(let i=0;i<8;i++){const g=new T.ConeGeometry(.6+random()*.6,13,12,1,true);const m=add(g,new T.MeshBasicMaterial({color:'#99ffcf',transparent:true,opacity:.025,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending}),shafts,-4+i*2,7,-8.5);m.rotation.z=-.12;}
const moteGeo=new T.BufferGeometry(),points=[];for(let i=0;i<180;i++)points.push(-13+random()*26,.4+random()*10,-10+random()*20);moteGeo.setAttribute('position',new T.Float32BufferAttribute(points,3));const motes=new T.Points(moteGeo,new T.PointsMaterial({color:'#b4ffe1',size:.025,transparent:true,opacity:.6,depthWrite:false}));scene.add(motes);
return{update(t){motes.rotation.y=Math.sin(t*.06)*.025;glow.intensity=34+Math.sin(t*.65)*1.5;}};
};
