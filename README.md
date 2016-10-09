
# tko.flowchartdesigner
Javascript Library to easily create flowcharts with drag/drop functionality based on the awesome library
<a href="http://dmitrybaranovskiy.github.io/raphael/">Raphael JS</a> .


```
Tested with current versions of Edge, IE, Chrome, Firefox
```
<a href="https://tobiaskoller.github.io/tko.flowchartdesigner">DEMO</a>

#Getting started

##1. Set references
###css
```html
    <link rel="stylesheet" href="../dist/tko.flowchartdesigner.css" type="text/css" />
```

###javascript
```html
    <script src="../Scripts/jquery-1.9.1.min.js"></script>
    <script src="../Scripts/bootstrap.min.js"></script>
    <script src="../Scripts/raphael-min.js"></script>
    <script src="../dist/tko.flowchartdesigner.js"></script>
```
##2. Create Flowchart

###html
```html
    <div id="myCanvas" class="flowchart_canvas" tabindex="1">
        <!--Tabindex=1 to get the keydown-event for that div-->
    </div>
```
In this example I used this css for the canvas-div.
```css
    .flowchart_canvas{
        border: solid 1px #333;
        background-color: #e0e0e0;
        width: 100%;
        height: 3000px;
    }
```
###javascript
```javascript
    var options = new flowchart.FlowChartOptions();
    var wc = new flowchart.FlowChart("myCanvas",options);
```
###Options
the following-objects are available to customize the flowchart

```javascript
//connection-types
    //curved
    options.ShapeConnectionType = constants.ConnectionDrawerType.Curved;
    //straight
    options.ShapeConnectionType = constants.ConnectionDrawerType.Straight;

//colors
    //Shape
    options.Colors.ShapeSelected = "blue";

    //Connection
    options.Colors.ConnectionSelected = "blue";

    //connectionpoints
    options.Colors.ConnectionPointIncoming = "white";
    options.Colors.ConnectionPointTrueSuccess = "green";
    options.Colors.ConnectionPointFalseError = "red";
```
everything else can be changed with the css-file.
##3. Add Shapes
###Create shapes
```javascript
    var s0 = new flowchart.shape.Terminal("0", 150, 50, "Start");
    var s1 = new flowchart.shape.Process("1", 150, 70, "Do something");
    var s2 = new flowchart.shape.Decision("2", 100, 100, "Ok?");
    var s3 = new flowchart.shape.Process("3", 150, 70, "<div style='color:green'>Yes</div>");
    var s4 = new flowchart.shape.Process("4", 150, 70, "No");
    var s5 = new flowchart.shape.Terminal("5", 150, 50, "End");
```
###Add ConnectionPoints to the shapes
```javascript
    var cType = flowchart.constants.ConnectionPointType; //to avoid to much typing ;-)
    
    s0.AddConnectionPoints([
        new flowchart.shape.ConnectionPoint(cType.OutgoingTrueSuccess, cPos.Bottom)
    ]);

    s1.AddConnectionPoints([
        new flowchart.shape.ConnectionPoint(cType.Incoming, cPos.Top),
        new flowchart.shape.ConnectionPoint(cType.Incoming, cPos.Left),
        new flowchart.shape.ConnectionPoint(cType.OutgoingFalseError, cPos.Right),
        new flowchart.shape.ConnectionPoint(cType.OutgoingTrueSuccess, cPos.Bottom)
    ]);
    ...
```

###Add Shapes to the canvas
```javascript
    wc.AddShape(s0, 350, 30);
    wc.AddShape(s1, 350, 110);
    wc.AddShape(s2, 375, 220);
    wc.AddShape(s3, 470, 330);
    wc.AddShape(s4, 240, 330);
    wc.AddShape(s5, 350, 440);
```

##4. Connect Shapes
```javascript
    wc.ConnectShapes(s0, s1, cPos.Bottom, cPos.Top);
    wc.ConnectShapes(s1, s2, cPos.Bottom, cPos.Top);
    wc.ConnectShapes(s2, s3, cPos.Right, cPos.Top);
    wc.ConnectShapes(s2, s4, cPos.Left, cPos.Top);
    wc.ConnectShapes(s3, s5, cPos.Bottom, cPos.Top);
    wc.ConnectShapes(s4, s5, cPos.Bottom, cPos.Top);
```


##5. Events

###Available events
```javascript
    flowchart.constants.EventType.AfterConnectionCreated
    flowchart.constants.EventType.OnClick
    flowchart.constants.EventType.OnDoubleClick
    flowchart.constants.EventType.BeforeDelete
    flowchart.constants.EventType.AfterDelete
    flowchart.constants.EventType.BeforeShapeMoved
    flowchart.constants.EventType.AfterShapeMoved
    flowchart.constants.EventType.BeforeSelect
    flowchart.constants.EventType.AfterSelect
    flowchart.constants.EventType.BeforeUnselect
    flowchart.constants.EventType.AfterUnselect
```

###Add event listener
```javascript
    wc.AddEventListener(flowchart.constants.EventType.BeforeConnectionCreated, function (event){

        return confirm("Do you really want to create this connection?");
    });
    ...
```
###"Before"-Events
If you listen to an "before"-event you can simply abort this current action by returning false.
The after-code will not be executed then.
Only exception: BeforeShapeMoved.

##6. Save as JSON
You can get the complete flowchart as a json-object. this object can later be used to load the flowchart again using the Load-Method.
```javascript
var json = wc.Export();
```
##7. Load from JSON
If you want to load a complete flowchart from your code you can call the Load-Method.
this will need the json-object (from the Export-Method) as parameter.
```javascript
  wc.Load(savedModel);

```
