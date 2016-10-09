module flowchart {

    /**
     * responsible for handling the moving of shapes and connections.
     */
    export class ShapeMover {

        Paper:RaphaelPaper;

        CurrentDraggedShapeType:constants.ShapeType;
        PlaceholderConnectionPoint: shape.ConnectionPoint;
        DragFromConnectionPoint: shape.ConnectionPoint;
        DragConnection: connection.RaphaelConnection;
        CurrentOverShape: shape.ShapeBase;
       

        constructor(private _connector: ShapeConnector, paper:RaphaelPaper, private options:FlowChartOptions, private eventHandler:EventHandler) {
            this.Paper = paper;
        }

        /**
         * registers an shape to be draggable
         * @param shape
         */
        Register(shape: shape.ShapeBase) {

            //add events for dragging, mouseover and mouseout
            shape.RaphaelElement.drag(this.GetOnMoveStart(shape), this.GetDragger(shape), this.GetOnMoveFinished(shape));
            shape.RaphaelElement.mouseover(this.GetOnMouseOver(shape));
            shape.RaphaelElement.mouseout(this.GetOnMouseOut(shape));


            var cp: shape.ConnectionPoint;

            //add drag&drop for each connection-point,too
            for (cp of shape.ConnectionPoints) {

                switch (cp.PointType) {
                    case constants.ConnectionPointType.OutgoingTrueSuccess:
                    case constants.ConnectionPointType.OutgoingFalseError:
                        cp.RaphaelElement.drag(this.GetOnMoveStart(cp), this.GetDragger(cp), this.GetOnMoveFinished(cp));
                        break;
                    case constants.ConnectionPointType.Incoming:

                        cp.RaphaelElement.mouseover(this.GetOnMouseOver(cp));
                        cp.RaphaelElement.mouseout(this.GetOnMouseOut(cp));
                        break;
                default:
                }
            }
        }

        /**
         * checks if the given element is of type ConnectionPoint
         * @param element
         */
        private IsConnectionPoint(element: RaphaelElement) {
            return element && element.data("shape").Type === constants.ShapeType.ConnectionPoint;
        }

        /**
         * checks if the given connectionpoint is of any of the supplied types.
         * @param connectionPointShape
         * @param types
         */
        private IsConnectionPointType(connectionPointShape: shape.ShapeBase, types: constants.ConnectionPointType[]) {
            
            if (!this.IsConnectionPoint(connectionPointShape.RaphaelElement))
                return false;

            var point: shape.ConnectionPoint = <shape.ConnectionPoint>(connectionPointShape);
            

            for (var type of types) {
                if (point.PointType == type)
                    return true;
            }

            return false;
        }

        /**
         * will be called when dragging started and while it is dragging
         * @param shape
         */
        private GetOnMoveStart(shape: shape.ShapeBase) {
            var self:ShapeMover = this;
            return function (dx: number, dy: number, x: number, y: number, event: DragEvent): any {

                //moves the shape to new x,y coordinates
                shape.OnMove(dx, dy);

                var c: connection.ShapeConnection;
                //redraw all depending connections
                for (c of shape.Connections) {
                    self._connector.RefreshConnection(c.RaphaelConnection);
                }

                //redraw drag-connection if a connection dragged
                if (self.IsConnectionPoint(this)) {
                    self._connector.RefreshConnection(self.DragConnection);
                }
                
                return this;
            };
        }

        /**
         * will be called when dragging has finished
         * @param shape
         */
        private GetOnMoveFinished(shape: shape.ShapeBase) {
            var self:ShapeMover = this;

            return function (DragEvent: any): any {

                //is not ConnectionPoint? then its a shape.
                if (!self.IsConnectionPoint(this)) {
                    var eventData = new model.EventParamShape(this.data("shape"));
                    self.eventHandler.Notify(constants.EventType.AfterShapeMoved, eventData);
                    return;
                }
                
                //remove drag-connection.
                self.DragConnection.RemoveFromPaper();

                //remove temporarily created placehholder-connectionpoint
                self.PlaceholderConnectionPoint.RaphaelElement.remove();
                self.PlaceholderConnectionPoint = null;
                self.DragFromConnectionPoint = null;
                self.DragConnection = null;
                    
                var fromConnectionPoint: shape.ConnectionPoint = <shape.ConnectionPoint>this.data("shape");

                //move back dragged connection-point to original-position
                fromConnectionPoint.SetPosition(this.ox, this.oy);

                if (self.CurrentOverShape == null)
                    return;


                this.toFront();

                //Only allow dragg-to incoming-connection-types.
                if (self.IsConnectionPointType(self.CurrentOverShape, [constants.ConnectionPointType.Incoming])) {

                    //check, if connection already exits. if true, no other connection is allowed and animation will not start.
                    if (!self.IsConnectionAllowed(fromConnectionPoint, <shape.ConnectionPoint>self.CurrentOverShape))
                        return;

                    //create the connection

                    var toShapeConnectionPoint: shape.ConnectionPoint = <shape.ConnectionPoint>self.CurrentOverShape;
                    var fromShape: shape.ShapeBase = fromConnectionPoint.ParentShape;
                    var toShape: shape.ShapeBase = toShapeConnectionPoint.ParentShape;
                    var connectionType = (fromConnectionPoint.PointType == constants.ConnectionPointType.OutgoingTrueSuccess) ? constants.ConnectionType.TrueSucces : constants.ConnectionType.FalseError;


                    //create event-param.
                    var eventParam = new model.EventParamConnection(new connection.ShapeConnection("",fromShape, toShape, connectionType,fromConnectionPoint,toShapeConnectionPoint,null));
                    if (self.eventHandler.Notify(constants.EventType.BeforeConnectionCreated, eventParam)===false)
                        return;

                    var conn = self._connector.Connect(fromConnectionPoint.ParentShape, toShapeConnectionPoint.ParentShape, fromConnectionPoint.Position, toShapeConnectionPoint.Position);

                    //Adding raphaelconnection to the evenparam. now its available.
                    eventParam.ShapeConnection.RaphaelConnection = conn;
                    self.eventHandler.Notify(constants.EventType.AfterConnectionCreated, eventParam);
                }
            };
        }


        /**
         * will be called right before dragging starts
         * @param shape
         */
        private GetDragger(shape: shape.ShapeBase) {
            //Example: http://jsfiddle.net/CHUrB/
            var self = this;
            return function (x: number, y: number, event: DragEvent): any {

                // Original coords for main element

                self.CurrentDraggedShapeType = shape.Type;

                shape.BeforeMove(x,y);
                
                if (self.IsConnectionPoint(this)) {

                    var s: any = shape;
                    self.DragFromConnectionPoint = <shape.ConnectionPoint>shape;
                    //create a placeholder-connectionpoint while dragging the original somewhere else.
                    //this will be removed after dragging has finished
                    self.PlaceholderConnectionPoint = s.CreateCopy();

                    var color = this.attr("fill");
                    var attr = { "stroke-dasharray": ["-"], "arrow-end": "classic" };
                    self.DragConnection = self.options.ShapeConnection.Draw(self.PlaceholderConnectionPoint.RaphaelElement, this, color, color, 5);
                    self.DragConnection.InnerLine.attr(attr);
                    self.DragConnection.OuterLine.attr(attr);

                    this.toBack(); //otherwise the mouseover will not fire correctly on target
                } else {
                    var eventData = new model.EventParamShape(this.data("shape"));
                    self.eventHandler.Notify(constants.EventType.BeforeShapeMoved, eventData);
                }
            }
        }

        /**
         * will be called when mouse leaves an shape
         * @param shape
         */
        private GetOnMouseOver(shape:shape.ShapeBase) {

            var self:ShapeMover = this;
            
            return function() {
                self.CurrentOverShape = shape;

                //is current shape an connection point and in drag-mode?
                if (self.IsConnectionPoint(this) && self.IsDragging() && self.IsConnectionPointType(shape, [constants.ConnectionPointType.Incoming])) {
                    
                    //check, if connection already exits. if true, no other connection is allowed and animation will not start.
                    if (!self.IsConnectionAllowed(self.DragFromConnectionPoint, <shape.ConnectionPoint>self.CurrentOverShape))
                        return;

                    //this is just for animate the incoming-connection-point
                    var color = this.attr("fill");
                    var attr = { fill: color, r: 20 };
                    this.toFront();
                    this.animate(Raphael.animation({ r: attr["r"] }, 250));
                }
            }
        }

        /**
         * will be called when mouse is over and shape.
         * @param shape
         */
        private GetOnMouseOut(shape: shape.ShapeBase) {
            var self:ShapeMover = this;

            return function () {
                //self.CurrentOverShape = null;

                //current shape is connectionpoint and in drag-mode?
                if (self.IsConnectionPoint(this)) {

                    var color = this.attr("fill");
                    var attr = { fill: color, r: 5 };

                    //animation to shrink connectionpoint to original size.
                    var animate = Raphael.animation({ r: attr["r"] }, 250, null, () => {

                        //still in dragmode? nothing to do because user has not finished dragging.
                        if (self.IsDragging())
                            return;

                        var parent: shape.IShape = this.data("shape").ParentShape;
                        var id = parent.Id;

                        var c: connection.ShapeConnection;
                        for (c of parent.Connections) {
                            //iterate through connection to refresh connection to this destinationpoint.
                            //this is needed because of the animation the connection would point to the "big"(animated) connection-point instead of the "small" (non animated) one
                            if (c.ShapeTo.Id == id) {
                                self._connector.RefreshConnection(c.RaphaelConnection);
                            }
                        }

                    });

                    this.animate(animate);
                }
            }
        }
        
        /**
         * returns true, if user is currently dragging an connection.
         */
        IsDragging():boolean {
            return this.DragConnection != null;
        }

        /**
         * checks if a connection between two shapes already exists
         * @param shapeFrom
         * @param shapeTo
         */
        private IsConnectionAllowed(connectionPointFrom: shape.ConnectionPoint, connectionPointTo: shape.ConnectionPoint): boolean {

            var parentFrom = connectionPointFrom.ParentShape;
            var parentTo = connectionPointTo.ParentShape;

            //parent-from and parent-to is the same shape? not allowed.
            if (parentFrom.Id == parentTo.Id)
                return false;

            //check if connection already exists.
            var c: connection.ShapeConnection;
            for (c of parentFrom.Connections) {

                //shapes are already connected and connection comes from the same type (success,error)?
                if (c.ShapeTo.Id == parentTo.Id && c.ConnectionPointFrom.PointType == connectionPointFrom.PointType) {
                    return false;
                }
            }

            return true;
        }
    }
}