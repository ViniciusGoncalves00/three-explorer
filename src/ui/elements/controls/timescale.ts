import { Time } from "../../../core/engine/time";

export class Timescale {
  private readonly time: Time;

  private readonly speedUp: HTMLElement;
  private readonly speedNormal: HTMLElement;
  private readonly speedDown: HTMLElement;

  private readonly slowSpeed: number = 0.5; 
  private readonly normalSpeed: number = 1; 
  private readonly highSpeed: number = 2; 

  public constructor(time: Time, speedUp: HTMLButtonElement, speedNormal: HTMLButtonElement, speedDown: HTMLButtonElement) {
    this.time = time;
    
    this.speedUp = speedUp;
    this.speedNormal = speedNormal;
    this.speedDown = speedDown;

    this.speedUp.addEventListener('click', () => time.globalTimeScale.value = this.highSpeed);
    this.speedNormal.addEventListener('click', () => time.globalTimeScale.value = this.normalSpeed);
    this.speedDown.addEventListener('click', () => time.globalTimeScale.value = this.slowSpeed);

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