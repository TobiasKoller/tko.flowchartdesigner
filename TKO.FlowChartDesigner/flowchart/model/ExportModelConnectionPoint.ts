module flowchart.model {
    export class ExportModelConnectionPoint {
        Type: constants.ConnectionPointType;
        Pos: constants.ConnectionPointPosition;

        constructor(connectionPoint: shape.ConnectionPoint) {
            this.Type = connectionPoint.PointType;
            this.Pos = connectionPoint.Position;
        }
    }
}