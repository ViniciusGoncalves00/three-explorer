import { Component } from "../../assets/components/component";
import { IAwake } from "../../assets/systems/interfaces/awake";
import { IFixedUpdate } from "../../assets/systems/interfaces/fixedUpdate";
import { ILateUpdate } from "../../assets/systems/interfaces/lateUpdate";
import { IStart } from "../../assets/systems/interfaces/start";
import { ISystem } from "../../assets/systems/interfaces/system";
import { IUpdate } from "../../assets/systems/interfaces/update";

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
export function isComponent(obj: any): obj is Component {
  return obj && typeof obj === 'object' && 'entity' in obj;
}