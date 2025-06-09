import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IGraphicEngine } from "./IGraphicEngine";
import * as THREE from 'three';
import { Entity } from '../core/api/entity';
import { Transform } from '../assets/components/transform';
import { Mesh } from '../assets/components/mesh';

export class ThreeGEAdapter implements IGraphicEngine<THREE.Object3D> {
    private _scene!: THREE.Scene;
    private _rendererA!: THREE.WebGLRenderer;
    private _rendererB!: THREE.WebGLRenderer;
    private _cameraA!: THREE.Camera;
    private _cameraB!: THREE.Camera;
    private _orbitControlsA!: OrbitControls;
    private _orbitControlsB!: OrbitControls;

    private _entities: Map<string, THREE.Object3D> = new Map<string, THREE.Object3D>();
    
    public init(canvasA: HTMLCanvasElement, canvasB: HTMLCanvasElement): void {
        this._scene = new THREE.Scene();

        this._rendererA = new THREE.WebGLRenderer({ antialias: true, canvas: canvasA });
        this._rendererB = new THREE.WebGLRenderer({ antialias: true, canvas: canvasB });
    }

    public startRender(): void {
        this._rendererA.setAnimationLoop(() => this.animate(this._rendererA, this._scene, this._cameraA))
        this._rendererB.setAnimationLoop(() => this.animate(this._rendererB, this._scene, this._cameraB))
    }

    private animate(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): void {
        renderer.render( scene, camera );
    }

    public resize(width: number, height: number): void {
        this._rendererA.setSize(width, height, false);
        this._rendererB.setSize(width, height, false);
    }

    public addEntity(entity: Entity): void {
        const object = new THREE.Mesh();
        this.bind(entity, object);
        
        this._entities.set(entity.id, object);
        this._scene.add(object);
    }

    public removeEntity(entity: Entity): void {
        const object = this._entities.get(entity.id);
        if(!object) return;

        this._entities.delete(entity.id);
        this._scene.remove(object);
    }

    public bind(entity: Entity, object: THREE.Object3D): void {
        if(entity.hasComponent(Transform)) {
            const transform = entity.getComponent(Transform);

            object.position.set( transform.position.x.value, transform.position.y.value, transform.position.z.value);

            transform.position.x.subscribe(value => object.position.x = value);
            transform.position.y.subscribe(value => object.position.y = value);
            transform.position.z.subscribe(value => object.position.z = value);

            object.rotation.set(transform.rotation.x.value, transform.rotation.y.value, transform.rotation.z.value);

            transform.rotation.x.subscribe(value => object.rotation.x = value);
            transform.rotation.y.subscribe(value => object.rotation.y = value);
            transform.rotation.z.subscribe(value => object.rotation.z = value);

            object.scale.set(transform.scale.x.value, transform.scale.y.value, transform.scale.z.value);

            transform.scale.x.subscribe(value => object.scale.x = value);
            transform.scale.y.subscribe(value => object.scale.y = value);
            transform.scale.z.subscribe(value => object.scale.z = value);
        }
        
        if(entity.hasComponent(Mesh)) {
            object.add(this.bindMeshComponentToGeometry(entity.getComponent(Mesh)));
        }
    }

    public bindMeshComponentToGeometry(meshComponent: Mesh): THREE.Mesh {
        const geometry = new THREE.BufferGeometry();
        const vertices = meshComponent.vertices.items;
        const positionArray = new Float32Array(vertices.length * 3);
    
        vertices.forEach((vertex, i) => {
          positionArray[i * 3 + 0] = vertex.x.value;
          positionArray[i * 3 + 1] = vertex.y.value;
          positionArray[i * 3 + 2] = vertex.z.value;

          vertex.x.subscribe(() => {
            positionArray[i * 3] = vertex.x.value;
            geometry.attributes.position.needsUpdate = true;
          });

          vertex.y.subscribe(() => {
            positionArray[i * 3 + 1] = vertex.y.value;
            geometry.attributes.position.needsUpdate = true;
          });

          vertex.z.subscribe(() => {
            positionArray[i * 3 + 2] = vertex.z.value;
            geometry.attributes.position.needsUpdate = true;
          });
        });

        geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
        geometry.computeVertexNormals();

        const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({ color: 0xeeeeee })
        );

        return mesh;
    }
    
    public setEditorCamera(canvas: HTMLCanvasElement, startPosition: {x: number, y: number, z: number}): void {
        this._cameraA = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100000);
        this._cameraA.position.set(startPosition.x, startPosition.y, startPosition.z);
    
        this._cameraA.lookAt(0, 0, 0);

        this._orbitControlsA = new OrbitControls(this._cameraA, canvas);
        this._orbitControlsA.minDistance = 1;
        this._orbitControlsA.maxDistance = 100000;
        this._orbitControlsA.update();
    }

    public setPreviewCamera(canvas: HTMLCanvasElement, startPosition: {x: number, y: number, z: number}): void {
        this._cameraB = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100000);
        this._cameraB.position.set(startPosition.x, startPosition.y, startPosition.z);
    
        this._cameraB.lookAt(0, 1, 0);

        this._orbitControlsB = new OrbitControls(this._cameraB, canvas);
        this._orbitControlsB.minDistance = 1;
        this._orbitControlsB.maxDistance = 100000;
        this._orbitControlsB.update();
        this._orbitControlsB.enabled = false;
    }

    public toggleActiveCamera(): void {
        this._orbitControlsA.enabled = !this._orbitControlsA.enabled;
        this._orbitControlsB.enabled = !this._orbitControlsB.enabled;
    }

    public setFog(color: { r: number; g: number; b: number; }, near: number, far: number): void {
        this._scene.fog = new THREE.Fog(new THREE.Color(color.r, color.g, color.b), near, far);
    }

    public setBackground(color: { r: number; g: number; b: number; }): void {
        this._scene.background = new THREE.Color(color.r, color.g, color.b);
    }

    public setGridHelper(color: { r: number; g: number; b: number; }): void {
        const gridHelper = new THREE.GridHelper(100, 100, new THREE.Color(color.r, color.g, color.b), new THREE.Color(color.r, color.g, color.b));
        this._scene.add(gridHelper);
    }
    
    public setAxisHelper(color?: { r: number; g: number; b: number; }): void {
        throw new Error("Method not implemented.");
    }
}