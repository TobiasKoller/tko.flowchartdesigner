var modules;
(function (modules) {
    var Drawer = (function () {
        function Drawer() {
        }
        Drawer.prototype.Initialize = function (canvasHtmlName, width, height) {
            this.paper = Raphael(canvasHtmlName, width, height);
        };
        return Drawer;
    }());
    modules.Drawer = Drawer;
})(modules || (modules = {}));
//# sourceMappingURL=Drawer.js.map