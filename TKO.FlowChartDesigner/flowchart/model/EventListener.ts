module flowchart.model {
    export class EventListener {
        Id:string;
        Type: constants.EventType;
        Callback: (eventArgs:any) => boolean;

        constructor(type: constants.EventType, callback: (eventArgs: any) => boolean, id: string = "") {

            this.Id = id;
            this.Type = type;
            this.Callback = callback;

        }
    }
}