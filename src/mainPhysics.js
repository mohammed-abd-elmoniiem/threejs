

import  * as THREE from 'three'
import { OrbitControls, FlyControls } from 'three/examples/jsm/Addons.js';

import * as CANNON from 'cannon-es'

import GUI from 'lil-gui';
// import { button } from 'motion/react-client';


// gui ++++++++++++++++++++++++++++++++++++++++++

const gui = new GUI()







const canvasElement = document.getElementById('canvas');

const canvasSize ={
    width:function(){return canvasElement.getBoundingClientRect().width},
    height:function(){return canvasElement.getBoundingClientRect().height},
    aspect:function(){return this.width()/this.height()},


}



// intialize scene ,camera , renderer++++++++++++++++++++++++++++++++++++++++++

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x888888,1,30)
// scene.overrideMaterial = new THREE.MeshDepthMaterial()


const camera = new  THREE.PerspectiveCamera(90,canvasSize.aspect(),0.1,2000)
camera.position.set(0,5,5)
camera.lookAt(new THREE.Vector3(0,0,0))
scene.add(camera)


const renderer = new THREE.WebGLRenderer({antialias:true , canvas:canvasElement});
renderer.setSize(canvasSize.width(),canvasSize.height());
renderer.render(scene,camera)

// renderer.shadowMap.enabled = true


// --------------------------------------------------------------------------

// initialize physics world++++++++++++++++++++++++++++++++++++++++++

 const world =new  CANNON.World()
 world.gravity.set(0,-9.82,0);
 world.allowSleep = true
//  world.broadphase = new CANNON.GridBroadphase

 const metalMaterial = new CANNON.Material('metal')
 const groundMaterial = new CANNON.Material('concrete')

const ballGroundContact = new CANNON.ContactMaterial(metalMaterial,groundMaterial,{
    friction:0.8,
    restitution:0.3,
})
world.addContactMaterial(ballGroundContact);





// ----------------------------------------------------
const objects = []

const matCube = new THREE.MeshStandardMaterial({metalness:0.5,roughness:0.4, wireframe:false})
const geoCube = new THREE.BoxGeometry(1,1,1);


function createCube(length,position){
     

     const cube = new THREE.Mesh(geoCube , matCube);
     
     cube.castShadow = true
     cube.scale.set(length ,length,length)
     cube.position.copy(position)
     scene.add(cube)

     const cubeBody = new CANNON.Body({
        mass:cubesProprities.mass,
        shape:new CANNON.Box(new CANNON.Vec3(length*0.5 , length*0.5,length*0.5)),
        material:metalMaterial,
        position:position
     })

     world.addBody(cubeBody)

     objects.push({cube,cubeBody})





}

function createGridOfCubes(number,length){

    for(let i = 0 ; i < number ; i++){
        for(let j = 0 ; j < number ; j++){
            for(let k = 0 ; k < number ; k++){

                createCube(length,new CANNON.Vec3((j)*length,(i+0.5)*length,(k)*length))
            }
        }
    }
}
const cubesProprities = {
    count:5,
    length:0.1,
    mass:0.1

}

const ballPropeties ={
    mass:100
}

const ballGui = gui.addFolder('ball properties')
ballGui.add(ballPropeties , 'mass',0,1000,0.1)


const cubesGui = gui.addFolder('cubes properties')
cubesGui.add(cubesProprities,'length',0.1,2,0.1)
cubesGui.add(cubesProprities,'count',1,10,1).onChange(valuesCahanges)
cubesGui.add(matCube,'wireframe')
cubesGui.add(cubesProprities,'mass',0.1,100,0.1);

gui.add({reset:false},'reset').onChange(valuesCahanges)

function valuesCahanges(value){

    for(const object of objects){
        world.removeBody(object.cubeBody)
        scene.remove(object.cube)
    }
    objects.splice(0)
    createGridOfCubes(cubesProprities.count,cubesProprities.length)
    console.log(objects.at(-1).cubeBody.position)

    sphereBody.force.setZero()
    sphereBody.torque.setZero()
    sphereBody.velocity.setZero()

    sphereBody.position.set(cubesProprities.count* cubesProprities.length *0.5  , cubesProprities.count *2, cubesProprities.count * cubesProprities.length *0.5);
    
    sphereBody.position.y = cubesProprities.count
    sphereBody.mass = ballPropeties.mass
    console.log(sphereBody)

    

}

