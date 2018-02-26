/*
    Created By Ahmed Ifhaam
    On 26-02-2018
    
*/

import { Component } from '@angular/core';
import * as fse from 'fs-extra'
import {TEI} from './TEI'
import {FileProcessor} from './FileProcessor'
import { ResponseService } from './response-service.service';
import {BASE_URL} from './CONSTANTS'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  constructor(private repSer:ResponseService){

  }
  
  start(event):void{
    
    var fileContent = '';//'{ "myString": "string", "myNumber": 4 }';
    var reader = new FileReader();
    var fp = new FileProcessor(this.repSer);
    
    reader.onload = function(){
       fp.contentReceived(reader.result);
       
    }
    if(event.target.files.length>0){
      //console.log(event.target.files[0].name);
      reader.readAsText(event.target.files[0]);
    }
    
  }
}


