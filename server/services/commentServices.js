import schedule from "node-schedule";
import { redisComments } from "../configs/redis.js";
import { Post, Comment, CommentLike, User } from "../models/index.js";
import { incUserStatistics, userTrendingInc } from "./userServices.js";
function clearCommentByTime(time) {
  schedule.scheduleJob(
    time,
    async function (Comment) {
      try {
        const commentList = await Comment.find().lean();
        let relatedPost;
        await Promise.all(
          commentList.map(async function (comment) {
            if(comment.relatedPost.equals(relatedPost)){
              return;
            }
            const record = await Post.findById(comment.relatedPost, { _id: 1 }).lean();
            if (!record) {
              Comment.deleteMany({relatedPost:comment.relatedPost});
              relatedPost = comment.relatedPost;
            }
          })
        );
      } catch (error) {
        console.log("clearCommentByTimeFailed -- Cservices 5");
      }
    }.bind(null, Comment)
  );
}
async function incCommentStatistics(commentId, field, incNum) {
  try {
    const key = JSON.stringify(commentId) + " Statistics";
    const result = await redisComments.hincrby(key, field, incNum);
    if (result < 0) {
      redisComments.hset(key, field, 0);
    }
  } catch (error) {
    console.log("incCommentStatistics Failed -- Cservices 20");
  }
}
async function addCommentStatistics(comment) {
  try {
    if (comment) {
      const commentId = JSON.stringify(comment._id) + " Statistics";
      const pipeline = redisComments.pipeline();
      pipeline.hget(commentId, "likes");
      pipeline.hget(commentId, "dislikes");
      pipeline.hget(commentId, "replies");
      const results = await pipeline.exec();
      const likes = results[0][1] === null ? 0 : Number(results[0][1]);
      const dislikes = results[1][1] === null ? 0 : Number(results[1][1]);
      const replies = results[2][1] === null ? 0 : Number(results[2][1]);
      const statistics = { likes, dislikes, replies };
      comment = { ...comment, statistics };
    }
    return comment;
  } catch (error) {
    console.log("addCommentStatistics Failed -- Cservices 31");
  }
}
function addCommentUserInfo(comment, likeList) {
  try {
    if (comment) {
      const like = likeList.filter((e) => e.comment.equals(comment._id) && e.like).length > 0;
      const dislike = likeList.filter((e) => e.comment.equals(comment._id) && !e.like).length > 0;
      comment = { ...comment, like, dislike };
    }
    return comment;
  } catch (error) {
    console.log("addCommentUserInfo Failed -- Cservices 48");
  }
}

async function addCommentsStatistics(commentList) {
  try {
    commentList = await Promise.all(
      commentList.map(async (comment) => {
        comment = await addCommentStatistics(comment);
        return comment;
      })
    );
    return commentList;
  } catch (error) {
    console.log("addCommentsStatistics Failed -- Cservices 66");
  }
}
async function getCommentsUderPost(commentId) {
  try {
    let commentUnderPost = await getRedisCommentProfile(commentId);
    if (!commentUnderPost) {
      commentUnderPost = await Comment.find({ relatedPost: commentId })
        .lean()
        .populate("author", { username: 1, avatar: 1 }, { lean: true });
      if (commentUnderPost.length != 0) {
        saveRedisCommentProfile(commentId, commentUnderPost);
      }
    }
    return commentUnderPost;
  } catch (error) {
    console.log("getCommentsUderPost Failed -- Cservices 78");
  }
}

function saveRedisCommentProfile(commentId, profile) {
  try {
    const key = JSON.stringify(commentId) + " Profile";
    profile = JSON.stringify(profile);
    redisComments.setex(key, 3, profile);
  } catch (error) {
    console.log("saveRedisCommentProfile Faild --Cservices 104");
  }
}
async function getRedisCommentProfile(commentId) {
  try {
    const key = JSON.stringify(commentId) + " Profile";
    let profile = await redisComments.get(key);
    if (!profile) {
      return null;
    }
    profile = JSON.parse(profile);
    return profile;
  } catch (error) {
    console.log("getRedisCommentProfile Faild --Cservices 113");
  }
}

async function beautyCommentsInfo(comments, userId) {
  try {
    const commentLikeList = await CommentLike.find({ user: userId }, { comment: 1, like: 1, _id: 0 }).lean();
    comments.forEach((comment, index) => {
      comments[index] = addCommentUserInfo(comment, commentLikeList);
    });
    return comments;
  } catch (error) {
    console.log("beautyCommentsInfo Failed -- Cservices 127");
  }
}
async function updateCommentStats(comment, likes = 0, trending = 0, upvotes = 0) {
  const commentId = comment._id;
  await Promise.all([
    incCommentStatistics(commentId, "likes", likes),
    userTrendingInc(comment.author, trending),
    incUserStatistics(comment.author, "upvotes", upvotes),
  ]);
}
function saveRedisPinComment(postId, profile) {
  try {
    const key = JSON.stringify(postId) + " Pin";
    profile = JSON.stringify(profile);
    redisComments.setex(key, 86400, profile);
  } catch (error) {
    console.log("saveRedisPinComment Faild --Cservices 141");
  }
}
async function getRedisPinComment(postId) {
  try {
    const key = JSON.stringify(postId) + " Pin";
    let profile = await redisComments.get(key);
    if (!profile) {
      return null;
    }
    profile = JSON.parse(profile);
    return profile;
  } catch (error) {
    console.log("getRedisPinComment Faild --Cservices 150");
  }
}
async function delRedisPinComment(postId) {
  try {
    const key = JSON.stringify(postId) + " Pin";
    await redisComments.del(key);

  } catch (error) {
    console.log("delRedisPinComment Faild --Cservices 163");
  }
}

async function getPinnedComment(post) {
  let pinnedComment = await getRedisPinComment(post._id);
  if(!pinnedComment){
    pinnedComment = await Comment.findById(post.pinnedComment, { content: 1, author: 1, pinned: 1 }).lean();
  }
  if (pinnedComment) {
    let pinnedCommentAuthor;
    [pinnedComment, pinnedCommentAuthor] = await Promise.all([
      addCommentStatistics(pinnedComment),
      User.findById(pinnedComment.author, { avatar: 1, username: 1 }).lean(),
    ]);
    pinnedComment.author = pinnedCommentAuthor;
    saveRedisPinComment(post._id,pinnedComment);
  }
  return pinnedComment;
}
export {
  clearCommentByTime,
  addCommentStatistics,
  addCommentUserInfo,
  addCommentsStatistics,
  getCommentsUderPost,
  incCommentStatistics,
  beautyCommentsInfo,
  updateCommentStats,
  getPinnedComment,
  saveRedisPinComment,
  delRedisPinComment
};
