export interface TrendingPost {
  popularity: number;
  post: {
    author: {
      avatar: string;
      username: string;
      _id: string;
    };
    title: string;
    description: string;
    _id: string;
  };
}

export interface PostAbstract {
  author: {
    avatar: string;
    username: string;
    _id: string;
  };

  statistics: {
    likes: number;
    dislikes: number;
    views: number;
  };

  title: string;
  description: string;
  publishDate: string;
  _id: string;
}
