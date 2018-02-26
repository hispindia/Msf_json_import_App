/*
    Created By Ahmed Ifhaam
    On 26-02-2018
    
*/

export interface AttributeInt{
    attribute : string;
    code:string;
    created:string;
    displayName:string;
    lastUpdated:string;
    storedBy:string;
    value:string;
    valueType:string;


}

export class Attribute{
    attribute : string;
    code:string;
    created:string;
    displayName:string;
    lastUpdated:string;
    storedBy:string;
    value:string;
    valueType:string;
    
    constructor(id:string){
        this.attribute=id;
    }

    toJSON():AttributeInt{
        return Object.assign({},this,{
            //covert any fields that need conversion
        })
    }

    static fromJSON(json:AttributeInt|string):Attribute{
        if(typeof json==='string'){
            return JSON.parse(json,Attribute.reviver);
        }else{
            let attribute = Object.create(Attribute.prototype);
            return Object.assign(attribute,json,{
                //convert any fields that need conversion
            })
        }
    }

    static reviver(key:string,value:any):any{
        return key === ""?Attribute.fromJSON(value):value;
    }

    equals(obj:Attribute):boolean{
        if(obj.attribute === this.attribute){
            return true;
        }
        return false;
    }
}