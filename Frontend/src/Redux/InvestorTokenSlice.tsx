import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    InvestorAccessToken:localStorage.getItem("investorToken"||"")
}



const InvestorSlice = createSlice({
    name: "investor",
    initialState,
    reducers: {
        InvestorAuth: (state, action) => {
        const token = action.payload.token; 
        state.InvestorAccessToken = token;
        localStorage.setItem("investorToken", token); 
      },
    },
  });
  


export const investorReducer =  InvestorSlice.reducer
export const {InvestorAuth} = InvestorSlice.actions
