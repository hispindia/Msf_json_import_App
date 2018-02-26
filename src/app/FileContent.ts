/*
    Created By Ahmed Ifhaam
    On 26-02-2018
    
*/

import {Enrollment} from './Enrollment'
import {TEI} from './TEI'
import {Event} from './Event'

export interface FileContentInt{
    enrollments: Enrollment[];
    trackedEntityInstances : TEI[];
    events: Event[];
    
}

export class FileContent{
    enrollments: Enrollment[];
    trackedEntityInstances : TEI[];
    events:Event[];

    toJSON():FileContentInt{
        return Object.assign({},this,{
            //convert any fields that need converting
        })
    }

    static fromJSON(json:FileContentInt|string):FileContent{
        if(typeof json==='string'){
            return JSON.parse(json,FileContent.reviver);
        }else{
            let fileContent = Object.create(FileContent.prototype);
            
            let obj = Object.assign(fileContent,json,{
                //convert fields that need conversion 
                
            });

            let enrollments:Enrollment[] =[];
            for(let enIn of obj.enrollments){
                enIn = Enrollment.fromJSON(enIn);
                enrollments.push(enIn);
            }

            let trackedEntityInstances:TEI[] = [];
            for(let tei of obj.trackedEntityInstances){
                tei = TEI.fromJSON(tei);
                trackedEntityInstances.push(tei);
            }

            let events:Event[] = [];
            for(let evnt of obj.events){
                evnt = Event.fromJSON(evnt);
                events.push(evnt);
            }
            obj.enrollments = enrollments;
            obj.trackedEntityInstances = trackedEntityInstances;
            obj.events = events;
            return obj;
        }
    }
    
    static reviver(key:string,value:any):any{
        

        return key===""?FileContent.fromJSON(value):value;
    }
}