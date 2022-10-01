import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import {promisify} from 'util';
const tojwt = promisify(jwt.sign);
const verify = promisify(jwt.verify);
const createToken = async userInfo =>{
    return await tojwt(
        {
            userInfo
        },
        process.env.SECRETORKEY,
        {
            expiresIn: '1d'
        }
    )
}
const verifyToken = function(required = true){ 
    return async (req,res,next)=>{
    let token = req.headers.authorization;
    token = token?token.replace('Bearer ',''):null;
    if(token){
        try {
            const userInfo = await verify(token,process.env.SECRETORKEY);
            req.user = userInfo;
            next();
        } catch (error) {
            res.status(401).json({error:'invalid token'});
        }
    }
    else if(required)
    {
        res.status(401).json({error:'no token is passed'});
    }
    else
    {
        next();
    }
    
}
}

export {createToken,verifyToken};