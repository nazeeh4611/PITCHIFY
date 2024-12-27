import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    AdminAccessToken: localStorage.getItem("admin") || "",
};




const AdminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
      AdminAuth: (state, action) => {
        const token = action.payload.token; 
        state.AdminAccessToken = token;
        localStorage.setItem("admin", token); 
      },
    },
  });
  


export const adminReducer =  AdminSlice.reducer
export const {AdminAuth} = AdminSlice.actions
