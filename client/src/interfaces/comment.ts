import { Author } from './user';

export interface ReplyStatistics {
  dislikes: number;
  likes: number;
}

export interface PostStatistics extends ReplyStatistics {
  replies: number;
}

export interface PostComment {
  author: Author;
  content: string;
  edited: false;
  postAuthor: string;
  publishDate: string;
  relatedPost: string;

  statistics: PostStatistics;
  updateDate: string;
  _v?: number;
  _id: string;
}

export interface CommentReply {
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
