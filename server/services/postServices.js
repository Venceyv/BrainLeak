import { LikedPost, DislikedPost, SavedPost, Comment, Reply } from "../models/index.js";
import { redisPostInfo } from "../configs/redis.js";
import fastJson from 'fast-json-stringify';
const stringifyPostInfo = fastJson(
    {
        type: 'object'
        , properties: {
            postInfo: {
                type: 'object'
                , properties: {
                    _id: { type: 'string' }
                    , title: { type: 'string' }
                    , description: { type: 'string' }
                    , publishDate: { type: 'string' }
                    , updateDate: { type: 'string' }
                    , tags: { type: 'array' }
                    , likes: { type: 'integer' }
                    , dislikes: { type: 'integer' }
                    , commentCount: { type: 'integer' }
                    , marks: { type: 'integer' }
                    , views: { type: 'integer' }
                    , edited: { type: 'boolean' }
                    , put: { type: 'boolean' }
                    , author: {
                        type: 'object', properties: {
                            _id: { type: 'string' }
                            , avatar: { type: 'string' }
                            , username: { type: 'string' }
                            , follower: { type: 'integer' }
                            , upVoteGet: { type: 'integer' }
                        }
                    }
                    , __v: { type: 'integer' }
                }
            }
            , commentUnderPost: { type: 'array' }
        }
    }
);

//get the post info related to the loggined user
async function getOnePostInfo(postInfo) {


    const [commentUnderPost, replies] = await Promise.all([
        Comment.find({ relatedPost: postInfo._id })
            .populate('author', { username: 1 })
            .sort({ likes: -1 }),
        Reply.find({ relatedPost: postInfo._id }, { _id: 0 })
            .populate('mentionedUser', { username: 1 })
            .populate('author', { username: 1 })

    ])
    commentUnderPost.forEach((comment, index) => {
        let repliesUnderComment = [];
        repliesUnderComment = replies
            .filter(reply => reply.relatedComment.equals(comment._id))
        commentUnderPost[index] = { comment, repliesUnderComment };
    })
    return { postInfo, commentUnderPost };
}

async function getAllPostInfo(loggedUser) {

    const [likeInfo, dislikeInfo, saveInfo] = await Promise.all(
        [
            LikedPost.find({ user: loggedUser._id }, { post: 1 })
            , DislikedPost.find({ user: loggedUser._id }, { post: 1 })
            , SavedPost.find({ user: loggedUser._id }, { post: 1 })
        ]
    )
    return { likeInfo, dislikeInfo, saveInfo };
}
async function getPostInfoInCache(post) {
    if (!post.infoUpdate) {
        let postInfo = await redisPostInfo.get(post._id);
        postInfo = JSON.parse(postInfo);
        return postInfo;
    }
    return null;
}
async function savePostInfoToCache(postId, postInfo) {
    postInfo = stringifyPostInfo(postInfo);
    await redisPostInfo.set(postId, postInfo);
}
async function getUserPostInfo(logginedUser, post) {
    const [likeInfo, dislikeInfo, saveInfo,] = await Promise.all([
        LikedPost.findOne({ user: logginedUser._id, post: post._id }),
        DislikedPost.findOne({ user: logginedUser._id, post: post._id }),
        SavedPost.findOne({ user: logginedUser._id, post: post._id })
    ]);
    const like = likeInfo != null;
    const dislike = dislikeInfo != null;
    const save = saveInfo != null;
    post = { ...post, like, dislike, save };
    return post;
}
async function getUserPostInfoByPostList(logginedUser, postList) {
    const postInfo = await getAllPostInfo(logginedUser);
    postList.forEach((post, index) => {
        const liked = postInfo.likeInfo
            .filter(e => e.post.equals(post._id)).length > 0;
        const disliked = postInfo.dislikeInfo
            .filter(e => e.post.equals(post._id)).length > 0;
        const saved = postInfo.saveInfo
            .filter(e => e.post.equals(post._id)).length > 0;
        postList[index] = { post, liked, disliked, saved };
    })
    return postList;
}
export {
    getOnePostInfo, stringifyPostInfo, getPostInfoInCache,
    savePostInfoToCache, getUserPostInfo, getUserPostInfoByPostList
};