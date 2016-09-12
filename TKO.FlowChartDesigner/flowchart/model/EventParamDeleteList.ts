module flowchart.model {
    export class EventParamDeleteList {
        Shapes: shape.ShapeBase[];
        Connections: connection.ShapeConnection[];

        constructor(shapes: shape.ShapeBase[], connections: connection.ShapeConnection[]) {
            this.Shapes = shapes;
            this.Connections = connections;
        }
    }
}