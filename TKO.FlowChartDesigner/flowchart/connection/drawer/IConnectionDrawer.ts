module flowchart.connection.drawer {
    export interface IConnectionDrawer {
        Draw(shapeFrom, shapeTo, innerColor: string, outerColor: string, thickness?: number, existingConnection?: connection.RaphaelConnection):connection.RaphaelConnection;
    }
}