import { IAwake } from "../../assets/systems/interfaces/awake";
import { IFixedUpdate } from "../../assets/systems/interfaces/fixedUpdate";
import { ILateUpdate } from "../../assets/systems/interfaces/lateUpdate";
import { IStart } from "../../assets/systems/interfaces/start";
import { ISystem } from "../../assets/systems/interfaces/system";
import { IUpdate } from "../../assets/systems/interfaces/update";
import { IRenderer } from "../../graphics/IRenderer";
import { IRenderScene } from "../../graphics/IRenderScene";
import { Entity } from "../api/entity";
import { EntityManager } from "../api/entity-manager";

import { Time } from "./time";
import { TimeController } from "./time-controller";
import { isIAwake, isIFixedUpdate, isILateUpdate, isIStart, isIUpdate } from "./typeguard";

export class Engine {
  private _time: Time;
  public get time(): Time { return this._time };

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

    this.timeController.isRunning.subscribe((wasStarted => {
      if(wasStarted) {
        if(this.animationFrameId) return;

        this.entityManager.saveEntities();
        this.animationFrameId = requestAnimationFrame(this.loop);
      }
      else {
        if(!this.animationFrameId) return;

        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
        this.entityManager.restoreEntities();
      }}
    ))
    
    this.timeController.isPaused.subscribe((wasPaused => {
      if(wasPaused) {
        if(!this.animationFrameId) return;

        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      else {
        if(this.animationFrameId) return;

        this.animationFrameId = requestAnimationFrame(this.loop);
      }}
    ))
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