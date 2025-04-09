import { ILogger } from "./logger";

export class ConsoleLogger implements ILogger {
    log(message: string): void {
        console.log(message);
    }

    warn(message: string): void {
        console.warn(message);
    }

    error(message: string): void {
        console.error(message);
    }
}
