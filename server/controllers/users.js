import { Follow, Post, User, Comment, LikedPost, SavedPost,DislikedPost } from "../models/index.js"
import { updatePicture, isFollowing, simplifyUserInfo, getLogginedUser } from "../services/userServices.js";
import  lodash  from "lodash";
import json from 'body-parser'


async function deleteUser(req, res) {
    try {
        const dbBack = await User.findById(req.params.userId);
        if (!dbBack) {
            throw 'User does not exist!';
        }
        else {
            if (dbBack.email === req.user.userInfo.email) {
                await User.findByIdAndRemove(dbBack._id);
                res.status(204).json({ msg: 'delete succesfully' });
            }
            else {
                res.status(401);
                throw 'unauthorized';
            }
        }

    } catch (error) {
        res.json(error);
    }
}
async function findOne(req, res) {
    try {
        const dbBack = await User.findById(req.params.userId);
        if (!dbBack) {
            throw 'User does not exist';
        }
        else {
            const commentsAndPosts = [];
            const comments = await Comment.find({ author: dbBack._id });
            for (let i = 0; i < comments.length; i++) {
                const comment = comments[i];
                const relatedPost = await Post.findById(comments[i].relatedPost);
                commentsAndPosts.push({ comment, relatedPost });
            }
            if (req.user) {
                //collections of posts that the user created.
                const posts = await Post.find({ author: dbBack._id });
                if (req.user.userInfo.email === dbBack.email) {
                    const likedPost = await LikedPost.find({ user: dbBack._id });
                    const dislikedPost = await DislikedPost.find({ user: dbBack._id });

                    const savedPost = await SavedPost.find({ user: dbBack._id });
                    res.status(200).json({
                        dbBack, posts, likedPost,
                        dislikedPost, commentsAndPosts, savedPost
                    });
                }
                else {
                    const logginedUser = await getLogginedUser(req, res);
                    const following = await isFollowing(logginedUser, dbBack);
                    res.status(200).json({
                        dbBack, following,
                        posts, commentsAndPosts
                    });
                }
            }
            else {
                //collections of posts that the user created.
                res.status(200).json({
                    dbBack,
                    posts, ccommentsAndPosts
                });
            }
        }

    } catch (error) {
        res.status(404).json(error)
    }

}
async function findAll(req, res) {
    try {
        const pageNum = Number(req.headers.pagenumber);
        const pageSize = Number(req.headers.pagesize);
        const dbBack = await User.find()
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize);
        if (!dbBack) {
            res.status(404);
            throw 'We dont have any user currently :(';
        }
        else {
            await simplifyUserInfo(req, res, dbBack);
        }
    } catch (error) {
        res.json(error);
    }
}
async function findBySearch(req, res) {

    try {
        const pageNum = Number(req.headers.pagenumber);
        const pageSize = Number(req.headers.pagesize);
        const dbBack = await User.find({ username: { $regex: req.body.username, $options: '$i' } })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize);
        if (dbBack.length === 0) {
            throw 'User does not exist';
        }
        else {
            await simplifyUserInfo(req, res, dbBack);
        }

    } catch (error) {
        res.status(404).json(error);
    }

}
async function updateUser(req, res) {
    try {
        const dbBack = await User.findById(req.params.userId);
        if (!dbBack) {
            res.status(404);
            throw 'User does not exist!';
        }
        else {
            if (req.user.userInfo.email === dbBack.email) {
                const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
                res.status(200).json(user);
            }
            else {
                res.status(401);
                throw 'unauthorized.';
            }
        }
    }
    catch (error) {
        res.json(error);
    }

}
async function updateAvatar(req, res) {
    await updatePicture(req, res, 'avatar');
}
async function updateBackgroundCover(req, res) {
    await updatePicture(req, res, 'backgroundCover');
}
async function followUser(req, res) {
    try {
        const followedUser = await User.findById(req.params.userId);
        const user = await User.findOne({ email: req.user.userInfo.email });
        if (!followedUser) {
            res.status(404);
            throw 'User does not exist!';
        }
        else {
            if (req.user.userInfo.email === followedUser.email) {
                res.status(403);
                throw 'cant follow yourself!';
            }
            else {
                const dbBack = await Follow.findOne({ user: user._id, followedUser: followedUser._id });
                if (dbBack) {
                    throw 'You are already following this user';
                }
                else {
                    await new Follow({ user: user._id, followedUser: followedUser._id }).save();
                    user.following++;
                    followedUser.follower++;
                    await user.save();
                    await followedUser.save();
                    res.status(200).json({ msg: 'follow successfully!' });
                }
            }
        }
    } catch (error) {
        res.json(error);
    }
}

async function unfollowUser(req, res) {
    try {
        const unfollowUser = await User.findById(req.params.userId);
        const user = await User.findOne({ email: req.user.userInfo.email });
        if (!user) {
            res.status(404);
            throw 'User does not exist!';
        }
        else {
            if (user.email === unfollowUser.email) {
                res.status(403);
                throw 'cant unfollow yourself.';
            }
            else {
                const dbBack = await Follow.findOne({ user: user._id, followedUser: unfollowUser._id });
                if (!dbBack) {
                    throw 'You are not following this user currently.';
                }
                await Follow.remove(dbBack);
                user.following--;
                unfollowUser.follower--;
                await user.save();
                await unfollowUser.save();
                res.status(200).json({ msg: 'unfollowed successfully' });
            }
        }
    }
    catch (error) {
        res.json(error);
    }
}
async function getFollwer(req, res) {
    try {
        const pageNum = Number(req.headers.pagenumber);
        const pageSize = Number(req.headers.pagesize);
        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(404);
            throw 'user does not exist!';
        }
        else {
            const followers = await Follow.find({ followedUser: user._id })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize);
            if (followers.length === 0) {
                res.status(404);
                throw 'User does not have any follower currently';
            }
            else {
                const followerList = [];
                for (var i = 0; i < followers.length; i++) {
                    const follower = await User.findById(followers[i].user);
                    followerList.push(follower);
                }
                await simplifyUserInfo(req, res, followerList);
            }
        }

    } catch (error) {
        res.json(error)
    }

}
async function getFollwing(req, res) {
    try {
        const pageNum = Number(req.headers.pagenumber);
        const pageSize = Number(req.headers.pagesize);
        const user = await User.findById(req.params.userId)
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize);
        if (!user) {
            res.status(404);
            throw 'User does not exist';
        }
        else {
            const following = await Follow.find({ user: user._id });
            if (following.length === 0) {
                res.status(404);
                throw 'User is not following any other user currently';
            }
            else {
                const followingList = [];
                for (var i = 0; i < following.length; i++) {
                    const follower = await User.findById(following[i].followedUser);
                    followingList.push(follower);
                }
                await simplifyUserInfo(req, res, followingList)
            }
        }
    } catch (error) {
        res.json(error)
    }

}


export { deleteUser, findOne, findAll, updateUser, findBySearch, followUser, unfollowUser, updateAvatar, updateBackgroundCover, getFollwer, getFollwing };