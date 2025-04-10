import * as THREE from 'three';

export function initScene() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  const renderer1 = new THREE.WebGLRenderer();
  const renderer2 = new THREE.WebGLRenderer();
  const viewportContainer = document.getElementById("viewport-container");

  if(viewportContainer) {
    renderer1.setSize(viewportContainer.clientWidth / 2, viewportContainer.clientHeight);
    renderer2.setSize(viewportContainer.clientWidth / 2, viewportContainer.clientHeight);
    viewportContainer.appendChild(renderer1.domElement);
    viewportContainer.appendChild(renderer2.domElement);
  }

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer1.render(scene, camera);
    renderer2.render(scene, camera);
  }

  animate();
}
