import { IObserver } from './observer';
import { ConsoleLogger } from '../../api/console-logger';
import { ISubject } from './subject';

export class SubjectManager {
    private observers: IObserver[] = [];

    public attach(subject: ISubject, observer: IObserver): void {
        if (this.observers.includes(observer)) {
            const subjectName: string = subject.constructor.name.toUpperCase();
            const observerName: string = observer.constructor.name.toUpperCase();
            ConsoleLogger.getInstance().warn(`Observer [${observerName}] already attached in subject [${subjectName}].`);
            return;
        }
        this.observers.push(observer);
    }

    public dettach(subject: ISubject, observer: IObserver): void {
        const index = this.observers.indexOf(observer);
        if (index === -1) {
            const subjectName: string = subject.constructor.name.toUpperCase();
            const observerName: string = observer.constructor.name.toUpperCase();
            ConsoleLogger.getInstance().warn(`Observer [${observerName}] not found in subject [${subjectName}].`);
            return;
        }
        this.observers.splice(index, 1);
    }

    public notify(subject: ISubject, args?: string[]): void {
        this.observers.forEach(observer => observer.onNotify(subject, args));
    }
}
