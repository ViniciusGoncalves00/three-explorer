export class Time {
    private _deltaTime: number = 0;
    public get deltaTime(): number { return this._deltaTime; }

    private _lastTime: number = 0;
    public get lastTime(): number { return this._lastTime; }

    public frameRateMS = 16.666; // frame time delta (~60fps = 16.6ms)
    public globalTimeScale = 1;

    public update(): void {
        const now = performance.now();
        const deltaTime = (now - this.lastTime) / this.frameRateMS;
        this._deltaTime = deltaTime * this.globalTimeScale
        this._lastTime = now;
    }
}