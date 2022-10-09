import { User, Follow } from '../models/index.js'
import { uploadFile } from './uploadFile.js'
import { LikedPost, SavedPost, DislikedPost } from '../models/index.js';
import { redisUserInfo } from '../configs/redis.js';
import fastJson from 'fast-json-stringify';

const stringifyUserInfo = fastJson(
    {
        type: 'object'
        , properties: {
            userInfo: {
                type: 'object'
                , properties: {
                    _id: { type: 'string' }
                    , avatar: { type: 'string' }
                    , username: { type: 'string' }
                    , email: { type: 'string' }
                    , introduction: { type: 'string' }
                    , backgroundCover: { type: 'string' }
                    , following: { type: 'integer' }
                    , follower: { type: 'integer' }
                    , postCount: { type: 'integer' }
                    , commentCount: { type: 'integer' }
                    , upVoteGet: { type: 'integer' }
                    , __v: { type: 'integer' }
                }
            }
            , posts: { type: 'array' }
            , comments: { type: 'array' }
        }
    }
);
//get the dataBase object of the current login user
async function getLogginedUser(req, res) {
    let user = null;
    if (req.user) {
        user = await User.findOne({ email: req.user.email })
    }
    return user;
}
async function updatePicture(req, res, name) {
    const accessToken = req.accessToken;
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(404);
            throw 'User does not exist';
        }
        if (req.user.email === user.email) {
            const url = uploadFile(req, res);
            if (url) {
                if (name === 'avatar') {
                    user.avatar = url;
                }
                else {
                    user.backgroundCover = url;
                }
                user.infoUpdate = true;
                user.save();
                return res.status(200).json({ user, accessToken });
            }
        }
        res.status(401);
        throw 'unauthorized';

    } catch (error) {
        res.json(error);
    }
}
async function getLogginedUserInfo(user) {
    const [likedPost, dislikedPost, savedPost] = await Promise.all(
        [
            LikedPost.find({ user: user._id },
                { title: 1, publishDate: 1, likes: 1, dislikes: 1, commentCount: 1, marks: 1 }),
            DislikedPost.find({ user: user._id },
                { title: 1, publishDate: 1, likes: 1, dislikes: 1, commentCount: 1, marks: 1 }),
            SavedPost.find({ user: user._id },
                { title: 1, publishDate: 1, likes: 1, dislikes: 1, commentCount: 1, marks: 1 })
        ]
    )
    return { likedPost, dislikedPost, savedPost }
}
async function getUserInfoInCache(user) {
    if (!user.infoUpdate) {
        let userInfo = await redisUserInfo.get(user._id);
        userInfo = JSON.parse(userInfo);
        return userInfo;
    }
    return null;
}
async function saveUserInfoToCache(userId, userInfo) {
    userInfo = stringifyUserInfo(userInfo);
    await redisUserInfo.set(userId, userInfo);
}
//add following after each user in the userlist
// following === true -> logginedUser is following the user
//otherwise following === false
async function addFollowingInfo(logginedUser, userList) {
    const followingList = await Follow.find({ user: logginedUser._id }
        , { user: 0, _id: 0 });
    userList.forEach(function (record, index) {
        const following = followingList
            .filter(e => e.followedUser
                .equals(record._id))
            .length > 0;
        const user = record;
        userList[index] = { user, following };
    });
    return userList;
}
export {
    getLogginedUser, updatePicture,
    stringifyUserInfo, getLogginedUserInfo,
    getUserInfoInCache, saveUserInfoToCache,
    addFollowingInfo
};