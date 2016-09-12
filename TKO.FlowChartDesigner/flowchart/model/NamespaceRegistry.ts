module flowchart.model {

    /**
     * keeps all registered shapes and connection-drawer-namespaces.
     */
    export class NamespaceRegistry {

        Shapes: any = {};
        ConnectionDrawer: any = {}

        GetShape(enumValue: number) {
            return this.Shapes[enumValue];
        }

        GetConnectionDrawer(enumValue: number) {
            return this.ConnectionDrawer[enumValue];
        }

        /**
         * Add new Shape to the registry.
         * @param enumValue
         * @param classNamespace
         */
        AddShape(enumValue: number, classNamespace: any) {
            this.Shapes[enumValue] = classNamespace;
        }


        /**
         * Add new ConnectionDrawer to the registry.
         * @param enumValue
         * @param classNamespace
         */
        AddConnectionDrawer(enumValue: number, classNamespace: any) {
            this.ConnectionDrawer[enumValue] = classNamespace;
        }

    }
}