import { Follow } from '../models/index.js'
import { User } from '../models/index.js'
import { uploadFile } from './uploadFile.js'
import lodash from 'lodash'

const generalUserInfo = [
    '_id',
    'username',
    'avatar',
    'introduction',
    'backgroundCover',
    'follower',
    'postCount',
    'upVoteGet',
    'commentCount'
];
//get the dataBase object of the current login user
async function getLogginedUser(req, res) {
    return await User.findOne({ email: req.user.userInfo.email });
}

//determind if user is currently following followedUser
async function isFollowing(user, followedUser) {
    const record = await Follow.findOne({ user: user._id, followedUser: followedUser._id });
    return record != null;
}

async function simplifyUserInfo(req, res, userList) {
    if (req.user) {
        const logginedUser = await getLogginedUser(req, res);
        let following = false;
        for (var i = 0; i < userList.length; i++) {
            if (logginedUser.email === userList[i].email) {
                userList[i] = { ...lodash.pick(userList[i], generalUserInfo) };
            }
            else {
                following = await isFollowing(logginedUser._id, userList[i]._id);
                userList[i] = { ...lodash.pick(userList[i], generalUserInfo), following };
            }
        }
    }
    else
    {
        for (var i = 0; i < userList.length; i++) {
            userList[i] = { ...lodash.pick(userList[i], generalUserInfo) };
        }
    }
    res.status(200).json(userList);
}

async function updatePicture(req, res, name) {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(404);
            throw 'User does not exist';
        }
        else {
            if (req.user.userInfo.email === user.email) {
                const url = uploadFile(req, res);
                if (url) {
                    if (name === 'avatar') {
                        user.avatar = url;
                    }
                    else {
                        user.backgroundCover = url;
                    }
                    user.save();
                    res.status(200).json(user);
                }
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
export { isFollowing, getLogginedUser, updatePicture, simplifyUserInfo, generalUserInfo };