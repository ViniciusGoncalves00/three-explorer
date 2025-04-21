export class Vector3 {
  constructor(public x: number, public y: number, public z: number) {}

  static zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  static one(): Vector3 {
    return new Vector3(1, 1, 1);
  }

  public add(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  public subtract(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  public multiplyScalar(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  public dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  public cross(v: Vector3): Vector3 {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  public normalize(): Vector3 {
    const len = this.length();
    if (len === 0) return new Vector3(0, 0, 0);
    return this.multiplyScalar(1 / len);
  }

  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
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
