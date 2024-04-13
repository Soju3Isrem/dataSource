import dotenv from 'dotenv'
import express from "express"
import sensorRouter from "./domains/routes/sensor.routes.js"
import userAuth from "./domains/auth/auth.routes.js"




const resource = dotenv.config({path:'.env'})

const PORT = resource.parsed.PORT

const app = express();
app.use(express.json());

app.use("/",sensorRouter)
// app.use("/",userAuth)


app.listen(PORT,() =>{
    console.log('Server listening port ',PORT )
});