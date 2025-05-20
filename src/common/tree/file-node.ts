import { FolderNode } from "./folder-node";
import { TreeNode } from "./tree-node";

export class FileNode<T> extends TreeNode {
    public content: T;

    public constructor(name: string, content: T, parent: FolderNode | null = null) {
        super(name, parent);

        this.content = content;
    }

    public isFolder(): boolean {
        return false;
    }
}