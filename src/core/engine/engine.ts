import { Entity } from "../api/entity";
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

    private entities: Entity[] = [];

    private systems: ISystem[] = [];
    private awakeSystems: IAwake[] = [];
    private startSystems: IStart[] = [];
    private fixedUpdateSystems: IFixedUpdate[] = [];
    private updateSystems: IUpdate[] = [];
    private lateUpdateSystems: ILateUpdate[] = [];

    public constructor() {
        this._time = new Time();
        this._timeController = new TimeController();
        this._timeController.attach(this)

        this.registerSystem(new RotateSystem())
    }

    public onNotify(subject: ISubject, args?: string[]) {
      if(subject instanceof TimeController && args) {
        switch (args[0]) {
          case "Start":
            this.entities.forEach(entity => entity.saveState())
            break;
          case "Pause":
            break;
          case "Unpause":
            break;
          case "Stop":
            for (let i = this.entities.length - 1; i >= 0; i--) {
              if (this.entities[i].isRuntime) {
                  this.entities.splice(i, 1);
              }
            }
            this.entities.forEach(entity => entity.restoreState())
            break;
          default:
            break;
        }
      }
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
      
      this.awakeSystems.forEach(system => system.awake(this.entities.filter(entity => !entity.isAwaked)));
      this.startSystems.forEach(system => system.start(this.entities.filter(entity => !entity.isStarted)));
      this.fixedUpdateSystems.forEach(system => system.fixedUpdate(this.entities, this._time.deltaTime));
      this.updateSystems.forEach(system => system.update(this.entities, this._time.deltaTime));
      this.lateUpdateSystems.forEach(system => system.lateUpdate(this.entities, this._time.deltaTime));
    }
  }