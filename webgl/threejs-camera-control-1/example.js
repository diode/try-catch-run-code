/**
 * @author diode / http://vipin.live/
 */

 /*                               */
/*                               */
/* Starter Kit class for ThreeJS */
/*                               */
/*                               */
class ThreeStarterKit {
  constructor(canvas, settings) {

    // Set target canvas and settings
    if (typeof canvas == "string") {
      canvas = document.getElementById(canvas);
    }

    this.canvas = canvas;

    this.settings = settings || {};
    this.settings.antialias = this.settings.antialias || true;
    this.settings.bgcolor = this.settings.bgcolor || 0x000000;
    this.settings.zoom = this.settings.zoom || 5;
    this.settings.height = this.settings.height || 0;
    this.settings.fov = this.settings.fov || 75;
    this.settings.near = this.settings.near || 0.1;
    this.settings.far = this.settings.far || 1000;

    // Set other properties as null
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mixer = null;
    this.orbitControl = null;
    this.mixerInfo = {
      time: Date.now()
    }

  }

  // Initialize scene, camera and renderer.
  // Create objects by calling createObjects callback
  initialize(createObjects) {

    if (typeof this.canvas == "object") {
      this.createScene(this.settings.zoom);
      this.createRenderer();
      this.createControls();
    }

    if (typeof createObjects == "function") {
      createObjects.call(this);
    }

  }

  // Initialize scene
  createScene() {
    this.scene = new THREE.Scene();
    //this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, this.settings.near, this.settings.far );
    this.camera = new THREE.PerspectiveCamera(this.settings.fov, window.innerWidth / window.innerHeight, this.settings.near, this.settings.far);
    this.camera.position.z = this.settings.zoom;
    this.camera.position.y = this.settings.height;

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    let pointLight = new THREE.PointLight(0xffffff, 0.5);
    this.camera.add(pointLight);

    this.scene.add(this.camera);
  }

  // Initialize renderer
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: this.settings.antialias });
    this.renderer.setClearColor(this.settings.bgcolor, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.localClippingEnabled = false;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  // Initialize orbit controls
  createControls(){
    this.orbitControl = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    
    this.orbitControl.enableDamping = true; 
    this.orbitControl.dampingFactor = 0.25;
    this.orbitControl.screenSpacePanning = false;
    this.orbitControl.minDistance = 2;
    this.orbitControl.maxDistance = 500;
    this.orbitControl.maxPolarAngle = Math.PI / 2;
  }

  // Render scene
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  // Animate scene by calling transform callback
  animate(transform) {
    requestAnimationFrame(() => {
      if (typeof transform == "function") {
        transform.call(this);
        this.render();
        this.animate(transform);
      }
    });
  }
}


setTimeout(() => {

  // Create and instance of ThreeStarterKit
  // Pass canvas id as parameter
  // Pass settings as another parameter
  var threeStarterKit = new ThreeStarterKit("expCanvas", {
    bgcolor: 0x111111,
    zoom: 2,
    height: 0,
    fov: 60,
    near: 1,
    far: 2000
  });
  // Call initialize function 
  // In createObjects callback create objects
  threeStarterKit.initialize(function () {

    // Add handler for TGA texture
    //THREE.Loader.Handlers.add(/\.tga$/i, new THREE.TGALoader());

    // Set assets path
    let modelName = "Assassin"; //"Harley-Davidson";
    let path = (typeof EXAMPLE_NAME != "undefined" ? '__models/' : '/models/') + modelName + "/";

    // Initialize MTL loader and load .mtl file
    let colladaLoader = new THREE.ColladaLoader();
    colladaLoader.setPath(path);
    colladaLoader.load('Walking.dae', (object) => {

      // Get 3D object and adjust position
      this.object = object;

      let player = this.object.scene;//.children[0];
      player.position.y = -1;
      this.scene.add(player);

      this.mixer = new THREE.AnimationMixer(player);
      this.mixer.clipAction(this.object.animations[0]).play();


    }, (xhr) => {
      if (xhr.lengthComputable) {
        let percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
    }, (xhr) => { console.log("Errs"); });
  });

  let prevTime = Date.now();
  // Call animate function 
  // In transfoem callback apply required transformation to objects
  threeStarterKit.animate(function () {
    if (this.object) {
      if (this.mixer) {
        let time = Date.now();
        this.mixer.update((time - this.mixerInfo.time) * 0.001);
        this.mixerInfo.time = time;
      }
      if(this.orbitControl){
        this.orbitControl.update();
      }
      //this.object.scene.rotation.y -= 0.01;
    }
  });

  let target = window.parent || window;
  window.parent.addEventListener("keydown", (e) => {
    e.preventDefault();
    let key = e.keyCode;
    if(key == 32) {
      if(threeStarterKit.orbitControl){
        threeStarterKit.orbitControl.reset();
      }
    }
  });

}, 500);