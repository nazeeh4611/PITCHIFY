import React from "react";
import {Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Entreprenuer from "./Entrepreneur";
import Investor from "./Investor";
import Common from "./Commonroutes";
import { Provider } from "react-redux";
import  store  from "../Redux/Store";
import Admin from "./Admin";

const Approutes:React.FC = ()=>{

    return(
        <Provider store={store}>
        <Router>
            <Routes>
                <Route path="/*" element={<Common/>}/>
                <Route path="/entrepreneur/*" element={<Entreprenuer/>} />
                <Route path="/investor/*" element={<Investor/>} />
                <Route path="/admin/*" element={<Admin/>} />
            </Routes>
        </Router>
        </Provider>
    )
}


export default Approutes