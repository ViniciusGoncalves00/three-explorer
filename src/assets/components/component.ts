import { IObserver } from "../../common/patterns/observer/observer";

export abstract class Component {
    public enabled: boolean = true;
    public abstract clone(): Component;
    public abstract copyFrom(component: Component): void;

    private observers: IObserver[] = [];

    public attach(observer: IObserver): void {
        this.observers.push(observer);
      }
    
    public dettach(observer: IObserver): void {
      const index = this.observers.indexOf(observer);
      if (index === -1) return;
      this.observers.splice(index, 1);
    }
}