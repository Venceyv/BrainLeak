import { Follow, User, Comment, PostLike, SavedPost, Post, CommentLike, Reply, ReplyLike } from "../models/index.js";
import {
  updatePicture,
  getRedisUserProfile,
  saveRedisUserProfile,
  addFollowingInfo,
  addUserStatistics,
  incUserStatistics,
  getUserTrending,
  getRedisUserComment,
  saveRedisUserComment,
  getRedisUserPost,
  saveRedisUserPost,
  userTrendingInc,
  getUserNotification,
  addCategories,
  resetUserNotification,
} from "../services/userServices.js";
import jwt from "jsonwebtoken";
import {
  blockToken,
  createRefreshToken,
  createToken,
  getblockToken,
  getRefreshToken,
  saveRefreshToken,
} from "../services/jwt.js";
import json from "body-parser";
import { addCommentsStatistics } from "../services/commentServices.js";
import { addPostsStatistics, addPostStatistics, addUserPostInfo, beautyPostsInfo } from "../services/postServices.js";
import { beautyCommentsInfo } from "../services/commentServices.js";
import { sortWith } from "../services/arraySorter.js";
import { promisify } from "util";
import dotenv from "dotenv";
dotenv.config();
const verify = promisify(jwt.verify);

async function deleteUser(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    let accessToken = req.headers.authorization;
    accessToken = accessToken ? accessToken.replace("Bearer ", "") : null;
    const [refreshToken] = await Promise.all([
      getRefreshToken(req.user._id),
      User.findByIdAndUpdate(req.params.userId, { isDelete: true }),
      blockToken(accessToken),
    ]);
    await blockToken(refreshToken);
    return res.status(200).json({ msg: "delete succesfully" });
  } catch (error) {
    res.json(error);
  }
}

async function findOne(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    let dbBack = await getRedisUserProfile(req.params.userId);
    if (!dbBack) {
      dbBack = await User.findById(req.params.userId, { email: 0, isDelete: 0 }).lean();
      await saveRedisUserProfile(req.params.userId, dbBack);
    }
    dbBack = await addUserStatistics(dbBack);
    if (req.user) {
      const self = req.user._id === req.params.userId;
      switch (self) {
        case true:
          let following = null;
          dbBack = { ...dbBack, following };
          break;
        case false:
          const follwingList = await Follow.find({ user: req.user._id }, { followedUser: 1 }).lean();
          dbBack = addFollowingInfo(dbBack, follwingList);
          break;
        default:
          break;
      }
      return res.status(200).json({ dbBack });
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}
async function findAll(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
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
        if (user._id.equals(req.user._id)) {
          let following = null;
          dbBack[index] = { ...dbBack[index], following };
          return;
        }
        dbBack[index] = addFollowingInfo(user, followingList);
      });
    }
    res.status(200).json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}
async function findBySearch(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    let dbBack = await User.find(
      {
        username: { $regex: req.query.q, $options: "$i" },
      },
      { isDelete: 0, email: 0 }
    ).lean();
    if (dbBack.length === 0) {
      res.status(404);
      throw "user not found";
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
        if (user._id.equals(req.user._id)) {
          let following = null;
          dbBack[index] = { ...dbBack[index], following };
          return;
        }
        dbBack[index] = addFollowingInfo(user, followingList);
      });
    }
    res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
}
async function updateUser(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const dbBack = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    });
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}
async function updateAvatar(req, res) {
  res.setHeader("Content-Type", "application/json");
  await updatePicture(req, res, "avatar");
}
async function updateBackgroundCover(req, res) {
  res.setHeader("Content-Type", "application/json");
  await updatePicture(req, res, "backgroundCover");
}
async function followUser(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const user = req.user;
    const targetUserId = req.targetUser._id;
    if (user._id.equals(targetUserId)) {
      res.status(403);
      throw "cant follow yourself!";
    }
    const dbBack = await Follow.findOne({
      user: user._id,
      followedUser: targetUserId,
    });
    if (dbBack) {
      dbBack.remove();
      await Promise.all([
        incUserStatistics(user._id, "following", -1),
        incUserStatistics(targetUserId, "follower", -1),
        userTrendingInc(targetUserId, -10),
      ]);
      const msg = "unfollow successfully.";
      return res.status(200).json({ msg });
    }
    await Promise.all([
      incUserStatistics(user._id, "following", 1),
      incUserStatistics(targetUserId, "follower", 1),
      userTrendingInc(targetUserId, 10),
    ]);
    new Follow({
      user: user._id,
      followedUser: targetUserId,
    }).save();
    const msg = "follow successfully.";
    res.status(200).json({ msg });
  } catch (error) {
    res.json({ error: error });
  }
}

