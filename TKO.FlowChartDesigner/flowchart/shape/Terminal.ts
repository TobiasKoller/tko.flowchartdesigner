module flowchart.shape {
    export class Terminal extends ShapeBase {

        constructor(id: string, width, height, metadata: shape.metadata.IShapeMetadata = null) {
            super(id, constants.ShapeType.Terminal, width, height, metadata, "shape_terminal");
        }



        DrawShape(paper: RaphaelPaper, posX: number, posY: number): RaphaelElement {
            var path = this.CalculatePath(posX, posY, this.Width, this.Height);
            
            var raphaelElement = paper.path(path);
            raphaelElement.attr({ x: posX, y: posY });
            raphaelElement.attr(this.RaphaelAttr);
            return raphaelElement;
            
        }

        private CalculatePath(posX:number, posY:number, width:number, height:number):string {
            var r1 = 20, r2 = 20, r3 = 20, r4 = 20;

            var array = [];
            array = array.concat(["M", posX + r1, posY]);
            array = array.concat(['l', width - r1 - r2, 0]);//T
            array = array.concat(["q", r2, 0, r2, r2]); //TR
            array = array.concat(['l', 0, height - r3 - r2]);//R
            array = array.concat(["q", 0, r3, -r3, r3]); //BR
            array = array.concat(['l', -width + r4 + r3, 0]);//B
            array = array.concat(["q", -r4, 0, -r4, -r4]); //BL
            array = array.concat(['l', 0, -height + r4 + r1]);//L
            array = array.concat(["q", 0, -r1, r1, -r1]); //TL
            array = array.concat(["z"]); //end

            return array.join(" ");
        }

        //overridden
        GetMetadataDiv(): HTMLDivElement {

            var element: HTMLDivElement = document.createElement("div");
            element.classList.add(this.CssBackgroundClass);
            return element;
        }


        GetPosition(): model.ShapePosition {
            return new model.ShapePosition(this.RaphaelElement.attr("x"), this.RaphaelElement.attr("y"));
            //return { x: this.RaphaelElement.attr("x"), y: this.RaphaelElement.attr("y") };
        }

        SetPosition(posX: number, posY: number) {
            var path = this.CalculatePath(posX, posY, this.Width, this.Height);
            this.RaphaelElement.node.setAttribute("d", path);

            this.RaphaelElement.attr({ x: posX, y: posY });
        }

        OnSelect(options: FlowChartOptions) {
            this.RaphaelElement.data("origStroke", this.RaphaelElement.attr("stroke"));
            this.RaphaelElement.attr("stroke", options.ColorSelectedShape);

        }

        OnUnselect(options: FlowChartOptions) {
            var color = this.RaphaelElement.data("origStroke");
            this.RaphaelElement.attr("stroke", color);
        }
    }
}