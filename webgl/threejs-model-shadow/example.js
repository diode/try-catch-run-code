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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
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

    let pointLight = new THREE.PointLight(0xffffff, 0.5);
    this.camera.add(pointLight);

    
    let shadowLight = new THREE.PointLight(0xffffff, 1);
    this.scene.add(shadowLight);
    shadowLight.position.set( 0, 24, 24 );
    shadowLight.castShadow = true; 
    shadowLight.shadow.mapSize.width = 1024;  // default
    shadowLight.shadow.mapSize.height = 1024; // default
    shadowLight.shadow.radius = 2;
    shadowLight.shadow.camera.near = 1;       // default
    shadowLight.shadow.camera.far = 2000      // default  

       
    this.scene.fog = new THREE.FogExp2( this.settings.bgcolor, 0.0128 );
    this.scene.add(this.camera);

    /*let helper = new THREE.CameraHelper( shadowLight.shadow.camera );
    this.scene.add( helper );*/
  }

  // Initialize orbit controls
  createControls(isAnimated){
    this.orbitControl = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    if(isAnimated){
      this.orbitControl.enableDamping = true; 
      this.orbitControl.dampingFactor = 0.25;
    }
    this.orbitControl.screenSpacePanning = false;
    this.orbitControl.minDistance = 20;
    this.orbitControl.maxDistance = 2000;
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
    bgcolor: 0xcccccc,
    camera: {
      x: 10,
      y: 10,
      z: 10
    },
    fov: 45,
    near: 1,
    far: 2000
  });
  // Call initialize function 
  // In createObjects callback create objects
  threeStarterKit.initialize(function () {

    //Add a grid plane
    let grid = new THREE.GridHelper( 160, 60, 0xffffff, 0xaaaaaa );
    grid.receiveShadow = true;
    this.scene.add( grid );

    //Create a plane that receives shadows (but does not cast them)
    let planeGeometry = new THREE.PlaneBufferGeometry( 160, 160, 32, 32 );
    let planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
    let plane = new THREE.Mesh( planeGeometry, planeMaterial );
    //plane.rotation.z = Math.PI/4;
    plane.rotation.x = -Math.PI/2;
    plane.receiveShadow = true;
    this.scene.add( plane );

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
      player.scale.set(0.05, 0.05, 0.05);
      enableshadow(player);
      this.scene.add(player);

      this.mixer = new THREE.AnimationMixer(player);
      this.mixer.clipAction(this.object.animations[0]).play();

      function enableshadow(item){
        item.castShadow = true;
        item.receiveShadow = true;
        let children = item.children;
        if(children && children.length){
          for(let i=0; i < children.length; i++){
            enableshadow(children[i]);
          }
        }
      }


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
    if(this.orbitControl){
      this.orbitControl.target.set( 0, 5, 0 );
      this.orbitControl.update();
    }
    if (this.mixer) {
      let time = Date.now();
      this.mixer.update((time - this.mixerInfo.time) * 0.001);
      this.mixerInfo.time = time;
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