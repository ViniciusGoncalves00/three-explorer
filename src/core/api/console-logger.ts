import { ObserverManager } from "../patterns/observer/observer-manager";
import { ISubject } from "../patterns/observer/subject";

export class ConsoleLogger implements ISubject {
    private static _instance: ConsoleLogger;

    private observerManager = new ObserverManager();

    public attach = this.observerManager.attach.bind(this.observerManager);
    public dettach = this.observerManager.dettach.bind(this.observerManager);
    public notify = this.observerManager.notify.bind(this.observerManager);
    
    private _message: string = "";

    private constructor() {};

    public static getInstance(): ConsoleLogger {
        if(!this._instance) {
            this._instance = new ConsoleLogger();
        }
        return this._instance;
    }

    public log(font: string, message: string): void {
        this._message = this.format("LOG", font, message);
        this.notify(["LOG", this._message]);
    }

    public warn(font: string, message: string): void {
        this._message = this.format("WARNING", font, message);
        this.notify(["WARNING", this._message]);
    }

    public error(font: string, message: string): void {
        this._message = this.format("ERROR", font, message);
        this.notify(["ERROR", this._message]);
    }

    private format(type: string, font: string, message: string): string {
        return `[${new Date().toLocaleTimeString()}] [${type}] [${font}]: ${message}`;
    }
}
