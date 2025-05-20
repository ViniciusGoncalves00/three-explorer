import { mesh } from "./types";

export class PrefabMesh {
    public static quad(): mesh {
        const vertices = new Float32Array( [
            -0.5, 0.0, -0.5,
             0.5, 0.0, -0.5,
            -0.5, 0.0,  0.5,
             0.5, 0.0,  0.5,
        ] );

        const indices = new Int32Array([
            0, 1, 2,
            3, 2, 1,
        ]);

        return { vertices, indices };
    }

    public static cube(): mesh {
        const vertices = new Float32Array( [
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
        
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0, -1.0,  1.0
        ] );

        const indices =  new Int32Array([
            0, 1, 2,
            2, 3, 0,
        ]);

        return { vertices, indices };
    }
}