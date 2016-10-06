module flowchart {
    export class FlowChartOptions {
        ShapeConnectionType: constants.ConnectionDrawerType;
        ShapeConnection: connection.drawer.IConnectionDrawer;
        IsInitialized: boolean = false;

        ColorSelectedShape: string = "yellow";
        ColorSelectedConnection: string = "yellow";

        EnableEvents: boolean = true;


        constructor(shapeConnectionType: constants.ConnectionDrawerType=constants.ConnectionDrawerType.Curved) {
            this.ShapeConnectionType = shapeConnectionType;
        }

        Init(paper: RaphaelPaper) {
            if (this.IsInitialized)
                return;
        
            switch (this.ShapeConnectionType) {
            case constants.ConnectionDrawerType.Curved:
                this.ShapeConnection = new connection.drawer.Curved(paper);
                break;
            case constants.ConnectionDrawerType.Straight:
                    this.ShapeConnection = new connection.drawer.Straight(paper);
                break;
            default:

            }

            this.IsInitialized = true;
        }
    }
}