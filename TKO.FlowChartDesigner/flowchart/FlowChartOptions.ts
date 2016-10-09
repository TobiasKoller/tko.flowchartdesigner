module flowchart {
    export class FlowChartOptions {
        ShapeConnectionType: constants.ConnectionDrawerType;
        ShapeConnection: connection.drawer.IConnectionDrawer;
        IsInitialized: boolean = false;
        
        Colors: FlowChartColors;

        EnableEvents: boolean = true;


        constructor(shapeConnectionType: constants.ConnectionDrawerType=constants.ConnectionDrawerType.Curved) {
            this.ShapeConnectionType = shapeConnectionType;
            this.Colors = new FlowChartColors();
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