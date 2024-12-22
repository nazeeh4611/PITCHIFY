import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import { entrepreneurrouter } from "./Interface/Route/EntrepreneurRoute";
import {InvestorRouter} from "./Interface/Route/InvestorRoute";
import dotenv from 'dotenv';
import {connectDB} from './Infrastructure/Database/Connection/Db'
dotenv.config();

connectDB()


const PORT = 3009



const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true
}));


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Entrepreneur Route
app.use("/api/entrepreneur",entrepreneurrouter)

// InvestorRoute
app.use("/api/investor",InvestorRouter)

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`)
})
