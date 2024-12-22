import { DecodedToken } from "../Interfacetypes/types";
import { UseDispatch, useDispatch } from "react-redux";
import { addToken } from "../Redux/TokenSlice";
const ExtractToken = (token:string):DecodedToken | null =>{
    if(!token){
        console.error("token not provided for the extraction");
        return null
    }

    try {

        const dispatch = useDispatch()
        const tokenpart = token.split(".")[1];
        if(!tokenpart){
            console.error("Invalid token format")
            return null
        }

        const decodedToken = JSON.parse(atob(tokenpart));

        if(decodedToken.exp * 1000 < Date.now()){
            console.log("token is expired ");
            dispatch( dispatch(
                addToken({
                  token:"",
                  isVerifiedUser: false,
                })
              ));

              return null
        }
        return decodedToken
    } catch (error) {
        console.error("error occured while extracting the token")
        return null
    }
}

export default ExtractToken