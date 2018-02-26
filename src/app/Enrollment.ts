/*
    Created By Ahmed Ifhaam
    On 26-02-2018
    
*/

import { AjaxCall } from "./AjaxCall";
import { ResponseService } from "./response-service.service";
import { resolve } from "q";

export interface EnrollmentInt{
    enrollment:string;
    enrollmentDate:string;
    followup:boolean;
    incidentDate:string;
    orgUnit:string;
    orgUnitName:string;
    program:string;
    status:string;
    trackedEntity:string;
    trackedEntityInstance:string;
}

export class Enrollment{

    enrollment:string;
    enrollmentDate:string;
    followup:boolean;
    incidentDate:string;
    orgUnit:string;
    orgUnitName:string;
    program:string;
    status:string;
    trackedEntity:string;
    trackedEntityInstance:string;

    toJSON():EnrollmentInt{
        return Object.assign({},this,{
            //convert fields that need converting
        })
    }

    findEnrollmentId(enrollment:Enrollment,respService:ResponseService){
        //change the tracked Entity Instance to be picked from the map
        //get the tie id in this system 
        let ret = new Promise((resolve)=>{
            var teiId = respService.getTEIresp(enrollment.trackedEntityInstance);
            if(teiId==null){
                console.log("enrollement failed");
                respService.addEnrResp(
                    {id:enrollment.trackedEntityInstance,systemid:null,status:'System Id Lookup Failed',summary:null,conflict:null});
                respService.enrollIns(false);
                    resolve(); 
                
            }else if(teiId.status == 'Lookup Failed' || teiId.systemid==null){
                respService.addEnrResp(
                    {id:enrollment.trackedEntityInstance,systemid:null,status:'Matching TEI not found',summary:null,conflict:null});
                respService.enrollIns(false);    
                resolve();
            }else{
                // console.log("enrollment succeeded");
                
                var url = "enrollments?ou="+enrollment.orgUnit+"&trackedEntityInstance="+teiId.systemid;
                AjaxCall.call("GET",url,{},(res)=>{
                    if(res.enrollments.length>0){
                        
                        respService.addEnrResp({id:enrollment.trackedEntityInstance,systemid:teiId.systemid,status:'Already Enrollment',summary:null,conflict:null})
                        //enrollment.updateEnrollment(res.enrollments[0].enrollment,enrollment);
                        respService.enrollIns(true);
                        resolve();
                    }else if(res.enrollments.length==0){
                        enrollment.trackedEntityInstance=teiId.systemid;
                        enrollment.insertEnrollment(enrollment,respService).then(resolve);
                        
                    }else{
                        respService.enrollIns(false);
                        resolve();
                    }
                },
                (res)=>{
                    //console.log(JSON.stringify(res));
                    respService.enrollIns(false);
                    resolve();
                });
            } 
        });
        return ret;
        
    }

    insertEnrollment(enrollment,respService:ResponseService){
        var ret = new Promise((resolve)=>{
            var url = "enrollments/";
            delete enrollment.enrollement;
            AjaxCall.call("POST",url,JSON.stringify(enrollment),function(res){
                //console.log(res);
                respService.addEnrResp({id:enrollment.trackedEntityInstance+"(TEI)",systemid:res.response.importSummaries[0].reference,status:res.response.status,summary:JSON.stringify(res.response.importSummaries[0].importCount),conflict:null});
                respService.enrollIns(true);
            },
            function(res){
                 
                respService.addEnrResp({id:enrollment.trackedEntityInstance+"(TEI)",systemid:null,status:"Failed",summary:null,conflict:res.message})
                respService.enrollIns(false);
            }).then(resolve);
        });

        return ret;
        
    }

    // insertEnrollment(enrollment){
    //     var url = "enrollments"+
    //     AjaxCall.call("POST",url,JSON.stringify(enrollment),(res)=>{

    //     },
    //     (res)=>{

    //     });
    // }

    static fromJSON(json:EnrollmentInt|string):Enrollment{
        if(typeof json === 'string'){
            return JSON.parse(json,Enrollment.reviver);
        }else{
            let enrollment = Object.create(Enrollment.prototype);
            return Object.assign(enrollment,json,{
                //convert fields that need conversion
            });
        }
    }

    static reviver(key:string,value:any):any{
        return key===""?Enrollment.fromJSON(value):value
    }

}