import * as THREE from 'three';
import { IObserver } from '../../patterns/observer/observer';
import { ISubject } from '../../patterns/observer/subject';
import { IUpdatable } from '../../api/iupdatable';

export class RendererManager implements IUpdatable, IObserver {
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  private _active: boolean = false;
  public get isActive(): boolean { return this._active};

  private resizeObserver: ResizeObserver;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.setup();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
  }

  private setup() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.innerHTML = ''; // Remove canvas anterior, se houver
    this.container.appendChild(this.renderer.domElement);
  }

  public resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
  
    this.renderer.setSize(width, height, false);
  }

  public render(scene: THREE.Scene, camera: THREE.Camera) {
    if (!this._active) return;
    this.renderer.render(scene, camera);
  }

  public setActive(value: boolean) {
    this._active = value;
  }

  public onNotify(subject: ISubject, args?: string[]) {
    // Placeholder: pode ser usado para reagir a notificações futuras
  }

  public update(deltaTime: number): void {
    // Placeholder
  }
}