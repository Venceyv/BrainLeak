import e from 'express';
import { Post, User, Comment } from '../models/index.js';
import { transpoter, notifyAuthor } from '../services/nodeMailer.js';
import { getLogginedUser } from '../services/userServices.js';
async function addComment(req, res) {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            res.status(404);
            throw 'Post does not exist';
        }
        else {
            const logginedUser = await getLogginedUser(req, res);
            const postAuthor = await User.findById(post.author);
            const dbBack = await new Comment({ content: req.body.content, author: logginedUser._id, relatedPost: post._id }).save();
            if (post.put) {
                const mailOptions = notifyAuthor(postAuthor.email, logginedUser.username, req.body.content, post.title, post.description);
                transpoter.sendMail(mailOptions, function (err, data) {
                    if (err) {
                        return res.status(500).json(error);
                    }
                });
            }
            post.commentCount++;
            logginedUser.commentCount++;
            await logginedUser.save();
            await post.save();
            res.status(200).json(dbBack);
        }

    } catch (error) {
        res.json(error);
    }
}

async function updateComment(req, res) {
    try {

        const comment = await Comment.findById(req.params.commentId);
        if (comment) {
            const logginedUser = await getLogginedUser(req, res);
            if (logginedUser._id.equals(comment.author)) {
                req.body.edited = true;
                req.body.updateTime = Date.now();
                const dbBack = await Comment.findByIdAndUpdate(comment._id, req.body, { new: true });
                res.status(200).json(dbBack);
            }
            else {
                res.status(401);
                throw 'unauthorized.';
            }

        }
        else {
            res.status(404);
            throw 'Comment does not exist.';
        }

    } catch (error) {
        res.json(error);
    }
}
async function deleteComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (comment) {
            const logginedUser = await getLogginedUser(req, res);
            if (comment.author.equals(logginedUser._id)) {
                await Comment.findByIdAndRemove(comment._id);
                logginedUser.commentCount--;
                await logginedUser.save();
                res.status(200).json({ msg: 'Delete successfully.' });
            }
            else {
                res.status(401);
                throw 'Unauthorized';
            }
        }
        else {
            res.status(404);
            throw 'Comment does not exist!';
        }
    } catch (error) {
        res.json(error);
    }
}
export { addComment, updateComment, deleteComment }