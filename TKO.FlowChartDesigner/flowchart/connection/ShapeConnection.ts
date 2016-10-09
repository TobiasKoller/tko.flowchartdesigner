module flowchart.connection {

    export class ShapeConnection extends model.SelectableElement {

        ShapeFrom: shape.ShapeBase;
        ShapeTo: shape.ShapeBase;
        Type: constants.ConnectionType;
        ConnectionPointFrom: shape.ConnectionPoint;
        ConnectionPointTo: shape.ConnectionPoint;
        RaphaelConnection: connection.RaphaelConnection;

        constructor(id:string,shapeFrom: shape.ShapeBase, shapeTo: shape.ShapeBase,
            type: constants.ConnectionType, posFrom: shape.ConnectionPoint, posTo: shape.ConnectionPoint, raphaelConnection: RaphaelConnection) {
            super();

            this.Id = id;
            this.ShapeFrom = shapeFrom;
            this.ShapeTo = shapeTo;
            this.Type = type;
            this.ConnectionPointFrom = posFrom;
            this.ConnectionPointTo = posTo;
            this.RaphaelConnection = raphaelConnection;
        }

        OnSelect(options:FlowChartOptions) {
            this.RaphaelConnection.InnerLine.data("origStroke", this.RaphaelConnection.InnerLine.attr("stroke"));
            this.RaphaelConnection.OuterLine.data("origStroke", this.RaphaelConnection.OuterLine.attr("stroke"));

            this.RaphaelConnection.InnerLine.attr("stroke", options.Colors.ConnectionSelected);
            this.RaphaelConnection.OuterLine.attr("stroke", options.Colors.ConnectionSelected);
        }

        OnUnselect(options: FlowChartOptions) {
            var innerLineColor = this.RaphaelConnection.InnerLine.data("origStroke");
            var outerLineColor = this.RaphaelConnection.OuterLine.data("origStroke");

            this.RaphaelConnection.InnerLine.attr("stroke", innerLineColor);
            this.RaphaelConnection.OuterLine.attr("stroke", outerLineColor);
        }

        Delete() {
            this.RaphaelConnection.RemoveFromPaper();
        }
    }
}