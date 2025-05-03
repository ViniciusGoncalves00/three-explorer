export class InputBuilder {
    public inputBoolean(bool: boolean): string {
        if(bool) return `<input type="checkbox" checked />`
        return `<input type="checkbox" />`
    }
}