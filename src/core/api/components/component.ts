import { IObserver } from "../../patterns/observer/observer";
import { ISubject } from "../../patterns/observer/subject";
import { SubjectManager } from "../../patterns/observer/subject-manager";

export abstract class Component implements ISubject {
    public enabled: boolean = true;
    public abstract clone(): Component;

    private observers: IObserver[] = [];

    public attach(observer: IObserver): void {
        this.observers.push(observer);
      }
    
      public dettach(observer: IObserver): void {
        const index = this.observers.indexOf(observer);
        if (index === -1) return;
        this.observers.splice(index, 1);
      }
    
      public notify(args?: string[]): void {
        this.observers.forEach(observer => observer.onNotify(this, args));
      }
}