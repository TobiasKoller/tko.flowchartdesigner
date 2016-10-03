module flowchart.shape {
    export class Decision extends ShapeBase {
        
        constructor(id: string, width, height, metadata: shape.metadata.IShapeMetadata=null) {
            super(id, constants.ShapeType.Decision, width, height, metadata, "shape_decision");
        }

        DrawShape(paper: RaphaelPaper, posX: number, posY: number): RaphaelElement {
            var path = this.CalculatePath(posX, posY, this.Width, this.Height);

            var raphaelElement = paper.path(path.path);
            raphaelElement.attr({ x: posX, y: posY });
            raphaelElement.attr(this.RaphaelAttr);
            return raphaelElement;
        }


        private CalculatePath(posX: number, posY: number, width: number, height: number): any {
            var halfHeight = height / 2;
            var halfWidth = width / 2;

            var topX = posX + halfWidth;
            var topY = posY;
            var leftX = posX; //- halfWidth;
            var leftY = posY + halfHeight;
            var rightX = posX + width;//+ halfWidth;
            var rightY = posY + halfHeight;
            var bottomX = posX + halfWidth;
            var bottomY = posY + height;

            var top = topX + "," + topY;
            var right = rightX + "," + rightY;
            var left = leftX + "," + leftY;
            var bottom = bottomX + "," + bottomY;

            var path = "M" + top + " " + right + " " + bottom + " " + left + " "+top;
            return {
                path: path,
                topX: topX,
                topY: topY,
                rightX: rightX,
                rightY: rightY,
                leftX: leftX,
                leftY: leftY,
                bottomX: bottomX,
                bottomY: bottomY
            };
        }

        //overridden
        GetMetadataDiv(): HTMLDivElement {

            var element: HTMLDivElement = document.createElement("div");

            
            //bei 100px ist dies ideal. width: 70px; height: 70px; margin - left: 15px; margin - top:15px
            //bei anderen nicht..muss berechnet wereden.
            element.classList.add(this.CssBackgroundClass);
            element.style.width = (this.Width*0.7)+"px";
            element.style.height = (this.Height * 0.7) + "px";

            element.style.marginLeft = (this.Width * 0.49) + "px";
            element.style.marginTop = (this.Height * 0.29) + "px";

            //element.style.marginLeft = (this.Width * 0.15) + "px";
            //element.style.marginTop = (this.Height * 0.15) + "px";

            return element;

            //var element: HTMLDivElement = document.createElement("div");
            //var className = "shapeClass" + this.Id;

            //var backgroundColor: string = "transparent";
            //var css:CSSStyleRule = common.DomHelper.GetCssClass(this.CssBackgroundClass);
            //if (css) {
            //    backgroundColor = css.style["background-color"];
            //}

            ////check if class doesn't exist. if true, create it...
            //if (!common.DomHelper.CssClassExists(className)) {
            //    var style1: HTMLStyleElement = document.createElement('style');
            //    var style2: HTMLStyleElement = document.createElement('style');
            //    style1.type = 'text/css';
            //    style2.type = 'text/css';

            //    var halfWidth = this.Width / 2;
            //    var halfHeight = this.Height / 2;

            //    //its a little bit more complex because we have to create a diamond shape with css.
            //    style1.innerHTML = "." + className +                '   { width: 0; height: 0; border: ' + halfWidth + 'px solid transparent; border-bottom: ' + halfHeight + 'px solid '+backgroundColor+'; position: absolute; top: -' + halfWidth+'px;padding-left:-50px;z-index:-1 }'; //when z-index=-1 then its possible to overlay some other styles afterwords
            //    style2.innerHTML = "." + className + ':after{content: ""; width: 0; height: 0; border: ' + halfWidth + 'px solid transparent; border-top: ' + halfHeight + 'px solid ' + backgroundColor + ';position: absolute; left: -' + halfWidth + 'px; top: ' + halfHeight +'px; ;z-index:-1  }';
                
            //    document.getElementsByTagName('head')[0].appendChild(style1);
            //    document.getElementsByTagName('head')[0].appendChild(style2);
            //}
            
            
            //element.classList.add(className);
            //return element;
        }

        GetPosition(): model.ShapePosition {
            return new model.ShapePosition(this.RaphaelElement.attr("x"), this.RaphaelElement.attr("y"));
            //return { x: this.RaphaelElement.attr("x"), y: this.RaphaelElement.attr("y") };
        }

        SetPosition(posX: number, posY: number) {
            var path = this.CalculatePath(posX, posY, this.Width, this.Height);
            this.RaphaelElement.node.setAttribute("d", path.path);

            this.RaphaelElement.attr({ x: posX, y: posY });
        }

        OnSelect(options: FlowChartOptions) {
            this.RaphaelElement.data("origStroke", this.RaphaelElement.attr("stroke"));
            this.RaphaelElement.attr("stroke", options.ColorSelectedShape);

        }

        OnUnselect(options: FlowChartOptions) {
            var color = this.RaphaelElement.data("origStroke");
            this.RaphaelElement.attr("stroke", color);
        }
    }
}