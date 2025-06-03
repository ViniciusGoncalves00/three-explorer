import * as THREE from 'three';
import { IRenderScene } from "../../IRenderScene";
import { IRenderObject } from "../../IRenderObject";
import { ThreeObject } from './three-object';
import { Entity } from '../../../core/api/entity';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Engine } from '../../../core/engine/engine';

export class ThreeScene implements IRenderScene {
    private scene: THREE.Scene;
    public cameraA: THREE.PerspectiveCamera;
    public cameraB: THREE.PerspectiveCamera;

    public constructor(engine: Engine, canvasA: HTMLCanvasElement, canvasB: HTMLCanvasElement) {
        this.scene = new THREE.Scene();

        this.cameraA = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100000);
        this.cameraA.position.set(10, 10, 10);
        this.cameraA.lookAt(0, 0, 0);
        
        this.cameraB = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100000);
        this.cameraB.position.set(0, 1, -10);
        this.cameraB.lookAt(0, 1, 0);

        this.scene.background = new THREE.Color(0.02, 0.02, 0.02);
        this.scene.fog = new THREE.Fog(new THREE.Color(0.02, 0.02, 0.02), 0, 100);

        const gridHelper = new THREE.GridHelper(100, 100, new THREE.Color(0.1, 0.1, 0.1), new THREE.Color(0.1, 0.1, 0.1));
        this.scene.add(gridHelper);

        const orbitControlsA = new OrbitControls(this.cameraA, canvasA);
        orbitControlsA.minDistance = 1;
        orbitControlsA.maxDistance = 100000;
        orbitControlsA.update();

        const orbitControlsB = new OrbitControls(this.cameraB, canvasB);
        orbitControlsB.minDistance = 1;
        orbitControlsB.maxDistance = 100000;
        orbitControlsB.update();

        engine.timeController.isRunning.subscribe(wasStarted => {
            orbitControlsA.enabled = !wasStarted;
            orbitControlsB.enabled = wasStarted;
        })

        engine.timeController.isPaused.subscribe(wasPaused => {
            orbitControlsA.enabled = wasPaused;
            orbitControlsB.enabled = !wasPaused;
        })
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public initialize(): void {
    }

    public addObject(entity: Entity): void {
        const object = new ThreeObject();
        object.bind(entity);

        this.scene.add(object.object);
    }

    public removeObject(id: number): void {
        const object = this.scene.getObjectById(id);
        if(object) this.scene.remove(object);
    }

    private isThreeObject(obj: IRenderObject): obj is ThreeObject {
        return (obj as ThreeObject).object instanceof THREE.Object3D;
    }
}
