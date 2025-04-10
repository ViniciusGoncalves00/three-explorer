interface IObserver {
    update(subject: ISubject, args?: string[]): any;
}