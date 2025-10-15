import './style.css'

import * as THREE from 'three'

import { OrbitControls, ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { split } from 'three/tsl';


console.log(THREE)


const canvas = document.getElementById("canvas");
const size={

  width:()=>canvas.getBoundingClientRect().width,
  height:()=>canvas.getBoundingClientRect().height,
  aspect:function(){
    return this.width()/this.height()
  }

}

console.log(size.aspect())


const scene = new THREE.Scene()


const camera = new THREE.PerspectiveCamera(75,size.aspect(),0.1,1000);
camera.position.z= 5
camera.castShadow= true


const renderer = new THREE.WebGLRenderer({canvas:canvas,antialias:true,shadowMap:true  });
renderer.render(scene,camera);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(size.width(),size.height());


// object 
const mat = new THREE.MeshPhongMaterial({color:0xff00ff});
const geo = new THREE.BoxGeometry(1,1,1);
const box = new THREE.Mesh(geo,mat);
box.castShadow = true;
box.receiveShadow= true

scene.add(box);

// add floor

const floorGeo = new THREE.PlaneGeometry(500,500);
const floorMat = new THREE.MeshPhongMaterial({color:0xeeeeee,side:THREE.DoubleSide})
const floor = new THREE.Mesh(floorGeo,floorMat);
floor.position.y = -1
floor.rotation.x = Math.PI*0.5;
floor.receiveShadow =true

scene.add(floor)



// light*****************************

const dirLight = new THREE.DirectionalLight(0xffffff,3);
dirLight.position.set(5,5,1);
// scene.add(dirLight)

const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
// scene.add(ambientLight)

const spotlight = new THREE.SpotLight(0xffffff,5,0,75,0.5,0.9)
spotlight.position.set(5,5,1);
spotlight.castShadow=true
spotlight.shadow.mapSize.set(1024,1024)
spotlight.shadow.autoUpdate= true

scene.add(spotlight)

// ##############################################3



// controls

const orbitControl = new OrbitControls(camera,canvas)
orbitControl.update()










// *************************************************
// animation
const clock = new THREE.Clock()

let time = 0

  function animate(){
renderer.render(scene,camera);

    time = clock.getElapsedTime()
    box.rotation.x = time
    box.rotation.y = time
    box.rotation.z = time

  //  camera.position.y = 5 + Math.sin(time)
   camera.lookAt(0,0,0)


    requestAnimationFrame(animate)
  }
animate()


window.addEventListener('resize',event=>{
  canvas.style.cssText='width:100%;height:100vh'
  console.log(size.aspect())
  renderer.setPixelRatio(Math.min(window.devicePixelRatio , 2))
  camera.aspect= size.aspect()
  renderer.setSize(size.width(),size.height());
  camera.updateProjectionMatrix()
  renderer.render(scene , camera);
})