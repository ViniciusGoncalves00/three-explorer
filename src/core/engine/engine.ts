import { IUpdatable } from "../api/iupdatable";
import { Time } from "./time";
import { TimeController } from "./time-controller";

export class Engine {
    private _time: Time;
    private _timeController: TimeController;
    public get timeController(): TimeController { return this._timeController };

    private _updatables: IUpdatable[] = [];

    public constructor() {
        this._time = new Time();
        this._timeController = new TimeController();

        requestAnimationFrame(this.loop);
    }

    public addUpdatable(updatable: IUpdatable) {
        this._updatables.push(updatable);
    }
  
    private loop = () => {
        this._time.update();
        
        this._updatables.forEach((updatable) => {
            updatable.update(this._time.deltaTime)
        });
  
      requestAnimationFrame(this.loop);
    }
  }
  