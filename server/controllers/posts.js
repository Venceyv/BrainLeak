import { Post, Tags, PostLike, SavedPost, CommentLike, User } from "../models/index.js";
import {
  postTrendingInc,
  getPostTrending,
  addPostStatistics,
  beautyPostInfo,
  incPostStatistics,
  postFilter,
  beautyPostsInfo,
  addPostsStatistics,
  updatePostStats,
} from "../services/postServices.js";
import { incUserNotification, incUserStatistics, userTrendingInc } from "../services/userServices.js";

import { redisTrending } from "../configs/redis.js";
import { sortWith } from "../services/arraySorter.js";
import { regexFilter } from "../services/regexFilter.js";
import { addCommentUserInfo, getPinnedComment } from "../services/commentServices.js";
import { clearB64 } from "../services/upload64File.js";

async function createPost(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    let dbBack = new Post(req.body);
    const userId = req.user._id;
    await incUserStatistics(req.user._id, "posts", 1);
    dbBack.author = userId;
    dbBack.notify = req.query.notify === "true";
    dbBack = clearB64(dbBack, "post");
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
    let dbBack = req.post;
    let postAuthor, pinnedComment;
    [dbBack, postAuthor, pinnedComment] = await Promise.all([
      addPostStatistics(dbBack),
      User.findById(dbBack.author, { avatar: 1, username: 1 }).lean(),
      getPinnedComment(dbBack),
      postTrendingInc(req.params.postId, 1),
      incPostStatistics(postId, "views", 1),
      userTrendingInc(req.post.author, 1),
    ]);
    dbBack.author = postAuthor;
    dbBack.pinnedComment = pinnedComment;
    if (req.user) {
      if (pinnedComment) {
        let commentLikedList;
        [dbBack, commentLikedList] = await Promise.all([
          beautyPostInfo(dbBack, req.user._id),
          CommentLike.find({ user: req.user._id }, { comment: 1, like: 1, _id: 0 }).lean(),
        ]);
        dbBack.pinnedComment = addCommentUserInfo(pinnedComment, commentLikedList);
      } else dbBack = await beautyPostInfo(dbBack, req.user._id);
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
      .populate("author", "avatar username");
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
    let tags = req.query.tags;
    let dbBack;
    if (tags) {
      tags = tags.split("&");
      dbBack = await Post.find({ tags: { $in: tags } },{notify:0})
        .lean()
        .populate("author", "avatar username", { lean: true });
    } else {
      dbBack = await Post.find({}, { notify: 0 }).lean().populate("author", "avatar username", { lean: true });
    }

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
    const imgReg = /<img.*?(?:>|\/>)/gi;
    const images = req.body.description.match(imgReg);
    req.body.updateDate = Date.now();
    req.body.edited = true;
    if (images) {
      req.body.cover = images[0];
    }
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
    const [postLike, author] = await Promise.all([
      PostLike.findOne({ user: req.user._id, post: postId }, { like: 1 }),
      User.findById(req.post.author, { avatar: 1, username: 1 }).lean(),
    ]);
    let like = true;
    let dbBack, post;
    if (postLike && postLike.like) {
      await updatePostStats(req.post, -1, -2, -1);
      like = false;
      postLike.remove();
    } else {
      await Promise.all([updatePostStats(req.post, 1, 2, 1), incUserNotification(req.post.author, "likes", 1)]);
      if (postLike) {
        postLike.like = true;
        await incPostStatistics(postId, "dislikes", -1);
        postLike.save();
      } else {
        new PostLike({ user: req.user._id, post: postId, postAuthor: req.post.author }).save();
      }
    }
    post = await addPostStatistics(req.post);
    post.author = author;
    dbBack = { ...post, like };
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function dislikePost(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const postId = req.params.postId;
    const [postLike, author] = await Promise.all([
      PostLike.findOne({ user: req.user._id, post: postId }, { like: 1 }),
      User.findById(req.post.author, { avatar: 1, username: 1 }).lean(),
    ]);
    let dislike = true;
    let dbBack;
    if (postLike && !postLike.like) {
      postLike.remove();
      await incPostStatistics(postId, "dislikes", -1);
      dislike = false;
    } else {
      await incPostStatistics(postId, "dislikes", 1);
      if (postLike) {
        await updatePostStats(req.post, -1, -2, -1);
        postLike.like = false;
        postLike.save();
      } else {
        new PostLike({ user: req.user._id, post: postId, postAuthor: req.post.author, like: false }).save();
      }
    }
    const post = await addPostStatistics(req.post);
    post.author = author;
    dbBack = { ...post, dislike };
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}
async function savePost(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const postId = req.params.postId;
    const [postSave, author] = await Promise.all([
      SavedPost.findOne({ user: req.user._id, post: postId }),
      User.findById(req.post.author, { avatar: 1, username: 1 }).lean(),
    ]);
    let saved = true;
    let dbBack, post;
    if (postSave) {
      await updatePostStats(req.post, 0, -4, 0, -1);
      saved = false;
      postSave.remove();
    } else {
      await Promise.all([updatePostStats(req.post, 0, 4, 0, 1), incUserNotification(req.post.author, "marks", 1)]);
      new SavedPost({ user: req.user._id, post: postId, postAuthor: req.post.author }).save();
    }
    post = await addPostStatistics(req.post);
    post.author = author;
    dbBack = { ...post, saved };
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function deletePost(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const postId = req.params.postId;
    await Promise.all([
      incUserStatistics(req.user._id, "posts", -1),
      Post.findByIdAndDelete(req.post._id),
      PostLike.deleteMany({ post: postId }),
      SavedPost.deleteMany({ post: postId }),
    ]);
    redisTrending.zrem(" PostTrending", postId);
    const msg = "Delete Successfully";
    return res.status(200).json({ msg });
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
