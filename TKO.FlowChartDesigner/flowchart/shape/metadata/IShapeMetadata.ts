module flowchart.shape.metadata {
    export interface IShapeMetadata {

        Html:HTMLElement;

        GetHtml(): HTMLElement;
        SetHtml(htmlElement: HTMLElement);
        SetHtmlText(innerHtml: string);
    }
}