import { TimeController } from "../../../core/engine/time-controller";

export class TimeControllerHandler {
  private readonly timeController: TimeController;

  private readonly play: HTMLElement;
  private readonly stop: HTMLElement;
  private readonly pause: HTMLElement;

  public constructor(timeController: TimeController, playButton: HTMLButtonElement, stopButton: HTMLButtonElement, pauseButton: HTMLButtonElement) {
    this.timeController = timeController;
    
    this.play = playButton;
    this.stop = stopButton;
    this.pause = pauseButton;

    this.play.addEventListener('click', () => timeController.start());
    this.stop.addEventListener('click', () => timeController.stop());
    this.pause.addEventListener('click', () => {
      this.timeController.isPaused.value ? timeController.unpause() : timeController.pause();
    });

    this.timeController.isRunning.subscribe(value => {
      this.play.classList.toggle('border', value);
      this.play.classList.toggle('border-white', value);
    });

    this.timeController.isPaused.subscribe(value => {
      this.pause.classList.toggle("border", value)
      this.pause.classList.toggle("border-white", value)
    })
  }
}