import * as THREE from 'three';
import { IObserver } from '../../patterns/observer/observer';
import { ISubject } from '../../patterns/observer/subject';
import { IUpdatable } from '../../api/iupdatable';

export class RendererManager implements IUpdatable, IObserver {
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  private _active: boolean = false;
  public get isActive(): boolean { return this._active};

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer();
    this.setup();
  }

  private setup() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
  }

  public render(scene: THREE.Scene, camera: THREE.Camera) {
    if (!this._active) return;
    this.renderer.render(scene, camera);
  }

  public setActive(value: boolean) {
    this._active = value;
    this.renderer.domElement.style.display = value ? 'block' : 'none';
  }

  public onNotify(subject: ISubject, args?: string[]) {
    // Placeholder: pode ser usado para reagir a notificações futuras
  }

  public update(deltaTime: number): void {
    // Placeholder: aqui você pode atualizar lógica se necessário
  }
}
