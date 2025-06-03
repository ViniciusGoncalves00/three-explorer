import * as THREE from "three";
import { IRenderer } from "../../IRenderer";
import { ThreeScene } from "./three-scene";

export class ThreeRenderer implements IRenderer {
    private renderer: THREE.WebGLRenderer | null = null;
    private camera: THREE.Camera | null = null;
    private threeScene: ThreeScene | null = null;

    public constructor(container: HTMLCanvasElement, camera: THREE.Camera) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: container });
        this.camera = camera;
    }

    public initialize(container: HTMLCanvasElement): void {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: container });
    }

    public render(threeScene: ThreeScene): void {
        this.threeScene = threeScene;
        this.renderer?.setAnimationLoop( () => this.animate() )
    }

    public resize(width: number, height: number): void {
        this.renderer?.setSize(width, height, false);
    }

    public dispose(): void {
        this.renderer?.dispose();
    }

    private animate(): void {
        if(!this.threeScene || !this.camera) return;
        this.renderer?.render( this.threeScene.getScene(), this.camera );
    }
}
