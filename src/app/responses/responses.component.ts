/*
    Created By Ahmed Ifhaam
    On 26-02-2018
    
*/

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import {Response,ResponseService} from './../response-service.service'
 

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.css'],
  
})
export class ResponsesComponent implements OnInit {
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


  teiSum:any[];
  enrSum:any[];
  eventSum:any[];
  constructor(
    private responseService:ResponseService) {

  }

  
  
  ngOnInit() {
    this.teiResponses = this.responseService.teiResponses;
    this.enrollmentResponses = this.responseService.enrollmentResponses;
    this.eventsResponses = this.responseService.eventsResponses;

    // this.teiInsSuc=this.responseService.teiInsSuc;
    // this.teiInsFail=this.responseService.teiInsFail;
    // this.teiUpdateSuc=this.responseService.teiUpdateSuc;
    // this.teiUpdateFailed=this.responseService.teiUpdateFailed;
    // this.enrollmentInSuc=this.responseService.enrollmentInSuc;
    // this.enrollmentInFailed=this.responseService.enrollmentInFailed;
    // this.eventInsSuc=this.responseService.eventInsSuc;
    // this.eventInsFailed=this.responseService.eventInsFailed;
    // this.eventUpdSuc=this.responseService.eventUpdSuc;
    // this.eventUpdFailed=this.responseService.eventUpdFailed;

    this.teiSum = this.responseService.teisum;
    this.enrSum = this.responseService.enrsum;
    this.eventSum = this.responseService.evntsum;
  }  

}

