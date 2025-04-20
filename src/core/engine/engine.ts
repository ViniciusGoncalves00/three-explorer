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

  private entityManager: EntityManager = new EntityManager();

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

    this.registerSystem(new RotateSystem());
  }

  public onNotify(subject: ISubject, args?: string[]) {
    if (subject instanceof TimeController && args) {
      switch (args[0]) {
        case "Start":
          this.entityManager.saveState();
          break;
        case "Stop":
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

  public getEntities(): Entity[] {
    return this.entityManager.getEntities();
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

    if (!this._timeController.isRunning || this._timeController.isPaused) return;

    const entities = this.getEntities();

    this.awakeSystems.forEach(system => system.awake(entities.filter(entity => !entity.isAwaked)));
    this.startSystems.forEach(system => system.start(entities.filter(entity => !entity.isStarted)));
    this.fixedUpdateSystems.forEach(system => system.fixedUpdate(entities, this._time.deltaTime));
    this.updateSystems.forEach(system => system.update(entities, this._time.deltaTime));
    this.lateUpdateSystems.forEach(system => system.lateUpdate(entities, this._time.deltaTime));
  }
}