import { LogType } from "./enum/log-type";

export class Log {
    public readonly time: number;
    public readonly logType: LogType;
    public readonly message: string;

    public constructor(time: number, logType: LogType, message: string) {
        this.time = time;
        this.logType = logType;
        this.message = message;
    }
}