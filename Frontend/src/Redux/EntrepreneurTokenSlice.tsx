import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    EntrepreneurAccessToken:localStorage.getItem("entrepreneur"||"")
}



const EntrepreneurSlice = createSlice({
    name: "entreprenuer",
    initialState,
    reducers: {
      EntrepreneurAuth: (state, action) => {
        const token = action.payload.token; 
        state.EntrepreneurAccessToken = token;
        localStorage.setItem("entrepreneur", token); 
      },
    },
  });
  


export const entrepreneurReducer =  EntrepreneurSlice.reducer
export const {EntrepreneurAuth} = EntrepreneurSlice.actions
