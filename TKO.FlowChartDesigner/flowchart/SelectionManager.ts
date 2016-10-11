module flowchart {

    /**
     * handles all the selection
     */
    export class SelectionManager {

        SelectedElements:model.SelectableElement[]=[];
        IsCtrl: boolean = false;
        IsMouseHold: boolean = false;
        private isMouseUp:boolean = false;


        constructor(private eventHandler:EventHandler, private options:FlowChartOptions, private flowchartModel:model.FlowChartModel) {

            this.eventHandler.Register(constants.EventType.OnClick,(param:any) => {

                if (this.IsMouseHold)
                    return false;

                if (param instanceof model.EventParamConnection) {
                    this.SelectionChanged(param.ShapeConnection);
                }
                else if (param instanceof model.EventParamShape) {
                    this.SelectionChanged(param.Shape);
                } else {
                    console.warn("element [" + param + "] shouldn't be selectable...");
                    return false;
                }
                
                return true;
            });

            document.body.onkeydown = (event) => {
                this.IsCtrl = event.keyCode === 17;//17=ctrl

                if (event.keyCode == 46) { //46=delete
                    if (this.SelectedElements.length === 0)
                        return true; //return true because maybe another part outside this library is using this event.

                    var shapes: any[] = [];
                    var connections: any[] = [];

                    //iterate through all selected elements and throw the before and after events.
                    for (let element of this.SelectedElements) {
                        if (element instanceof flowchart.connection.ShapeConnection) {
                            connections.push(element);
                        }
                        else if (element instanceof flowchart.shape.ShapeBase) {
                            shapes.push(element);

                            var s: flowchart.shape.ShapeBase = element;
                            var c: flowchart.connection.ShapeConnection;

                            for (c of s.Connections) { //iterate through all connections óf the shape and add them to the deletion-list.

                                var found: boolean = false;

                                for (var tmpConnection of connections) {//iterate through already for deletion marked connections to check if connection is already marked.
                                    if (tmpConnection.Id == c.Id) {
                                        found = true; //nothing more to do.
                                        break;
                                    }
                                }    

                                if (!found) { //not found? add it now.
                                    connections.push(c);
                                }
                            }
                        }
                    }

                    if (this.eventHandler.Notify(constants.EventType.BeforeDelete, new model.EventParamDeleteList(shapes, connections))===false)
                        return true; //return true because maybe another part outside this library is using this event.

                    //delete elements
                    this.DeleteElements();

                    this.eventHandler.Notify(constants.EventType.AfterDelete, new model.EventParamDeleteList(shapes, connections));

                }
            };

            document.body.onkeyup = (event) => {
                this.IsCtrl = false;
            }

            //**these onmousedown/onmouseup are for finding out if the mouse is hold or clicked.
            var timeout;
            document.body.onmousedown = () => {
                this.IsMouseHold = false;
                this.isMouseUp = false;
                timeout = setTimeout(() => {
                    this.IsMouseHold = !this.isMouseUp;
                }, 200); // 
                
            }

            document.body.onmouseup = () => {
                clearTimeout(timeout);
                this.isMouseUp = true;
            }
            //**
        }

        DeleteElements() {

            var element: any;
            for (element of this.SelectedElements) {

                var id = element.Id;

                
                // ReSharper disable once ConditionIsAlwaysConst
                // ReSharper disable once HeuristicallyUnreachableCode
                if (element instanceof shape.ShapeBase) {
                    //Delete connections from paper.
                    var c: connection.ShapeConnection;
                    for (c of element.Connections) {
                        c.Delete();
                    }
                    //delete connections from model.
                    this.flowchartModel.DeleteShape(element);
                }
                // ReSharper disable once ConditionIsAlwaysConst
                // ReSharper disable once HeuristicallyUnreachableCode
                else if (element instanceof connection.ShapeConnection) {
                    this.flowchartModel.DeleteConnections([element]);
                }

                element.Delete();

            }
        }

        /**
         * selection changed. check which elements to select/unselect
         * @param param
         */
        SelectionChanged(element: model.SelectableElement) {

            console.log("isCtrl=" + this.IsCtrl);
            console.log("count selected="+this.SelectedElements.length)
            var e: model.SelectableElement;

            if (this.IsCtrl) {
                let pos = -1;
                for (let i=0;i<this.SelectedElements.length;i++) {
                    let e = this.SelectedElements[i];

                    if (e.Id == element.Id) {
                        pos = i;
                        break;
                    }
                }
                if (pos > -1) {

                    if (this.NotifySelectionChanged(constants.EventType.BeforeUnselect, element) === false)
                        return false;

                    element.OnUnselect(this.options);
                    this.SelectedElements.splice(pos, 1);//remove from list;

                    this.NotifySelectionChanged(constants.EventType.AfterUnselect,element);

                    return true;
                }

                if (this.NotifySelectionChanged(constants.EventType.BeforeSelect, element) === false)
                    return false;
                element.OnSelect(this.options);

                this.NotifySelectionChanged(constants.EventType.AfterSelect, element);

                this.SelectedElements.push(element);

            }
            else {
                let isSelected = false;
                for (e of this.SelectedElements) {
                    if (this.NotifySelectionChanged(constants.EventType.BeforeUnselect, e) === false)
                        return false;

                    e.OnUnselect(this.options);
                    this.NotifySelectionChanged(constants.EventType.AfterUnselect, e);

                    if (e.Id == element.Id)
                        isSelected = true;
                }

                this.SelectedElements = [];

                if (isSelected)
                    return true; //is selected. nothing to do because it was unselected above already.

                if (this.NotifySelectionChanged(constants.EventType.BeforeSelect, element) === false)
                    return false;

                element.OnSelect(this.options);

                this.NotifySelectionChanged(constants.EventType.AfterSelect, element);

                this.SelectedElements.push(element);
            }


            return true;

        }


        NotifySelectionChanged(type: constants.EventType, element: any):boolean {
            var eData = (element instanceof shape.ShapeBase)
                ? new model.EventParamShape(element)
                : new model.EventParamConnection(<connection.ShapeConnection>element);



            if (this.eventHandler.Notify(type, eData) === false)
                return false;
        }
    }
}