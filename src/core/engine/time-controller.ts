import { ObservableField } from "../../common/patterns/observer/observable-field";

export class TimeController {
    public readonly isRunning: ObservableField<boolean> = new ObservableField(false);
    public readonly isPaused: ObservableField<boolean> = new ObservableField(false);

    public start(): void {
        if (this.isRunning.value || this.isPaused.value) return;
        this.isRunning.value = true;
    }

    public stop(): void {
        if (!this.isRunning.value && !this.isPaused.value) return;
        this.isRunning.value = false;
    }

    public pause(): void {
        if (!this.isRunning.value || this.isPaused.value) return;
        this.isPaused.value = true;
    }

    public unpause(): void {
        if (this.isRunning.value || !this.isPaused.value) return;
        this.isPaused.value = false;
    }
}