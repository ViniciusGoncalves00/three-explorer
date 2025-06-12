import { Component } from "./component";
import { ObservableField } from "../../common/patterns/observer/observable-field";

export class Shake extends Component {
  private readonly _intensity: ObservableField<number>;
  private readonly _duration: ObservableField<number>;
  private _elapsed: number = 0;

  private _originalPositionX: number | null = null;
  private _originalPositionY: number | null = null;
  private _originalPositionZ: number | null = null;

  public get intensity(): ObservableField<number> { return this._intensity; }
  public get duration(): ObservableField<number> { return this._duration; }
  public get elapsed(): number { return this._elapsed; }

  public set elapsed(value: number) {
    this._elapsed = value;
  }

  public constructor(
    intensity: ObservableField<number> = new ObservableField(0.1),
    duration: ObservableField<number> = new ObservableField(0.5)
  ) {
    super();
    this._intensity = intensity;
    this._duration = duration;
  }

  public reset(): void {
    this._elapsed = 0;
    this._originalPositionX = null;
    this._originalPositionY = null;
    this._originalPositionZ = null;
  }

  public storeOriginalPosition(x: number, y: number, z: number): void {
    this._originalPositionX = x;
    this._originalPositionY = y;
    this._originalPositionZ = z;
  }

  public hasOriginalPosition(): boolean {
    return (
      this._originalPositionX !== null &&
      this._originalPositionY !== null &&
      this._originalPositionZ !== null
    );
  }

  public getOriginalPosition(): [number, number, number] {
    return [
      this._originalPositionX ?? 0,
      this._originalPositionY ?? 0,
      this._originalPositionZ ?? 0
    ];
  }

  public clone(): Shake {
    const clone = new Shake(this._intensity, this._duration);
    clone.enabled = this.enabled;
    return clone;
  }

  public copyFrom(other: Shake): void {
    this._intensity.value = other._intensity.value;
    this._duration.value = other._duration.value;
    this.reset();
  }

  public destroy(): void {}
}
