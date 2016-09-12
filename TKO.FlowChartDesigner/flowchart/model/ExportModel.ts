module flowchart.model {
    export class ExportModel {
        Options: FlowChartOptions;
        Shapes: ExportModelShape[]=[];
        Connections: ExportModelConnection[]=[];
    }
}