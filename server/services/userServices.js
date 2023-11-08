import { Comment, Follow, Post, PostLike, User } from "../models/index.js";
import { uploadFile } from "./uploadFile.js";
import { redisTrending } from "../configs/redis.js";
import fastJson from "fast-json-stringify";

const stringifyUserInfo = fastJson({
  type: "object",
  properties: {
    _id: { type: "string" },
    username: { type: "string" },
  },
});

async function updatePicture(req, res, name) {
  try {
    const url = uploadFile(req, res);
    if (url) {
      let dbBack;
      switch (name) {
        case "avatar": {
          dbBack = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: url },
            { new: 1 }
          );
          break;
        }

        default: {
          dbBack = await User.findByIdAndUpdate(
            req.user._id,
            { backgroundCover: url },
            { new: 1 }
          );
          break;
        }
      }
      return res.status(200).json({ dbBack });
    }
    res.status(400);
    throw "error with img";
  } catch (error) {
    res.json({ error: error });
  }
}
async function incUserStatistics(userId, field, incNum) {
  try {
    userId = JSON.stringify(userId);
    const key = userId + " Statistics";
    const result = await redisTrending.hincrby(key, field, incNum);
    if (result < 0) {
      redisTrending.hset(key, field, 0);
    }
  } catch (error) {
    console.log("incUserStatistics Failed -- Uservices 208");
  }
}
//to determind if the current user is following the targetUser
function addFollowingInfo(targetUser, followingList) {
  try {
    const following =
      followingList.filter((e) => e.followedUser.equals(targetUser._id))
        .length > 0;
    targetUser = { ...targetUser, following };
    return targetUser;
  } catch (error) {
    console.log("addFollowingInfoFailed -- Uservices 221");
  }
}

async function addUserStatistics(user) {
  try {
    if (user) {
      const key = JSON.stringify(user._id) + " Statistics";
      let [flw, flwer, pst, cmt, pl] = await Promise.all([
        Follow.countDocuments({ user: user._id }),
        Follow.countDocuments({ followedUser: user._id }),
        Post.countDocuments({ author: user._id }),
        Comment.countDocuments({ author: user._id }),
        PostLike.countDocuments({ postAuthor: user._id }),
      ]);
      redisTrending.hset(key, "following", flw);
      redisTrending.hset(key, "follower", flwer);
      redisTrending.hset(key, "posts", pst);
      redisTrending.hset(key, "comments", cmt);
      redisTrending.hset(key, "upvotes", pl);
      const pipeline = redisTrending.pipeline();
      pipeline.hget(key, "following");
      pipeline.hget(key, "follower");
      pipeline.hget(key, "posts");
      pipeline.hget(key, "comments");
      pipeline.hget(key, "upvotes");
      const results = await pipeline.exec();
      const following = results[0][1] === null ? 0 : Number(results[0][1]);
      const follower = results[1][1] === null ? 0 : Number(results[1][1]);
      const posts = results[2][1] === null ? 0 : Number(results[2][1]);
      const comments = results[3][1] === null ? 0 : Number(results[3][1]);
      const upvotes = results[4][1] === null ? 0 : Number(results[4][1]);
      const statistics = {
        following,
        follower,
        posts,
        comments,
        upvotes,
        following,
      };
      user = { ...user, statistics };
    }
    return user;
  } catch (error) {
    console.log("addUserStatistics Failed -- Uservices 232");
  }
}

async function userTrendingInc(userId, incNum) {
  try {
    const data = await redisTrending.zscore(" UserTrending", userId);
    if (data) {
      if (Number(data) + incNum >= 0) {
        redisTrending.zincrby(" UserTrending", incNum, userId);
      }
      return data;
    }
    incNum = incNum < 0 ? 0 : incNum;
    redisTrending.zadd(" UserTrending", incNum, userId);
    return data;
  } catch (error) {
    console.log("userTrendingInc Filed -- Uservices 271");
  }
}

