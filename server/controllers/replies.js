import { Reply, Comment, Post } from "../models/index.js";
import { getLogginedUser } from "../services/userServices.js";
async function replyToComment(req, res) {
    try {
        const [comment, logginedUser] = await Promise.all(
            [
                Comment.findById(req.params.commentId)
                , getLogginedUser(req, res)
            ]
        );
        if (comment) {
            const post = await Post.findById(comment.relatedPost);
            if (!post) {
                await Comment.findByIdAndDelete(comment._id);
                res.status(404);
                throw 'Post does not exist';
            }
            const dbBack = await new Reply({
                content: req.body.content, relatedComment: comment._id,
                relatedPost: post._id,mentionedUser: comment.author, 
                author: logginedUser._id
            }).save();
            const accessToken = req.accessToken;
            comment.repliesCount++;
            post.infoUpdate = true;
            post.save();
            comment.save();
            return res.status(200).json({ dbBack, accessToken });
        }
        if (!comment) {
            res.status(404);
            throw 'comment does not exist';
        }
    } catch (error) {
        res.json({ error: error });
    }
}
async function deleteReply(req, res) {
    try {
        const [reply, comment, logginedUser] = await Promise.all([
            Reply.findById(req.params.replyId)
            , Comment.findById(req.params.commentId)
            , getLogginedUser(req, res)

        ]);
        if (reply && comment) {
            if (logginedUser._id.equals(reply.author)) {
                const post = await Post.findById(comment.relatedPost);
                if (!post) {
                    await Comment.findByIdAndDelete(comment._id);
                    await Reply.findByIdAndDelete(reply._id);
                    res.status(404);
                    throw 'Post does not exist';
                }
                comment.repliesCount--;
                post.infoUpdate = true;
                comment.save();
                post.save();
                await Reply.findByIdAndDelete(req.params.replyId);
                res.status(200).json({ msg: 'delete successfully' });
            }
            res.status(403);
            throw 'unauthorized';

        }
        if (!reply) {
            res.status(404);
            throw 'reply does not exist';
        }
        if (!comment) {
            res.status(404);
            throw 'comment does not exist';
        }
        res.status(404);
        throw 'user does not exist';

    } catch (error) {
        res.json({ error: error });
    }
}

export { replyToComment, deleteReply };