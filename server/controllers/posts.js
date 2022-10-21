import { Post, Tags, PostLike, SavedPost } from '../models/index.js';
import {
  getOnePostInfo,
  getRedisPostProfile,
  saveRedisPostProfile,
  postTrendingInc,
  getPostTrending,
  addPostStatistics,
  addCommentsStatistics,
  beautyPostInfo,
  incPostStatistics,
  delRedisPostProfile,
  postFilter,
  beautyPostsInfo,
} from '../services/postServices.js';
import {
  delRedisDislikedPost,
  delRedisLikedPost,
  delRedisSavedPost,
  delRedisUserPost,
  incUserStatistics,
  userTrendingInc,
} from '../services/userServices.js';
import { beautyCommentsInfo } from '../services/commentServices.js';
import json from 'body-parser';
import { redisTrending } from '../configs/redis.js';

async function createPost(req, res) {
  try {
    const dbBack = new Post(req.body);
    await Promise.all([delRedisUserPost(req.user._id), incUserStatistics(req.user._id, 'posts', 1)]);
    const accessToken = req.accessToken;
    dbBack.author = req.user._id;
    dbBack.put = req.query.put === 'true' ? true : false;
    dbBack.tags.map(async function (tag) {
      const record = await Tags.findOne({ tagName: tag });
      if (!record) {
        await new Tags({ tagName: tag }).save();
      }
    });
    dbBack.save();
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.json({ error: error });
  }
}
async function findOne(req, res) {
    try {
        const accessToken = req.accessToken;
        const postId = req.params.postId;
        let dbBack = await getRedisPostProfile(postId);
        if (!dbBack) {
            dbBack = await Post.findById(postId, { put: 0, edited: 0, likes: 0 })
            .lean()
            .populate('author', {
                _id: 1, avatar: 1, username: 1
            }, { lean: true });
            await saveRedisPostProfile(postId, dbBack);
        }
        const [postStatistics,] = await Promise.all([
            addPostStatistics(dbBack),
            postTrendingInc(req.params.postId, 1),
            incPostStatistics(postId, 'views', 1),
            userTrendingInc(req.post.author, 1)
        ])
        dbBack = postStatistics;
        if (req.user) {
            const beautifulPost = await beautyPostInfo(dbBack, req.user._id);
            dbBack = beautifulPost;
        }
        return res.status(200).json({ dbBack, accessToken });
    }
    switch (order) {
      case 'latest':
        dbBack.commentUnderPost.sort((a, b) => {
          return new Date(b.createTime) - new Date(a.createTime);
        });
        break;
      default:
        dbBack.commentUnderPost.sort((a, b) => {
          return b.statistics.likes - a.statistics.likes;
        });
        break;
    }
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.json({ error: error });
  }
}

