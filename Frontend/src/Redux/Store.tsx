import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { entrepreneurReducer } from "./EntrepreneurTokenSlice";
import { investorReducer } from "./InvestorTokenSlice";
import { adminReducer } from "./AdminTokenSlice";

const rootReducer = combineReducers({
  entrepreneur: entrepreneurReducer,
  investor: investorReducer,
  admin: adminReducer,
});

const store = configureStore({
  reducer:rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