async function getFollower(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    let dbBack = await Follow.find({ followedUser: req.params.userId }, { followedUser: 0, _id: 0 })
      .lean()
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate("user", { username: 1, avatar: 1, introduction: 1 }, { lean: true });
    if (dbBack.length != 0) {
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
          if (user._id.equals(req.user._id)) {
            let following = null;
            dbBack[index] = { ...dbBack[index], following };
            return;
          }
          dbBack[index] = addFollowingInfo(user, followingList);
        });
      }
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}
async function getFollowing(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    let dbBack = await Follow.find({ user: req.params.userId }, { user: 0, _id: 0 })
      .lean()
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate("followedUser", { username: 1, avatar: 1, introduction: 1 }, { lean: true });
    if (dbBack.length != 0) {
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
          if (user._id.equals(req.user._id)) {
            let following = null;
            dbBack[index] = { ...dbBack[index], following };
            return;
          }
          dbBack[index] = addFollowingInfo(user, followingList);
        });
      }
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}
async function getLikePosts(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const order = req.query.sort;
    let dbBack = await PostLike.find({ user: req.user._id, like: true }, { _id: 0, post: 1 })
      .lean()
      .populate({
        path: "post",
        select: "title description author publishDate",
        options: { lean: true },
        populate: {
          path: "author",
          select: "avatar username introduction",
          options: { lean: true },
        },
      });
    if (dbBack.length != 0) {
      const [likeList, PostSaveList] = await Promise.all([
        PostLike.find({ user: req.user._id }, { post: 1, like: 1, _id: 0 }).lean(),
        SavedPost.find({ user: req.user._id }, { post: 1, _id: 0 }).lean(),
      ]);
      dbBack.forEach((data, index) => {
        dbBack[index] = addUserPostInfo(data.post, likeList, PostSaveList);
      });
      dbBack = await Promise.all(
        dbBack.map(async (post) => {
          post = await addPostStatistics(post);
          return post;
        })
      );
      dbBack = sortWith(dbBack, order);
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function getDislikePosts(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const order = req.query.sort;
    let dbBack = await PostLike.find({ user: req.user._id, like: false }, { _id: 0, post: 1 })
      .lean()
      .populate({
        path: "post",
        select: "title description author publishDate",
        options: { lean: true },
        populate: {
          path: "author",
          select: "avatar username introduction",
          options: { lean: true },
        },
      });
    if (dbBack.length != 0) {
      const [likeList, PostSaveList] = await Promise.all([
        PostLike.find({ user: req.user._id }, { post: 1, like: 1, _id: 0 }).lean(),
        SavedPost.find({ user: req.user._id }, { post: 1, _id: 0 }).lean(),
      ]);
      dbBack.forEach((data, index) => {
        dbBack[index] = addUserPostInfo(data.post, likeList, PostSaveList);
      });
      dbBack = await Promise.all(
        dbBack.map(async (post) => {
          post = await addPostStatistics(post);
          return post;
        })
      );
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      dbBack = sortWith(dbBack, order);
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function getSavedPosts(req, res) {
  try {
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const order = req.query.sort;
    let dbBack = await SavedPost.find({ user: req.user._id }, { _id: 0, post: 1 })
      .lean()
      .populate({
        path: "post",
        select: "title description author publishDate",
        options: { lean: true },
        populate: {
          path: "author",
          select: "avatar username introduction",
          options: { lean: true },
        },
      });
    res.setHeader("Content-Type", "application/json");
    if (dbBack.length != 0) {
      const [likeList, PostSaveList] = await Promise.all([
        PostLike.find({ user: req.user._id }, { post: 1, like: 1, _id: 0 }).lean(),
        SavedPost.find({ user: req.user._id }, { post: 1, _id: 0 }).lean(),
      ]);
      dbBack.forEach((data, index) => {
        dbBack[index] = addUserPostInfo(data.post, likeList, PostSaveList);
      });
      dbBack = await Promise.all(
        dbBack.map(async (post) => {
          post = await addPostStatistics(post);
          return post;
        })
      );
      dbBack = sortWith(dbBack, order);
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function userTrending(req, res) {
  try {
    const topNumber = req.query.top;
    const dbBack = await getUserTrending(topNumber);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
//
async function getUserComments(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const userId = req.params.userId;
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const order = req.query.sort;
    let dbBack = await getRedisUserComment(userId);
    if (!dbBack) {
      dbBack = await Comment.find({ author: userId }, { edited: 0 })
        .lean()
        .populate("relatedPost", { title: 1 }, { lean: true })
        .populate("author", {
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
        dbBack = await beautyCommentsInfo(dbBack, req.user._id);
      }
      dbBack = await addCommentsStatistics(dbBack);
      dbBack = sortWith(dbBack, order);
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function getUserPosts(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    let dbBack = await getRedisUserPost(req.params.userId);
    const order = req.query.sort;
    if (!dbBack) {
      dbBack = await Post.find({ author: req.params.userId }, { title: 1, description: 1, publishDate: 1 })
        .lean()
        .populate("author", { avatar: 1, username: 1, introduction: 1 }, { lean: true });
    }
    if (dbBack.length != 0) {
      await saveRedisUserPost(req.params.userId, dbBack);
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      if (req.user) {
        dbBack = await beautyPostsInfo(dbBack, req.user._id);
      }
      dbBack = await addPostsStatistics(dbBack);
      switch (order) {
        case "latest":
          dbBack = sortWith(dbBack, "latest");
          break;
        default:
          dbBack = sortWith(dbBack, "likes");
          break;
      }
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function logOut(req, res) {
  res.setHeader("Content-Type", "application/json");
  let token = req.headers.authorization;
  token = token ? token.replace("Bearer ", "") : null;
  const refreshToken = await getRefreshToken(req.user._id);
  await Promise.all([blockToken(refreshToken), blockToken(token)]);
  res.status(200).json({ msg: "log out successfully" });
}

async function refreshToken(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    let refreshToken = req.headers.authorization;
    refreshToken = refreshToken ? refreshToken.replace("Bearer ", "") : null;
    if (refreshToken) {
      let [inBlockList, decodedToken] = await Promise.all([
        getblockToken(refreshToken),
        verify(refreshToken, process.env.REFRESHSECRETORKEY),
      ]);
      if (!inBlockList) {
        const userRrefreshToken = await getRefreshToken(decodedToken.userInfo.userId);
        if (userRrefreshToken === refreshToken) {
          const [newAccessToken, newRefreshToken] = await Promise.all([
            createToken(decodedToken.userInfo),
            createRefreshToken(decodedToken.userInfo),
            blockToken(refreshToken),
          ]);
          const accessToken = "Bearer " + newAccessToken;
          refreshToken = newRefreshToken;
          // refresh refreshToken
          await saveRefreshToken(decodedToken.userInfo.userId, newRefreshToken);
          return res.status(200).json({ accessToken, refreshToken });
        }
      }
      res.status(401);
      throw "Invalid refreshToken";
    }
  } catch (error) {
    return res.json({ error: error });
  }
}
async function getNewPost(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const userId = req.params.userId;
    let dbBack = [];
    const followingList = await Follow.find({ user: userId }, { followedUser: 1, _id: 0 }).lean();
    followingList.forEach((info, index) => {
      followingList[index] = info.followedUser;
    });
    if (followingList.length != 0) {
      dbBack = await Post.find({ author: { $in: followingList } }, { _id: 1, publishDate: 1 })
        .lean()
        .populate("author", { avatar: 1, username: 1, introduction: 1 }, { lean: true });
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}
async function getNewComment(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const userId = req.params.userId;
    let dbBack = [];
    const followingList = await Follow.find({ user: userId }, { followedUser: 1, _id: 0 }).lean();
    followingList.forEach((info, index) => {
      followingList[index] = info.followedUser;
    });
    if (followingList.length != 0) {
      dbBack = await Comment.find({ author: { $in: followingList } }, { _id: 1, publishDate: 1 })
        .lean()
        .populate("author", { avatar: 1, username: 1, introduction: 1 }, { lean: true });
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}
async function getNewLike(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const userId = req.params.userId;
    let dbBack = [];
    const followingList = await Follow.find({ user: userId }, { followedUser: 1, _id: 0 }).lean();
    followingList.forEach((info, index) => {
      followingList[index] = info.followedUser;
    });
    if (followingList.length != 0) {
      dbBack = await CommentLike.find(
        { user: { $in: followingList }, like: true },
        { _id: 0, like: 0, commentAuthor: 0 }
      )
        .lean()
        .populate("user", { avatar: 1, username: 1, introduction: 1 }, { lean: true });
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}

async function getNotification(req, res) {
  try {
    const userId = req.user._id;
    const dbBack = await getUserNotification(userId);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}
async function getMyComments(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const userId = req.params.userId;
    let [dbBack] = await Promise.all([
      Comment.find({ postAuthor: userId }, { content: 1, publishDate: 1, author: 1, relatedPost: 1 })
        .lean()
        .populate("author", { username: 1, avatar: 1, introduction: 1 }, { lean: true }),
      resetUserNotification(userId, "comments"),
    ]);
    dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    dbBack = sortWith(dbBack, "latest");
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}
async function getMyReplies(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const userId = req.params.userId;
    let [dbBack] = await Promise.all([
      Reply.find({ mentionedUser: userId }, { mentionedUser: 0 })
        .lean()
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .populate("author", { username: 1, avatar: 1, introduction: 1 }, { lean: true }),
      resetUserNotification(userId, "replies"),
    ]);
    dbBack = sortWith(dbBack, "latest");
    dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}
async function getMylikes(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const userId = req.params.userId;
    let [postLike, commentLike, replyLike] = await Promise.all([
      PostLike.find({ postAuthor: userId, like: true }, { _id: 0, like: 0, postAuthor: 0 })
        .lean()
        .populate("user", { username: 1, avatar: 1, introduction: 1 }, { lean: true }),
      CommentLike.find({ commentAuthor: userId, like: true }, { _id: 0, like: 0, commentAuthor: 0 })
        .lean()
        .populate("user", { username: 1, avatar: 1, introduction: 1 }, { lean: true }),
      ReplyLike.find({ replyAuthor: userId, like: true }, { _id: 0, replyAuthor: 0, like: 0 })
        .lean()
        .populate("user", { username: 1, avatar: 1, introduction: 1 }, { lean: true }),
      resetUserNotification(userId, "likes"),
    ]);
    postLike = addCategories(postLike, "post likes");
    commentLike = addCategories(commentLike, "comment likes");
    replyLike = addCategories(replyLike, "reply likes");
    let dbBack = postLike.concat(commentLike, replyLike);
    dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    dbBack = sortWith(dbBack, "latest");
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function getMyMarks(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const userId = req.user._id;
    let [dbBack] = await Promise.all([
      SavedPost.find({ postAuthor: userId }, { postAuthor: 0 })
        .lean()
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .populate("user", { username: 1, avatar: 1, introduction: 1 }, { lean: true }),
      resetUserNotification(userId, "marks"),
    ]);
    dbBack = sortWith(dbBack, "latest");
    dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
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
  getFollower,
  getFollowing,
  logOut,
  getLikePosts,
  getDislikePosts,
  getSavedPosts,
  userTrending,
  getUserComments,
  getUserPosts,
  refreshToken,
  getNewPost,
  getNewComment,
  getNewLike,
  getNotification,
  getMyComments,
  getMyReplies,
  getMylikes,
  getMyMarks,
};
