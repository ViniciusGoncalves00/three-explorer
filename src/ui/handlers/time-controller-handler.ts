import { TimeController } from "../../core/engine/time-controller";
import { IObserver } from "../../core/patterns/observer/observer";
import { ISubject } from "../../core/patterns/observer/subject";

export class TimeControllerHandler implements IObserver {
  private readonly play: HTMLElement | null;
  private readonly pause: HTMLElement | null;
  private readonly stop: HTMLElement | null;

  constructor(document: Document, timeController: TimeController) {
    this.play = document.getElementById('play');
    this.pause = document.getElementById('pause');
    this.stop = document.getElementById('stop');

    if (!this.play) console.warn('[UI] Element with ID "play" not founded.');
    if (!this.pause) console.warn('[UI] Element with ID "pause" not founded.');
    if (!this.stop) console.warn('[UI] Element with ID "stop" not founded.');

    this.play?.addEventListener('click', () => timeController.start());
    this.pause?.addEventListener('click', () => timeController.pause());
    this.stop?.addEventListener('click', () => timeController.stop());
    }

    public onNotify(subject: ISubject, args?: string[]) {
      if (!(subject instanceof TimeController)) return;
      if (!args) return;

      if (args.includes('Start')) {
          this.play?.style && (this.play.style.display = 'none');
          this.pause?.style && (this.pause.style.display = 'flex');
      }
      if (args.includes('Pause')) {
          this.play?.style && (this.play.style.display = 'flex');
          this.pause?.style && (this.pause.style.display = 'none');
      }
      if (args.includes('Unpause')) {
          this.play?.style && (this.play.style.display = 'none');
          this.pause?.style && (this.pause.style.display = 'flex');
      }
      if (args.includes('Stop')) {
          this.play?.style && (this.play.style.display = 'flex');
          this.pause?.style && (this.pause.style.display = 'none');
      }
  }
}