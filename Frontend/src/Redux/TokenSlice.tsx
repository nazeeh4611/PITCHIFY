import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    isVerifiedUser:false,
    UserAccessToken:localStorage.getItem("usertoken"||"")
}



const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
      addToken: (state, action) => {
        const token = action.payload.token; 
        state.UserAccessToken = token;
        state.isVerifiedUser = action.payload.isVerifiedUser; 
        localStorage.setItem("usertoken", token); 
      },
    },
  });
  


export const userReducer =  tokenSlice.reducer
export const {addToken} = tokenSlice.actions
