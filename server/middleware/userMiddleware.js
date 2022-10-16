import { User } from "../models/index.js";
import json from 'body-parser';
async function checkUserExist(req, res, next) {
    try {
        const user = await User.findById(req.params.userId,{email:1,username:1}).lean();
        if (!user)
        {
            res.status(404);
            throw 'User does not exist';
        }
        req.targetUser = user;
        return next();
    } catch (error) {
        res.json({error:error});
    }
}
function checkUserAuth(req,res,next){
    try {
        if(req.targetUser.email != req.user.email)
        {
            res.status(401);
            throw 'unauthorized';
        }
        return next();
    } catch (error) {
        res.json({error:error});
    }
}
export {checkUserExist,checkUserAuth};