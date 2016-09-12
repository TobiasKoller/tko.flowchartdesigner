module flowchart.shape {

    export class Process extends ShapeBase {
        
        constructor(id: string, width, height, metadata: shape.metadata.IShapeMetadata=null) {
            super(id, constants.ShapeType.Process, width, height, metadata, "shape_process");
        }
        
        DrawShape(paper: RaphaelPaper, posX:number, posY:number): RaphaelElement {
            var element = paper.rect(posX, posY , this.Width, this.Height);
            element.attr(this.RaphaelAttr);
            return element;
        }

        GetMetadataDiv():HTMLDivElement {

            var element: HTMLDivElement = document.createElement("div");
            element.classList.add(this.CssBackgroundClass);
            return element;
        }


        GetPosition(): model.ShapePosition {
            return new model.ShapePosition(this.RaphaelElement.attr("x"), this.RaphaelElement.attr("y"));
            //return { x: this.RaphaelElement.attr("x"), y: this.RaphaelElement.attr("y") };
        }

        SetPosition(posX: number, posY: number) {
            this.RaphaelElement.attr({ x: posX, y: posY });
        }

        OnSelect(options:FlowChartOptions) {
            this.RaphaelElement.data("origStroke", this.RaphaelElement.attr("stroke"));
            this.RaphaelElement.attr("stroke", options.ColorSelectedShape);

        }

        OnUnselect(options: FlowChartOptions) {
            var color = this.RaphaelElement.data("origStroke");
            this.RaphaelElement.attr("stroke", color);
        }

    }
}