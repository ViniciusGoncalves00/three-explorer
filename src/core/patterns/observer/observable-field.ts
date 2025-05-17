export class ObservableField<T> {
  private _value: T;
  private _listeners: Set<(val: T) => void> = new Set();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (newValue === this._value) return;

    this._value = newValue;
    this._listeners.forEach(listener => listener(newValue));
  }

  public subscribe(listener: (val: T) => void): void {
    this._listeners.add(listener);
  }

  public unsubscribe(listener: (val: T) => void): void {
    this._listeners.delete(listener);
  }
}
