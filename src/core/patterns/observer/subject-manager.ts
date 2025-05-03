import { ISubject } from './subject';
import { IObserver } from './observer';
import { ConsoleLogger } from '../../api/console-logger';

export class SubjectManager implements ISubject {
    private observers: IObserver[] = [];

    public attach(observer: IObserver): void {
        if (this.observers.includes(observer)) {
            ConsoleLogger.getInstance().warn(SubjectManager.name, `Observer already attached.`);
            return;
        }
        this.observers.push(observer);
    }

    public dettach(observer: IObserver): void {
        const index = this.observers.indexOf(observer);
        if (index === -1) {
            ConsoleLogger.getInstance().warn(SubjectManager.name, `Observer not found.`);
            return;
        }
        this.observers.splice(index, 1);
    }

    public notify(args?: string[]): void {
        this.observers.forEach(observer => observer.onNotify(this, args));
    }
}
