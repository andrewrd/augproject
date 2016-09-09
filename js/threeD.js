/*File for editing the 3d scene file that we'll be using.
This file is responsible for holding the rendering code for the 3d objects we will be using.
The 3d rendering code will be inserted into the specified div, currently animatedModal.
This scene also holds the controls for rotating around the object.


//Initial code used from here:
//https://manu.ninja/webgl-3d-model-viewer-using-three-js
*/

if(!Detector.webgl){
    Detector.addGetWebGlMessage();
}

var container;
var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;
var windowHalfX = window.innerWidth/2;
var windowHalfY = window.innerHeight/2;

init();
render();

function init(){
    //Setup Camera
    camera =  new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z=3;

    //Create Scene
    scene = new THREE.Scene();
    ambient = new THREE.AmbientLight(0xffffff,1.0);
    scene.add(ambient);

    //Create lighting
    keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30,100%,75%)'),1.0);
    keyLight.position.set(-100,0,100);

    fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100,0,100);

    backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    //Add lighting to our scene
    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);

    //Object loader
    var objLoader = new THREE.OBJLoader();
    objLoader.setPath('obj/');
    objLoader.load('cube.obj', function(object){
        scene.add(object);
    });

    //Renderer Settings
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

    //Where to insert our 3d scene
    document.getElementById("animatedModal").appendChild(renderer.domElement);

    //Control Code
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

}

//Render loop.
function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
