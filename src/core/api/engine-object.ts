export abstract class EngineObject {
    id: string;
    name: string;
    enabled: boolean = true;
    started: boolean = false;
    awakeCalled: boolean = false;
  
    constructor(name?: string) {
      this.id = crypto.randomUUID(); // ou outra geração de ID
      this.name = name ?? this.constructor.name;
    }
  
    /** Chamado uma vez logo após instanciar o objeto */
    awake(): void {}
  
    /** Chamado na primeira vez que a engine ativa esse objeto */
    start(): void {}
  
    /** Chamado a cada frame */
    update(deltaTime: number): void {}
  
    /** Serializa os dados relevantes do comportamento */
    serialize(): Record<string, any> {
      return {
        id: this.id,
        name: this.name,
        enabled: this.enabled,
        // você pode estender isso para incluir outros campos relevantes
      };
    }
  
    /** Permite ativar/desativar o objeto */
    setEnabled(value: boolean) {
      this.enabled = value;
    }
  
    /** Chamado internamente pela engine no primeiro frame */
    __internalUpdateLifecycle(deltaTime: number): void {
      if (!this.enabled) return;
  
      if (!this.awakeCalled) {
        this.awake();
        this.awakeCalled = true;
      }
  
      if (!this.started) {
        this.start();
        this.started = true;
      }
  
      this.update(deltaTime);
    }
  }
  