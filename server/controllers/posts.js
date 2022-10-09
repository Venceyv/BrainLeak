import { Post, User, Tags } from '../models/index.js'
import { getLogginedUser } from '../services/userServices.js';
import {
    getOnePostInfo, getPostInfoInCache,
    savePostInfoToCache, getUserPostInfo,
    getUserPostInfoByPostList
} from '../services/postServices.js';

import json from 'body-parser'

async function createPost(req, res) {
    try {
        const user = await getLogginedUser(req, res);
        if (user) {
            const dbBack = new Post(req.body);
            const accessToken = req.accessToken;
            user.postCount++;
            user.infoUpdate = true;
            dbBack.author = user._id;
            dbBack.put = req.query.put === 'true' ? true : false;
            dbBack.tags.map(async function (tag) {
                const record = await Tags.findOne({ tagName: tag });
                if (!record) {
                    await new Tags({ tagName: tag }).save();
                }
            })
            user.save();
            dbBack.save();
            return res.status(200).json({ dbBack, accessToken });
        }
        res.status(404);
        throw 'user does not exist';
    } catch (error) {
        res.json({ error: error });
    }
}
async function findOne(req, res) {
    try {
        let postInfo = await Post.findById(req.params.postId)
            .populate('author', 'avatar username follower upVoteGet');
        if (!postInfo) {
            res.status(404);
            throw 'Post does not exist';
        }
        const accessToken = req.accessToken;
        let dbBack = await getPostInfoInCache(postInfo);
        postInfo.views++;
        if (dbBack && !req.user) {
            postInfo.save();
            return res.status(200).json({ dbBack, accessToken });
        }
        if (dbBack) {
            const logginedUser = await getLogginedUser(req, res);
            dbBack = await getUserPostInfo(logginedUser, dbBack);
            postInfo.save();
            return res.status(200).json({ dbBack, accessToken });
        }
        postInfo.infoUpdate = false;
        postInfo.save();
        postInfo = await getOnePostInfo(postInfo);
        await savePostInfoToCache(req.params.postId, postInfo);
        if (req.user) {
            const logginedUser = await getLogginedUser(req, res);
            dbBack = await getUserPostInfo(logginedUser, postInfo);
            return res.status(200).json({ dbBack, accessToken });
        }
        dbBack = { ...postInfo };
        return res.status(200).json({ dbBack, accessToken });
    } catch (error) {
        res.json({ error: error });
    }
}
async function findByTags(req, res) {
    try {
        const tags = req.body.tags;
        const pageNum = req.query.pagenumber;
        const pageSize = req.query.pagesize;
        let dbBack = await Post.find({ tags: { $in: tags } })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .sort({ publishDate: -1 })
            .populate('author', 'avatar username follower upVoteGet');
        if (dbBack.length === 0) {
            if (tags.length === 1) {
                await Tags.findOneAndDelete({ tagName: tags });
            }
            res.status(404);
            throw 'Post not found.';
        }
        if (req.user) {
            const accessToken = req.accessToken;
            const logginedUser = await getLogginedUser(req, res);
            dbBack = await getUserPostInfoByPostList(logginedUser, dbBack);
            return res.status(200).json({ dbBack, accessToken });
        }
        return res.status(200).json(dbBack);

    } catch (error) {
        res.json({ error: error });
    }
}
async function findAll(req, res) {
    try {
        const pageNum = req.query.pagenumber;
        const pageSize = req.query.pagesize;
        let dbBack = await Post.find()
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .sort({ publishDate: -1 })
            .populate('author', 'avatar username follower upVoteGet');
        if (dbBack.length === 0) {
            res.status(404);
            throw 'None post is found.'
        }
        if (req.user) {
            const accessToken = req.accessToken;
            const logginedUser = await getLogginedUser(req, res);
            dbBack = await getUserPostInfoByPostList(logginedUser, dbBack);
            return res.status(200).json({ dbBack, accessToken });
        }
        return res.status(200).json(dbBack);

    } catch (error) {
        return res.json({ error: error });
    }

}
async function findBySearch(req, res) {
    try {
        const pageNum = req.query.pagenumber;
        const pageSize = req.query.pagesize;
        let dbBack = await Post
            .find({
                $or: [{ title: { $regex: req.query.q, $options: '$i' } }
                    , { description: { $regex: req.query.q, $options: '$i' } }]
            })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .sort({ publishDate: -1 })
            .populate('author', 'avatar username follower upVoteGet');
        if (dbBack.length === 0) {
            res.status(404);
            throw 'Post Not Found :(';
        }
        if (req.user) {
            const accessToken = req.accessToken;
            const logginedUser = await getLogginedUser(req, res);
            dbBack = await getUserPostInfoByPostList(logginedUser, dbBack);
            return res.status(200).json({ dbBack, accessToken });
        }
        return res.status(200).json(dbBack);
    }
    catch (error) {
        res.json({ error: error });
    }
}
async function updatePost(req, res) {
    try {
        let dbBack = await Post.findById(req.params.postId);
        if (!dbBack) {
            res.status(404);
            throw 'Post does not exist';
        }
        const user = await User.findById(dbBack.author);
        if (user) {
            if (user.email === req.user.email) {
                const accessToken = req.accessToken;
                req.body.updateDate = Date.now();
                req.body.edited = true;
                dbBack = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true });
                if (req.body.tags) {
                    const tags = req.body.tags;
                    tags.map(async function (tag) {
                        const record = await Tags.findOne({ tagName: tag });
                        if (!record) {
                            await new Tags({ tagName: tag }).save();
                        }
                    })
                }
                return res.json({ dbBack, accessToken });
            }
            res.status(401);
            throw 'Unauthorized';
        }
        res.status(404);
        throw 'user does not exist';
    }
    catch (error) {
        res.json({ error: error });
    }
}
async function deletePost(req, res) {
    try {
        const dbBack = await Post.findById(req.params.postId);
        if (!dbBack) {
            res.status(404);
            throw 'Post does not exist!';
        }
        const user = await User.findById(dbBack.author);
        if (user) {
            if (user.email === req.user.email) {
                await Post.findByIdAndDelete(dbBack._id);
                const accessToken = res.accessToken;
                const msg = 'Delete Successfully';
                user.postCount--;
                user.save();
                return res.status(402).json({ msg, accessToken });
            }
            res.status(401);
            throw 'Unauthorized';
        }
        res.status(404);
        throw 'user does not exist';
    } catch (error) {
        res.json({ error: error });
    }
}


export { createPost, findOne, findByTags, findAll, findBySearch, updatePost, deletePost };