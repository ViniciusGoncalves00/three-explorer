export abstract class Component {
    public enabled: boolean = true;
    public abstract serialize(): Record<string, any>;
    public abstract deserialize(): Record<string, any>;
}