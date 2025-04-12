import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { InputManager } from "../managers/input-manager";
// import { InputMapping } from "../input-mapping";
import { degToRad } from "three/src/math/MathUtils";

export interface CameraControllerEventMap {
    /**
     * Fires when the camera has been transformed by the controls.
     */
    change: {};

    /**
     * Fires when an interaction was initiated.
     */
    start: {};

    /**
     * Fires when an interaction has finished.
     */
    end: {};
}

export class CameraController {
    private _camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    private _canvas: HTMLElement;
    // private _inputManager: InputManager;
    private _speed: number = 1;
    private _orbitControls: OrbitControls;

    private _wasMoving: boolean = false;

    private _active: boolean = false;
    public get isActive(): boolean { return this._active};

    constructor(canvas: HTMLElement) {
        this._canvas = canvas;

        const aspect_ratio = this._canvas.clientWidth / this._canvas.clientHeight;
        const perspective_camera = new THREE.PerspectiveCamera(50, aspect_ratio, 0.01, 100000);
        this._camera = perspective_camera;
        this._camera.position.set(10, 10, 10);
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));

        // this._inputManager = InputManager.GetInstance();

        this._orbitControls = new OrbitControls(this._camera, canvas);
        // this._orbitControls.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown'}
        // this._orbitControls.enableDamping = true;
        // this._orbitControls.dampingFactor = 0.05;
        this._orbitControls.minDistance = 1;
        this._orbitControls.maxDistance = 100000;
        
        this._orbitControls.update();
    }

    public GetCamera(): THREE.Camera {
        return this._camera;
    }

    public Update(): void {    
        this._camera.updateProjectionMatrix();
    }

    public setActive(value: boolean) {
      this._active = value;
      this._orbitControls.enabled = value;
    }
}