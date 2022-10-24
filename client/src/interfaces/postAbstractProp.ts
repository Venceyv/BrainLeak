interface PostAbstractProp {
  user: {
    userName: string;
    profileUrl: string;
  };
  post: {
    title: string;
    description: string;
    likeCount: number;
    dislikeCount: number;
    date: string;
  };
}
