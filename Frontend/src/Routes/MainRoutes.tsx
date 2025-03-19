import React from "react";
import {Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Entreprenuer from "./Entrepreneur";
import Investor from "./Investor";
import Common from "./Commonroutes";
import { Provider } from "react-redux";
import  store  from "../Redux/Store";
import Admin from "./Admin";
import { ChatBotProvider } from "../Components/Chat/ChatProvider";

const Approutes:React.FC = ()=>{
    const GEMINI_API_KEY = "AIzaSyB89Te2svBe4-gpwXedgi25_KLxzUtzolQ" || 'your-api-key';

    return(
        <Provider store={store}>
                <ChatBotProvider apiKey={GEMINI_API_KEY}>

        <Router>
            <Routes>
                <Route path="/*" element={<Common/>}/>
                <Route path="/entrepreneur/*" element={<Entreprenuer/>} />
                <Route path="/investor/*" element={<Investor/>} />
                <Route path="/admin/*" element={<Admin/>} />
                
            </Routes>
        </Router>
        </ChatBotProvider>

        </Provider>
    )
}


export default Approutes