import * as THREE from 'three';
import { ThreeScene } from './three-scene';
import { RendererManager } from './three-renderer';
import { CameraController } from './three-camera';
import { Engine } from '../../engine/engine';
import { IObserver } from '../../patterns/observer/observer';
import { ISubject } from '../../patterns/observer/subject';
import { TimeController } from '../../engine/time-controller';
import { Transform } from '../../api/components/transform';
import { ObjectBinder } from './object-binder';
import { Entity } from '../../api/entity';
import { Rotate } from '../../api/components/rotate';

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

  private binder: ObjectBinder;

  private editorObserver: ResizeObserver;
  private simulatorObserver: ResizeObserver;

  constructor(engine: Engine, containerEditor: HTMLElement, canvasEditor: HTMLElement, containerSimulator: HTMLElement, canvasSimulator: HTMLElement) {
    this._engine = engine;

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

    this._engine.timeController.attach(this);
    this._engine.timeController.attach(this.rendererEditor);
    this._engine.timeController.attach(this.rendererSimulator);

    this.binder = new ObjectBinder();

    const cubeEntity = new Entity(crypto.randomUUID());
    cubeEntity.addComponent(new Transform());
    cubeEntity.addComponent(new Rotate());
  
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    );
  
    this.binder.bind(cubeEntity, mesh);
    engine.entityManager.addEntity(cubeEntity);
  
    this.scene.scene.add(mesh)

    this.scene.scene.background = new THREE.Color(0.02, 0.02, 0.02);
    this.scene.scene.fog = new THREE.Fog(new THREE.Color(0.02, 0.02, 0.02), 0, 100);

    // this.scene.scene.add(cube.mesh)

    const gridHelper = new THREE.GridHelper(100, 100, new THREE.Color(0.1, 0.1, 0.1), new THREE.Color(0.1, 0.1, 0.1));
    this.scene.scene.add(gridHelper);
    // this._engine.addUpdatable(cube);

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

    this.binder.updateFromLogic();
    this.rendererEditor.render(this.scene.scene, this.cameraEditor.GetCamera());
    this.rendererSimulator.render(this.scene.scene, this.cameraSimulator.GetCamera());
  }
}