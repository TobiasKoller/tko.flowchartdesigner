var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var flowchart;
(function (flowchart) {
    var constants;
    (function (constants) {
        (function (ShapeType) {
            ShapeType[ShapeType["Terminal"] = 1] = "Terminal";
            ShapeType[ShapeType["Process"] = 2] = "Process";
            ShapeType[ShapeType["Decision"] = 3] = "Decision";
            ShapeType[ShapeType["ConnectionPoint"] = 4] = "ConnectionPoint";
        })(constants.ShapeType || (constants.ShapeType = {}));
        var ShapeType = constants.ShapeType;
    })(constants = flowchart.constants || (flowchart.constants = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        var BaseElement = (function () {
            function BaseElement() {
            }
            return BaseElement;
        }());
        model.BaseElement = BaseElement;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        var SelectableElement = (function (_super) {
            __extends(SelectableElement, _super);
            function SelectableElement() {
                _super.apply(this, arguments);
            }
            return SelectableElement;
        }(model.BaseElement));
        model.SelectableElement = SelectableElement;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var shape;
    (function (shape) {
        var ShapeBase = (function (_super) {
            __extends(ShapeBase, _super);
            function ShapeBase(id, type, width, height, metadata, cssClassPrefix) {
                _super.call(this);
                this.ConnectionPoints = [];
                this.Connections = [];
                this.Id = id;
                this.Type = type;
                this.Width = width;
                this.Height = height;
                this.CssBackgroundClass = cssClassPrefix + "_background";
                this.CssContentClass = cssClassPrefix + "_content";
                this.Metadata = metadata ? metadata : new shape.metadata.Html("");
                this.RaphaelAttr = { fill: "white", stroke: "black", "fill-opacity": 0, "stroke-width": 1, cursor: "move" };
            }
            ShapeBase.prototype.GetContainingElements = function () {
                var list = [
                    this.RaphaelElement
                ];
                //if (this.RaphaelMetadata) {
                //    list.push(this.RaphaelMetadata);
                //}
                if (this.MetadataHtmlElement) {
                    list.push(this.MetadataHtmlElement);
                }
                for (var _i = 0, _a = this.ConnectionPoints; _i < _a.length; _i++) {
                    var p = _a[_i];
                    list.push(p.RaphaelElement);
                }
                return list;
            };
            ShapeBase.prototype.BeforeMove = function (x, y) {
                var elements = this.GetContainingElements();
                for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                    var element = elements_1[_i];
                    if (element.data) {
                        var position = element.data("shape").GetPosition();
                        element.ox = position.X; //position.x;
                        element.oy = position.Y; //position.y;
                    }
                    else {
                        element.ox = Number(element.getAttribute("x"));
                        element.oy = Number(element.getAttribute("y"));
                    }
                }
            };
            ShapeBase.prototype.SetRaphaelShapeReference = function () {
                this.RaphaelElement.data("shape", this);
            };
            ShapeBase.prototype.OnMove = function (x, y) {
                var elements = this.GetContainingElements();
                var metadataElement = this.MetadataHtmlElement;
                this.MetadataHtmlElement.style.left = (metadataElement.ox + x) + "px";
                this.MetadataHtmlElement.style.top = (metadataElement.oy + y) + "px";
                for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
                    var element = elements_2[_i];
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
            };
            /**
             * Adds connectionpoint to the shape and adds a reference from each point to the parent shape.
             * @param connectionPoints
             */
            ShapeBase.prototype.AddConnectionPoints = function (connectionPoints) {
                for (var _i = 0, connectionPoints_1 = connectionPoints; _i < connectionPoints_1.length; _i++) {
                    var point = connectionPoints_1[_i];
                    point.ParentShape = this;
                    this.ConnectionPoints.push(point);
                }
            };
            ShapeBase.prototype.AddConnection = function (connection) {
                this.Connections.push(connection);
            };
            /**
             * calculates the position coordinates of the connectionpoint depending on the parent shape.
             * Default is always centered in the middle of the line.
             * @param position
             * @param parentShape
             * @param pointWidth
             * @param pointHeight
             */
            ShapeBase.prototype.CalculateConnectionPointCoord = function (position, pointWidth, pointHeight) {
                var parentBbox = this.RaphaelElement.getBBox(); //parentShape.RaphaelElement.getBBox();
                var x = 0, y = 0;
                switch (position) {
                    case flowchart.constants.ConnectionPointPosition.Top:
                        x = parentBbox.x + (parentBbox.width / 2); //- (pointWidth / 2);
                        y = parentBbox.y - (pointHeight / 2); //+ bbox.height;
                        break;
                    case flowchart.constants.ConnectionPointPosition.Left:
                        x = parentBbox.x - (pointWidth / 2);
                        y = parentBbox.y + (parentBbox.height / 2); // - (pointHeight / 2);
                        break;
                    case flowchart.constants.ConnectionPointPosition.Right:
                        x = parentBbox.x + parentBbox.width + (pointWidth / 2);
                        y = parentBbox.y + (parentBbox.height / 2); // - (pointHeight / 2);
                        break;
                    case flowchart.constants.ConnectionPointPosition.Bottom:
                        x = parentBbox.x + (parentBbox.width / 2); //- (pointWidth / 2);
                        y = parentBbox.y + parentBbox.height + (pointHeight / 2);
                        break;
                    default:
                }
                return {
                    x: x,
                    y: y
                };
            };
            ShapeBase.prototype.Delete = function () {
                if (this.RaphaelElement)
                    this.RaphaelElement.remove();
                //if(this.RaphaelMetadata)
                //    this.RaphaelMetadata.remove();
                if (this.MetadataHtmlElement)
                    this.MetadataHtmlElement.remove();
                var cp;
                for (var _i = 0, _a = this.ConnectionPoints; _i < _a.length; _i++) {
                    cp = _a[_i];
                    cp.Delete();
                }
            };
            ShapeBase.prototype.SetCssContentClass = function (className) {
                this.CssContentClass = className;
            };
            return ShapeBase;
        }(flowchart.model.SelectableElement));
        shape.ShapeBase = ShapeBase;
    })(shape = flowchart.shape || (flowchart.shape = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var shape;
    (function (shape) {
        var Process = (function (_super) {
            __extends(Process, _super);
            function Process(id, width, height, metadata) {
                if (metadata === void 0) { metadata = null; }
                _super.call(this, id, flowchart.constants.ShapeType.Process, width, height, metadata, "shape_process");
            }
            Process.prototype.DrawShape = function (paper, posX, posY) {
                var element = paper.rect(posX, posY, this.Width, this.Height);
                element.attr(this.RaphaelAttr);
                return element;
            };
            Process.prototype.GetMetadataDiv = function () {
                var element = document.createElement("div");
                element.classList.add(this.CssBackgroundClass);
                return element;
            };
            Process.prototype.GetPosition = function () {
                return new flowchart.model.ShapePosition(this.RaphaelElement.attr("x"), this.RaphaelElement.attr("y"));
                //return { x: this.RaphaelElement.attr("x"), y: this.RaphaelElement.attr("y") };
            };
            Process.prototype.SetPosition = function (posX, posY) {
                this.RaphaelElement.attr({ x: posX, y: posY });
            };
            Process.prototype.OnSelect = function (options) {
                this.RaphaelElement.data("origStroke", this.RaphaelElement.attr("stroke"));
                this.RaphaelElement.attr("stroke", options.ColorSelectedShape);
            };
            Process.prototype.OnUnselect = function (options) {
                var color = this.RaphaelElement.data("origStroke");
                this.RaphaelElement.attr("stroke", color);
            };
            return Process;
        }(shape.ShapeBase));
        shape.Process = Process;
    })(shape = flowchart.shape || (flowchart.shape = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var shape;
    (function (shape) {
        var Decision = (function (_super) {
            __extends(Decision, _super);
            function Decision(id, width, height, metadata) {
                if (metadata === void 0) { metadata = null; }
                _super.call(this, id, flowchart.constants.ShapeType.Decision, width, height, metadata, "shape_decision");
            }
            Decision.prototype.DrawShape = function (paper, posX, posY) {
                var path = this.CalculatePath(posX, posY, this.Width, this.Height);
                var raphaelElement = paper.path(path.path);
                raphaelElement.attr({ x: posX, y: posY });
                raphaelElement.attr(this.RaphaelAttr);
                return raphaelElement;
            };
            Decision.prototype.CalculatePath = function (posX, posY, width, height) {
                var halfHeight = height / 2;
                var halfWidth = width / 2;
                var topX = posX + halfWidth;
                var topY = posY;
                var leftX = posX; //- halfWidth;
                var leftY = posY + halfHeight;
                var rightX = posX + width; //+ halfWidth;
                var rightY = posY + halfHeight;
                var bottomX = posX + halfWidth;
                var bottomY = posY + height;
                var top = topX + "," + topY;
                var right = rightX + "," + rightY;
                var left = leftX + "," + leftY;
                var bottom = bottomX + "," + bottomY;
                var path = "M" + top + " " + right + " " + bottom + " " + left + " " + top;
                return {
                    path: path,
                    topX: topX,
                    topY: topY,
                    rightX: rightX,
                    rightY: rightY,
                    leftX: leftX,
                    leftY: leftY,
                    bottomX: bottomX,
                    bottomY: bottomY
                };
            };
            //overridden
            Decision.prototype.GetMetadataDiv = function () {
                var element = document.createElement("div");
                //bei 100px ist dies ideal. width: 70px; height: 70px; margin - left: 15px; margin - top:15px
                //bei anderen nicht..muss berechnet wereden.
                element.classList.add(this.CssBackgroundClass);
                element.style.width = (this.Width * 0.7) + "px";
                element.style.height = (this.Height * 0.7) + "px";
                element.style.marginLeft = (this.Width * 0.49) + "px";
                element.style.marginTop = (this.Height * 0.29) + "px";
                //element.style.marginLeft = (this.Width * 0.15) + "px";
                //element.style.marginTop = (this.Height * 0.15) + "px";
                return element;
                //var element: HTMLDivElement = document.createElement("div");
                //var className = "shapeClass" + this.Id;
                //var backgroundColor: string = "transparent";
                //var css:CSSStyleRule = common.DomHelper.GetCssClass(this.CssBackgroundClass);
                //if (css) {
                //    backgroundColor = css.style["background-color"];
                //}
                ////check if class doesn't exist. if true, create it...
                //if (!common.DomHelper.CssClassExists(className)) {
                //    var style1: HTMLStyleElement = document.createElement('style');
                //    var style2: HTMLStyleElement = document.createElement('style');
                //    style1.type = 'text/css';
                //    style2.type = 'text/css';
                //    var halfWidth = this.Width / 2;
                //    var halfHeight = this.Height / 2;
                //    //its a little bit more complex because we have to create a diamond shape with css.
                //    style1.innerHTML = "." + className +                '   { width: 0; height: 0; border: ' + halfWidth + 'px solid transparent; border-bottom: ' + halfHeight + 'px solid '+backgroundColor+'; position: absolute; top: -' + halfWidth+'px;padding-left:-50px;z-index:-1 }'; //when z-index=-1 then its possible to overlay some other styles afterwords
                //    style2.innerHTML = "." + className + ':after{content: ""; width: 0; height: 0; border: ' + halfWidth + 'px solid transparent; border-top: ' + halfHeight + 'px solid ' + backgroundColor + ';position: absolute; left: -' + halfWidth + 'px; top: ' + halfHeight +'px; ;z-index:-1  }';
                //    document.getElementsByTagName('head')[0].appendChild(style1);
                //    document.getElementsByTagName('head')[0].appendChild(style2);
                //}
                //element.classList.add(className);
                //return element;
            };
            Decision.prototype.GetPosition = function () {
                return new flowchart.model.ShapePosition(this.RaphaelElement.attr("x"), this.RaphaelElement.attr("y"));
                //return { x: this.RaphaelElement.attr("x"), y: this.RaphaelElement.attr("y") };
            };
            Decision.prototype.SetPosition = function (posX, posY) {
                var path = this.CalculatePath(posX, posY, this.Width, this.Height);
                this.RaphaelElement.node.setAttribute("d", path.path);
                this.RaphaelElement.attr({ x: posX, y: posY });
            };
            Decision.prototype.OnSelect = function (options) {
                this.RaphaelElement.data("origStroke", this.RaphaelElement.attr("stroke"));
                this.RaphaelElement.attr("stroke", options.ColorSelectedShape);
            };
            Decision.prototype.OnUnselect = function (options) {
                var color = this.RaphaelElement.data("origStroke");
                this.RaphaelElement.attr("stroke", color);
            };
            return Decision;
        }(shape.ShapeBase));
        shape.Decision = Decision;
    })(shape = flowchart.shape || (flowchart.shape = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var Drawer = (function () {
        function Drawer(options, eventHandler) {
            this.options = options;
            this.eventHandler = eventHandler;
        }
        Drawer.prototype.Initialize = function (canvasContainerId, width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.CanvasContainerId = canvasContainerId;
            this.Paper = Raphael(canvasContainerId, 0, 0);
            var nWidth = width !== 0 ? width : '100%';
            var nHeight = height !== 0 ? height : '100%';
            this.Paper.setSize(nWidth, nHeight);
        };
        Drawer.prototype.AddShape = function (shape, posX, posY) {
            if (isNaN(posX))
                throw "PosX is not a valid number.";
            if (isNaN(posY))
                throw "PosY is not a valid number.";
            if (isNaN(shape.Width))
                throw "Shape.Width is not a valid number.";
            if (isNaN(shape.Height))
                throw "Shape.Height is not a valid number.";
            if (!this.eventHandler.Notify(flowchart.constants.EventType.BeforeShapeCreated, new flowchart.model.EventParamShape(shape)))
                return;
            //this.SetMetadata(shape,shape.Metadata, posX, posY);
            shape.RaphaelElement = shape.DrawShape(this.Paper, posX, posY);
            this.SetMetadata(shape, shape.Metadata, posX, posY);
            shape.RaphaelElement.toFront();
            //set reference from the raphaelobject to the shape
            shape.SetRaphaelShapeReference();
            var point;
            for (var _i = 0, _a = shape.ConnectionPoints; _i < _a.length; _i++) {
                point = _a[_i];
                point.RaphaelElement = point.DrawShape(this.Paper, posX, posY);
                point.SetRaphaelShapeReference();
            }
            this.eventHandler.Notify(flowchart.constants.EventType.AfterShapeCreated, new flowchart.model.EventParamShape(shape));
        };
        Drawer.prototype.SetMetadata = function (shape, metadata, posX, posY) {
            // shape.RaphaelMetadata = metadataElement;
            var canvasContainer = document.getElementById(this.CanvasContainerId);
            var svgOffset = document.getElementsByTagName("svg")[0].getBoundingClientRect();
            var bodyOffset = canvasContainer.parentElement.parentElement.getBoundingClientRect();
            var parentParent = canvasContainer.parentElement.parentElement;
            var ppTop = parentParent.offsetTop;
            var ppLeft = parentParent.offsetLeft;
            var relativeX = svgOffset.left - bodyOffset.left + ppLeft;
            var relativeY = (svgOffset.top - bodyOffset.top) + ppTop;
            var absoluteX = relativeX + posX;
            var absoluteY = relativeY + posY;
            var metadataDiv = document.createElement("div");
            metadataDiv.style.cssText = "width:" + shape.Width + "px;" +
                "height:" + shape.Height + "px;" +
                "background-color:red; " +
                "position:absolute; " +
                "left:" + absoluteX + "px;" +
                "top:" + absoluteY + "px;" +
                "z-index:1";
            //metadataDiv.relativeX = relativeX;
            //metadataDiv.relativeY = relativeY;
            metadataDiv.setAttribute("x", absoluteX);
            metadataDiv.setAttribute("y", absoluteY);
            canvasContainer.parentElement.appendChild(metadataDiv);
            shape.MetadataHtmlElement = metadataDiv;
        };
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
        Drawer.prototype.UpdateMetadata = function (shape, metadata) {
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
            for (var i = shape.MetadataHtmlElement.childNodes.length - 1; i >= 0; i--) {
                shape.MetadataHtmlElement.removeChild(shape.MetadataHtmlElement.childNodes[i]);
            }
            shape.MetadataHtmlElement.appendChild(div);
            //shape.RaphaelMetadata.appendChild(metaHtml); //.innerHTML = metaHtml.outerHTML + div.outerHTML;
            //shape.RaphaelMetadata.appendChild(div);
        };
        return Drawer;
    }());
    flowchart.Drawer = Drawer;
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    "use strict";
    /**
     * Handles the whole flowchart.
     */
    var FlowChart = (function () {
        function FlowChart(htmlElementId, options, width, height) {
            if (!options)
                options = new flowchart.FlowChartOptions();
            var htmlElement = document.getElementById(htmlElementId);
            if (!htmlElement)
                throw "Element with id [" + htmlElementId + "] not found.";
            var wrapperId = this.CreateWrapperDiv(htmlElement, htmlElementId);
            this.options = options;
            this.eventHandler = new flowchart.EventHandler();
            this.namespaceRegistrator = new flowchart.NamespaceRegistrator();
            this.model = new flowchart.model.FlowChartModel();
            this.drawer = new flowchart.Drawer(options, this.eventHandler);
            this.drawer.Initialize(wrapperId, width, height);
            options.Init(this.drawer.Paper);
            this.selectionManager = new flowchart.SelectionManager(this.eventHandler, options, this.model);
            this.connector = new flowchart.ShapeConnector(this.drawer.Paper, options, this.eventHandler);
            this.mover = new flowchart.ShapeMover(this.connector, this.drawer.Paper, options, this.eventHandler);
            //document.body.onkeydown = (event) => {
            //    console.log(event);
            //};
        }
        /**
         * will create a wrapper inside the html-Element.
         * this will enable the possibility to mix svg and html-elements including z-indexing. (put svg over html-absolute-positioned elements)
         * @param parentId
         */
        FlowChart.prototype.CreateWrapperDiv = function (parentElement, parentId) {
            var wrapperId = "__wrapper__" + parentId;
            var wrapperDiv = document.createElement("div");
            wrapperDiv.id = wrapperId;
            wrapperDiv.style.cssText = "width:100%;height: 100%;margin: 0;padding: 0;position:relative;z-index:1000;border:1px solid blue";
            parentElement.appendChild(wrapperDiv);
            return wrapperId;
        };
        /**
         * Removes everything from the flowchart and the underlying model.
         */
        FlowChart.prototype.Clear = function () {
            var shape;
            for (var _i = 0, _a = this.model.Shapes; _i < _a.length; _i++) {
                shape = _a[_i];
                shape.Delete();
                var c;
                for (var _b = 0, _c = shape.Connections; _b < _c.length; _b++) {
                    c = _c[_b];
                    c.Delete();
                }
            }
            this.model.Shapes = [];
        };
        /**
         * Exports the Model in a format which can be used to load it after words again.
         */
        FlowChart.prototype.Export = function () {
            return this.model.Export();
        };
        /**
         * Loads the given Model into the Flowchart
         * @param model
         */
        FlowChart.prototype.Load = function (model) {
            this.options.EnableEvents = false;
            this.Clear();
            var loader = new flowchart.ModelLoader(this, this.namespaceRegistrator);
            loader.Load(model);
            this.options.EnableEvents = true;
        };
        /**
         * checks if the shapeId is unique.
         * @param shapeId
         */
        FlowChart.prototype.CheckShapeId = function (shapeId) {
            for (var _i = 0, _a = this.model.Shapes; _i < _a.length; _i++) {
                var s = _a[_i];
                if (s.Id == shapeId)
                    return false;
            }
            return true;
        };
        /**
         * Adds a new shape to the flowchart.
         * @param shape Shape of type flowchart.shape.xxx
         * @param posX Position X of the shape on the canvas.
         * @param posY Position Y of the shape on the canvas.
         */
        FlowChart.prototype.AddShape = function (shape, posX, posY) {
            var _this = this;
            if (!shape)
                throw "No Shape defined.";
            if (shape.Id == null || shape.Id.trim().length === 0)
                throw "No shape.Id defined.";
            if (!this.CheckShapeId(shape.Id))
                throw "The shapeId [" + shape.Id + "] already exists.";
            this.drawer.AddShape(shape, posX, posY);
            this.mover.Register(shape);
            this.model.Shapes.push(shape);
            shape.RaphaelElement.click(function () {
                _this.eventHandler.Notify(flowchart.constants.EventType.OnClick, new flowchart.model.EventParamShape(shape));
            });
            shape.RaphaelElement.dblclick(function () {
                _this.eventHandler.Notify(flowchart.constants.EventType.OnDoubleClick, new flowchart.model.EventParamShape(shape));
            });
        };
        /**
         * Updates the metadata of the shape.
         * This method has also to be called when you change the CssContentClass of an shape (f.e. to give some shapes another colour at runtime).
         * @param shape
         * @param metadata
         */
        FlowChart.prototype.UpdateShapeMetadata = function (shape, metadata) {
            if (!metadata)
                metadata = shape.Metadata;
            this.drawer.UpdateMetadata(shape, metadata);
        };
        /**
         * Connects two shapes
         * @param shapeFrom
         * @param shapeTo
         * @param fromConnectionPointPosition
         * @param toConnectionPointPosition
         */
        FlowChart.prototype.ConnectShapes = function (shapeFrom, shapeTo, fromConnectionPointPosition, toConnectionPointPosition) {
            var connection = this.connector.Connect(shapeFrom, shapeTo, fromConnectionPointPosition, toConnectionPointPosition);
        };
        /**
         * Adds an eventlistener to the canvas.
         * All eventtypes are listed in flowchart.constants.EventType
         * @param eventType Type of the Event. flowchart.constants.EventType
         * @param callback Function which will be called when the event is fired.
         * All "Before"-Events can abort the process by simply returning false.
         */
        FlowChart.prototype.AddEventListener = function (eventType, callback) {
            this.eventHandler.Register(eventType, callback);
        };
        /**
        * Returns the shape with the given Id. Otherwise null.
        * @param shapeId
        */
        FlowChart.prototype.GetShape = function (shapeId) {
            for (var _i = 0, _a = this.model.Shapes; _i < _a.length; _i++) {
                var shape = _a[_i];
                if (shape.Id == shapeId)
                    return shape;
            }
            return null;
        };
        /**
         * Register new custom shapes for this instance.
         * @param enumValue unique number for the shape. this will be used internally to register the shape
         * @param classNamespace Namespace to the new shape-class. f.e. "flowchart.shape.Decision"
         */
        FlowChart.prototype.RegisterShape = function (enumValue, classNamespace) {
            this.namespaceRegistrator.RegisterShape(enumValue, classNamespace);
        };
        /**
         * Register new ConnectionDrawer for this instance.
         * @param enumValue unique number for the connection-drawer. this will be used internally to register the drawer
         * @param classNamespace Namespace to the new connection-drawer-class. f.e. "flowchart.connection.drawer.Curved"
         */
        FlowChart.prototype.RegisterConnectionDrawer = function (enumValue, classNamespace) {
            this.namespaceRegistrator.RegisterConnectionDrawer(enumValue, classNamespace);
        };
        FlowChart.prototype.CheckShapeHasRaphaelElement = function (shape) {
            if (!shape)
                throw "Parameter shape is null";
            if (!shape.RaphaelElement)
                throw "shape.RaphaelElement is null";
        };
        return FlowChart;
    }());
    flowchart.FlowChart = FlowChart;
})(flowchart || (flowchart = {}));
///<reference path="flowchart/shape/IShape.ts"/>
///<reference path="flowchart/constants/ShapeType.ts"/>
///<reference path="flowchart/model/BaseElement.ts"/>
///<reference path="flowchart/model/SelectableElement.ts"/>
///<reference path="flowchart/shape/ShapeBase.ts"/>
///<reference path="flowchart/shape/Process.ts"/>
///<reference path="flowchart/shape/Decision.ts"/>
///<reference path="flowchart/Drawer.ts" />
///<reference path="flowchart/FlowChart.ts" />
var common;
(function (common) {
    var DomHelper = (function () {
        function DomHelper() {
        }
        /**
         * returns true, if the given class exists.
         * @param className Name of the cssClass
         */
        DomHelper.CssClassExists = function (className) {
            return this.GetCssClass(className) != null;
        };
        /**
         * Returns the cssClass from the dom.
         * @param className Name of the cssClass
         */
        DomHelper.GetCssClass = function (className) {
            if (className.indexOf(".") !== 0)
                className = '.' + className;
            for (var i = 0; i < document.styleSheets.length; i++) {
                var styleSheet = document.styleSheets[i];
                var rules = styleSheet.rules || styleSheet.cssRules;
                if (!rules)
                    continue;
                var rule;
                for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
                    rule = rules_1[_i];
                    if (rule.selectorText == className)
                        return rule;
                }
            }
            return null;
        };
        DomHelper.CreateCopy = function (object) {
            return jQuery.extend(true, {}, object);
        };
        DomHelper.EncodeHtmlEntity = function (x) {
            return x.replace(/./gm, function (s) {
                return "&#" + s.charCodeAt(0) + ";";
            });
        };
        /**
         * Create string from HTML entities
         */
        DomHelper.DecodeHtmlEntity = function (string) {
            return (string + "").replace(/&#\d+;/gm, function (s) {
                var x = s.match(/\d+/gm)[0];
                return String.fromCharCode(x);
            });
        };
        return DomHelper;
    }());
    common.DomHelper = DomHelper;
    ;
})(common || (common = {}));
var flowchart;
(function (flowchart) {
    var connection;
    (function (connection) {
        var drawer;
        (function (drawer) {
            var Curved = (function () {
                function Curved(paper) {
                    this.paper = paper;
                }
                Curved.prototype.Draw = function (raphaelObjectFrom, raphaelObjectTo, innerColor, outerColor, thickness, existingConnection) {
                    if (thickness === void 0) { thickness = 3; }
                    if (existingConnection === void 0) { existingConnection = null; }
                    var bb1 = raphaelObjectFrom.getBBox(), bb2 = raphaelObjectTo.getBBox(), p = [
                        { x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
                        { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
                        { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
                        { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 },
                        { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
                        { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
                        { x: bb2.x - 1, y: bb2.y + bb2.height / 2 },
                        { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }
                    ], d = {}, dis = [];
                    for (var i = 0; i < 4; i++) {
                        for (var j = 4; j < 8; j++) {
                            var dx = Math.abs(p[i].x - p[j].x), dy = Math.abs(p[i].y - p[j].y);
                            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                                dis.push(dx + dy);
                                d[dis[dis.length - 1]] = [i, j];
                            }
                        }
                    }
                    if (dis.length == 0) {
                        var res = [0, 4];
                    }
                    else {
                        res = d[Math.min.apply(Math, dis)];
                    }
                    var x1 = p[res[0]].x, y1 = p[res[0]].y, x4 = p[res[1]].x, y4 = p[res[1]].y;
                    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
                    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
                    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3), y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3), x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3), y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
                    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
                    if (existingConnection) {
                        existingConnection.InnerLine.attr("stroke", innerColor);
                        existingConnection.OuterLine.attr({ "stroke": outerColor, "stroke-width": thickness });
                        existingConnection.InnerLine.attr("path", path);
                        existingConnection.OuterLine.attr("path", path);
                        return existingConnection;
                    }
                    else {
                        return new connection.RaphaelConnection(this.paper, path, innerColor, outerColor, thickness, raphaelObjectFrom, raphaelObjectTo);
                    }
                };
                return Curved;
            }());
            drawer.Curved = Curved;
        })(drawer = connection.drawer || (connection.drawer = {}));
    })(connection = flowchart.connection || (flowchart.connection = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var connection;
    (function (connection) {
        var drawer;
        (function (drawer) {
            var Elbow = (function () {
                function Elbow() {
                }
                Elbow.prototype.Draw = function (raphaelObjectFrom, raphaelObjectTo, innerColor, outerColor, thickness, existingConnection) {
                    if (thickness === void 0) { thickness = 3; }
                    if (existingConnection === void 0) { existingConnection = null; }
                    {
                        throw "ElbowConnection: not implemented yet.";
                    }
                };
                return Elbow;
            }());
            drawer.Elbow = Elbow;
        })(drawer = connection.drawer || (connection.drawer = {}));
    })(connection = flowchart.connection || (flowchart.connection = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var connection;
    (function (connection) {
        var drawer;
        (function (drawer) {
            var Straight = (function () {
                function Straight(paper) {
                    this.paper = paper;
                }
                Straight.prototype.Draw = function (raphaelObjectFrom, raphaelObjectTo, innerColor, outerColor, thickness, existingConnection) {
                    if (thickness === void 0) { thickness = 3; }
                    if (existingConnection === void 0) { existingConnection = null; }
                    {
                        var bb1 = raphaelObjectFrom.getBBox(), bb2 = raphaelObjectTo.getBBox();
                        var x1 = bb1.x + bb1.width / 2;
                        var y1 = bb1.y + bb1.height / 2;
                        var x2 = bb2.x + bb2.width / 2;
                        var y2 = bb2.y + bb2.height / 2;
                        var path = ["M", x1, y1, x2, y2].join(",");
                        if (existingConnection) {
                            existingConnection.InnerLine.attr({ "stroke": innerColor, cursor: "pointer" });
                            existingConnection.OuterLine.attr({ "stroke": outerColor, "stroke-width": thickness, cursor: "pointer" });
                            existingConnection.InnerLine.attr("path", path);
                            existingConnection.OuterLine.attr("path", path);
                            return existingConnection;
                        }
                        else {
                            return new connection.RaphaelConnection(this.paper, path, innerColor, outerColor, thickness, raphaelObjectFrom, raphaelObjectTo);
                        }
                    }
                };
                return Straight;
            }());
            drawer.Straight = Straight;
        })(drawer = connection.drawer || (connection.drawer = {}));
    })(connection = flowchart.connection || (flowchart.connection = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var connection;
    (function (connection) {
        var RaphaelConnection = (function () {
            //this.paper, path, innerColor, outerColor, thickness, obj1, obj2
            function RaphaelConnection(ref, path, innerColor, outerColor, thickness, shapeFrom, shapeTo) {
                this.ref = ref;
                this.InnerColor = innerColor;
                this.OuterColor = outerColor;
                this.Thickness = thickness;
                this.ShapeFrom = shapeFrom;
                this.ShapeTo = shapeTo;
                this.OuterLine = ref.path(path);
                this.OuterLine.attr({ stroke: outerColor, fill: "none", "stroke-width": thickness, cursor: "pointer" });
                this.InnerLine = ref.path(path);
                this.InnerLine.attr({ stroke: innerColor, fill: "none", cursor: "pointer" });
            }
            RaphaelConnection.prototype.RemoveFromPaper = function () {
                this.InnerLine.remove();
                this.OuterLine.remove();
            };
            return RaphaelConnection;
        }());
        connection.RaphaelConnection = RaphaelConnection;
    })(connection = flowchart.connection || (flowchart.connection = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var connection;
    (function (connection) {
        var ShapeConnection = (function (_super) {
            __extends(ShapeConnection, _super);
            function ShapeConnection(id, shapeFrom, shapeTo, type, posFrom, posTo, raphaelConnection) {
                _super.call(this);
                this.Id = id;
                this.ShapeFrom = shapeFrom;
                this.ShapeTo = shapeTo;
                this.Type = type;
                this.ConnectionPointFrom = posFrom;
                this.ConnectionPointTo = posTo;
                this.RaphaelConnection = raphaelConnection;
            }
            ShapeConnection.prototype.OnSelect = function (options) {
                this.RaphaelConnection.InnerLine.data("origStroke", this.RaphaelConnection.InnerLine.attr("stroke"));
                this.RaphaelConnection.OuterLine.data("origStroke", this.RaphaelConnection.OuterLine.attr("stroke"));
                this.RaphaelConnection.InnerLine.attr("stroke", options.ColorSelectedConnection);
                this.RaphaelConnection.OuterLine.attr("stroke", options.ColorSelectedConnection);
            };
            ShapeConnection.prototype.OnUnselect = function (options) {
                var innerLineColor = this.RaphaelConnection.InnerLine.data("origStroke");
                var outerLineColor = this.RaphaelConnection.OuterLine.data("origStroke");
                this.RaphaelConnection.InnerLine.attr("stroke", innerLineColor);
                this.RaphaelConnection.OuterLine.attr("stroke", outerLineColor);
            };
            ShapeConnection.prototype.Delete = function () {
                this.RaphaelConnection.RemoveFromPaper();
            };
            return ShapeConnection;
        }(flowchart.model.SelectableElement));
        connection.ShapeConnection = ShapeConnection;
    })(connection = flowchart.connection || (flowchart.connection = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var constants;
    (function (constants) {
        (function (ConnectionDrawerType) {
            ConnectionDrawerType[ConnectionDrawerType["Curved"] = 0] = "Curved";
            ConnectionDrawerType[ConnectionDrawerType["Straight"] = 1] = "Straight";
            ConnectionDrawerType[ConnectionDrawerType["Elbow"] = 2] = "Elbow";
        })(constants.ConnectionDrawerType || (constants.ConnectionDrawerType = {}));
        var ConnectionDrawerType = constants.ConnectionDrawerType;
    })(constants = flowchart.constants || (flowchart.constants = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var constants;
    (function (constants) {
        (function (ConnectionPointPosition) {
            ConnectionPointPosition[ConnectionPointPosition["Top"] = 0] = "Top";
            ConnectionPointPosition[ConnectionPointPosition["Left"] = 1] = "Left";
            ConnectionPointPosition[ConnectionPointPosition["Right"] = 2] = "Right";
            ConnectionPointPosition[ConnectionPointPosition["Bottom"] = 3] = "Bottom";
        })(constants.ConnectionPointPosition || (constants.ConnectionPointPosition = {}));
        var ConnectionPointPosition = constants.ConnectionPointPosition;
    })(constants = flowchart.constants || (flowchart.constants = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var constants;
    (function (constants) {
        (function (ConnectionPointType) {
            ConnectionPointType[ConnectionPointType["Incoming"] = 1] = "Incoming";
            ConnectionPointType[ConnectionPointType["OutgoingTrueSuccess"] = 2] = "OutgoingTrueSuccess";
            ConnectionPointType[ConnectionPointType["OutgoingFalseError"] = 3] = "OutgoingFalseError";
        })(constants.ConnectionPointType || (constants.ConnectionPointType = {}));
        var ConnectionPointType = constants.ConnectionPointType;
    })(constants = flowchart.constants || (flowchart.constants = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var constants;
    (function (constants) {
        /**
         * type of the connection between two shapes.
         */
        (function (ConnectionType) {
            ConnectionType[ConnectionType["TrueSucces"] = 1] = "TrueSucces";
            ConnectionType[ConnectionType["FalseError"] = 2] = "FalseError";
        })(constants.ConnectionType || (constants.ConnectionType = {}));
        var ConnectionType = constants.ConnectionType;
    })(constants = flowchart.constants || (flowchart.constants = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var constants;
    (function (constants) {
        (function (EventType) {
            EventType[EventType["OnClick"] = 1] = "OnClick";
            EventType[EventType["OnDoubleClick"] = 2] = "OnDoubleClick";
            EventType[EventType["BeforeConnectionCreated"] = 3] = "BeforeConnectionCreated";
            EventType[EventType["AfterConnectionCreated"] = 4] = "AfterConnectionCreated";
            EventType[EventType["BeforeShapeMoved"] = 5] = "BeforeShapeMoved";
            EventType[EventType["AfterShapeMoved"] = 6] = "AfterShapeMoved";
            EventType[EventType["BeforeDelete"] = 7] = "BeforeDelete";
            EventType[EventType["AfterDelete"] = 8] = "AfterDelete";
            EventType[EventType["BeforeSelect"] = 9] = "BeforeSelect";
            EventType[EventType["AfterSelect"] = 10] = "AfterSelect";
            EventType[EventType["BeforeUnselect"] = 11] = "BeforeUnselect";
            EventType[EventType["AfterUnselect"] = 12] = "AfterUnselect";
            EventType[EventType["BeforeShapeCreated"] = 13] = "BeforeShapeCreated";
            EventType[EventType["AfterShapeCreated"] = 14] = "AfterShapeCreated";
        })(constants.EventType || (constants.EventType = {}));
        var EventType = constants.EventType;
    })(constants = flowchart.constants || (flowchart.constants = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var EventHandler = (function () {
        function EventHandler() {
            this.listener = [];
        }
        /**
         * register event
         * @param type
         * @param callback
         * @param id
         */
        EventHandler.prototype.Register = function (type, callback, id) {
            if (id === void 0) { id = ""; }
            var eventListener = new flowchart.model.EventListener(type, callback, id);
            this.listener.push(eventListener);
        };
        /**
         * unregister event
         * @param id
         */
        EventHandler.prototype.Unregister = function (id) {
            if (!id || id == "")
                return;
            var e;
            var len = this.listener.length;
            for (var i = len - 1; i >= 0; i--) {
                e = this.listener[i];
                if (e.Id == id)
                    this.listener.splice(i);
            }
        };
        /**
         * Notifies all event-listener
         * @param type
         * @param eventArgs
         */
        EventHandler.prototype.Notify = function (type, eventArgs) {
            var c;
            var result = true;
            for (var _i = 0, _a = this.listener; _i < _a.length; _i++) {
                c = _a[_i];
                if (c.Type == type) {
                    var tmpResult = c.Callback(eventArgs);
                    if (tmpResult == false)
                        result = false;
                }
            }
            return result;
        };
        return EventHandler;
    }());
    flowchart.EventHandler = EventHandler;
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var FlowChartOptions = (function () {
        function FlowChartOptions(shapeConnectionType) {
            if (shapeConnectionType === void 0) { shapeConnectionType = flowchart.constants.ConnectionDrawerType.Curved; }
            this.IsInitialized = false;
            this.ColorSelectedShape = "yellow";
            this.ColorSelectedConnection = "yellow";
            this.EnableEvents = true;
            this.ShapeConnectionType = shapeConnectionType;
        }
        FlowChartOptions.prototype.Init = function (paper) {
            if (this.IsInitialized)
                return;
            switch (this.ShapeConnectionType) {
                case flowchart.constants.ConnectionDrawerType.Curved:
                    this.ShapeConnection = new flowchart.connection.drawer.Curved(paper);
                    break;
                case flowchart.constants.ConnectionDrawerType.Straight:
                    this.ShapeConnection = new flowchart.connection.drawer.Straight(paper);
                    break;
                default:
            }
            this.IsInitialized = true;
        };
        return FlowChartOptions;
    }());
    flowchart.FlowChartOptions = FlowChartOptions;
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        var EventListener = (function () {
            function EventListener(type, callback, id) {
                if (id === void 0) { id = ""; }
                this.Id = id;
                this.Type = type;
                this.Callback = callback;
            }
            return EventListener;
        }());
        model.EventListener = EventListener;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        var EventParamConnection = (function () {
            function EventParamConnection(shapeConnection) {
                this.ShapeConnection = shapeConnection;
            }
            return EventParamConnection;
        }());
        model.EventParamConnection = EventParamConnection;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        var EventParamDeleteList = (function () {
            function EventParamDeleteList(shapes, connections) {
                this.Shapes = shapes;
                this.Connections = connections;
            }
            return EventParamDeleteList;
        }());
        model.EventParamDeleteList = EventParamDeleteList;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        var EventParamShape = (function () {
            function EventParamShape(shape) {
                this.Shape = shape;
            }
            return EventParamShape;
        }());
        model.EventParamShape = EventParamShape;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        var ExportModel = (function () {
            function ExportModel() {
                this.Shapes = [];
                this.Connections = [];
            }
            return ExportModel;
        }());
        model.ExportModel = ExportModel;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        var ExportModelConnection = (function () {
            function ExportModelConnection(connection) {
                this.Id = connection.Id;
                this.Type = connection.Type;
                this.ShapeFromId = connection.ShapeFrom.Id;
                this.ShapeToId = connection.ShapeTo.Id;
                this.ConnectionPointFromPos = connection.ConnectionPointFrom.Position;
                this.ConnectionPointToPos = connection.ConnectionPointTo.Position;
            }
            return ExportModelConnection;
        }());
        model.ExportModelConnection = ExportModelConnection;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        var ExportModelConnectionPoint = (function () {
            function ExportModelConnectionPoint(connectionPoint) {
                this.Type = connectionPoint.PointType;
                this.Pos = connectionPoint.Position;
            }
            return ExportModelConnectionPoint;
        }());
        model.ExportModelConnectionPoint = ExportModelConnectionPoint;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        var ExportModelShape = (function () {
            function ExportModelShape(shape) {
                this.ConnectionPoints = [];
                this.Id = shape.Id;
                this.Width = shape.Width;
                this.Height = shape.Height;
                this.Type = shape.Type;
                this.Metadata = common.DomHelper.EncodeHtmlEntity(shape.Metadata.GetHtml().innerHTML);
                this.PosX = shape.RaphaelElement.attr("x");
                this.PosY = shape.RaphaelElement.attr("y");
                var cp;
                for (var _i = 0, _a = shape.ConnectionPoints; _i < _a.length; _i++) {
                    cp = _a[_i];
                    this.ConnectionPoints.push(new model.ExportModelConnectionPoint(cp));
                }
            }
            return ExportModelShape;
        }());
        model.ExportModelShape = ExportModelShape;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        var FlowChartModel = (function () {
            function FlowChartModel() {
                this.Shapes = [];
            }
            FlowChartModel.prototype.Export = function () {
                var shape;
                var exportModel = new model.ExportModel();
                for (var _i = 0, _a = this.Shapes; _i < _a.length; _i++) {
                    shape = _a[_i];
                    exportModel.Shapes.push(new model.ExportModelShape(shape));
                    var c;
                    for (var _b = 0, _c = shape.Connections; _b < _c.length; _b++) {
                        c = _c[_b];
                        var connectionExist = false;
                        //check if connectin already exist. then ignore this.
                        for (var _d = 0, _e = exportModel.Connections; _d < _e.length; _d++) {
                            var ec = _e[_d];
                            if (ec.Id == c.Id) {
                                connectionExist = true;
                                break;
                            }
                        }
                        if (connectionExist)
                            continue;
                        exportModel.Connections.push(new model.ExportModelConnection(c));
                    }
                }
                return exportModel;
            };
            /**
             * Deletes the shape from the model.
             * @param shape
             */
            FlowChartModel.prototype.DeleteShape = function (shape) {
                this.DeleteConnections(shape.Connections);
                for (var i = 0; i < this.Shapes.length; i++) {
                    if (this.Shapes[i].Id == shape.Id) {
                        this.Shapes.splice(i, 1);
                        break;
                    }
                }
            };
            /**
             * Deletes all connections in the model.
             * @param connections
             */
            FlowChartModel.prototype.DeleteConnections = function (connections) {
                var c;
                var len = connections.length;
                for (var i = len - 1; i >= 0; i--) {
                    c = connections[i];
                    var shapeFrom = this.GetShape(c.ShapeFrom.Id);
                    var shapeTo = this.GetShape(c.ShapeTo.Id);
                    this.DeleteConnectionFromShape(shapeFrom, c.Id);
                    this.DeleteConnectionFromShape(shapeTo, c.Id);
                }
            };
            /**
             * Delete specific connection from the shape.
             * @param shape
             * @param connectionId
             */
            FlowChartModel.prototype.DeleteConnectionFromShape = function (shape, connectionId) {
                for (var i = 0; i < shape.Connections.length; i++) {
                    if (shape.Connections[i].Id == connectionId) {
                        shape.Connections.splice(i, 1);
                        break;
                    }
                }
            };
            /**
             * Returns the shape with the given Id. Otherwise null.
             * @param shapeId
             */
            FlowChartModel.prototype.GetShape = function (shapeId) {
                for (var _i = 0, _a = this.Shapes; _i < _a.length; _i++) {
                    var shape = _a[_i];
                    if (shape.Id == shapeId)
                        return shape;
                }
                return null;
            };
            return FlowChartModel;
        }());
        model.FlowChartModel = FlowChartModel;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        /**
         * keeps all registered shapes and connection-drawer-namespaces.
         */
        var NamespaceRegistry = (function () {
            function NamespaceRegistry() {
                this.Shapes = {};
                this.ConnectionDrawer = {};
            }
            NamespaceRegistry.prototype.GetShape = function (enumValue) {
                return this.Shapes[enumValue];
            };
            NamespaceRegistry.prototype.GetConnectionDrawer = function (enumValue) {
                return this.ConnectionDrawer[enumValue];
            };
            /**
             * Add new Shape to the registry.
             * @param enumValue
             * @param classNamespace
             */
            NamespaceRegistry.prototype.AddShape = function (enumValue, classNamespace) {
                this.Shapes[enumValue] = classNamespace;
            };
            /**
             * Add new ConnectionDrawer to the registry.
             * @param enumValue
             * @param classNamespace
             */
            NamespaceRegistry.prototype.AddConnectionDrawer = function (enumValue, classNamespace) {
                this.ConnectionDrawer[enumValue] = classNamespace;
            };
            return NamespaceRegistry;
        }());
        model.NamespaceRegistry = NamespaceRegistry;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var model;
    (function (model) {
        var ShapePosition = (function () {
            function ShapePosition(x, y) {
                this.X = x;
                this.Y = y;
            }
            return ShapePosition;
        }());
        model.ShapePosition = ShapePosition;
    })(model = flowchart.model || (flowchart.model = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var ModelLoader = (function () {
        function ModelLoader(flowChart, namespaceRegistrator) {
            this.flowChart = flowChart;
            this.namespaceRegistrator = namespaceRegistrator;
        }
        ModelLoader.prototype.Load = function (exportModel) {
            this.flowChart.Clear();
            this.AddShapes(exportModel.Shapes);
            this.ConnectShapes(exportModel.Connections);
        };
        ModelLoader.prototype.AddShapes = function (shapeList) {
            var exportShape;
            for (var _i = 0, shapeList_1 = shapeList; _i < shapeList_1.length; _i++) {
                exportShape = shapeList_1[_i];
                var metadata = new flowchart.shape.metadata.Html("");
                var dec = common.DomHelper.DecodeHtmlEntity(exportShape.Metadata);
                metadata.SetHtmlText(dec);
                var classNamespace = this.namespaceRegistrator.GetShape(exportShape.Type);
                var shapeInstance = new classNamespace(exportShape.Id, exportShape.Width, exportShape.Height, metadata);
                //connection points
                var connectionPoints = [];
                var cp;
                for (var _a = 0, _b = exportShape.ConnectionPoints; _a < _b.length; _a++) {
                    cp = _b[_a];
                    connectionPoints.push(new flowchart.shape.ConnectionPoint(cp.Type, cp.Pos));
                }
                shapeInstance.AddConnectionPoints(connectionPoints);
                this.flowChart.AddShape(shapeInstance, exportShape.PosX, exportShape.PosY);
            }
        };
        ModelLoader.prototype.ConnectShapes = function (connections) {
            var c;
            //wc.ConnectShapes(s1, s2, cPos.Bottom, cPos.Left);
            for (var _i = 0, connections_1 = connections; _i < connections_1.length; _i++) {
                c = connections_1[_i];
                var shapeFrom = this.flowChart.GetShape(c.ShapeFromId);
                var shapeTo = this.flowChart.GetShape(c.ShapeToId);
                this.flowChart.ConnectShapes(shapeFrom, shapeTo, c.ConnectionPointFromPos, c.ConnectionPointToPos);
            }
        };
        return ModelLoader;
    }());
    flowchart.ModelLoader = ModelLoader;
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    /**
     * Registers all shapes and connection-drawer.
     */
    var NamespaceRegistrator = (function () {
        function NamespaceRegistrator() {
            this.Registry = new flowchart.model.NamespaceRegistry();
            this.RegisterBuildIn();
        }
        /**
         * Registers all build-in shapes and connection-drawer.
         */
        NamespaceRegistrator.prototype.RegisterBuildIn = function () {
            //shapes
            this.RegisterShape(flowchart.constants.ShapeType.Terminal, flowchart.shape.Terminal);
            this.RegisterShape(flowchart.constants.ShapeType.Decision, flowchart.shape.Decision);
            this.RegisterShape(flowchart.constants.ShapeType.Process, flowchart.shape.Process);
            this.RegisterShape(flowchart.constants.ShapeType.ConnectionPoint, flowchart.shape.ConnectionPoint);
            //connection-drawer
            this.RegisterConnectionDrawer(flowchart.constants.ConnectionDrawerType.Straight, flowchart.connection.drawer.Straight);
            this.RegisterConnectionDrawer(flowchart.constants.ConnectionDrawerType.Curved, flowchart.connection.drawer.Curved);
        };
        /**
         * Returns the registered shape for the given enum-value
         * @param enumValue
         */
        NamespaceRegistrator.prototype.GetShape = function (enumValue) {
            var ns = this.Registry.GetShape(enumValue);
            if (!ns)
                throw "No Shape registered under enum-value [" + enumValue + "].";
            return ns;
        };
        /**
         * Returns the registered connection-drawer for the given enum-value.
         * @param enumValue
         */
        NamespaceRegistrator.prototype.GetConnectionDrawer = function (enumValue) {
            var ns = this.Registry.GetConnectionDrawer(enumValue);
            if (!ns)
                throw "No Connection-Drawer registered under enum-value [" + enumValue + "].";
            return ns;
        };
        /**
         * registers new shape.
         * @param enumValue
         * @param namespaceString
         */
        NamespaceRegistrator.prototype.RegisterShape = function (enumValue, classNamespace) {
            if (this.Registry.Shapes[enumValue])
                throw "Shape with enum-value [" + enumValue + "] already registered. Can't register [" + classNamespace + "] with the same enum-value.";
            this.Registry.AddShape(enumValue, classNamespace);
        };
        /**
         * registers new ConnectionDrawer.
         * @param enumValue
         * @param namespaceString
         */
        NamespaceRegistrator.prototype.RegisterConnectionDrawer = function (enumValue, classNamespace) {
            if (this.Registry.ConnectionDrawer[enumValue])
                throw "ConnectionDrawer with enum-value [" + enumValue + "] already registered. Can't register [" + classNamespace + "] with the same enum-value.";
            this.Registry.AddConnectionDrawer(enumValue, classNamespace);
        };
        return NamespaceRegistrator;
    }());
    flowchart.NamespaceRegistrator = NamespaceRegistrator;
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    /**
     * handles all the selection
     */
    var SelectionManager = (function () {
        function SelectionManager(eventHandler, options, flowchartModel) {
            var _this = this;
            this.eventHandler = eventHandler;
            this.options = options;
            this.flowchartModel = flowchartModel;
            this.SelectedElements = [];
            this.IsCtrl = false;
            this.IsMouseHold = false;
            this.isMouseUp = false;
            this.eventHandler.Register(flowchart.constants.EventType.OnClick, function (param) {
                if (_this.IsMouseHold)
                    return false;
                if (param instanceof flowchart.model.EventParamConnection) {
                    _this.SelectionChanged(param.ShapeConnection);
                }
                else if (param instanceof flowchart.model.EventParamShape) {
                    _this.SelectionChanged(param.Shape);
                }
                else {
                    console.warn("element [" + param + "] shouldn't be selectable...");
                    return false;
                }
                return true;
            });
            document.body.onkeydown = function (event) {
                _this.IsCtrl = event.keyCode === 17; //17=ctrl
                if (event.keyCode == 46) {
                    if (_this.SelectedElements.length === 0)
                        return false;
                    var shapes = [];
                    var connections = [];
                    //iterate through all selected elements and throw the before and after events.
                    for (var _i = 0, _a = _this.SelectedElements; _i < _a.length; _i++) {
                        var element = _a[_i];
                        if (element instanceof flowchart.connection.ShapeConnection) {
                            connections.push(element);
                        }
                        else if (element instanceof flowchart.shape.ShapeBase) {
                            shapes.push(element);
                        }
                    }
                    if (_this.eventHandler.Notify(flowchart.constants.EventType.BeforeDelete, new flowchart.model.EventParamDeleteList(shapes, connections)) === false)
                        return false;
                    //delete elements
                    _this.DeleteElements();
                    _this.eventHandler.Notify(flowchart.constants.EventType.AfterDelete, new flowchart.model.EventParamDeleteList(shapes, connections));
                }
            };
            document.body.onkeyup = function (event) {
                _this.IsCtrl = false;
            };
            //**these onmousedown/onmouseup are for finding out if the mouse is hold or clicked.
            var timeout;
            document.body.onmousedown = function () {
                _this.IsMouseHold = false;
                _this.isMouseUp = false;
                timeout = setTimeout(function () {
                    _this.IsMouseHold = !_this.isMouseUp;
                }, 200); // 
            };
            document.body.onmouseup = function () {
                clearTimeout(timeout);
                _this.isMouseUp = true;
            };
            //**
        }
        SelectionManager.prototype.DeleteElements = function () {
            var element;
            for (var _i = 0, _a = this.SelectedElements; _i < _a.length; _i++) {
                element = _a[_i];
                var id = element.Id;
                // ReSharper disable once ConditionIsAlwaysConst
                // ReSharper disable once HeuristicallyUnreachableCode
                if (element instanceof flowchart.shape.ShapeBase) {
                    //Delete connections from paper.
                    var c;
                    for (var _b = 0, _c = element.Connections; _b < _c.length; _b++) {
                        c = _c[_b];
                        c.Delete();
                    }
                    //delete connections from model.
                    this.flowchartModel.DeleteShape(element);
                }
                else if (element instanceof flowchart.connection.ShapeConnection) {
                    this.flowchartModel.DeleteConnections([element]);
                }
                element.Delete();
            }
        };
        /**
         * selection changed. check which elements to select/unselect
         * @param param
         */
        SelectionManager.prototype.SelectionChanged = function (element) {
            console.log("isCtrl=" + this.IsCtrl);
            console.log("count selected=" + this.SelectedElements.length);
            var e;
            if (this.IsCtrl) {
                var pos = -1;
                for (var i = 0; i < this.SelectedElements.length; i++) {
                    var e_1 = this.SelectedElements[i];
                    if (e_1.Id == element.Id) {
                        pos = i;
                        break;
                    }
                }
                if (pos > -1) {
                    if (this.NotifySelectionChanged(flowchart.constants.EventType.BeforeUnselect, element) === false)
                        return false;
                    element.OnUnselect(this.options);
                    this.SelectedElements.splice(pos, 1); //remove from list;
                    this.NotifySelectionChanged(flowchart.constants.EventType.AfterUnselect, element);
                    return true;
                }
                if (this.NotifySelectionChanged(flowchart.constants.EventType.BeforeSelect, element) === false)
                    return false;
                element.OnSelect(this.options);
                this.NotifySelectionChanged(flowchart.constants.EventType.AfterSelect, element);
                this.SelectedElements.push(element);
            }
            else {
                var isSelected = false;
                for (var _i = 0, _a = this.SelectedElements; _i < _a.length; _i++) {
                    e = _a[_i];
                    if (this.NotifySelectionChanged(flowchart.constants.EventType.BeforeUnselect, e) === false)
                        return false;
                    e.OnUnselect(this.options);
                    this.NotifySelectionChanged(flowchart.constants.EventType.AfterUnselect, e);
                    if (e.Id == element.Id)
                        isSelected = true;
                }
                this.SelectedElements = [];
                if (isSelected)
                    return true; //is selected. nothing to do because it was unselected above already.
                if (this.NotifySelectionChanged(flowchart.constants.EventType.BeforeSelect, element) === false)
                    return false;
                element.OnSelect(this.options);
                this.NotifySelectionChanged(flowchart.constants.EventType.AfterSelect, element);
                this.SelectedElements.push(element);
            }
            return true;
        };
        SelectionManager.prototype.NotifySelectionChanged = function (type, element) {
            var eData = (element instanceof flowchart.shape.ShapeBase)
                ? new flowchart.model.EventParamShape(element)
                : new flowchart.model.EventParamConnection(element);
            if (this.eventHandler.Notify(type, eData) === false)
                return false;
        };
        return SelectionManager;
    }());
    flowchart.SelectionManager = SelectionManager;
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var shape;
    (function (shape) {
        var ConnectionPoint = (function (_super) {
            __extends(ConnectionPoint, _super);
            function ConnectionPoint(type, position, width, height) {
                if (width === void 0) { width = 30; }
                if (height === void 0) { height = 30; }
                _super.call(this, "", flowchart.constants.ShapeType.ConnectionPoint, width, height, null, "");
                this.PointType = type;
                this.Position = position;
                var t = flowchart.constants.ConnectionPointType;
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
            ConnectionPoint.prototype.DrawShape = function (paper, posX, posY) {
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
                if (this.PointType != flowchart.constants.ConnectionPointType.Incoming) {
                    //add cursor:pointer because these points are draggable
                    element.attr({ cursor: "crosshair" });
                }
                return element;
            };
            ConnectionPoint.prototype.GetPosition = function () {
                return new flowchart.model.ShapePosition(this.RaphaelElement.attr("cx"), this.RaphaelElement.attr("cy"));
                //return { x: this.RaphaelElement.attr("cx"), y: this.RaphaelElement.attr("cy") };
            };
            ConnectionPoint.prototype.SetPosition = function (posX, posY) {
                this.RaphaelElement.attr({ cx: posX, cy: posY });
            };
            ConnectionPoint.prototype.GetMetadataDiv = function () {
                return null;
            };
            ConnectionPoint.prototype.CreateCopy = function () {
                //var parentShape = this.RaphaelElement.data("shape");
                var connectionPoint = new ConnectionPoint(this.PointType, this.Position, this.Width, this.Height);
                connectionPoint.RaphaelElement = this.RaphaelElement.clone();
                return connectionPoint;
            };
            ConnectionPoint.prototype.OnSelect = function () {
            };
            ConnectionPoint.prototype.OnUnselect = function () {
            };
            return ConnectionPoint;
        }(shape.ShapeBase));
        shape.ConnectionPoint = ConnectionPoint;
    })(shape = flowchart.shape || (flowchart.shape = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var shape;
    (function (shape) {
        var metadata;
        (function (metadata) {
            var Html = (function () {
                function Html(label, icon) {
                    if (icon === void 0) { icon = ""; }
                    this.Label = label;
                    this.Icon = icon;
                    this.CreateHtml();
                }
                Html.prototype.CreateHtml = function () {
                    var htmlElement = document.createElement("div");
                    htmlElement.style.width = "100%";
                    htmlElement.style.height = "100%";
                    //htmlElement.style.position = "absolute";
                    htmlElement.innerHTML =
                        "   <div>" + this.Label + "</div>";
                    this.Html = htmlElement;
                };
                /**
                 * Set the containing HTML
                 * @param htmlElement
                 */
                Html.prototype.SetHtml = function (htmlElement) {
                    this.Html = htmlElement;
                };
                /**
                 * Set the containing HTML with string
                 * @param innerHtml
                 */
                Html.prototype.SetHtmlText = function (innerHtml) {
                    this.Html.innerHTML = innerHtml;
                };
                /**
                 * returns the metadata as HTMLElement
                 */
                Html.prototype.GetHtml = function () {
                    return this.Html;
                };
                return Html;
            }());
            metadata.Html = Html;
        })(metadata = shape.metadata || (shape.metadata = {}));
    })(shape = flowchart.shape || (flowchart.shape = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var shape;
    (function (shape) {
        var Terminal = (function (_super) {
            __extends(Terminal, _super);
            function Terminal(id, width, height, metadata) {
                if (metadata === void 0) { metadata = null; }
                _super.call(this, id, flowchart.constants.ShapeType.Terminal, width, height, metadata, "shape_terminal");
            }
            Terminal.prototype.DrawShape = function (paper, posX, posY) {
                var path = this.CalculatePath(posX, posY, this.Width, this.Height);
                var raphaelElement = paper.path(path);
                raphaelElement.attr({ x: posX, y: posY });
                raphaelElement.attr(this.RaphaelAttr);
                return raphaelElement;
            };
            Terminal.prototype.CalculatePath = function (posX, posY, width, height) {
                var r1 = 20, r2 = 20, r3 = 20, r4 = 20;
                var array = [];
                array = array.concat(["M", posX + r1, posY]);
                array = array.concat(['l', width - r1 - r2, 0]); //T
                array = array.concat(["q", r2, 0, r2, r2]); //TR
                array = array.concat(['l', 0, height - r3 - r2]); //R
                array = array.concat(["q", 0, r3, -r3, r3]); //BR
                array = array.concat(['l', -width + r4 + r3, 0]); //B
                array = array.concat(["q", -r4, 0, -r4, -r4]); //BL
                array = array.concat(['l', 0, -height + r4 + r1]); //L
                array = array.concat(["q", 0, -r1, r1, -r1]); //TL
                array = array.concat(["z"]); //end
                return array.join(" ");
            };
            //overridden
            Terminal.prototype.GetMetadataDiv = function () {
                var element = document.createElement("div");
                element.classList.add(this.CssBackgroundClass);
                return element;
            };
            Terminal.prototype.GetPosition = function () {
                return new flowchart.model.ShapePosition(this.RaphaelElement.attr("x"), this.RaphaelElement.attr("y"));
                //return { x: this.RaphaelElement.attr("x"), y: this.RaphaelElement.attr("y") };
            };
            Terminal.prototype.SetPosition = function (posX, posY) {
                var path = this.CalculatePath(posX, posY, this.Width, this.Height);
                this.RaphaelElement.node.setAttribute("d", path);
                this.RaphaelElement.attr({ x: posX, y: posY });
            };
            Terminal.prototype.OnSelect = function (options) {
                this.RaphaelElement.data("origStroke", this.RaphaelElement.attr("stroke"));
                this.RaphaelElement.attr("stroke", options.ColorSelectedShape);
            };
            Terminal.prototype.OnUnselect = function (options) {
                var color = this.RaphaelElement.data("origStroke");
                this.RaphaelElement.attr("stroke", color);
            };
            return Terminal;
        }(shape.ShapeBase));
        shape.Terminal = Terminal;
    })(shape = flowchart.shape || (flowchart.shape = {}));
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    var ShapeConnector = (function () {
        function ShapeConnector(paper, options, eventHandler) {
            this.paper = paper;
            this.options = options;
            this.eventHandler = eventHandler;
            this.connectionCounter = 0;
        }
        ShapeConnector.prototype.GetConnectionPoint = function (shape, position) {
            var s;
            for (var _i = 0, _a = shape.ConnectionPoints; _i < _a.length; _i++) {
                s = _a[_i];
                if (s.Position == position)
                    return s;
            }
            throw "Shape has not connection-point at position " + position;
        };
        /**
         * connects two shapes
         * @param shapeFrom
         * @param shapeTo
         * @param fromConnectionPointPosition
         * @param toConnectionPointPosition
         */
        ShapeConnector.prototype.Connect = function (shapeFrom, shapeTo, fromConnectionPointPosition, toConnectionPointPosition) {
            var connectionPointFrom = this.GetConnectionPoint(shapeFrom, fromConnectionPointPosition);
            var connectionPointTo = this.GetConnectionPoint(shapeTo, toConnectionPointPosition);
            var color = connectionPointFrom.RaphaelElement.attr("fill");
            var conn = this.ConnectShapes(connectionPointFrom.RaphaelElement, connectionPointTo.RaphaelElement, color, color, 3);
            var connectionType = (connectionPointFrom.PointType == flowchart.constants.ConnectionPointType.OutgoingTrueSuccess) ? flowchart.constants.ConnectionType.TrueSucces : flowchart.constants.ConnectionType.FalseError;
            this.connectionCounter++;
            var connectionId = "conn_" + this.connectionCounter;
            var newConnection = new flowchart.connection.ShapeConnection(connectionId, shapeFrom, shapeTo, connectionType, connectionPointFrom, connectionPointTo, conn);
            this.AddEventsToConnectionLine(conn, newConnection);
            //adding references to the shapes that they know their connections.
            shapeFrom.AddConnection(newConnection);
            shapeTo.AddConnection(newConnection);
            return conn;
        };
        ShapeConnector.prototype.AddEventsToConnectionLine = function (raphaelConnection, shapeConnection) {
            var _this = this;
            //add event on inner and outerline of the connection
            raphaelConnection.InnerLine.click(function () {
                _this.eventHandler.Notify(flowchart.constants.EventType.OnClick, new flowchart.model.EventParamConnection(shapeConnection));
            });
            raphaelConnection.OuterLine.click(function () {
                _this.eventHandler.Notify(flowchart.constants.EventType.OnClick, new flowchart.model.EventParamConnection(shapeConnection));
            });
        };
        ShapeConnector.prototype.RefreshConnection = function (c) {
            var innerColor = c.InnerLine.attr("stroke") ? c.InnerLine.attr("stroke") : c.InnerColor;
            var outerColor = c.OuterLine.attr("stroke") ? c.OuterLine.attr("stroke") : c.OuterColor;
            this.ConnectShapes(c.ShapeFrom, c.ShapeTo, innerColor, outerColor, c.Thickness, c);
        };
        ShapeConnector.prototype.ConnectShapes = function (shapeFrom, shapeTo, innerColor, outerColor, thickness, existingConnection) {
            if (thickness === void 0) { thickness = 3; }
            if (existingConnection === void 0) { existingConnection = null; }
            var connection = this.options.ShapeConnection;
            return connection.Draw(shapeFrom, shapeTo, innerColor, outerColor, thickness, existingConnection);
        };
        return ShapeConnector;
    }());
    flowchart.ShapeConnector = ShapeConnector;
})(flowchart || (flowchart = {}));
var flowchart;
(function (flowchart) {
    /**
     * responsible for handling the moving of shapes and connections.
     */
    var ShapeMover = (function () {
        function ShapeMover(_connector, paper, options, eventHandler) {
            this._connector = _connector;
            this.options = options;
            this.eventHandler = eventHandler;
            this.Paper = paper;
        }
        /**
         * registers an shape to be draggable
         * @param shape
         */
        ShapeMover.prototype.Register = function (shape) {
            //add events for dragging, mouseover and mouseout
            shape.RaphaelElement.drag(this.GetOnMoveStart(shape), this.GetDragger(shape), this.GetOnMoveFinished(shape));
            shape.RaphaelElement.mouseover(this.GetOnMouseOver(shape));
            shape.RaphaelElement.mouseout(this.GetOnMouseOut(shape));
            var cp;
            //add drag&drop for each connection-point,too
            for (var _i = 0, _a = shape.ConnectionPoints; _i < _a.length; _i++) {
                cp = _a[_i];
                switch (cp.PointType) {
                    case flowchart.constants.ConnectionPointType.OutgoingTrueSuccess:
                    case flowchart.constants.ConnectionPointType.OutgoingFalseError:
                        cp.RaphaelElement.drag(this.GetOnMoveStart(cp), this.GetDragger(cp), this.GetOnMoveFinished(cp));
                        break;
                    case flowchart.constants.ConnectionPointType.Incoming:
                        cp.RaphaelElement.mouseover(this.GetOnMouseOver(cp));
                        cp.RaphaelElement.mouseout(this.GetOnMouseOut(cp));
                        break;
                    default:
                }
            }
        };
        /**
         * checks if the given element is of type ConnectionPoint
         * @param element
         */
        ShapeMover.prototype.IsConnectionPoint = function (element) {
            return element && element.data("shape").Type === flowchart.constants.ShapeType.ConnectionPoint;
        };
        /**
         * checks if the given connectionpoint is of any of the supplied types.
         * @param connectionPointShape
         * @param types
         */
        ShapeMover.prototype.IsConnectionPointType = function (connectionPointShape, types) {
            if (!this.IsConnectionPoint(connectionPointShape.RaphaelElement))
                return false;
            var point = (connectionPointShape);
            console.log(point.PointType);
            for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                var type = types_1[_i];
                if (point.PointType == type)
                    return true;
            }
            return false;
        };
        /**
         * will be called when dragging started and while it is dragging
         * @param shape
         */
        ShapeMover.prototype.GetOnMoveStart = function (shape) {
            var self = this;
            return function (dx, dy, x, y, event) {
                //moves the shape to new x,y coordinates
                shape.OnMove(dx, dy);
                var c;
                //redraw all depending connections
                for (var _i = 0, _a = shape.Connections; _i < _a.length; _i++) {
                    c = _a[_i];
                    self._connector.RefreshConnection(c.RaphaelConnection);
                }
                //redraw drag-connection if a connection dragged
                if (self.IsConnectionPoint(this)) {
                    self._connector.RefreshConnection(self.DragConnection);
                }
                return this;
            };
        };
        /**
         * will be called when dragging has finished
         * @param shape
         */
        ShapeMover.prototype.GetOnMoveFinished = function (shape) {
            var self = this;
            return function (DragEvent) {
                //is not ConnectionPoint? then its a shape.
                if (!self.IsConnectionPoint(this)) {
                    var eventData = new flowchart.model.EventParamShape(this.data("shape"));
                    self.eventHandler.Notify(flowchart.constants.EventType.AfterShapeMoved, eventData);
                    return;
                }
                //remove drag-connection.
                self.DragConnection.RemoveFromPaper();
                //remove temporarily created placehholder-connectionpoint
                self.PlaceholderConnectionPoint.RaphaelElement.remove();
                self.PlaceholderConnectionPoint = null;
                self.DragFromConnectionPoint = null;
                self.DragConnection = null;
                var fromConnectionPoint = this.data("shape");
                //move back dragged connection-point to original-position
                fromConnectionPoint.SetPosition(this.ox, this.oy);
                if (self.CurrentOverShape == null)
                    return;
                this.toFront();
                //Only allow dragg-to incoming-connection-types.
                if (self.IsConnectionPointType(self.CurrentOverShape, [flowchart.constants.ConnectionPointType.Incoming])) {
                    //check, if connection already exits. if true, no other connection is allowed and animation will not start.
                    if (!self.IsConnectionAllowed(fromConnectionPoint, self.CurrentOverShape))
                        return;
                    //create the connection
                    var toShapeConnectionPoint = self.CurrentOverShape;
                    var fromShape = fromConnectionPoint.ParentShape;
                    var toShape = toShapeConnectionPoint.ParentShape;
                    var connectionType = (fromConnectionPoint.PointType == flowchart.constants.ConnectionPointType.OutgoingTrueSuccess) ? flowchart.constants.ConnectionType.TrueSucces : flowchart.constants.ConnectionType.FalseError;
                    //create event-param.
                    var eventParam = new flowchart.model.EventParamConnection(new flowchart.connection.ShapeConnection("", fromShape, toShape, connectionType, fromConnectionPoint, toShapeConnectionPoint, null));
                    if (self.eventHandler.Notify(flowchart.constants.EventType.BeforeConnectionCreated, eventParam) === false)
                        return;
                    var conn = self._connector.Connect(fromConnectionPoint.ParentShape, toShapeConnectionPoint.ParentShape, fromConnectionPoint.Position, toShapeConnectionPoint.Position);
                    //Adding raphaelconnection to the evenparam. now its available.
                    eventParam.ShapeConnection.RaphaelConnection = conn;
                    self.eventHandler.Notify(flowchart.constants.EventType.AfterConnectionCreated, eventParam);
                }
            };
        };
        /**
         * will be called right before dragging starts
         * @param shape
         */
        ShapeMover.prototype.GetDragger = function (shape) {
            //Example: http://jsfiddle.net/CHUrB/
            var self = this;
            return function (x, y, event) {
                // Original coords for main element
                self.CurrentDraggedShapeType = shape.Type;
                shape.BeforeMove(x, y);
                if (self.IsConnectionPoint(this)) {
                    var s = shape;
                    self.DragFromConnectionPoint = shape;
                    //create a placeholder-connectionpoint while dragging the original somewhere else.
                    //this will be removed after dragging has finished
                    self.PlaceholderConnectionPoint = s.CreateCopy();
                    var color = this.attr("fill");
                    var attr = { "stroke-dasharray": ["-"], "arrow-end": "classic" };
                    self.DragConnection = self.options.ShapeConnection.Draw(self.PlaceholderConnectionPoint.RaphaelElement, this, color, color, 5);
                    self.DragConnection.InnerLine.attr(attr);
                    self.DragConnection.OuterLine.attr(attr);
                    this.toBack(); //otherwise the mouseover will not fire correctly on target
                }
                else {
                    var eventData = new flowchart.model.EventParamShape(this.data("shape"));
                    self.eventHandler.Notify(flowchart.constants.EventType.BeforeShapeMoved, eventData);
                }
            };
        };
        /**
         * will be called when mouse leaves an shape
         * @param shape
         */
        ShapeMover.prototype.GetOnMouseOver = function (shape) {
            var self = this;
            return function () {
                self.CurrentOverShape = shape;
                //is current shape an connection point and in drag-mode?
                if (self.IsConnectionPoint(this) && self.IsDragging() && self.IsConnectionPointType(shape, [flowchart.constants.ConnectionPointType.Incoming])) {
                    //check, if connection already exits. if true, no other connection is allowed and animation will not start.
                    if (!self.IsConnectionAllowed(self.DragFromConnectionPoint, self.CurrentOverShape))
                        return;
                    //this is just for animate the incoming-connection-point
                    var color = this.attr("fill");
                    var attr = { fill: color, r: 20 };
                    this.toFront();
                    this.animate(Raphael.animation({ r: attr["r"] }, 250));
                }
            };
        };
        /**
         * will be called when mouse is over and shape.
         * @param shape
         */
        ShapeMover.prototype.GetOnMouseOut = function (shape) {
            var self = this;
            return function () {
                //self.CurrentOverShape = null;
                var _this = this;
                //current shape is connectionpoint and in drag-mode?
                if (self.IsConnectionPoint(this)) {
                    var color = this.attr("fill");
                    var attr = { fill: color, r: 5 };
                    //animation to shrink connectionpoint to original size.
                    var animate = Raphael.animation({ r: attr["r"] }, 250, null, function () {
                        //still in dragmode? nothing to do because user has not finished dragging.
                        if (self.IsDragging())
                            return;
                        var parent = _this.data("shape").ParentShape;
                        var id = parent.Id;
                        var c;
                        for (var _i = 0, _a = parent.Connections; _i < _a.length; _i++) {
                            c = _a[_i];
                            //iterate through connection to refresh connection to this destinationpoint.
                            //this is needed because of the animation the connection would point to the "big"(animated) connection-point instead of the "small" (non animated) one
                            if (c.ShapeTo.Id == id) {
                                self._connector.RefreshConnection(c.RaphaelConnection);
                            }
                        }
                    });
                    this.animate(animate);
                }
            };
        };
        /**
         * returns true, if user is currently dragging an connection.
         */
        ShapeMover.prototype.IsDragging = function () {
            return this.DragConnection != null;
        };
        /**
         * checks if a connection between two shapes already exists
         * @param shapeFrom
         * @param shapeTo
         */
        ShapeMover.prototype.IsConnectionAllowed = function (connectionPointFrom, connectionPointTo) {
            var parentFrom = connectionPointFrom.ParentShape;
            var parentTo = connectionPointTo.ParentShape;
            //parent-from and parent-to is the same shape? not allowed.
            if (parentFrom.Id == parentTo.Id)
                return false;
            //check if connection already exists.
            var c;
            for (var _i = 0, _a = parentFrom.Connections; _i < _a.length; _i++) {
                c = _a[_i];
                //shapes are already connected and connection comes from the same type (success,error)?
                if (c.ShapeTo.Id == parentTo.Id && c.ConnectionPointFrom.PointType == connectionPointFrom.PointType) {
                    return false;
                }
            }
            return true;
        };
        return ShapeMover;
    }());
    flowchart.ShapeMover = ShapeMover;
})(flowchart || (flowchart = {}));
/*!
* TKO.FlowchartDesigner v1.0.1.0
* License: MIT
* Created By: Tobias Koller
* Git: https://github.com/TobiasKoller/tko.flowchartdesigner
*/ 
//# sourceMappingURL=tko.flowchart.js.map