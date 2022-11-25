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
