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
    camera =  new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z=3;
    scene = new THREE.Scene();
    ambient = new THREE.AmbientLight(0xffffff,1.0);
    scene.add(ambient);
    
    keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30,100%,75%)'),1.0);
    keyLight.position.set(-100,0,100);
    
    fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100,0,100);
    
    backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();
    
    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);
    
    var objLoader = new THREE.OBJLoader();
    objLoader.setPath('obj/');
    objLoader.load('cube.obj', function(object){
        scene.add(object);
    });
    
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));
    
    document.getElementById("animatedModal").appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
    

    
    
}

function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

