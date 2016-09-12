module flowchart {
    export class ShapeConnector {

        private connectionCounter:number = 0;

        constructor(private paper: RaphaelPaper, private options: FlowChartOptions, private eventHandler:EventHandler) {
            
        }

        private GetConnectionPoint(shape: shape.ShapeBase, position: constants.ConnectionPointPosition): shape.ConnectionPoint {

            var s: shape.ConnectionPoint;
            for (s of shape.ConnectionPoints) {
                if (s.Position == position)
                    return s;
            }

            throw "Shape has not connection-point at position "+position;
        }

        /**
         * connects two shapes
         * @param shapeFrom
         * @param shapeTo
         * @param fromConnectionPointPosition
         * @param toConnectionPointPosition
         */
        Connect(shapeFrom: shape.ShapeBase, shapeTo: shape.ShapeBase, fromConnectionPointPosition: constants.ConnectionPointPosition, toConnectionPointPosition: constants.ConnectionPointPosition) :connection.RaphaelConnection{
            
            var connectionPointFrom = this.GetConnectionPoint(shapeFrom, fromConnectionPointPosition);
            var connectionPointTo = this.GetConnectionPoint(shapeTo, toConnectionPointPosition);

            var color = connectionPointFrom.RaphaelElement.attr("fill");

            var conn: connection.RaphaelConnection = this.ConnectShapes(connectionPointFrom.RaphaelElement, connectionPointTo.RaphaelElement, color, color, 3);


            var connectionType = (connectionPointFrom.PointType == constants.ConnectionPointType.OutgoingTrueSuccess) ? constants.ConnectionType.TrueSucces : constants.ConnectionType.FalseError;
            this.connectionCounter++;
            var connectionId = "conn_" + this.connectionCounter;

            var newConnection: connection.ShapeConnection = new connection.ShapeConnection(connectionId,shapeFrom, shapeTo, connectionType, connectionPointFrom, connectionPointTo, conn);


            this.AddEventsToConnectionLine(conn, newConnection);

            //adding references to the shapes that they know their connections.
            shapeFrom.AddConnection(newConnection);
            shapeTo.AddConnection(newConnection);

            return conn;
        }

        private AddEventsToConnectionLine(raphaelConnection: connection.RaphaelConnection, shapeConnection: connection.ShapeConnection) {
            //add event on inner and outerline of the connection
            raphaelConnection.InnerLine.click(() => {
                this.eventHandler.Notify(constants.EventType.OnClick, new model.EventParamConnection(shapeConnection));
            });

            raphaelConnection.OuterLine.click(() => {
                this.eventHandler.Notify(constants.EventType.OnClick, new model.EventParamConnection(shapeConnection));
            });

        }

        RefreshConnection(c: connection.RaphaelConnection) {
            var innerColor = c.InnerLine.attr("stroke") ? c.InnerLine.attr("stroke") : c.InnerColor;
            var outerColor = c.OuterLine.attr("stroke") ? c.OuterLine.attr("stroke") : c.OuterColor;

            this.ConnectShapes(c.ShapeFrom, c.ShapeTo, innerColor, outerColor, c.Thickness,c);
        }

        private ConnectShapes(shapeFrom: RaphaelElement, shapeTo: RaphaelElement, innerColor: string, outerColor: string, thickness: number = 3, existingConnection: connection.RaphaelConnection = null): connection.RaphaelConnection {

            var connection: connection.drawer.IConnectionDrawer = this.options.ShapeConnection;
           
            return connection.Draw(shapeFrom, shapeTo, innerColor, outerColor, thickness, existingConnection);
        }
    }
}
