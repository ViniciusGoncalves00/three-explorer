import { IObserver } from "../../common/patterns/observer/observer";
import { ISubject } from "../../common/patterns/observer/subject";
import { TimeController } from "../../core/engine/time-controller";

export class TimeControllerHandler implements IObserver {
  private readonly play: HTMLElement | null;
  private readonly pause: HTMLElement | null;
  private readonly stop: HTMLElement | null;

  constructor(document: Document, timeController: TimeController) {
    this.play = document.getElementById('play');
    this.pause = document.getElementById('pause');
    this.stop = document.getElementById('stop');

    if (!this.play) console.warn('[UI] Element with ID "play" not found.');
    if (!this.pause) console.warn('[UI] Element with ID "pause" not found.');
    if (!this.stop) console.warn('[UI] Element with ID "stop" not found.');

    this.play?.addEventListener('click', () => timeController.start());
    this.pause?.addEventListener('click', () => timeController.pause());
    this.stop?.addEventListener('click', () => timeController.stop());
    }

    public onNotify(subject: ISubject, args?: string[]) {
      if (!(subject instanceof TimeController)) return;
      if (!args) return;

      if (args.includes('Start')) {
        this.play?.classList.add('btn--actived');
      }
      if (args.includes('Pause')) {
        this.play?.classList.remove('btn--actived');
      }
      if (args.includes('Unpause')) {
        this.play?.classList.add('btn--actived');
      }
      if (args.includes('Stop')) {
        this.play?.classList.remove('btn--actived');
      }
  }
}