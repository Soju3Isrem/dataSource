import {Router, json} from "express";
import { PrismaClient} from '@prisma/client';

import {generarToken, verificarToken} from './vrjwt.js'

import crypto from 'crypto';


const router = Router();
const prisma = new PrismaClient();


router.post('/auth',async (req,res)=>{

    const { mail, contrasena } = req.headers;


    const passwordHash = crypto.createHash('sha256').update(contrasena).digest('hex');
    const data = {
        username: user,
        hash: passwordHash,
    };

    const DataUser = await prisma.user.findFirst({
        where:{
            user: data.user,
            password: data.hash
        }
    })

    if(DataUser){
        const token = generarToken({ usuario: DataUser.username });
        res.json({ token: token });
    }else{
        res.status(400).send('Fail auth');
    }

});


export default router;