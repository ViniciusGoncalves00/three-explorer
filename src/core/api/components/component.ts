export abstract class Component {
    public enabled: boolean = true;
    public abstract clone(): Component;
}