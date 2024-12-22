import {configureStore} from "@reduxjs/toolkit";

import { userReducer } from "./TokenSlice";

 const store = configureStore({
    reducer:{
        token:userReducer
    }
});
export type RootState = ReturnType<typeof store.getState>;
export default store;

