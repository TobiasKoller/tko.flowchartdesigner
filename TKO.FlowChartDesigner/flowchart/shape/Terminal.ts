module flowchart.shape {
    export class Terminal extends ShapeBase {

        constructor(id: string, width, height, htmlText: string) {
            super(id, constants.ShapeType.Terminal, width, height, htmlText, "shape_terminal");
        }


        //overridden
        GetMetadataDiv(): HTMLDivElement {

            var element: HTMLDivElement = document.createElement("div");
            element.classList.add(this.CssBackgroundClass);
            return element;
        }
        
    }
}