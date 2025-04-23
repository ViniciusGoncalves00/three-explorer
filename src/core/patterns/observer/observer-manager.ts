import { ISubject } from './subject';
import { IObserver } from './observer';
import { ConsoleLogger } from '../../api/console-logger';

export class ObserverManager implements ISubject {
    private observers: IObserver[] = [];

    public attach(observer: IObserver): void {
        if (this.observers.includes(observer)) {
            ConsoleLogger.getInstance().warn(ObserverManager.name, `Observer already attached.`);
            return;
        }
        this.observers.push(observer);
    }

    public dettach(observer: IObserver): void {
        const index = this.observers.indexOf(observer);
        if (index === -1) {
            ConsoleLogger.getInstance().warn(ObserverManager.name, `Observer not found.`);
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
