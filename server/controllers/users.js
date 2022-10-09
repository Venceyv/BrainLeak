import { Follow, Post, User, Comment } from "../models/index.js"
import {
    updatePicture, getLogginedUser,
    getLogginedUserInfo,getUserInfoInCache, 
    saveUserInfoToCache,
    addFollowingInfo
} from "../services/userServices.js";
import { redisRefresh, redisBlockList } from '../configs/redis.js';
import json from 'body-parser';

async function deleteUser(req, res) {
    try {
        const dbBack = await User.findById(req.params.userId);
        if (!dbBack) {
            throw 'User does not exist!';
        }
        if (dbBack.email === req.user.email) {
            await User.findByIdAndDelete(dbBack._id);
            logOutUser(req, res);
            return res.status(204).json({ msg: 'delete succesfully' });
        }
        res.status(401);
        throw 'unauthorized';

    } catch (error) {
        res.json(error);
    }
}
async function findOne(req, res) {
    const accessToken = req.accessToken;
    try {
        let userInfo = await User.findById(req.params.userId);
        if (!userInfo) {
            throw 'User does not exist';
        }
        let dbBack = await getUserInfoInCache(userInfo);
        if (dbBack && !req.user) {
            return res.status(200).json({ dbBack, accessToken });
        }
        if (dbBack) {
            const logginedUser = await getLogginedUser(req, res);
            if (req.user.email === userInfo.email) {
                const loggedUserInfo = await getLogginedUserInfo(logginedUser);
                dbBack = { ...dbBack, ...loggedUserInfo };
                return res.status(200).json({ dbBack, accessToken });
            }
            const following = await Follow.findOne({
                user: logginedUser._id
                , followedUser: req.params.userId
            }) != null;
            return res.status(200).json({ dbBack, following, accessToken });
        }
        const [posts, comments] = await Promise.all(
            [
                Post.find({ author: req.params.userId }
                    , { title: 1, publishDate: 1, likes: 1, dislikes: 1, commentCount: 1, marks: 1 })
                , Comment.find({ author: req.params.userId }, { author: 0 })
                    .sort({ createTime: -1 })
                    .populate({ path: 'relatedPost', select: 'title' })
            ]
        )
        dbBack = { userInfo, posts, comments };
        await saveUserInfoToCache(userInfo._id, dbBack);
        if (req.user) {
            const logginedUser = await getLogginedUser(req, res);
            logginedUser.infoUpdate = false;
            logginedUser.save();
            if (req.user.email === userInfo.email) {
                const loggedUserInfo = await getLogginedUserInfo(logginedUser);
                dbBack = { ...dbBack, ...loggedUserInfo };
                return res.status(200).json({ dbBack, accessToken });
            }
            const following = await Follow.findOne({
                user: logginedUser._id
                , followedUser: req.params.userId
            }) != null;
            return res.status(200).json({ dbBack, following, accessToken });
        }
        dbBack = {
            userInfo, posts, comments
        };
        return res.status(200).json(dbBack);

    } catch (error) {
        res.status(404).json(error);
    }
}
async function findAll(req, res) {
    const accessToken = req.accessToken;
    try {
        const pageNum = Number(req.query.pagenumber);
        const pageSize = Number(req.query.pagesize);
        let dbBack = await User.find({},
            {
                email: 0, backgroundCover: 0, following: 0
                , upVoteGet: 0
            })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize);
        if (dbBack.length === 0) {
            res.status(404);
            throw 'We dont have any user currently :(';
        }
        if (req.user) {
            const logginedUser = await getLogginedUser(req, res);
            dbBack = await addFollowingInfo(logginedUser,dbBack);
        }
        res.status(200).json({ dbBack, accessToken });
    } catch (error) {
        res.json({ error: error });
    }
}
async function findBySearch(req, res) {
    const accessToken = req.accessToken;
    try {
        const pageNum = Number(req.query.pagenumber);
        const pageSize = Number(req.query.pagesize);
        let dbBack = await User.find({ username: { $regex: req.query.q, $options: '$i' } })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize);
        if (dbBack.length === 0) {
            throw 'User does not exist';
        }
        if (req.user) {
            const logginedUser = await getLogginedUser(req, res);
            dbBack = await addFollowingInfo(logginedUser,dbBack);
            return res.status(200).json({ dbBack, accessToken });
        }
        return res.status(200).json(dbBack);

    } catch (error) {
        return res.status(404).json({ error: error });
    }

}
async function updateUser(req, res) {
    const accessToken = req.accessToken;
    try {
        const dbBack = await User.findById(req.params.userId);
        if (!dbBack) {
            res.status(404);
            throw 'User does not exist!';
        }
        if (req.user.email === dbBack.email) {
            const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
            if (!dbBack.infoUpdate) {
                dbBack.infoUpdate = true;
                dbBack.save();
            }
            return res.status(200).json({ user, accessToken });
        }
        res.status(401);
        throw 'unauthorized.';
    }
    catch (error) {
        res.json({ error: error });
    }

}
async function updateAvatar(req, res) {
    await updatePicture(req, res, 'avatar');
}
async function updateBackgroundCover(req, res) {
    await updatePicture(req, res, 'backgroundCover');
}
async function followUser(req, res) {
    const accessToken = req.accessToken;
    try {
        const followedUser = await User.findById(req.params.userId);
        if (!followedUser) {
            res.status(404);
            throw 'User does not exist!';
        }
        if (req.user.email === followedUser.email) {
            res.status(403);
            throw 'cant follow yourself!';
        }
        const user = await User.findOne({ email: req.user.email });
        const dbBack = await Follow.findOne({ user: user._id, followedUser: followedUser._id });
        if (dbBack) {
            throw 'You are already following this user';
        }
        await new Follow({ user: user._id, followedUser: followedUser._id }).save();
        const msg = 'follow successfully.';
        user.infoUpdate = true;
        user.following++;
        followedUser.follower++;
        user.save();
        followedUser.save();
        res.status(200).json({ msg, accessToken });

    } catch (error) {
        res.json({ error: error });
    }
}

