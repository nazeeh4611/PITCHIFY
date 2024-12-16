import {Types} from 'mongoose'

export interface IEntrepreneurdata{
    _id?:any;
    firstname:string;
    lastname:string;
    email:string;
    phone:number;
    password:string;
    confirmpassword:string;
    is_Blocked:boolean;
    is_Admin:boolean;
}

export class Entrepreneur implements Omit <IEntrepreneurdata,keyof Document>{
    _id?:any;
    firstname:string;
    lastname:string;
    email:string;
    phone:number;
    password:string;
    confirmpassword:string;
    is_Blocked:boolean;
    is_Admin:boolean;
    

    constructor(data:Partial<IEntrepreneurdata>){
        this._id = data._id,
        this.firstname = data.firstname!;
        this.lastname = data.lastname!;
        this.email = data.email!;
        this.phone = data.phone!;
        this.password = data.password!;
        this.confirmpassword = data.confirmpassword!;
        this.is_Admin = data.is_Admin??false;
        this.is_Blocked = data.is_Blocked??false;
    }

    toIEntrepreneurData():IEntrepreneurdata {
        return {
            _id: this._id,
            firstname:this.firstname,
            lastname:this.lastname,
            email:this.email,
            phone:this.phone,
            password:this.password,
            confirmpassword:this.confirmpassword,
            is_Admin:this.is_Admin,
            is_Blocked:this.is_Blocked
        };
    }

}