createGridOfCubes(cubesProprities.count,cubesProprities.length)


// objects++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// surronded space

const bigBox = new THREE.Mesh(
    new THREE.BoxGeometry(100,100,100),
    new THREE.MeshStandardMaterial({color:0x2211ff,side:THREE.BackSide})
    
)

scene.add(bigBox)
//    ^ ground******
const geoGround  = new THREE.PlaneGeometry(200,200,64,64);
const matGround = new THREE.MeshMatcapMaterial({matcap:new THREE.TextureLoader().load('/textures/matcaps/8.png')})

const ground = new THREE.Mesh(geoGround , matGround)
ground.rotation.x = Math.PI *- 0.5
ground.receiveShadow =true
scene.add(ground)

 const groundBody = new CANNON.Body({
    mass:0,
    shape:new CANNON.Plane(),
    material:groundMaterial
 })

 groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1,0,0), Math.PI *0.5);
 world.addBody(groundBody)

// ball ++++++
const geoBall = new THREE.SphereGeometry(cubesProprities.length , 64,64);
const matBall = new THREE.MeshPhysicalMaterial({color:0xfffb09,metalness:0.0,roughness:0.02,envMapIntensity:1.2,clearcoat:1,clearcoatRoughness:0.6,sheen:0.2,reflectivity:1,transmission:1,emissive:0xffad14})

ballGui.add(matBall,'clearcoat',0,1)
ballGui.add(matBall,'sheen',0,1,0.5)
ballGui.add(matBall,'reflectivity',0,1)
ballGui.add(matBall,'transmission',0,1)
ballGui.add(matBall,'clearcoatRoughness',0,1)




const ball = new THREE.Mesh(geoBall , matBall);
ball.castShadow =true;
// ball.position.y = 15
scene.add(ball)



 const sphereBody = new CANNON.Body({
    mass:3,
    position:new CANNON.Vec3(0,5,0),
    shape:new CANNON.Sphere(cubesProprities.length ),
    material:metalMaterial,
 })

 world.addBody(sphereBody)






// --------------------------------------------------------------------objects

// controls +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const control = new OrbitControls(camera,canvasElement);
// const control = new FlyControls(camera,canvasElement);
control.update()
// control.rollSpeed = Math.PI /12
// control.movementSpeed = 3
// control.dragToLook = false
// orbitControl.update


// -----------------------------------------------------------------controls





//  animation +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const clock = new THREE.Clock()
let eTime = 0
function animate(){
    world.step(1/60,clock.getDelta(),3)
//  console.log(sphereBody.position)

    eTime= clock.getElapsedTime()

    ball.position.copy(sphereBody.position)
    ball.quaternion.copy(sphereBody.quaternion)

    for(const object of objects){
        object.cube.position.copy(object.cubeBody.position);
        object.cube.quaternion.copy(object.cubeBody.quaternion)
    }

    // console.log(eTime , clock.getDelta());
control.update(clock.getDelta())


    camera.lookAt(new THREE.Vector3(0,0,0))

    renderer.render(scene,camera);
    requestAnimationFrame(animate)
}
animate()

// --------------------------------------------------------------------animation


// lights +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const dirLight = new THREE.DirectionalLight(0xffffff,1)
dirLight.position.set(5,15,-5);
dirLight.castShadow =true
const amLight = new THREE.AmbientLight(0xeeeeee,0.01)

const pointLight = new THREE.PointLight(0xffad14,3,6);
pointLight.castShadow=true
ball.add(pointLight)

scene.add(dirLight , amLight)


// --------------------------------------------------------------------------lights





// resize ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

window.addEventListener('resize',(eve)=>{
    canvasElement.style.cssText = 'width:100vw ;height:100vh';
      console.log(canvasSize.aspect())
    camera.aspect = canvasSize.aspect()
    renderer.setSize(canvasSize.width(),canvasSize.height())
    renderer.setPixelRatio = Math.min(window.devicePixelRatio , 2);
    camera.updateProjectionMatrix()
    renderer.render(scene,camera)
    
})



// --------------------------------------------------------------------------------