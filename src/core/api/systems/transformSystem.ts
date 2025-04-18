import { Transform } from "../components/transform";

export class TransformSystem implements ISystem {
    public clone(transform: Transform): Transform {
        return {
            position: { ...transform.position },
            rotation: { ...transform.rotation },
            scale: { ...transform.scale },
        };
    }

    public copy(from: Transform, to: Transform): void {
        to.position = { ...from.position };
        to.rotation = { ...from.rotation };
        to.scale = { ...from.scale };
    }
}