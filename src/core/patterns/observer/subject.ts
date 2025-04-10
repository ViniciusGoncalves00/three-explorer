import { IObserver } from "./observer";

export interface ISubject {
    attach(observer: IObserver): void;
    dettach(observer: IObserver): void;
    notify(args?: string[]): void;
}