import { FolderNode } from "./folder-node";

export abstract class TreeNode {
    public name: string;
    public parent: FolderNode | null;

    public constructor(name: string, parent: FolderNode | null = null) {
        this.name = name;
        this.parent = parent;
    }

    public abstract isFolder(): boolean;
}