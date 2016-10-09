module flowchart.shape {
    export class Terminal extends ShapeBase {

        constructor(id: string, width, height, metadata: shape.metadata.IShapeMetadata = null) {
            super(id, constants.ShapeType.Terminal, width, height, metadata, "shape_terminal");
        }


        //overridden
        GetMetadataDiv(): HTMLDivElement {

            var element: HTMLDivElement = document.createElement("div");
            element.classList.add(this.CssBackgroundClass);
            return element;
        }
        
    }
}