import { Follow, User, Comment, PostLike, SavedPost, Post } from '../models/index.js';
import {
  updatePicture,
  getRedisUserProfile,
  saveRedisUserProfile,
  addFollowingInfo,
  addUserStatistics,
  incUserStatistics,
  getUserTrending,
  getRedisSavedPost,
  saveRedisSavedPost,
  getRedisDislikedPost,
  saveRedisDisikedPost,
  getRedisLikedPost,
  saveRedisLikedPost,
  getRedisUserComment,
  saveRedisUserComment,
  getRedisUserPost,
  saveRedisUserPost,
  userTrendingInc,
} from '../services/userServices.js';
import { blockToken, getRefreshToken } from '../services/jwt.js';
import json from 'body-parser';
import { addCommentsStatistics } from '../services/commentServices.js';
import { addPostsStatistics, addPostStatistics, addUserPostInfo, beautyPostsInfo } from '../services/postServices.js';
import { beautyCommentsInfo } from '../services/commentServices.js';

async function deleteUser(req, res) {
  try {
    const [refreshToken] = await Promise.all([
      getRefreshToken(req.user.email),
      User.findByIdAndUpdate(req.params.userId, { isDelete: true }),
      blockToken(req.accessToken),
    ]);
    await blockToken(refreshToken);
    return res.status(200).json({ msg: 'delete succesfully' });
  } catch (error) {
    res.json(error);
  }
}

async function findOne(req, res) {
  const accessToken = req.accessToken;
  try {
    let dbBack = await getRedisUserProfile(req.params.userId);
    if (!dbBack) {
      dbBack = await User.findById(req.params.userId, { email: 0 }).lean();
      await saveRedisUserProfile(req.params.userId, dbBack);
    }
    dbBack = await addUserStatistics(dbBack);
    if (req.user) {
      if (req.user._id != req.params.userId) {
        const follwingList = await Follow.find({ user: req.user._id }, { followedUser: 1 }).lean();
        dbBack = addFollowingInfo(dbBack, follwingList);
      }
      return res.status(200).json({ dbBack, accessToken });
    }
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}
async function findAll(req, res) {
  const accessToken = req.accessToken;
  try {
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    let dbBack = await User.find(
      {},
      {
        email: 0,
        backgroundCover: 0,
        following: 0,
        upVoteGet: 0,
        isDelete: 0,
      }
    )
      .lean()
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);
    dbBack = await Promise.all(
      dbBack.map(async (user) => {
        user = await addUserStatistics(user);
        return user;
      })
    );
    if (dbBack.length != 0 && req.user) {
      const followingList = await Follow.find({ user: req.user._id }, { followedUser: 1, _id: 0 }).lean();
      dbBack.forEach((user, index) => {
        dbBack[index] = addFollowingInfo(user, followingList);
      });
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
    let dbBack = await User.find({
      username: { $regex: req.query.q, $options: '$i' },
    }).lean();
    if (dbBack.length === 0) {
      res.status(404);
      throw 'user not found';
    }
    dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    dbBack = await Promise.all(
      dbBack.map(async (user) => {
        user = await addUserStatistics(user);
        return user;
      })
    );
    if (dbBack.length != 0 && req.user) {
      const followingList = await Follow.find({ user: req.user._id }, { followedUser: 1, _id: 0 }).lean();
      dbBack.forEach((user, index) => {
        dbBack[index] = addFollowingInfo(user, followingList);
      });
    }
    res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}
async function updateUser(req, res) {
  const accessToken = req.accessToken;
  try {
    const dbBack = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    });
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
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
    if (req.user.email === req.targetUser.email) {
      res.status(403);
      throw 'cant follow yourself!';
    }
    const dbBack = await Follow.findOne({
      user: req.user._id,
      followedUser: req.params.userId,
    });
    if (dbBack) {
      dbBack.remove();
      await Promise.all([
        incUserStatistics(req.user._id, 'following', -1),
        incUserStatistics(req.targetUser._id, 'follower', -1),
        userTrendingInc(req.targetUser._id, -10),
      ]);
      const msg = 'unfollow successfully.';
      return res.status(200).json({ msg, accessToken });
    }
    await Promise.all([
      incUserStatistics(req.user._id, 'following', 1),
      incUserStatistics(req.targetUser._id, 'follower', 1),
      userTrendingInc(req.targetUser._id, 10),
      new Follow({
        user: req.user._id,
        followedUser: req.params.userId,
      }).save(),
    ]);
    const msg = 'follow successfully.';
    res.status(200).json({ msg, accessToken });
  } catch (error) {
    res.json({ error: error, accessToken });
  }
}

