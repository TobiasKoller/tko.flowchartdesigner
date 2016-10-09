module flowchart.shape.metadata {

    export class Html implements  IShapeMetadata{

        
        Html:HTMLElement;

        constructor(htmlText:string) {
            var htmlElement: HTMLElement = document.createElement("div");
            htmlElement.style.width = "100%";
            htmlElement.style.height = "100%";
            
            //"   <div>" + this.Label + "</div>";
            this.Html = htmlElement;
            this.SetHtmlText(htmlText);
        }
        
        /**
         * Set the containing HTML
         * @param htmlElement
         */
        SetHtml(htmlElement:HTMLElement) {
            this.Html = htmlElement;
        }

        /**
         * Set the containing HTML with string
         * @param innerHtml
         */
        SetHtmlText(innerHtml:string) {
            this.Html.innerHTML = innerHtml;
        }

        /**
         * returns the metadata as HTMLElement
         */
        GetHtml(): HTMLElement {
            return this.Html;
        }

    }
}