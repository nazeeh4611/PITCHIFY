export interface Investor {
    _id:string,
    firstname:string,
    lastname:string,
    phone:string,
    email:string,
    password:string,
    confirmpassword:string,
    avatar:string,
}

export interface DecodedToken {
    id: string;
    email: string;
    iat: number;
    exp: number;
  }

