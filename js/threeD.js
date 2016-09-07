//Javascript file for the 3d objects.
//Dependencies: three.js


//Setup the basic camera settings, scene and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

//select the part of the DOM we want to insert into
document.getElementById("animatedModal").appendChild(renderer.domElement);

//Add geometry
var geometry = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00 } );
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//position camera
camera.position.z = 5;

//function that acts as a main loop for the animation
//do logic to models etc here.
function render(){
    requestAnimationFrame(render);
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
//call the main loop
render();