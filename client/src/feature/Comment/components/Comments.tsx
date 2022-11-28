import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { getComments } from '../../../api/commentAPI';
import { IndividualComment } from './IndividualComment';
import TimeAgo from 'react-timeago';
import { Loading } from '../../../components/Loading';
// import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroller';
import { NoMore } from '../../../components/NoMore';

interface CommentsProp {
  postId: string;
}

import { useEffect } from 'react';

export function useTriggerScrollFix(deps: number) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('scroll'));
    }
  }, [deps]);
}

export const Comments: FC<CommentsProp> = ({ postId }): JSX.Element => {
  // const { data, isLoading, isError } = useQuery(['postComment'], () =>
  //   getComments(postId)
  // );
  const [itemSize, setItemSize] = useState(0);
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

  return (
    <>
      <div className="mt-3">
        <InfiniteScroll
          pageStart={0}
          loadMore={() => fetchNextPage()}
          hasMore={hasNextPage ? true : false}
          loader={<Loading width={'full'} height={'full'} />}
          useWindow={false}
        >
          {isSuccess &&
            data?.pages?.map((comments) => {
              return comments.map((comment, index) => {
                return <IndividualComment key={index} {...comment} />;
              });
            })}
        </InfiniteScroll>
      </div>

      {!hasNextPage && <NoMore />}
    </>
  );
};
