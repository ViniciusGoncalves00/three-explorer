import { ObservableField } from "../patterns/observer/observable-field";

export class Vector3 {
  private _x: ObservableField<number>;
  public get x(): ObservableField<number> { return this._x; }
  public set x(value: ObservableField<number>) {
    this._x = value;
    this._onChange?.();
  }

  private _y: ObservableField<number>;
  public get y(): ObservableField<number> { return this._y; }
  public set y(value: ObservableField<number>) {
    this._y = value;
    this._onChange?.();
  }

  private _z: ObservableField<number>;
  public get z(): ObservableField<number> { return this._z; }
  public set z(value: ObservableField<number>) {
    this._z = value;
    this._onChange?.();
  }

  private _onChange?: () => void;

  public constructor(x: ObservableField<number>, y: ObservableField<number>, z: ObservableField<number>, onChange?: () => void) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._onChange = onChange;
  }

  public static zero(): Vector3 {
    return new Vector3(new ObservableField<number>(0), new ObservableField<number>(0), new ObservableField<number>(0));
  }

  public static one(): Vector3 {
    return new Vector3(new ObservableField<number>(1), new ObservableField<number>(1), new ObservableField<number>(1));
  }

  public set(x: ObservableField<number>, y: ObservableField<number>, z: ObservableField<number>): void {
    this._x = x;
    this._y = y;
    this._z = z;
    this._onChange?.();
  }

  public setAxis(axis: 'x' | 'y' | 'z', value: number): void {
    this[axis].value = value;
  }

  public onChange(onChange: () => void): void {
    this._onChange = onChange;
  }

  public add(vector: Vector3): Vector3 {
    return new Vector3(
      new ObservableField(this._x.value + vector.x.value),
      new ObservableField(this._y.value + vector.y.value),
      new ObservableField(this._z.value + vector.z.value));
  }

  public subtract(vector: Vector3): Vector3 {
    return new Vector3(
      new ObservableField(this._x.value - vector.x.value),
      new ObservableField(this._y.value - vector.y.value),
      new ObservableField(this._z.value - vector.z.value));
  }

  public multiplyScalar(scalar: number): Vector3 {
    return new Vector3(
      new ObservableField(this._x.value * scalar),
      new ObservableField(this._y.value * scalar),
      new ObservableField(this._z.value * scalar));
  }

  public dot(vector: Vector3): number {
    return this._x.value * vector.x.value + this._y.value * vector.y.value + this._z.value * vector.z.value;
  }

  public cross(v: Vector3): Vector3 {
    return new Vector3(
      new ObservableField(this._y.value * v.z.value - this._z.value * v.y.value),
      new ObservableField(this._z.value * v.x.value - this._x.value * v.z.value),
      new ObservableField(this._x.value * v.y.value - this._y.value * v.x.value));
  }

  public length(): number {
    return Math.sqrt(this._x.value ** 2 + this._y.value ** 2 + this._z.value ** 2);
  }

  public normalize(): Vector3 {
    const len = this.length();
    return len === 0 ? new Vector3(new ObservableField<number>(0), new ObservableField<number>(0), new ObservableField<number>(0)) : this.multiplyScalar(1 / len);
  }

  public clone(): Vector3 {
    return new Vector3(this._x, this._y, this._z, this._onChange);
  }

  public rotateAround(axis: Vector3, angle: number): Vector3 {
    const u = axis.normalize();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const dot = this.dot(u);
    const cross = this.cross(u);

    const term1 = this.multiplyScalar(cos);
    const term2 = cross.multiplyScalar(sin);
    const term3 = u.multiplyScalar(dot * (1 - cos));

    return term1.add(term2).add(term3);
  }
}