/*
    Created By Ahmed Ifhaam
    On 26-02-2018
    
*/

import { Enrollment } from "./Enrollment";
import { AjaxCall } from "./AjaxCall"
import { ResponseService } from "./response-service.service";

export interface EventInt{
    attributeCategoryOptions:string;
    attributeOptionCombo:string;
    coordinate:object;
    created:string;
    dataValues:object[];//objarray
    deleted:boolean;
    dueDate:string;
    enrollment:string;
    enrollmentStatus:string;
    event:string;
    eventDate:string;
    followup:boolean;
    href:string;
    lastUpdated:string;
    notes:object[];//objarray
    orgUnit:string;
    orgUnitName:string;
    program:string;
    programStage:string;
    status:string;
    storedBy:string;
    trackedEntityInstance:string;
}

export class Event{
    attributeCategoryOptions:string;
    attributeOptionCombo:string;
    coordinate:object;
    created:string;
    dataValues:object[];
    deleted:boolean;
    dueDate:string;
    enrollment:string;
    enrollmentStatus:string;
    event:string;
    eventDate:string;
    followup:boolean;
    href:string;
    lastUpdated:string;
    notes:object[];
    orgUnit:string;
    orgUnitName:string;
    program:string;
    programStage:string;
    status:string;
    storedBy:string;
    trackedEntityInstance:string;

    toJSON():EventInt{
        return Object.assign({},this,{
            //convert fields that need converting
        })
    }

    static fromJSON(json:EventInt|string):Event{
        if(typeof json==='string'){
            return JSON.parse(json,Event.reviver)
        }else{
            let event = Object.create(Event.prototype);
            return Object.assign(event,json,{
                //convert fields that need converting
            })
        }
    }

    static reviver(key:string,value:any):any{
        return key===""?Event.fromJSON(value):value
    }

    updateEvent(eventId:string,event:Event,respService:ResponseService){
        var url = "events/"+eventId;
        var evntIdInFile={};
        evntIdInFile['id'] = event.event;
        event.event = eventId;
        AjaxCall.call("PUT",url,JSON.stringify(event),function(res){
            respService.addEvntResp({id:evntIdInFile['id'],systemid:res.response.reference,status:res.message,summary:JSON.stringify(res.response.importCount),conflict:res.response.conflicts})            
            respService.eventUpd(true);
        },
        function(res){
            var conflictMsg = null;
            if(res.response !=null && res.response.conflicts!=null){
                conflictMsg = JSON.stringify(res.response.conflicts);
            }
            respService.addEvntResp({id:evntIdInFile['id'],systemid:eventId,status:res.message,summary:null,conflict:conflictMsg})
            respService.eventUpd(false);
            //console.log(JSON.stringify(res));
            //update this space to map the tei ids 
        });
    }
    insertEvent(event:Event,respService:ResponseService){
        var url = "events";
        var evntIdInFile={};
        evntIdInFile['id'] = event.event;
        delete event.event;
        AjaxCall.call("POST",url,JSON.stringify(event),function(res){
            respService.addEvntResp({id:evntIdInFile['id'],systemid:res.response.importSummaries[0].reference,status:res.message,summary:JSON.stringify(res.response.importSummaries[0].importCount),conflict:JSON.stringify(res.response.importSummaries[0].conflicts)})            
            respService.eventIns(true);
        },
        function(res){
            var conflictMsg = "Insertion Failed";
            if(res.response !=null && res.response.importSummaries[0]!=null){
                conflictMsg = JSON.stringify(res.response.importSummaries[0].description);
            }
            respService.addEvntResp({id:evntIdInFile['id'],systemid:null,status:res.message,summary:null,conflict:conflictMsg})
            respService.eventIns(false);
        });
    }

    static findAndUpdateOrInstallEventsofTEI(teiId:string,events:Event[],respService:ResponseService){
        var resp = respService.getTEIresp(teiId);
        if(resp!=null){
            var url = "events?trackedEntityInstance="+resp.systemid;
            
            AjaxCall.call("GET",url,{},function(res){
                //console.log(JSON.stringify(res));
                var eventsExist = res.events;
                var eventsExistObjects = [];
                for(let event of eventsExist){
                    var evn:Event = Event.fromJSON(JSON.stringify(event));
                    eventsExistObjects.push(evn);
                }
                for(var event of events){
                    event.trackedEntityInstance = resp.systemid;
                    var eventFound = eventsExistObjects.find(x=>x.eventDate == event.eventDate && x.program== event.program && x.programStage ==event.programStage);
                    if(eventFound!=null){
                        event.updateEvent(eventFound.event,event,respService);
                    }else{
                        event.insertEvent(event,respService);
                    }
                }
                //console.log("teiId : "+ teiId + " ");
                //console.log(eventsExist);
                
            },
            function(res){
                //respService.addTEIresp({id:_tei.trackedEntityInstance,systemid:null,status:'Insertion Failed ',summary:null})
                //console.log(JSON.stringify(res));
                respService.addEvntResp({id:resp.systemid+" TEI ",systemid:null,status:'Events Request Failed ',summary:null,conflict:JSON.stringify(res.message)})
                //update this space to map the tei ids 
            })
        }else{
            console.log("mapping not found for "+teiId);
            //respService.addEvntResp({id:teiId+" TEI ",systemid:null,status:'Events Request Failed ',summary:null,conflict:null})
        }
        
    }


    
}