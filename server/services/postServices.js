import { PostLike, SavedPost, Post, Comment } from "../models/index.js";
import { redisTrending } from "../configs/redis.js";
import schedule from "node-schedule";
import { addCommentsStatistics } from "./commentServices.js";
import { incUserStatistics, userTrendingInc } from "./userServices.js";

async function incPostStatistics(postId, field, incNum) {
  try {
    const key = JSON.stringify(postId) + " Statiscs";
    const result = await redisTrending.hincrby(key, field, incNum);
    if (result < 0) {
      redisTrending.hset(key, field, 0);
    }
  } catch (error) {
    console.log("incPostStatistics Failed --Pservices 52");
  }
}

function addUserPostInfo(post, likeList, saveList) {
  try {
    const like = likeList.filter((e) => e.post.equals(post._id) && e.like).length > 0;
    const dislike = likeList.filter((e) => e.post.equals(post._id) && !e.like).length > 0;
    const save = saveList.filter((e) => e.post.equals(post._id)).length > 0;
    post = { ...post, like, dislike, save };
    return post;
  } catch (error) {
    console.log("addUserPostInfo Faild -- Pservices 95");
  }
}

async function postTrendingInc(postId, incNum) {
  try {
    const data = await redisTrending.zscore(" PostTrending", postId);
    if (data) {
      if (Number(data) + incNum >= 0) {
        redisTrending.zincrby(" PostTrending", incNum, postId);
      }
      return data;
    }
    incNum = incNum < 0 ? 0 : incNum;
    redisTrending.zadd(" PostTrending", incNum, postId);
    return data;
  } catch (error) {
    console.log("trendingIncFiled -- Pservices 114");
  }
}

async function getPostTrending(num) {
  try {
    const trending = await redisTrending.zrevrange(" PostTrending", 0, -1, "withscores");
    const topPosts = trending.slice(0, num * 2);
    let leaderBoard = [];
    topPosts.forEach((postId, index) => {
      if (index % 2 === 0) {
        const popularity = topPosts[index + 1];
        if (popularity === "0") {
          return;
        }
        leaderBoard.push({ postId, popularity });
      }
    });
    leaderBoard = await Promise.all(
      leaderBoard.map(async (ranking) => {
        const post = await Post.findById(ranking.postId, { title: 1, description: 1, cover: 1 })
          .lean()
          .populate("author", { username: 1, avatar: 1 }, { lean: true });
        leaderBoard.pop(ranking);
        const popularity = ranking.popularity;
        return { post, popularity };
      })
    );
    return leaderBoard;
  } catch (error) {
    console.log("getPostTrendingFailed -- Pservices 132");
  }
}

function clearTrendingByTime(time) {
  schedule.scheduleJob(
    time,
    async function (redisTrending) {
      try {
        redisTrending.flushdb();
      } catch (error) {
        console.log("clearTrendingByTime Failed -- Pservices 161");
      }
    }.bind(null, redisTrending)
  );
}

async function addPostStatistics(post) {
  try {
    if (post) {
      const key = JSON.stringify(post._id) + " Statiscs";
      let [flw, flwer, pst, cmt] = await Promise.all([
        PostLike.countDocuments({ post: post._id, like: true }),
        PostLike.countDocuments({ post: post._id, like: false }),
        SavedPost.countDocuments({ post: post._id }),
        Comment.countDocuments({ relatedPost: post._id }),
      ]);
      redisTrending.hset(key, "likes", flw);
      redisTrending.hset(key, "dislikes", flwer);
      redisTrending.hset(key, "marks", pst);
      redisTrending.hset(key, "comments", cmt);
      const pipeline = redisTrending.pipeline();
      pipeline.hget(key, "likes");
      pipeline.hget(key, "dislikes");
      pipeline.hget(key, "marks");
      pipeline.hget(key, "comments");
      pipeline.hget(key, "views");
      const results = await pipeline.exec();
      const likes = results[0][1] === null ? 0 : Number(results[0][1]);
      const dislikes = results[1][1] === null ? 0 : Number(results[1][1]);
      const marks = results[2][1] === null ? 0 : Number(results[2][1]);
      const comments = results[3][1] === null ? 0 : Number(results[3][1]);
      const views = results[4][1] === null ? 0 : Number(results[4][1]);
      const statistics = {
        likes,
        dislikes,
        marks,
        comments,
        views,
      };
      post = { ...post, statistics };
    }
    return post;
  } catch (error) {
    console.log("addPostStatistics Failed -- Pservices 171");
  }
}

async function beautyPostInfo(post, userId) {
  try {
    if (post) {
      const [likeList, PostSaveList] = await Promise.all([
        PostLike.find({ user: userId }, { post: 1, like: 1, _id: 0 }).lean(),
        SavedPost.find({ user: userId }, { post: 1, _id: 0 }).lean(),
      ]);
      post = addUserPostInfo(post, likeList, PostSaveList);
    }
    return post;
  } catch (error) {
    console.log("beautyPostInfo Failed -- Pservices 198");
  }
}

async function beautyPostsInfo(posts, userId) {
  try {
    const [likeList, saveList] = await Promise.all([
      PostLike.find({ user: userId }, { post: 1, like: 1, _id: 0 }).lean(),
      SavedPost.find({ user: userId }, { post: 1, _id: 0 }).lean(),
    ]);
    posts.forEach((post, index) => {
      posts[index] = addUserPostInfo(post, likeList, saveList);
    });
    return posts;
  } catch (error) {
    console.log("beautyPostInfo Failed -- Pservices 214");
  }
}
async function addPostsStatistics(postList) {
  try {
    postList = await Promise.all(
      postList.map(async (post) => {
        post = await addPostStatistics(post);
        return post;
      })
    );
    return postList;
  } catch (error) {
    console.log("addPostsStatistics Failed -- Pservices 239");
  }
}
function postFilter(posts, timeInterval = "default") {
  try {
    let start = new Date();
    let end = new Date();
    switch (timeInterval) {
      case "a_day":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "a_week":
        start.setDate(start.getDate() - 7);
        break;
      case "a_month":
        start.setMonth(start.getMonth() - 1);
        break;
      case "three_month":
        start.setMonth(start.getMonth() - 3);
      case "half_a_year":
        start.setMonth(start.getMonth() - 6);
      case "a_year":
        start.setFullYear(start.getFullYear() - 1);
      default:
        start.setFullYear(2021);
        break;
    }
    posts = posts.filter((post) => post.publishDate > start && post.publishDate < end);
    return posts;
  } catch (error) {
    console.log("getPosts Failed -- Pservices 251");
  }
}
async function updatePostStats(post, likes = 0, trending = 0, upvotes = 0, marks = 0) {
  const postId = post._id;
  await Promise.all([
    postTrendingInc(postId, trending),
    incPostStatistics(postId, "likes", likes),
    userTrendingInc(post.author, trending),
    incUserStatistics(post.author, "upvotes", upvotes),
    incPostStatistics(postId, "marks", marks),
  ]);
}

function postPopularity(post) {
  const popularity =
    post.statistics.likes * 20 +
    post.statistics.comments * 30 +
    post.statistics.marks * 40 +
    post.statistics.views * 10;
  return popularity;
}
export {
  addUserPostInfo,
  postTrendingInc,
  getPostTrending,
  clearTrendingByTime,
  addPostStatistics,
  addCommentsStatistics,
  beautyPostInfo,
  incPostStatistics,
  beautyPostsInfo,
  addPostsStatistics,
  postFilter,
  postPopularity,
  updatePostStats,
};
