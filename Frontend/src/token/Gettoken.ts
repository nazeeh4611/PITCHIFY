import { UseSelector, useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import ExtractToken from "./ExtractToken";



export const useGetToken = (name:string) =>{
    try {
        const { UserAccessToken } = useSelector((state: RootState) => state.token);

        const token = UserAccessToken
        if(token){
            const userDetail = ExtractToken(token)
            return userDetail
        }
    } catch (error) {
        console.error("error occured while getting token")
        return null
    }
}