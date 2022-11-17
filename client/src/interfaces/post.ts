export interface TrendingPost {
  popularity: number;
  post: {
    author: {
      avatar: string;
      username: string;
      _id: string;
    };
    title: string;
    _id: string;
  };
}
