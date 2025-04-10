export type ViewMode = "editor" | "run" | "split";

type ViewModeCallback = (mode: ViewMode) => void;

export class ViewModeController {
  private mode: ViewMode = "split";
  private listeners: Set<ViewModeCallback> = new Set();

  setMode(mode: ViewMode) {
    if (this.mode !== mode) {
      this.mode = mode;
      this.notify();
    }
  }

  toggleMode() {
    this.setMode(this.mode === "run" ? "editor" : "run");
  }

  getMode(): ViewMode {
    return this.mode;
  }

  onChange(callback: ViewModeCallback) {
    this.listeners.add(callback);
  }

  offChange(callback: ViewModeCallback) {
    this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.mode));
  }
}