async function getFollwer(req, res) {
  const accessToken = req.accessToken;
  try {
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    let dbBack = await Follow.find({ followedUser: req.params.userId }, { followedUser: 0, _id: 0 })
      .lean()
      .populate('user', { username: 1, avatar: 1, introduction: 1 }, { lean: true });
    if (dbBack.length != 0) {
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      dbBack.forEach((userData, index) => {
        dbBack[index] = userData.user;
      });
      dbBack = await Promise.all(
        dbBack.map(async (follower) => {
          follower = addUserStatistics(follower);
          return follower;
        })
      );
      if (req.user) {
        const followingList = await Follow.find({ user: req.user._id }, { followedUser: 1, _id: 0 }).lean();
        dbBack.forEach((user, index) => {
          dbBack[index] = addFollowingInfo(user, followingList);
        });
      }
    }

    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.json({ error: error });
  }
}
async function getFollwing(req, res) {
  const accessToken = req.accessToken;
  try {
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    let dbBack = await Follow.find({ user: req.params.userId }, { user: 0, _id: 0 })
      .lean()
      .populate('followedUser', { username: 1, avatar: 1, introduction: 1 }, { lean: true });
    if (dbBack.length != 0) {
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      dbBack.forEach((userData, index) => {
        dbBack[index] = userData.followedUser;
      });
      dbBack = await Promise.all(
        dbBack.map(async (follower) => {
          follower = addUserStatistics(follower);
          return follower;
        })
      );
      if (req.user) {
        const followingList = await Follow.find({ user: req.user._id }, { followedUser: 1, _id: 0 }).lean();
        dbBack.forEach((user, index) => {
          dbBack[index] = addFollowingInfo(user, followingList);
        });
      }
    }
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.json({ error: error });
  }
}
async function getLikePosts(req, res) {
  try {
    const accessToken = req.accessToken;
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const order = req.query.sort;
    let dbBack = await getRedisLikedPost(req.params.userId);
    if (!dbBack) {
      dbBack = await PostLike.find({ user: req.user._id, like: true }, { _id: 0, post: 1 })
        .lean()
        .populate({
          path: 'post',
          select: 'title description author publishDate',
          options: { lean: true },
          populate: {
            path: 'author',
            select: 'avatar username introduction',
            options: { lean: true },
          },
        });
    }
    if (dbBack.length != 0) {
      const [followingList, likeList, PostSaveList] = await Promise.all([
        Follow.find({ user: req.user._id }, { followedUser: 1, _id: 0 }).lean(),
        PostLike.find({ user: req.user._id }, { post: 1, like: 1, _id: 0 }).lean(),
        SavedPost.find({ user: req.user._id }, { post: 1, _id: 0 }).lean(),
        saveRedisLikedPost(req.params.userId, dbBack),
      ]);
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      dbBack.forEach((data, index) => {
        dbBack[index] = addUserPostInfo(data.post, followingList, likeList, PostSaveList);
      });
      dbBack = await Promise.all(
        dbBack.map(async (post) => {
          post = await addPostStatistics(post);
          return post;
        })
      );
      switch (order) {
        case 'latest':
          dbBack.sort((a, b) => {
            return new Date(b.publishDate) - new Date(a.publishDate);
          });
          break;

        default:
          dbBack.sort((a, b) => {
            return b.statistics.likes - a.statistics.likes;
          });
          break;
      }
    }
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function getDislikePosts(req, res) {
  try {
    const accessToken = req.accessToken;
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const order = req.query.sort;
    let dbBack = await getRedisDislikedPost(req.params.userId);
    if (!dbBack) {
      dbBack = await PostLike.find({ user: req.user._id, like: false }, { _id: 0, post: 1 })
        .lean()
        .populate({
          path: 'post',
          select: 'title description author publishDate',
          options: { lean: true },
          populate: {
            path: 'author',
            select: 'avatar username introduction',
            options: { lean: true },
          },
        });
    }
    if (dbBack.length != 0) {
      const [followingList, likeList, PostSaveList] = await Promise.all([
        Follow.find({ user: req.user._id }, { followedUser: 1, _id: 0 }).lean(),
        PostLike.find({ user: req.user._id }, { post: 1, like: 1, _id: 0 }).lean(),
        SavedPost.find({ user: req.user._id }, { post: 1, _id: 0 }).lean(),
        saveRedisDisikedPost(req.params.userId, dbBack),
      ]);
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      dbBack.forEach((data, index) => {
        dbBack[index] = addUserPostInfo(data.post, followingList, likeList, PostSaveList);
      });
      dbBack = await Promise.all(
        dbBack.map(async (post) => {
          post = await addPostStatistics(post);
          return post;
        })
      );
      switch (order) {
        case 'latest':
          dbBack.sort((a, b) => {
            return new Date(b.publishDate) - new Date(a.publishDate);
          });
          break;

        default:
          dbBack.sort((a, b) => {
            return b.statistics.likes - a.statistics.likes;
          });
          break;
      }
    }

    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function getSavedPosts(req, res) {
  try {
    const accessToken = req.accessToken;
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const order = req.query.sort;
    let dbBack = await getRedisSavedPost(req.params.userId);
    if (!dbBack) {
      dbBack = await SavedPost.find({ user: req.user._id }, { _id: 0, post: 1 })
        .lean()
        .populate({
          path: 'post',
          select: 'title description author publishDate',
          options: { lean: true },
          populate: {
            path: 'author',
            select: 'avatar username introduction',
            options: { lean: true },
          },
        });
    }
    if (dbBack.length != 0) {
      const [followingList, likeList, PostSaveList] = await Promise.all([
        Follow.find({ user: req.user._id }, { followedUser: 1, _id: 0 }).lean(),
        PostLike.find({ user: req.user._id }, { post: 1, like: 1, _id: 0 }).lean(),
        SavedPost.find({ user: req.user._id }, { post: 1, _id: 0 }).lean(),
        saveRedisSavedPost(req.params.userId, dbBack),
      ]);
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      dbBack.forEach((data, index) => {
        dbBack[index] = addUserPostInfo(data.post, followingList, likeList, PostSaveList);
      });
      dbBack = await Promise.all(
        dbBack.map(async (post) => {
          post = await addPostStatistics(post);
          return post;
        })
      );
      switch (order) {
        case 'latest':
          dbBack.sort((a, b) => {
            return new Date(b.publishDate) - new Date(a.publishDate);
          });
          break;

        default:
          dbBack.sort((a, b) => {
            return b.statistics.likes - a.statistics.likes;
          });
          break;
      }
    }
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function userTrending(req, res) {
  try {
    const accessToken = req.accessToken;
    const topNumber = req.query.top;
    const dbBack = await getUserTrending(topNumber);
    res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
//
async function getUserComments(req, res) {
  try {
    const userId = req.params.userId;
    const accessToken = req.accessToken;
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const order = req.query.sort;
    let dbBack = await getRedisUserComment(userId);
    if (!dbBack) {
      dbBack = await Comment.find({ author: userId }, { edited: 0 })
        .lean()
        .populate('relatedPost', { title: 1 }, { lean: true })
        .populate('author', {
          avatar: 1,
          username: 1,
          introduction: 1,
          lean: true,
        });
    }
    if (dbBack.length != 0) {
      await saveRedisUserComment(userId, dbBack);
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      if (req.user) {
        const self = req.user._id === userId;
        dbBack = await beautyCommentsInfo(dbBack, req.user._id, self);
      }
      dbBack = await addCommentsStatistics(dbBack);
      switch (order) {
        case 'latest':
          dbBack.sort((a, b) => {
            return new Date(b.createTime) - new Date(a.createTime);
          });
          break;
        default:
          dbBack.sort((a, b) => {
            return b.statistics.likes - a.statistics.likes;
          });
          break;
      }
    }
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function getUserPosts(req, res) {
  try {
    const accessToken = req.accessToken;
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    let dbBack = await getRedisUserPost(req.params.userId);
    const order = req.query.sort;
    if (!dbBack) {
      dbBack = await Post.find({ author: req.params.userId }, { title: 1, description: 1 })
        .lean()
        .populate('author', { avatar: 1, username: 1, introduction: 1 }, { lean: true });
    }
    if (dbBack.length != 0) {
      await saveRedisUserPost(req.params.userId, dbBack);
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      if (req.user) {
        const self = req.user._id === req.params.userId;
        dbBack = await beautyPostsInfo(dbBack, req.user._id, self);
      }
      dbBack = await addPostsStatistics(dbBack);
      switch (order) {
        case 'latest':
          dbBack.sort((a, b) => {
            return new Date(b.publishDate) - new Date(a.publishDate);
          });
          break;
        default:
          dbBack.sort((a, b) => {
            return b.statistics.likes - a.statistics.likes;
          });
          break;
      }
    }
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function logOut(req, res) {
  let token = req.headers.authorization;
  token = token ? token.replace('Bearer ', '') : null;
  const refreshToken = await getRefreshToken(req.user.email);
  await Promise.all([blockToken(refreshToken), blockToken(token)]);
  res.status(200).json({ msg: 'log out successfully' });
}

export {
  deleteUser,
  findOne,
  findAll,
  updateUser,
  findBySearch,
  followUser,
  updateAvatar,
  updateBackgroundCover,
  getFollwer,
  getFollwing,
  logOut,
  getLikePosts,
  getDislikePosts,
  getSavedPosts,
  userTrending,
  getUserComments,
  getUserPosts,
};
