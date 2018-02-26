/*
    Created By Ahmed Ifhaam
    On 26-02-2018
    
*/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ResponsesComponent } from './responses/responses.component';
import { ResponseService } from './response-service.service';




@NgModule({
  declarations: [
    AppComponent,
    ResponsesComponent,
    
  ],
  imports: [
    BrowserModule
  ],
  providers: [ResponseService],
  bootstrap: [AppComponent,ResponsesComponent]
})
export class AppModule { }
