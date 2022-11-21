export type MenuItem = 'top' | 'new' | 'hot' | null;
export type IntervalItem = 'today' | 'week' | 'month' | 'year' | 'allTime' | null;

export interface Author {
  avatar: string;
  username: string;
  _id: string;
}

export interface Statistic {
  likes: number;
  dislikes: number;
  views: number;
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

export interface Post {
  author: Author;
  statistics: Statistic;

  tags: string[];
  edited: boolean;
  put: boolean;
  title: string;
  description: string;
  publishDate: string;
  updateDate: string;
  _v?: number;
  _id: string;
}
