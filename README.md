# tko.flowchartdesigner
Javascript Library to easily create flowcharts with drag/drop functionality based on the awesome library
<a href="http://dmitrybaranovskiy.github.io/raphael/">Raphael JS</a> .

This is my first github-project which is written in typescript. I will add all the readme/api/etc when I know how to do all that formatting stuff :)

In the meanwhile check out the demo.

<a href="https://tobiaskoller.github.io/tko.flowchartdesigner">DEMO</a>


Please have a look insdie the app.ts-file to get a first impression of the api. the window.onload-method will contain an example which adds some shapes to the canvas, connnects them, etc.


(if you are not familiar with typescript, simply use the below code like javascript and remove the type-syntax.
for example: instead of using

```javascript
var x: string = "";
```
use 
```javascript
var x = "";
```
#Example in Typescript
```javascript
    var options = new flowchart.FlowChartOptions();
    //using curved-line to connect shapes.
    options.ShapeConnectionType = flowchart.constants.ConnectionDrawerType.Curved;

    
    //"myCanvas" is the name of the div where to draw the stuff.
    wc = new flowchart.FlowChart("myCanvas",options);

    //creating some shapes. available right now: Terminal, Process, Decision
    var s0 = new flowchart.shape.Terminal("0", 150, 50, new flowchart.shape.metadata.Html("Start"));
    var s1 = new flowchart.shape.Process("1", 150, 70, new flowchart.shape.metadata.Html("Do something"));
    var s2 = new flowchart.shape.Decision("2", 100, 100, new flowchart.shape.metadata.Html("Ok?"));
    var s3 = new flowchart.shape.Process("3", 150, 70, new flowchart.shape.metadata.Html("Yes"));
    var s4 = new flowchart.shape.Process("4", 150, 70, new flowchart.shape.metadata.Html("No"));
    var s5 = new flowchart.shape.Terminal("5", 150, 50, new flowchart.shape.metadata.Html("End"));
    
    //just some variables to shorten the code below
    var cType = flowchart.constants.ConnectionPointType;
    var cPos = flowchart.constants.ConnectionPointPosition;

    //add connectionpoints to the shape. you simple define the kind of connection-Point and the position (left,right,top,bottom)
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

    //adding the shapes to the canvas with x/y position
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
    
    
    //Add eventlistener to all available events.
    //to abort events you simply return false in the "before"-event. only exception is BeforeShapeMoved.
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


```
