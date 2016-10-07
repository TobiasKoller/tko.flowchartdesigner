

module flowchart {

    
    export class Drawer {

        CanvasContainerId:string;
        Paper: any;

        constructor(private options: FlowChartOptions, private eventHandler) {
            
        }

        Initialize(canvasContainerId: string, width:number=0, height:number=0) {

            this.CanvasContainerId = canvasContainerId;
            this.Paper = Raphael(canvasContainerId, 0, 0);

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

            var point: shape.IShape;
            for (point of shape.ConnectionPoints) {
                point.RaphaelElement = point.DrawShape(this.Paper, posX, posY);
                
                point.SetRaphaelShapeReference();
            }

            this.eventHandler.Notify(constants.EventType.AfterShapeCreated, new model.EventParamShape(shape));
        }

        SetMetadata(shape: shape.ShapeBase, metadata: shape.metadata.IShapeMetadata, posX: number, posY: number) {
           // shape.RaphaelMetadata = metadataElement;
            
            var canvasContainer = document.getElementById(this.CanvasContainerId);
            
            var svgOffset = document.getElementsByTagName("svg")[0].getBoundingClientRect();
            var bodyOffset = canvasContainer.parentElement.parentElement.getBoundingClientRect();

            var parentParent: any = canvasContainer.parentElement.parentElement;
            var ppTop = parentParent.offsetTop;
            var ppLeft = parentParent.offsetLeft;

            var relativeX = svgOffset.left - bodyOffset.left + ppLeft;
            var relativeY = (svgOffset.top - bodyOffset.top) + ppTop;

            var absoluteX = relativeX+ posX;
            var absoluteY = relativeY+ posY;


            var metadataDiv = document.createElement("div");
            var x = "";
            var y = x;
            var z = x;
            var z1 = z;

            //metadataDiv.className = shape.CssBackgroundClass;
            //metadataDiv.classList.add(shape.CssBackgroundClass);
            
            metadataDiv.style.cssText =     "width:" + shape.Width + "px;" +
                                            "height:" + shape.Height + "px;" +
                                            "background-color:red; " +
                                            "position:absolute; " +
                                            "left:" + absoluteX + "px;" +
                                            "top:"+ absoluteY+"px;"+
                                            "z-index:1";

            metadataDiv.setAttribute("x",absoluteX);
            metadataDiv.setAttribute("y", absoluteY);
            
            

            shape.MetadataHtmlElement = metadataDiv;

            canvasContainer.parentElement.appendChild(metadataDiv);
            this.UpdateMetadata(shape, metadata);
        }

        //SetMetadata(shape: shape.ShapeBase, metadata: shape.metadata.IShapeMetadata, posX:number, posY:number) {
            
        //    var svgRoot = this.Paper.canvas;
        //    var metadataElement: SVGForeignObjectElement = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        //    //TODO http://stackoverflow.com/questions/13848039/svg-foreignobject-contents-do-not-display-unless-plain-text

        //     //metadata.innerHTML = "<i class='fa fa-sitemap'></i>";
        //    metadataElement.setAttributeNS(null, "width", String(shape.Width));
        //    metadataElement.setAttributeNS(null, "height", String(shape.Height));
        //    metadataElement.setAttributeNS(null, "x", String(posX));
        //    metadataElement.setAttributeNS(null, "y", String(posY));
        //    metadataElement.setAttributeNS(null, "style", "padding:1px");

        //    //var x = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
        //    //x.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        //    //metadataElement.appendChild(x);

        //    //we first add the metadata, that it will be behind the real raphaeljs object
        //    //when the raphaeljs element is transparent we see the metadata shining through
        //    //and still have all drag&drop functionallity of the raphaeljs-element.
        //    svgRoot.appendChild(metadataElement);//1st

        //    shape.RaphaelMetadata = metadataElement;

        //    this.UpdateMetadata(shape, metadata);

        //}

        UpdateMetadata(shape: shape.ShapeBase, metadata: shape.metadata.IShapeMetadata) {

            if (!shape)
                throw "UpdateMetadata: Shape is null.";
            if (!shape.MetadataHtmlElement)
                throw "UpdateMetadata: Shape.MetadataHtmlElement is null";
            //if (!shape.RaphaelMetadata)
            //    throw "UpdateMetadata: Shape.RapahelMetadata is null";

            var div = shape.GetMetadataDiv();
            var metaHtml = metadata.GetHtml();

            metaHtml.classList.add(shape.CssContentClass);
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