import { SubjectManager } from "../patterns/observer/subject-manager";
import { ISubject } from "../patterns/observer/subject";

export class ConsoleLogger implements ISubject {
    private static _instance: ConsoleLogger;

    private observerManager = new SubjectManager();

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

    public log(className: string, message: string): void {
        this._message = this.format("LOG", className, message);
        this.notify(["LOG", this._message]);
    }

    public warn(className: string, message: string): void {
        this._message = this.format("WARNING", className, message);
        this.notify(["WARNING", this._message]);
    }

    public error(className: string, message: string): void {
        this._message = this.format("ERROR", className, message);
        this.notify(["ERROR", this._message]);
    }

    private format(type: string, className: string, message: string): string {
        return `[${new Date().toLocaleTimeString()}] [${type}] [${className}]: ${message}`;
    }
}
