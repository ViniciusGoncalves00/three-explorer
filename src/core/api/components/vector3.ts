export class Vector3 {
  private _x: number;
  public get x(): number { return this._x; }
  public set x(value: number) {
    this._x = value;
    this._owner?.();
  }

  private _y: number;
  public get y(): number { return this._y; }
  public set y(value: number) {
    this._y = value;
    this._owner?.();
  }

  private _z: number;
  public get z(): number { return this._z; }
  public set z(value: number) {
    this._z = value;
    this._owner?.();
  }

  private _owner?: () => void;

  public constructor(x: number, y: number, z: number, owner?: () => void) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._owner = owner;
  }

  public static zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  public static one(): Vector3 {
    return new Vector3(1, 1, 1);
  }

  public set(x: number, y: number, z: number): void {
    this._x = x;
    this._y = y;
    this._z = z;
    this._owner?.();
  }

  public setAxis(axis: 'x' | 'y' | 'z', value: number): void {
    this[axis] = value;
  }

  public setOwner(callback: () => void): void {
    this._owner = callback;
  }

  public add(v: Vector3): Vector3 {
    return new Vector3(this._x + v.x, this._y + v.y, this._z + v.z);
  }

  public subtract(v: Vector3): Vector3 {
    return new Vector3(this._x - v.x, this._y - v.y, this._z - v.z);
  }

  public multiplyScalar(scalar: number): Vector3 {
    return new Vector3(this._x * scalar, this._y * scalar, this._z * scalar);
  }

  public dot(v: Vector3): number {
    return this._x * v.x + this._y * v.y + this._z * v.z;
  }

  public cross(v: Vector3): Vector3 {
    return new Vector3(
      this._y * v.z - this._z * v.y,
      this._z * v.x - this._x * v.z,
      this._x * v.y - this._y * v.x
    );
  }

  public length(): number {
    return Math.sqrt(this._x ** 2 + this._y ** 2 + this._z ** 2);
  }

  public normalize(): Vector3 {
    const len = this.length();
    return len === 0 ? new Vector3(0, 0, 0) : this.multiplyScalar(1 / len);
  }

  public clone(): Vector3 {
    return new Vector3(this._x, this._y, this._z, this._owner);
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