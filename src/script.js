import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

/**
* Cursor
*/
const cursor = {}
cursor.x = 0
cursor.y = 0

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Material
 */
// Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg", () => {
  // This function is called when the texture is loaded

  // Use MeshBasicMaterial for all meshes once the texture is loaded
  const material = new THREE.MeshBasicMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
  });

  // Objects after material is ready
  const objectsDistance = 4;

  // Meshes
  const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
  );
  mesh1.position.y = 2;
  mesh1.scale.set(0.5, 0.5, 0.5);

  const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
  mesh2.visible = false;

  const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
  );
  mesh3.position.y = -2;
  mesh3.scale.set(0.5, 0.5, 0.5);

  // Position meshes
  mesh1.position.y = -objectsDistance * 0;
  mesh2.position.y = -objectsDistance * 1;
  mesh3.position.y = -objectsDistance * 2;

  const sectionMeshes = [mesh1, mesh2, mesh3];

  // Add meshes to the scene
  scene.add(mesh1, mesh2, mesh3);

  /**
   * Test cube
   */
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: parameters.materialColor })
  );
  scene.add(cube);

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener('mousemove', (event) =>
    {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
    console.log(cursor)
    });

  /**
   * Camera
   */
  const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.z = 6;
  scene.add(camera);

  /**
   * Controls
   */
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.maxPolarAngle = Math.PI / 2;

  /**
   * Scroll
   */
  let scrollY = window.scrollY;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Enable transparent background
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Set the clear color's alpha to 0 (fully transparent)
  renderer.setClearAlpha(0);

  /**
   * Animate
   */
  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Cube rotation
    cube.rotation.x = elapsedTime * 0.1;
    cube.rotation.y = elapsedTime * 0.1;

    // Rotate the meshes
    mesh1.rotation.x = elapsedTime * 0.2;
    mesh1.rotation.y = elapsedTime * 0.2;

    mesh2.rotation.x = elapsedTime * 0.3;
    mesh2.rotation.y = elapsedTime * 0.3;

    mesh3.rotation.x = elapsedTime * 0.4;
    mesh3.rotation.y = elapsedTime * 0.4;

    // Animate meshes
    for (const mesh of sectionMeshes) {
      mesh.rotation.x = elapsedTime * 0.1;
      mesh.rotation.y = elapsedTime * 0.12;
    }
    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
});
