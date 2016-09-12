module flowchart {
    export class ModelLoader {

        constructor(private flowChart: FlowChart, private namespaceRegistrator: NamespaceRegistrator) {
        }

        Load(exportModel: model.ExportModel) {

            this.flowChart.Clear();


            this.AddShapes(exportModel.Shapes);
            this.ConnectShapes(exportModel.Connections);

        }

        private AddShapes(shapeList: model.ExportModelShape[]) {

            var exportShape: model.ExportModelShape;

            for (exportShape of shapeList) {
                
                var metadata: shape.metadata.Html = new shape.metadata.Html("");
                var dec = common.DomHelper.DecodeHtmlEntity(exportShape.Metadata);
                metadata.SetHtmlText(dec);


                var classNamespace = this.namespaceRegistrator.GetShape(exportShape.Type);
                var shapeInstance: shape.ShapeBase = new classNamespace(exportShape.Id, exportShape.Width, exportShape.Height, metadata);

                //connection points
                var connectionPoints: shape.ConnectionPoint[]=[];
                var cp: model.ExportModelConnectionPoint;
                for (cp of exportShape.ConnectionPoints) {

                    connectionPoints.push(new flowchart.shape.ConnectionPoint(cp.Type, cp.Pos));

                }

                shapeInstance.AddConnectionPoints(connectionPoints);

                this.flowChart.AddShape(shapeInstance, exportShape.PosX, exportShape.PosY);
            }

        }



        private ConnectShapes(connections: model.ExportModelConnection[]) {

            var c: model.ExportModelConnection;
            //wc.ConnectShapes(s1, s2, cPos.Bottom, cPos.Left);
            for (c of connections) {
                var shapeFrom = this.flowChart.GetShape(c.ShapeFromId);
                var shapeTo = this.flowChart.GetShape(c.ShapeToId);

                this.flowChart.ConnectShapes(shapeFrom,shapeTo,c.ConnectionPointFromPos, c.ConnectionPointToPos );
            }

        }

       
    }
}