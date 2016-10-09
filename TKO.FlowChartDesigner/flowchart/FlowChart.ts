module flowchart {
    "use strict";

    /**
     * Handles the whole flowchart.
     */
    export class FlowChart {

        private drawer: Drawer;
        private mover: ShapeMover;
        private connector: ShapeConnector;
        private eventHandler: EventHandler;
        private selectionManager: SelectionManager;
        private model: model.FlowChartModel;
        private namespaceRegistrator: NamespaceRegistrator;
        private options: FlowChartOptions;

        constructor(htmlElementId: string, options?: FlowChartOptions, width?:number, height?:number) {

            if (!options)
                options = new FlowChartOptions();

            var htmlElement = document.getElementById(htmlElementId);
            if (!htmlElement)
                throw "Element with id ["+htmlElementId+"] not found.";

            var wrapperId = this.CreateWrapperDiv(htmlElement, htmlElementId);
            

            this.options = options;
            this.eventHandler = new EventHandler();

            this.namespaceRegistrator = new NamespaceRegistrator();
            this.model = new model.FlowChartModel();
            this.drawer = new Drawer(options, this.eventHandler);
            this.drawer.Initialize(htmlElementId, wrapperId, width, height);

            this.SetSvgId(wrapperId, htmlElementId);

            options.Init(this.drawer.Paper);

            this.selectionManager = new SelectionManager(this.eventHandler, options, this.model);
            this.connector = new ShapeConnector(this.drawer.Paper, options, this.eventHandler);
            this.mover = new ShapeMover(this.connector, this.drawer.Paper, options, this.eventHandler);


            
            this.CheckCanvasPosition();
            //document.body.onkeydown = (event) => {
            //    console.log(event);
            //};

        }



        /**
         * checks the position of the divs and updates them if anything moved on the page.
         */
        private CheckCanvasPosition() {
            setTimeout(() => {
                this.drawer.UpdateWrapperPosition(this.model.Shapes);
                this.CheckCanvasPosition();
            }, 1000);
        }

        /**
         * will create a wrapper inside the html-Element.
         * this will enable the possibility to mix svg and html-elements including z-indexing. (put svg over html-absolute-positioned elements)
         * @param parentId
         */
        private CreateWrapperDiv(parentElement:HTMLElement, parentId:string):string {

            var wrapperId = "__wrapper__" + parentId;
            var wrapperDiv: HTMLDivElement = document.createElement("div");
            wrapperDiv.id = wrapperId;
            wrapperDiv.style.cssText = "width:100%;height: 100%;margin: 0;padding: 0;position:relative;z-index:1000;border:1px solid blue";

            parentElement.appendChild(wrapperDiv);

            return wrapperId;
        }

        /**
         * sets an individual id for the svg that we can easily access it.
         * @param parentId
         * @param canvasId
         */
        SetSvgId(parentId: string, canvasId) {

            var svgs = document.getElementsByTagName("svg");

            for (var i = 0; i < svgs.length; i++) {
                var svg: any = svgs[i];

                if (svg && svg.parentElement && svg.parentElement.id == parentId) {
                    svg.id = "__svg__" + canvasId;
                }
            }

        }

        /**
         * Removes everything from the flowchart and the underlying model.
         */
        Clear() {

            var shape: shape.ShapeBase;
            for (shape of this.model.Shapes) {
                shape.Delete();

                var c: connection.ShapeConnection;
                for (c of shape.Connections) {
                    c.Delete();
                }
            }
            this.model.Shapes = [];
        }

        /**
         * Exports the Model in a format which can be used to load it after words again.
         */
        Export():model.ExportModel {
            return this.model.Export();
        }



        /**
         * Loads the given Model into the Flowchart
         * @param model
         */
        Load(model:model.ExportModel) {

            this.options.EnableEvents = false;

            this.Clear();

            var loader = new ModelLoader(this, this.namespaceRegistrator);
            loader.Load(model);

            this.options.EnableEvents = true;
        }

        /**
         * checks if the shapeId is unique.
         * @param shapeId
         */
        CheckShapeId(shapeId:string) :boolean {

            for (var s of this.model.Shapes) {
                if (s.Id == shapeId)
                    return false;
            }

            return true;
        }
        
        /**
         * Adds a new shape to the flowchart.
         * @param shape Shape of type flowchart.shape.xxx
         * @param posX Position X of the shape on the canvas.
         * @param posY Position Y of the shape on the canvas.
         */
        AddShape(shape: shape.ShapeBase, posX:number, posY:number) {

            if (!shape)
                throw "No Shape defined.";

            if (shape.Id == null || shape.Id.trim().length === 0)
                throw "No shape.Id defined.";

            if (!this.CheckShapeId(shape.Id))
                throw "The shapeId ["+shape.Id+"] already exists.";

            
            this.drawer.AddShape(shape, posX, posY);
            this.mover.Register(shape);

            this.model.Shapes.push(shape);

            shape.RaphaelElement.click(() => {
                this.eventHandler.Notify(constants.EventType.OnClick, new model.EventParamShape(shape));
            });

            shape.RaphaelElement.dblclick(() => {
                this.eventHandler.Notify(constants.EventType.OnDoubleClick, new model.EventParamShape(shape));
            });


        }

        /**
         * Updates the metadata of the shape.
         * This method has also to be called when you change the CssContentClass of an shape (f.e. to give some shapes another colour at runtime).
         * @param shape
         * @param metadata
         */
        UpdateShapeMetadata(shape: shape.ShapeBase, metadata?: shape.metadata.IShapeMetadata) {

            if (!metadata)
                metadata = shape.Metadata;

            this.drawer.UpdateMetadata(shape, metadata);
        }

        /**
         * Connects two shapes
         * @param shapeFrom
         * @param shapeTo
         * @param fromConnectionPointPosition
         * @param toConnectionPointPosition
         */
        ConnectShapes(shapeFrom: shape.ShapeBase, shapeTo: shape.ShapeBase, fromConnectionPointPosition: constants.ConnectionPointPosition, toConnectionPointPosition: constants.ConnectionPointPosition) {

            var connection = this.connector.Connect(shapeFrom,shapeTo, fromConnectionPointPosition, toConnectionPointPosition);

        }

        /**
         * Adds an eventlistener to the canvas.
         * All eventtypes are listed in flowchart.constants.EventType
         * @param eventType Type of the Event. flowchart.constants.EventType
         * @param callback Function which will be called when the event is fired.
         * All "Before"-Events can abort the process by simply returning false.
         */
        AddEventListener(eventType: constants.EventType, callback: (eventArgs:any) => boolean) {
            this.eventHandler.Register(eventType, callback);
        }

        /**
        * Returns the shape with the given Id. Otherwise null.
        * @param shapeId
        */
        GetShape(shapeId: string): shape.ShapeBase {
            for (var shape of this.model.Shapes) {
                if (shape.Id == shapeId)
                    return shape;
            }

            return null;
        }


        /**
         * Register new custom shapes for this instance.
         * @param enumValue unique number for the shape. this will be used internally to register the shape
         * @param classNamespace Namespace to the new shape-class. f.e. "flowchart.shape.Decision"
         */
        RegisterShape(enumValue: number, classNamespace: string){
            this.namespaceRegistrator.RegisterShape(enumValue, classNamespace);
        }


        /**
         * Register new ConnectionDrawer for this instance.
         * @param enumValue unique number for the connection-drawer. this will be used internally to register the drawer
         * @param classNamespace Namespace to the new connection-drawer-class. f.e. "flowchart.connection.drawer.Curved"
         */
        RegisterConnectionDrawer(enumValue: number, classNamespace:  string) {
            this.namespaceRegistrator.RegisterConnectionDrawer(enumValue, classNamespace);
        }

        
        private CheckShapeHasRaphaelElement(shape: shape.IShape) {
            if (!shape)
                throw "Parameter shape is null";

            if (!shape.RaphaelElement)
                throw "shape.RaphaelElement is null";
        }
    }
}