type Listener<K, V> = (map: Map<K, V>) => void;

export class ObservableMap<K, V> {
  private _map = new Map<K, V>();
  private _listeners = new Set<Listener<K, V>>();

  public set(key: K, value: V) {
    this._map.set(key, value);
    this.emit();
  }

  public get(key: K): V | undefined {
    return this._map.get(key);
  }

  public has(key: K): boolean {
    return this._map.has(key);
  }

  public delete(key: K): boolean {
    const result = this._map.delete(key);
    if (result) this.emit();
    return result;
  }

  public clear() {
    this._map.clear();
    this.emit();
  }

  public entries(): IterableIterator<[K, V]> {
    return this._map.entries();
  }

  public values(): IterableIterator<V> {
    return this._map.values();
  }

  public keys(): IterableIterator<K> {
    return this._map.keys();
  }

  public subscribe(listener: Listener<K, V>): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  private emit() {
    for (const listener of this._listeners) {
      listener(this._map);
    }
  }
}