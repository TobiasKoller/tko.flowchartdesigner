declare module flowchart.shape {
    interface IShape {
        Width: number;
        Height: number;
        Id: string;
        Type: constants.ShapeType;
        CssBackgroundClass: string;
        CssContentClass: string;
        RaphaelElement: RaphaelElement;
        RaphaelMetadata: SVGForeignObjectElement;
        RaphaelAttr: any;
        Metadata: shape.metadata.IShapeMetadata;
        ParentShape: ShapeBase;
        ConnectionPoints: shape.ConnectionPoint[];
        Connections: connection.ShapeConnection[];
        GetContainingElements(): any[];
        BeforeMove(x: number, y: number): any;
        SetRaphaelShapeReference(): any;
        OnMove(x: number, y: number): any;
        AddConnectionPoints(connectionPoints: ConnectionPoint[]): any;
        AddConnection(connection: connection.ShapeConnection): any;
        CalculateConnectionPointCoord(position: constants.ConnectionPointPosition, pointWidth: number, pointHeight: number): any;
        DrawShape(paper: RaphaelPaper, posX: number, posY: number): any;
        GetMetadataDiv(): HTMLDivElement;
        GetPosition(): model.ShapePosition;
        SetPosition(x: number, y: number): any;
    }
}
declare module flowchart.constants {
    enum ShapeType {
        Terminal = 1,
        Process = 2,
        Decision = 3,
        ConnectionPoint = 4,
    }
}
declare module flowchart.model {
    abstract class BaseElement {
        Id: string;
    }
}
declare module flowchart.model {
    abstract class SelectableElement extends BaseElement {
        abstract OnSelect(options: FlowChartOptions): any;
        abstract OnUnselect(options: FlowChartOptions): any;
        abstract Delete(): any;
    }
}
declare module flowchart.shape {
    abstract class ShapeBase extends model.SelectableElement implements IShape {
        Width: number;
        Height: number;
        Type: constants.ShapeType;
        CssContentClass: string;
        CssBackgroundClass: string;
        RaphaelElement: RaphaelElement;
        RaphaelMetadata: SVGForeignObjectElement;
        RaphaelAttr: any;
        Metadata: shape.metadata.IShapeMetadata;
        ParentShape: ShapeBase;
        ConnectionPoints: shape.ConnectionPoint[];
        Connections: connection.ShapeConnection[];
        constructor(id: string, type: constants.ShapeType, width: any, height: any, metadata: shape.metadata.IShapeMetadata, cssClassPrefix: string);
        GetContainingElements(): any[];
        BeforeMove(x: number, y: number): void;
        SetRaphaelShapeReference(): void;
        OnMove(x: number, y: number): void;
        /**
         * Adds connectionpoint to the shape and adds a reference from each point to the parent shape.
         * @param connectionPoints
         */
        AddConnectionPoints(connectionPoints: ConnectionPoint[]): void;
        AddConnection(connection: connection.ShapeConnection): void;
        /**
         * calculates the position coordinates of the connectionpoint depending on the parent shape.
         * Default is always centered in the middle of the line.
         * @param position
         * @param parentShape
         * @param pointWidth
         * @param pointHeight
         */
        CalculateConnectionPointCoord(position: constants.ConnectionPointPosition, pointWidth: number, pointHeight: number): any;
        Delete(): void;
        SetCssContentClass(className: string): void;
        abstract DrawShape(paper: RaphaelPaper, posX: number, posY: number): any;
        abstract GetMetadataDiv(): HTMLDivElement;
        abstract GetPosition(): model.ShapePosition;
        abstract SetPosition(x: number, y: number): any;
    }
}
declare module flowchart.shape {
    class Process extends ShapeBase {
        constructor(id: string, width: any, height: any, metadata?: shape.metadata.IShapeMetadata);
        DrawShape(paper: RaphaelPaper, posX: number, posY: number): RaphaelElement;
        GetMetadataDiv(): HTMLDivElement;
        GetPosition(): model.ShapePosition;
        SetPosition(posX: number, posY: number): void;
        OnSelect(options: FlowChartOptions): void;
        OnUnselect(options: FlowChartOptions): void;
    }
}
declare module flowchart.shape {
    class Decision extends ShapeBase {
        constructor(id: string, width: any, height: any, metadata?: shape.metadata.IShapeMetadata);
        DrawShape(paper: RaphaelPaper, posX: number, posY: number): RaphaelElement;
        private CalculatePath(posX, posY, width, height);
        GetMetadataDiv(): HTMLDivElement;
        GetPosition(): model.ShapePosition;
        SetPosition(posX: number, posY: number): void;
        OnSelect(options: FlowChartOptions): void;
        OnUnselect(options: FlowChartOptions): void;
    }
}
declare module flowchart {
    class Drawer {
        private options;
        private eventHandler;
        Paper: any;
        constructor(options: FlowChartOptions, eventHandler: any);
        Initialize(canvasHtmlName: string, width?: number, height?: number): void;
        AddShape(shape: shape.ShapeBase, posX: number, posY: number): void;
        SetMetadata(shape: shape.ShapeBase, metadata: shape.metadata.IShapeMetadata, posX: number, posY: number): void;
        UpdateMetadata(shape: shape.ShapeBase, metadata: shape.metadata.IShapeMetadata): void;
    }
}
declare module flowchart {
    /**
     * Handles the whole flowchart.
     */
    class FlowChart {
        private drawer;
        private mover;
        private connector;
        private eventHandler;
        private selectionManager;
        private model;
        private namespaceRegistrator;
        constructor(canvas: string, options?: FlowChartOptions, width?: number, height?: number);
        /**
         * Removes everything from the flowchart and the underlying model.
         */
        Clear(): void;
        /**
         * Exports the Model in a format which can be used to load it after words again.
         */
        Export(): model.ExportModel;
        /**
         * Loads the given Model into the Flowchart
         * @param model
         */
        Load(model: model.ExportModel): void;
        /**
         * checks if the shapeId is unique.
         * @param shapeId
         */
        CheckShapeId(shapeId: string): boolean;
        /**
         * Adds a new shape to the flowchart.
         * @param shape Shape of type flowchart.shape.xxx
         * @param posX Position X of the shape on the canvas.
         * @param posY Position Y of the shape on the canvas.
         */
        AddShape(shape: shape.ShapeBase, posX: number, posY: number): void;
        /**
         * Updates the metadata of the shape.
         * This method has also to be called when you change the CssContentClass of an shape (f.e. to give some shapes another colour at runtime).
         * @param shape
         * @param metadata
         */
        UpdateShapeMetadata(shape: shape.ShapeBase, metadata?: shape.metadata.IShapeMetadata): void;
        /**
         * Connects two shapes
         * @param shapeFrom
         * @param shapeTo
         * @param fromConnectionPointPosition
         * @param toConnectionPointPosition
         */
        ConnectShapes(shapeFrom: shape.ShapeBase, shapeTo: shape.ShapeBase, fromConnectionPointPosition: constants.ConnectionPointPosition, toConnectionPointPosition: constants.ConnectionPointPosition): void;
        /**
         * Adds an eventlistener to the canvas.
         * All eventtypes are listed in flowchart.constants.EventType
         * @param eventType Type of the Event. flowchart.constants.EventType
         * @param callback Function which will be called when the event is fired.
         * All "Before"-Events can abort the process by simply returning false.
         */
        AddEventListener(eventType: constants.EventType, callback: (eventArgs: any) => boolean): void;
        /**
        * Returns the shape with the given Id. Otherwise null.
        * @param shapeId
        */
        GetShape(shapeId: string): shape.ShapeBase;
        /**
         * Register new custom shapes for this instance.
         * @param enumValue unique number for the shape. this will be used internally to register the shape
         * @param classNamespace Namespace to the new shape-class. f.e. "flowchart.shape.Decision"
         */
        RegisterShape(enumValue: number, classNamespace: string): void;
        /**
         * Register new ConnectionDrawer for this instance.
         * @param enumValue unique number for the connection-drawer. this will be used internally to register the drawer
         * @param classNamespace Namespace to the new connection-drawer-class. f.e. "flowchart.connection.drawer.Curved"
         */
        RegisterConnectionDrawer(enumValue: number, classNamespace: string): void;
        private CheckShapeHasRaphaelElement(shape);
    }
}
declare var wc: flowchart.FlowChart;
declare var savedModel: any;
declare var $: any;
declare function ShowError(show: any, message: any): void;
declare function UpdateJsonOutput(): void;
declare function ClearModel(): void;
declare function LoadModel(): void;
declare function SaveModel(): void;
declare function AddNewShape(): void;
declare module common {
    class DomHelper {
        /**
         * returns true, if the given class exists.
         * @param className Name of the cssClass
         */
        static CssClassExists(className: string): boolean;
        /**
         * Returns the cssClass from the dom.
         * @param className Name of the cssClass
         */
        static GetCssClass(className: string): CSSStyleRule;
        static CreateCopy(object: any): any;
        static EncodeHtmlEntity(x: any): any;
        /**
         * Create string from HTML entities
         */
        static DecodeHtmlEntity(string: any): string;
    }
}
declare module flowchart.connection.drawer {
    class Curved implements drawer.IConnectionDrawer {
        private paper;
        constructor(paper: RaphaelPaper);
        Draw(raphaelObjectFrom: any, raphaelObjectTo: any, innerColor: string, outerColor: string, thickness?: number, existingConnection?: connection.RaphaelConnection): connection.RaphaelConnection;
    }
}
declare module flowchart.connection.drawer {
    class Elbow implements drawer.IConnectionDrawer {
        Draw(raphaelObjectFrom: any, raphaelObjectTo: any, innerColor: string, outerColor: string, thickness?: number, existingConnection?: connection.RaphaelConnection): connection.RaphaelConnection;
    }
}
declare module flowchart.connection.drawer {
    interface IConnectionDrawer {
        Draw(shapeFrom: any, shapeTo: any, innerColor: string, outerColor: string, thickness?: number, existingConnection?: connection.RaphaelConnection): connection.RaphaelConnection;
    }
}
declare module flowchart.connection.drawer {
    class Straight implements drawer.IConnectionDrawer {
        private paper;
        constructor(paper: RaphaelPaper);
        Draw(raphaelObjectFrom: any, raphaelObjectTo: any, innerColor: string, outerColor: string, thickness?: number, existingConnection?: connection.RaphaelConnection): connection.RaphaelConnection;
    }
}
declare module flowchart.connection {
    class RaphaelConnection {
        private ref;
        InnerLine: RaphaelElement;
        OuterLine: RaphaelElement;
        ShapeFrom: RaphaelElement;
        ShapeTo: RaphaelElement;
        InnerColor: string;
        OuterColor: string;
        Thickness: number;
        constructor(ref: RaphaelPaper, path: string, innerColor: string, outerColor: string, thickness: number, shapeFrom: RaphaelElement, shapeTo: RaphaelElement);
        RemoveFromPaper(): void;
    }
}
declare module flowchart.connection {
    class ShapeConnection extends model.SelectableElement {
        ShapeFrom: shape.ShapeBase;
        ShapeTo: shape.ShapeBase;
        Type: constants.ConnectionType;
        ConnectionPointFrom: shape.ConnectionPoint;
        ConnectionPointTo: shape.ConnectionPoint;
        RaphaelConnection: connection.RaphaelConnection;
        constructor(id: string, shapeFrom: shape.ShapeBase, shapeTo: shape.ShapeBase, type: constants.ConnectionType, posFrom: shape.ConnectionPoint, posTo: shape.ConnectionPoint, raphaelConnection: RaphaelConnection);
        OnSelect(options: FlowChartOptions): void;
        OnUnselect(options: FlowChartOptions): void;
        Delete(): void;
    }
}
declare module flowchart.constants {
    enum ConnectionDrawerType {
        Curved = 0,
        Straight = 1,
        Elbow = 2,
    }
}
declare module flowchart.constants {
    enum ConnectionPointPosition {
        Top = 0,
        Left = 1,
        Right = 2,
        Bottom = 3,
    }
}
declare module flowchart.constants {
    enum ConnectionPointType {
        Incoming = 1,
        OutgoingTrueSuccess = 2,
        OutgoingFalseError = 3,
    }
}
declare module flowchart.constants {
    /**
     * type of the connection between two shapes.
     */
    enum ConnectionType {
        TrueSucces = 1,
        FalseError = 2,
    }
}
declare module flowchart.constants {
    enum EventType {
        OnClick = 1,
        OnDoubleClick = 2,
        BeforeConnectionCreated = 3,
        AfterConnectionCreated = 4,
        BeforeShapeMoved = 5,
        AfterShapeMoved = 6,
        BeforeDelete = 7,
        AfterDelete = 8,
        BeforeSelect = 9,
        AfterSelect = 10,
        BeforeUnselect = 11,
        AfterUnselect = 12,
    }
}
declare module flowchart {
    class EventHandler {
        private listener;
        /**
         * register event
         * @param type
         * @param callback
         * @param id
         */
        Register(type: constants.EventType, callback: (eventArgs: any) => boolean, id?: string): void;
        /**
         * unregister event
         * @param id
         */
        Unregister(id: string): void;
        /**
         * Notifies all event-listener
         * @param type
         * @param eventArgs
         */
        Notify(type: constants.EventType, eventArgs: any): boolean;
    }
}
declare module flowchart {
    class FlowChartOptions {
        ShapeConnectionType: constants.ConnectionDrawerType;
        ShapeConnection: connection.drawer.IConnectionDrawer;
        IsInitialized: boolean;
        ColorSelectedShape: string;
        ColorSelectedConnection: string;
        constructor(shapeConnectionType?: constants.ConnectionDrawerType);
        Init(paper: RaphaelPaper): void;
    }
}
declare module flowchart.model {
    class EventListener {
        Id: string;
        Type: constants.EventType;
        Callback: (eventArgs: any) => boolean;
        constructor(type: constants.EventType, callback: (eventArgs: any) => boolean, id?: string);
    }
}
declare module flowchart.model {
    class EventParamConnection {
        ShapeConnection: connection.ShapeConnection;
        constructor(shapeConnection: connection.ShapeConnection);
    }
}
declare module flowchart.model {
    class EventParamDeleteList {
        Shapes: shape.ShapeBase[];
        Connections: connection.ShapeConnection[];
        constructor(shapes: shape.ShapeBase[], connections: connection.ShapeConnection[]);
    }
}
declare module flowchart.model {
    class EventParamShape {
        Shape: shape.ShapeBase;
        constructor(shape: shape.ShapeBase);
    }
}
declare module flowchart.model {
    class ExportModel {
        Options: FlowChartOptions;
        Shapes: ExportModelShape[];
        Connections: ExportModelConnection[];
    }
}
declare module flowchart.model {
    class ExportModelConnection {
        Id: string;
        Type: constants.ConnectionType;
        ShapeFromId: string;
        ShapeToId: string;
        ConnectionPointFromPos: constants.ConnectionPointPosition;
        ConnectionPointToPos: constants.ConnectionPointPosition;
        constructor(connection: connection.ShapeConnection);
    }
}
declare module flowchart.model {
    class ExportModelConnectionPoint {
        Type: constants.ConnectionPointType;
        Pos: constants.ConnectionPointPosition;
        constructor(connectionPoint: shape.ConnectionPoint);
    }
}
declare module flowchart.model {
    class ExportModelShape {
        Id: string;
        Width: number;
        Height: number;
        Type: constants.ShapeType;
        Metadata: any;
        PosX: number;
        PosY: number;
        ConnectionPoints: ExportModelConnectionPoint[];
        constructor(shape: shape.ShapeBase);
    }
}
declare module flowchart.model {
    class FlowChartModel {
        Shapes: shape.ShapeBase[];
        Export(): ExportModel;
        /**
         * Deletes the shape from the model.
         * @param shape
         */
        DeleteShape(shape: shape.ShapeBase): void;
        /**
         * Deletes all connections in the model.
         * @param connections
         */
        DeleteConnections(connections: connection.ShapeConnection[]): void;
        /**
         * Delete specific connection from the shape.
         * @param shape
         * @param connectionId
         */
        DeleteConnectionFromShape(shape: shape.ShapeBase, connectionId: string): void;
        /**
         * Returns the shape with the given Id. Otherwise null.
         * @param shapeId
         */
        GetShape(shapeId: string): shape.ShapeBase;
    }
}
declare module flowchart.model {
    /**
     * keeps all registered shapes and connection-drawer-namespaces.
     */
    class NamespaceRegistry {
        Shapes: any;
        ConnectionDrawer: any;
        GetShape(enumValue: number): any;
        GetConnectionDrawer(enumValue: number): any;
        /**
         * Add new Shape to the registry.
         * @param enumValue
         * @param classNamespace
         */
        AddShape(enumValue: number, classNamespace: any): void;
        /**
         * Add new ConnectionDrawer to the registry.
         * @param enumValue
         * @param classNamespace
         */
        AddConnectionDrawer(enumValue: number, classNamespace: any): void;
    }
}
declare module flowchart.model {
    class ShapePosition {
        X: number;
        Y: number;
        constructor(x: number, y: number);
    }
}
declare module flowchart {
    class ModelLoader {
        private flowChart;
        private namespaceRegistrator;
        constructor(flowChart: FlowChart, namespaceRegistrator: NamespaceRegistrator);
        Load(exportModel: model.ExportModel): void;
        private AddShapes(shapeList);
        private ConnectShapes(connections);
    }
}
declare module flowchart {
    /**
     * Registers all shapes and connection-drawer.
     */
    class NamespaceRegistrator {
        Registry: model.NamespaceRegistry;
        constructor();
        /**
         * Registers all build-in shapes and connection-drawer.
         */
        private RegisterBuildIn();
        /**
         * Returns the registered shape for the given enum-value
         * @param enumValue
         */
        GetShape(enumValue: number): any;
        /**
         * Returns the registered connection-drawer for the given enum-value.
         * @param enumValue
         */
        GetConnectionDrawer(enumValue: number): any;
        /**
         * registers new shape.
         * @param enumValue
         * @param namespaceString
         */
        RegisterShape(enumValue: number, classNamespace: any): void;
        /**
         * registers new ConnectionDrawer.
         * @param enumValue
         * @param namespaceString
         */
        RegisterConnectionDrawer(enumValue: number, classNamespace: any): void;
    }
}
declare module flowchart {
    /**
     * handles all the selection
     */
    class SelectionManager {
        private eventHandler;
        private options;
        private flowchartModel;
        SelectedElements: model.SelectableElement[];
        IsCtrl: boolean;
        IsMouseHold: boolean;
        private isMouseUp;
        constructor(eventHandler: EventHandler, options: FlowChartOptions, flowchartModel: model.FlowChartModel);
        DeleteElements(): void;
        /**
         * selection changed. check which elements to select/unselect
         * @param param
         */
        SelectionChanged(element: model.SelectableElement): boolean;
        NotifySelectionChanged(type: constants.EventType, element: any): boolean;
    }
}
declare module flowchart.shape {
    class ConnectionPoint extends ShapeBase {
        PointType: constants.ConnectionPointType;
        Position: constants.ConnectionPointPosition;
        constructor(type: constants.ConnectionPointType, position: constants.ConnectionPointPosition, width?: number, height?: number);
        DrawShape(paper: RaphaelPaper, posX: number, posY: number): RaphaelElement;
        GetPosition(): model.ShapePosition;
        SetPosition(posX: number, posY: number): void;
        GetMetadataDiv(): HTMLDivElement;
        CreateCopy(): ConnectionPoint;
        OnSelect(): void;
        OnUnselect(): void;
    }
}
declare module flowchart.shape.metadata {
    class Html implements IShapeMetadata {
        Label: string;
        Icon: string;
        Html: HTMLElement;
        constructor(label?: string, icon?: string);
        private CreateHtml();
        /**
         * Set the containing HTML
         * @param htmlElement
         */
        SetHtml(htmlElement: HTMLElement): void;
        /**
         * Set the containing HTML with string
         * @param innerHtml
         */
        SetHtmlText(innerHtml: string): void;
        /**
         * returns the metadata as HTMLElement
         */
        GetHtml(): HTMLElement;
    }
}
declare module flowchart.shape.metadata {
    interface IShapeMetadata {
        Html: HTMLElement;
        GetHtml(): HTMLElement;
        SetHtml(htmlElement: HTMLElement): any;
        SetHtmlText(innerHtml: string): any;
    }
}
declare module flowchart.shape {
    class Terminal extends ShapeBase {
        constructor(id: string, width: any, height: any, metadata?: shape.metadata.IShapeMetadata);
        DrawShape(paper: RaphaelPaper, posX: number, posY: number): RaphaelElement;
        private CalculatePath(posX, posY, width, height);
        GetMetadataDiv(): HTMLDivElement;
        GetPosition(): model.ShapePosition;
        SetPosition(posX: number, posY: number): void;
        OnSelect(options: FlowChartOptions): void;
        OnUnselect(options: FlowChartOptions): void;
    }
}
declare module flowchart {
    class ShapeConnector {
        private paper;
        private options;
        private eventHandler;
        private connectionCounter;
        constructor(paper: RaphaelPaper, options: FlowChartOptions, eventHandler: EventHandler);
        private GetConnectionPoint(shape, position);
        /**
         * connects two shapes
         * @param shapeFrom
         * @param shapeTo
         * @param fromConnectionPointPosition
         * @param toConnectionPointPosition
         */
        Connect(shapeFrom: shape.ShapeBase, shapeTo: shape.ShapeBase, fromConnectionPointPosition: constants.ConnectionPointPosition, toConnectionPointPosition: constants.ConnectionPointPosition): connection.RaphaelConnection;
        private AddEventsToConnectionLine(raphaelConnection, shapeConnection);
        RefreshConnection(c: connection.RaphaelConnection): void;
        private ConnectShapes(shapeFrom, shapeTo, innerColor, outerColor, thickness?, existingConnection?);
    }
}
declare module flowchart {
    /**
     * responsible for handling the moving of shapes and connections.
     */
    class ShapeMover {
        private _connector;
        private options;
        private eventHandler;
        Paper: RaphaelPaper;
        CurrentDraggedShapeType: constants.ShapeType;
        PlaceholderConnectionPoint: shape.ConnectionPoint;
        DragFromConnectionPoint: shape.ConnectionPoint;
        DragConnection: connection.RaphaelConnection;
        CurrentOverShape: shape.ShapeBase;
        constructor(_connector: ShapeConnector, paper: RaphaelPaper, options: FlowChartOptions, eventHandler: EventHandler);
        /**
         * registers an shape to be draggable
         * @param shape
         */
        Register(shape: shape.ShapeBase): void;
        /**
         * checks if the given element is of type ConnectionPoint
         * @param element
         */
        private IsConnectionPoint(element);
        /**
         * checks if the given connectionpoint is of any of the supplied types.
         * @param connectionPointShape
         * @param types
         */
        private IsConnectionPointType(connectionPointShape, types);
        /**
         * will be called when dragging started and while it is dragging
         * @param shape
         */
        private GetOnMoveStart(shape);
        /**
         * will be called when dragging has finished
         * @param shape
         */
        private GetOnMoveFinished(shape);
        /**
         * will be called right before dragging starts
         * @param shape
         */
        private GetDragger(shape);
        /**
         * will be called when mouse leaves an shape
         * @param shape
         */
        private GetOnMouseOver(shape);
        /**
         * will be called when mouse is over and shape.
         * @param shape
         */
        private GetOnMouseOut(shape);
        /**
         * returns true, if user is currently dragging an connection.
         */
        private IsDragging();
        /**
         * checks if a connection between two shapes already exists
         * @param shapeFrom
         * @param shapeTo
         */
        private IsConnectionAllowed(connectionPointFrom, connectionPointTo);
    }
}
