import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { getPosts } from '../../api/postAPI';
import { PostAbstractData } from '../../data/Post';
import PostAbstract from '../PostAbstract/PostAbstract';

export const Posts: FC = (): JSX.Element => {
  const postAbstractArr = PostAbstractData;
  const { data, isLoading, isSuccess } = useQuery(['posts'], () => getPosts(1, 5));
  if (isSuccess) {
    console.log('success');
  }

  if (isLoading) {
    console.log('loading');
  }
  return (
    <div>
      {data}
      {postAbstractArr.map(({ user, post }, index) => {
        return <PostAbstract key={index} user={user} post={post} />;
      })}
    </div>
  );
};
