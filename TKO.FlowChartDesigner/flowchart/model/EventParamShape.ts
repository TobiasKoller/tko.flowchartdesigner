module flowchart.model {
    export class EventParamShape {
        Shape: shape.ShapeBase;

        constructor(shape: shape.ShapeBase) {
            this.Shape = shape;
        }
    }
}