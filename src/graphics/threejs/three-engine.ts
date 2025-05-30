import * as THREE from 'three';
import { ThreeScene } from './three-scene';
import { RendererManager } from './three-renderer';
import { CameraController } from './three-camera';
import { ObjectBinder } from './object-binder';
import { IObserver } from '../../common/patterns/observer/observer';
import { Engine } from '../../core/engine/engine';
import { TimeController } from '../../core/engine/time-controller';
import { ISubject } from '../../common/patterns/observer/subject';

declare global {
  interface Window {
    timeController: typeof TimeController;
  }
}

export class ThreeEngine implements IObserver {
  private readonly _engine: Engine;

  public scene: ThreeScene;
  private rendererEditor: RendererManager;
  private rendererSimulator: RendererManager;
  private cameraEditor: CameraController;
  private cameraSimulator: CameraController;

  private _binder: ObjectBinder;

  private editorObserver: ResizeObserver;
  private simulatorObserver: ResizeObserver;

  constructor(engine: Engine, binder: ObjectBinder, containerEditor: HTMLElement, canvasEditor: HTMLElement, containerSimulator: HTMLElement, canvasSimulator: HTMLElement) {
    this._engine = engine;
    this._binder = binder;

    this.scene = new ThreeScene();
    this.rendererEditor = new RendererManager(containerEditor, canvasEditor);
    this.rendererSimulator = new RendererManager(containerSimulator, canvasSimulator);

    this.cameraEditor = new CameraController(containerEditor);
    this.cameraSimulator = new CameraController(containerSimulator);

    this.cameraEditor.GetCamera().position.set(10, 10, 10);
    this.cameraEditor.GetCamera().lookAt(0, 0, 0);
    this.cameraSimulator.GetCamera().position.set(0, 1, -10);
    this.cameraSimulator.GetCamera().lookAt(0, 1, 0);

    this.rendererEditor.setActive(true);
    this.rendererSimulator.setActive(true);
    this.cameraEditor.setActive(true);
    this.cameraSimulator.setActive(false);

    this._engine.timeController.isRunning.subscribe(wasStarted => {
        this.cameraEditor.orbitControls.enabled = !wasStarted;
        this.cameraSimulator.orbitControls.enabled = wasStarted;
    })

    this._engine.timeController.isPaused.subscribe(wasPaused => {
        this.cameraEditor.orbitControls.enabled = wasPaused;
        this.cameraSimulator.orbitControls.enabled = !wasPaused;
    })

    this.scene.scene.background = new THREE.Color(0.02, 0.02, 0.02);
    this.scene.scene.fog = new THREE.Fog(new THREE.Color(0.02, 0.02, 0.02), 0, 100);

    const gridHelper = new THREE.GridHelper(100, 100, new THREE.Color(0.1, 0.1, 0.1), new THREE.Color(0.1, 0.1, 0.1));
    this.scene.scene.add(gridHelper);

    this.editorObserver = new ResizeObserver(() => {this.rendererEditor.resize(), this.cameraEditor.updateProjection()});
    this.editorObserver.observe(containerEditor);


    this.simulatorObserver = new ResizeObserver(() => {this.rendererSimulator.resize(), this.cameraSimulator.updateProjection()});
    this.simulatorObserver.observe(containerEditor);

    requestAnimationFrame(this.update)

    window.addEventListener('resize', () => {
      this.cameraEditor.updateProjection();
      this.cameraSimulator.updateProjection();
      this.rendererEditor.resize();
      this.rendererSimulator.resize();
    });
  }

  public onNotify(subject: ISubject, args?: string[]) {
    if(subject instanceof TimeController) {
      if (args?.includes('Start')) {
        this.cameraEditor.orbitControls.enabled = false;
        this.cameraSimulator.orbitControls.enabled = true;
      } else if (args?.includes('Stop')) {
        this.cameraEditor.orbitControls.enabled = true;
        this.cameraSimulator.orbitControls.enabled = false;
      }
    }
  }

  public update = () => {
    requestAnimationFrame(this.update)

    this._binder.updateFromLogic();
    this.rendererEditor.render(this.scene.scene, this.cameraEditor.GetCamera());
    this.rendererSimulator.render(this.scene.scene, this.cameraSimulator.GetCamera());
  }
}