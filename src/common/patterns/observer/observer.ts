import { ISubject } from "./subject";

export interface IObserver {
    onNotify(subject: ISubject, args?: string[]): any;
}