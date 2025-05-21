import { IObserver } from "../../common/patterns/observer/observer";
import { ISubject } from "../../common/patterns/observer/subject";
import { SubjectManager } from "../../common/patterns/observer/subject-manager";


export class ConsoleLogger implements ISubject, IObserver {
    private static _instance: ConsoleLogger;

    private _subjectManager = new SubjectManager();

    private _message: string = "";

    private constructor() {};

    public static getInstance(): ConsoleLogger {
        if(!this._instance) {
            this._instance = new ConsoleLogger();
        }
        return this._instance;
    }

    public log(message: string): void {
        this._message = this.format("LOG", message);
        this.notify(["LOG", this._message]);
    }

    public warn(message: string): void {
        this._message = this.format("WARNING", message);
        this.notify(["WARNING", this._message]);
    }

    public error(message: string): void {
        this._message = this.format("ERROR", message);
        this.notify(["ERROR", this._message]);
    }

    private format(logType: string, message: string): string {
        return `[${new Date().toLocaleTimeString()}] [${logType}] ${message}`;
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

    public onNotify(subject: ISubject, args?: string[]) {
        if(!args) return;

        switch (args[0]) {
            case "Start":
                this.log("Started.")
                break;
            case "Stop":
                this.log("Stoped.")
                break;
            case "Pause":
                this.log("Paused.")
                break;
            case "Unpause":
                this.log("Unpaused.")
                break;
            default:
                break;
        }
    }
    
}
