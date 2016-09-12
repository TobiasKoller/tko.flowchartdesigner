module flowchart.model {
    export class EventParamConnection{

        ShapeConnection: connection.ShapeConnection

        constructor(shapeConnection: connection.ShapeConnection) {
            this.ShapeConnection = shapeConnection;
        }
    }
}