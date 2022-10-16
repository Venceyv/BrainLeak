import {Reply, User} from '../models/index.js'
import json from 'body-parser';
async function checkReplyExist(req,res,next)
{
    try {
        const reply = await Reply.findById(req.params.replyId).lean();
        if(!reply)
        {
            res.status(404);
            throw 'Reply does not exist';
        }
        req.reply = reply;
        return next();

    } catch (error) {
        res.json({error:error});
    }
}
async function checkReplyAuth(req,res,next)
{
    try {
        if(!req.reply.author.equals(req.user._id))
        {
            res.status(401);
            throw 'unauthorized';
        }
        return next();
    } catch (error) {
        res.json({error:error});
    }
}
export{checkReplyExist,checkReplyAuth};