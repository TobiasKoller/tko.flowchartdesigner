module flowchart.shape.metadata {

    export class Html implements  IShapeMetadata{

        Label: string;
        Icon: string;

        Html:HTMLElement;

        constructor(label?: string, icon: string="") {
            this.Label = label;
            this.Icon = icon;
            this.CreateHtml();
        }

        private CreateHtml() {
            var htmlElement: HTMLElement = document.createElement("div");
            htmlElement.style.width = "100%";
            htmlElement.style.height = "100%";
            htmlElement.style.position = "absolute";


            htmlElement.innerHTML =
                "   <div>" + this.Label + "</div>"
            this.Html = htmlElement;
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