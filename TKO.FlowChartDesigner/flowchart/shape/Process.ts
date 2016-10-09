module flowchart.shape {

    export class Process extends ShapeBase {
        
        constructor(id: string, width, height, htmlText = "") {
            super(id, constants.ShapeType.Process, width, height, htmlText, "shape_process");
        }

        GetMetadataDiv():HTMLDivElement {

            var element: HTMLDivElement = document.createElement("div");
            element.classList.add(this.CssBackgroundClass);
            return element;
        }
    }
}