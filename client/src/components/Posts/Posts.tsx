import { FC } from 'react';
import { PostAbstractData } from '../../data/Post';
import PostAbstract from '../PostAbstract/PostAbstract';

export const Posts: FC = (): JSX.Element => {
  const postAbstractArr = PostAbstractData;
  return (
    <div>
      {postAbstractArr.map(({ user, post }, index) => {
        return <PostAbstract key={index} user={user} post={post} />;
      })}
    </div>
  );
};