async function getUserTrending(num) {
  try {
    const trending = await redisTrending.zrevrange(
      " UserTrending",
      0,
      -1,
      "withscores"
    );
    const topUsers = trending.slice(0, num * 2);
    let leaderBoard = [];
    topUsers.forEach((userId, index) => {
      if (index % 2 === 0) {
        const popularity = topUsers[index + 1];
        if (popularity === "0") {
          return;
        }
        leaderBoard.push({ userId, popularity });
      }
    });
    leaderBoard = await Promise.all(
      leaderBoard.map(async (ranking) => {
        let user = await User.findById(ranking.userId, {
          avatar: 1,
          username: 1,
          backgroundCover: 1,
          introduction: 1,
        }).lean();
        const key = JSON.stringify(user._id) + " Statistics";
        let [followerCount, postCount] = await Promise.all([
          redisTrending.hget(key, "follower"),
          redisTrending.hget(key, "posts"),
        ]);
        followerCount = followerCount === null ? 0 : Number(followerCount);
        postCount = postCount === null ? 0 : Number(postCount);
        user = { ...user, followerCount, postCount };
        leaderBoard.pop(ranking);
        const popularity = ranking.popularity;
        return { user, popularity };
      })
    );
    return leaderBoard;
  } catch (error) {
    console.log("getUserTrending Failed -- Uservices 290");
  }
}

async function getRedisUserComment(userId) {
  try {
    const key = JSON.stringify(userId) + " Comment";
    let comment = await redisTrending.get(key);
    if (!comment) {
      return null;
    }
    comment = JSON.parse(comment);
    return comment;
  } catch (error) {
    console.log("getRedisUserComment Failed -- Uservices 317");
  }
}
function saveRedisUserComment(userId, comments) {
  try {
    const key = JSON.stringify(userId) + " Comment";
    comments = JSON.stringify(comments);
    redisTrending.setex(key, 3, comments);
  } catch (error) {
    console.log("saveRedisUserComment Failed -- Uservices 330");
  }
}

async function getRedisUserPost(userId) {
  try {
    const key = JSON.stringify(userId) + " Post";
    let post = await redisTrending.get(key);
    if (!post) {
      return null;
    }
    post = JSON.parse(post);
    return post;
  } catch (error) {
    console.log("getRedisUserPost Failed -- Uservices 348");
  }
}
function saveRedisUserPost(userId, posts) {
  try {
    const key = JSON.stringify(userId) + " Post";
    posts = JSON.stringify(posts);
    redisTrending.setex(key, 3, posts);
  } catch (error) {
    console.log("saveRedisUserPost Failed -- Uservices 361");
  }
}
async function incUserNotification(userId, field, incNum) {
  try {
    userId = JSON.stringify(userId);
    const key = userId + " NewMessages";
    const result = await redisTrending.hincrby(key, field, incNum);
    if (result < 0) {
      redisTrending.hset(key, field, 0);
    }
  } catch (error) {
    console.log("incUserNewMessages Failed -- Uservices 208");
  }
}
function resetUserNotification(userId, field) {
  try {
    userId = JSON.stringify(userId);
    const key = userId + " NewMessages";
    redisTrending.hset(key, field, 0);
  } catch (error) {
    console.log("resetUserNewMessages Failed -- Uservices 208");
  }
}
async function getUserNotification(userId) {
  try {
    const key = JSON.stringify(userId) + " NewMessages";
    const pipeline = redisTrending.pipeline();
    pipeline.hget(key, "comments");
    pipeline.hget(key, "replies");
    pipeline.hget(key, "likes");
    pipeline.hget(key, "marks");
    const results = await pipeline.exec();
    const newComments = results[0][1] === null ? 0 : Number(results[0][1]);
    const newReplies = results[1][1] === null ? 0 : Number(results[1][1]);
    const newLikes = results[2][1] === null ? 0 : Number(results[2][1]);
    const newMarks = results[3][1] === null ? 0 : Number(results[3][1]);
    const total = newComments + newReplies + newLikes + newMarks;
    const notifications = {
      newComments,
      newReplies,
      newLikes,
      newMarks,
      total,
    };
    return notifications;
  } catch (error) {
    console.log("getUserNewMessages Failed -- Uservices 232");
  }
}
function addCategories(lists, type) {
  lists.forEach((post, index) => {
    const category = type;
    lists[index] = { ...post, category };
  });
  return lists;
}
async function refreshFollowingList(followingList) {
  await Promise.all(
    followingList.map(async (list) => {
      await incUserStatistics(list.followedUser, "follower", -1);
    })
  );
}
async function refreshFollowerList(followerList) {
  await Promise.all(
    followerList.map(async (list) => {
      await incUserStatistics(list.user, "following", -1);
    })
  );
}
export {
  updatePicture,
  stringifyUserInfo,
  addFollowingInfo,
  addUserStatistics,
  incUserStatistics,
  userTrendingInc,
  getUserTrending,
  getRedisUserComment,
  saveRedisUserComment,
  getRedisUserPost,
  saveRedisUserPost,
  incUserNotification,
  resetUserNotification,
  getUserNotification,
  addCategories,
  refreshFollowerList,
  refreshFollowingList,
};
