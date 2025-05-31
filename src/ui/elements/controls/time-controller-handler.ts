import { Time } from "../../../core/engine/time";
import { TimeController } from "../../../core/engine/time-controller";

export class TimeControllerHandler {
  private readonly timeController: TimeController;
  private readonly time: Time;

  private readonly play: HTMLElement;
  private readonly stop: HTMLElement;
  private readonly pause: HTMLElement;
  private readonly speedUp: HTMLElement;
  private readonly speedNormal: HTMLElement;
  private readonly speedDown: HTMLElement;

  public constructor(timeController: TimeController, time: Time, playButton: HTMLButtonElement, stopButton: HTMLButtonElement, pauseButton: HTMLButtonElement, speedUp: HTMLButtonElement, speedNormal: HTMLButtonElement, speedDown: HTMLButtonElement) {
    this.timeController = timeController;
    this.time = time;
    
    this.play = playButton;
    this.stop = stopButton;
    this.pause = pauseButton;
    
    this.speedUp = speedUp;
    this.speedNormal = speedNormal;
    this.speedDown = speedDown;

    this.play.addEventListener('click', () => timeController.start());
    this.stop.addEventListener('click', () => timeController.stop());
    this.pause.addEventListener('click', () =>  this.timeController.isPaused.value ? timeController.unpause() : timeController.pause());
    this.speedUp.addEventListener('click', () => time.globalTimeScale.value = 2);
    this.speedNormal.addEventListener('click', () => time.globalTimeScale.value = 1);
    this.speedDown.addEventListener('click', () => time.globalTimeScale.value = 0.5);

    this.timeController.isRunning.subscribe(value => {
      this.play.classList.toggle('border', value);
      this.play.classList.toggle('border-white', value);
    });

    this.timeController.isPaused.subscribe(value => {
      this.pause.classList.toggle("border", value)
      this.pause.classList.toggle("border-white", value)
    })

    this.speedNormal.classList.toggle('border');
    this.speedNormal.classList.toggle('border-white');

    this.time.globalTimeScale.subscribe(value => {
      this.speedDown.classList.toggle('border', value < 1);
      this.speedDown.classList.toggle('border-white', value < 1);

      this.speedNormal.classList.toggle('border', value === 1);
      this.speedNormal.classList.toggle('border-white', value === 1);

      this.speedUp.classList.toggle('border', value > 1);
      this.speedUp.classList.toggle('border-white', value > 1);
    })
  }
}