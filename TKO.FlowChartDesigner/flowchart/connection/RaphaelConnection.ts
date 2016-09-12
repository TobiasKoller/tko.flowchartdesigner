module flowchart.connection {
    export class RaphaelConnection {
        
        InnerLine: RaphaelElement;
        OuterLine: RaphaelElement;
        ShapeFrom: RaphaelElement;
        ShapeTo: RaphaelElement;
        InnerColor: string;
        OuterColor: string;
        Thickness: number;

        //this.paper, path, innerColor, outerColor, thickness, obj1, obj2
        constructor(private ref: RaphaelPaper, path:string, innerColor:string, outerColor:string,thickness:number, shapeFrom:RaphaelElement, shapeTo:RaphaelElement) {

            this.InnerColor = innerColor;
            this.OuterColor = outerColor;
            this.Thickness = thickness;
            this.ShapeFrom = shapeFrom;
            this.ShapeTo = shapeTo;
            
            this.OuterLine = ref.path(path);
            this.OuterLine.attr({ stroke: outerColor, fill: "none", "stroke-width": thickness, cursor: "pointer" });
            this.InnerLine = ref.path(path);
            this.InnerLine.attr({ stroke: innerColor, fill: "none", cursor: "pointer" });

        }

        RemoveFromPaper() {
            this.InnerLine.remove();
            this.OuterLine.remove();
        }
    }
}