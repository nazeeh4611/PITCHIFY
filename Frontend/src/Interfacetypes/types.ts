export interface Investor {
    _id:string,
    firstname:string,
    lastname:string,
    phone:number,
    email:string,
    password:string,
    confirmpassword:string
}

export interface DecodedToken {
    id: string;
    email: string;
    iat: number;
    exp: number;
  }