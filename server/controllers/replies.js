import { Reply, Comment, ReplyLike } from "../models/index.js";
import { incCommentStatistics } from "../services/commentServices.js";
import { addReplyStatistics, addReplyUserInfo, deleteRedisReplyProfile, 
    getRedisReplyProfile, incReplyStatistics, saveRedisReplyProfile } from "../services/replyServices.js";
import { userTrendingInc,incUserStatistics } from "../services/userServices.js";
async function replyToComment(req, res) {
    try {
        const [comment,] = await Promise.all(
            [
                Comment.findById(req.params.commentId).lean()
                , incCommentStatistics(req.params.commentId, 'replies', 1)
                , deleteRedisReplyProfile(req.params.commentId)
            ]
        );
        const dbBack = await new Reply({
            content: req.body.content, relatedComment: comment._id,
            relatedPost: req.params.postId, mentionedUser: comment.author,
            author: req.user._id
        }).save();
        const accessToken = req.accessToken;
        return res.status(200).json({ dbBack, accessToken });
    } catch (error) {
        res.status(401).json({ error: error });
    }
}
async function deleteReply(req, res) {
    try {
        await Promise.all([
            incCommentStatistics(req.params.commentId, 'replies', -1)
            , deleteRedisReplyProfile(req.params.commentId),
            Reply.findByIdAndDelete(req.params.replyId)
        ])
        res.status(200).json({ msg: 'delete successfully' });

    } catch (error) {
        res.status(401).json({ error: error });
    }
}
async function likeReply(req, res) {
    try {
        const accessToken = req.accessToken;
        const replyId = req.params.replyId;
        const userId = req.user._id;
        const dbBack = await ReplyLike.findOne({ user: userId, reply: replyId }, { like: 1 });
        let like = true;
        if (dbBack && dbBack.like) {
            like = false;
            dbBack.remove();
            await Promise.all([
                incReplyStatistics(replyId, 'likes', -1),
                userTrendingInc(req.reply.author,-4),
                incUserStatistics(req.post.author,'upvotes',-1)
            ]);
            return res.status(200).json({ like, accessToken });
        }
        await Promise.all([
            incReplyStatistics(replyId, 'likes', 1),
            userTrendingInc(req.reply.author,4),
            incUserStatistics(req.post.author,'upvotes',1)
        ])
        if (dbBack) {
            dbBack.like = true;
            dbBack.save();
            await incReplyStatistics(replyId, 'dislikes', -1);
            return res.status(200).json({ like, accessToken })
        }
        await new ReplyLike({ user: userId, reply: replyId }).save();
        return res.status(200).json({ like, accessToken })
    } catch (error) {
        res.status(401).json({ error: error });
    }
}
async function dislikeReply(req, res) {
    try {
        const accessToken = req.accessToken;
        const replyId = req.params.replyId;
        const userId = req.user._id;
        const dbBack = await ReplyLike.findOne({ user: userId, reply: replyId }, { like: 1 });
        let dislike = true;
        if (dbBack && !dbBack.like) {
            dislike = false;
            dbBack.remove();
            await incReplyStatistics(replyId, 'dislikes', -1);
            return res.status(200).json({ dislike, accessToken });
        }
        await incReplyStatistics(replyId, 'dislikes', 1);
        if (dbBack) {
            dbBack.like = false;
            dbBack.save();
            await Promise.all([
                incReplyStatistics(replyId, 'likes', -1),
                userTrendingInc(req.reply.author,-4),
                incUserStatistics(req.post.author,'upvotes',-1)
            ]);
            return res.status(200).json({ dislike, accessToken })
        }
        await new ReplyLike({ user: userId, reply: replyId, like: false }).save();
        return res.status(200).json({ dislike, accessToken })
    } catch (error) {
        res.status(401).json({ error: error });
    }
}
async function getReplies(req, res) {
    try {
        const commentId = req.params.commentId;
        const accessToken = req.accessToken;
        const order = req.query.sort;
        let dbBack = await getRedisReplyProfile(commentId);
        if (!dbBack) {
            dbBack = await Reply.find({ relatedComment: commentId })
                .lean()
                .populate('mentionedUser', { username: 1, avatar: 1 }, { lean: true })
                .populate('author', { username: 1, avatar: 1 }, { lean: true });             
        }
        if (dbBack.length != 0) {
            await saveRedisReplyProfile(commentId,dbBack);
            if (req.user) {
                dbBack = await Promise.all(dbBack.map(async (reply) => {
                    reply = await addReplyUserInfo(req.user._id, reply);
                    return reply;
                }))
            }
            dbBack = await Promise.all(dbBack.map(async (reply) => {
                reply = await addReplyStatistics(reply);
                return reply;
            }))
            switch (order) {
                case 'latest':
                    dbBack.sort((a, b) => {
                        return new Date(b.createTime) - new Date(a.createTime);
                    })
                    break;
                default:
                    dbBack.sort((a, b) => {
                        return b.statistics.likes - a.statistics.likes;
                    })
                    break;
            }
        }
        return res.status(200).json({ dbBack, accessToken });
    } catch (error) {
        res.status(401).json({ error: error });
    }
}
export {
    replyToComment, deleteReply,
    likeReply, dislikeReply, getReplies
};