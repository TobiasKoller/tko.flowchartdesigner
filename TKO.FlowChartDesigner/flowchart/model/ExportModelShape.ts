module flowchart.model {
    export class ExportModelShape {
        Id: string;
        Width: number;
        Height: number;
        Type: constants.ShapeType;
        Metadata: any;
        PosX: number;
        PosY: number;
        ConnectionPoints: ExportModelConnectionPoint[]=[];

        constructor(shape:shape.ShapeBase) {

            this.Id = shape.Id;
            this.Width = shape.Width;
            this.Height = shape.Height;
            this.Type = shape.Type;
            this.Metadata = common.DomHelper.EncodeHtmlEntity(shape.Metadata.GetHtml().innerHTML);
            this.PosX = shape.RaphaelElement.attr("x");
            this.PosY = shape.RaphaelElement.attr("y");

            var cp: shape.ConnectionPoint;
            for (cp of shape.ConnectionPoints) {
                this.ConnectionPoints.push(new ExportModelConnectionPoint(cp));
            }

        }
    }
}