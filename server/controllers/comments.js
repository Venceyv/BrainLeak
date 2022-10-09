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
        const [logginedUser, postAuthor] = await Promise.all([
            getLogginedUser(req, res),
            User.findById(post.author)
        ]);
        const dbBack = await new Comment({ content: req.body.content, author: logginedUser._id, relatedPost: post._id }).save();
        const accessToken = req.accessToken;
        if (post.put && postAuthor) {
            const mailOptions = notifyAuthor(postAuthor.email, logginedUser.username, req.body.content, post.title, post.description);
            transpoter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    return res.status(500).json(err);
                }
            });
        }
        logginedUser.infoUpdate = true;
        logginedUser.commentCount++;
        logginedUser.save();
        post.commentCount++;
        post.infoUpdate = true;
        post.save();
        return res.status(200).json({ dbBack, accessToken });
    } catch (error) {
        res.json({ error: error });
    }
}

async function updateComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (comment) {
            const logginedUser = await getLogginedUser(req, res);
            if (logginedUser._id.equals(comment.author)) {
                const post = await Post.findById(comment.relatedPost);
                if (!post) {
                    await Comment.findByIdAndDelete(comment._id);
                    res.status(404);
                    throw 'Post does not exist';
                }
                const accessToken = req.accessToken;
                req.body.edited = true;
                req.body.updateTime = Date.now();
                const dbBack = await Comment.findByIdAndUpdate(comment._id, req.body, { new: true });
                logginedUser.infoUpdate = true;
                post.infoUpdate = true;
                logginedUser.save();
                post.save();
                return res.status(200).json({ dbBack, accessToken });
            }
            res.status(401);
            throw 'unauthorized.';
        }
        res.status(404);
        throw 'Comment does not exist.';
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
                const post = await Post.findById(comment.relatedPost);
                if (!post) {
                    await Comment.findByIdAndDelete(comment._id);
                    res.status(404);
                    throw 'Post does not exist';
                }
                await Comment.findByIdAndDelete(comment._id);
                const accessToken = req.accessToken;
                const msg = 'Delete successfully.';
                logginedUser.commentCount--;
                logginedUser.infoUpdate = true;
                post.infoUpdate = true;
                logginedUser.save();
                post.save();
                return res.status(200).json({ msg, accessToken });
            }
            res.status(401);
            throw 'Unauthorized';
        }
        res.status(404);
        throw 'Comment does not exist!';
    } catch (error) {
        res.json(error);
    }
}
export { addComment, updateComment, deleteComment }