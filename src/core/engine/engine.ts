import { IAwake } from "../api/systems/interfaces/awake";
import { IFixedUpdate } from "../api/systems/interfaces/fixedUpdate";
import { ILateUpdate } from "../api/systems/interfaces/lateUpdate";
import { IStart } from "../api/systems/interfaces/start";
import { ISystem } from "../api/systems/interfaces/system";
import { IUpdate } from "../api/systems/interfaces/update";
import { TransformSystem } from "../api/systems/transformSystem";
import { Time } from "./time";
import { TimeController } from "./time-controller";
import { isIAwake, isIFixedUpdate, isILateUpdate, isIStart, isIUpdate } from "./typeguard";

export class Engine {
    private _time: Time;
    private _timeController: TimeController;
    public get timeController(): TimeController { return this._timeController };

    private systems: ISystem[] = [];
    private awakeSystems: IAwake[] = [];
    private startSystems: IStart[] = [];
    private fixedUpdateSystems: IFixedUpdate[] = [];
    private updateSystems: IUpdate[] = [];
    private lateUpdateSystems: ILateUpdate[] = [];

    public constructor() {
        this._time = new Time();
        this._timeController = new TimeController();

        this.registerSystem(new TransformSystem())

        this.initializeSystems();

        this.loop();
    }

    private registerSystem(system: ISystem) {
        this.systems.push(system);
      
        if (isIAwake(system)) this.awakeSystems.push(system);
        if (isIStart(system)) this.startSystems.push(system);
        if (isIFixedUpdate(system)) this.fixedUpdateSystems.push(system);
        if (isIUpdate(system)) this.updateSystems.push(system);
        if (isILateUpdate(system)) this.lateUpdateSystems.push(system);
      }
      
    private initializeSystems(): void {
        this.awakeSystems.forEach((system) => system.awake());
        this.startSystems.forEach((system) => system.start());
    }
  
    private loop = () => {
        requestAnimationFrame(this.loop);

        this._time.update();

        this.fixedUpdateSystems.forEach((system) => system.fixedUpdate(this._time.deltaTime));
        this.updateSystems.forEach((system) => system.update(this._time.deltaTime));
        this.lateUpdateSystems.forEach((system) => system.lateUpdate(this._time.deltaTime));
    }
  }
  