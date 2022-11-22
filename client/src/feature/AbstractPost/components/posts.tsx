import { FC, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Post } from './Post';
import { getPosts } from '../../../api/postAPI';
import { Loading } from '../../../components/Loading';
import { IntervalItem, MenuItem } from '../../../interfaces/post';

interface PostsProp {
  selectedMenuItem: MenuItem;
  selectedTimeInterval: IntervalItem;
}

export const Posts: FC<PostsProp> = ({ selectedMenuItem, selectedTimeInterval }): JSX.Element => {
  // const { data, isLoading } = useQuery(['posts', selectedMenuItem, selectedTimeInterval], () => getPosts(1, 10, selectedMenuItem, selectedTimeInterval));

  const { data, isSuccess, hasNextPage, isInitialLoading, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['posts', selectedMenuItem, selectedTimeInterval],
    ({ pageParam = 1 }) => getPosts(pageParam, selectedMenuItem, selectedTimeInterval),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return nextPage;
      },
    }
  );

  if (isInitialLoading) {
    return <Loading width={'full'} height={'full'} />;
  }

  if (isSuccess) {
    console.log(data);
  }

  return (
    <>
      <div>
        <>
          {isSuccess &&
            data?.pages?.map((page) => {
              return page.map((post, index) => {
                const postProp = {
                  title: post?.title,
                  description: post?.description,
                  like: post?.statistics?.likes,
                  dislike: post?.statistics?.dislikes,
                  date: post?.publishDate,
                  _id: post?._id,
                };
                return <Post key={index} user={post.author} post={postProp} />;
              });
            })}
        </>

        <button
          onClick={() => {
            if (hasNextPage) {
              console.log('has next page');
              fetchNextPage();
            }
          }}
        >
          Fetch next
        </button>
      </div>
    </>
  );
};
