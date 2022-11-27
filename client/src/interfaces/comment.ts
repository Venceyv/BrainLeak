import { Author } from './user';

export interface PostStatistics {
  dislikes: number;
  likes: number;
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
