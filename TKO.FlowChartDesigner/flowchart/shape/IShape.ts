module flowchart.shape {
    export interface IShape {
        Width: number;
        Height: number;

        Id: string;
        Type: constants.ShapeType;
        CssBackgroundClass: string;
        CssContentClass: string;
        RaphaelElement: RaphaelElement;
        //RaphaelMetadata: SVGForeignObjectElement;
        MetadataHtmlElement: HTMLDivElement;
        RaphaelAttr: any;
        Metadata: shape.metadata.IShapeMetadata;
        ParentShape: ShapeBase;
        ConnectionPoints: shape.ConnectionPoint[];
        Connections: connection.ShapeConnection[];

        GetContainingElements(): any[];
        BeforeMove(x: number, y: number);
        SetRaphaelShapeReference();
        OnMove(x: number, y: number);
        AddConnectionPoints(connectionPoints: ConnectionPoint[]);
        AddConnection(connection: connection.ShapeConnection);

        CalculateConnectionPointCoord(position: constants.ConnectionPointPosition, pointWidth: number, pointHeight: number): any;
        DrawShape(paper: RaphaelPaper, posX: number, posY: number);
        SetCssContentClass(className: string);
        GetMetadataDiv(): HTMLDivElement;
        GetPosition():model.ShapePosition;
        SetPosition(x: number, y: number);
    }
}