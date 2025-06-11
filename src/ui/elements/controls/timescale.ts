import { Time } from "../../../core/engine/time";

export class Timescale {
  private readonly speedDown: number = 0.5; 
  private readonly speedNormal: number = 1; 
  private readonly speedUp: number = 2; 

  public constructor(time: Time, speedUpButton: HTMLButtonElement, speedNormalButton: HTMLButtonElement, speedDownButton: HTMLButtonElement) {
    speedUpButton.addEventListener('click', () => time.globalTimeScale.value = this.speedUp);
    speedNormalButton.addEventListener('click', () => time.globalTimeScale.value = this.speedNormal);
    speedDownButton.addEventListener('click', () => time.globalTimeScale.value = this.speedDown);

    speedNormalButton.classList.toggle('border');
    speedNormalButton.classList.toggle('border-white');

    time.globalTimeScale.subscribe(value => {
      speedDownButton.classList.toggle('border', value < 1);
      speedDownButton.classList.toggle('border-white', value < 1);

      speedNormalButton.classList.toggle('border', value === 1);
      speedNormalButton.classList.toggle('border-white', value === 1);

      speedUpButton.classList.toggle('border', value > 1);
      speedUpButton.classList.toggle('border-white', value > 1);
    })
  }
}