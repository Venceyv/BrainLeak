import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { getPosts } from '../api/postAPI';
import { PostAbstractData } from '../data/Post';
import PostAbstract from './PostAbstract';

export const Posts: FC = (): JSX.Element => {
  const postAbstractArr = PostAbstractData;
  // const { data, isLoading } = useQuery(['posts'], () => getPosts(1, 5));

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  return (
    <div className="w-full h-full overflow-auto">
      {postAbstractArr.map(({ user, post }, index) => {
        return <PostAbstract key={index} user={user} post={post} />;
      })}
    </div>
  );
};
