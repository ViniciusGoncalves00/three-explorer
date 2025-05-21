import { IObserver } from "../../common/patterns/observer/observer";
import { ISubject } from "../../common/patterns/observer/subject";
import { SubjectManager } from "../../common/patterns/observer/subject-manager";

export class TimeController implements ISubject {
    private _subjectManager = new SubjectManager();

    private _isRunning: boolean = false;
    private _isPaused: boolean = false;

    public get isRunning(): boolean { return this._isRunning; }
    public get isPaused(): boolean { return this._isPaused; }

    public start(): void {
        if (this._isRunning || this._isPaused) return;

        this._isRunning = true;
        this._isPaused = false;
        this.notify(['Start']);
    }

    public stop(): void {
        if (!this._isRunning && !this._isPaused) return;

        this._isRunning = false;
        this._isPaused = false;
        this.notify(['Stop']);
    }

    public pause(): void {
        if (!this._isRunning || this._isPaused) return;

        this._isRunning = false;
        this._isPaused = true;
        this.notify(['Pause']);
    }

    public unpause(): void {
        if (this._isRunning || !this._isPaused) return;

        this._isRunning = true;
        this._isPaused = false;
        this.notify(['Unpause']);
    }

    public attach(observer: IObserver): void {
        this._subjectManager.attach(this, observer);
    }

    public dettach(observer: IObserver): void {
        this._subjectManager.dettach(this, observer);
    }

    public notify(args?: string[]): void {
        this._subjectManager.notify(this, args);
    }
}