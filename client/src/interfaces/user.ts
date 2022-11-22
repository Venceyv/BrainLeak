interface Statistics {
  comments: number;
  follower: number;
  following: number;
  posts: number;
  upvotes: number;
}

interface TrendingUserType {
  avatar: string;
  backgroundCover: string;
  followCount: string;
  introduction: string;
  postCount: string;
  username: string;
  _id: string;
}

export interface User {
  avatar: string;
  backgroundCover: string;
  introduction: string;
  username: string;
  statistics: Statistics;
  _id: string;
  __v?: number;
}

export interface TrendingUser {
  popularity: string;
  user: TrendingUserType;
}
