import { CommentReply, PostComment } from './comment';
import { Author } from './user';

export type MenuItem = 'top' | 'new' | 'hot' | null;
export type IntervalItem =
  | 'today'
  | 'week'
  | 'month'
  | 'year'
  | 'allTime'
  | null;
export type CommentSortByType = 'lastest' | 'likes';

export interface Statistic {
  likes: number;
  dislikes: number;
  views: number;
  comments: number;
}

export interface StatisticWithMark {
  likes: number;
  dislikes: number;
  views: number;
  comments: number;
  marks: number;
}

export interface TrendingPost {
  popularity: number;
  post: {
    author: Author;
    title: string;
    description: string;
    _id: string;
  };
}

export interface Post<T> {
  author: Author;
  statistics: T;
  cover?: string;
  tags: string[];
  edited: boolean;
  put: boolean;
  title: string;
  pinnedComment: PostComment | CommentReply | null;
  description: string;
  publishDate: string;
  updateDate: string;
  like?: boolean;
  dislike?: boolean;
  save?: boolean;
  _v?: number;
  _id: string;
}

export interface PostSearchResult extends Post<StatisticWithMark> {
  save: boolean;
  like: boolean;
  dislike: boolean;
}
