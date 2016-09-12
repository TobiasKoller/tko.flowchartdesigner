module flowchart.connection.drawer {
    export class Elbow implements drawer.IConnectionDrawer {
        Draw(raphaelObjectFrom, raphaelObjectTo, innerColor: string, outerColor: string, thickness: number = 3, existingConnection: connection.RaphaelConnection = null): connection.RaphaelConnection {
            {
                throw "ElbowConnection: not implemented yet.";
            }
        }
    }
}