async function unfollowUser(req, res) {
    const accessToken = req.accessToken;
    try {
        const unfollowUser = await User.findById(req.params.userId);
        if (req.user.email === unfollowUser.email) {
            res.status(403);
            throw 'cant unfollow yourself.';
        }
        const user = await User.findOne({ email: req.user.email });
        const dbBack = await Follow.findOne({ user: user._id, followedUser: unfollowUser._id });
        if (!dbBack) {
            throw 'You are not following this user currently.';
        }
        await Follow.deleteOne(dbBack);
        user.infoUpdate = true;
        user.following--;
        unfollowUser.follower--;
        user.save();
        unfollowUser.save();
        const msg = 'unfollowed successfully';
        res.status(200).json({ msg, accessToken });
    }
    catch (error) {
        res.json({ error: error });
    }
}
async function getFollwer(req, res) {
    const accessToken = req.accessToken;
    try {
        const pageNum = Number(req.query.pagenumber);
        const pageSize = Number(req.query.pagesize);
        const dbBack = await Follow.find({ followedUser: req.params.userId }
            , { followedUser: 0, _id: 0 })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .populate('user', {
                backgroundCover: 0, following: 0
                , upVoteGet: 0
            });
        if (dbBack.length === 0) {
            res.status(404);
            throw 'User does not have any follower currently';
        }
        if (req.user) {
            const logginedUser = await getLogginedUser(req, res);
            if (logginedUser._id != req.params.userId) {
                const followingList = await Follow.find({ user: logginedUser._id }
                    , { user: 0, _id: 0 });
                dbBack.forEach(function (record, index) {
                    const following = followingList
                        .filter(e => e.followedUser
                            .equals(record.user._id))
                        .length > 0;
                    const user = record.user;
                    dbBack[index] = { user, following };
                }
                )
            }
            return res.status(200).json({ dbBack, accessToken });
        }
        return res.status(200).json(dbBack);

    } catch (error) {
        res.json({ error: error });
    }
}
async function getFollwing(req, res) {
    const accessToken = req.accessToken;
    try {
        const pageNum = Number(req.query.pagenumber);
        const pageSize = Number(req.query.pagesize);
        const dbBack = await Follow.find({ user: req.params.userId }
            , { user: 0, _id: 0 })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .populate('followedUser', {
                backgroundCover: 0, following: 0
                , upVoteGet: 0
            });
        if (dbBack.length === 0) {
            res.status(404);
            throw 'User does not have any follower currently';
        }
        if (req.user) {
            const logginedUser = await getLogginedUser(req, res);
            if (logginedUser._id != req.params.userId) {
                const followingList = await Follow.find({ user: logginedUser._id }
                    , { user: 0, _id: 0 });
                dbBack.forEach(function (record, index) {
                    const following = followingList
                        .filter(e => e.followedUser
                            .equals(record.followedUser._id))
                        .length > 0;
                    const user = record.followedUser;
                    dbBack[index] = { user, following };
                }
                )
            }
            return res.status(200).json({ dbBack, accessToken });
        }
        return res.status(200).json(dbBack);
    } catch (error) {
        res.json({ error: error });
    }
}
async function logOut(req, res) {
    let token = req.headers.authorization;
    token = token ? token.replace('Bearer ', '') : null;
    const refreshToken = await redisRefresh.get(req.user.email);
    await redisBlockList.set(refreshToken, refreshToken);
    await redisBlockList.set(token, token);
    res.status(200).json('log out successfully');
}


export { deleteUser, findOne, findAll, updateUser, findBySearch, followUser, unfollowUser, updateAvatar, updateBackgroundCover, getFollwer, getFollwing, logOut };