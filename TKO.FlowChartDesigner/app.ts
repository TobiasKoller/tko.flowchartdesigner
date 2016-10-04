///<reference path="_references.ts"/>

var wc: flowchart.FlowChart;
var savedModel: any;
declare var $: JQueryStatic;

function ShowError(show,message) {

    var visibility = show ? "block" : "none";

    document.getElementById("errorArea").style.display = visibility;
    document.getElementById("errorMessage").innerHTML = message;

}

function UpdateJsonOutput() {

    var model = wc.Export();
    document.getElementById("json_output").innerHTML = JSON.stringify(model, undefined, 2);
}

function ClearModel() {
    wc.Clear();
}

function LoadModel() {
   if (!savedModel) {
       alert("No Flowchart saved. Please save one first.");
       return;
   }
    wc.Load(savedModel);
}

function SaveModel() {
    var model = wc.Export();
    savedModel = model;
    $("#lastSave").text(new Date().toString());
}

function AddNewShape() {

    try {
        var shapeId = $("#shapeid").val();
        var shapeType = $('input[name=shapetype]:checked').val();
        var width = parseInt($("#width").val());
        var height = parseInt($("#height").val());
        var posx = parseInt($("#posx").val());
        var posy = parseInt($("#posy").val());
        var metadata = $("#metadata").text();


        var m = new flowchart.shape.metadata.Html("");
        m.SetHtmlText(metadata);

        var shape = null;
        switch (shapeType) {
        case "terminal":
            shape = new flowchart.shape.Terminal(shapeId, width, height, m);
            break;
        case "process":
            shape = new flowchart.shape.Process(shapeId, width, height, m);
            break;

        case "decision":
            shape = new flowchart.shape.Decision(shapeId, width, height, m);
            break;
        default:
            throw "No ShapeType defined";
        }

        var cType = flowchart.constants.ConnectionPointType;
        var cPos = flowchart.constants.ConnectionPointPosition;

        if (!shape)
            return;

        shape.AddConnectionPoints([
            new flowchart.shape.ConnectionPoint(cType.Incoming, cPos.Top),
            new flowchart.shape.ConnectionPoint(cType.Incoming, cPos.Left),
            new flowchart.shape.ConnectionPoint(cType.OutgoingFalseError, cPos.Right),
            new flowchart.shape.ConnectionPoint(cType.OutgoingTrueSuccess, cPos.Bottom)
        ]);


        wc.AddShape(shape, posx, posy);
        ShowError(false, "");

    } catch (exception) {
        ShowError(true, exception);
    }
}

