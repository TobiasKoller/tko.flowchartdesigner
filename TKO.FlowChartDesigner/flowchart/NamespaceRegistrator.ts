module flowchart {
    /**
     * Registers all shapes and connection-drawer.
     */
    export class NamespaceRegistrator {

        Registry: model.NamespaceRegistry;

        constructor() {
            this.Registry = new model.NamespaceRegistry();

            this.RegisterBuildIn();
        }


        /**
         * Registers all build-in shapes and connection-drawer.
         */
        private RegisterBuildIn() {

            //shapes

            this.RegisterShape(constants.ShapeType.Terminal, shape.Terminal);
            this.RegisterShape(constants.ShapeType.Decision, shape.Decision);
            this.RegisterShape(constants.ShapeType.Process, shape.Process);
            this.RegisterShape(constants.ShapeType.ConnectionPoint, shape.ConnectionPoint);


            //connection-drawer
            this.RegisterConnectionDrawer(constants.ConnectionDrawerType.Straight, connection.drawer.Straight);
            this.RegisterConnectionDrawer(constants.ConnectionDrawerType.Curved, connection.drawer.Curved);

        }

        /**
         * Returns the registered shape for the given enum-value
         * @param enumValue
         */
        GetShape(enumValue: number) {
            var ns = this.Registry.GetShape(enumValue);
            if (!ns)
                throw "No Shape registered under enum-value [" + enumValue + "].";

            return ns;
        }

        /**
         * Returns the registered connection-drawer for the given enum-value.
         * @param enumValue
         */
        GetConnectionDrawer(enumValue: number) {
            var ns = this.Registry.GetConnectionDrawer(enumValue);
            if (!ns)
                throw "No Connection-Drawer registered under enum-value [" + enumValue + "].";

            return ns;
        }

        /**
         * registers new shape.
         * @param enumValue
         * @param namespaceString
         */
        RegisterShape(enumValue: number, classNamespace: any) {

            if (this.Registry.Shapes[enumValue])
                throw "Shape with enum-value [" + enumValue + "] already registered. Can't register [" + classNamespace+"] with the same enum-value.";

            this.Registry.AddShape(enumValue, classNamespace);
        }

        /**
         * registers new ConnectionDrawer.
         * @param enumValue
         * @param namespaceString
         */
        RegisterConnectionDrawer(enumValue: number, classNamespace: any) {
            if (this.Registry.ConnectionDrawer[enumValue])
                throw "ConnectionDrawer with enum-value [" + enumValue + "] already registered. Can't register [" + classNamespace + "] with the same enum-value.";

            this.Registry.AddConnectionDrawer(enumValue, classNamespace);
        }

    }
}