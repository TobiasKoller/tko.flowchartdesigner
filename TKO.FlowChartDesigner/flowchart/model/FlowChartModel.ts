module flowchart.model {

    export class FlowChartModel {

        Shapes: shape.ShapeBase[]=[];
        
        Export() {

            var shape: shape.ShapeBase;

            var exportModel: ExportModel = new ExportModel();

            for (shape of this.Shapes) {
                
                exportModel.Shapes.push(new ExportModelShape(shape));

                var c: connection.ShapeConnection;
                for (c of shape.Connections) {
                    var connectionExist = false;

                    //check if connectin already exist. then ignore this.
                    for (var ec of exportModel.Connections) {
                        if (ec.Id == c.Id) {
                            connectionExist = true;
                            break;
                        }
                    }

                    if (connectionExist)
                        continue;

                    exportModel.Connections.push(new ExportModelConnection(c));
                }
            }

            return exportModel;
        }

        /**
         * Deletes the shape from the model.
         * @param shape
         */
        DeleteShape(shape: shape.ShapeBase) {
            this.DeleteConnections(shape.Connections);

            for (var i = 0; i < this.Shapes.length; i++) {
                if (this.Shapes[i].Id == shape.Id) {
                    this.Shapes.splice(i, 1);
                    break;
                }
            }
        }

        /**
         * Deletes all connections in the model.
         * @param connections
         */
        DeleteConnections(connections:connection.ShapeConnection[]) {

            var c: connection.ShapeConnection;
            var len = connections.length;

            for (let i=len-1; i >=0;i--) {//need to go backwards because we removing items the array inside the loop.
                c = connections[i];
                var shapeFrom = this.GetShape(c.ShapeFrom.Id);
                var shapeTo = this.GetShape(c.ShapeTo.Id);

                this.DeleteConnectionFromShape(shapeFrom, c.Id);
                this.DeleteConnectionFromShape(shapeTo,c.Id);
            }
        }

        /**
         * Delete specific connection from the shape.
         * @param shape
         * @param connectionId
         */
        DeleteConnectionFromShape(shape:shape.ShapeBase, connectionId: string) {
            if (!shape || !shape.Connections)
                return;

            for (var i = 0; i < shape.Connections.length; i++) {
                if (shape.Connections[i].Id == connectionId) {
                    shape.Connections.splice(i, 1);
                    break;
                }
            }
        }

        /**
         * Returns the shape with the given Id. Otherwise null.
         * @param shapeId
         */
        GetShape(shapeId: string): shape.ShapeBase {
            for (var shape of this.Shapes) {
                if (shape.Id == shapeId)
                    return shape;
            }

            return null;
        }
    }
}