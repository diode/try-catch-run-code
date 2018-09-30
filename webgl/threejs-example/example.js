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
      this.canvas = canvas;

      this.settings = settings || {};
      this.settings.zoom = this.settings.zoom || 5;
      this.settings.fov = this.settings.fov || 75;
      this.settings.near = this.settings.near || 0.1;
      this.settings.far = this.settings.far || 1000;

    }

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
  createScene(zoom) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.settings.fov, window.innerWidth / window.innerHeight, this.settings.near, this.settings.far);
    this.camera.position.z = zoom;
  }

  // Initialize renderer
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
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
    zoom: 3,
    fov: 45
  });
  // Call initialize function 
  // In createObjects callback create objects
  threeStarterKit.initialize(function () {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.object = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.object);
  });
  // Call animate function 
  // In transfoem callback apply required transformation to objects
  threeStarterKit.animate(function () {
    this.object.rotation.x += 0.01;
    this.object.rotation.y += 0.01;
  });
}, 500);