import * as THREE from 'three';
import { ThreeScene } from './three-scene';
import { RendererManager } from './three-renderer';
import { CameraController } from './three-camera';
import { IUpdatable } from '../../api/iupdatable';
import { Engine } from '../../engine/engine';
import { IObserver } from '../../patterns/observer/observer';
import { ISubject } from '../../patterns/observer/subject';
import { TimeController } from '../../engine/time-controller';

declare global {
  interface Window {
    timeController: typeof TimeController;
  }
}

export class ThreeEngine implements IUpdatable, IObserver {
  private readonly _engine: Engine;

  private scene: ThreeScene;
  private rendererEditor: RendererManager;
  private rendererRun: RendererManager;
  private cameraEditor: CameraController;
  private cameraRun: CameraController;

  constructor(engine: Engine, containerEditor: HTMLElement, containerRun: HTMLElement) {
    this._engine = engine;

    this.scene = new ThreeScene();
    this.rendererEditor = new RendererManager(containerEditor);
    this.rendererRun = new RendererManager(containerRun);

    this.cameraEditor = new CameraController(containerEditor);
    this.cameraRun = new CameraController(containerRun);

    this.cameraEditor.GetCamera().position.set(10, 10, 10);
    this.cameraEditor.GetCamera().lookAt(0, 0, 0);
    this.cameraRun.GetCamera().position.set(0, 1, -10);
    this.cameraRun.GetCamera().lookAt(0, 1, 0);

    this.rendererEditor.setActive(true);
    this.rendererRun.setActive(true);
    this.cameraEditor.setActive(true);
    this.cameraRun.setActive(false);

    this._engine.timeController.attach(this);
    // this._engine.timeController.attach(this.rendererEditor);
    // this._engine.timeController.attach(this.rendererRun);

    this._engine.addUpdatable(this);
    this._engine.addUpdatable(this.scene);

    window.addEventListener('resize', () => {
      this.cameraEditor.updateProjection();
      this.cameraRun.updateProjection();
      this.rendererEditor.resize();
      this.rendererRun.resize();
    });
  }

  public onNotify(subject: ISubject, args?: string[]) {
    if(subject instanceof TimeController) {
      if (args?.includes('Start')) {
        this.cameraEditor.orbitControls.enabled = false;
        this.cameraRun.orbitControls.enabled = true;
      } else if (args?.includes('Stop')) {
        this.cameraEditor.orbitControls.enabled = true;
        this.cameraRun.orbitControls.enabled = false;
      }
    }
  }

  public update(deltaTime: number): void {
    this.rendererEditor.render(this.scene.scene, this.cameraEditor.GetCamera());
    this.rendererRun.render(this.scene.scene, this.cameraRun.GetCamera());
  }
}
