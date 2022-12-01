import { Post, Tags, PostLike, SavedPost, Comment, CommentLike } from "../models/index.js";
import {
  getRedisPostProfile,
  saveRedisPostProfile,
  postTrendingInc,
  getPostTrending,
  addPostStatistics,
  beautyPostInfo,
  incPostStatistics,
  postFilter,
  beautyPostsInfo,
  addPostsStatistics,
} from "../services/postServices.js";
import { incUserNotification, incUserStatistics, userTrendingInc } from "../services/userServices.js";
import json from "body-parser";
import { redisTrending } from "../configs/redis.js";
import { sortWith } from "../services/arraySorter.js";
import { regexFilter } from "../services/regexFilter.js";
import { addCommentStatistics, addCommentUserInfo } from "../services/commentServices.js";

async function createPost(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const dbBack = new Post(req.body);
    const userId = req.user._id;
    incUserStatistics(req.user._id, "posts", 1);
    dbBack.author = userId;
    dbBack.put = req.query.put === "true" ? true : false;
    dbBack.tags.map(async function (tag) {
      const record = await Tags.findOne({ tagName: tag });
      if (!record) {
        new Tags({ tagName: tag }).save();
      }
    });
    dbBack.save();
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}
async function findOne(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const postId = req.params.postId;
    let dbBack = await getRedisPostProfile(postId);
    if (!dbBack) {
      dbBack = await Post.findById(postId, { put: 0, edited: 0, likes: 0 }).lean();
      saveRedisPostProfile(postId, dbBack);
    }
    let pinnedComment = await Comment.findById(dbBack.pinnedComment)
      .lean()
      .populate("author", { avatar: 1, username: 1 }, { lean: true });
    [dbBack, pinnedComment] = await Promise.all([addPostStatistics(dbBack), addCommentStatistics(pinnedComment)]);
    postTrendingInc(req.params.postId, 1);
    incPostStatistics(postId, "views", 1);
    userTrendingInc(req.post.author, 1);
    dbBack.pinnedComment = pinnedComment;
    if (req.user) {
      let commentLikedList;
      [dbBack, commentLikedList] = await Promise.all([
        beautyPostInfo(dbBack, req.user._id),
        CommentLike.find({ user: req.user._id }, { comment: 1, like: 1, _id: 0 }).lean(),
      ]);
      dbBack.pinnedComment = addCommentUserInfo(pinnedComment, commentLikedList);
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}

async function findByTags(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const tags = req.query.tags.split(" ");
    const pageNum = req.query.pagenumber;
    const pageSize = req.query.pagesize;
    const timeInterval = req.query.timeInterval;
    const order = req.query.sort;
    let dbBack = await Post.find({ tags: { $in: tags } })
      .lean()
      .populate("author", "avatar username follower upVoteGet");
    if (dbBack.length === 0) {
      if (tags.length === 1) {
        await Tags.findOneAndDelete({ tagName: tags[0] });
      }
      return res.status(200).json({ dbBack });
    }
    dbBack = postFilter(dbBack, timeInterval);
    dbBack = await Promise.all(
      dbBack.map(async (post) => {
        post = await addPostStatistics(post);
        return post;
      })
    );
    if (req.user) {
      dbBack = await beautyPostsInfo(dbBack, req.user._id);
    }
    dbBack = sortWith(dbBack, order);
    dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}
async function findAll(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const pageNum = req.query.pagenumber;
    const pageSize = req.query.pagesize;
    const timeInterval = req.query.timeInterval;
    const order = req.query.sort;
    let dbBack = await Post.find({}, { put: 0 })
      .lean()
      .populate("author", "avatar username introduction", { lean: true });
    if (dbBack.length != 0) {
      dbBack = postFilter(dbBack, timeInterval);
      dbBack = await addPostsStatistics(dbBack);
      dbBack = sortWith(dbBack, order);
      if (req.user) {
        dbBack = await beautyPostsInfo(dbBack, req.user._id);
      }
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.json({ error: error });
  }
}
async function findBySearch(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const pageNum = req.query.pagenumber;
    const pageSize = req.query.pagesize;
    const timeInterval = req.query.timeInterval;
    const order = req.query.sort;
    let query = req.query.q;
    query = regexFilter(query);
    let dbBack = await Post.find({
      $or: [{ title: { $regex: query, $options: "$i" } }, { description: { $regex: query, $options: "$i" } }],
    })
      .lean()
      .populate("author", "avatar username", { lean: true });
    if (dbBack.length != 0) {
      dbBack = postFilter(dbBack, timeInterval);
      dbBack = await Promise.all(
        dbBack.map(async (post) => {
          post = await addPostStatistics(post);
          return post;
        })
      );
      if (req.user) {
        dbBack = await beautyPostsInfo(dbBack, req.user._id);
      }
      dbBack = sortWith(dbBack, order);
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}
async function updatePost(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    req.body.updateDate = Date.now();
    req.body.edited = true;
    const dbBack = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true });
    if (req.body.tags) {
      const tags = req.body.tags;
      tags.map(async function (tag) {
        const record = await Tags.findOne({ tagName: tag });
        if (!record) {
          new Tags({ tagName: tag }).save();
        }
      });
    }
    return res.json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}
