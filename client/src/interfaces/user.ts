export interface User {
  avatar: string;
  backgroundCover: string;
  introduction: string;
  username: string;
  statistics: Statistics;
  _id: string;
  __v?: number;
}

interface Statistics {
  comments: number;
  follower: number;
  following: number;
  posts: number;
  upvotes: number;
}

