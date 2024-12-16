import React from "react";
import {Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Entreprenuer from "./Enterprenuer";
import Common from "./Commonroutes";

const Approutes:React.FC = ()=>{
    return(
        <Router>
            <Routes>
                <Route path="/*" element={<Common/>}/>
                <Route path="/entrepreneur/*" element={<Entreprenuer/>} />
                <Route path="/investor/*" element={<Entreprenuer/>} />
            </Routes>
        </Router>
    )
}


export default Approutes