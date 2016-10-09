

module flowchart {

    
    export class Drawer {

        WrapperContainerId: string;
        CanvasContainerId: string;
        SvgContainerId: string;
        Paper: any;

        constructor(private options: FlowChartOptions, private eventHandler) {
            
        }

        Initialize(canvasContainerId:string, wrapperCanvasContainerId: string, width:number=0, height:number=0) {

            this.CanvasContainerId = canvasContainerId;
            this.WrapperContainerId = wrapperCanvasContainerId;
            this.SvgContainerId = "__svg__" + canvasContainerId;

            this.Paper = Raphael(wrapperCanvasContainerId, 0, 0);

            var nWidth = width !== 0 ? width : '100%';
            var nHeight = height !== 0 ? height : '100%';

            this.Paper.setSize(nWidth, nHeight);
        }

  

        AddShape(shape: shape.ShapeBase, posX: number, posY: number) {


            if (isNaN(posX)) throw "PosX is not a valid number.";
            if (isNaN(posY)) throw "PosY is not a valid number.";
            if (isNaN(shape.Width)) throw "Shape.Width is not a valid number.";
            if (isNaN(shape.Height)) throw "Shape.Height is not a valid number.";

            if (!this.eventHandler.Notify(constants.EventType.BeforeShapeCreated, new model.EventParamShape(shape)))
                return;

            //this.SetMetadata(shape,shape.Metadata, posX, posY);

            shape.RaphaelElement = shape.DrawShape(this.Paper, posX, posY);


            this.SetMetadata(shape, shape.Metadata, posX, posY);

            shape.RaphaelElement.toFront();

            //set reference from the raphaelobject to the shape
            shape.SetRaphaelShapeReference();

            var point: shape.ConnectionPoint;
            for (point of shape.ConnectionPoints) {
                point.RaphaelElement = point.DrawShape(this.Paper, posX, posY);

                  var t = constants.ConnectionPointType;
                  switch (point.PointType) {
                    case t.Incoming:
                        point.RaphaelElement.attr({fill: this.options.Colors.ConnectionPointIncoming});
                        break;
                    case t.OutgoingTrueSuccess:
                          point.RaphaelElement.attr({ fill: this.options.Colors.ConnectionPointTrueSuccess });
                        break;

                    case t.OutgoingFalseError:
                          point.RaphaelElement.attr({ fill: this.options.Colors.ConnectionPointFalseError });
                    break;
                default:
            }

                point.SetRaphaelShapeReference();
            }

            this.eventHandler.Notify(constants.EventType.AfterShapeCreated, new model.EventParamShape(shape));
        }

        /**
         * checks the current position of the canvas. if it has moved, we need to reposition the absolute divs from each shape.
         */
        UpdateWrapperPosition(shapes: shape.ShapeBase[]) {

            var canvasContainer = document.getElementById(this.WrapperContainerId);
            var relativePos = this.GetRelativePos();

            var origX = canvasContainer.getAttribute("relativeX");
            var origY = canvasContainer.getAttribute("relativeY");

            if (origX == relativePos.x && origY == relativePos.y) {
                return;
            }

            var shape: shape.ShapeBase;
            for (shape of shapes) {
                var div = shape.MetadataHtmlElement;
                var pos = shape.GetPosition();

                this.SetDivAbsolutePosition(div, relativePos.x, relativePos.y, pos.X, pos.Y);
            }

            //update new positions
            canvasContainer.setAttribute("relativeX", relativePos.x);
            canvasContainer.setAttribute("relativeY", relativePos.y);


        }

        /**
         * return the relative position of the canvas.
         * this is important because we have to absolutly position the divs.
         */
        private GetRelativePos() {

            var canvasContainer = document.getElementById(this.WrapperContainerId);


            var svgOffset = document.getElementById(this.SvgContainerId).getBoundingClientRect();
            //var svgOffset = document.getElementsByTagName("svg")[0].getBoundingClientRect();
            var bodyOffset = canvasContainer.parentElement.parentElement.getBoundingClientRect();

            var parentParent: any = canvasContainer.parentElement.parentElement;
            var ppTop = parentParent.offsetTop;
            var ppLeft = parentParent.offsetLeft;

            var relativeX = svgOffset.left - bodyOffset.left + ppLeft;
            var relativeY = (svgOffset.top - bodyOffset.top) + ppTop;

            return { x: relativeX, y: relativeY };
        }

        /**
         * set the absolute position of the current div.
         * @param metadataDiv
         * @param relativeX relative x-pos of the canvas which is the 0-pos of the div.
         * @param relativeY relative y-pos of the canvas which is the 0-pos of the div
         * @param x
         * @param y
         */
        private SetDivAbsolutePosition(metadataDiv: HTMLDivElement, relativeX:number, relativeY:number, x:number, y:number) {

            var absoluteX:any = relativeX + x;
            var absoluteY:any = relativeY + y;

            metadataDiv.style.left = absoluteX + "px";
            metadataDiv.style.top = absoluteY + "px";
            
            metadataDiv.setAttribute("x", absoluteX);
            metadataDiv.setAttribute("y", absoluteY);
        }

        SetMetadata(shape: shape.ShapeBase, metadata: shape.metadata.IShapeMetadata, posX: number, posY: number) {
           // shape.RaphaelMetadata = metadataElement;
            
            var canvasContainer = document.getElementById(this.WrapperContainerId);

            var relativePos = this.GetRelativePos();

            canvasContainer.setAttribute("relativeX", relativePos.x);
            canvasContainer.setAttribute("relativeY", relativePos.y);

            //var absoluteX = relativePos.x+ posX;
            //var absoluteY = relativePos.y+ posY;


            var metadataDiv = document.createElement("div");
            
            metadataDiv.style.cssText =     "width:" + shape.Width + "px;" +
                                            "height:" + shape.Height + "px;" +
                                            //"border: 1px solid red; " +
                                            "position:absolute; " +
                                            "z-index:1";

            this.SetDivAbsolutePosition(metadataDiv, relativePos.x, relativePos.y,posX,posY);

            shape.MetadataHtmlElement = metadataDiv;

            canvasContainer.parentElement.appendChild(metadataDiv);
            this.UpdateMetadata(shape, metadata);
        }

        UpdateMetadata(shape: shape.ShapeBase, metadata: shape.metadata.IShapeMetadata) {

            if (!shape)
                throw "UpdateMetadata: Shape is null.";
            if (!shape.MetadataHtmlElement)
                throw "UpdateMetadata: Shape.MetadataHtmlElement is null";
            //if (!shape.RaphaelMetadata)
            //    throw "UpdateMetadata: Shape.RapahelMetadata is null";

            var div = shape.GetMetadataDiv(); //new div element
            var metaHtml = metadata.GetHtml(); //html-content

            metaHtml.classList.add(shape.CssContentClass);
            //metaHtml.classList.add(shape.CssClass);
            div.appendChild(metaHtml);


            //metaHtml.appendChild(div);

            for (var i = shape.MetadataHtmlElement.childNodes.length-1; i >= 0; i--) {
                shape.MetadataHtmlElement.removeChild(shape.MetadataHtmlElement.childNodes[i]);
            }

            shape.MetadataHtmlElement.appendChild(div);
            
            //shape.RaphaelMetadata.appendChild(metaHtml); //.innerHTML = metaHtml.outerHTML + div.outerHTML;
            //shape.RaphaelMetadata.appendChild(div);
        }
        
    }

}