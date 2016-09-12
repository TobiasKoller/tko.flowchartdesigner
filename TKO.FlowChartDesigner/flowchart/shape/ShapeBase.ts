module flowchart.shape {
    export abstract class ShapeBase extends model.SelectableElement implements IShape
    {
        Width: number;
        Height: number;
        Type: constants.ShapeType;
        CssContentClass: string;
        CssBackgroundClass:string;
        RaphaelElement: RaphaelElement;
        RaphaelMetadata: SVGForeignObjectElement;
        RaphaelAttr: any;
        Metadata: shape.metadata.IShapeMetadata;
        ParentShape: ShapeBase;
        ConnectionPoints: shape.ConnectionPoint[] = [];
        Connections: connection.ShapeConnection[] = [];



        constructor(id: string, type: constants.ShapeType, width, height, metadata: shape.metadata.IShapeMetadata, cssClassPrefix: string) {
            super();
            this.Id = id;
            this.Type = type;
            this.Width = width;
            this.Height = height;
            this.CssBackgroundClass = cssClassPrefix + "_background";
            this.CssContentClass = cssClassPrefix + "_content";
            this.Metadata = metadata ? metadata : new shape.metadata.Html("");
            this.RaphaelAttr = { fill: "white", stroke: "black", "fill-opacity": 0, "stroke-width": 1, cursor: "move" };
        }

        GetContainingElements(): any[] {
            var list:any= [
                this.RaphaelElement
            ];

            if (this.RaphaelMetadata) {
                list.push(this.RaphaelMetadata);
            }

            for (var p of this.ConnectionPoints) {
                list.push(p.RaphaelElement);
            }
            return list;
        }

        BeforeMove(x:number,y:number) {
            var elements = this.GetContainingElements();
            for (var element of elements) {

                if (element.data) {
                    var position:model.ShapePosition = element.data("shape").GetPosition();
                    element.ox = position.X;//position.x;
                    element.oy = position.Y; //position.y;
                } else {
                    element.ox = Number(element.getAttribute("x"));
                    element.oy = Number(element.getAttribute("y"));
                }
            }
        }

        SetRaphaelShapeReference() {
            this.RaphaelElement.data("shape", this);
        }

        OnMove(x: number, y: number) {
            var elements = this.GetContainingElements();

            for (var element of elements) {
                var newX = element.ox + x;
                var newY = element.oy + y;

                if (element.attr) {
                    //element.attr(att);
                    element.data("shape").SetPosition(newX, newY);
                }
                else {
                    element.setAttributeNS(null, "x", String(newX));
                    element.setAttributeNS(null, "y", String(newY));
                }
            }
        }
        
        /**
         * Adds connectionpoint to the shape and adds a reference from each point to the parent shape.
         * @param connectionPoints
         */
        AddConnectionPoints(connectionPoints: ConnectionPoint[]) {
            
            for (var point of connectionPoints) {
                point.ParentShape = this;
                this.ConnectionPoints.push(point);
            }

        }

        AddConnection(connection:connection.ShapeConnection) {
            this.Connections.push(connection);
        }

        /**
         * calculates the position coordinates of the connectionpoint depending on the parent shape.
         * Default is always centered in the middle of the line.
         * @param position
         * @param parentShape
         * @param pointWidth
         * @param pointHeight
         */
        CalculateConnectionPointCoord(position:constants.ConnectionPointPosition, pointWidth:number, pointHeight:number):any {

            var parentBbox = this.RaphaelElement.getBBox();//parentShape.RaphaelElement.getBBox();
            var x:number=0, y:number=0;

            switch (position) {
                case constants.ConnectionPointPosition.Top:
                    x = parentBbox.x + (parentBbox.width / 2);//- (pointWidth / 2);
                    y = parentBbox.y - (pointHeight / 2); //+ bbox.height;
                    break;
                case constants.ConnectionPointPosition.Left:
                    x = parentBbox.x - (pointWidth / 2);
                    y = parentBbox.y + (parentBbox.height / 2);// - (pointHeight / 2);
                    break;
                case constants.ConnectionPointPosition.Right:
                    x = parentBbox.x + parentBbox.width + (pointWidth / 2);
                    y = parentBbox.y + (parentBbox.height / 2);// - (pointHeight / 2);
                    break;
                case constants.ConnectionPointPosition.Bottom:
                    x = parentBbox.x + (parentBbox.width / 2);//- (pointWidth / 2);
                    y = parentBbox.y + parentBbox.height + (pointHeight / 2);
                    break;

                default:
            }

            return {
                x: x,
                y: y
            }

        }

        Delete() {
            if(this.RaphaelElement)
                this.RaphaelElement.remove();

            if(this.RaphaelMetadata)
                this.RaphaelMetadata.remove();

            var cp: ConnectionPoint;
            for (cp of this.ConnectionPoints) {
                cp.Delete();
            }
        }


        SetCssContentClass(className: string) {
            this.CssContentClass = className;
        }

        abstract DrawShape(paper: RaphaelPaper, posX: number, posY: number);
        abstract GetMetadataDiv(): HTMLDivElement;
        abstract GetPosition():model.ShapePosition;
        abstract SetPosition(x: number, y: number);
    }
}