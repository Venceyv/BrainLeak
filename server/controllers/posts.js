import { Post, Tags, PostLike, SavedPost } from "../models/index.js";
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
} from "../services/postServices.js";
import { incUserStatistics, userTrendingInc } from "../services/userServices.js";
import json from "body-parser";
import { redisTrending } from "../configs/redis.js";
import { sortWith } from "../services/arraySorter.js";

async function createPost(req, res) {
  try {
    const dbBack = new Post(req.body);
    await incUserStatistics(req.user._id, "posts", 1);
    dbBack.author = req.user._id;
    dbBack.put = req.query.put === "true" ? true : false;
    dbBack.tags.map(async function (tag) {
      const record = await Tags.findOne({ tagName: tag });
      if (!record) {
        await new Tags({ tagName: tag }).save();
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
    const postId = req.params.postId;
    let dbBack = await getRedisPostProfile(postId);
    if (!dbBack) {
      dbBack = await Post.findById(postId, { put: 0, edited: 0, likes: 0 }).lean().populate(
        "author",
        {
          _id: 1,
          avatar: 1,
          username: 1,
        },
        { lean: true }
      );
      await saveRedisPostProfile(postId, dbBack);
    }
    const [postStatistics] = await Promise.all([
      addPostStatistics(dbBack),
      postTrendingInc(req.params.postId, 1),
      incPostStatistics(postId, "views", 1),
      userTrendingInc(req.post.author, 1),
    ]);
    dbBack = postStatistics;
    if (req.user) {
      const beautifulPost = await beautyPostInfo(dbBack, req.user._id);
      dbBack = beautifulPost;
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}

async function findByTags(req, res) {
  try {
    const tags = req.query.tags.split(" ");
    const pageNum = req.query.pagenumber;
    const pageSize = req.query.pagesize;
    const timeInterval = req.query.timeInterval;
    const order = req.query.sort;
    let dbBack = await Post.find({ tags: { $in: tags } })
      .lean()
      .populate("author", "avatar username follower upVoteGet");
    res.setHeader("Content-Type", "application/json");
    if (dbBack.length === 0) {
      if (tags.length === 1) {
        await Tags.findOneAndDelete({ tagName: tags });
      }
      return res.status(200).json({ dbBack });
    }
    dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
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
    switch (order) {
      case "latest":
        dbBack = sortWith(dbBack, "latest");
        break;

      default:
        dbBack = sortWith(dbBack, "likes");
        break;
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}
async function findAll(req, res) {
  try {
    const pageNum = req.query.pagenumber;
    const pageSize = req.query.pagesize;
    const timeInterval = req.query.timeInterval;
    const order = req.query.sort;
    let dbBack = await Post.find().lean().populate("author", "avatar username introduction", { lean: true });
    if (dbBack.length != 0) {
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
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
      switch (order) {
        case "latest":
          dbBack = sortWith(dbBack, "latest");
          break;
        case "best":
          dbBack = sortWith(dbBack, "best");
          break;
        case "hot":
          dbBack = sortWith(dbBack, "hot");
          break;
        default:
          dbBack = sortWith(dbBack, "likes");
          break;
      }
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.json({ error: error });
  }
}
async function findBySearch(req, res) {
  try {
    const pageNum = req.query.pagenumber;
    const pageSize = req.query.pagesize;
    const timeInterval = req.query.timeInterval;
    const order = req.query.sort;
    let dbBack = await Post.find({
      $or: [
        { title: { $regex: req.query.q, $options: "$i" } },
        { description: { $regex: req.query.q, $options: "$i" } },
      ],
    })
      .lean()
      .populate("author", "avatar username", { lean: true });
    if (dbBack.length != 0) {
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
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
      switch (order) {
        case "latest":
          dbBack = sortWith(dbBack, "latest");
          break;

        default:
          dbBack = sortWith(dbBack, "likes");
          break;
      }
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}
async function updatePost(req, res) {
  try {
    req.body.updateDate = Date.now();
    req.body.edited = true;
    const dbBack = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true });
    if (req.body.tags) {
      const tags = req.body.tags;
      tags.map(async function (tag) {
        const record = await Tags.findOne({ tagName: tag });
        if (!record) {
          await new Tags({ tagName: tag }).save();
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
    const postId = req.params.postId;
    const postLike = await PostLike.findOne({ user: req.user._id, post: postId }, { like: 1 });
    let like = true;
    if (postLike && postLike.like) {
      await Promise.all([
        postTrendingInc(req.params.postId, -2),
        incPostStatistics(postId, "likes", -1),
        userTrendingInc(req.post.author, -2),
        incUserStatistics(req.post.author, "upvotes", -1),
      ]);
      like = false;
      postLike.remove();
      return res.status(200).json({ like });
    }
    await Promise.all([
      postTrendingInc(postId, 2),
      incPostStatistics(postId, "likes", 1),
      userTrendingInc(req.post.author, 2),
      incUserStatistics(req.post.author, "upvotes", 1),
    ]);
    if (postLike) {
      postLike.like = true;
      await incPostStatistics(postId, "dislikes", -1);
      postLike.save();
      return res.status(200).json({ like });
    }
    await new PostLike({ user: req.user._id, post: postId }).save();
    return res.status(200).json({ like });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function dislikePost(req, res) {
  try {
    const postId = req.params.postId;
    const postLike = await PostLike.findOne({ user: req.user._id, post: postId });
    let dislike = true;
    if (postLike && !postLike.like) {
      postLike.remove();
      await incPostStatistics(postId, "dislikes", -1);
      dislike = false;
      return res.status(200).json({ dislike });
    }
    await Promise.all([incPostStatistics(postId, "dislikes", 1), incUserStatistics(req.post.author, "upvotes", -1)]);
    if (postLike) {
      await Promise.all([
        incPostStatistics(postId, "likes", -1),
        postTrendingInc(postId, -2),
        userTrendingInc(req.post.author, -2),
        incUserStatistics(req.post.author, "upvotes", -1),
      ]);
      postLike.like = false;
      postLike.save();
      return res.status(200).json({ dislike });
    }
    await new PostLike({ user: req.user._id, post: postId, like: false }).save();
    return res.status(200).json({ dislike });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}
async function savePost(req, res) {
  try {
    const postId = req.params.postId;
    const dbBack = await SavedPost.findOne({ user: req.user._id, post: postId });
    let saved = true;
    if (dbBack) {
      await Promise.all([
        postTrendingInc(req.params.postId, -4),
        incPostStatistics(postId, "marks", -1),
        userTrendingInc(req.post.author, -3),
      ]);
      saved = false;
      dbBack.remove();
      return res.status(200).json({ saved });
    }
    await Promise.all([
      postTrendingInc(req.params.postId, 4),
      incPostStatistics(postId, "marks", 1),
      userTrendingInc(req.post.author, 3),
      new SavedPost({ user: req.user._id, post: req.params.postId }).save(),
    ]);
    return res.status(200).json({ saved });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function deletePost(req, res) {
  try {
    await Promise.all([
      incUserStatistics(req.user._id, "posts", -1),
      Post.findByIdAndDelete(req.post._id),
      redisTrending.zrem(" PostTrending", req.params.postId),
      PostLike.deleteMany({ post: req.params.postId }),
      SavedPost.deleteMany({ post: req.params.postId }),
    ]);
    const msg = "Delete Successfully";
    return res.status(402).json({ msg });
  } catch (error) {
    res.json({ error: error });
  }
}

async function postTrending(req, res) {
  try {
    const topNumber = req.query.q;
    const dbBack = await getPostTrending(topNumber);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function getAllTags(req, res) {
  try {
    const dbBack = await Tags.find({},{ tagName: 1, _id: 0 }).lean();
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
