import schedule from 'node-schedule';
import { Post,Comment } from '../models/index.js';

function clearCommentByTime(time) {
    schedule.scheduleJob(time, async function (Comment) {
        try {
            const commentList = await Comment.find();
            await Promise.all(commentList.map(async function(comment)
            {
                const record = await Post.findById(comment.relatedPost);
                if(!record)
                {
                    await Comment.findByIdAndDelete(comment._id);
                }
            }))
        } catch (error) {
            console.log(error);
        }
    }.bind(null, Comment));
}
export {clearCommentByTime}