async function findByTags(req, res) {
  try {
    const tags = req.query.tags.split(' ');
    const pageNum = req.query.pagenumber;
    const pageSize = req.query.pagesize;
    const accessToken = req.accessToken;
    const timeInterval = req.query.timeInterval;
    const order = req.query.sort;
    let dbBack = await Post.find({ tags: { $in: tags } })
      .lean()
      .populate('author', 'avatar username follower upVoteGet');
    if (dbBack.length === 0) {
      if (tags.length === 1) {
        await Tags.findOneAndDelete({ tagName: tags });
      }
      return res.status(200).json({ dbBack, accessToken });
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
    dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
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
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.json({ error: error });
  }
}
async function findAll(req, res) {
  try {
    const pageNum = req.query.pagenumber;
    const pageSize = req.query.pagesize;
    const accessToken = req.accessToken;
    const timeInterval = req.query.timeInterval;
    const order = req.query.sort;
    let dbBack = await Post.find().lean().populate('author', 'avatar username introduction', { lean: true });
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
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      switch (order) {
        case 'latest':
          dbBack.sort((a, b) => {
            return new Date(b.publishDate) - new Date(a.publishDate);
          });
          break;
        case 'best':
          dbBack.sort((a, b) => {
            if (b.statistics.likes - b.statistics.dislikes > a.statistics.likes - a.statistics.dislikes) {
              return 1;
            }
            return -1;
          });
          break;
        case 'hot':
          dbBack.sort((a, b) => {
            //pubulished til now --minutes
            const aCreateTime = (Date.now() - new Date(a.publishDate)) / 1000 / 60;
            //pubulished til now --minutes
            const bCreateTime = (Date.now() - new Date(b.publishDate)) / 1000 / 60;
            const aHot = Math.round(a.statistics.likes / aCreateTime);
            const bHot = Math.round(b.statistics.likes / bCreateTime);
            if (aHot > bHot) {
              return -1;
            }
            return 1;
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
    return res.json({ error: error });
  }
}
async function findBySearch(req, res) {
  try {
    const accessToken = req.accessToken;
    const pageNum = req.query.pagenumber;
    const pageSize = req.query.pagesize;
    const timeInterval = req.query.timeInterval;
    const order = req.query.sort;
    let dbBack = await Post.find({
      $or: [{ title: { $regex: req.query.q, $options: '$i' } }, { description: { $regex: req.query.q, $options: '$i' } }],
    })
      .lean()
      .populate('author', 'avatar username', { lean: true });
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
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
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
    res.json({ error: error });
  }
}
async function updatePost(req, res) {
  try {
    const accessToken = req.accessToken;
    req.body.updateDate = Date.now();
    req.body.edited = true;
    const [dbBack] = await Promise.all([
      Post.findByIdAndUpdate(req.params.postId, req.body, { new: true }),
      delRedisPostProfile(req.params.postId),
      delRedisUserPost(req.user._id),
    ]);
    if (req.body.tags) {
      const tags = req.body.tags;
      tags.map(async function (tag) {
        const record = await Tags.findOne({ tagName: tag });
        if (!record) {
          await new Tags({ tagName: tag }).save();
        }
      });
    }
    return res.json({ dbBack, accessToken });
  } catch (error) {
    res.json({ error: error });
  }
}
async function likePost(req, res) {
  try {
    const accessToken = req.accessToken;
    const postId = req.params.postId;
    const postLike = await PostLike.findOne({ user: req.user._id, post: postId }, { like: 1 });
    let like = true;
    if (postLike && postLike.like) {
      await Promise.all([
        postTrendingInc(req.params.postId, -2),
        incPostStatistics(postId, 'likes', -1),
        delRedisLikedPost(req.user._id),
        userTrendingInc(req.post.author, -2),
        incUserStatistics(req.post.author, 'upvotes', -1),
      ]);
      like = false;
      postLike.remove();
      return res.status(200).json({ like, accessToken });
    }
    await Promise.all([
      postTrendingInc(postId, 2),
      incPostStatistics(postId, 'likes', 1),
      delRedisLikedPost(req.user._id),
      userTrendingInc(req.post.author, 2),
      incUserStatistics(req.post.author, 'upvotes', 1),
    ]);
    if (postLike) {
      postLike.like = true;
      await Promise.all([incPostStatistics(postId, 'dislikes', -1), delRedisDislikedPost(req.user._id)]);
      postLike.save();
      return res.status(200).json({ like, accessToken });
    }
    await new PostLike({ user: req.user._id, post: postId }).save();
    return res.status(200).json({ like, accessToken });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function dislikePost(req, res) {
  try {
    const accessToken = req.accessToken;
    const postId = req.params.postId;
    const postLike = await PostLike.findOne({ user: req.user._id, post: postId });
    let dislike = true;
    if (postLike && !postLike.like) {
      postLike.remove();
      await Promise.all([delRedisDislikedPost(req.user._id), incPostStatistics(postId, 'dislikes', -1)]);
      dislike = false;
      return res.status(200).json({ dislike, accessToken });
    }
    await Promise.all([
      delRedisDislikedPost(req.user._id),
      incPostStatistics(postId, 'dislikes', 1),
      incUserStatistics(req.post.author, 'upvotes', -1),
    ]);
    if (postLike) {
      await Promise.all([
        incPostStatistics(postId, 'likes', -1),
        delRedisLikedPost(req.user._id),
        postTrendingInc(postId, -2),
        userTrendingInc(req.post.author, -2),
        incUserStatistics(req.post.author, 'upvotes', -1),
      ]);
      postLike.like = false;
      postLike.save();
      return res.status(200).json({ dislike, accessToken });
    }
    await new PostLike({ user: req.user._id, post: postId, like: false }).save();
    return res.status(200).json({ dislike, accessToken });
  } catch (error) {
    return res.status(401).json({ error: error });
  }
}
async function savePost(req, res) {
  try {
    const accessToken = req.accessToken;
    const postId = req.params.postId;
    const dbBack = await SavedPost.findOne({ user: req.user._id, post: postId });
    let saved = true;
    if (dbBack) {
      await Promise.all([
        postTrendingInc(req.params.postId, -4),
        incPostStatistics(postId, 'marks', -1),
        delRedisSavedPost(req.user._id),
        userTrendingInc(req.post.author, -3),
      ]);
      saved = false;
      dbBack.remove();
      return res.status(200).json({ saved, accessToken });
    }
    await Promise.all([
      postTrendingInc(req.params.postId, 4),
      incPostStatistics(postId, 'marks', 1),
      userTrendingInc(req.post.author, 3),
      delRedisSavedPost(req.user._id),
      new SavedPost({ user: req.user._id, post: req.params.postId }).save(),
    ]);
    return res.status(200).json({ saved, accessToken });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function deletePost(req, res) {
  try {
    await Promise.all([
      incUserStatistics(req.user._id, 'posts', -1),
      Post.findByIdAndDelete(req.post._id),
      redisTrending.zrem(' PostTrending', req.params.postId),
      delRedisUserPost(req.user._id),
      PostLike.deleteMany({ post: req.params.postId }),
      SavedPost.deleteMany({ post: req.params.postId }),
    ]);
    const accessToken = res.accessToken;
    const msg = 'Delete Successfully';
    return res.status(402).json({ msg, accessToken });
  } catch (error) {
    res.json({ error: error });
  }
}

async function postTrending(req, res) {
  try {
    const accessToken = req.accessToken;
    const topNumber = req.query.q;
    const dbBack = await getPostTrending(topNumber);
    res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
export { createPost, findOne, findByTags, findAll, findBySearch, updatePost, deletePost, likePost, dislikePost, savePost, postTrending };
