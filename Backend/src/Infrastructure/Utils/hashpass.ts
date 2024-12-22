import bcrypt from "bcrypt"

export const hashpass = async(password:string):Promise<string> =>{
   const salt = 15
   const hashedpass = await bcrypt.hash(password,salt);
   return hashedpass
}

export const verifypass = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};


