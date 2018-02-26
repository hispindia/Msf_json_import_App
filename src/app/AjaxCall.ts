/*
    Created By Ahmed Ifhaam
    On 26-02-2018
    
*/

import {BASE_URL} from './CONSTANTS'
import {} from 'jquery'
import { promise } from 'protractor';

interface ajaxque{
    type:string;
    url:string;
    data:any;
    successCallback:any;
    failureCallBack:any;
    resolve:any;
}

let ajaxQueue:ajaxque[] = [];
let currentCalls = 0;

export class AjaxCall{

    
    static call(_type,_url,_data,_successCallback,_failureCallBack){
        var ret = new Promise((resolve)=>{
            var queObj:ajaxque =
             {type:_type,url:_url,data:_data,successCallback:_successCallback
                ,failureCallBack:_failureCallBack,resolve:resolve};
            if(currentCalls<50){
                currentCalls++;
                this.callSingle(queObj);
            }else{
                ajaxQueue.push(queObj);
            }
        });
        return ret;
    }

    static callSingle(aq:ajaxque){
        AjaxCall.ajaxrequest(aq.type,aq.url,aq.data,aq.successCallback,aq.failureCallBack).then(
            function(){
                currentCalls--;
                AjaxCall.deque();
                aq.resolve();
            }
        );
    }

    static deque(){
        while(currentCalls<50 && ajaxQueue.length>0){
            var obj = ajaxQueue.pop();
            
            this.callSingle(obj);
            currentCalls++;
        }
    }

    static ajaxrequest(_type,_url,_data,_successCallback,_failureCallBack){
            var ret = new Promise((resolve)=>{
                //console.log(_url);
                var request = $.ajax({
                    type:_type,
                    url:BASE_URL+ _url,
                    data:_data,
                    contentType:'application/json',
                    dataType:'json'
                });
                
                request.done(function(res){
                    _successCallback(res);
                    resolve();
                });
                request.fail(function(jqXHR,textStatus){
                    // console.log(textStatus);
                    _failureCallBack(jqXHR.responseJSON);
                    resolve();
                });
                
            });
            
    
            return ret;
        }

    // static call(_type,_url,_data,_successCallback,_failureCallBack){
    //     var ret = new Promise((resolve)=>{
    //         //console.log(_url);
    //         var request = $.ajax({
    //             type:_type,
    //             url:BASE_URL+ _url,
    //             data:_data,
    //             contentType:'application/json',
    //             dataType:'json'
    //         });
            
    //         request.done(function(res){
    //             _successCallback(res);
    //             resolve();
    //         });
    //         request.fail(function(jqXHR,textStatus){
    //             // console.log(textStatus);
    //             _failureCallBack(jqXHR.responseJSON);
    //             resolve();
    //         });
            
    //     });
        

    //     return ret;
    // }
}