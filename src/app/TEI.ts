/*
    Created By Ahmed Ifhaam
    On 26-02-2018
    
*/

import {Attribute} from './Attribute'
import {BASE_URL,TEI_LOOKUP_ATR_ID} from './CONSTANTS'
import { AjaxCall } from './AjaxCall'
import {ResponsesComponent} from './responses/responses.component'
import {ResponseService} from './response-service.service'
 
export interface TEIInt{
    attributes : Attribute[];
    createdAtClient: string;
    deleted :boolean;
    inactive:boolean;
    lastUpdatedAtClient:string;
    orgUnit:string;
    trackedEntity:string;
    trackedEntityInstance:string;
}

export class TEI{
    attributes : Attribute[];
    createdAtClient: string;
    deleted :boolean;
    inactive:boolean;
    lastUpdatedAtClient:string;
    orgUnit:string;
    trackedEntity:string;
    trackedEntityInstance:string;

    toJSON():TEIInt{
        return Object.assign({},this,{
            //convert any fields that needs conversion
        })
    }

    static fromJSON(json:TEIInt|string):TEI{
        if(typeof json ==='string'){
            return JSON.parse(json,TEI.reviver);
        }else{
            let tei = Object.create(TEI.prototype);
            let obj = Object.assign(tei,json,{
                //covnert any fields that need conversion
            });
            let attributes:Attribute[] = [];
            for(let atr of tei.attributes){
                atr = Attribute.fromJSON(atr);
                attributes.push(atr);
            }
            obj.attributes = attributes;
            return obj;
        }
    }
    
    static reviver(key:string,value:any){
        return key===""?TEI.fromJSON(value):value;
    }

    findTEIId(tei:TEI,rp:ResponseService){
        let promis = new Promise((resolve)=>{
            var atrVal = null;
            var atr = tei.getAttribute(TEI_LOOKUP_ATR_ID,tei,rp);
            if(atr!=null){
                atrVal= atr.value;
                var url = "trackedEntityInstances.json?fields=trackedEntityInstance&ou="
                    +tei.orgUnit+"&filter="+TEI_LOOKUP_ATR_ID+":EQ:"+atrVal;
                //var url = http://localhost:8084/dhis/api/trackedEntityInstances.json?fields=*&ou=PUKOzHM1lxs&filter=lYrG0wc9kI3:EQ:NCD-16-599
                
                var pr = AjaxCall.call("GET",url,{},(res)=>{
                    console.log("Succeeded for : " + tei.trackedEntityInstance+" Res :"+ JSON.stringify(res));
                    if(res.trackedEntityInstances.length>0){
                        tei.updateTEI(res.trackedEntityInstances[0].trackedEntityInstance,tei,rp).then(resolve);
                    }else if(res.trackedEntityInstances.length==0){
                        tei.insertTEI(tei,rp).then(resolve);
                    }
                    
                },
                (res)=>{
                    rp.addTEIresp({id:tei.trackedEntityInstance,systemid:null,status:'Lookup Failed',summary:null,conflict:null});
                    //pushResponse(tei.trackedEntityInstance,{systemTEI:null,status:'ERROR'});
                    //console.log(JSON.stringify(res));
                    console.log("Atr Look up Failed for : "+ tei.trackedEntityInstance+" Res :"+ res);
                    rp.teiUpd(false);
                    resolve();
                })
            }else{
                rp.addTEIresp({id:tei.trackedEntityInstance,systemid:null,status:'Unique Attribute not found',summary:null,conflict:null});
                    //pushResponse(tei.trackedEntityInstance,{systemTEI:null,status:'ERROR'});
                    //console.log(JSON.stringify(res));
                    console.log('Unique Attribute not found'+ tei.trackedEntityInstance);
                    rp.teiUpd(false);
                    resolve();
            }

            

            //pr.then(resolve);

            
        });
        return promis;
        
    }

    getAttribute(id:string,tei:TEI,res:ResponseService):Attribute{
        return tei.attributes.find(item=>item.attribute==id);        
    }

    updateTEI(id:string,_tei:TEI,respService:ResponseService){
        var ret = new Promise((resolve)=>{
            var url = "trackedEntityInstances/"+id;
            var teiId = {};
            teiId['id'] = _tei.trackedEntityInstance;
            delete _tei.trackedEntityInstance;
            
            AjaxCall.call("PUT",url,JSON.stringify(_tei),function(res){
                //console.log(JSON.stringify(res));
                respService.addTEIresp({id:teiId['id'],systemid:res.response.reference,status:res.message,summary:JSON.stringify(res.response.importCount),conflict:JSON.stringify(res.response.conflicts)});
                //update this space to map the tei ids 
                respService.teiUpd(true);
            },
            function(res){
                var conflictMsg = null;
                if(res.response!=null && res.response.conflicts!=null){
                    conflictMsg = JSON.stringify(res.response.conflicts);
                }
                respService.addTEIresp({id:teiId['id'],systemid:null,status:res.message,summary:null,conflict:conflictMsg});
                //console.log(JSON.stringify(res));
                //update this space to map the tei ids 
                respService.teiUpd(false);
            }).then(resolve);
        });
        return ret;
        
    }

    insertTEI(_tei:TEI,respService:ResponseService){
        var ret = new Promise((resolve)=>{
            var url = "trackedEntityInstances";
            var teiId = {};
            teiId['id'] = _tei.trackedEntityInstance;
             //teiId = JSON.parse(teiId);
            delete _tei.trackedEntityInstance;
            AjaxCall.call("POST",url,JSON.stringify(_tei),function(res){
                //console.log(JSON.stringify(res));
                respService.addTEIresp({id:teiId['id'],systemid:res.response.importSummaries[0].reference,status:res.message,summary:JSON.stringify(res.response.importSummaries[0].importCount),conflict:JSON.stringify(res.response.conflicts)});
                //update this space to map the tei ids 
                respService.teiIns(true);
            },
            function(res){
                var conflictMsg = null;
                if(res.response!=null && res.response.conflicts!=null){
                    conflictMsg = JSON.stringify(res.response.conflicts);
                }
                respService.addTEIresp({id:teiId['id'],systemid:null,status:res.message,summary:null,conflict:conflictMsg});
                //console.log(JSON.stringify(res));
                respService.teiIns(false);
                //update this space to map the tei ids 
            }).then(resolve);
        });
        return ret;
    }

    
}