import { ObservableField } from "../../common/patterns/observer/observable-field";

export class Vector3 {
  private readonly _x: ObservableField<number>;
  public get x(): ObservableField<number> { return this._x; }

  private readonly _y: ObservableField<number>;
  public get y(): ObservableField<number> { return this._y; }

  private readonly _z: ObservableField<number>;
  public get z(): ObservableField<number> { return this._z; }

  public constructor(x: number, y: number, z: number) {
    this._x =  new ObservableField<number>(x);
    this._y =  new ObservableField<number>(y);
    this._z =  new ObservableField<number>(z);
  }

  public static zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  public static one(): Vector3 {
    return new Vector3(1, 1, 1);
  }

  public set(x: number, y: number, z: number): void {
    this._x.value = x;
    this._y.value = y;
    this._z.value = z;
  }

  public setFromVector(vector: Vector3): void {
    this._x.value = vector.x.value;
    this._y.value = vector.y.value;
    this._z.value = vector.z.value;
  }

  public setAxis(axis: 'x' | 'y' | 'z', value: number): void {
    this[axis].value = value;
  }

  public add(vector: Vector3): Vector3 {
    return new Vector3(
      this._x.value + vector.x.value,
      this._y.value + vector.y.value,
      this._z.value + vector.z.value);
  }

  public subtract(vector: Vector3): Vector3 {
    return new Vector3(
      this._x.value - vector.x.value,
      this._y.value - vector.y.value,
      this._z.value - vector.z.value);
  }

  public multiplyScalar(scalar: number): Vector3 {
    return new Vector3(
      this._x.value * scalar,
      this._y.value * scalar,
      this._z.value * scalar);
  }

  public dot(vector: Vector3): number {
    return this._x.value * vector.x.value + this._y.value * vector.y.value + this._z.value * vector.z.value;
  }

  public cross(v: Vector3): Vector3 {
    return new Vector3(
      this._y.value * v.z.value - this._z.value * v.y.value,
      this._z.value * v.x.value - this._x.value * v.z.value,
      this._x.value * v.y.value - this._y.value * v.x.value);
  }

  public length(): number {
    return Math.sqrt(this._x.value ** 2 + this._y.value ** 2 + this._z.value ** 2);
  }

  public normalize(): Vector3 {
    const len = this.length();
    return len === 0 ? new Vector3(0, 0, 0) : this.multiplyScalar(1 / len);
  }

  public clone(): Vector3 {
    return new Vector3(this._x.value, this._y.value, this._z.value);
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