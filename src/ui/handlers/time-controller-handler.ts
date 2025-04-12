import { TimeController } from "../../core/engine/time-controller";
import { IObserver } from "../../core/patterns/observer/observer";
import { ISubject } from "../../core/patterns/observer/subject";

export class TimeControllerHandler implements IObserver {
    private readonly play: HTMLElement;
    private readonly pause: HTMLElement;
    private readonly stop: HTMLElement;

  constructor(document: Document, timeController: TimeController) {
    this.play = document.getElementById('play')!;
    this.pause = document.getElementById('pause')!;
    this.stop = document.getElementById('stop')!;

    this.play.addEventListener('click', () => timeController.start());
    this.pause.addEventListener('click', () => timeController.pause());
    this.stop.addEventListener('click', () => timeController.stop());
    }

    public onNotify(subject: ISubject, args?: string[]) {
        if(subject instanceof TimeController) {
            if(!args) return;
            if (args.includes('Start')) {
                this.play.style.display = 'none';
                this.pause.style.display = 'flex';
                this.pause.style.display = 'none';
              }
              if (args.includes('Pause')) {
                this.play.style.display = 'flex';
                this.pause.style.display = 'none';
              }
              if (args.includes('Unpause')) {
                this.play.style.display = 'none';
                this.pause.style.display = 'flex';
              }
              if (args.includes('Stop')) {
                this.play.style.display = 'flex';
                this.pause.style.display = 'none';
              }
            };
        }
}