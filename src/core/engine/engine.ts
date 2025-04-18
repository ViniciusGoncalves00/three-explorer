import { IAwake } from "../api/systems/interfaces/awake";
import { IFixedUpdate } from "../api/systems/interfaces/fixedUpdate";
import { ILateUpdate } from "../api/systems/interfaces/lateUpdate";
import { IStart } from "../api/systems/interfaces/start";
import { IUpdate } from "../api/systems/interfaces/update";
import { TransformSystem } from "../api/systems/transformSystem";
import { Time } from "./time";
import { TimeController } from "./time-controller";
import { isAwake, isFixedUpdate, isLateUpdate, isStart, isUpdate } from "./typeguard";

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

        this.systems.push(new TransformSystem())

        this.systems.forEach((system) => {
            if (isAwake(system)) this.awakeSystems.push(system);
            if (isStart(system)) this.startSystems.push(system);
            if (isFixedUpdate(system)) this.fixedUpdateSystems.push(system);
            if (isUpdate(system)) this.updateSystems.push(system);
            if (isLateUpdate(system)) this.lateUpdateSystems.push(system);
        })

        this.initialize();

        this.loop();
    }

    private initialize(): void {
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
  