module flowchart.connection.drawer {
    export class Straight implements drawer.IConnectionDrawer {

        constructor(private paper: RaphaelPaper) {
            
        }

        Draw(raphaelObjectFrom, raphaelObjectTo, innerColor: string, outerColor: string, thickness: number = 3, existingConnection: connection.RaphaelConnection = null): connection.RaphaelConnection {
            {
                var bb1 = raphaelObjectFrom.getBBox(),
                    bb2 = raphaelObjectTo.getBBox();

                var x1 = bb1.x + bb1.width / 2;
                var y1 = bb1.y + bb1.height/2;
                var x2 = bb2.x + bb2.width / 2;
                var y2 = bb2.y + bb2.height / 2;

                var path: string = ["M", x1,y1,x2,y2].join(",");

                if (existingConnection) {
                    existingConnection.InnerLine.attr({ "stroke": innerColor, cursor: "pointer" });
                    existingConnection.OuterLine.attr({ "stroke": outerColor, "stroke-width": thickness, cursor: "pointer" });
                    existingConnection.InnerLine.attr("path", path);
                    existingConnection.OuterLine.attr("path", path);
                    return existingConnection;
                } else {

                    return new connection.RaphaelConnection(this.paper, path, innerColor, outerColor, thickness, raphaelObjectFrom, raphaelObjectTo);
                }
             
            }
        }
    }
}