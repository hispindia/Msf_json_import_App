/*
    Created By Ahmed Ifhaam
    On 26-02-2018
    
*/

import { FileContentInt, FileContent } from "./FileContent";
import {TEI} from "./TEI"
import { ResponseService } from "./response-service.service";
import {Event} from "./Event"


export class FileProcessor{

    constructor(private ser:ResponseService){

    }

    contentReceived(content){
        //console.log(content);
        //console.log(fileContent);
        let obj:FileContentInt = JSON.parse(content);
        let obj2:FileContent = FileContent.fromJSON(content);
        //console.log(obj);
        //console.log(obj2);
        console.log("--------------------")
        // var i =0;
        // for(let tei of obj2.trackedEntityInstances){
        //     //console.log(
        //       //tei.trackedEntityInstance + " : " +
        //        tei.findTEIId(tei,this.ser).then()
        //       i++;
        //       if(i==25) break;
        // }
        
        //while(obj2.trackedEntityInstances.length!=this.ser.getTEISize()){
        
        this.updateTEIS(obj2).then(()=>{
            console.log("here x : ");
            this.updateEnrollments(obj2).then(()=>{
                let  a = FileProcessor.mapEventsToTei(obj2.events);
                console.log(a);
                console.log("enrollements done");
                for(let s of Object.keys(a)){
                    Event.findAndUpdateOrInstallEventsofTEI(s,a[s],this.ser);
                }
            });
                
        });
        
        
        
        //console.log(JSON.stringify(obj2));
      //console.log(obj.myString);
      //console.log(obj.myNumber)
    }

    updateTEIS(obj2){
        var ret = new Promise((resolve)=>{
            var promises = [];
            var i =0;
            for(let tei of obj2.trackedEntityInstances){
                //console.log(
                //tei.trackedEntityInstance + " : " +
                promises.push(tei.findTEIId(tei,this.ser));
                // i++;
                // if(i==25) break;
            }
            Promise.all(promises).then(resolve);
            

        });
        return ret;
    }

    updateEnrollments(obj2){
        var ret = new Promise((resolve)=>{
            var promises = [];
            var i =0;
            for(let enrollment of obj2.enrollments){
                promises.push(enrollment.findEnrollmentId(enrollment,this.ser));
            }
            Promise.all(promises).then(resolve);
            

        });
        return ret;
    }

    static mapEventsToTei(objarray:Event[]){
        let mapped = {};
        for(let obj of objarray){
            if(mapped[obj.trackedEntityInstance]===undefined){
                mapped[obj.trackedEntityInstance] = [];
            }
            mapped[obj.trackedEntityInstance].push(obj);
        }

        return mapped;
    }
}