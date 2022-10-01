import { Post, User, Tags, Comment } from '../models/index.js'
import { getLogginedUser } from '../services/userServices.js';
import json from 'body-parser'

async function createPost(req, res) {
    const dbBack = await new Post(req.body);
    const user = await getLogginedUser(req, res);
    user.postCount++;
    dbBack.author = user._id;
    dbBack.put = req.headers.put === 'true' ? true : false;
    dbBack.tags.map(async function (tag) {
        const record = await Tags.findOne({ tagName: tag });
        if (!record) {
            await new Tags({ tagName: tag }).save();
        }
    })
    user.save();
    dbBack.save();
    res.status(200).json(dbBack);
}
async function findOne(req, res) {
    try {
        const dbBack = await Post.findById(req.params.postId)
            .populate('author', 'avatar username follower upVoteGet');
        if (!dbBack) {
            res.status(404);
            throw 'Post does not exist';
        }
        else {
            dbBack.views++;
            dbBack.save();
            const commentUnderPost = await Comment.find({ relatedPost: req.params.postId })
                .populate('author');
            let postInfo = commentUnderPost.length === 0 ? dbBack : { dbBack, commentUnderPost };
            res.status(200).json(postInfo);
        }
    } catch (error) {
        res.json(error);
    }
}
async function findByTags(req, res) {
    try {
        const tags = req.body.tags;
        const pageNum = Number(req.headers.pagenumber);
        const pageSize = Number(req.headers.pagesize);
        const dbBack = await Post.find({ tags: { $in: tags } })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .sort({ publishDate: -1 })
            .populate('author', 'avatar username follower upVoteGet');
        if (dbBack.length === 0) {
            if (tags.length === 1) {
                await Tags.findOneAndRemove({ tagName: tags });
            }
            res.status(404);
            throw 'Post not found.';
        }
        else {
            res.status(200).json(dbBack);
        }

    } catch (error) {
        res.json(error);
    }


}
async function findAll(req, res) {
    try {
        const pageNum = Number(req.headers.pagenumber);
        const pageSize = Number(req.headers.pagesize);
        const dbBack = await Post.find()
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .sort({ publishDate: -1 })
            .populate('author', 'avatar username follower upVoteGet');
        if (!dbBack) {
            res.status(404);
            throw 'None post to be found.'
        }
        else {
            res.status(200).json(dbBack);
        }

    } catch (error) {
        res.json(error);
    }

}
async function findBySearch(req, res) {
    try {
        const pageNum = Number(req.headers.pagenumber);
        const pageSize = Number(req.headers.pagesize);
        let dbBack = await Post
            .find({
                $or: [{ title: { $regex: req.body.title, $options: '$i' } }
                    , { description: { $regex: req.body.title, $options: '$i' } }]
            })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .sort({ publishDate: -1 })
            .populate('author', 'avatar username follower upVoteGet');
        if (!dbBack) {
            res.status(404);
            throw 'Post Not Found :(';
        }
        else {
            res.status(200).json(dbBack);
        }
    }
    catch (error) {
        res.json(error);
    }
}
async function updatePost(req, res) {
    try {
        let dbBack = await Post.findById(req.params.postId);
        if (!dbBack) {
            res.status(404);
            throw 'Post does not exist';
        }
        else {
            const user = await User.findById(dbBack.author);
            if (user.email === req.user.userInfo.email) {
                req.body.updateDate = Date.now();
                req.body.edited = true;
                dbBack = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true });
                return res.json(dbBack);
            }
            else {
                res.status(401);
                throw 'Unauthorized';
            }
        }
    }
    catch (error) {
        res.json(error);
    }
}
async function deletePost(req, res) {
    try {
        const dbBack = await Post.findById(req.params.postId);
        if (!dbBack) {
            res.status(404);
            throw 'Post does not exist!';
        }
        else {
            const user = await User.findById(dbBack.author);
            if (user.email === req.user.userInfo.email) {
                await Post.findByIdAndRemove(dbBack);
                user.postCount--;
                user.save();
                res.status(402).json('Delete Successfully');
            }
            else {
                res.status(401);
                throw 'Unauthorized';
            }

        }
    } catch (error) {
        res.json(error);
    }
}


export { createPost, findOne, findByTags, findAll, findBySearch, updatePost, deletePost };