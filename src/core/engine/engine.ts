import { Entity } from "../api/entity";
import { EntityManager } from "./entity-manager"; // ajuste o caminho conforme necessário

import { IAwake } from "../api/systems/interfaces/awake";
import { IFixedUpdate } from "../api/systems/interfaces/fixedUpdate";
import { ILateUpdate } from "../api/systems/interfaces/lateUpdate";
import { IStart } from "../api/systems/interfaces/start";
import { ISystem } from "../api/systems/interfaces/system";
import { IUpdate } from "../api/systems/interfaces/update";

import { RotateSystem } from "../api/systems/rotateSystem";
import { IObserver } from "../patterns/observer/observer";
import { ISubject } from "../patterns/observer/subject";
import { Time } from "./time";
import { TimeController } from "./time-controller";
import { isIAwake, isIFixedUpdate, isILateUpdate, isIStart, isIUpdate } from "./typeguard";

export class Engine implements IObserver {
  private _time: Time;
  private _timeController: TimeController;
  public get timeController(): TimeController { return this._timeController };

  private animationFrameId: number | null = null;

  public entityManager: EntityManager = new EntityManager();

  private systems: ISystem[] = [];
  private awakeSystems: IAwake[] = [];
  private startSystems: IStart[] = [];
  private fixedUpdateSystems: IFixedUpdate[] = [];
  private updateSystems: IUpdate[] = [];
  private lateUpdateSystems: ILateUpdate[] = [];

  public constructor() {
    this._time = new Time();
    this._timeController = new TimeController();
    this._timeController.attach(this);
  }

  public onNotify(subject: ISubject, args?: string[]) {
    if (args) {
      switch (args[0]) {
        case "Start":
          if (this.animationFrameId === null) {
            this.entityManager.saveState();
            this.animationFrameId = requestAnimationFrame(this.loop);
          }
          break;
        case "Pause":
          if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
          }
          break;
        case "Unpause":
          if (this.animationFrameId === null) {
              this.animationFrameId = requestAnimationFrame(this.loop);
          }
          break;
        case "Stop":
          if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
          }
          this.entityManager.restoreState();
          break;
        default:
          break;
      }
    }
  }

  public registerEntity(entity: Entity): void {
    this.entityManager.addEntity(entity);
  }

  public registerSystem(system: ISystem) {
    this.systems.push(system);

    if (isIAwake(system)) this.awakeSystems.push(system);
    if (isIStart(system)) this.startSystems.push(system);
    if (isIFixedUpdate(system)) this.fixedUpdateSystems.push(system);
    if (isIUpdate(system)) this.updateSystems.push(system);
    if (isILateUpdate(system)) this.lateUpdateSystems.push(system);
  }

  private loop = () => {
    this.animationFrameId = requestAnimationFrame(this.loop);
  
    this._time.update();
    // if (!this._timeController.isRunning || this._timeController.isPaused) return;
  
    const entities = this.entityManager.getEntities();
  
    const notAwakedEntities = entities.filter(entity => !entity.isAwaked);
    this.awakeSystems.forEach(system => system.awake(notAwakedEntities));
    notAwakedEntities.forEach(entity => entity.isAwaked = true);
  
    const notStartedEntities = entities.filter(entity => !entity.isStarted);
    this.startSystems.forEach(system => system.start(notStartedEntities));
    notStartedEntities.forEach(entity => entity.isStarted = true);
  
    this.fixedUpdateSystems.forEach(system => system.fixedUpdate(entities, this._time.deltaTime));
    this.updateSystems.forEach(system => system.update(entities, this._time.deltaTime));
    this.lateUpdateSystems.forEach(system => system.lateUpdate(entities, this._time.deltaTime));
  };  
}