window.onload = () => {

    var options = new flowchart.FlowChartOptions();
    options.ShapeConnectionType = flowchart.constants.ConnectionDrawerType.Curved;
    options.ColorSelectedShape = "blue";


    wc = new flowchart.FlowChart("myCanvas",options);


    var s0 = new flowchart.shape.Terminal("0", 150, 50, new flowchart.shape.metadata.Html("Start"));
    var s1 = new flowchart.shape.Process("1", 150, 70, new flowchart.shape.metadata.Html("Do something"));
    var s2 = new flowchart.shape.Decision("2", 100, 100, new flowchart.shape.metadata.Html("Ok?")); 
    var s3 = new flowchart.shape.Process("3", 150, 70, new flowchart.shape.metadata.Html("Yes"));
    var s4 = new flowchart.shape.Process("4", 150, 70, new flowchart.shape.metadata.Html("No"));
    var s5 = new flowchart.shape.Terminal("5", 150, 50, new flowchart.shape.metadata.Html("End"));
    
    var cType = flowchart.constants.ConnectionPointType;
    var cPos = flowchart.constants.ConnectionPointPosition;

    s0.AddConnectionPoints([
        new flowchart.shape.ConnectionPoint(cType.OutgoingTrueSuccess, cPos.Bottom)
    ]);

    s1.AddConnectionPoints([
        new flowchart.shape.ConnectionPoint(cType.Incoming, cPos.Top),
        new flowchart.shape.ConnectionPoint(cType.Incoming, cPos.Left),
        new flowchart.shape.ConnectionPoint(cType.OutgoingFalseError, cPos.Right),
        new flowchart.shape.ConnectionPoint(cType.OutgoingTrueSuccess, cPos.Bottom)
    ]);

    s2.AddConnectionPoints([
        new flowchart.shape.ConnectionPoint(cType.Incoming, cPos.Top),
        //new flowchart.shapes.ConnectionPoint(cType.Incoming, cPos.Left),
        new flowchart.shape.ConnectionPoint(cType.OutgoingFalseError, cPos.Left),
        new flowchart.shape.ConnectionPoint(cType.OutgoingTrueSuccess, cPos.Right)
    ]);

    s3.AddConnectionPoints([
        new flowchart.shape.ConnectionPoint(cType.Incoming, cPos.Top),
        new flowchart.shape.ConnectionPoint(cType.Incoming, cPos.Left),
        new flowchart.shape.ConnectionPoint(cType.OutgoingFalseError, cPos.Right),
        new flowchart.shape.ConnectionPoint(cType.OutgoingTrueSuccess, cPos.Bottom)
    ]);

    s4.AddConnectionPoints([
        new flowchart.shape.ConnectionPoint(cType.Incoming, cPos.Top),
        new flowchart.shape.ConnectionPoint(cType.Incoming, cPos.Left),
        new flowchart.shape.ConnectionPoint(cType.OutgoingFalseError, cPos.Right),
        new flowchart.shape.ConnectionPoint(cType.OutgoingTrueSuccess, cPos.Bottom)
    ]);

    s5.AddConnectionPoints([
        new flowchart.shape.ConnectionPoint(cType.Incoming, cPos.Top)
    ]);

    wc.AddShape(s0, 350, 30);
    wc.AddShape(s1, 350, 110);
    wc.AddShape(s2, 375, 220);
    wc.AddShape(s3, 470, 330);
    wc.AddShape(s4, 240, 330);
    wc.AddShape(s5, 350, 440);


    //connect Shapes
    wc.ConnectShapes(s0, s1, cPos.Bottom, cPos.Top);
    wc.ConnectShapes(s1, s2, cPos.Bottom, cPos.Top);
    wc.ConnectShapes(s2, s3, cPos.Right, cPos.Top);
    wc.ConnectShapes(s2, s4, cPos.Left, cPos.Top);
    wc.ConnectShapes(s3, s5, cPos.Bottom, cPos.Top);
    wc.ConnectShapes(s4, s5, cPos.Bottom, cPos.Top);
    
    wc.AddEventListener(flowchart.constants.EventType.BeforeConnectionCreated, function (event: flowchart.model.EventParamConnection){

        return confirm("Do you really want to create this connection?");
    });

    wc.AddEventListener(flowchart.constants.EventType.AfterConnectionCreated, function (event: any) {
        UpdateJsonOutput();
        return true;
    });

    wc.AddEventListener(flowchart.constants.EventType.OnClick, function (event: flowchart.model.EventParamShape) {
        console.log("single clicked "+event);
        return true;
    });

    wc.AddEventListener(flowchart.constants.EventType.OnDoubleClick, function (event: flowchart.model.EventParamShape) {
        console.log("double clicked "+event);
        return true;
    });

    wc.AddEventListener(flowchart.constants.EventType.BeforeDelete, function(event: flowchart.model.EventParamDeleteList)
    {
        return confirm("do you really want to delete these elements?");
    });

    wc.AddEventListener(flowchart.constants.EventType.AfterDelete, function (event: flowchart.model.EventParamDeleteList)
    {
        UpdateJsonOutput();
        console.log("elements deleted");
        return true;
    });

    wc.AddEventListener(flowchart.constants.EventType.BeforeShapeMoved, function(event:flowchart.model.EventParamShape) {
        var position = event.Shape.GetPosition();
        console.log("shape moved from " + position.X + ":" + position.Y);
        return true;
    });

    wc.AddEventListener(flowchart.constants.EventType.AfterShapeMoved, function (event: flowchart.model.EventParamShape) {
        UpdateJsonOutput();
        var position = event.Shape.GetPosition();
        console.log("shape moved to " + position.X + ":" + position.Y);
        return true;
    });

    wc.AddEventListener(flowchart.constants.EventType.BeforeSelect, function(event:any) {
        var element:any = (event instanceof flowchart.model.EventParamShape)? event.Shape : event.ShapeConnection;

        console.log("before shape ["+element.Id+"] selected");
        return true;
    });

    wc.AddEventListener(flowchart.constants.EventType.AfterSelect, function (event: any) {
        var element: any = (event instanceof flowchart.model.EventParamShape) ? event.Shape : event.ShapeConnection;

        console.log("after shape [" + element.Id + "] selected");
        return true;
    });

    wc.AddEventListener(flowchart.constants.EventType.BeforeUnselect, function (event: any) {
        var element: any = (event instanceof flowchart.model.EventParamShape) ? event.Shape : event.ShapeConnection;

        console.log("before shape [" + element.Id + "] unselected");
        return true;
    });

    wc.AddEventListener(flowchart.constants.EventType.AfterUnselect, function (event: any) {
        var element: any = (event instanceof flowchart.model.EventParamShape) ? event.Shape : event.ShapeConnection;

        console.log("after shape [" + element.Id + "] unselected");
        return true;
    });

    setTimeout(() => {
        //var metadata = s2.Metadata;
        //metadata.SetHtmlText("<div>test xyz</div>");
        s3.SetCssContentClass("test_shape_process_content");
        wc.UpdateShapeMetadata(s3);

        setTimeout(() => {
            var metadata = s3.Metadata;
            metadata.SetHtmlText("<div>xxx</div>");

            wc.UpdateShapeMetadata(s3, metadata);
        },5000);
    }, 5000);


    UpdateJsonOutput();
};