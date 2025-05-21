function makeObservable<T extends object>(target: T, notify: () => void): T {
  return new Proxy(target, {
    set(obj, prop, value) {
      const result = Reflect.set(obj, prop, value);
      notify();
      return result;
    },
    get(obj, prop) {
      const val = Reflect.get(obj, prop);
      if (val && typeof val === 'object') {
        return makeObservable(val, notify);
      }
      return val;
    }
  });
}
