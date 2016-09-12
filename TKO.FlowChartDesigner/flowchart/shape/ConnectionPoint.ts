module flowchart.shape {

    export class ConnectionPoint extends ShapeBase {
        PointType:constants.ConnectionPointType;
        Position: constants.ConnectionPointPosition;

        constructor(type:constants.ConnectionPointType, position: constants.ConnectionPointPosition,width:number=30,height:number=30) {
            super("", constants.ShapeType.ConnectionPoint, width, height, null, "");

            this.PointType = type;
            this.Position = position;

            var t = constants.ConnectionPointType;
            switch (type) {
                case t.Incoming:
                    this.CssBackgroundClass = "connection_point_incoming";
                    this.CssContentClass = "";
                    break;
                case t.OutgoingTrueSuccess:
                    this.CssBackgroundClass = "connection_point_outgoing_true_success";
                    this.CssContentClass = "";
                    break;

                case t.OutgoingFalseError:
                    this.CssBackgroundClass = "connection_point_outgoing_false_error";
                    this.CssContentClass = "";
                break;
            default:
            }
        }
        

        DrawShape(paper: RaphaelPaper, posX: number, posY: number) {

            var p = this.ParentShape.RaphaelElement;
            var parentBbox = p.getBBox();
            

            var x = 0, y = 0;
            var pointWidth = 5;
            var pointHeight = 5;


            var positions = this.ParentShape.CalculateConnectionPointCoord(this.Position, pointWidth, pointHeight);

            x = positions.x;
            y = positions.y;

            if (x === 0) {
                x = parentBbox.x;
                y = parentBbox.y;
            }

            
            ////this.RaphaelElement = this.Paper.rect(x, y, pointWidth, pointHeight);
            var element = paper.circle(x, y, pointWidth);
            element.data("shape", this);

            var cssClass = common.DomHelper.GetCssClass(this.CssBackgroundClass);
            if (cssClass)
                element.attr({ fill: cssClass.style["background-color"] });

            if (this.PointType != constants.ConnectionPointType.Incoming) {
                //add cursor:pointer because these points are draggable
                element.attr({ cursor: "crosshair" });
            }
            
            return element;
        }

        GetPosition(): model.ShapePosition {
            return new model.ShapePosition(this.RaphaelElement.attr("cx"),this.RaphaelElement.attr("cy"));
            //return { x: this.RaphaelElement.attr("cx"), y: this.RaphaelElement.attr("cy") };
        }

        SetPosition(posX: number, posY: number) {
            this.RaphaelElement.attr({ cx: posX, cy: posY });
        }


        GetMetadataDiv(): HTMLDivElement {

            return null;

        }

        CreateCopy():ConnectionPoint {
            //var parentShape = this.RaphaelElement.data("shape");
            var connectionPoint = new ConnectionPoint(this.PointType, this.Position, this.Width, this.Height);
            connectionPoint.RaphaelElement = this.RaphaelElement.clone();

            return connectionPoint;
        }

        OnSelect() {
            
        }

        OnUnselect() {
            
        }
    }
}