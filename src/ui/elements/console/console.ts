import { ObservableList } from "../../../common/patterns/observer/observable-list";
import { LogType } from "../../../core/api/enum/log-type";
import { Log } from "../../../core/api/log";

export class Console{
    private readonly _container: HTMLElement;
    public readonly logs: ObservableList<Log> = new ObservableList();

    public constructor(container: HTMLElement) {
        this._container = container;
    }

    public log(logType: LogType, message: string) {
        const log = new Log(Date.now(), logType, message);
        this.logs.add(log)

        const logLine = document.createElement("p");
        logLine.textContent = this.format(log);
    
        switch (logType) {
            case LogType.Success:
                logLine.classList.add("log-success");
                break;
            case LogType.Warning:
                logLine.classList.add("log-warning");
                break;
            case LogType.Error:
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

    public filter(): void {

    }

    private format(log: Log): string {
        const time = new Date(log.time).toLocaleTimeString();
        const type = LogType[log.logType];
        return `[${time}] [${type}] ${log.message}`;
    }
}