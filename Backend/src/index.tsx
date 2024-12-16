import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const PORT = 3009

const app = express()



app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`)
})
