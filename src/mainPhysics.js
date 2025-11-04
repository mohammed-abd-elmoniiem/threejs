

import  * as THREE from 'three'
import { OrbitControls, ThreeMFLoader } from 'three/examples/jsm/Addons.js';

import * as CANNON from 'cannon-es'

import GUI from 'lil-gui';


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


const camera = new  THREE.PerspectiveCamera(90,canvasSize.aspect(),0.1,2000)
camera.position.set(0,5,5)
camera.lookAt(new THREE.Vector3(0,0,0))
scene.add(camera)


const renderer = new THREE.WebGLRenderer({antialias:true , canvas:canvasElement});
renderer.setSize(canvasSize.width(),canvasSize.height());
renderer.render(scene,camera)

renderer.shadowMap.enabled = true


// --------------------------------------------------------------------------

// initialize physics world++++++++++++++++++++++++++++++++++++++++++

 const world =new  CANNON.World()
 world.gravity.set(0,-9.82,0);
 world.allowSleep = true

 const metalMaterial = new CANNON.Material('metal')
 const groundMaterial = new CANNON.Material('concrete')

const ballGroundContact = new CANNON.ContactMaterial(metalMaterial,groundMaterial,{
    friction:0.3,
    restitution:0.5,
})
world.addContactMaterial(ballGroundContact);





// ----------------------------------------------------
const objects = []

const matCube = new THREE.MeshPhongMaterial({ color:0xee1122})

function createCube(length,position){
const geoCube = new THREE.BoxGeometry(length, length,length);
     

     const cube = new THREE.Mesh(geoCube , matCube);
     cube.castShadow = true
     cube.position.copy(position)
     scene.add(cube)

     const cubeBody = new CANNON.Body({
        mass:0.5,
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

createGridOfCubes(2,1)

const addNewCubes = {
    count:3,
    length:0.3
}
gui.add(addNewCubes,'length',0.1,2,0.1)
gui.add(addNewCubes,'count',1,6,1).onChange(value=>{
    for(const object of objects){
        world.removeBody(object.cubeBody)
        scene.remove(object.cube)
    }
    objects.splice(0)
    createGridOfCubes(value,addNewCubes.length)

    sphereBody.position.set(value * addNewCubes.length *0.4, value *addNewCubes.length* 4 ,value *addNewCubes.length* 0.4)
})


// objects++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//    ^ ground******
const geoGround  = new THREE.PlaneGeometry(20,20,64,64);
const matGround = new THREE.MeshStandardMaterial({color:0x666666 , side:THREE.DoubleSide,metalness:0.7,roughness:0.5})

const ground = new THREE.Mesh(geoGround , matGround)
ground.rotation.x = Math.PI * 0.5
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
const geoBall = new THREE.SphereGeometry(0.3, 64,64);
const matBall = new THREE.MeshMatcapMaterial({matcap: new THREE.TextureLoader().load('/textures/matcaps/3.png')})

const ball = new THREE.Mesh(geoBall , matBall);
ball.castShadow =true;
ball.position.y = 15
scene.add(ball)



 const sphereBody = new CANNON.Body({
    mass:3,
    position:new CANNON.Vec3(0,15,0),
    shape:new CANNON.Sphere(0.3),
    material:metalMaterial,
 })

 world.addBody(sphereBody)






// --------------------------------------------------------------------objects





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

    camera.lookAt(new THREE.Vector3(0,0,0))

    renderer.render(scene,camera);
    requestAnimationFrame(animate)
}
animate()

// --------------------------------------------------------------------animation


// lights +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const dirLight = new THREE.DirectionalLight(0xffffff,2)
dirLight.position.set(5,15,-5);
dirLight.castShadow =true
const amLight = new THREE.AmbientLight(0xeeeeee,0.2)

scene.add(dirLight , amLight)


// --------------------------------------------------------------------------lights



// controls +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const orbitControl = new OrbitControls(camera,canvasElement)
orbitControl.update


// -----------------------------------------------------------------controls



// resize ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

window.addEventListener('resize',(eve)=>{
    // canvasElement.style.cssText = 'width:100vw ;height:100vh';
      console.log(canvasSize.aspect())
    camera.aspect = canvasSize.aspect()
    renderer.setSize(canvasSize.width(),canvasSize.height())
    renderer.setPixelRatio = Math.min(window.devicePixelRatio , 2);
    camera.updateProjectionMatrix()
    renderer.render(scene,camera)
    
})



// --------------------------------------------------------------------------------