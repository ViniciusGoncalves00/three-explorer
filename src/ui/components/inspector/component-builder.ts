import { Mesh } from "../../../assets/components/mesh";
import { ObservableField } from "../../../common/patterns/observer/observable-field";
import { Vector3 } from "../../../core/api/vector3";
import { FieldBuilder } from "../field-builder";

export class PropertyBuilder {
    public static buildNumberProperty(property: ObservableField<number>, field: HTMLElement): void {
        const input = FieldBuilder.buildNumberField(property)
        field.appendChild(input);
    }

    public static buildStringProperty(property: ObservableField<string>, field: HTMLElement): void {
        const input = FieldBuilder.buildStringField(property)
        field.appendChild(input);
    }

    public static buildVector3Property(property: Vector3, field: HTMLElement): void {
        field.classList.add('gap-1');

        for (const axis of ['x', 'y', 'z'] as const) {
            const axisWrapper = document.createElement('div');
            axisWrapper.className = "w-1/3 flex";

            const axisName = document.createElement('div');
            axisWrapper.appendChild(axisName);
            axisName.textContent = axis;
            axisName.className = 'w-6 flex-none text-center';

            const input = FieldBuilder.buildNumberField(property[axis])
            field.appendChild(input);
        }
    }

    public static async buildMeshProperty(property: ObservableField<Mesh>, field: HTMLElement): Promise<void> {
        const input = await FieldBuilder.buildMeshField(property);
        field.appendChild(input);
    }

    public static buildArrayVector3Property(property: Vector3[], field: HTMLElement): void {
        field.classList.add("flex-col")
        const empty = document.createElement('div');
        empty.className = "h-5"
        field.appendChild(empty);

        property.forEach((vector: Vector3, index: number) => {
            const vectorWrapper = document.createElement('div');
            vectorWrapper.className = 'w-full flex gap-1';
        
            const title = document.createElement('div');
            title.textContent = `${index}`;
            title.className = 'w-1/10 text-sm text-center';
            vectorWrapper.appendChild(title);
        
            const vectorRow = document.createElement('div');
            vectorRow.className = 'w-full flex gap-1';
        
            for (const axis of ['x', 'y', 'z'] as const) {
                const axisWrapper = document.createElement('div');
                axisWrapper.className = "w-9/10 flex items-center gap-1";
            
                const axisName = document.createElement('div');
                axisName.textContent = axis;
                axisName.className = 'w-6 text-xs text-center';
                axisWrapper.appendChild(axisName);
            
                const input = FieldBuilder.buildNumberField(vector[axis]);
                axisWrapper.appendChild(input);
            
                vectorRow.appendChild(axisWrapper);
            }
        
            vectorWrapper.appendChild(vectorRow);
            field.appendChild(vectorWrapper);
        });
    }

    public static buildArrayNumberProperty(property: ObservableField<number>[], field: HTMLElement): void {
        field.classList.add("flex-col", "gap-1");
        const empty = document.createElement('div');
        empty.className = "h-5"
        field.appendChild(empty);
    
        property.forEach((observable, index) => {
            const row = document.createElement('div');
            row.className = 'w-full flex items-center gap-2';
        
            const label = document.createElement('div');
            label.textContent = `${index}`;
            label.className = 'w-1/10 text-sm text-center';
            row.appendChild(label);
        
            const input = FieldBuilder.buildNumberField(observable);
            input.classList.add('w-9/10');
            row.appendChild(input);
        
            field.appendChild(row);
        });
    }
}