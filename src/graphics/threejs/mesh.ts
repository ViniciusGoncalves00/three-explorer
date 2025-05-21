import * as THREE from "three";

const vertices = new Float32Array( [
	-1.0, -1.0,  1.0, // v0
	 1.0, -1.0,  1.0, // v1
	 1.0,  1.0,  1.0, // v2

	 1.0,  1.0,  1.0, // v3
	-1.0,  1.0,  1.0, // v4
	-1.0, -1.0,  1.0  // v5
] );

const indices = [
	0, 1, 2,
	2, 3, 0,
];

const geometry = new THREE.BufferGeometry();
geometry.setIndex( indices );
geometry.setAttribute("position", new THREE.BufferAttribute( vertices, 3 ))
