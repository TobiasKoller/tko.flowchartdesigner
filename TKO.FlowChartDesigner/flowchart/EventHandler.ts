module flowchart {
    export class EventHandler {

        private listener:model.EventListener[] = [];


        /**
         * register event
         * @param type
         * @param callback
         * @param id
         */
        Register(type: constants.EventType, callback: (eventArgs: any)=>boolean, id:string="") {

            var eventListener = new model.EventListener(type, callback, id);
            this.listener.push(eventListener);
        }

        /**
         * unregister event
         * @param id
         */
        Unregister(id:string) {

            if (!id || id=="")
                return;

            var e: model.EventListener;
            var len = this.listener.length;

            for (var i = len - 1; i >= 0; i--) {
                e = this.listener[i];
                if(e.Id == id)
                    this.listener.splice(i);
            }
        }

        /**
         * Notifies all event-listener
         * @param type
         * @param eventArgs
         */
        Notify(type: constants.EventType, eventArgs: any):boolean {
            
            var c: model.EventListener;

            var result: boolean = true;
            for (c of this.listener) {
                if (c.Type == type) {
                    var tmpResult: boolean = c.Callback(eventArgs);
                    if (tmpResult == false)
                        result = false;
                }
            }

            return result;
        }
    }
}