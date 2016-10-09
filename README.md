
# tko.flowchartdesigner
Javascript Library to easily create flowcharts with drag/drop functionality based on the awesome library
<a href="http://dmitrybaranovskiy.github.io/raphael/">Raphael JS</a> .

This is my first github-project which is written in typescript. I will add all the readme/api/etc when I know how to do all that formatting stuff :)

In the meanwhile check out the demo.

```
Tested with current versions of Edge, IE, Chrome, Firefox
```
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
###Add ConnectionPoints to the shape
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

###Add Shape to the canvas
```javascript
    wc.AddShape(s0, 350, 30);
    wc.AddShape(s1, 350, 110);
    wc.AddShape(s2, 375, 220);
    wc.AddShape(s3, 470, 330);
    wc.AddShape(s4, 240, 330);
    wc.AddShape(s5, 350, 440);
```

##4. Connect Shapes

##5. Events

##6. Save as JSON

##7. Read from JSON
```javascript
  

```
