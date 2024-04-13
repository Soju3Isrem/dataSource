import {Router, json} from "express"
import {Prisma, PrismaClient} from '@prisma/client'
import {autenticarToken} from '../auth/autenticacion.js'

const router = Router();
const prisma = new PrismaClient();

// router.get('/data',autenticarToken,async (req,res)=>{
router.get('/data',async (req,res)=>{

    const {id,mailUser} = req.headers;
    
    const User = await prisma.User.findFirst({
        where:{
            id: parseInt(id),
            mail: mailUser   
        }
    });

    if(User){
        const Device = await prisma.Device.findMany({
            where:{
                idUser: parseInt(User.id)
            }
        });
    }

    if(Device){
        const sensorData = await prisma.sensorData.findMany({
            where:{
                idDevice:Device.idUser
            }
        });

        if(Object.values(sensorData).length!=0){
            res.json(sensorData);
        }else{
            res.status(404).send('Device not dat');
        }
    }else{
        res.status(404).send('Device not exist');
    }

});

// router.post('/sensor',autenticarToken, async (req,res)=>{
router.post('/sensor', async (req,res)=>{
    const {id, humedad, temperatura,longitud,latitud} = req.headers;

    console.log(id, humedad, temperatura,longitud,latitud);
    const searchDevice = await prisma.Device.findFirst({
        where:{
            id:parseInt(id)
        }
    })



    if(searchDevice){

        
        

        await prisma.dataSensor.create({
            data:{
                idDevice:parseInt(id),
                Humedad: parseFloat(humedad),
                Temperatura: parseFloat(temperatura),
                Longitud:  longitud,
                Latitud: latitud
                
            }
        });


  
        res.json('Temperatura:'+humedad+','+'Humedad:'+temperatura)
    }else{
        res.status(404).send('Err 404 \n Devices not exist')
    }

});

export default router;