import { ISubject } from "./subject";

export interface IObserver {
    update(subject: ISubject, args?: string[]): any;
}