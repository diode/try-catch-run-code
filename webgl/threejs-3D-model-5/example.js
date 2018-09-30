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
    this.settings.height = this.settings.height || 5;
    this.settings.fov = this.settings.fov || 75;
    this.settings.near = this.settings.near || 0.1;
    this.settings.far = this.settings.far || 1000;

    // Set other properties as null
    this.scene = null;
    this.camera = null;
    this.renderer = null;

  }

  // Initialize scene, camera and renderer.
  // Create objects by calling createObjects callback
  initialize(createObjects) {

    if (typeof this.canvas == "object") {
      this.createScene(this.settings.zoom);
      this.createRenderer();
    }

    if (typeof createObjects == "function") {
      createObjects.call(this);
    }

  }

  // Initialize scene
  createScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.settings.fov, window.innerWidth / window.innerHeight, this.settings.near, this.settings.far);
    this.camera.position.z = this.settings.zoom;
    this.camera.position.y = this.settings.height;

    let ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    let pointLight = new THREE.PointLight(0xffffff, 1);
    this.camera.add(pointLight);

    this.scene.add(this.camera);
  }

  // Initialize renderer
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: this.settings.antialias });
    this.renderer.setClearColor(this.settings.bgcolor, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth , window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
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
    bgcolor: 0x222222,
    zoom: 90,
    height: 20,
    fov: 55,
    near: 1,
    far: 2000
  });
  // Call initialize function 
  // In createObjects callback create objects
  threeStarterKit.initialize(function () {

    // Add handler for TGA texture
    THREE.Loader.Handlers.add(/\.tga$/i, new THREE.TGALoader());

    // Set assets path
    let modelName = "Goat_Truck"; //"Harley-Davidson";
    let path = (typeof EXAMPLE_NAME != "undefined" ? '__models/' : '/models/') + modelName + "/";

    // Initialize MTL loader and load .mtl file
    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(path);
    mtlLoader.load('Goat_Truck.mtl', (materials) => {

      // Set texture to be preload
      materials.preload();

      // Initialize 3D Object loader and load .obj file
      let objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(path);
      objLoader.load('Goat_Truck.obj', (object) => {
        // Get 3D object and adjust position
        this.object = object;
        this.object.position.y = -1.2;
        this.object.rotation.x = -Math.PI/2;
        // Add object to scene
        this.scene.add(this.object);
      }, (xhr) => {
        if (xhr.lengthComputable) {
          let percentComplete = xhr.loaded / xhr.total * 100;
          console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
      }, (xhr) => { console.log("Errs"); });
    });
  });


  // Call animate function 
  // In transfoem callback apply required transformation to objects
  threeStarterKit.animate(function () {
    if (this.object) {
      this.object.rotation.z -= 0.001;
    }
  });

}, 500);