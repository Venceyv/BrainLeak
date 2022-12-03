import { Author } from './user';

interface userInteractionStats {
  like?: boolean;
  dislike?: boolean;
  save?: boolean;
}

export interface ReplyStatistics {
  dislikes: number;
  likes: number;
}

export interface PostStatistics extends ReplyStatistics {
  replies: number;
}

export interface PostComment extends userInteractionStats {
  author: Author;
  content: string;
  edited: false;
  postAuthor: string;
  publishDate: string;
  relatedPost: string;
  pinned: boolean;

  statistics: PostStatistics;
  updateDate: string;
  _v?: number;
  _id: string;
}

export interface CommentReply extends userInteractionStats {
  author: Author;
  mentionedUser: Author;
  content: string;

  postAuthor: string;
  publishDate: string;
  relatedPost: string;
  relatedComment: string;
  statistics: ReplyStatistics;

  _v?: number;
  _id: string;
}
