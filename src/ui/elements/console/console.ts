import { IObserver } from "../../../common/patterns/observer/observer";
import { ISubject } from "../../../common/patterns/observer/subject";

export class Console implements IObserver {
    private _container: HTMLElement;

    public constructor(container: HTMLElement) {
        this._container = container;
    }

    public onNotify(subject: ISubject, args?: string[]) {
        if (!args) return;
    
        const [type, message] = args;
        this.log(message, type);
    }

    public log(message: string, type: string = "LOG"): void {
        const logLine = document.createElement("p");
        logLine.textContent = message;
    
        switch (type) {
            case "WARNING":
                logLine.classList.add("log-warning");
                break;
            case "ERROR":
                logLine.classList.add("log-error");
                break;
            default:
                logLine.classList.add("log-log");
                break;
        }
    
        this._container.appendChild(logLine);
        this._container.scrollTop = this._container.scrollHeight;
    }
    

    public clear(): void {
        this._container.innerHTML = "";
    }
}