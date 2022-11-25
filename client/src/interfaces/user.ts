interface Statistics {
  comments: number;
  follower: number;
  following: number;
  posts: number;
  upvotes: number;
}

export interface UserStatistics {
  comments: number;
  follower: number;
  following: number;
  posts: number;
  upvotes: number;
}

interface TrendingUserType {
  avatar: string;
  backgroundCover: string;
  followerCount: number;
  introduction: string;
  postCount: number;
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
