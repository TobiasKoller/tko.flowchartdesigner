module flowchart.shape {
    export class Decision extends ShapeBase {
        
        constructor(id: string, width, height, metadata: shape.metadata.IShapeMetadata=null) {
            super(id, constants.ShapeType.Decision, width, height, metadata, "shape_decision");
        }
        
        //overridden
        GetMetadataDiv(): HTMLDivElement {

            var element: HTMLDivElement = document.createElement("div");

            
            //bei 100px ist dies ideal. width: 70px; height: 70px; margin - left: 15px; margin - top:15px
            //bei anderen nicht..muss berechnet wereden.
            element.classList.add(this.CssBackgroundClass);
            element.style.width = (this.Width*0.7)+"px";
            element.style.height = (this.Height * 0.7) + "px";

            element.style.marginLeft = (this.Width * 0.49) + "px";
            element.style.marginTop = (this.Height * 0.29) + "px";

            return element;
        }
    }
}