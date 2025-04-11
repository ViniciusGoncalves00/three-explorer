import * as THREE from 'three';
import { ThreeScene } from './three-scene';
import { RendererManager } from './three-renderer';
import { CameraController } from './three-camera';
import { IUpdatable } from '../../api/iupdatable';
import { Engine } from '../../engine/engine';
import { IObserver } from '../../patterns/observer/observer';
import { ISubject } from '../../patterns/observer/subject';
import { TimeController } from '../../engine/time-controller';

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

    this.rendererEditor.setActive(true);
    this.rendererRun.setActive(true);
    this.cameraEditor.setActive(true);
    this.cameraRun.setActive(false);

    this._engine.timeController.attach(this);
    this._engine.timeController.attach(this.rendererEditor);
    this._engine.timeController.attach(this.rendererRun);

    this._engine.addUpdatable(this);
    this._engine.addUpdatable(this.scene);
  }

  public onNotify(subject: ISubject, args?: string[]) {
    if(subject instanceof TimeController) {
      if (args?.includes('Start')) {
        this.setEditorMode(false);
      } else if (args?.includes('Stop')) {
        this.setEditorMode(true);
      }
    }
  }

  private setEditorMode(isEditor: boolean) {
    this.rendererEditor.setActive(isEditor);
    this.rendererRun.setActive(!isEditor);
  }

  public update(deltaTime: number): void {
    if (this.rendererEditor.isActive) {
      this.rendererEditor.render(this.scene.scene, this.cameraEditor.GetCamera());
    }
    if (this.rendererRun.isActive) {
      this.rendererRun.render(this.scene.scene, this.cameraRun.GetCamera());
    }
  }
}
