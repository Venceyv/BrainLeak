import { FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Post } from './Post';
import { getPosts } from '../../../api/postAPI';
import { Loading } from '../../../components/Loading';
import { IntervalItem, MenuItem } from '../../../interfaces/post';

interface PostsProp {
  selectedMenuItem: MenuItem;
  selectedTimeInterval: IntervalItem;
}

export const Posts: FC<PostsProp> = ({ selectedMenuItem, selectedTimeInterval }): JSX.Element => {
  const { data, isLoading } = useQuery(['posts', selectedMenuItem, selectedTimeInterval], () => getPosts(1, 10, selectedMenuItem, selectedTimeInterval));

  if (isLoading) {
    return <Loading width={'full'} height={'full'} />;
  }

  return (
    <>
      <div>
        {data?.map((post, index) => {
          const postProp = {
            title: post.title,
            description: post.description,
            like: post.statistics.likes,
            dislike: post.statistics.dislikes,
            date: post.publishDate,
            _id: post._id,
          };
          return <Post key={index} user={post.author} post={postProp} />;
        })}
      </div>
    </>
  );
};
