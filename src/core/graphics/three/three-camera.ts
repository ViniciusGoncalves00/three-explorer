import * as THREE from 'three';

export function createDefaultCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.z = 5;
  return camera;
}
