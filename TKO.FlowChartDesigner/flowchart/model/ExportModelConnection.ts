module flowchart.model {
    export class ExportModelConnection {
        Id:string;
        Type: constants.ConnectionType;
        ShapeFromId: string;
        ShapeToId: string;
        ConnectionPointFromPos: constants.ConnectionPointPosition;
        ConnectionPointToPos: constants.ConnectionPointPosition;

        constructor(connection:connection.ShapeConnection) {
            this.Id = connection.Id;
            this.Type = connection.Type;
            this.ShapeFromId = connection.ShapeFrom.Id;
            this.ShapeToId = connection.ShapeTo.Id;
            this.ConnectionPointFromPos = connection.ConnectionPointFrom.Position;
            this.ConnectionPointToPos = connection.ConnectionPointTo.Position;
        }
    }
}