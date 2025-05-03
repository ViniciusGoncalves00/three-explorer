import { ConsoleLogger } from "../api/console-logger";
import { SubjectManager } from "../patterns/observer/subject-manager";
import { ISubject } from "../patterns/observer/subject";

export class TimeController implements ISubject {
    private observerManager = new SubjectManager();

    private _isRunning: boolean = false;
    private _isPaused: boolean = false;

    public get isRunning(): boolean { return this._isRunning; }
    public get isPaused(): boolean { return this._isPaused; }

    public attach = this.observerManager.attach.bind(this.observerManager);
    public dettach = this.observerManager.dettach.bind(this.observerManager);
    public notify = this.observerManager.notify.bind(this.observerManager);

    public start(): void {
        if (this._isRunning || this._isPaused) return;

        this._isRunning = true;
        this._isPaused = false;
        this.notify(['Start']);
        ConsoleLogger.getInstance().log(TimeController.name, "Started.")
    }

    public stop(): void {
        if (!this._isRunning && !this._isPaused) return;

        this._isRunning = false;
        this._isPaused = false;
        this.notify(['Stop']);
        ConsoleLogger.getInstance().log(TimeController.name, "Stoped.")
    }

    public pause(): void {
        if (!this._isRunning || this._isPaused) return;

        this._isRunning = false;
        this._isPaused = true;
        this.notify(['Pause']);
        ConsoleLogger.getInstance().log(TimeController.name, "Paused.")
    }

    public unpause(): void {
        if (this._isRunning || !this._isPaused) return;

        this._isRunning = true;
        this._isPaused = false;
        this.notify(['Unpause']);
        ConsoleLogger.getInstance().log(TimeController.name, "Unpaused.")
    }
}