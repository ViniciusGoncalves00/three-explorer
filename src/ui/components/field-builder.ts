import { Mesh } from "../../assets/components/mesh";
import { ObservableField } from "../../common/patterns/observer/observable-field";

export class FieldBuilder {
    public static buildNumberField(observablefield: ObservableField<number>): HTMLElement {
        const field = document.createElement("input");
        field.type = "number";
        field.step = "0.1";
        field.className = "w-full text-xs px-1 py-0.5 border border-gray-300 rounded";

        observablefield.subscribe(value => field.value = value.toString());

        field.oninput = () => {
          const value = parseFloat(field.value);
          if (!isNaN(value)) {
            observablefield.value = value;
          }
        };

        field.value = observablefield.value.toString();
        return field;
    }

    public static buildStringField(observablefield: ObservableField<string>): HTMLElement {
        const field = document.createElement("input");
        field.type = "text";
        field.step = "0.1";
        field.className = "w-full text-xs px-1 py-0.5 border border-gray-300 rounded";

        observablefield.subscribe((value: any) => field.value = value.toString());

        // field.oninput = () => {
        //   const value = parseFloat(field.value);
        //   if (!isNaN(value)) {
        //     observablefield.value = value;
        //   }
        // };

        field.value = observablefield.value.toString();
        return field;
    }

    public static async buildMeshField(observablefield: ObservableField<Mesh>): Promise<HTMLElement> {
        const container = document.createElement("div");

        const select = document.createElement("select");
        select.className = "w-full text-xs px-1 py-0.5 border border-gray-300 rounded";
        container.appendChild(select);

        const placeholderOption = document.createElement("option");
        placeholderOption.textContent = "-- mesh (none) --";
        placeholderOption.value = "";
        select.appendChild(placeholderOption);

        const meshFiles = await FieldBuilder.listMeshFiles("/assets/objects");

        const meshMap = new Map<string, Mesh>();

        for (const file of meshFiles) {
            const mesh = await FieldBuilder.loadMesh(file);
            meshMap.set(file, mesh);

            const option = document.createElement("option");
            option.textContent = "TEST NAME";
            // option.textContent = mesh.name;
            option.value = file;
            select.appendChild(option);

            // if (observablefield.value?.name === mesh.name) {
            //     select.value = file;
            // }
        }

        select.onchange = () => {
            const selectedPath = select.value;
            if (selectedPath === "") {
                observablefield.value = null!;
            } else {
                const selectedMesh = meshMap.get(selectedPath);
                if (selectedMesh) {
                    observablefield.value = selectedMesh;
                }
            }
        };

        observablefield.subscribe((mesh: Mesh) => {
            if (!mesh) {
                select.value = "";
            } else {
                // const selectedEntry = Array.from(meshMap.entries()).find(([, m]) => m.name === mesh.name);
                // select.value = selectedEntry?.[0] ?? "";
            }
        });

        return container;
    }

    private static async listMeshFiles(path: string): Promise<string[]> {
        const res = await fetch(`${path}/index.json`);
        const files: string[] = await res.json();
        return files.map(f => `${path}/${f}`);
    }

    private static async loadMesh(path: string): Promise<Mesh> {
        const res = await fetch(path);
        return await res.json() as Mesh;
    }
}