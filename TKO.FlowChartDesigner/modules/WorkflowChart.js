var modules;
(function (modules) {
    "use strict";
    var WorkflowChart = (function () {
        function WorkflowChart(element) {
        }
        WorkflowChart.prototype.Start = function () {
            var drawer = new modules.Drawer();
            drawer.Initialize("myCanvas", 2000, 2000);
        };
        return WorkflowChart;
    }());
    modules.WorkflowChart = WorkflowChart;
})(modules || (modules = {}));
//# sourceMappingURL=WorkflowChart.js.map