import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { getComments } from '../../../api/commentAPI';
import { IndividualComment } from './IndividualComment';
import TimeAgo from 'react-timeago';
import { Loading } from '../../../components/Loading';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NoMore } from '../../../components/NoMore';

interface CommentsProp {
  postId: string;
}

export const Comments: FC<CommentsProp> = ({ postId }): JSX.Element => {
  // const { data, isLoading, isError } = useQuery(['postComment'], () =>
  //   getComments(postId)
  // );

  const {
    data,
    isSuccess,
    hasNextPage,
    isInitialLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['postComment'],
    ({ pageParam = 1 }) => getComments(postId, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length < 10 ? undefined : allPages.length + 1;
      },
    }
  );

  if (isInitialLoading) {
    return <Loading width={'full'} height={'full'} />;
  }

  if (isFetchingNextPage) {
    console.log('fetching next');
  }

  return (
    <>
      <div className="mt-3">
        <>
          <InfiniteScroll
            dataLength={0}
            next={() => fetchNextPage()}
            hasMore={hasNextPage ? true : false}
            loader={<Loading width={'full'} height={'full'} />}
            endMessage={<NoMore />}
            scrollableTarget="scroll-target-node"
          >
            {isSuccess &&
              data?.pages?.map((comments) => {
                return comments.map((comment, index) => {
                  return <IndividualComment key={index} {...comment} />;
                });
              })}
          </InfiniteScroll>
        </>
      </div>
    </>
  );
};
