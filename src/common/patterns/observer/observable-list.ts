type ListChangeType = "add" | "remove" | "clear" | "update";

type ListObserver<T> = (type: ListChangeType, item: T, index?: number) => void;

export class ObservableList<T> {
    private _items: T[] = [];
    private _observers: ListObserver<T>[] = [];

    constructor(items: T[] = []) {
        this._items = items;
    }

    public get items(): T[] {
        return this._items;
    }

    public add(item: T): void {
        this._items.push(item);
        this.notify("add", item, this._items.length - 1);
    }

    public removeAt(index: number): void {
        const removed = this._items.splice(index, 1)[0];
        this.notify("remove", removed, index);
    }

    public clear(): void {
        this._items = [];
        this.notify("clear", null as any);
    }

    public onChange(observer: ListObserver<T>): void {
        this._observers.push(observer);
    }

    private notify(type: ListChangeType, item: T, index?: number): void {
        for (const observer of this._observers) {
            observer(type, item, index);
        }
    }
}
