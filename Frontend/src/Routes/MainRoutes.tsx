import React from "react";
import {Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Entreprenuer from "./Enterprenuer";
import Investor from "./Investorroutes";
import Common from "./Commonroutes";
import { Provider } from "react-redux";
import  store  from "../Redux/Store";

const Approutes:React.FC = ()=>{

    return(
        <Provider store={store}>
        <Router>
            <Routes>
                <Route path="/*" element={<Common/>}/>
                <Route path="/entrepreneur/*" element={<Entreprenuer/>} />
                <Route path="/investor/*" element={<Investor/>} />
            </Routes>
        </Router>
        </Provider>
    )
}


export default Approutes