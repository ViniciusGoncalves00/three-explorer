import { Base } from './base';
import { IObserver } from '../patterns/observer/observer';
import { ISubject } from '../patterns/observer/subject';
import { ILogger } from '../patterns/logger/logger';
import { ConsoleLogger } from '../patterns/logger/console-logger';

export abstract class BaseSubject extends Base implements ISubject {
    private observers: IObserver[] = [];
    protected logger: ILogger;

    constructor(logger: ILogger = new ConsoleLogger()) {
        super();

        this.logger = logger;
    }

    public attach(observer: IObserver): void {
        if (this.observers.includes(observer)) {
            this.logger.warn(`${this.constructor.name}: Observer already attached.`);
            return;
        }
        this.observers.push(observer);
    }

    public dettach(observer: IObserver): void {
        const index = this.observers.indexOf(observer);
        if (index === -1) {
            this.logger.warn(`${this.constructor.name}: Observer not found.`);
            return;
        }
        this.observers.splice(index, 1);
    }

    public notify(args?: string[]): void {
        for (const observer of this.observers) {
            observer.update(this, args);
        }
    }
}
