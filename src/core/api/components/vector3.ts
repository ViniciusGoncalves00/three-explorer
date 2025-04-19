export class Vector3 {
    constructor(
      public x: number = 0,
      public y: number = 0,
      public z: number = 0
    ) {}
  
    static zero(): Vector3 {
      return new Vector3(0, 0, 0);
    }
  
    static one(): Vector3 {
      return new Vector3(1, 1, 1);
    }
}