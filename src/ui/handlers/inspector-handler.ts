// export class InspectorHandler {
//     public static addComponent(name: string, isEnabled?: boolean, fields: string[]): string {
//         const open: string = `
//             <div class="flex-none"><i class="fa fa-chevron-up"></i></div> 
//             <div class="flex-none"><i class="fa fa-chevron-down"></i></div>
//         `

//         const icon: string = ''
//         const enabled: string = isEnabled === undefined ? '' : isEnabled ? `<input type="checkbox" checked />` : `<input type="checkbox" />`
//         const title: string = `<div class="w-full">${name}</div>`
//         const options: string = `<div class="flex-none"><i class="bi bi-list"></i></div>`
        
//         const variables: string[] = []
//         fields.forEach(field => {
//             variables.push(`
//             <div class="w-full flex">
//                 <div class="w-1/2">${field.name}</div>
//                 <div class="w-1/2">${field.value}</div>
//             </div>
//             `
//             )
//         })

//         return `
//             <div class="w-full flex flex-col">
//                 <div class="w-full flex">
//                     ${open}
//                     ${icon}
//                     ${enabled}
//                     ${title}
//                     ${options}
//                 </div>
//                 <div class="w-full flex flex-col">
//                     ${variables}
//                 </div>
//             </div>
//         `
//     }

//     public static removeComponent(): void {

//     }
// }