async function likePost(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const postId = req.params.postId;
    const postLike = await PostLike.findOne({ user: req.user._id, post: postId }, { like: 1 });
    const post = req.post;
    let like = true;
    if (postLike && postLike.like) {
      postTrendingInc(req.params.postId, -2);
      incPostStatistics(postId, "likes", -1);
      userTrendingInc(req.post.author, -2);
      incUserStatistics(req.post.author, "upvotes", -1);
      like = false;
      postLike.remove();
      return res.status(200).json({ like });
    }
    postTrendingInc(postId, 2);
    incPostStatistics(postId, "likes", 1);
    userTrendingInc(req.post.author, 2);
    incUserStatistics(req.post.author, "upvotes", 1);
    incUserNotification(req.post.author, "likes", 1);
    if (postLike) {
      postLike.like = true;
      incPostStatistics(postId, "dislikes", -1);
      postLike.save();
      return res.status(200).json({ like });
    }
    PostLike({ user: req.user._id, post: postId, postAuthor: post.author }).save();
    return res.status(200).json({ like });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function dislikePost(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const postId = req.params.postId;
    const postLike = await PostLike.findOne({ user: req.user._id, post: postId });
    const post = req.post;
    let dislike = true;
    if (postLike && !postLike.like) {
      postLike.remove();
      incPostStatistics(postId, "dislikes", -1);
      dislike = false;
      return res.status(200).json({ dislike });
    }
    incPostStatistics(postId, "dislikes", 1);
    incUserStatistics(post.author, "upvotes", -1);
    if (postLike) {
      incPostStatistics(postId, "likes", -1);
      postTrendingInc(postId, -2);
      userTrendingInc(post.author, -2);
      incUserStatistics(post.author, "upvotes", -1);
      postLike.like = false;
      postLike.save();
      return res.status(200).json({ dislike });
    }
    new PostLike({ user: req.user._id, post: postId, postAuthor: post.author, like: false }).save();
    return res.status(200).json({ dislike });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}
async function savePost(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const postId = req.params.postId;
    const post = req.post;
    const dbBack = await SavedPost.findOne({ user: req.user._id, post: postId });
    let saved = true;
    if (dbBack) {
      postTrendingInc(postId, -4);
      incPostStatistics(postId, "marks", -1);
      userTrendingInc(post.author, -3);
      saved = false;
      dbBack.remove();
      return res.status(200).json({ saved });
    }
    postTrendingInc(postId, 4);
    incPostStatistics(postId, "marks", 1);
    userTrendingInc(post.author, 3);
    incUserNotification(post.author, "marks", 1);
    new SavedPost({ user: req.user._id, post: postId, postAuthor: post.author }).save();
    return res.status(200).json({ saved });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function deletePost(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const postId = req.params.postId;
    incUserStatistics(req.user._id, "posts", -1);
    await Promise.all([
      Post.findByIdAndDelete(req.post._id),
      PostLike.deleteMany({ post: postId }),
      SavedPost.deleteMany({ post: postId }),
    ]);
    redisTrending.zrem(" PostTrending", postId);
    const msg = "Delete Successfully";
    return res.status(402).json({ msg });
  } catch (error) {
    res.json({ error: error });
  }
}

async function postTrending(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const topNumber = req.query.q;
    const dbBack = await getPostTrending(topNumber);
    res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function getAllTags(req, res) {
  try {
    const dbBack = await Tags.find({}, { tagName: 1, _id: 0 }).lean();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}

export {
  createPost,
  findOne,
  findByTags,
  findAll,
  findBySearch,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  savePost,
  postTrending,
  getAllTags,
};
