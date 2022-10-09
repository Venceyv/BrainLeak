import schedule from 'node-schedule';
import { Reply,Comment } from '../models/index.js';

function clearReplyByTime(time) {
    schedule.scheduleJob(time, async function (Reply) {
        try {
            const replyList = await Reply.find();
            await Promise.all(replyList.map(async function(reply)
            {
                const record = await Comment.findById(reply.relatedComment);
                if(!record)
                {
                    await Reply.findByIdAndDelete(reply._id);
                }
            }))
        } catch (error) {
            console.log(error);
        }
    }.bind(null, Reply));
}
export {clearReplyByTime}