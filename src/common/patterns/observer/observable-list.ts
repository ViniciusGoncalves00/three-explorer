export class ObservableList<T> {
  private _items: T[] = [];
  public get items(): T[] {
    return [...this._items];
  }

  private _listeners: Set<(items: T[]) => void> = new Set();

  constructor(initialItems: T[] = []) {
    this._items = [...initialItems];
  }

  public subscribe(listener: (items: T[]) => void): void {
    this._listeners.add(listener);
  }

  public unsubscribe(listener: (items: T[]) => void): void {
    this._listeners.delete(listener);
  }

  private _notify(): void {
    const snapshot = [...this._items];
    this._listeners.forEach(listener => listener(snapshot));
  }

  public push(...newItems: T[]): number {
    const length = this._items.push(...newItems);
    this._notify();
    return length;
  }

  public pop(): T | undefined {
    const item = this._items.pop();
    this._notify();
    return item;
  }

  public splice(start: number, deleteCount?: number, ...items: T[]): T[] {
    const result = this._items.splice(start, deleteCount ?? this._items.length, ...items);
    this._notify();
    return result;
  }

  public removeAt(index: number): T | undefined {
    if (index < 0 || index >= this._items.length) return undefined;
    const [removed] = this._items.splice(index, 1);
    this._notify();
    return removed;
  }

  public clear(): void {
    this._items = [];
    this._notify();
  }

  public get length(): number {
    return this._items.length;
  }

  public at(index: number): T | undefined {
    return this._items[index];
  }

  public set(index: number, value: T): void {
    if (this._items[index] !== value) {
      this._items[index] = value;
      this._notify();
    }
  }

  public toArray(): T[] {
    return [...this._items];
  }
}
