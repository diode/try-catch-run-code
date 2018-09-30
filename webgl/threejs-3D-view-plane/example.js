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
    this.settings.camera = this.settings.camera || { x: 0, y:0, z: 0};
    this.settings.antialias = this.settings.antialias || true;
    this.settings.bgcolor = this.settings.bgcolor || 0x000000;
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
      this.createRenderer();
      this.createScene();
      this.createControls(false);
    }

    if (typeof createObjects == "function") {
      createObjects.call(this);
    }

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

   // Initialize scene
   createScene() {
    this.scene = new THREE.Scene();
    //this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, this.settings.near, this.settings.far );
    this.camera = new THREE.PerspectiveCamera(this.settings.fov, window.innerWidth / window.innerHeight, this.settings.near, this.settings.far);
    this.camera.position.set(this.settings.camera.x, this.settings.camera.y, this.settings.camera.z);

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    this.scene.fog = new THREE.FogExp2( this.settings.bgcolor, 0.0128 );

    let pointLight = new THREE.PointLight(0xffffff, 0.5);
    this.camera.add(pointLight);

    this.scene.add(this.camera);
  }

  // Initialize orbit controls
  createControls(isAnimated){
    this.orbitControl = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    if(isAnimated){
      this.orbitControl.enableDamping = true; 
      this.orbitControl.dampingFactor = 0.25;
    }
    this.orbitControl.screenSpacePanning = false;
    this.orbitControl.minDistance = 10;
    this.orbitControl.maxDistance = 2000;
    this.orbitControl.maxPolarAngle = Math.PI / 2;
    this.orbitControl.target.set( 0, 5, 0 );
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
    bgcolor: 0xcccccc,
    camera: {
      x: 7,
      y: 7,
      z: 7
    },
    fov: 75,
    near: 1,
    far: 2000
  });
  // Call initialize function 
  // In createObjects callback create objects
  threeStarterKit.initialize(function () {

    //Add a grid plane
    let grid = new THREE.GridHelper( 200, 60, 0xffffff, 0xaaaaaa );
    this.scene.add( grid );


  });

  let prevTime = Date.now();
  // Call animate function 
  // In transfoem callback apply required transformation to objects
  threeStarterKit.animate(function () {
    if(this.orbitControl){
      this.orbitControl.update();
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