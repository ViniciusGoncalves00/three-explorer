import { IAwake } from "../api/systems/interfaces/awake";
import { IFixedUpdate } from "../api/systems/interfaces/fixedUpdate";
import { ILateUpdate } from "../api/systems/interfaces/lateUpdate";
import { IStart } from "../api/systems/interfaces/start";
import { ISystem } from "../api/systems/interfaces/system";
import { IUpdate } from "../api/systems/interfaces/update";

export function isIAwake(system: ISystem): system is IAwake {
    return 'awake' in system;
}
export function isIStart(system: ISystem): system is IStart {
  return 'start' in system;
}
export function isIFixedUpdate(system: ISystem): system is IFixedUpdate {
  return 'fixedUpdate' in system;
}
export function isIUpdate(system: ISystem): system is IUpdate {
  return 'update' in system;
}
export function isILateUpdate(system: ISystem): system is ILateUpdate {
  return 'lateUpdate' in system;
}