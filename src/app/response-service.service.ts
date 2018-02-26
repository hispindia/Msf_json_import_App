/*
    Created By Ahmed Ifhaam
    On 26-02-2018
    
*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject} from 'rxjs/BehaviorSubject'

export interface Response{
  id:string;
  systemid:string;
  status:string;
  summary:any;
  conflict:any;
}

@Injectable()
export class ResponseService {
  teiResponses:Response[];
  enrollmentResponses:Response[];
  eventsResponses:Response[];
  
  // teiInsSuc;
  // teiInsFail;
  // teiUpdateSuc;
  // teiUpdateFailed;
  // enrollmentInSuc;
  // enrollmentInFailed;
  // eventInsSuc;
  // eventInsFailed;
  // eventUpdSuc;
  // eventUpdFailed;

  teisum:any[];  
  enrsum:any[];
  evntsum:any[];
  constructor() { 
    // this.dataStore = {responses:[]}
    // this._responses = <BehaviorSubject<Response[]>>new BehaviorSubject([]);
    // this.responses = this._responses.asObservable();
    this.teiResponses = [];
    this.enrollmentResponses=[];
    this.eventsResponses = [];
    

    this.teisum = [];
    this.teisum[0] =0;
    this.teisum[1] =0;
    this.teisum[2] =0;
    this.teisum[3] =0;

    this.enrsum = [];
    this.enrsum[0] = 0;
    this.enrsum[1] = 0;

    this.evntsum = [];
    this.evntsum[0] =0;
    this.evntsum[1] =0;
    this.evntsum[2] =0;
    this.evntsum[3] =0;

    // this.teiInsSuc=0;
    // this.teiInsFail=0;
    // this.teiUpdateSuc=0;
    // this.teiUpdateFailed=0;
    // this.enrollmentInSuc=0;
    // this.enrollmentInFailed=0;
    // this.eventInsSuc=0;
    // this.eventInsFailed=0;
    // this.eventUpdSuc=0;
    // this.eventUpdFailed=0;
  }
  

  addTEIresp(response:Response){
    //this.dataStore.responses.push(response);
    //this._responses.next(Object.assign({},this.dataStore).responses)
    //console.log(this.responses);
    this.teiResponses.push(response);
  }

  teiIns(suc:boolean){
    if(suc){
      // this.teiInsSuc++;
      this.teisum[0]++;
    }else{
      //this.teiInsFail++;
      this.teisum[1]++;
    }
  }

  teiUpd(suc:boolean){
    // if(suc){
    //   this.teiUpdateSuc++;
    // }else{
    //   this.teiUpdateFailed++;
    // }

    if(suc){
      // this.teiInsSuc++;
      this.teisum[2]++;
    }else{
      //this.teiInsFail++;
      this.teisum[3]++;
    }
  }

  getTEIresp(id:string){
    return this.teiResponses.find(re=>re.id==id);
  }

  getTEISize(){
    return this.teiResponses.length;
  }


  addEnrResp(response:Response){
    this.enrollmentResponses.push(response);
  }

  getEnrResp(id:string){
    return this.enrollmentResponses.find(re=>re.id == id);
  }

  enrollIns(suc:boolean){
    if(suc){
      // this.enrollmentInSuc++;
      this.enrsum[0]++;
    }else{
      // this.enrollmentInFailed++;
      this.enrsum[1]++;
    }
  }

  getEnrSize(){
    return this.enrollmentResponses.length;
  }

  addEvntResp(response:Response){
    this.eventsResponses.push(response);
  }

  eventIns(suc:boolean){
    if(suc){
      // this.eventInsSuc++;
      this.evntsum[0]++;
    }else{
      this.evntsum[1]++;
      // this.eventInsFailed++;
    }
  }

  eventUpd(suc:boolean){
    if(suc){
      //this.eventUpdSuc++;
      this.evntsum[2]++;
    }else{
      this.evntsum[3]++;
      //this.eventUpdFailed++;
    }
  }
}
