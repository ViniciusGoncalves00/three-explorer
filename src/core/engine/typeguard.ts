import { IAwake } from "../api/systems/interfaces/awake";
import { IFixedUpdate } from "../api/systems/interfaces/fixedUpdate";
import { ILateUpdate } from "../api/systems/interfaces/lateUpdate";
import { IStart } from "../api/systems/interfaces/start";
import { IUpdate } from "../api/systems/interfaces/update";

export function isAwake(system: ISystem): system is IAwake {
    return 'awake' in system;
}
export function isStart(system: ISystem): system is IStart {
  return 'start' in system;
}
export function isFixedUpdate(system: ISystem): system is IFixedUpdate {
  return 'fixedUpdate' in system;
}
export function isUpdate(system: ISystem): system is IUpdate {
  return 'update' in system;
}
export function isLateUpdate(system: ISystem): system is ILateUpdate {
  return 'lateUpdate' in system;
}