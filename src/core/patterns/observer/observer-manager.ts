import { ISubject } from './subject';
import { IObserver } from './observer';
import { ILogger } from '../logger/logger';
import { ConsoleLogger } from '../logger/console-logger';

export class ObserverManager implements ISubject {
    private observers: IObserver[] = [];
    private logger: ILogger;

    constructor(logger: ILogger = new ConsoleLogger()) {
        this.logger = logger;
    }

    public attach(observer: IObserver): void {
        if (this.observers.includes(observer)) {
            this.logger.warn(`Observer already attached.`);
            return;
        }
        this.observers.push(observer);
    }

    public dettach(observer: IObserver): void {
        const index = this.observers.indexOf(observer);
        if (index === -1) {
            this.logger.warn(`Observer not found.`);
            return;
        }
        this.observers.splice(index, 1);
    }

    public notify(args?: string[]): void {
        for (const observer of this.observers) {
            observer.onNotify(this, args);
        }
    }
}
