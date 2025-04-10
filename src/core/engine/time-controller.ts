import { BaseSubject } from "../base-subject";

export class TimeController extends BaseSubject implements ISubject
{
    private _isRunning : boolean = false;
    public get isRunning(): boolean { return this._isRunning; }

    private _isPaused : boolean = false;
    public get isPaused(): boolean { return this._isPaused; }

    public start(): void {
        this._isRunning = true;
        this._isPaused = false;
        this.notify(['Start']);
    }

    public stop(): void {
        this._isRunning = false;
        this._isPaused = false;
        this.notify(['Stop']);
    }

    public pause(): void {
        this._isRunning = false;
        this._isPaused = true;
        this.notify(['Pause']);
    }

    public unpause(): void {
        this._isRunning = true;
        this._isPaused = false;
        this.notify(['Unpause']);
    }
}