module flowchart.model {
    export abstract class SelectableElement extends BaseElement{

        abstract OnSelect(options:FlowChartOptions);
        abstract OnUnselect(options: FlowChartOptions);
        abstract Delete();
    }
}