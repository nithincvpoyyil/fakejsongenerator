import { Injectable, EventEmitter } from '@angular/core';


@Injectable()
export class PouchService {

    private isInstantiated: boolean;
    private database: any;
    private listener: EventEmitter<any> = new EventEmitter();

    public constructor() {
        if(!this.isInstantiated) {
            
        }
    }

    public get(id: string) {
        return this.database.get(id);
    }

    public put(document: any, id: string) {
       
    }

    public sync(remote: string) {
        
    }

    public getChangeListener() {
        return this.listener;
    }

}